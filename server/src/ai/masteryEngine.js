// server/src/ai/masteryEngine.js
// Student Concept Mastery and Learning DNA Tracker.
// Tracks student understanding, misconceptions, and Bloom's cognitive evolution.
// 100% OFFLINE, ZERO CLOUD.

export class MasteryEngine {
  constructor() {
    this.sessionStates = new Map();
  }

  getOrCreateSessionState(sessionId, studentId) {
    const key = `${studentId}_${sessionId}`;
    if (!this.sessionStates.has(key)) {
      this.sessionStates.set(key, {
        studentId,
        sessionId,
        conceptMastery: {}, // conceptId -> { attempts, scoreAvg, mastered: bool }
        demonstratedConcepts: new Set(),
        missingConcepts: new Set(),
        detectedMisconceptions: [],
        questionHistory: [],
        hintsUsedCount: 0,
        averageTimePerQuestion: 0,
        startTime: Date.now()
      });
    }
    return this.sessionStates.get(key);
  }

  /**
   * Update student mastery record with newly evaluated answer
   */
  updateMastery(sessionId, studentId, question, evaluation, meta = {}) {
    const state = this.getOrCreateSessionState(sessionId, studentId);
    const concept = question.conceptId || question.concept || question.topic || 'GENERAL';

    if (!state.conceptMastery[concept]) {
      state.conceptMastery[concept] = {
        attempts: 0,
        evidenceCount: 0,
        totalScore: 0,
        scoreAvg: 0,
        mastered: false,
        uncertainty: 1.0,
        confidence: 0.0,
        lastDifficulty: question.difficulty,
        recurringMisconceptions: [],
        consecutiveSuccesses: 0
      };
    }

    const cState = state.conceptMastery[concept];
    cState.attempts++;
    cState.evidenceCount++;
    cState.totalScore += evaluation.score;
    cState.scoreAvg = Math.round(cState.totalScore / cState.attempts);

    // Uncertainty decreases with evidence: 1 / (1 + 0.6 * evidenceCount)
    cState.uncertainty = Math.max(0.05, Number((1 / (1 + 0.6 * cState.evidenceCount)).toFixed(3)));
    cState.confidence = Number((1 - cState.uncertainty).toFixed(3));

    if (evaluation.score >= 70) {
      cState.consecutiveSuccesses++;
    } else {
      cState.consecutiveSuccesses = 0;
    }

    // Do NOT equate a single correct answer with mastery: require evidenceCount >= 2 and scoreAvg >= 75
    cState.mastered = cState.evidenceCount >= 2 && cState.scoreAvg >= 75;

    // Track demonstrated vs missing
    (evaluation.demonstratedConcepts || []).forEach(c => state.demonstratedConcepts.add(c));
    (evaluation.missingConcepts || []).forEach(c => state.missingConcepts.add(c));
    (evaluation.misconceptions || []).forEach(m => {
      state.detectedMisconceptions.push({ concept, misconception: m, timestamp: new Date().toISOString() });
      if (!cState.recurringMisconceptions.includes(m)) {
        cState.recurringMisconceptions.push(m);
      }
    });

    state.hintsUsedCount += (meta.hintsUsed || 0);
    state.questionHistory.push({
      questionId: question.id,
      concept,
      score: evaluation.score,
      status: evaluation.status,
      difficulty: question.difficulty,
      questionType: question.questionType,
      timeSpentSec: meta.timeSpentSec || 0,
      timestamp: new Date().toISOString()
    });

    return this.getSummary(sessionId, studentId);
  }

  /**
   * Choose subsequent concept locked strictly to the assigned topic
   */
  selectSubsequentConcept(assignedTopic, availableConcepts = [], studentId = 'STUDENT', sessionId = 'sess_default') {
    const state = this.getOrCreateSessionState(sessionId, studentId);

    if (!Array.isArray(availableConcepts) || availableConcepts.length === 0) {
      return {
        nextConcept: assignedTopic,
        reason: 'default_topic_continuation',
        scaffoldingNeeded: false,
        challengeLevel: 'Intermediate'
      };
    }

    // 1. Identify weak concepts requiring remediation / scaffolding
    const struggling = availableConcepts.filter(c => {
      const cName = typeof c === 'string' ? c : (c.name || c.id);
      const cState = state.conceptMastery[cName];
      return cState && cState.evidenceCount > 0 && cState.scoreAvg < 55;
    });

    if (struggling.length > 0) {
      const chosen = struggling[0];
      const cName = typeof chosen === 'string' ? chosen : (chosen.name || chosen.id);
      return {
        nextConcept: cName,
        reason: 'prerequisite_remediation_and_scaffolding',
        scaffoldingNeeded: true,
        challengeLevel: 'Foundational'
      };
    }

    // 2. Prioritize unassessed concepts within the assigned topic
    const unassessed = availableConcepts.filter(c => {
      const cName = typeof c === 'string' ? c : (c.name || c.id);
      return !state.conceptMastery[cName] || state.conceptMastery[cName].evidenceCount === 0;
    });

    if (unassessed.length > 0) {
      const chosen = unassessed[0];
      return {
        nextConcept: typeof chosen === 'string' ? chosen : (chosen.name || chosen.id),
        reason: 'unassessed_concept_coverage',
        scaffoldingNeeded: false,
        challengeLevel: 'Intermediate'
      };
    }

    // 3. Concepts with highest uncertainty (least evidence)
    const sortedByUncertainty = [...availableConcepts].sort((a, b) => {
      const aName = typeof a === 'string' ? a : (a.name || a.id);
      const bName = typeof b === 'string' ? b : (b.name || b.id);
      const aUnc = state.conceptMastery[aName]?.uncertainty ?? 1.0;
      const bUnc = state.conceptMastery[bName]?.uncertainty ?? 1.0;
      return bUnc - aUnc;
    });

    const chosen = sortedByUncertainty[0];
    const cName = typeof chosen === 'string' ? chosen : (chosen.name || chosen.id);
    return {
      nextConcept: cName,
      reason: 'uncertainty_reduction',
      scaffoldingNeeded: false,
      challengeLevel: state.conceptMastery[cName]?.scoreAvg >= 80 ? 'Advanced' : 'Intermediate'
    };
  }

  getSummary(sessionId, studentId) {
    const state = this.getOrCreateSessionState(sessionId, studentId);
    const conceptsArray = Object.entries(state.conceptMastery).map(([k, v]) => ({
      conceptId: k,
      ...v
    }));

    const masteredCount = conceptsArray.filter(c => c.mastered).length;
    const overallProgress = conceptsArray.length > 0 ? Math.round((masteredCount / conceptsArray.length) * 100) : 0;

    return {
      studentId: state.studentId,
      sessionId: state.sessionId,
      overallProgress,
      conceptsAssessed: conceptsArray.length,
      masteredCount,
      demonstratedConcepts: Array.from(state.demonstratedConcepts),
      missingConcepts: Array.from(state.missingConcepts),
      misconceptions: state.detectedMisconceptions,
      historyCount: state.questionHistory.length
    };
  }
}

export const masteryEngine = new MasteryEngine();
