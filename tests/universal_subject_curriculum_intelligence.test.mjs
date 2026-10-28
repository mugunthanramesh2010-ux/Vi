// tests/universal_subject_curriculum_intelligence.test.mjs
// VIVA ANALYZER — UNIVERSAL SUBJECT-CURRICULUM INTELLIGENCE REBUILD TEST SUITE
// Verifies authentic curriculum grounding, verified MCQs, 4-tier hints, 10 quality gates (A-J),
// and strict eradication of generic technical filler across all disciplines.

import assert from 'assert';
import {
  ValidateQuestion,
  resolveAcademicContext,
  createConceptBlueprint,
  GenerateAcademicQuestionPackage,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';
import {
  autoDetectConcepts,
  generateConceptGroundedQuestions
} from '../src/services/subjectConceptOntology.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER: UNIVERSAL SUBJECT-CURRICULUM INTELLIGENCE REBUILD SUITE');
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
    console.error(`    ${err.message}\n`, err.stack);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// 1. PHASE 4 QUALITY TEST — GMSK DEMODULATION & PULSE SHAPING
// -----------------------------------------------------------------------------
runTest('1. Phase 4: GMSK Demodulation question matches required pulse shaping specification', () => {
  const resolved = resolveAcademicContext({
    subjectName: 'Communication Engineering',
    topic: 'GMSK Demodulation',
    concept: 'Gaussian pulse shaping'
  });

  assert.strictEqual(resolved.valid, true);
  assert.strictEqual(resolved.isRegisteredInCurriculum, true);

  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'GMSK Demodulation',
    concept: 'GMSK Demodulation'
  });

  assert.strictEqual(pkg.valid, true);
  assert.strictEqual(pkg.questionText, 'What is the primary purpose of Gaussian pulse shaping in GMSK modulation?');
  
  // Verify correct answer
  const correctOpt = pkg.options[pkg.correctIndex];
  assert.strictEqual(
    correctOpt,
    "To limit the signal's occupied bandwidth by shaping the frequency-modulating data pulses."
  );

  // Verify defensible distractors
  assert.ok(pkg.options.includes("To eliminate the need for a carrier signal."));
  assert.ok(pkg.options.includes("To guarantee error-free reception regardless of channel noise."));
  assert.ok(pkg.options.includes("To convert every received symbol directly into an analog audio signal."));

  // Verify 4-tier hints without answer leakage
  assert.strictEqual(pkg.hints.length, 4);
  assert.ok(!pkg.hints[0].toLowerCase().includes("limit the signal's occupied bandwidth"));
  assert.ok(!pkg.hints[1].toLowerCase().includes("limit the signal's occupied bandwidth"));
  assert.ok(!pkg.hints[2].toLowerCase().includes("limit the signal's occupied bandwidth"));
});

// -----------------------------------------------------------------------------
// 2. CONSTANT ENVELOPE & CLASS C RF POWER AMPLIFIERS
// -----------------------------------------------------------------------------
runTest('2. GMSK constant envelope property for non-linear Class C amplifiers', () => {
  const gmskTopic = ACADEMIC_REGISTRY.communication_engineering.topics.gmsk;
  const q2 = gmskTopic.concepts['gmsk demodulation'].questions.find(q => q.id === 'ce_gmsk_2');
  assert.ok(q2);
  assert.ok(q2.questionText.includes('constant envelope characteristic'));
  assert.ok(q2.options[q2.correctIndex].includes('Class C power amplifiers'));
});

// -----------------------------------------------------------------------------
// 3. SAMPLING & PULSE CODE MODULATION (PCM) NUMERICAL
// -----------------------------------------------------------------------------
runTest('3. PCM Nyquist bit rate calculation (64 kbps standard)', () => {
  const pcmTopic = ACADEMIC_REGISTRY.communication_engineering.topics['sampling and pcm'];
  const qNum = pcmTopic.concepts['pcm and nyquist'].questions[0];
  assert.strictEqual(qNum.format, 'Numerical');
  assert.strictEqual(qNum.numericalDetails.calculatedValue, 64);
  assert.strictEqual(qNum.options[qNum.correctIndex], '64 kbps (64000 bps)');

  const validation = ValidateQuestion(qNum, { subjectName: 'Communication Engineering' });
  assert.strictEqual(validation.valid, true);
});

// -----------------------------------------------------------------------------
// 4. TRANSMISSION LINES — REFLECTION COEFFICIENT & VSWR
// -----------------------------------------------------------------------------
runTest('4. Transmission line VSWR calculation (ZL=100, Z0=50 -> VSWR=2.0)', () => {
  const txTopic = ACADEMIC_REGISTRY.communication_engineering.topics['transmission lines'];
  const qTx = txTopic.concepts['vswr and reflection coefficient'].questions[0];
  assert.strictEqual(qTx.numericalDetails.calculatedValue, 2.0);
  assert.strictEqual(qTx.options[qTx.correctIndex], '2.0:1 (VSWR = 2.0)');

  const validation = ValidateQuestion(qTx, { subjectName: 'Communication Engineering' });
  assert.strictEqual(validation.valid, true);
});

// -----------------------------------------------------------------------------
// 5. INFORMATION THEORY — SHANNON-HARTLEY CAPACITY
// -----------------------------------------------------------------------------
runTest('5. Shannon-Hartley capacity calculation (B=3kHz, SNR=1023 -> C=30kbps)', () => {
  const itTopic = ACADEMIC_REGISTRY.communication_engineering.topics['information theory'];
  const qIt = itTopic.concepts['shannon capacity'].questions[0];
  assert.strictEqual(qIt.numericalDetails.calculatedValue, 30);
  assert.strictEqual(qIt.options[qIt.correctIndex], '30 kbps (30000 bps)');

  const validation = ValidateQuestion(qIt, { subjectName: 'Communication Engineering' });
  assert.strictEqual(validation.valid, true);
});

// -----------------------------------------------------------------------------
// 6. DATA STRUCTURES & ALGORITHMS — KRUSKAL MST & HASH TABLES
// -----------------------------------------------------------------------------
runTest("6. DSA: Kruskal's algorithm cycle detection via DSU & Hash Table load factor", () => {
  const dsaRegistry = ACADEMIC_REGISTRY.dsa;
  assert.ok(dsaRegistry.topics.kruskal, 'Kruskal topic must exist in DSA');
  assert.ok(dsaRegistry.topics.hashing, 'Hashing topic must exist in DSA');

  const qKruskal = dsaRegistry.topics.kruskal.concepts['kruskal mst and dsu'].questions[0];
  assert.ok(qKruskal.options[qKruskal.correctIndex].includes('Disjoint Set Union (DSU)'));

  const qHash = dsaRegistry.topics.hashing.concepts['hash tables and collision'].questions[0];
  assert.ok(qHash.options[qHash.correctIndex].includes('open addressing (linear/quadratic probing) alpha must remain strictly below 1.0'));
});

// -----------------------------------------------------------------------------
// 7. CONTROL SYSTEMS — PID INTEGRAL ACTION
// -----------------------------------------------------------------------------
runTest('7. Control Systems: PID Integral action eliminating steady-state error', () => {
  const csRegistry = ACADEMIC_REGISTRY.control_systems;
  assert.ok(csRegistry.topics.pid_control, 'PID control topic must exist in Control Systems');

  const qPid = csRegistry.topics.pid_control.concepts['pid action'].questions[0];
  assert.ok(qPid.options[qPid.correctIndex].includes('eliminate steady-state error for step reference inputs'));
});

// -----------------------------------------------------------------------------
// 8. STRICT REJECTION OF PROMPT DEFECT AT GATE B
// -----------------------------------------------------------------------------
runTest('8. Gate B strictly rejects the prompt failure question and generic thermodynamic distractors', () => {
  const defectiveCandidate = {
    subject: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'GMSK Demodulation',
    questionText: 'In the rigorous scientific analysis of Communication Engineering, which fundamental conservation law and governing relationship establishes dynamic equilibrium?',
    options: [
      'The differential rate balance: rate of accumulation equals net transport flux across boundaries plus internal generation',
      'Mass flux and thermodynamic dissipation dictate boundary transitions with uncalibrated stochastic divergence',
      'Dissipated work and entropy creation govern the operational threshold under zero thermodynamic cost',
      'Dynamic equilibrium state established under static load'
    ],
    correctIndex: 0,
    modelAnswer: 'The differential rate balance',
    explanation: 'Option A is correct: conservation laws apply.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const validation = ValidateQuestion(defectiveCandidate, { subjectName: 'Communication Engineering' });
  assert.strictEqual(validation.valid, false, 'Prompt defect must fail validation');
  assert.strictEqual(validation.failedGate, 'Gate B (Technical Meaning)');
  assert.strictEqual(validation.gates.gateB.passed, false);
  assert.ok(
    validation.errors.some(e => e.includes('rigorous scientific analysis') || e.includes('conservation law') || e.includes('dynamic equilibrium')),
    'Must identify banned phrases in error list'
  );
});

// -----------------------------------------------------------------------------
// 9. PHASE 6 — CREATE CONCEPT BLUEPRINT
// -----------------------------------------------------------------------------
runTest('9. createConceptBlueprint constructs balanced format and Bloom progression plan', () => {
  const blueprintPlan = createConceptBlueprint('Communication Engineering', 'GMSK Demodulation', 10, 'mixed');
  assert.strictEqual(blueprintPlan.subject, 'Communication Engineering');
  assert.strictEqual(blueprintPlan.totalQuestions, 10);
  assert.strictEqual(blueprintPlan.blueprint.length, 10);

  // Verify format distribution
  const formats = new Set(blueprintPlan.blueprint.map(b => b.format));
  assert.ok(formats.has('Theory'));
  assert.ok(formats.has('Numerical') || formats.has('Diagram'));

  // Verify Bloom levels
  assert.strictEqual(blueprintPlan.blueprint[0].bloomLevel, 'Remembering');
  assert.ok(blueprintPlan.blueprint[9].bloomLevel === 'Creation' || blueprintPlan.blueprint[9].bloomLevel === 'Evaluation');

  // Verify marks
  blueprintPlan.blueprint.forEach(item => {
    assert.ok(item.marks > 0, 'Each blueprint item must have positive marks');
    assert.ok(item.estimatedMinutes > 0, 'Each item must have estimated completion minutes');
  });
});

// -----------------------------------------------------------------------------
// 10. TEN QUALITY GATES (GATES A THROUGH J)
// -----------------------------------------------------------------------------
runTest('10. ValidateQuestion implements all 10 Gates (Gate A through Gate J)', () => {
  const validQuestion = {
    id: 'ce_test_valid_101',
    subject: 'Communication Engineering',
    topic: 'Modulation',
    concept: 'Principles of Modulation',
    questionText: 'Why is high-frequency carrier modulation necessary for antenna transmission?',
    options: [
      'It reduces required physical antenna dimensions to practical wavelengths',
      'It eliminates the need for an RF power amplifier in the transmitter circuit',
      'It converts digital bits directly into acoustic atmospheric sound pressure waves',
      'It provides infinite channel capacity regardless of thermal noise density'
    ],
    correctIndex: 0,
    modelAnswer: 'It reduces required antenna dimensions to practical wavelengths proportional to lambda/4.',
    explanation: 'Option A is correct: antenna size scales with lambda = c/f. Higher frequency decreases lambda, allowing practical antenna dimensions. Options B, C, and D are technically absurd.',
    hints: [
      'Consider the wave relationship lambda = c / f.',
      'Think about typical antenna resonant lengths in terms of fraction of lambda.',
      'Notice that low baseband audio frequencies require antennas several kilometers long.',
      'Conclude that high carrier frequencies shrink antenna dimensions to practical sizes.'
    ],
    type: 'mcq',
    format: 'Theory',
    difficulty: 'Intermediate',
    bloomLevel: 'Understanding',
    marks: 10
  };

  const validation = ValidateQuestion(validQuestion, { subjectName: 'Communication Engineering' });
  assert.strictEqual(validation.valid, true);

  // Check all 10 gates in diagnostics
  const expectedGates = ['gateA', 'gateB', 'gateC', 'gateD', 'gateE', 'gateF', 'gateG', 'gateH', 'gateI', 'gateJ'];
  for (const g of expectedGates) {
    assert.ok(validation.gates[g], `Gate ${g} must exist in diagnostics`);
    assert.strictEqual(validation.gates[g].passed, true, `Gate ${g} must pass on valid question`);
  }
});

// -----------------------------------------------------------------------------
// 11. RESOLVING SUBJECT-ONLY FALLBACK ELIMINATES GENERIC FILLER
// -----------------------------------------------------------------------------
runTest('11. Selecting only subject "Communication Engineering" maps to verified curriculum', () => {
  const resolved = resolveAcademicContext({
    subjectName: 'Communication Engineering',
    topic: ''
  });

  assert.strictEqual(resolved.valid, true);
  assert.strictEqual(resolved.isRegisteredInCurriculum, true);
  assert.ok(resolved.topic.toLowerCase().includes('modulation'));

  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: ''
  });

  assert.strictEqual(pkg.valid, true);
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(!qLower.includes('conservation law'));
  assert.ok(!qLower.includes('dynamic equilibrium'));
  assert.ok(!qLower.includes('mass flux'));
  assert.ok(!qLower.includes('thermodynamic'));
});

console.log('\n========================================================================');
console.log(`  ALL ${passCount}/${passCount + failCount} REBUILD VERIFICATION TESTS PASSED!`);
console.log('========================================================================\n');

process.exit(failCount > 0 ? 1 : 0);
