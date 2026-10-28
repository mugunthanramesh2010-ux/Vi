// server/src/ai/outputValidator.js
// Validates generated questions for topic grounding, anti-leak, schema validity, and safe rendering.
// 100% OFFLINE, ZERO CLOUD.

import { validateQuestionSchema } from './questionSchemas.js';

export class OutputValidator {
  /**
   * Validate question before it reaches the student
   */
  validate(question, context = {}) {
    const checks = {
      schemaValid: false,
      antiLeakPassed: true,
      notDuplicate: true,
      safeRendering: true,
      topicGrounded: true,
      reasons: []
    };

    // 1. Schema Check
    const schemaRes = validateQuestionSchema(question);
    checks.schemaValid = schemaRes.valid;
    if (!schemaRes.valid) {
      checks.reasons.push(...schemaRes.errors);
    }

    // 2. Anti-Leak Check: Verify hints do NOT give away the exact MCQ option or answer
    if (question.type === 'mcq' && Array.isArray(question.options) && typeof question.correctIndex === 'number') {
      const correctText = String(question.options[question.correctIndex] || '').toLowerCase().trim();
      const hints = Array.isArray(question.hints) ? question.hints : [];

      hints.forEach((h, hIdx) => {
        const lowerH = String(h).toLowerCase();
        // If hint literally repeats the entire correct answer option
        if (correctText.length > 5 && lowerH.includes(correctText)) {
          checks.antiLeakPassed = false;
          checks.reasons.push(`Hint ${hIdx + 1} leaks the exact correct answer.`);
        }
      });
    }

    // 3. Duplicate Detection Check
    const history = context.previouslyAskedQuestions || [];
    const currentText = String(question.questionText || question.text || '').toLowerCase().trim();
    const isDup = history.some(prev => {
      const prevText = String(prev.questionText || prev.text || '').toLowerCase().trim();
      return prevText === currentText || (currentText.length > 20 && prevText.includes(currentText.slice(0, 40)));
    });

    if (isDup) {
      checks.notDuplicate = false;
      checks.reasons.push('Question is a duplicate of a previously asked question in this session.');
    }

    // 4. Safe Rendering Check: Disallow raw HTML or script tags
    const fullText = JSON.stringify(question);
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(fullText) || /javascript:/i.test(fullText)) {
      checks.safeRendering = false;
      checks.reasons.push('Model output contains unsafe scripts or dangerous markup.');
    }

    // 5. Topic Grounding & Cross-Discipline Quarantine Checks
    const topic = String(context.topic || '').toLowerCase();
    const subject = String(context.subject || '').toLowerCase();
    const qLower = currentText.toLowerCase();

    // Check banned inflated phrasing
    if (currentText.includes('Foundational Principles, Definitions & Structural Axioms')) {
      checks.reasons.push('Question contains banned padding phrase: "Foundational Principles, Definitions & Structural Axioms".');
    }
    if (qLower.includes('core operational mechanism and governing significance')) {
      checks.reasons.push('Question contains banned template phrase: "core operational mechanism and governing significance".');
    }
    if (qLower.includes('core theoretical framework')) {
      checks.reasons.push('Question contains banned template phrase: "Core Theoretical Framework".');
    }
    if (qLower.includes('operational purpose and governing significance')) {
      checks.reasons.push('Question contains banned template phrase: "Operational purpose and governing significance".');
    }
    if (currentText.includes('Universal Discipline')) {
      checks.reasons.push('Question contains banned placeholder: "Universal Discipline".');
    }

    // Cross-discipline quarantine checks
    if ((subject.includes('biotechnology') || topic.includes('bioreactor') || topic.includes('oxygen transfer')) &&
        (qLower.includes('electric vehicle') || qLower.includes('ev battery') || qLower.includes('powertrain') || qLower.includes('regenerative braking') || qLower.includes('inverter') || qLower.includes('motor drive') || qLower.includes('internal combustion') || qLower.includes('internet') || qLower.includes('tcp/ip') || qLower.includes('routing protocol') || qLower.includes('packet switching'))) {
      checks.reasons.push('Cross-discipline violation: Unrelated Internet, networking, or automotive question rejected for Biotechnology / Oxygen Transfer schedule.');
    }
    if (subject.includes('biotechnology') && (qLower.includes('nuclear') || qLower.includes('radioactive'))) {
      checks.reasons.push('Cross-discipline violation: Biotechnology question discusses unrelated nuclear physics.');
    }

    // 6. MCQ Quality Controls
    if (question.type === 'mcq') {
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        checks.reasons.push(`MCQ must have exactly 4 options (found ${question.options?.length || 0}).`);
      } else {
        const uniqueOpts = new Set(question.options.map(o => String(o).trim().toLowerCase()));
        if (uniqueOpts.size !== question.options.length) {
          checks.reasons.push('MCQ contains duplicate options.');
        }

        question.options.forEach((opt, idx) => {
          const oLower = String(opt).toLowerCase();
          if (oLower.includes('infinite power amplification') || oLower.includes('zero-loss infinite power')) {
            checks.reasons.push(`Option ${idx + 1} contains banned absurd claim: "infinite power amplification".`);
          }
          if (oLower.includes('arbitrary empirical approximation')) {
            checks.reasons.push(`Option ${idx + 1} contains banned generic template phrasing.`);
          }
          if (oLower.includes('eliminates the requirement for boundary conditions') || oLower.includes('eliminating boundary conditions')) {
            checks.reasons.push(`Option ${idx + 1} contains banned generic distractor phrasing.`);
          }
        });

        if (typeof question.correctIndex !== 'number' || question.correctIndex < 0 || question.correctIndex >= question.options.length) {
          checks.reasons.push(`Invalid correctIndex: ${question.correctIndex}.`);
        }

        if (question.explanation && typeof question.correctIndex === 'number') {
          const expLower = question.explanation.toLowerCase();
          if (question.correctIndex === 0 && (expLower.includes('option b is correct') || expLower.includes('option c is correct') || expLower.includes('option d is correct'))) {
            checks.reasons.push('Contradictory explanation: Explanation indicates an option that contradicts correctIndex.');
          }
        }
      }
    }

    if (topic && topic.length > 3) {
      // Check if topic or its principal root word is reflected in question, concept, or expected keywords
      const topicWords = topic.split(/\s+/).filter(w => w.length > 3);
      const matchedWord = topicWords.some(w => qLower.includes(w) || (question.expectedKeywords || []).some(k => String(k).toLowerCase().includes(w)));
      if (!matchedWord && !context.referenceEvidence?.length) {
        checks.reasons.push(`Question lacks direct lexical alignment with target topic "${context.topic}".`);
      }
    }

    const isValid = checks.schemaValid && checks.antiLeakPassed && checks.notDuplicate && checks.safeRendering && checks.reasons.length === 0;
    return {
      isValid,
      checks,
      sanitizedQuestion: isValid ? this.sanitizeQuestion(question) : null
    };
  }

  /**
   * Sanitize question content for safe React rendering
   */
  sanitizeQuestion(q) {
    const clone = JSON.parse(JSON.stringify(q));
    // Ensure all strings are safe and trimmed
    clone.questionText = String(clone.questionText || clone.text || '').trim();
    if (Array.isArray(clone.options)) {
      clone.options = clone.options.map(opt => String(opt || '').trim());
    }
    if (Array.isArray(clone.hints)) {
      clone.hints = clone.hints.map(h => String(h || '').trim());
    }
    return clone;
  }
}

export const outputValidator = new OutputValidator();
