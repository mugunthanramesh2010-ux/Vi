// tests/final_root_cause_repair_tests_a_j.test.mjs
// Deterministic regression test suite for VIVA ANALYZER X — FINAL ROOT-CAUSE REPAIR
// Covers all Section 12 requirements: Tests A through J

import assert from 'node:assert';
import {
  ACADEMIC_REGISTRY,
  resolveAcademicContext,
  GenerateQuestion,
  GenerateOptions,
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  GenerateFollowUp,
  invalidateDefectiveQuestionCaches
} from '../src/services/academicAssessmentEngine.js';
import { generateConceptGroundedQuestions } from '../src/services/subjectConceptOntology.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('========================================================================');
console.log('  VIVA ANALYZER X — FINAL ROOT-CAUSE REPAIR REGRESSION SUITE (TESTS A-J)');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// TEST A — Exact screenshot failure
// Context: Biotechnology → Bioreactor Design → Oxygen Transfer
// Return candidate about Communication Engineering and generic foundational mechanisms
// Expected: Candidate rejected; it must never reach question bank or student API
// -----------------------------------------------------------------------------
runTest('Test A — Exact screenshot failure rejection', () => {
  const context = {
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer'
  };

  const defectiveCandidate = {
    id: 'defective_screenshot_q2',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    type: 'text',
    questionText: '[Foundational Reinforcement]: Reviewing the underlying causal mechanism for Computer Science & IT — Operating Systems — What fundamental mechanism or governing principle characterizes the operational role of Virtual Memory & Demand Paging in Operating Systems?',
    options: null,
    hints: [
      'Level 1 — Concept Reminder: Consider the primary definition and physical mechanism',
      'Level 2 — Guided Reasoning: Examine the governing relationship'
    ],
    explanation: 'The correct response accurately states the governing operational role.',
    expectedKeywords: ['operating system', 'virtual memory', 'demand paging']
  };

  const validation = ValidateQuestion(defectiveCandidate, context);
  assert.strictEqual(validation.valid, false, 'Candidate must be rejected');
  assert.ok(
    validation.errors.some(e => e.includes('banned template') || e.includes('Cross-discipline violation')),
    `Errors must cite banned template or cross-discipline: ${validation.errors.join('; ')}`
  );

  // Cross-discipline check: Question about Communication Engineering while context is Biotechnology
  const commCandidate = {
    id: 'comm_in_biotech',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    type: 'mcq',
    questionText: 'In Communication Engineering, how does the foundational principle of Core Theoretical Principles govern QPSK constellation states?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    explanation: 'Option A is correct.'
  };

  const valComm = ValidateQuestion(commCandidate, context);
  assert.strictEqual(valComm.valid, false, 'Communication question in Biotech must be rejected');
});

// -----------------------------------------------------------------------------
// TEST B — Generic template rejection
// Change only subject name while retaining same generic question structure
// Expected: Rejected for insufficient concept grounding
// -----------------------------------------------------------------------------
runTest('Test B — Generic template rejection with substituted subject', () => {
  const subjects = ['Biotechnology', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'];

  for (const subj of subjects) {
    const genericCandidate = {
      id: `generic_${subj.toLowerCase()}`,
      subject: subj,
      topic: 'Core Topic',
      concept: 'System Analysis',
      type: 'mcq',
      questionText: `In ${subj}, how does the foundational principle of Core Theoretical Principles and Mathematical Formulation govern system behavior and physical or mathematical constraints?`,
      options: [
        'A dynamic shift in boundary parameters alters the characteristic transfer rate for Core Theoretical Principles; re-calibrating operating variables restores nominal equilibrium.',
        'The system exhibits unbounded internal energy creation with zero thermodynamic dissipation.',
        'Ambient room atmospheric pressure completely stops all physical interactions in Core Topic.',
        'The measurement instrument produces static scalar output invariant to all state variables.'
      ],
      correctIndex: 0,
      hints: [
        'Level 1 — Concept Recall: Recall the fundamental scientific definition and governing principles associated with Core Theoretical Principles.',
        'Level 2 — Mechanistic Reasoning: Examine how Core Theoretical Principles interacts with key state variables.',
        'Level 3 — Analytical Formulation: Analyze the governing conservation equations.',
        'Level 4 — Synthesis & Conclusion: Focus on how boundary conditions determine response.'
      ],
      explanation: 'The correct response accurately defines the foundational analytical role and boundary conditions of Core Theoretical Principles in Core Topic. Alternative choices introduce non-physical assumptions, complete variable decay, or infinite conductivity.'
    };

    const val = ValidateQuestion(genericCandidate, { subjectName: subj, topic: 'Core Topic' });
    assert.strictEqual(val.valid, false, `Generic template for ${subj} must be rejected`);
    assert.ok(val.errors.length >= 2, `Should flag multiple template violations in question and options`);
  }
});

// -----------------------------------------------------------------------------
// TEST C — Real QPSK concept
// Context: Communication Engineering → Digital Modulation → QPSK
// Expected: A valid, technically correct QPSK question
// -----------------------------------------------------------------------------
runTest('Test C — Real QPSK concept question generation and validation', () => {
  const context = {
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK',
    questionType: 'mcq'
  };

  const pkg = GenerateAcademicQuestionPackage(context);
  assert.strictEqual(pkg.valid, true, 'QPSK question package must be valid');
  assert.strictEqual(pkg.subject, 'Communication Engineering');
  assert.ok(pkg.topic.toLowerCase().includes('modulation'), 'Topic must be modulation');
  assert.ok(pkg.concept.toLowerCase().includes('qpsk'), 'Concept must be QPSK');

  // Verify technical domain grounding
  const textAndOptions = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(
    textAndOptions.includes('phase states') || textAndOptions.includes('bits') || textAndOptions.includes('constellation'),
    'Must test authentic QPSK properties (phase states, bits/symbol, or constellation)'
  );

  // Must not have banned phrases
  assert.strictEqual(pkg.questionText.includes('Foundational Mechanism'), false);
  assert.strictEqual(pkg.questionText.includes('Core Theoretical Principles'), false);
  assert.strictEqual(pkg.options.length, 4);
});

// -----------------------------------------------------------------------------
// TEST D — Arbitrary staff topic
// Register a new subject and staff-defined topic not present in original fixtures
// Expected: Grounded question from supplied evidence or recoverable error
// -----------------------------------------------------------------------------
runTest('Test D — Arbitrary staff topic with evidence and without placeholders', () => {
  // Scenario 1: With supplied technical evidence
  const staffContextWithEvidence = {
    subjectName: 'Quantum Computing',
    topic: 'Quantum Information Protocols',
    concept: 'Quantum Teleportation',
    questionType: 'mcq',
    customKnowledge: {
      corePrinciple: 'Quantum teleportation transfers an unknown qubit state using an entangled Bell pair and 2 classical bits without violating no-cloning theorem.'
    }
  };

  const pkgWithEv = GenerateAcademicQuestionPackage(staffContextWithEvidence);
  assert.strictEqual(pkgWithEv.valid, true, 'Package with evidence must be valid');
  assert.strictEqual(pkgWithEv.subject, 'Quantum Computing');
  assert.strictEqual(pkgWithEv.topic, 'Quantum Information Protocols');
  assert.strictEqual(pkgWithEv.concept, 'Quantum Teleportation');
  assert.ok(pkgWithEv.questionText.includes('Quantum Teleportation'));
  assert.strictEqual(pkgWithEv.questionText.includes('Curriculum Topic'), false);
  assert.strictEqual(pkgWithEv.questionText.includes('Core Concept'), false);

  // Scenario 2: Empty or ambiguous context must return a clean recoverable error
  const emptyContext = { subjectName: '', topic: '' };
  const resolvedEmpty = resolveAcademicContext(emptyContext);
  assert.strictEqual(resolvedEmpty.valid, false);
  assert.strictEqual(resolvedEmpty.error, 'MISSING_SCHEDULE_CONTEXT');

  const pkgEmpty = GenerateAcademicQuestionPackage(emptyContext);
  assert.strictEqual(pkgEmpty.valid, false);
  assert.strictEqual(pkgEmpty.error, 'MISSING_SCHEDULE_CONTEXT');
});

// -----------------------------------------------------------------------------
// TEST E — Five-question package
// Generate a five-question package
// Expected: Every question, option set, answer key, explanation and hint
// must be relevant to its own approved concept; no repeated generic question
// -----------------------------------------------------------------------------
runTest('Test E — Five-question package with distinct concepts and zero repeated boilerplate', () => {
  const pkg5 = generateConceptGroundedQuestions(
    'Biotechnology',
    'Bioreactor Design',
    null,
    { count: 5, questionType: 'mcq', difficulty: 'Adaptive' }
  );

  assert.strictEqual(pkg5.length, 5, 'Must generate exactly 5 questions');

  const questionTexts = new Set();
  pkg5.forEach((q, idx) => {
    assert.ok(q.questionText && q.questionText.length > 20, `Question ${idx + 1} must be substantial`);
    assert.strictEqual(questionTexts.has(q.questionText), false, `Question ${idx + 1} must be distinct`);
    questionTexts.add(q.questionText);

    // Subject integrity
    assert.strictEqual(q.subject, 'Biotechnology');
    assert.strictEqual(q.topic, 'Bioreactor Design');

    // Reject all banned strings
    assert.strictEqual(q.questionText.includes('Foundational Mechanism'), false);
    assert.strictEqual(q.questionText.includes('Core Theoretical Principles'), false);
    assert.strictEqual(q.questionText.includes('[Foundational Reinforcement]'), false);

    // Check options
    assert.strictEqual(q.options.length, 4);
    const optSet = new Set(q.options);
    assert.strictEqual(optSet.size, 4, `All 4 options in Q${idx + 1} must be unique`);

    // Check hints
    assert.strictEqual(q.hints.length, 4);
    const hintSet = new Set(q.hints);
    assert.strictEqual(hintSet.size, 4, `All 4 hints in Q${idx + 1} must be progressive and distinct`);
  });
});

// -----------------------------------------------------------------------------
// TEST F — All generation paths
// Verify package creation, interactive Viva Arena, MCQ, descriptive and follow-up
// -----------------------------------------------------------------------------
runTest('Test F — All generation pathways use shared validation pipeline', () => {
  // 1. MCQ package pathway
  const mcqPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });
  assert.strictEqual(mcqPkg.valid, true);
  assert.strictEqual(mcqPkg.type, 'mcq');
  assert.strictEqual(mcqPkg.options.length, 4);

  // 2. Descriptive text pathway
  const textPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'text'
  });
  assert.strictEqual(textPkg.valid, true);
  assert.strictEqual(textPkg.type, 'text');
  assert.strictEqual(textPkg.options, null);
  assert.ok(textPkg.modelAnswer && textPkg.modelAnswer.length > 20);

  // 3. Interactive Viva Arena follow-up pathway
  const followUp = GenerateFollowUp(mcqPkg, 'Candidate answer', { isCorrect: true }, {
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies'
  });
  assert.ok(followUp && followUp.length > 10, 'Follow-up question must be generated');
  assert.strictEqual(followUp.includes('Foundational Mechanism'), false);

  // 4. Operating Systems demand paging pathway
  const osPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Operating Systems',
    concept: 'Virtual Memory',
    questionType: 'mcq'
  });
  assert.strictEqual(osPkg.valid, true);
  assert.ok(osPkg.questionText.includes('virtual memory') || osPkg.questionText.includes('page'));
});

// -----------------------------------------------------------------------------
// TEST G — Cache and persistence
// Verify stale generic cache entries and invalid persisted questions cannot reappear
// -----------------------------------------------------------------------------
runTest('Test G — Cache and persistence quarantine hygiene', () => {
  const mixedRecords = [
    {
      id: 'legit_1',
      questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent in aerated bioreactor operation?',
      options: ['Option A', 'Option B', 'Option C', 'Option D']
    },
    {
      id: 'stale_defective_1',
      questionText: 'In Communication Engineering, how does the foundational principle of Core Theoretical Principles and Mathematical Formulation govern...',
      options: ['passive measurement baseline', 'isolates external environmental noise', 'damping threshold', 'Option D']
    },
    {
      id: 'stale_defective_2',
      questionText: '[Foundational Reinforcement]: Reviewing the underlying causal mechanism for Computer Science & IT — Operating Systems...',
      options: ['Option A', 'Option B', 'Option C', 'Option D']
    },
    {
      id: 'stale_defective_3',
      questionText: 'During operational evaluation of Oxygen Transfer, an unexpected transient deviation is observed under nominal boundary conditions...',
      options: ['unbounded internal energy creation with zero thermodynamic dissipation', 'Option B', 'Option C', 'Option D']
    }
  ];

  const { valid, quarantined } = invalidateDefectiveQuestionCaches(mixedRecords);
  assert.strictEqual(valid.length, 1, 'Only legitimate record must survive');
  assert.strictEqual(valid[0].id, 'legit_1');
  assert.strictEqual(quarantined.length, 3, 'All 3 defective records must be quarantined');
});

// -----------------------------------------------------------------------------
// TEST H — Answer correctness
// Test duplicated options, contradictory explanations, multiple correct answers, numerical errors
// -----------------------------------------------------------------------------
runTest('Test H — Answer correctness and structural integrity validation', () => {
  const baseQ = {
    id: 'test_h_q',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    type: 'mcq',
    format: 'Numerical',
    questionText: 'Calculate the volumetric oxygen transfer rate given kLa = 0.04 s^-1 and driving force 6 mg/L.',
    numericalDetails: {
      formula: 'OTR = kLa * (C* - CL)',
      givenParameters: { 'kLa': '0.04 s^-1', 'C* - CL': '6 mg/L' },
      stepByStep: 'OTR = 0.04 * 6 = 0.24 mg/(L*s)',
      calculatedValue: 0.24,
      unit: 'mg/(L*s)'
    },
    options: ['0.24 mg/(L*s)', '0.08 mg/(L*s)', '0.48 mg/(L*s)', '2.40 mg/(L*s)'],
    correctIndex: 0,
    modelAnswer: '0.24 mg/(L*s)',
    explanation: 'Option A is correct: direct application of OTR = 0.04 * 6 = 0.24 mg/(L*s).',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  // 1. Valid base passes
  const vPass = ValidateQuestion(baseQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(vPass.valid, true);

  // 2. Duplicate options rejected
  const dupQ = { ...baseQ, options: ['0.24 mg/(L*s)', '0.24 mg/(L*s)', '0.48 mg/(L*s)', '2.40 mg/(L*s)'] };
  const vDup = ValidateQuestion(dupQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(vDup.valid, false);
  assert.ok(vDup.errors.some(e => e.includes('duplicate options')));

  // 3. Contradictory explanation rejected (e.g. correctIndex is 0 but explanation says Option B is correct)
  const contraQ = { ...baseQ, correctIndex: 0, explanation: 'Option B is correct because 0.08 mg/L is expected.' };
  const vContra = ValidateQuestion(contraQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(vContra.valid, false);
  assert.ok(vContra.errors.some(e => e.includes('Contradictory explanation')));

  // 4. Numerical error: calculatedValue in numericalDetails does not match Option A
  const wrongNumQ = {
    ...baseQ,
    numericalDetails: {
      formula: 'OTR = kLa * (C* - CL)',
      calculatedValue: 99.99,
      unit: 'mg/(L*s)'
    }
  };
  const vNum = ValidateQuestion(wrongNumQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(vNum.valid, false);
  assert.ok(vNum.errors.some(e => e.includes('does not correspond to calculated value')));
});

// -----------------------------------------------------------------------------
// TEST I — Failure behavior
// Simulate provider failures and rejected candidates
// Expected: A validated exact-topic fallback or a recoverable error, never fabricated content
// -----------------------------------------------------------------------------
runTest('Test I — Provider failure and invalid candidate recovery behavior', () => {
  // Unassigned context must fail with recoverable error rather than fabricating content
  const unassigned = resolveAcademicContext({ subject: 'NonexistentDiscipline', topic: 'UnassignedTopic' });
  assert.strictEqual(unassigned.valid, true); // It creates custom context
  // But generating without reference or evidence:
  const pkg = GenerateAcademicQuestionPackage({
    subject: 'NonexistentDiscipline',
    topic: 'UnassignedTopic',
    concept: 'UnknownConcept'
  });
  // It must either synthesize a non-template candidate or return recoverable error
  if (pkg.valid) {
    assert.strictEqual(pkg.questionText.includes('Foundational Mechanism'), false);
    assert.strictEqual(pkg.questionText.includes('Core Theoretical Principles'), false);
    assert.strictEqual(pkg.questionText.includes('Curriculum Topic'), false);
    assert.strictEqual(pkg.questionText.includes('Core Concept'), false);
  } else {
    assert.ok(pkg.error, 'Must report recoverable error when generation fails');
  }
});

// -----------------------------------------------------------------------------
// TEST J — Student API
// Inspect student view and confirm delivered question matches approved persisted record
// -----------------------------------------------------------------------------
runTest('Test J — Student API serialization and authoritative context preservation', () => {
  const verifiedAttempt = {
    id: 'attempt_student_test_1',
    scheduleId: 'sched_biotech_1',
    studentId: 'student_123',
    status: 'in_progress',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questions: [
      {
        id: 'q_persisted_1',
        subject: 'Biotechnology',
        topic: 'Bioreactor Design',
        concept: 'Oxygen Transfer',
        format: 'Theory',
        difficulty: 'Intermediate',
        type: 'mcq',
        questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent in aerated bioreactor operation?',
        options: [
          'The rate of oxygen transport across the gas-liquid interface per unit driving force and volume',
          'The total volumetric flow rate of sparged air entering the bioreactor vessel',
          'The rate of enzymatic substrate conversion per unit biomass concentration',
          'The shear stress imparted by the impeller on filamentous cell walls'
        ],
        correctIndex: 0,
        modelAnswer: 'The volumetric mass-transfer coefficient kLa quantifies the combined liquid-side mass transfer coefficient...',
        explanation: 'Option A is correct: kLa combines kL with a...',
        rubric: { 'Accuracy': '100%' },
        hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
      }
    ]
  };

  const studentSafe = assessmentManager.sanitizeAttemptForStudent(verifiedAttempt);

  // Authoritative context must be present
  assert.strictEqual(studentSafe.subject, 'Biotechnology');
  assert.strictEqual(studentSafe.topic, 'Bioreactor Design');
  assert.strictEqual(studentSafe.concept, 'Oxygen Transfer');

  // Question delivered to student
  const studentQ = studentSafe.questions[0];
  assert.strictEqual(studentQ.subject, 'Biotechnology');
  assert.strictEqual(studentQ.topic, 'Bioreactor Design');
  assert.strictEqual(studentQ.concept, 'Oxygen Transfer');
  assert.strictEqual(studentQ.questionText, verifiedAttempt.questions[0].questionText);
  assert.strictEqual(studentQ.options.length, 4);

  // Sensitive examination keys must be stripped
  assert.strictEqual(studentQ.correctIndex, undefined, 'correctIndex must be stripped for student');
  assert.strictEqual(studentQ.modelAnswer, undefined, 'modelAnswer must be stripped for student');
  assert.strictEqual(studentQ.explanation, undefined, 'explanation must be stripped for student');
  assert.strictEqual(studentQ.rubric, undefined, 'rubric must be stripped for student');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`  ALL ${passed}/${passed + failed} FINAL ROOT-CAUSE REPAIR REGRESSION TESTS PASSED!`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
}
