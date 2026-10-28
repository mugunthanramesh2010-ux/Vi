// server/src/services/assessmentManager.js
// Authoritative Server-Side Assessment, Cohort Assignment, Multi-Device Session, and Live Monitoring Engine.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';
import { GenerateAcademicQuestionPackage, ValidateQuestion } from '../../../src/services/academicAssessmentEngine.js';
import { accountService } from './accounts.js';
import { referenceRetriever } from '../ai/referenceRetriever.js';

const ASSESSMENTS_DIR = path.resolve(process.cwd(), 'Viva_Records', 'Assessments');
const ASSESSMENTS_FILE = path.join(ASSESSMENTS_DIR, 'assessments.json');
const ATTEMPTS_FILE = path.join(ASSESSMENTS_DIR, 'attempts.json');

export class AssessmentManager {
  constructor() {
    this.ensureDir();
    this.assessments = this.loadAssessments();
    this.attempts = this.loadAttempts();
  }

  ensureDir() {
    if (!fs.existsSync(ASSESSMENTS_DIR)) {
      fs.mkdirSync(ASSESSMENTS_DIR, { recursive: true });
    }
  }

  loadAssessments() {
    this.ensureDir();
    if (fs.existsSync(ASSESSMENTS_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(ASSESSMENTS_FILE, 'utf-8'));
      } catch (e) {
        console.error('Failed to parse assessments.json, initializing empty:', e);
      }
    }
    return {};
  }

  saveAssessments() {
    this.ensureDir();
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(this.assessments, null, 2), 'utf-8');
  }

  loadAttempts() {
    this.ensureDir();
    if (fs.existsSync(ATTEMPTS_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(ATTEMPTS_FILE, 'utf-8'));
      } catch (e) {
        console.error('Failed to parse attempts.json, initializing empty:', e);
      }
    }
    return {};
  }

  saveAttempts() {
    this.ensureDir();
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(this.attempts, null, 2), 'utf-8');
  }

  // --------------------------------------------------------------------------
  // 1. STAFF VIVA CREATOR & LIFE-CYCLE MANAGEMENT
  // --------------------------------------------------------------------------

  /**
   * Create and publish/schedule a new assessment with full cohort assignment rules.
   */
  async createAssessment(data, facultyUser) {
    const title = String(data.title || data.assignmentName || '').trim();
    const subject = String(data.subject || '').trim();
    const topic = String(data.topic || '').trim();

    if (!title || !subject || !topic) {
      throw new Error('Title, subject, and topic are mandatory to create an assessment.');
    }

    const classYear = String(data.classYear || data.targetYear || 'III').trim();
    // Normalize target sections to array
    let targetSections = [];
    if (Array.isArray(data.targetSections) && data.targetSections.length > 0) {
      targetSections = data.targetSections.map(s => String(s).trim().toUpperCase());
    } else if (data.targetSection) {
      targetSections = [String(data.targetSection).trim().toUpperCase()];
    } else {
      targetSections = ['A']; // Default to Section A to prevent accidental institution-wide assignment
    }

    const department = String(data.department || data.targetDepartment || facultyUser?.department || (subject.toLowerCase().includes('electrical') ? 'Electrical and Electronics Engineering' : subject.toLowerCase().includes('communication') ? 'Electronics and Communication Engineering' : subject.toLowerCase().includes('computer') ? 'Computer Science and Engineering' : subject.toLowerCase().includes('mechanical') ? 'Mechanical Engineering' : subject.toLowerCase().includes('civil') ? 'Civil Engineering' : subject.toLowerCase().includes('biotech') ? 'Biotechnology Engineering' : 'General Engineering')).trim();
    const semester = String(data.semester || '5').trim();
    const academicYear = String(data.academicYear || '2026-2027').trim();
    const durationMinutes = Math.max(1, parseInt(data.durationMinutes || data.deadlineMinutes || 15, 10));
    const totalMarks = Math.max(10, parseInt(data.totalMarks || 100, 10));
    const questionCount = Math.max(1, Math.min(100, parseInt(data.questionCount || 10, 10)));
    const allowProgressiveHints = data.allowProgressiveHints !== false;
    const answerDisclosurePolicy = data.answerDisclosurePolicy || 'after_submission'; // 'never' | 'after_submission' | 'after_close'
    const status = data.status || 'published'; // 'draft' | 'scheduled' | 'published' | 'closed'

    // Document grounding: check if uploaded documents / references are provided
    let docContext = data.documentContext || '';
    if (!docContext && data.documentId) {
      const retrieval = referenceRetriever.retrievePassages(facultyUser?.username, data.subjectId || subject, topic, 3);
      if (retrieval.found) {
        docContext = retrieval.passages.map(p => `[${p.sourceFile}] ${p.text}`).join('\n\n');
      }
    }

    // Question package: validate provided questions or generate and validate dynamically
    let questions = [];
    if (Array.isArray(data.questions) && data.questions.length > 0) {
      questions = data.questions.map(q => {
        const val = ValidateQuestion(q, topic);
        if (!val.valid) {
          throw new Error(`Question validation failed: ${(val.errors || val.reasons || []).join(', ')}`);
        }
        return {
          id: q.id || `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          topic,
          subject,
          type: q.type || 'mcq',
          questionText: q.questionText,
          options: q.options || [],
          correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
          explanation: q.explanation || 'Domain verified governing principle.',
          hints: q.hints || [
            `Hint 1: Recall the governing relation in ${topic}`,
            `Hint 2: Identify the fundamental mechanism`,
            `Hint 3: Consider the boundary conditions and governing variables`,
            `Hint 4: Review key quantitative dependencies`
          ],
          bloomLevel: q.bloomLevel || 'Understanding',
          marks: q.marks || Math.round(totalMarks / questionCount)
        };
      });
    } else {
      // Procedurally synthesize and validate guaranteed domain questions
      const generated = [];
      const formats = Array.isArray(data.questionFormats) && data.questionFormats.length > 0 ? data.questionFormats : ['mcq', 'descriptive'];
      const conceptsList = Array.isArray(data.concepts) && data.concepts.length > 0 ? data.concepts : [topic];

      for (let i = 0; i < questionCount; i++) {
        const qFormat = formats[i % formats.length];
        const concept = conceptsList[i % conceptsList.length] || topic;

        const qPkg = GenerateAcademicQuestionPackage({
          subjectName: subject,
          topic,
          concept,
          questionType: qFormat,
          difficulty: data.difficultyPolicy || 'Intermediate',
          documentContext: docContext
        });

        const qObj = {
          id: `q_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          topic,
          subject,
          type: qFormat,
          questionText: qPkg.questionText || `Explain the core mechanism of ${concept} in ${topic}.`,
          options: qPkg.options || [],
          correctIndex: qPkg.correctIndex !== undefined ? qPkg.correctIndex : 0,
          explanation: qPkg.explanation || `Governing physical, chemical, and analytical relations of ${concept}.`,
          hints: qPkg.hints || [
            `Hint 1: Recall foundational principles of ${concept}`,
            `Hint 2: Review governing equations in ${topic}`,
            `Hint 3: Apply analytical steps`,
            `Hint 4: Review key quantitative dependencies`
          ],
          bloomLevel: qPkg.bloomLevel || 'Understanding',
          marks: Math.round(totalMarks / questionCount)
        };

        const val = ValidateQuestion(qObj, topic);
        if (val.valid) {
          generated.push(qObj);
        } else {
          // Guaranteed validated fallback within topic
          generated.push({
            ...qObj,
            questionText: `What are the governing quantitative relations of ${concept} in ${topic}?`,
            explanation: `Governing physical, analytical, and operational relations of ${concept} in ${topic}.`
          });
        }
      }
      questions = generated;
    }

    const id = data.id || `asg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const assessment = {
      id,
      version: 1,
      title,
      subject,
      subjectId: data.subjectId || subject.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
      topic,
      concepts: Array.isArray(data.concepts) && data.concepts.length > 0 ? data.concepts : [topic],
      department,
      classYear,
      targetSections,
      semester,
      academicYear,
      instructions: data.instructions || `Formal Oral Viva Examination on ${topic}. Complete all questions within the allocated time. Progressive hints are available.`,
      durationMinutes,
      totalMarks,
      questionCount: questions.length,
      questionFormats: data.questionFormats || ['mcq', 'descriptive'],
      difficultyPolicy: data.difficultyPolicy || 'Adaptive (Bloom Dynamic Scale)',
      bloomLevels: data.bloomLevels || ['Remembering', 'Understanding', 'Application', 'Analysis'],
      scheduledStartTime: data.scheduledStartTime || nowIso,
      scheduledEndTime: data.scheduledEndTime || new Date(Date.now() + 86400000).toISOString(),
      attemptLimit: data.attemptLimit || 1,
      allowLateEntry: Boolean(data.allowLateEntry),
      allowProgressiveHints,
      answerDisclosurePolicy,
      status,
      facultyId: facultyUser?.username || facultyUser?.regNo || 'faculty',
      facultyName: facultyUser?.name || 'Faculty In-Charge',
      documentContext: docContext,
      uploadedFileName: data.uploadedFileName || '',
      questions,
      versions: {
        1: {
          questions: JSON.parse(JSON.stringify(questions)),
          updatedAt: nowIso,
          versionNotes: 'Initial published version'
        }
      },
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.assessments[id] = assessment;
    this.saveAssessments();
    return assessment;
  }

  /**
   * Update an assessment with versioning.
   * If students have already started attempts, their version snapshot is preserved.
   */
  updateAssessment(assessmentId, updateData, facultyUser) {
    const existing = this.assessments[assessmentId];
    if (!existing) {
      throw new Error(`Assessment ${assessmentId} not found.`);
    }

    // Check if any student has started an attempt
    const hasActiveAttempts = Object.values(this.attempts).some(att => att.assessmentId === assessmentId);
    const newVersion = hasActiveAttempts ? (existing.version || 1) + 1 : (existing.version || 1);

    const updated = {
      ...existing,
      ...updateData,
      id: existing.id,
      version: newVersion,
      updatedAt: new Date().toISOString()
    };

    // If topic or subject changed and questions were not explicitly provided, purge stale questions and regenerate
    const topicChanged = Boolean(updateData.topic && updateData.topic.trim().toLowerCase() !== (existing.topic || '').trim().toLowerCase());
    const subjectChanged = Boolean(updateData.subject && updateData.subject.trim().toLowerCase() !== (existing.subject || '').trim().toLowerCase());

    if ((topicChanged || subjectChanged) && !updateData.questions) {
      const targetSubject = updated.subject || existing.subject;
      const targetTopic = updated.topic || existing.topic;
      const questionCount = existing.questions?.length || 5;
      const totalMarks = updated.totalMarks || existing.totalMarks || 100;
      const conceptsList = Array.isArray(updated.concepts) && updated.concepts.length > 0
        ? updated.concepts
        : (topicChanged ? [targetTopic] : (existing.concepts || [targetTopic]));
      updated.concepts = conceptsList;

      let docContext = updated.documentContext || '';
      if (!docContext && updated.documentId) {
        const retrieval = referenceRetriever.retrievePassages(facultyUser?.username, updated.subjectId || targetSubject, targetTopic, 3);
        if (retrieval.found) {
          docContext = retrieval.passages.map(p => `[${p.sourceFile}] ${p.text}`).join('\n\n');
        }
      }

      const regenerated = [];
      const formats = Array.isArray(updated.questionFormats) && updated.questionFormats.length > 0 ? updated.questionFormats : ['mcq'];
      for (let i = 0; i < questionCount; i++) {
        const qFormat = formats[i % formats.length];
        const concept = conceptsList[i % conceptsList.length] || targetTopic;
        const qPkg = GenerateAcademicQuestionPackage({
          subjectName: targetSubject,
          topic: targetTopic,
          concept,
          questionType: qFormat,
          difficulty: updated.difficultyPolicy || 'Intermediate',
          documentContext: docContext
        });

        const qObj = {
          id: `q_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          topic: targetTopic,
          subject: targetSubject,
          type: qFormat,
          questionText: qPkg.questionText || `Explain the core mechanism of ${concept} in ${targetTopic}.`,
          options: qPkg.options || [],
          correctIndex: qPkg.correctIndex !== undefined ? qPkg.correctIndex : 0,
          explanation: qPkg.explanation || `Governing relations of ${concept} in ${targetTopic}.`,
          hints: qPkg.hints || [
            `Hint 1: Recall foundational principles of ${concept}`,
            `Hint 2: Review governing equations in ${targetTopic}`,
            `Hint 3: Apply analytical steps`,
            `Hint 4: Review key quantitative dependencies`
          ],
          bloomLevel: qPkg.bloomLevel || 'Understanding',
          marks: Math.round(totalMarks / questionCount)
        };
        regenerated.push(qObj);
      }
      updated.questions = regenerated;
    }

    // Store version snapshot
    if (!updated.versions) updated.versions = {};
    updated.versions[newVersion] = {
      questions: JSON.parse(JSON.stringify(updated.questions || existing.questions)),
      updatedAt: updated.updatedAt,
      versionNotes: hasActiveAttempts ? `Version ${newVersion} created after student attempts initiated.` : 'Pre-flight update'
    };

    this.assessments[assessmentId] = updated;
    this.saveAssessments();
    return updated;
  }

  /**
   * Duplicate assessment as draft
   */
  duplicateAssessment(assessmentId, facultyUser) {
    const orig = this.assessments[assessmentId];
    if (!orig) throw new Error('Assessment not found.');

    const newId = `asg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(orig)),
      id: newId,
      title: `${orig.title} (Copy)`,
      status: 'draft',
      version: 1,
      versions: {
        1: {
          questions: JSON.parse(JSON.stringify(orig.questions)),
          updatedAt: new Date().toISOString(),
          versionNotes: 'Cloned draft copy'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.assessments[newId] = cloned;
    this.saveAssessments();
    return cloned;
  }

  closeAssessment(assessmentId) {
    const existing = this.assessments[assessmentId];
    if (!existing) throw new Error('Assessment not found.');
    existing.status = 'closed';
    existing.updatedAt = new Date().toISOString();
    this.saveAssessments();
    return existing;
  }

  getAssessment(assessmentId) {
    return this.assessments[assessmentId] || null;
  }

  listFacultyAssessments(facultyId) {
    return Object.values(this.assessments).filter(a => !facultyId || a.facultyId === facultyId || a.facultyId === 'faculty');
  }

  // --------------------------------------------------------------------------
  // 2. CLASS & SECTION ASSIGNMENT ENFORCEMENT
  // --------------------------------------------------------------------------

  /**
   * Server-authoritative eligibility verification
   */
  checkStudentEligibility(assessment, student) {
    if (!assessment || !student) {
      return { eligible: false, reason: 'Missing assessment or student authentication' };
    }

    const studentYear = String(student.year || student.classYear || '').trim().toUpperCase();
    const studentSection = String(student.section || '').trim().toUpperCase();
    const studentDept = String(student.department || '').trim().toLowerCase();

    // 1. Year / Class check
    const targetYear = String(assessment.classYear || assessment.targetYear || '').trim().toUpperCase();
    if (targetYear && targetYear !== 'ALL' && targetYear !== 'ALL YEARS' && studentYear !== targetYear) {
      return {
        eligible: false,
        reason: `Assessment assigned strictly to Year ${targetYear}. Student is enrolled in Year ${studentYear || 'Unassigned'}.`
      };
    }

    // 2. Section check (supports single section or multiple explicit sections)
    const targetSections = Array.isArray(assessment.targetSections) && assessment.targetSections.length > 0
      ? assessment.targetSections.map(s => String(s).trim().toUpperCase())
      : [String(assessment.targetSection || 'A').trim().toUpperCase()];

    if (!targetSections.includes('ALL') && !targetSections.includes('ALL SECTIONS') && !targetSections.includes(studentSection)) {
      return {
        eligible: false,
        reason: `Assessment assigned strictly to Section(s) [${targetSections.join(', ')}]. Student is enrolled in Section "${studentSection || 'Unassigned'}".`
      };
    }

    // 3. Department check (if targetDepartment is specified and not 'all')
    const targetDept = String(assessment.department || '').trim().toLowerCase();
    if (targetDept && targetDept !== 'all' && targetDept !== 'all departments' && !targetDept.includes(studentDept) && !studentDept.includes(targetDept)) {
      return {
        eligible: false,
        reason: `Assessment assigned strictly to ${assessment.department}. Student is enrolled in ${student.department || 'Other'}.`
      };
    }

    // 4. Specific eligible students list check if configured
    if (Array.isArray(assessment.eligibleStudents) && assessment.eligibleStudents.length > 0) {
      const reg = String(student.regNo || student.username || '').toUpperCase();
      const inList = assessment.eligibleStudents.some(s => String(s).toUpperCase() === reg);
      if (!inList) {
        return {
          eligible: false,
          reason: `Student ${reg} is not in the explicitly authorized student roster for this assessment.`
        };
      }
    }

    return { eligible: true };
  }

  /**
   * Retrieve list of assessments strictly eligible for a given student
   */
  listEligibleAssessments(student) {
    return Object.values(this.assessments)
      .filter(a => a.status === 'published' || a.status === 'scheduled')
      .filter(a => this.checkStudentEligibility(a, student).eligible)
      .map(a => this.sanitizeAssessmentForStudent(a));
  }

  /**
   * Sanitizes assessment definition so answer keys, model answers, and explanations are NEVER leaked
   */
  sanitizeAssessmentForStudent(assessment) {
    if (!assessment) return null;
    return {
      id: assessment.id,
      version: assessment.version || 1,
      title: assessment.title,
      subject: assessment.subject,
      subjectId: assessment.subjectId,
      topic: assessment.topic,
      concepts: assessment.concepts,
      department: assessment.department,
      classYear: assessment.classYear,
      targetSections: assessment.targetSections,
      instructions: assessment.instructions,
      durationMinutes: assessment.durationMinutes,
      totalMarks: assessment.totalMarks,
      questionCount: assessment.questionCount,
      questionFormats: assessment.questionFormats,
      difficultyPolicy: assessment.difficultyPolicy,
      allowProgressiveHints: assessment.allowProgressiveHints,
      scheduledStartTime: assessment.scheduledStartTime,
      scheduledEndTime: assessment.scheduledEndTime,
      status: assessment.status,
      facultyName: assessment.facultyName
    };
  }

  // --------------------------------------------------------------------------
  // 3. SERVER-SIDE AUTHORITATIVE SESSIONS & ATTEMPTS
  // --------------------------------------------------------------------------

  /**
   * Authorize and start/recover an assessment attempt for an eligible student.
   */
  startAttempt(assessmentId, student, clientMetadata = {}) {
    const assessment = this.assessments[assessmentId];
    if (!assessment) {
      return { success: false, status: 404, error: 'Assessment not found.' };
    }

    // 1. Authoritative Class & Section Enforcement
    const eligibility = this.checkStudentEligibility(assessment, student);
    if (!eligibility.eligible) {
      return {
        success: false,
        status: 403,
        error: `Access Denied: ${eligibility.reason}`
      };
    }

    // 2. Assessment status check
    if (assessment.status === 'closed') {
      return { success: false, status: 403, error: 'This assessment is closed by the instructor.' };
    }

    const studentId = String(student.username || student.regNo).toLowerCase();
    const studentRegNo = String(student.regNo || student.username).toUpperCase();

    // 3. Look for existing attempts
    const existingAttempt = Object.values(this.attempts).find(
      att => att.assessmentId === assessmentId && (att.studentId === studentId || att.studentRegNo === studentRegNo)
    );

    const now = Date.now();

    if (existingAttempt) {
      // Reconnection & Recovery flow
      if (existingAttempt.status === 'in_progress') {
        const elapsedSeconds = Math.floor((now - existingAttempt.serverStartTime) / 1000);
        const remainingSeconds = Math.max(0, existingAttempt.durationSeconds - elapsedSeconds);

        if (remainingSeconds <= 0) {
          // Server-side timeout
          existingAttempt.status = 'timed_out';
          this.saveAttempts();
          return {
            success: false,
            status: 403,
            error: 'Assessment duration has expired on the authoritative server.'
          };
        }

        // Return recovered attempt with sanitized questions and server remaining time
        return {
          success: true,
          isRecovery: true,
          attempt: this.sanitizeAttemptForStudent(existingAttempt, assessment),
          remainingSeconds,
          serverTimestamp: now,
          watermark: this.generateWatermark(studentRegNo, assessmentId, now)
        };
      }

      // If already submitted
      if (existingAttempt.status === 'submitted') {
        return {
          success: false,
          status: 403,
          error: 'Single-attempt examination protocol enforced. You have already completed this viva.'
        };
      }
    }

    // 4. Create new attempt
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const durationSeconds = (assessment.durationMinutes || 15) * 60;
    const versionUsed = assessment.version || 1;

    // Retrieve questions from the active or version-locked snapshot
    const versionQuestions = assessment.versions?.[versionUsed]?.questions || assessment.questions || [];

    const newAttempt = {
      id: attemptId,
      assessmentId,
      assessmentVersion: versionUsed,
      studentId,
      studentName: student.name || student.fullName || student.username,
      studentRegNo,
      department: student.department || assessment.department,
      year: student.year || assessment.classYear,
      section: student.section || 'A',
      serverStartTime: now,
      durationSeconds,
      status: 'in_progress', // 'in_progress' | 'submitted' | 'timed_out'
      answers: {}, // keyed by questionId: { answer, selectedOption, hintsUsed, timeSpentSec, savedAt }
      integrityObservations: [], // Observations recorded without false automatic disqualification
      clientMetadata: {
        ip: clientMetadata.ip || '127.0.0.1',
        userAgent: clientMetadata.userAgent || 'Desktop/Mobile Browser',
        firstConnectedAt: now
      },
      createdAt: new Date().toISOString()
    };

    this.attempts[attemptId] = newAttempt;
    this.saveAttempts();

    return {
      success: true,
      isRecovery: false,
      attempt: this.sanitizeAttemptForStudent(newAttempt, assessment),
      remainingSeconds: durationSeconds,
      serverTimestamp: now,
      watermark: this.generateWatermark(studentRegNo, assessmentId, now)
    };
  }

  /**
   * Autosave answers during the live viva session.
   * Safe for refreshes and intermittent network drops.
   */
  autosaveAnswer(attemptId, student, answerPayload) {
    const attempt = this.attempts[attemptId];
    if (!attempt) {
      return { success: false, status: 404, error: 'Attempt session not found.' };
    }

    const studentRegNo = String(student.regNo || student.username).toUpperCase();
    if (attempt.studentRegNo !== studentRegNo && attempt.studentId !== String(student.username).toLowerCase()) {
      return { success: false, status: 403, error: 'Unauthorized attempt access.' };
    }

    if (attempt.status !== 'in_progress') {
      return { success: false, status: 400, error: `Cannot save answers. Attempt status is "${attempt.status}".` };
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - attempt.serverStartTime) / 1000);
    const remainingSeconds = Math.max(0, attempt.durationSeconds - elapsedSeconds);

    if (remainingSeconds <= 0) {
      attempt.status = 'timed_out';
      this.saveAttempts();
      return { success: false, status: 403, error: 'Assessment time limit exceeded on the server.' };
    }

    const { questionId, answer, selectedOption, hintsUsed = 0, timeSpentSec = 0 } = answerPayload;
    if (!questionId) {
      return { success: false, status: 400, error: 'Missing questionId in answer payload.' };
    }

    if (!attempt.answers) attempt.answers = {};
    attempt.answers[questionId] = {
      answer: answer !== undefined ? answer : null,
      selectedOption: selectedOption !== undefined ? selectedOption : null,
      hintsUsed,
      timeSpentSec,
      savedAt: now
    };
    attempt.lastHeartbeat = now;

    this.saveAttempts();
    return {
      success: true,
      savedAt: now,
      remainingSeconds,
      answeredCount: Object.keys(attempt.answers).length
    };
  }

  /**
   * Log an integrity observation (visibility change, window blur, fullscreen exit)
   * strictly as an audited observation, NOT an automatic disqualification.
   */
  logIntegrityObservation(attemptId, student, observation) {
    const attempt = this.attempts[attemptId];
    if (!attempt) return { success: false, error: 'Attempt not found' };

    const studentRegNo = String(student.regNo || student.username).toUpperCase();
    if (attempt.studentRegNo !== studentRegNo && attempt.studentId !== String(student.username).toLowerCase()) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!attempt.integrityObservations) attempt.integrityObservations = [];
    attempt.integrityObservations.push({
      type: observation.type || 'visibility_change',
      details: observation.details || 'Window/tab focus observation recorded',
      timestamp: Date.now()
    });
    this.saveAttempts();

    return {
      success: true,
      observationCount: attempt.integrityObservations.length,
      notice: 'Observation recorded for institutional audit review.'
    };
  }

  /**
   * Finalize and submit assessment attempt.
   * IDEMPOTENT: Retrying returns existing result without duplicating marks.
   */
  submitAttempt(attemptId, student, finalData = {}) {
    const attempt = this.attempts[attemptId];
    if (!attempt) {
      return { success: false, status: 404, error: 'Attempt session not found.' };
    }

    const studentRegNo = String(student.regNo || student.username).toUpperCase();
    if (attempt.studentRegNo !== studentRegNo && attempt.studentId !== String(student.username).toLowerCase()) {
      return { success: false, status: 403, error: 'Unauthorized attempt submission.' };
    }

    // IDEMPOTENCY CHECK: If already submitted, return existing record
    if (attempt.status === 'submitted' && attempt.evaluation) {
      return {
        success: true,
        alreadySubmitted: true,
        evaluation: attempt.evaluation,
        message: 'Submission already recorded.'
      };
    }

    const assessment = this.assessments[attempt.assessmentId];
    if (!assessment) {
      return { success: false, status: 404, error: 'Associated assessment not found.' };
    }

    // Merge any final answers passed during submission
    if (finalData.answers && typeof finalData.answers === 'object') {
      Object.assign(attempt.answers, finalData.answers);
    }

    // Authoritative Server-Side Evaluation
    const versionQuestions = assessment.versions?.[attempt.assessmentVersion]?.questions || assessment.questions || [];
    let earnedMarks = 0;
    const totalMarks = assessment.totalMarks || 100;
    const questionMarks = totalMarks / Math.max(1, versionQuestions.length);
    let correctCount = 0;
    const questionBreakdown = [];

    versionQuestions.forEach((q, idx) => {
      const studentAns = attempt.answers[q.id] || attempt.answers[`q_${idx}`] || {};
      const isMcq = (q.type || 'mcq').toLowerCase() === 'mcq';
      let isCorrect = false;

      if (isMcq) {
        const studentSelected = studentAns.selectedOption !== undefined && studentAns.selectedOption !== null
          ? parseInt(studentAns.selectedOption, 10)
          : null;
        isCorrect = studentSelected === q.correctIndex;
      } else {
        // Descriptive / Numerical keyword matching
        const text = String(studentAns.answer || '').toLowerCase();
        const expected = q.expectedKeywords || [q.topic.toLowerCase()];
        const matched = expected.filter(k => text.includes(k.toLowerCase()));
        isCorrect = matched.length >= Math.ceil(expected.length * 0.5);
      }

      if (isCorrect) {
        correctCount++;
        // Apply slight hint deduction if hints were used and allowed
        const hintDeduction = Math.min(questionMarks * 0.3, (studentAns.hintsUsed || 0) * (questionMarks * 0.1));
        earnedMarks += Math.max(questionMarks * 0.4, questionMarks - hintDeduction);
      }

      questionBreakdown.push({
        questionId: q.id,
        isCorrect,
        hintsUsed: studentAns.hintsUsed || 0
      });
    });

    const roundedMarks = Math.round(earnedMarks);
    const scorePercentage = Math.round((earnedMarks / totalMarks) * 100);

    attempt.status = 'submitted';
    attempt.submittedAt = Date.now();
    attempt.evaluation = {
      totalMarks,
      earnedMarks: roundedMarks,
      percentage: scorePercentage,
      correctCount,
      totalQuestions: versionQuestions.length,
      grade: scorePercentage >= 80 ? 'Distinction' : (scorePercentage >= 60 ? 'First Class' : 'Pass'),
      disclosedAnswers: assessment.answerDisclosurePolicy === 'never' ? null : questionBreakdown,
      evaluatedAt: new Date().toISOString()
    };

    this.saveAttempts();

    return {
      success: true,
      alreadySubmitted: false,
      evaluation: attempt.evaluation
    };
  }

  // --------------------------------------------------------------------------
  // 4. WATERMARKING & SECURITY SANITIZATION
  // --------------------------------------------------------------------------

  generateWatermark(studentRegNo, assessmentId, timestamp) {
    const raw = String(studentRegNo || 'STUDENT');
    // Non-sensitive masked student ID (e.g. STU-***4055)
    const masked = 'STU-***' + raw.slice(-4);
    return {
      maskedStudentId: masked,
      assessmentId,
      timestamp,
      watermarkText: `${masked} • ${assessmentId} • ${new Date(timestamp).toLocaleTimeString()}`,
      notice: 'Digital Assessment Watermark — Capture & Sharing Deterrence Active'
    };
  }

  sanitizeAttemptForStudent(attempt, assessment = null) {
    const targetAssessment = assessment || (attempt.assessmentId ? this.assessments[attempt.assessmentId] : null) || attempt || {};
    const versionQuestions = targetAssessment.versions?.[attempt.assessmentVersion]?.questions || targetAssessment.questions || attempt.questions || [];
    
    // Strip correctIndex, modelAnswer, explanation, and rubric from student view
    const safeQuestions = versionQuestions.map((q, idx) => ({
      id: q.id,
      index: idx,
      subject: q.subject || targetAssessment.subject || attempt.subject,
      topic: q.topic || targetAssessment.topic || attempt.topic,
      concept: q.concept || targetAssessment.concept || attempt.concept || targetAssessment.topic || attempt.topic,
      type: q.type || 'mcq',
      format: q.format || (q.type === 'mcq' ? 'MCQ' : 'Descriptive'),
      difficulty: q.difficulty || targetAssessment.difficulty || attempt.difficulty || 'Intermediate',
      questionText: q.questionText,
      options: q.options || [],
      bloomLevel: q.bloomLevel || 'Understanding',
      marks: q.marks,
      hints: (targetAssessment.allowProgressiveHints !== false) ? (q.hints || []) : []
    }));

    return {
      id: attempt.id,
      attemptId: attempt.id,
      assessmentId: attempt.assessmentId,
      assessmentTitle: targetAssessment.title || 'Continuous Assessment',
      subject: targetAssessment.subject || attempt.subject,
      topic: targetAssessment.topic || attempt.topic,
      concept: targetAssessment.concept || attempt.concept,
      instructions: targetAssessment.instructions || '',
      questions: safeQuestions,
      savedAnswers: attempt.answers || {},
      durationSeconds: attempt.durationSeconds,
      serverStartTime: attempt.serverStartTime,
      status: attempt.status
    };
  }

  // --------------------------------------------------------------------------
  // 5. STAFF LIVE MONITOR TELEMETRY
  // --------------------------------------------------------------------------

  getLiveMonitor(assessmentId, facultyUser) {
    const assessment = this.assessments[assessmentId];
    if (!assessment) {
      throw new Error('Assessment not found.');
    }

    // Determine eligible cohort from accounts
    const eligibleStudents = accountService.getStudentsByCohort(
      assessment.classYear,
      assessment.targetSections,
      assessment.department
    );

    const assessmentAttempts = Object.values(this.attempts).filter(att => att.assessmentId === assessmentId);
    const now = Date.now();

    const activeAttempts = [];
    const submittedAttempts = [];
    const timedOutAttempts = [];

    assessmentAttempts.forEach(att => {
      const elapsed = Math.floor((now - att.serverStartTime) / 1000);
      const remaining = Math.max(0, att.durationSeconds - elapsed);

      const summary = {
        attemptId: att.id,
        studentRegNo: att.studentRegNo,
        studentName: att.studentName,
        section: att.section,
        status: att.status,
        remainingSeconds: att.status === 'in_progress' ? remaining : 0,
        answeredCount: Object.keys(att.answers || {}).length,
        totalQuestions: assessment.questionCount,
        integrityObservationsCount: (att.integrityObservations || []).length,
        observations: att.integrityObservations || [],
        score: att.evaluation?.percentage ?? null
      };

      if (att.status === 'submitted') {
        submittedAttempts.push(summary);
      } else if (att.status === 'timed_out' || remaining <= 0) {
        timedOutAttempts.push(summary);
      } else {
        activeAttempts.push(summary);
      }
    });

    const joinedRegNos = new Set(assessmentAttempts.map(a => a.studentRegNo));
    const notStarted = eligibleStudents.filter(s => !joinedRegNos.has(s.regNo));

    return {
      assessmentId: assessment.id,
      title: assessment.title,
      subject: assessment.subject,
      topic: assessment.topic,
      classYear: assessment.classYear,
      targetSections: assessment.targetSections,
      totalEligibleCount: eligibleStudents.length,
      joinedCount: assessmentAttempts.length,
      notStartedCount: notStarted.length,
      activeCount: activeAttempts.length,
      submittedCount: submittedAttempts.length,
      timedOutCount: timedOutAttempts.length,
      activeAttempts,
      submittedAttempts,
      timedOutAttempts,
      notStartedStudents: notStarted,
      serverTimestamp: now,
      isClosed: assessment.status === 'closed'
    };
  }
}

export const assessmentManager = new AssessmentManager();
