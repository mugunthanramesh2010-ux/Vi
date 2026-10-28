// tests/critical_root_cause_template_elimination.test.mjs
// Deterministic Regression Suite: Eliminates Generic Question Templates & Verifies Academic Grounding

import assert from 'node:assert';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  createQuestionGenerationContract,
  invalidateDefectiveQuestionCaches,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';
import {
  generateConceptGroundedQuestions,
  autoDetectConcepts
} from '../src/services/subjectConceptOntology.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER — CRITICAL ROOT-CAUSE FIX: TEMPLATE ELIMINATION SUITE  ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// TEST A — MLOps: Continuous Deployment of ML Models
// -----------------------------------------------------------------------------
runTest('Test A — MLOps: Continuous Deployment of ML Models', () => {
  const contractRes = createQuestionGenerationContract({
    subjectName: 'MLOps',
    topic: 'Continuous Deployment of ML Models',
    concept: 'Data Drift and Concept Drift Monitoring',
    questionType: 'mcq'
  });

  assert.strictEqual(contractRes.valid, true, 'Contract should be formed successfully');
  assert.strictEqual(contractRes.contract.subjectName, 'MLOps');
  assert.strictEqual(contractRes.contract.assignedTopic, 'Continuous Deployment of ML Models');

  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'MLOps',
    topic: 'Continuous Deployment of ML Models',
    concept: 'Data Drift and Concept Drift Monitoring',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must pass validation');
  assert.strictEqual(pkg.subject, 'MLOps');
  assert.strictEqual(pkg.topic, 'Continuous Deployment of ML Models');

  const qText = pkg.questionText;
  const qLower = qText.toLowerCase();

  // Must test actual MLOps concepts
  const hasMLOpsConcepts = qLower.includes('data distribution') ||
    qLower.includes('drift') ||
    qLower.includes('validation accuracy') ||
    qLower.includes('production predictions');
  assert.ok(hasMLOpsConcepts, `Expected MLOps question to test drift/distribution, got: ${qText}`);

  // REJECT: Banned generic templates
  assert.strictEqual(qText.includes('Foundational Mechanism'), false, 'Must NOT contain "Foundational Mechanism"');
  assert.strictEqual(qText.includes('Direct Formulation'), false, 'Must NOT contain "Direct Formulation"');
  assert.strictEqual(qText.includes('Core Theoretical Framework'), false, 'Must NOT contain "Core Theoretical Framework"');
  assert.strictEqual(qText.includes('Structural Axioms'), false, 'Must NOT contain "Structural Axioms"');
  assert.strictEqual(qText.includes('operational performance'), false, 'Must NOT contain "operational performance"');

  // Verify options distinguish actual approaches (data-drift vs versioning vs container vs rollback)
  assert.strictEqual(pkg.options.length, 4, 'Must have 4 options');
  const optStr = pkg.options.join(' ').toLowerCase();
  assert.ok(optStr.includes('data-drift') || optStr.includes('data drift'), 'Options must include data-drift');
  assert.ok(optStr.includes('version') || optStr.includes('rollback'), 'Options must distinguish MLOps mechanisms');

  // Reject generic distractor templates
  assert.strictEqual(optStr.includes('passive measurement baseline'), false, 'Must NOT contain generic distractor');
  assert.strictEqual(optStr.includes('damping threshold'), false, 'Must NOT contain generic damping distractor');

  // Verify progressive hints
  assert.strictEqual(pkg.hints.length, 4, 'Must have 4 progressive hints');
  pkg.hints.forEach((h, idx) => {
    assert.strictEqual(h.includes('Foundational Mechanism'), false, `Hint ${idx + 1} must not contain generic template`);
    assert.strictEqual(h.includes('Level 1 — Concept Reminder: Consider the primary definition and physical mechanism'), false, `Hint ${idx + 1} must not contain generic hint template`);
  });
});

// -----------------------------------------------------------------------------
// TEST B — Biotechnology: Bioreactor Design -> Oxygen Transfer
// -----------------------------------------------------------------------------
runTest('Test B — Biotechnology: Bioreactor Design -> Oxygen Transfer', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must pass validation');
  assert.strictEqual(pkg.subject, 'Biotechnology');
  assert.strictEqual(pkg.topic, 'Bioreactor Design');

  const qLower = pkg.questionText.toLowerCase();
  const hasBioConcepts = qLower.includes('kla') ||
    qLower.includes('oxygen transfer') ||
    qLower.includes('dissolved oxygen') ||
    qLower.includes('bioreactor');
  assert.ok(hasBioConcepts, `Question must assess oxygen transfer, got: ${pkg.questionText}`);

  // REJECT: Cross-discipline contamination and generic templates
  assert.strictEqual(qLower.includes('internet'), false, 'Biotechnology must reject Internet');
  assert.strictEqual(qLower.includes('tcp/ip'), false, 'Biotechnology must reject TCP/IP');
  assert.strictEqual(qLower.includes('electric vehicle'), false, 'Biotechnology must reject EV');
  assert.strictEqual(pkg.questionText.includes('Foundational Mechanism'), false, 'Must NOT contain "Foundational Mechanism"');
  assert.strictEqual(pkg.questionText.includes('Direct Formulation'), false, 'Must NOT contain "Direct Formulation"');
});

// -----------------------------------------------------------------------------
// TEST C — Communication Engineering: Digital Modulation -> QPSK
// -----------------------------------------------------------------------------
runTest('Test C — Communication Engineering: Digital Modulation -> QPSK', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must pass validation');
  assert.strictEqual(pkg.subject, 'Communication Engineering');

  const qLower = pkg.questionText.toLowerCase();
  const hasQpsk = qLower.includes('qpsk') ||
    qLower.includes('phase states') ||
    qLower.includes('quadrature phase shift keying') ||
    qLower.includes('constellation');
  assert.ok(hasQpsk, `Question must assess QPSK concepts, got: ${pkg.questionText}`);

  // Verify options distinguish phase states and bits per symbol
  const optStr = pkg.options.join(' ').toLowerCase();
  assert.ok(optStr.includes('4 distinct phase states') || optStr.includes('2 binary bits'), 'Options must test QPSK phase/bit representation');

  // REJECT generic templates
  assert.strictEqual(pkg.questionText.includes('Foundational Mechanism'), false, 'Must NOT contain "Foundational Mechanism"');
  assert.strictEqual(pkg.questionText.includes('Core Theoretical Framework'), false, 'Must NOT contain "Core Theoretical Framework"');
});

// -----------------------------------------------------------------------------
// TEST D — Arbitrary Staff-Defined Topic
// -----------------------------------------------------------------------------
runTest('Test D1 — Arbitrary staff-defined topic with supplied concept knowledge', () => {
  const custom = {
    subjectName: 'Robotics Engineering',
    topic: 'Autonomous Mobile Navigation',
    concept: 'Simultaneous Localization and Mapping (SLAM)',
    questionType: 'mcq',
    difficulty: 'Intermediate'
  };

  const pkg = GenerateAcademicQuestionPackage(custom);
  assert.strictEqual(pkg.valid, true, 'Package should be valid when concrete concept is supplied');
  assert.strictEqual(pkg.subject, 'Robotics Engineering');
  assert.strictEqual(pkg.topic, 'Autonomous Mobile Navigation');
  assert.strictEqual(pkg.concept, 'Simultaneous Localization and Mapping (SLAM)');

  // Must not have banned phrases
  assert.strictEqual(pkg.questionText.includes('Foundational Mechanism'), false, 'Must NOT contain "Foundational Mechanism"');
  assert.strictEqual(pkg.questionText.includes('Direct Formulation'), false, 'Must NOT contain "Direct Formulation"');
  assert.strictEqual(pkg.questionText.includes('operational performance'), false, 'Must NOT contain "operational performance"');
  assert.strictEqual(pkg.options.length, 4);

  // Reject generic distractor templates
  pkg.options.forEach(opt => {
    assert.strictEqual(opt.includes('passive measurement baseline'), false, 'Option must not contain passive measurement baseline');
    assert.strictEqual(opt.includes('damping threshold'), false, 'Option must not contain damping threshold');
  });
});

runTest('Test D2 — Arbitrary topic with missing/empty context returns recoverable error', () => {
  const emptyContext = {};
  const resolved = resolveAcademicContext(emptyContext);
  assert.strictEqual(resolved.valid, false, 'Empty context must return valid: false');
  assert.strictEqual(resolved.error, 'MISSING_SCHEDULE_CONTEXT', 'Must report MISSING_SCHEDULE_CONTEXT');

  const pkg = GenerateAcademicQuestionPackage(emptyContext);
  assert.strictEqual(pkg.valid, false, 'Package generation must fail safely with missing context');
  assert.strictEqual(pkg.error, 'MISSING_SCHEDULE_CONTEXT');
});

// -----------------------------------------------------------------------------
// TEST E — Entire Five-Question Assessment Package Generator
// -----------------------------------------------------------------------------
runTest('Test E1 — 5-Question package generation for MLOps with distinct questions and zero generic boilerplate', () => {
  const pkg5 = generateConceptGroundedQuestions(
    'MLOps',
    'Continuous Deployment of ML Models',
    null,
    { count: 5, questionType: 'mcq', difficulty: 'Adaptive' }
  );

  assert.strictEqual(pkg5.length, 5, 'Must generate exactly 5 questions');

  const questionTexts = new Set();
  const conceptNames = new Set();

  pkg5.forEach((q, idx) => {
    assert.ok(q.questionText && q.questionText.length > 20, `Question ${idx + 1} text too short`);
    assert.strictEqual(q.options.length, 4, `Question ${idx + 1} must have 4 options`);
    assert.ok(typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3, `Question ${idx + 1} invalid correctIndex`);
    assert.ok(q.explanation && q.explanation.length > 15, `Question ${idx + 1} explanation missing`);
    assert.strictEqual(q.hints.length, 4, `Question ${idx + 1} must have 4 hints`);

    // Verify zero generic boilerplate in question, options, explanation, hints
    const combinedStr = `${q.questionText} ${q.options.join(' ')} ${q.explanation} ${q.hints.join(' ')}`;
    assert.strictEqual(combinedStr.includes('Foundational Mechanism and Direct Formulation'), false, `Question ${idx + 1} contains banned "Foundational Mechanism and Direct Formulation"`);
    assert.strictEqual(combinedStr.includes('Core Theoretical Framework'), false, `Question ${idx + 1} contains banned "Core Theoretical Framework"`);
    assert.strictEqual(combinedStr.includes('Structural Axioms'), false, `Question ${idx + 1} contains banned "Structural Axioms"`);
    assert.strictEqual(combinedStr.includes('operational performance'), false, `Question ${idx + 1} contains banned "operational performance"`);
    assert.strictEqual(combinedStr.includes('passive measurement baseline'), false, `Question ${idx + 1} contains generic distractor`);

    questionTexts.add(q.questionText);
    conceptNames.add(q.concept);
  });

  // Questions should not be duplicates
  assert.ok(questionTexts.size >= 4, `Questions must be distinct, got ${questionTexts.size} unique questions`);
});

runTest('Test E2 — Changing subject name alone on a generic question cannot bypass validation', () => {
  const fakePkg = {
    subject: 'MLOps',
    topic: 'Continuous Deployment of ML Models',
    concept: 'Foundational Mechanism and Direct Formulation',
    questionText: 'What physical or computational mechanism explains how Foundational Mechanism and Direct Formulation governs operational performance in Continuous Deployment of ML Models?',
    type: 'mcq',
    options: [
      'It governs the primary transfer mechanism and equilibrium response of Foundational Mechanism in Continuous Deployment.',
      'It acts as a passive measurement baseline that does not alter active transfer kinetics in Continuous Deployment.',
      'It isolates external environmental noise without altering core variables.',
      'It introduces a fixed damping threshold that only applies during complete system de-energization.'
    ],
    correctIndex: 0,
    explanation: 'The correct response accurately states the governing operational role of Foundational Mechanism in Continuous Deployment.',
    hints: [
      'Level 1 — Concept Reminder: Consider the primary definition and physical mechanism of Foundational Mechanism.',
      'Level 2 — Guided Reasoning: Examine the governing relationship.',
      'Level 3 — Specific Approach: Analyze how altering the primary operating variables changes the system state.',
      'Level 4 — Final Nudge: Focus on how conservation laws and steady-state equilibrium determine the output.'
    ]
  };

  const validation = ValidateQuestion(fakePkg, { subjectName: 'MLOps', topic: 'Continuous Deployment of ML Models' });
  assert.strictEqual(validation.valid, false, 'Validation MUST reject generic template even when subject says MLOps');
  assert.ok(validation.errors.length >= 2, 'Validation should return multiple template errors');
});

runTest('Test E3 — Cache Remediation invalidates defective templates while preserving legitimate records', () => {
  const records = [
    {
      id: 'legit_1',
      subject: 'Biotechnology',
      topic: 'Bioreactor Design',
      concept: 'Oxygen Transfer',
      questionText: 'What does the volumetric mass transfer coefficient kLa quantify in aerobic bioprocesses?'
    },
    {
      id: 'defective_1',
      subject: 'Biotechnology',
      topic: 'Bioreactor Design',
      concept: 'Foundational Mechanism and Direct Formulation',
      questionText: 'What physical or computational mechanism explains how Foundational Mechanism and Direct Formulation governs operational performance in Bioreactor Design?'
    },
    {
      id: 'legit_2',
      subject: 'MLOps',
      topic: 'Continuous Deployment of ML Models',
      concept: 'Data Drift Monitoring',
      questionText: 'Which monitoring mechanism detects changes in the statistical distribution of inference input features?'
    }
  ];

  const { valid, quarantined } = invalidateDefectiveQuestionCaches(records);
  assert.strictEqual(valid.length, 2, 'Should keep 2 valid records');
  assert.strictEqual(quarantined.length, 1, 'Should quarantine 1 defective record');
  assert.strictEqual(quarantined[0].id, 'defective_1');
  assert.strictEqual(valid[0].id, 'legit_1');
  assert.strictEqual(valid[1].id, 'legit_2');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
if (failCount === 0) {
  console.log(`  ALL ${passCount}/${passCount} TEMPLATE ELIMINATION TESTS PASSED! (0 FAILED)`);
} else {
  console.error(`  TEST FAILURES DETECTED: ${failCount} FAILED, ${passCount} PASSED`);
}
console.log('========================================================================\n');

if (failCount > 0) process.exit(1);
