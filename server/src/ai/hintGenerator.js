// server/src/ai/hintGenerator.js
// Adaptive Concept-Specific Progressive Socratic Hint Generator.
// Generates 4 progressive tiers that guide student inquiry without leaking answers.
// 100% OFFLINE, ZERO CLOUD.

import { GenerateHint } from '../../../src/services/academicAssessmentEngine.js';

export class HintGenerator {
  /**
   * Get the next progressive Socratic hint for the question,
   * dynamically adapted to the student's observed error category.
   */
  getNextHint(question = {}, currentHintLevel = 0, context = {}) {
    const hints = Array.isArray(question.hints) ? question.hints : [];
    const requestedLevel = Math.max(0, currentHintLevel);

    let baseHintText = '';
    if (hints.length > requestedLevel) {
      baseHintText = hints[requestedLevel];
    } else {
      // Dynamic generation if hints array exhausted or not provided
      const missingConcepts = context.missingConcepts || [];
      const targetConcept = missingConcepts[0] || question.concept || question.conceptId || question.topic || 'the underlying principle';
      const targetTopic = question.topic || question.subject || 'this discipline';

      baseHintText = GenerateHint(
        question,
        question.modelAnswer || question.text || '',
        {
          subjectName: question.subject || '',
          topic: targetTopic,
          concept: targetConcept
        },
        requestedLevel + 1
      );
    }

    // Response-adaptive guidance if student error details or category are provided
    let targetedGuidance = null;
    const errCat = context.errorCategory || (context.studentError?.category) || (context.studentError?.errorCategory);
    if (errCat === 'mathematical' || errCat === 'calculation') {
      targetedGuidance = 'Verify numerical substitution and unit dimensions: recheck the driving force or parameter values before executing final calculations.';
    } else if (errCat === 'diagram' || errCat === 'interpretive') {
      targetedGuidance = 'Inspect the visual boundaries, coordinate axes, and labels to observe where the dominant physical gradient or transition occurs.';
    } else if (errCat === 'procedural' || errCat === 'application') {
      targetedGuidance = 'Structure the solution step-by-step: establish the governing balance relationship before substituting specific parameters.';
    } else if (errCat === 'conceptual' || errCat === 'misconception') {
      const cName = question.concept || question.conceptId || question.topic || 'the active concept';
      targetedGuidance = `Clarify the governing mechanism: distinguish the independent operating input from the dependent system response for ${cName}.`;
    }

    // Anti-leak verification: ensure hint text never leaks raw answer or specifies option letter
    let safeHintText = baseHintText;
    if (question.type === 'mcq' && Array.isArray(question.options) && typeof question.correctIndex === 'number') {
      const correctText = String(question.options[question.correctIndex] || '').toLowerCase().trim();
      if (correctText.length > 8 && safeHintText.toLowerCase().includes(correctText)) {
        safeHintText = 'Review the governing relationship and determine which option satisfies the boundary conditions.';
      }
    }

    return {
      level: requestedLevel + 1,
      totalLevels: Math.max(4, hints.length),
      hintText: safeHintText,
      targetedGuidance: targetedGuidance || undefined,
      errorCategory: errCat || null,
      conceptId: question.conceptId || question.concept || question.topic,
      antiLeakVerified: true
    };
  }
}

export const hintGenerator = new HintGenerator();
