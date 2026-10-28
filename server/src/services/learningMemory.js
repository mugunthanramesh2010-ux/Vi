// server/src/services/learningMemory.js
// VIVA ANALYZER X — Persistent Learning Memory and Mastery Engine
// Records validated questions, student interaction history, topic mastery profiles,
// and manages safe shared question bank promotion without hallucination leakage.
// 100% OFFLINE, ZERO CLOUD.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_LEARNING_DIR = path.resolve(__dirname, '../../../Viva_Records/Learning_Memory');
const PROFILES_DIR = path.join(BASE_LEARNING_DIR, 'student_profiles');
const TOPICS_DIR = path.join(BASE_LEARNING_DIR, 'topic_analytics');
const SHARED_BANK_FILE = path.join(BASE_LEARNING_DIR, 'validated_question_bank.json');
const QUARANTINE_FILE = path.join(BASE_LEARNING_DIR, 'quarantined_questions.json');

export class LearningMemory {
  constructor() {
    this._ensureDirectories();
  }

  _ensureDirectories() {
    try {
      if (!fs.existsSync(BASE_LEARNING_DIR)) fs.mkdirSync(BASE_LEARNING_DIR, { recursive: true });
      if (!fs.existsSync(PROFILES_DIR)) fs.mkdirSync(PROFILES_DIR, { recursive: true });
      if (!fs.existsSync(TOPICS_DIR)) fs.mkdirSync(TOPICS_DIR, { recursive: true });
      if (!fs.existsSync(SHARED_BANK_FILE)) fs.writeFileSync(SHARED_BANK_FILE, JSON.stringify([], null, 2), 'utf-8');
      if (!fs.existsSync(QUARANTINE_FILE)) fs.writeFileSync(QUARANTINE_FILE, JSON.stringify([], null, 2), 'utf-8');
    } catch (e) {
      console.warn('LearningMemory directory init error:', e.message);
    }
  }

  _readJsonSafe(filePath, fallback = []) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content || '[]');
      }
    } catch (e) { }
    return fallback;
  }

  _writeJsonSafe(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('LearningMemory write error:', e.message);
    }
  }

  _sanitizeKey(str) {
    return String(str || 'default').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  }

  /**
   * Record generated/validated question into persistent question memory
   */
  recordQuestion(question, meta = {}) {
    this._ensureDirectories();
    const bank = this._readJsonSafe(SHARED_BANK_FILE, []);

    // Check if question already exists in bank by normalized text
    const qTextNorm = String(question.questionText || question.text || '').toLowerCase().trim();
    const existing = bank.find(q => String(q.questionText || '').toLowerCase().trim() === qTextNorm);

    if (existing) {
      existing.usageCount = (existing.usageCount || 1) + 1;
      existing.lastUsed = new Date().toISOString();
      this._writeJsonSafe(SHARED_BANK_FILE, bank);
      return existing;
    }

    const record = {
      id: question.id || `q_bank_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      subject: question.subject,
      topic: question.topic,
      concept: question.concept || question.conceptId || question.topic,
      questionText: question.questionText || question.text,
      type: question.type || 'mcq',
      difficulty: question.difficulty || 'Intermediate',
      bloomLevel: question.bloomLevel || 'Understanding',
      options: question.options || null,
      correctIndex: typeof question.correctIndex === 'number' ? question.correctIndex : null,
      modelAnswer: question.modelAnswer || '',
      explanation: question.explanation || '',
      hints: question.hints || [],
      expectedKeywords: question.expectedKeywords || [],
      rubric: question.rubric || null,
      sourceType: question.sourceType || 'orchestrated_validated',
      validationStatus: 'validated',
      usageCount: 1,
      createdAt: new Date().toISOString(),
      meta
    };

    bank.push(record);
    this._writeJsonSafe(SHARED_BANK_FILE, bank);
    return record;
  }

  /**
   * Quarantine low-quality or contradictory questions so they are NEVER reused
   */
  quarantineQuestion(question, reasons = []) {
    this._ensureDirectories();
    const quarantine = this._readJsonSafe(QUARANTINE_FILE, []);
    quarantine.push({
      question,
      reasons,
      quarantinedAt: new Date().toISOString()
    });
    this._writeJsonSafe(QUARANTINE_FILE, quarantine);
  }

  /**
   * Retrieve a validated question from shared bank matching subject, topic, concept
   */
  getValidatedQuestion(subject, topic, concept, questionType = 'mcq') {
    this._ensureDirectories();
    const bank = this._readJsonSafe(SHARED_BANK_FILE, []);
    const sNorm = String(subject || '').toLowerCase().trim();
    const tNorm = String(topic || '').toLowerCase().trim();
    const cNorm = String(concept || '').toLowerCase().trim();

    const matches = bank.filter(q => {
      const qSubj = String(q.subject || '').toLowerCase().trim();
      const qTopic = String(q.topic || '').toLowerCase().trim();
      const qConcept = String(q.concept || '').toLowerCase().trim();

      const subjMatch = !sNorm || qSubj.includes(sNorm) || sNorm.includes(qSubj);
      const topicMatch = qTopic.includes(tNorm) || tNorm.includes(qTopic);
      const typeMatch = !questionType || q.type === questionType;

      return subjMatch && topicMatch && typeMatch;
    });

    if (matches.length > 0) {
      // Pick least recently used or first available
      matches.sort((a, b) => (a.usageCount || 0) - (b.usageCount || 0));
      return matches[0];
    }
    return null;
  }

  /**
   * Get or initialize student topic learning profile
   */
  getStudentProfile(studentId) {
    this._ensureDirectories();
    const safeId = this._sanitizeKey(studentId);
    const profileFile = path.join(PROFILES_DIR, `${safeId}.json`);
    const defaultProfile = {
      studentId: safeId,
      topics: {}, // topicKey -> { assessedCount, scoreAvg, masteredConcepts: [], confusedConcepts: [], misconceptions: [], history: [] }
      totalQuestionsAnswered: 0,
      totalHintsUsed: 0,
      lastActive: new Date().toISOString()
    };
    return this._readJsonSafe(profileFile, defaultProfile);
  }

  /**
   * Save student learning profile
   */
  saveStudentProfile(profile) {
    this._ensureDirectories();
    const safeId = this._sanitizeKey(profile.studentId);
    const profileFile = path.join(PROFILES_DIR, `${safeId}.json`);
    profile.lastActive = new Date().toISOString();
    this._writeJsonSafe(profileFile, profile);
  }

  /**
   * Record student interaction and update topic learning profile
   */
  recordInteraction(studentId, question, studentResponse, evaluation, meta = {}) {
    const profile = this.getStudentProfile(studentId);
    const topicKey = this._sanitizeKey(question.topic || 'general');
    const conceptName = question.concept || question.conceptId || question.topic;

    if (!profile.topics[topicKey]) {
      profile.topics[topicKey] = {
        subject: question.subject,
        topic: question.topic,
        assessedCount: 0,
        totalScore: 0,
        averageScore: 0,
        masteredConcepts: [],
        confusedConcepts: [],
        misconceptions: [],
        hintsUsedCount: 0,
        currentMasteryLevel: 'Novice',
        history: []
      };
    }

    const tData = profile.topics[topicKey];
    tData.assessedCount++;
    tData.totalScore += evaluation.score || 0;
    tData.averageScore = Math.round(tData.totalScore / tData.assessedCount);

    const isSuccess = evaluation.score >= 70;
    if (isSuccess) {
      if (!tData.masteredConcepts.includes(conceptName)) {
        tData.masteredConcepts.push(conceptName);
      }
      tData.confusedConcepts = tData.confusedConcepts.filter(c => c !== conceptName);
    } else {
      if (!tData.confusedConcepts.includes(conceptName)) {
        tData.confusedConcepts.push(conceptName);
      }
      if (evaluation.misconceptions && Array.isArray(evaluation.misconceptions)) {
        evaluation.misconceptions.forEach(m => {
          if (!tData.misconceptions.includes(m)) tData.misconceptions.push(m);
        });
      }
    }

    // Determine mastery progression
    if (tData.averageScore >= 85 && tData.masteredConcepts.length >= 3) {
      tData.currentMasteryLevel = 'Expert';
    } else if (tData.averageScore >= 70) {
      tData.currentMasteryLevel = 'Competent';
    } else if (tData.averageScore >= 50) {
      tData.currentMasteryLevel = 'Developing';
    } else {
      tData.currentMasteryLevel = 'Novice';
    }

    const hintsCount = meta.hintsUsed || 0;
    tData.hintsUsedCount += hintsCount;
    profile.totalHintsUsed += hintsCount;
    profile.totalQuestionsAnswered++;

    tData.history.push({
      questionId: question.id,
      concept: conceptName,
      difficulty: question.difficulty,
      score: evaluation.score,
      status: evaluation.status,
      timeSpentSec: meta.timeSpentSec || 0,
      hintsUsed: hintsCount,
      timestamp: new Date().toISOString()
    });

    this.saveStudentProfile(profile);

    // Update aggregate topic analytics (Privacy-safe: no student identities)
    this._updateTopicAnalytics(question.subject, question.topic, conceptName, evaluation);

    return {
      topicMastery: tData.currentMasteryLevel,
      averageScore: tData.averageScore,
      masteredCount: tData.masteredConcepts.length,
      confusedCount: tData.confusedConcepts.length
    };
  }

  /**
   * Update aggregate topic analytics without student PII
   */
  _updateTopicAnalytics(subject, topic, concept, evaluation) {
    const topicKey = this._sanitizeKey(`${subject}_${topic}`);
    const topicFile = path.join(TOPICS_DIR, `${topicKey}.json`);
    const defaultData = {
      subject,
      topic,
      totalAttempts: 0,
      cohortAverageScore: 0,
      totalScoreSum: 0,
      commonMisconceptions: {},
      difficultyCalibration: {
        foundationPassRate: 0,
        advancedPassRate: 0
      }
    };

    const data = this._readJsonSafe(topicFile, defaultData);
    data.totalAttempts++;
    data.totalScoreSum += evaluation.score || 0;
    data.cohortAverageScore = Math.round(data.totalScoreSum / data.totalAttempts);

    if (evaluation.misconceptions && Array.isArray(evaluation.misconceptions)) {
      evaluation.misconceptions.forEach(m => {
        data.commonMisconceptions[m] = (data.commonMisconceptions[m] || 0) + 1;
      });
    }

    this._writeJsonSafe(topicFile, data);
  }

  /**
   * Determine next adaptive difficulty for a student
   */
  getAdaptiveStep(studentId, subject, topic, assessmentMode = 'practice') {
    // In strict fixed exam mode, adaptation does NOT alter predetermined sequence
    if (assessmentMode === 'strict_exam') {
      return {
        nextDifficulty: 'Intermediate',
        recommendedAction: 'continue_fixed_curriculum',
        targetPrerequisite: null
      };
    }

    const profile = this.getStudentProfile(studentId);
    const topicKey = this._sanitizeKey(topic || 'general');
    const tData = profile.topics[topicKey];

    if (!tData || tData.assessedCount === 0) {
      return {
        nextDifficulty: 'Foundation',
        recommendedAction: 'assess_fundamentals',
        targetPrerequisite: null
      };
    }

    const recent = tData.history.slice(-3);
    const recentAvg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;

    if (recentAvg >= 85) {
      return {
        nextDifficulty: 'Advanced',
        recommendedAction: 'deep_application_synthesis',
        targetPrerequisite: null
      };
    } else if (recentAvg >= 65) {
      return {
        nextDifficulty: 'Intermediate',
        recommendedAction: 'reinforce_concept_mechanisms',
        targetPrerequisite: null
      };
    } else {
      const confused = tData.confusedConcepts[0] || null;
      return {
        nextDifficulty: 'Foundation',
        recommendedAction: 'revisit_topic_prerequisite',
        targetPrerequisite: confused
      };
    }
  }
}

export const learningMemory = new LearningMemory();
