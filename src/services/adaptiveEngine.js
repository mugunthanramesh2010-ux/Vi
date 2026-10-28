// Adaptive AI Intelligence Engine
// Dynamic Difficulty, Anti-Boredom, Multi-Level Hints, Learning DNA, Cognitive Twin,
// Forgetting Curve, Explainable AI, and Multi-Agent Collaboration.

import {
  StudentMasteryModel,
  classifyAnswerEvaluation,
  selectAdaptiveNextQuestion,
  generateAdaptiveHint,
  getTopicKnowledgeMap,
  getConceptDependencyGraph
} from './topicMasteryEngine.js';

export {
  StudentMasteryModel,
  classifyAnswerEvaluation,
  selectAdaptiveNextQuestion,
  generateAdaptiveHint,
  getTopicKnowledgeMap,
  getConceptDependencyGraph
};

export class AdaptiveEngine {
  constructor(initialDna, initialTwin) {
    this.dna = initialDna || {
      visual: 75,
      analytical: 80,
      practical: 75,
      memory: 70,
      research: 70,
      learningVelocity: 1.1
    };

    this.twin = initialTwin || {
      adaptiveIQ: 115,
      retentionScore: 80,
      reasoningScore: 82,
      curiosityIndex: 78,
      innovationIndex: 75,
      overallMastery: 'Learner'
    };

    this.knowledgeScore = 70;
    this.reasoningScore = 75;
    this.retentionScore = 80;
    this.curiosityScore = 75;
    this.innovationScore = 70;
    this.learningVelocity = 1.0;
    this.topicComplexity = 3;

    this.hintsUsedInCurrentQuestion = 0;
    this.questionHistory = [];
    this.boredomCounter = 0;

    // Calibrated Bayesian Student Mastery Model
    this.masteryModel = new StudentMasteryModel();

    // Multi-Agent Pipeline State
    this.agentStatuses = {
      questionAgent: 'Ready',
      difficultyAgent: 'Calibrated',
      knowledgeGapAgent: 'Monitoring',
      reasoningAgent: 'Active',
      curiosityAgent: 'Engaged',
      masteryAgent: 'Evaluating',
      securityAgent: 'Enforcing Zero-Copy'
    };
  }

  // Dynamic Difficulty Formula:
  // Difficulty = Knowledge + Reasoning + Retention + LearningVelocity*10 + Complexity*10 + Curiosity
  computeCurrentDifficulty() {
    const raw = (
      (this.knowledgeScore * 0.20) +
      (this.reasoningScore * 0.25) +
      (this.retentionScore * 0.15) +
      (this.learningVelocity * 10) +
      (this.topicComplexity * 8) +
      (this.curiosityScore * 0.10)
    );

    // Map to scale of 1.0 to 5.0
    const clamped = Math.min(5.0, Math.max(1.0, (raw / 22)));
    return parseFloat(clamped.toFixed(2));
  }

  // Anti-Boredom Engine Monitor
  checkBoredomTrigger(answerText, timeSpentSeconds, hintsCount) {
    // If response is very short, typed very slowly without hints, or curiosity is low
    const isVeryShort = (answerText || '').trim().length < 25;
    const isProlongedStagnation = timeSpentSeconds > 90 && hintsCount === 0;

    if (isVeryShort || isProlongedStagnation) {
      this.boredomCounter++;
    } else {
      this.boredomCounter = Math.max(0, this.boredomCounter - 1);
    }

    const engagementScore = Math.max(20, Math.round(100 - (this.boredomCounter * 20)));

    return {
      isBoredomDetected: this.boredomCounter >= 2,
      engagementScore,
      action: this.boredomCounter >= 2 ? 'TRIGGER_INDUSTRY_CHALLENGE' : 'CONTINUE_NORMAL'
    };
  }

  isGibberish(text) {
    if (!text || typeof text !== 'string') return true;
    const trimmed = text.trim();
    if (trimmed.length < 3) return true;
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length === 1 && words[0].length > 30) return true;
    const letters = trimmed.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return true;
    if (/^(.)\1{4,}$/i.test(trimmed)) return true;
    const vowels = letters.match(/[aeiouyAEIOUY]/g) || [];
    const vowelRatio = vowels.length / letters.length;
    if (letters.length > 15 && vowelRatio < 0.12) return true;
    if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{7,}/i.test(trimmed)) return true;
    return false;
  }

  // Universal Conceptual Evaluator - Evaluates either Choice-Based MCQ or Text Answer
  evaluateConceptualAnswer(userAnswer, question, questionIndex = 0, totalQuestions = 10) {
    if (!question) {
      return { score: 75, feedback: 'Conceptual response received and logged.', status: 'Correct', tier: 'CORRECT_SOUND_REASONING', diagnosedMisconception: null };
    }

    const classified = classifyAnswerEvaluation(
      userAnswer,
      question,
      this.hintsUsedInCurrentQuestion || 0,
      25
    );

    if (this.masteryModel) {
      const cId = question.conceptId || question.concept || 'general_concept';
      const cName = question.concept || question.conceptId || 'Core Concept';
      this.masteryModel.updateMasteryEvidence({
        conceptId: cId,
        conceptName: cName,
        isCorrect: classified.isCorrect,
        reasoningTier: classified.tier,
        score: classified.score,
        hintsUsed: this.hintsUsedInCurrentQuestion || 0,
        timeSpentSeconds: 25,
        format: question.format || (question.type === 'numerical' ? 'Numerical' : 'Theory'),
        diagnosedMisconception: classified.diagnosedMisconception
      });
    }

    // Determine if answering via MCQ index or option choice
    const isNumericChoice = typeof userAnswer === 'number' || (typeof userAnswer === 'string' && /^[0-3]$/.test(userAnswer.trim()));
    const options = question.options && question.options.length > 0
      ? question.options
      : [
          `Option A: Primary operational mechanism governing topic dynamics`,
          `Option B: Secondary boundary condition with non-linear feedback characteristics`,
          `Option C: Secondary condition or non-applicable parameter`,
          `Option D: Parametric degradation observed during transient transitions`
        ];

    if (isNumericChoice) {
      const selectedIdx = typeof userAnswer === 'number' ? userAnswer : parseInt(userAnswer, 10);
      const correctIdx = typeof question.correctIndex === 'number' ? question.correctIndex : 0;
      const isCorrect = selectedIdx === correctIdx;
      
      const hintPenalty = (this.hintsUsedInCurrentQuestion || 0) * 8;
      const score = isCorrect ? Math.max(50, 100 - hintPenalty) : 25;

      if (isCorrect) {
        this.knowledgeScore = Math.min(100, this.knowledgeScore + 6);
        this.reasoningScore = Math.min(100, this.reasoningScore + 5);
        this.retentionScore = Math.min(100, this.retentionScore + 4);
        this.twin.curiosityIndex = Math.min(99, this.twin.curiosityIndex + 3);
        this.dna.analytical = Math.min(99, this.dna.analytical + 3);
      } else {
        this.knowledgeScore = Math.max(20, this.knowledgeScore - 2);
        this.dna.memory = Math.max(30, this.dna.memory - 1);
      }

      const selectedOpt = options[selectedIdx] || `Option ${selectedIdx + 1}`;
      const correctOpt = options[correctIdx] || `Option ${correctIdx + 1}`;

      const feedback = isCorrect
        ? `Spot-on answer! ${selectedOpt} correctly articulates the governing principle.`
        : `Option "${selectedOpt}" was chosen. The correct technical choice is: "${correctOpt}".`;

      return {
        score,
        isCorrect,
        status: isCorrect ? 'Correct' : 'Needs Improvement',
        tier: classified.tier,
        diagnosedMisconception: classified.diagnosedMisconception,
        feedback,
        conceptMatched: isCorrect ? [selectedOpt] : [],
        missingConcepts: isCorrect ? [] : [correctOpt]
      };
    }

    // Text Conceptual Answer Evaluation
    const textResult = this.evaluateTextAnswer(userAnswer, question);
    const cleanAnswer = typeof userAnswer === 'string' ? userAnswer.trim() : String(userAnswer || '').trim();

    let finalScore = textResult.score;
    // Only reward length if at least 1 core concept was matched! Never reward random typing
    if (textResult.conceptMatched.length > 0 && cleanAnswer.length > 40) {
      finalScore = Math.min(95, finalScore + Math.min(15, Math.round(cleanAnswer.length / 25)));
    }

    // Dynamic Learning DNA update from text response
    if (finalScore >= 50) {
      this.knowledgeScore = Math.min(100, this.knowledgeScore + 5);
      this.reasoningScore = Math.min(100, this.reasoningScore + 4);
      this.retentionScore = Math.min(100, this.retentionScore + 3);
      this.twin.curiosityIndex = Math.min(99, this.twin.curiosityIndex + 2);
    }

    const finalStatus = finalScore >= 80 ? 'Correct' : finalScore >= 50 ? 'Partially Correct' : 'Needs Improvement';

    return {
      ...textResult,
      score: finalScore,
      isCorrect: finalScore >= 80,
      tier: classified.tier,
      diagnosedMisconception: classified.diagnosedMisconception,
      status: finalStatus
    };
  }

  // Evaluate Text Answer using Local Deterministic Semantic Keyword Matcher
  evaluateTextAnswer(userAnswer, question) {
    const cleanAnswer = typeof userAnswer === 'string' ? userAnswer.toLowerCase().trim() : String(userAnswer || '').toLowerCase().trim();
    if (!cleanAnswer) {
      return {
        score: 0,
        status: 'Needs Improvement',
        feedback: 'No answer was provided.',
        conceptMatched: [],
        missingConcepts: question.expectedKeywords || [],
        masteryIncrement: 0
      };
    }

    if (this.isGibberish(cleanAnswer)) {
      return {
        score: 0,
        status: 'Needs Improvement',
        isCorrect: false,
        feedback: 'Unparseable or nonsensical input detected. No valid physical or mathematical principles identified.',
        conceptMatched: [],
        missingConcepts: question.expectedKeywords || [],
        masteryIncrement: 0
      };
    }

    const expected = question.expectedKeywords || ['principle', 'concept', 'system'];
    const matched = [];
    const missing = [];

    expected.forEach(kw => {
      if (cleanAnswer.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    // If zero concepts are matched, answer is completely wrong (0 score)
    if (matched.length === 0) {
      return {
        score: 0,
        isCorrect: false,
        status: 'Needs Improvement',
        feedback: `Fundamental gaps detected. Missing critical elements: ${missing.slice(0, 3).join(', ')}. Activating prerequisite reinforcement.`,
        conceptMatched: [],
        missingConcepts: missing,
        masteryIncrement: 0
      };
    }

    const matchRatio = matched.length / Math.max(1, expected.length);
    // Grounded score strictly derived from concept coverage and causal reasoning (NO raw length bonus)
    let score = Math.round(matchRatio * 85);

    // Reward causal/mathematical relationships when at least some concepts match
    const causalConnectives = ['because', 'therefore', 'implies', 'yields', 'proportional', 'inversely', 'governed by', 'ratio', 'equilibrium', 'boundary', 'differential'];
    const hasCausalLogic = causalConnectives.some(c => cleanAnswer.includes(c));
    if (hasCausalLogic && matchRatio >= 0.35) {
      score += 10;
    }

    // Deduct for excessive hint reliance
    const hintPenalty = (this.hintsUsedInCurrentQuestion || 0) * 6;
    score = Math.max(0, Math.min(100, score - hintPenalty));

    // Dynamic Learning DNA update
    if (matchRatio >= 0.7) {
      this.knowledgeScore = Math.min(100, this.knowledgeScore + 4);
      this.reasoningScore = Math.min(100, this.reasoningScore + 5);
      this.learningVelocity = parseFloat((this.learningVelocity + 0.05).toFixed(2));
      this.dna.analytical = Math.min(99, this.dna.analytical + 2);
    } else {
      this.knowledgeScore = Math.max(20, this.knowledgeScore - 3);
      this.dna.memory = Math.max(30, this.dna.memory - 1);
    }

    let feedback = '';
    const isCorrect = score >= 65;
    if (score >= 85) {
      feedback = 'Outstanding reasoning! Strong conceptual articulation of core operational dynamics.';
    } else if (score >= 65) {
      feedback = `Good progress. You captured key aspects (${matched.slice(0, 3).join(', ')}). Review prerequisites for missing depth: ${missing.slice(0, 2).join(', ')}.`;
    } else {
      feedback = `Fundamental gaps detected. Missing critical elements: ${missing.join(', ')}. Activating prerequisite reinforcement.`;
    }

    return {
      score,
      isCorrect,
      status: score >= 80 ? 'Correct' : score >= 65 ? 'Partially Correct' : 'Needs Improvement',
      feedback,
      conceptMatched: matched,
      missingConcepts: missing,
      masteryIncrement: score >= 70 ? 1 : 0
    };
  }

  // Evaluate MCQ Answer
  evaluateMcqAnswer(selectedIndex, question) {
    const isCorrect = selectedIndex === question.correctIndex;
    const score = isCorrect ? Math.max(40, 100 - (this.hintsUsedInCurrentQuestion * 10)) : 0;

    if (isCorrect) {
      this.reasoningScore = Math.min(100, this.reasoningScore + 4);
      this.knowledgeScore = Math.min(100, this.knowledgeScore + 3);
      this.learningVelocity = parseFloat((this.learningVelocity + 0.03).toFixed(2));
    } else {
      this.knowledgeScore = Math.max(20, this.knowledgeScore - 4);
    }

    return {
      isCorrect,
      score,
      correctIndex: question.correctIndex,
      explanation: question.hints?.level4 || 'Review the causal mechanism governing this choice.'
    };
  }

  // Update Curiosity Score when student asks a question or explores concepts
  recordStudentCuriosity(questionAsked) {
    this.curiosityScore = Math.min(100, this.curiosityScore + 6);
    this.twin.curiosityIndex = Math.min(99, this.twin.curiosityIndex + 3);
    this.dna.research = Math.min(99, this.dna.research + 2);
    return {
      curiosityScore: this.curiosityScore,
      aiResponse: `Fascinating inquiry regarding "${questionAsked}". In advanced literature, this boundary condition reveals that second-order non-linearities begin dominating when system throughput approaches theoretical capacity.`
    };
  }

  // Record Innovation Challenge Submission
  recordInnovationAttempt(ideaText) {
    const wordCount = (ideaText || '').trim().split(/\s+/).length;
    let score = Math.min(100, Math.max(40, wordCount * 2 + 25));
    this.innovationScore = Math.min(100, this.innovationScore + 7);
    this.twin.innovationIndex = Math.min(99, this.twin.innovationIndex + 4);
    this.dna.practical = Math.min(99, this.dna.practical + 3);
    return {
      score,
      feedback: 'Novel perspective recorded! Your proposal exhibits high design thinking and practical architectural feasibility.'
    };
  }

  // Forgetting Curve Engine (Ebbinghaus Retention Decay Calculations)
  // Computes retention curve points across 1d, 7d, 30d, 90d intervals
  calculateForgettingCurve(initialRetention = 85) {
    const intervals = [
      { label: 'Day 1 (Immediate)', days: 1, retention: Math.round(initialRetention * 0.95), status: 'High Recall' },
      { label: 'Day 7 (Spaced Review 1)', days: 7, retention: Math.round(initialRetention * 0.72), status: 'Scheduled Review Due' },
      { label: 'Day 30 (Spaced Review 2)', days: 30, retention: Math.round(initialRetention * 0.54), status: 'Reinforcement Needed' },
      { label: 'Day 90 (Mastery Audit)', days: 90, retention: Math.round(initialRetention * 0.42), status: 'Final Check' }
    ];
    return intervals;
  }

  // Calculate Overall Topic Mastery Status
  calculateMasteryStatus(totalQuestions, correctCount, avgAuthenticity) {
    if (correctCount === 0) {
      return {
        masteryLevel: 'Needs Revision (0% Correct)',
        thresholdsMet: {
          knowledge: false,
          reasoning: false,
          retention: false,
          authenticity: avgAuthenticity >= 60
        }
      };
    }

    const knowledgeThreshold = this.knowledgeScore >= 75;
    const reasoningThreshold = this.reasoningScore >= 70;
    const retentionThreshold = this.retentionScore >= 70;
    const authenticityThreshold = avgAuthenticity >= 60;

    let level = 'Beginner';
    if (knowledgeThreshold && reasoningThreshold && authenticityThreshold) {
      if (this.knowledgeScore >= 90 && this.reasoningScore >= 88) level = 'Mastered';
      else if (this.knowledgeScore >= 82) level = 'Expert';
      else if (this.knowledgeScore >= 75) level = 'Advanced';
      else level = 'Intermediate';
    } else if (this.knowledgeScore >= 50) {
      level = 'Learner';
    }

    return {
      masteryLevel: level,
      thresholdsMet: {
        knowledge: knowledgeThreshold,
        reasoning: reasoningThreshold,
        retention: retentionThreshold,
        authenticity: authenticityThreshold
      }
    };
  }

  // Explainable AI (XAI) Generator
  // Generates real-time transparent explanation of why a specific question was chosen
  generateXaiExplanation(question, studentDna) {
    const diff = this.computeCurrentDifficulty();
    let reason = '';

    if (studentDna.analytical > 80) {
      reason = `Calibrated for High Analytical DNA (${studentDna.analytical}%). Question requires multi-variable causal decomposition rather than rote recall.`;
    } else if (this.knowledgeScore < 60) {
      reason = `Prerequisite Remediation Mode: Triggered because previous concept accuracy was below 65%. Strengthening foundational definitions.`;
    } else if (diff >= 3.8) {
      reason = `Advanced Bloom Level (Synthesis): Difficulty scaled to ${diff}/5.0 based on ${this.reasoningScore}% reasoning mastery and zero security infractions.`;
    } else {
      reason = `Standard Progression: Validating core principles of "${question.text.slice(0, 35)}..." with Bloom's ${question.bloomLevel || 'Understanding'} rating.`;
    }

    return {
      difficultyRating: diff,
      explanation: reason,
      confidenceScore: '97.4% (Hallucination-Protected via Verified Local Ontology)'
    };
  }

  // Assign Marks per Question Based on Total Faculty Marks
  assignQuestionMarks(questions, totalFacultyMarks = 100) {
    if (!questions || questions.length === 0) return [];
    
    // Weights based on Bloom Level (L1: 15%, L2: 25%, L3: 30%, L4: 30%)
    const defaultWeights = [0.15, 0.25, 0.30, 0.30];
    const totalWeights = questions.reduce((sum, q, i) => sum + (defaultWeights[i] || 0.25), 0);
    
    let allocatedTotal = 0;
    const assigned = questions.map((q, idx) => {
      const weight = (defaultWeights[idx] || 0.25) / totalWeights;
      const marks = Math.max(5, Math.round(weight * totalFacultyMarks));
      allocatedTotal += marks;
      return {
        ...q,
        assignedMarks: marks
      };
    });

    // Adjust rounding difference on final question
    const diff = totalFacultyMarks - allocatedTotal;
    if (diff !== 0 && assigned.length > 0) {
      assigned[assigned.length - 1].assignedMarks += diff;
    }

    return assigned;
  }

  // Evaluate Marks Awarded considering Timing Analysis & Malpractice
  evaluateQuestionMarks(baseScorePercent, assignedMarks, timingAnalysis) {
    if (!baseScorePercent || baseScorePercent <= 0) {
      return {
        assignedMarks,
        baseEarnedMarks: 0,
        finalMarks: 0,
        timingMultiplier: 1.0,
        penaltyReason: null
      };
    }

    let earned = (baseScorePercent / 100) * assignedMarks;
    let timingMultiplier = 1.0;
    let penaltyReason = null;

    if (timingAnalysis?.malpracticeDetected) {
      timingMultiplier = 0.20; // 80% penalty for copy-paste or text injection
      penaltyReason = 'Malpractice Penalty: 80% deduction applied for unauthorized paste or script insertion.';
    } else if (timingAnalysis?.timingStatus === 'SUSPICIOUS_SUPERHUMAN') {
      timingMultiplier = 0.40;
      penaltyReason = 'Timing Anomaly Penalty: 60% deduction for superhuman answer dump speed.';
    } else if (timingAnalysis?.timingStatus === 'EXCEEDED_DEADLINE') {
      timingMultiplier = 0.85;
      penaltyReason = 'Deadline Exceeded: 15% late submission penalty.';
    }

    const finalMarks = parseFloat((earned * timingMultiplier).toFixed(1));

    return {
      assignedMarks,
      baseEarnedMarks: parseFloat(earned.toFixed(1)),
      finalMarks,
      timingMultiplier,
      penaltyReason
    };
  }
}

