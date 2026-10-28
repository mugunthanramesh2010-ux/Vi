// server/src/services/accounts.js
// Local file-based authenticated accounts repository.
// Enforces PBKDF2 salt-hashed passwords, role separation, and offline password recovery.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, hashToken, generateSecureToken } from '../utils/hashing.js';

const ACCOUNTS_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Accounts');
const ACCOUNTS_FILE = path.join(ACCOUNTS_DIR, 'users.json');

class AccountService {
  constructor() {
    this.ensureDir();
    this.accounts = this.loadAccounts();
    this.initDefaultFaculty();
  }

  ensureDir() {
    if (!fs.existsSync(ACCOUNTS_DIR)) {
      fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
    }
  }

  loadAccounts() {
    this.ensureDir();
    if (fs.existsSync(ACCOUNTS_FILE)) {
      try {
        const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load accounts.json, initializing empty:', e);
      }
    }
    return {};
  }

  saveAccounts() {
    this.ensureDir();
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(this.accounts, null, 2), 'utf-8');
  }

  initDefaultFaculty() {
    let changed = false;
    // Seed default offline faculty account if not exists
    if (!this.accounts['faculty']) {
      this.accounts['faculty'] = {
        username: 'faculty',
        name: 'Lead Faculty Examiner',
        role: 'faculty',
        department: 'Biotechnology',
        passwordHash: hashPassword('faculty123'),
        assignedSubjects: ['Biotechnology', 'Bioreactor Design', 'Control Systems', 'Digital Electronics', 'Universal Domain'],
        createdAt: new Date().toISOString()
      };
      changed = true;
    }

    // Seed default student accounts in distinct sections for deterministic testing
    if (!this.accounts['student_a']) {
      this.accounts['student_a'] = {
        username: 'student_a',
        name: 'Aravind Swaminathan (Sec A)',
        role: 'student',
        department: 'Biotechnology',
        year: 'III',
        section: 'A',
        semester: '5',
        regNo: 'BIO2026A01',
        passwordHash: hashPassword('student123'),
        assignedSubjects: ['Biotechnology', 'Bioreactor Design'],
        createdAt: new Date().toISOString()
      };
      changed = true;
    }

    if (!this.accounts['student_b']) {
      this.accounts['student_b'] = {
        username: 'student_b',
        name: 'Bhavana Ramesh (Sec B)',
        role: 'student',
        department: 'Biotechnology',
        year: 'III',
        section: 'B',
        semester: '5',
        regNo: 'BIO2026B01',
        passwordHash: hashPassword('student123'),
        assignedSubjects: ['Biotechnology', 'Bioreactor Design'],
        createdAt: new Date().toISOString()
      };
      changed = true;
    }

    if (changed) {
      this.saveAccounts();
    }
  }

  /**
   * Register a new user
   */
  register(userData) {
    const username = String(userData.username || '').trim().toLowerCase();
    const role = userData.role === 'faculty' ? 'faculty' : 'student';

    if (!username || username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (this.accounts[username]) {
      return { success: false, error: 'An account with this username already exists.' };
    }

    const newAccount = {
      username,
      name: userData.name || (role === 'faculty' ? 'Faculty Member' : 'Student'),
      role,
      department: userData.department || 'Engineering',
      year: userData.year || userData.classYear || 'III',
      section: userData.section || 'A',
      semester: userData.semester || '5',
      programme: userData.programme || userData.department || 'Engineering',
      regNo: userData.regNo || (role === 'student' ? username.toUpperCase() : null),
      passwordHash: hashPassword(userData.password),
      assignedSubjects: userData.assignedSubjects || ['Universal Domain'],
      createdAt: new Date().toISOString()
    };

    this.accounts[username] = newAccount;
    this.saveAccounts();

    return {
      success: true,
      user: {
        username: newAccount.username,
        name: newAccount.name,
        role: newAccount.role,
        department: newAccount.department,
        year: newAccount.year,
        section: newAccount.section,
        semester: newAccount.semester,
        programme: newAccount.programme,
        regNo: newAccount.regNo
      }
    };
  }

  /**
   * Authenticate user credentials
   */
  authenticate(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];

    if (!account) {
      return { success: false, error: 'Invalid credentials.' };
    }

    const isValid = verifyPassword(password, account.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials.' };
    }

    return {
      success: true,
      user: {
        username: account.username,
        name: account.name,
        role: account.role,
        department: account.department,
        year: account.year || 'III',
        section: account.section || 'A',
        semester: account.semester || '5',
        programme: account.programme || account.department || 'Engineering',
        regNo: account.regNo,
        assignedSubjects: account.assignedSubjects || []
      }
    };
  }

  /**
   * Generate an offline one-time recovery token for account
   */
  generateRecoveryToken(username) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];
    if (!account) {
      // Return ambiguous message to avoid account enumeration
      return { success: true, message: 'If the account exists, an authorization token has been generated.' };
    }

    const rawToken = generateSecureToken(16);
    account.recoveryTokenHash = hashToken(rawToken);
    account.recoveryTokenExpires = Date.now() + (15 * 60 * 1000); // 15 minutes validity
    this.saveAccounts();

    return {
      success: true,
      recoveryToken: rawToken, // Displayed to administrator / faculty for offline recovery
      expiresInMinutes: 15
    };
  }

  /**
   * Reset password using offline recovery token
   */
  resetPasswordWithToken(username, token, newPassword) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const account = this.accounts[cleanUser];

    if (!account || !account.recoveryTokenHash) {
      return { success: false, error: 'Invalid or expired recovery authorization.' };
    }

    if (Date.now() > (account.recoveryTokenExpires || 0)) {
      account.recoveryTokenHash = null;
      this.saveAccounts();
      return { success: false, error: 'Recovery token has expired. Request a new one.' };
    }

    const incomingHash = hashToken(token);
    if (incomingHash !== account.recoveryTokenHash) {
      return { success: false, error: 'Invalid recovery token.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // Set new password and invalidate recovery token
    account.passwordHash = hashPassword(newPassword);
    account.recoveryTokenHash = null;
    account.recoveryTokenExpires = null;
    this.saveAccounts();

    return { success: true, message: 'Password has been reset successfully.' };
  }

  getAccount(username) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const acc = this.accounts[cleanUser];
    if (!acc) return null;
    return {
      username: acc.username,
      name: acc.name,
      role: acc.role,
      department: acc.department,
      year: acc.year || 'III',
      section: acc.section || 'A',
      semester: acc.semester || '5',
      programme: acc.programme || acc.department || 'Engineering',
      regNo: acc.regNo,
      assignedSubjects: acc.assignedSubjects || []
    };
  }

  /**
   * Look up students belonging to a target class year and sections
   */
  getStudentsByCohort(classYear, sections = [], department = null) {
    const secList = Array.isArray(sections) ? sections : [sections];
    return Object.values(this.accounts)
      .filter(acc => acc.role === 'student')
      .filter(acc => {
        const yearMatches = !classYear || acc.year === classYear;
        const secMatches = secList.length === 0 || secList.includes(acc.section);
        const deptMatches = !department || department === 'All Departments' || acc.department === department;
        return yearMatches && secMatches && deptMatches;
      })
      .map(acc => ({
        username: acc.username,
        name: acc.name,
        regNo: acc.regNo || acc.username.toUpperCase(),
        department: acc.department,
        year: acc.year,
        section: acc.section
      }));
  }
}

export const accountService = new AccountService();
