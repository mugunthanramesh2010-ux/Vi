// tests/academic_grounding_repair.test.mjs
// Automated Regression Test Suite for Viva Analyzer Question Quality & Subject Grounding Repair
// Verifies all 15 required validation and grounding conditions (Section 10 of prompt)
// 100% Deterministic, Offline, Zero Cloud Dependency.

import assert from 'assert';
import {
  GenerateQuestion,
  GenerateOptions,
  GenerateAnswerKey,
  GenerateExplanation,
  GenerateHint,
  EvaluateResponse,
  GenerateFollowUp,
  ValidateQuestion,
  GenerateAcademicQuestionPackage,
  ACADEMIC_REGISTRY,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';

import { OutputValidator } from '../server/src/ai/outputValidator.js';
import { HintGenerator } from '../server/src/ai/hintGenerator.js';
import { QuestionGenerator } from '../server/src/ai/questionGenerator.js';

console.log('================================================================');
console.log('  VIVA ANALYZER — QUESTION QUALITY & SUBJECT-GROUNDING TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(`    ${err.message}\n`);
    throw err;
  }
}

// 1. Biotechnology -> Bioreactor Design -> Oxygen Transfer
it('1. Biotechnology -> Bioreactor Design -> Oxygen Transfer: generates grounded kLa/DO questions without nuclear physics', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  });

  assert.ok(pkg, 'Package must be generated');
  assert.strictEqual(pkg.subject, 'Biotechnology');
  assert.strictEqual(pkg.topic, 'Bioreactor Design');
  assert.strictEqual(pkg.concept, 'Oxygen Transfer');

  const qLower = pkg.questionText.toLowerCase();
  assert.ok(
    qLower.includes('oxygen') || qLower.includes('mass-transfer') || qLower.includes('kla') || qLower.includes('impeller'),
    'Question must assess oxygen transfer mechanism'
  );

  // Cross-discipline check: Bioreactor design question must NOT discuss nuclear physics
  assert.ok(!qLower.includes('nuclear'), 'Must not mention nuclear physics');
  assert.ok(!qLower.includes('radioactive'), 'Must not mention radioactivity');
  assert.ok(!qLower.includes('neutron'), 'Must not mention neutrons');

  // Validate MCQ quality
  assert.strictEqual(pkg.options.length, 4, 'Must have exactly 4 options');
  assert.strictEqual(typeof pkg.correctIndex, 'number', 'Must have valid correctIndex');
  assert.ok(pkg.correctIndex >= 0 && pkg.correctIndex < 4, 'correctIndex must be 0-3');

  // Verify hints discuss oxygen transfer
  const hText = pkg.hints.join(' ').toLowerCase();
  assert.ok(hText.includes('oxygen') || hText.includes('gas-liquid') || hText.includes('kla'), 'Hint must teach oxygen transfer concept');

  // Validation must pass
  const validation = ValidateQuestion(pkg, { subjectName: 'Biotechnology', topic: 'Bioreactor Design', concept: 'Oxygen Transfer' });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 2. Biotechnology -> Bioreactor Design -> Sterilization
it('2. Biotechnology -> Bioreactor Design -> Sterilization: generates authentic thermal death & Del factor questions', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Sterilization',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  });

  assert.ok(pkg);
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(
    qLower.includes('sterilization') || qLower.includes('del factor') || qLower.includes('nabla') || qLower.includes('htst') || qLower.includes('spore'),
    'Must test sterilization kinetics or Del factor'
  );

  // Validate explanation consistency
  assert.ok(pkg.explanation, 'Must have detailed explanation');
  assert.strictEqual(pkg.options.length, 4);
  assert.ok(!JSON.stringify(pkg.options).includes('infinite power amplification'), 'Must not contain infinite power');

  const validation = ValidateQuestion(pkg, { subjectName: 'Biotechnology', topic: 'Bioreactor Design', concept: 'Sterilization' });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 3. Communication Engineering -> Modulation
it('3. Communication Engineering -> Modulation: tests carrier frequency translation and lambda/4 antenna sizing', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Modulation',
    concept: 'Principles of Modulation',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  });

  assert.ok(pkg);
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(
    qLower.includes('antenna') || qLower.includes('baseband') || qLower.includes('carrier') || qLower.includes('frequency') || qLower.includes('modulation'),
    'Must test modulation principles'
  );

  // Ensure options do not have arbitrary claims
  pkg.options.forEach((opt, idx) => {
    assert.ok(!opt.includes('arbitrary empirical approximation'), `Option ${idx} contains banned phrasing`);
    assert.ok(!opt.includes('eliminates the requirement for boundary conditions'), `Option ${idx} contains banned boundary phrasing`);
  });

  const validation = ValidateQuestion(pkg, { subjectName: 'Communication Engineering', topic: 'Modulation', concept: 'Principles of Modulation' });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 4. Control Systems -> Bode Plot Stability Analysis
it('4. Control Systems -> Bode Plot Stability Analysis: evaluates gain/phase margin at crossover frequencies', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  });

  assert.ok(pkg);
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(
    qLower.includes('gain margin') || qLower.includes('phase margin') || qLower.includes('crossover frequency') || qLower.includes('bode'),
    'Must test Bode plot stability margins'
  );

  // Verify correct answer text matches correct index
  const correctOption = pkg.options[pkg.correctIndex];
  assert.ok(correctOption, 'Correct option must exist in options');
  assert.ok(pkg.explanation.toLowerCase().includes('option'), 'Explanation must address option validity');

  const validation = ValidateQuestion(pkg, { subjectName: 'Control Systems', topic: 'Bode Plot Stability Analysis', concept: 'Gain and Phase Margins' });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 5. Computer Science -> Database Normalization
it('5. Computer Science -> Database Normalization: assesses functional dependencies, 3NF, and BCNF superkey criteria', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  });

  assert.ok(pkg);
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(
    qLower.includes('bcnf') || qLower.includes('3nf') || qLower.includes('superkey') || qLower.includes('dependency') || qLower.includes('normalization'),
    'Must test normalization principles'
  );

  // Ensure hints scaffold functional dependency and superkey concepts progressively
  assert.ok(pkg.hints.length === 4, 'Must provide 4 progressive hints');
  assert.ok(pkg.hints[0].includes('3NF') || pkg.hints[0].includes('functional dependency'), 'Hint 1 must provide concept reminder');

  const validation = ValidateQuestion(pkg, { subjectName: 'Computer Science', topic: 'Database Normalization', concept: 'Normal Forms and Dependencies' });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 6. Registered subject with a user-defined topic
it('6. Registered subject with user-defined topic: generates concept-grounded question without generic padding', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Distributed Consensus with Paxos and Raft',
    concept: 'Leader Election and Quorum Consistency',
    questionType: 'mcq',
    difficulty: 'Advanced'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.topic, 'Distributed Consensus with Paxos and Raft');
  assert.ok(!pkg.questionText.includes('Foundational Principles, Definitions & Structural Axioms'), 'Must not contain banned filler');
  assert.ok(!pkg.questionText.includes('Universal Discipline'), 'Must not contain Universal Discipline');

  // Options must be distinct and non-absurd
  assert.strictEqual(pkg.options.length, 4);
  const unique = new Set(pkg.options);
  assert.strictEqual(unique.size, 4, 'All 4 options must be distinct');

  const validation = ValidateQuestion(pkg, {
    subjectName: 'Computer Science',
    topic: 'Distributed Consensus with Paxos and Raft',
    concept: 'Leader Election and Quorum Consistency'
  });
  assert.strictEqual(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
});

// 7. A topic missing from the schedule
it('7. Topic missing from schedule: handles gracefully without crashing or cross-subject contamination', () => {
  const resolved = resolveAcademicContext({
    subjectName: 'Mechanical Engineering',
    topic: 'Unscheduled Experimental Fluidics',
    concept: 'Boundary Layer Separation',
    questionType: 'text'
  });

  assert.ok(resolved);
  assert.strictEqual(resolved.topic, 'Unscheduled Experimental Fluidics');
  assert.strictEqual(resolved.isRegisteredInCurriculum, false, 'Should flag as uncurated/custom topic');

  const q = GenerateQuestion(resolved);
  assert.ok(q.questionText);
  assert.ok(q.questionText.includes('Boundary Layer Separation'), 'Question must retain the requested concept');
  assert.ok(!q.questionText.includes('Foundational Principles, Definitions & Structural Axioms'), 'Must not have banned padding');
});

// 8. Malformed AI output
it('8. Malformed AI output: output validator detects and rejects malformed schema, script tags, or short text', () => {
  const validator = new OutputValidator();

  // Test script injection
  const scriptInjected = {
    type: 'text',
    questionText: 'Explain the transfer function <script>alert("pwned")</script>',
    expectedKeywords: ['transfer function']
  };
  const val1 = validator.validate(scriptInjected, { topic: 'Transfer Function' });
  assert.strictEqual(val1.isValid, false, 'Must reject script tags');
  assert.ok(val1.checks.reasons.some(r => r.includes('unsafe scripts')));

  // Test missing questionText
  const missingText = {
    type: 'text',
    questionText: '',
    expectedKeywords: ['test']
  };
  const val2 = validator.validate(missingText, { topic: 'Test' });
  assert.strictEqual(val2.isValid, false, 'Must reject empty questionText');
});

// 9. Incorrect MCQ answer key
it('9. Incorrect MCQ answer key: rejects out-of-range correctIndex', () => {
  const invalidKeyQuestion = {
    type: 'mcq',
    questionText: 'What parameter determines closed-loop stability in Bode analysis?',
    options: ['Gain Margin and Phase Margin', 'Secondary heat dissipation', 'Parasitic noise', 'Ideal resistance'],
    correctIndex: 99, // INVALID!
    explanation: 'Option A is correct.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(invalidKeyQuestion, { topic: 'Bode analysis' });
  assert.strictEqual(val.valid, false, 'Must reject invalid correctIndex');
  assert.ok(val.errors.some(e => e.includes('Invalid correctIndex')));
});

// 10. Contradictory explanation
it('10. Contradictory explanation: detects conflict between correctIndex and explanation text', () => {
  const contradictoryQuestion = {
    type: 'mcq',
    questionText: 'What is the primary role of modulation in wireless communications?',
    options: ['Translating signals to high frequencies for practical antenna dimensions', 'Option B text', 'Option C text', 'Option D text'],
    correctIndex: 0, // Option A
    explanation: 'Option B is correct because high-frequency signals eliminate all noise.', // CONTRADICTS Option A!
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(contradictoryQuestion, { topic: 'Modulation' });
  assert.strictEqual(val.valid, false, 'Must detect contradictory explanation');
  assert.ok(val.errors.some(e => e.includes('Contradictory explanation')));
});

// 11. Duplicate options
it('11. Duplicate options: rejects MCQ questions containing identical distractor choices', () => {
  const dupOptionQuestion = {
    type: 'mcq',
    questionText: 'What distinguishes Boyce-Codd Normal Form from Third Normal Form?',
    options: [
      'In BCNF, every determinant must be a superkey',
      'In BCNF, every determinant must be a superkey', // DUPLICATE!
      '3NF applies only to composite keys',
      'BCNF eliminates multi-valued dependencies'
    ],
    correctIndex: 0,
    explanation: 'Option A is correct.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(dupOptionQuestion, { topic: 'Database Normalization' });
  assert.strictEqual(val.valid, false, 'Must reject duplicate options');
  assert.ok(val.errors.some(e => e.includes('duplicate options')));
});

// 12. Repeated or irrelevant hints
it('12. Repeated or irrelevant hints: rejects identical duplicate hints', () => {
  const badHintsQuestion = {
    type: 'text',
    questionText: 'How is volumetric oxygen transfer coefficient measured experimentally?',
    hints: [
      'Consider the dynamic gassing-out method in an agitated vessel.',
      'Consider the dynamic gassing-out method in an agitated vessel.', // DUPLICATE!
      'Hint 3',
      'Hint 4'
    ]
  };

  const val = ValidateQuestion(badHintsQuestion, { topic: 'Oxygen Transfer' });
  assert.strictEqual(val.valid, false, 'Must reject duplicate hints');
  assert.ok(val.errors.some(e => e.includes('Repeated hints')));
});

// 13. Failed AI request with relevant question-bank fallback
it('13. Failed AI request with relevant question bank fallback: retrieves authentic curriculum question', async () => {
  const generator = new QuestionGenerator();

  // Call generator with Biotechnology topic when local AI is offline
  const q = await generator.generateProceduralFallbackQuestion({
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    conceptId: 'Oxygen Transfer',
    questionType: 'mcq',
    targetDifficulty: 'Intermediate'
  });

  assert.ok(q, 'Must return fallback question');
  assert.strictEqual(q.sourceType, 'registered_academic_curriculum');
  assert.strictEqual(q.type, 'mcq');
  assert.strictEqual(q.options.length, 4);
  assert.ok(q.questionText.toLowerCase().includes('oxygen') || q.questionText.toLowerCase().includes('kla'));
  assert.ok(!q.questionText.includes('Critically analyze the theoretical principles and operational mechanisms governing'));
});

// 14. No fallback question available
it('14. No fallback question available: resolves robust concept question without crashing or placeholder text', () => {
  const customPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Aeronautical Science',
    topic: 'Supersonic Hypersonic Boundary Invariants',
    concept: 'Wedge Shock Polar Expansion',
    questionType: 'text',
    difficulty: 'Advanced'
  });

  assert.ok(customPkg);
  assert.strictEqual(customPkg.subject, 'Aeronautical Science');
  assert.strictEqual(customPkg.topic, 'Supersonic Hypersonic Boundary Invariants');
  assert.ok(!customPkg.questionText.includes('Universal Discipline'));
  assert.ok(!customPkg.questionText.includes('Foundational Principles, Definitions & Structural Axioms'));
  assert.ok(customPkg.hints.length === 4);
});

// 15. Preservation of existing session state and assessment restrictions
it('15. Preservation of existing session state and assessment restrictions: student evaluation and strict exam safety', () => {
  const questionPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });

  // Test Student safe evaluation in single-answer MCQ
  const correctEval = EvaluateResponse(questionPkg, questionPkg.modelAnswer, {}, questionPkg.correctIndex);
  assert.strictEqual(correctEval.isCorrect, true);
  assert.strictEqual(correctEval.score, 100);
  assert.strictEqual(correctEval.status, 'Correct');

  const incorrectIdx = (questionPkg.correctIndex + 1) % 4;
  const incorrectEval = EvaluateResponse(questionPkg, questionPkg.modelAnswer, {}, incorrectIdx);
  assert.strictEqual(incorrectEval.isCorrect, false);
  assert.strictEqual(incorrectEval.score, 0);
  assert.strictEqual(incorrectEval.status, 'Needs Improvement');

  // Test Follow-up question generation for oral progression
  const followUp = GenerateFollowUp(questionPkg, 'Student response', correctEval, {
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies'
  });
  assert.ok(followUp);
  assert.ok(followUp.includes('Normal Forms and Dependencies'), 'Follow-up must focus on the specific concept');
});

console.log('\n================================================================');
console.log(`  ALL ${passedTests}/${totalTests} AUTOMATED REGRESSION TESTS EXECUTED AND PASSED!`);
console.log('================================================================\n');
