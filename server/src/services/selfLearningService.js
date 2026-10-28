// server/src/services/selfLearningService.js
// Production-grade Self-Learning Mode Engine.
// Provides concept exploration, source-grounded explanations, worked examples,
// interactive practice, progressive hints, and spaced revision paths.
// Strictly isolates Self-Learning practice from official restricted examination mode.
// 100% OFFLINE, ZERO CLOUD.

import { ACADEMIC_REGISTRY, GenerateAcademicQuestionPackage, EvaluateResponse, GenerateHint } from '../../../src/services/academicAssessmentEngine.js';
import { referenceRetriever } from '../ai/referenceRetriever.js';
import { conceptGraphEngine } from '../ai/conceptGraphEngine.js';
import { adaptiveStudentIntelligence } from '../ai/adaptiveStudentIntelligence.js';

export class SelfLearningService {
  /**
   * Retrieve learning module for a topic, with source-grounded concept notes and worked examples
   */
  getLearningModule(subjectName, topicName, facultyId = 'FACULTY_DEFAULT', options = {}) {
    const cleanSubj = String(subjectName || 'General Engineering').trim();
    const cleanTop = String(topicName || 'Core Topic').trim();

    // 1. Retrieve any uploaded reference passages for this topic
    const refResult = referenceRetriever.retrievePassages(facultyId, cleanSubj, cleanTop, 5, options);
    const sourcePassages = refResult.found ? refResult.passages : [];

    // 2. Build or load concept graph
    const graph = conceptGraphEngine.buildConceptGraph(cleanSubj, cleanTop, sourcePassages);

    // 3. Extract curriculum concept definitions, governing equations, and worked examples
    const conceptsSummary = graph.nodes
      .filter(n => n.type === 'core_concept')
      .map(c => ({
        id: c.id,
        name: c.name,
        learningObjective: c.learningObjective,
        equations: c.equations || [],
        governingPrinciples: c.governingPrinciples || [],
        status: c.studentMasteryEvidence?.status || 'NOT_YET_ASSESSED'
      }));

    // 4. Generate a verified worked example with step-by-step arithmetic
    const sampleNumerical = GenerateAcademicQuestionPackage({
      subjectName: cleanSubj,
      topic: cleanTop,
      questionType: 'numerical',
      index: 1
    });

    const workedExample = sampleNumerical.numericalDetails ? {
      problemStatement: sampleNumerical.questionText,
      formula: sampleNumerical.numericalDetails.formula,
      givenParameters: sampleNumerical.numericalDetails.givenParameters,
      stepByStepSolution: sampleNumerical.numericalDetails.stepByStep,
      finalCalculatedValue: sampleNumerical.numericalDetails.calculatedValue,
      unit: sampleNumerical.numericalDetails.unit,
      explanation: sampleNumerical.explanation
    } : null;

    return {
      success: true,
      mode: 'self_learning',
      subject: cleanSubj,
      topic: cleanTop,
      prerequisites: ['Foundational Domain Principles'],
      conceptsCount: conceptsSummary.length,
      concepts: conceptsSummary,
      sourceGrounded: refResult.found,
      citations: sourcePassages.map(p => p.citation),
      sourcePassages: sourcePassages.map(p => ({
        citation: p.citation,
        text: p.text.slice(0, 300) + '...',
        pageNumber: p.pageNumber,
        sectionHeading: p.sectionHeading
      })),
      workedExample,
      policy: {
        assessmentMode: 'self_learning',
        isExamRestricted: false,
        timerEnforced: false,
        immediateFeedbackAllowed: true,
        unlimitedHintsAllowed: true,
        retakesAllowed: true
      }
    };
  }

  /**
   * Generate interactive practice set for self-learning
   */
  generatePracticeSet(subjectName, topicName, count = 5, options = {}) {
    const cleanSubj = String(subjectName || 'General Engineering').trim();
    const cleanTop = String(topicName || 'Core Topic').trim();
    const targetCount = Math.max(1, Math.min(20, parseInt(count, 10) || 5));

    const questions = [];
    const seenIds = new Set();
    const seenFingerprints = new Set();

    for (let i = 0; i < targetCount; i++) {
      const pkg = GenerateAcademicQuestionPackage({
        subjectName: cleanSubj,
        topic: cleanTop,
        index: i + 1,
        count: 1,
        seenQuestionIds: seenIds,
        seenFingerprints,
        exclusiveSourceOnly: Boolean(options.exclusiveSourceOnly),
        referencePassages: options.referencePassages
      });

      if (pkg.valid) {
        seenIds.add(pkg.id);
        if (pkg.semanticFingerprint) seenFingerprints.add(pkg.semanticFingerprint);
        // Expose self-learning practice package without restricting hints
        questions.push({
          id: pkg.id,
          questionNumber: i + 1,
          questionText: pkg.questionText,
          format: pkg.format,
          difficulty: pkg.difficulty,
          bloomLevel: pkg.bloomLevel,
          options: pkg.options,
          correctIndex: pkg.correctIndex,
          modelAnswer: pkg.modelAnswer,
          explanation: pkg.explanation,
          hints: pkg.hints,
          diagramSvg: pkg.diagramSvg,
          numericalDetails: pkg.numericalDetails,
          sourceReference: pkg.sourceReference || null
        });
      }
    }

    return {
      success: true,
      subject: cleanSubj,
      topic: cleanTop,
      totalPracticeQuestions: questions.length,
      questions
    };
  }

  /**
   * Submit interactive self-learning practice attempt with instant remediation
   */
  submitPracticeAttempt({ studentId = 'STUDENT', subject, topic, question, selectedIndex, hintsUsed = 0, timeSpentSec = 20 }) {
    const isCorrect = selectedIndex === question.correctIndex;
    const evalResult = EvaluateResponse(question, question.modelAnswer, {}, selectedIndex);

    // Update adaptive intelligence
    const adaptiveResult = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question,
      studentAnswer: selectedIndex,
      isCorrect,
      evaluation: evalResult,
      hintsUsed,
      responseTimeSeconds: timeSpentSec
    });

    return {
      success: true,
      isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: evalResult.feedback,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      masteryUpdate: adaptiveResult,
      remediationRecommendation: adaptiveResult.adaptiveDecision
    };
  }
}

export const selfLearningService = new SelfLearningService();
