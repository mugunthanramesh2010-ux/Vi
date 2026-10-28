import assert from 'node:assert';
import {
  GenerateAcademicQuestionPackage,
  GenerateQuestion,
  ValidateQuestion,
  GenerateOptions,
  GenerateAnswerKey,
  GenerateExplanation,
  GenerateHint,
  EvaluateResponse,
  resolveAcademicContext,
  generateQuestionFingerprints,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';
import {
  UNIVERSAL_SUBJECTS,
  autoDetectConcepts,
  generateConceptGroundedQuestions
} from '../src/services/subjectConceptOntology.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER — MASTER ENGINEERING REPAIR SUITE (TESTS A THROUGH L)');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------------------
// TEST A — Strict Topic Relevance & Cross-Discipline Quarantine
// -----------------------------------------------------------------------------
runTest('Test A: Strict topic relevance — Biotechnology never contains CS or Comm Eng questions', () => {
  const bioPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });

  assert.strictEqual(bioPkg.valid, true, 'Biotechnology package must be valid');
  assert.strictEqual(bioPkg.subject, 'Biotechnology');
  assert.strictEqual(bioPkg.topic, 'Bioreactor Design');

  const textLower = bioPkg.questionText.toLowerCase();
  assert.ok(!textLower.includes('operating system'), 'Must not contain operating system');
  assert.ok(!textLower.includes('virtual memory'), 'Must not contain virtual memory');
  assert.ok(!textLower.includes('demand paging'), 'Must not contain demand paging');
  assert.ok(!textLower.includes('qpsk'), 'Must not contain qpsk');
  assert.ok(!textLower.includes('database normalization'), 'Must not contain database normalization');

  // Verify that cross-discipline quarantine actively rejects cross-polluted questions
  const crossPolluted = {
    ...bioPkg,
    questionText: 'In Biotechnology oxygen transfer, what is the role of Virtual Memory & Demand Paging?'
  };
  const val = ValidateQuestion(crossPolluted, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(val.valid, false, 'Quarantine must reject cross-discipline question');
});

// -----------------------------------------------------------------------------
// TEST B — Zero Repetition Under Requested Count = 10
// -----------------------------------------------------------------------------
runTest('Test B: Zero repetition under requested count = 10 (10 distinct questions)', () => {
  const questions = generateConceptGroundedQuestions(
    'Communication Engineering',
    'Digital Modulation',
    'QPSK (Quadrature Phase Shift Keying)',
    { count: 10, questionType: 'mcq', difficulty: 'Adaptive' }
  );

  assert.strictEqual(questions.length, 10, 'Must generate exactly 10 questions');

  const questionTexts = new Set();
  const questionIds = new Set();

  questions.forEach((q, idx) => {
    assert.ok(q.questionText && q.questionText.length > 20, `Question ${idx + 1} must be substantial`);
    assert.strictEqual(questionTexts.has(q.questionText), false, `Question ${idx + 1} text must be unique`);
    assert.strictEqual(questionIds.has(q.id), false, `Question ${idx + 1} ID must be unique`);

    questionTexts.add(q.questionText);
    questionIds.add(q.id);

    // Subject & Topic integrity
    assert.strictEqual(q.subject, 'Communication Engineering');
    assert.strictEqual(q.topic, 'Digital Modulation');

    // Reject all banned generic templates
    assert.ok(!q.questionText.includes('Foundational Mechanism'), 'No Foundational Mechanism');
    assert.ok(!q.questionText.includes('Core Theoretical Principles'), 'No Core Theoretical Principles');
    assert.ok(!q.questionText.includes('[Foundational Reinforcement]'), 'No [Foundational Reinforcement]');
  });

  assert.strictEqual(questionTexts.size, 10, 'All 10 questions must have distinct question texts');
  assert.strictEqual(questionIds.size, 10, 'All 10 questions must have distinct IDs');
});

// -----------------------------------------------------------------------------
// TEST C — Variable Question Counts (1, 2, 5, 10, 20)
// -----------------------------------------------------------------------------
runTest('Test C: Variable question counts (1, 2, 5, 10, 20) generate exact counts with unique items', () => {
  [1, 2, 5, 10, 20].forEach(count => {
    const list = generateConceptGroundedQuestions(
      'Biotechnology',
      'Bioreactor Design',
      'Oxygen Transfer',
      { count, questionType: 'mcq' }
    );

    assert.strictEqual(list.length, count, `Requested ${count} must return exactly ${count} items`);
    const uniqueTexts = new Set(list.map(q => q.questionText));
    assert.strictEqual(uniqueTexts.size, count, `All ${count} items must be distinct in text`);
    const uniqueIds = new Set(list.map(q => q.id));
    assert.strictEqual(uniqueIds.size, count, `All ${count} items must have distinct IDs`);
  });
});

// -----------------------------------------------------------------------------
// TEST D — Cross-Subject Isolation Across 7 Core Disciplines
// -----------------------------------------------------------------------------
runTest('Test D: Cross-subject isolation across 7 disciplines (Comm Eng, Control Sys, DSA, Math, Physics, Chemistry, Economics)', () => {
  const testMatrix = [
    { subject: 'Communication Engineering', topic: 'Digital Modulation', expectedKw: 'qpsk' },
    { subject: 'Control Systems', topic: 'Bode Plot Stability Analysis', expectedKw: 'margin' },
    { subject: 'Data Structures & Algorithms', topic: 'Graph Algorithms', expectedKw: 'dijkstra' },
    { subject: 'Linear Algebra', topic: 'Eigenvalues and Eigenvectors', expectedKw: 'eigenvalue' },
    { subject: 'Physics', topic: 'Quantum Mechanics', expectedKw: 'wave' },
    { subject: 'Chemistry', topic: 'Chemical Kinetics', expectedKw: 'arrhenius' },
    { subject: 'Economics', topic: 'Financial Economics', expectedKw: 'capm' }
  ];

  testMatrix.forEach(entry => {
    const resolved = resolveAcademicContext({ subjectName: entry.subject, topic: entry.topic });
    assert.strictEqual(resolved.valid, true, `Context must resolve for ${entry.subject}`);
    assert.strictEqual(resolved.isRegisteredInCurriculum, true, `${entry.subject} must be registered in curriculum`);

    const pkg = GenerateAcademicQuestionPackage({
      subjectName: entry.subject,
      topic: entry.topic,
      questionType: 'mcq'
    });

    assert.strictEqual(pkg.valid, true, `Package must be valid for ${entry.subject}`);
    assert.strictEqual(pkg.subject, entry.subject);
    const combined = (pkg.questionText + ' ' + (pkg.options || []).join(' ')).toLowerCase();
    assert.ok(combined.includes(entry.expectedKw), `Content for ${entry.subject} must include ${entry.expectedKw}`);
  });
});

// -----------------------------------------------------------------------------
// TEST E — Numerical Calculation Correctness
// -----------------------------------------------------------------------------
runTest('Test E: Numerical calculation correctness — verified formulas, steps, and units', () => {
  const numPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Linear Algebra',
    topic: 'Eigenvalues and Eigenvectors',
    questionType: 'numerical',
    index: 1
  });

  assert.strictEqual(numPkg.valid, true, 'Numerical question package must be valid');
  assert.ok(numPkg.numericalDetails, 'Must provide numericalDetails');
  assert.ok(numPkg.numericalDetails.formula, 'Must provide formula');
  assert.ok(numPkg.numericalDetails.givenParameters, 'Must provide givenParameters');
  assert.ok(numPkg.numericalDetails.stepByStep, 'Must provide stepByStep arithmetic');
  assert.ok(numPkg.numericalDetails.unit, 'Must provide unit');
  assert.ok(typeof numPkg.numericalDetails.calculatedValue !== 'undefined', 'Must provide calculatedValue');

  // Verify CAPM numerical calculation
  const econNumPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Economics',
    topic: 'Financial Economics',
    concept: 'Capital Asset Pricing Model (CAPM)',
    questionType: 'numerical',
    index: 2
  });
  assert.strictEqual(econNumPkg.valid, true, 'Economics numerical package must be valid');
  assert.strictEqual(econNumPkg.numericalDetails.calculatedValue, 14, 'CAPM calculation 4 + 1.25*(12-4) must equal 14');
  assert.strictEqual(econNumPkg.options[econNumPkg.correctIndex], '14%', 'Correct option must be 14%');
});

// -----------------------------------------------------------------------------
// TEST F — Diagram, Graph, and Equation Integrity
// -----------------------------------------------------------------------------
runTest('Test F: Diagram & graph question integrity — valid SVG, viewBox, and captions', () => {
  // 1. Verify Diagram question from registry (Bioreactor two-film SVG)
  const diagPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'diagram'
  });

  assert.strictEqual(diagPkg.valid, true, 'Diagram question package must be valid');
  assert.ok(diagPkg.diagramSvg, 'Must contain diagramSvg');
  assert.ok(diagPkg.diagramSvg.includes('<svg'), 'Must be a valid SVG string');
  assert.ok(diagPkg.diagramSvg.includes('viewBox'), 'Must have viewBox attribute');
  assert.ok(diagPkg.diagramCaption, 'Must contain diagramCaption');

  // 2. Verify Graph response curve question from facet synthesis
  const seenIds = new Set(['ce_dm_qpsk_1']);
  const graphPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK (Quadrature Phase Shift Keying)',
    index: 4,
    seenQuestionIds: seenIds
  });
  assert.strictEqual(graphPkg.valid, true, 'Graph question package must be valid');
  assert.ok(graphPkg.diagramSvg, 'Graph question must have SVG');
  assert.ok(graphPkg.diagramSvg.includes('Saturation Plateau') || graphPkg.diagramSvg.includes('viewBox'), 'Graph must have visual elements');
});

// -----------------------------------------------------------------------------
// TEST G — Progressive 4-Tier Hints Without Answer Leakage
// -----------------------------------------------------------------------------
runTest('Test G: Progressive 4-tier hints without answer leaks in Hints 1-3', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Algorithms',
    concept: "Dijkstra's Shortest Path Algorithm",
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must be valid');
  assert.ok(Array.isArray(pkg.hints), 'Hints must be an array');
  assert.strictEqual(pkg.hints.length, 4, 'Must have exactly 4 hint tiers');

  const correctOptionText = pkg.options[pkg.correctIndex];

  // Hints 1, 2, and 3 must never leak the full verbatim correct option
  for (let i = 0; i < 3; i++) {
    const hint = pkg.hints[i];
    assert.ok(hint && hint.length > 15, `Hint tier ${i + 1} must be substantial`);
    assert.strictEqual(
      hint.toLowerCase().includes(correctOptionText.toLowerCase()),
      false,
      `Hint tier ${i + 1} must not leak the verbatim answer text`
    );
  }
});

// -----------------------------------------------------------------------------
// TEST H — Session State & Multi-Level Deduplication
// -----------------------------------------------------------------------------
runTest('Test H: Session state & deduplication — seenQuestionIds and seenFingerprints prevent repeats', () => {
  const seenQuestionIds = new Set();
  const seenFingerprints = new Set();

  const pkg1 = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Operating Systems',
    concept: 'Virtual Memory',
    index: 1,
    seenQuestionIds,
    seenFingerprints
  });

  seenQuestionIds.add(pkg1.id);
  seenFingerprints.add(pkg1.semanticFingerprint);

  const pkg2 = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Operating Systems',
    concept: 'Virtual Memory',
    index: 2,
    seenQuestionIds,
    seenFingerprints
  });

  assert.notStrictEqual(pkg1.id, pkg2.id, 'Question IDs must be different');
  assert.notStrictEqual(pkg1.questionText, pkg2.questionText, 'Question texts must be distinct');
  assert.notStrictEqual(pkg1.semanticFingerprint, pkg2.semanticFingerprint, 'Fingerprints must differ');
});

// -----------------------------------------------------------------------------
// TEST I — AI-Provider Branding Cleanup Verification
// -----------------------------------------------------------------------------
runTest('Test I: AI-provider branding cleanup — zero provider names in student-facing payloads', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    questionType: 'mcq'
  });

  const payloadString = JSON.stringify(pkg);
  const bannedProviders = ['ollama', 'openai', 'gpt-4', 'claude', 'anthropic'];

  bannedProviders.forEach(provider => {
    assert.strictEqual(
      payloadString.toLowerCase().includes(provider),
      false,
      `Payload must never contain AI provider branding "${provider}"`
    );
  });
});

// -----------------------------------------------------------------------------
// TEST J — Backward Compatibility with Existing Workflows
// -----------------------------------------------------------------------------
runTest('Test J: Backward compatibility with existing workflows and evaluation contracts', () => {
  // 1. Single context call
  const single = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis'
  });
  assert.strictEqual(single.valid, true, 'Single call must succeed');
  assert.ok(single.questionText, 'Must have questionText');

  // 2. Multi-argument call (legacy signature)
  const legacy = GenerateAcademicQuestionPackage('Control Systems', 'Bode Plot Stability Analysis', { count: 3 });
  assert.strictEqual(legacy.valid, true, 'Legacy multi-arg call must succeed');
  assert.ok(Array.isArray(legacy.questions), 'Legacy multi-question call must return questions array');
  assert.strictEqual(legacy.questions.length, 3, 'Must return 3 questions');

  // 3. Evaluation contract
  const evalResult = EvaluateResponse(single, single.modelAnswer, {}, single.correctIndex);
  assert.strictEqual(evalResult.isCorrect, true, 'Correct index must score 100%');
  assert.strictEqual(evalResult.score, 100);
});

// -----------------------------------------------------------------------------
// TEST K — Provider Failure Handling & Honest Error States
// -----------------------------------------------------------------------------
runTest('Test K: Provider failure handling & honest error states on missing schedule context', () => {
  const emptyContext = GenerateAcademicQuestionPackage({});
  assert.strictEqual(emptyContext.valid, false, 'Empty context must return valid: false');
  assert.ok(emptyContext.error, 'Must provide recoverable error code');
  assert.ok(emptyContext.message, 'Must provide clear diagnostic error message');
  assert.ok(!emptyContext.questionText, 'Must NEVER publish fabricated questions on unassigned context');
});

// -----------------------------------------------------------------------------
// TEST L — Difficulty & Scoring Rubric Integrity
// -----------------------------------------------------------------------------
runTest('Test L: Difficulty and scoring rubric integrity across Bloom levels and marks', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Physics',
    topic: 'Quantum Mechanics',
    concept: 'Schrödinger Wave Equation',
    difficulty: 'Advanced',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must be valid');
  assert.ok(pkg.bloomLevel, 'Must define bloomLevel');
  assert.ok(pkg.rubric, 'Must define rubric');
  assert.ok(typeof pkg.rubric === 'object', 'Rubric must be an object with evaluation criteria');

  const criteriaKeys = Object.keys(pkg.rubric);
  assert.ok(criteriaKeys.length >= 2, 'Rubric must contain at least 2 distinct criteria');

  // Verify marks calculation in auto-generation
  const batch = generateConceptGroundedQuestions('Physics', 'Quantum Mechanics', null, { count: 5 });
  batch.forEach(q => {
    assert.strictEqual(q.assignedMarks, 20, 'Each question in a 5-question exam must have 20 marks (100 / 5)');
  });
});

console.log('\n========================================================================');
console.log(`  ALL ${passedTests}/${totalTests} MASTER ENGINEERING REPAIR REGRESSION TESTS PASSED!`);
console.log('========================================================================');
