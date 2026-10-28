// tests/critical_generation_pipeline_gates.test.mjs
// VIVA ANALYSER — CRITICAL GENERATION PIPELINE FAILURE REPAIR REGRESSION SUITE
// Gates A through G Validation, Placeholder Eradication, and Grounded Communication Assessment.

import assert from 'assert';
import {
  ValidateQuestion,
  resolveAcademicContext,
  GenerateAcademicQuestionPackage,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';
import {
  autoDetectConcepts,
  generateConceptGroundedQuestions
} from '../src/services/subjectConceptOntology.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER: CRITICAL GENERATION PIPELINE REPAIR SUITE (GATES A-G)');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function runGateTest(name, fn) {
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
// 1. REPRODUCE AND REJECT EXACT SCREENSHOT FAILURE
// -----------------------------------------------------------------------------
runGateTest('1. Exact screenshot defect is strictly rejected by Gate B', () => {
  const screenshotFailureCandidate = {
    subject: 'Communication Engineering',
    topic: 'Curriculum Topic',
    concept: 'Core Concept',
    questionText: 'What fundamental governing principle and operational boundary define the foundational role of Governing Conservation Equations and Analytical Formulations in Communication Engineering?',
    options: [
      'It establishes the governing state-variable relations and mathematical constraints that maintain equilibrium',
      'It asserts that it operates completely detached from any boundary constraints or conservation equations',
      'It enforces an instantaneous zero-latency state transition with zero thermodynamic or computational cost',
      'It models it as an uncalibrated stochastic divergence without deterministic structure'
    ],
    correctIndex: 0,
    modelAnswer: 'It establishes the governing state-variable relations and mathematical constraints that maintain equilibrium',
    explanation: 'Option A is correct: foundational analysis requires rigorous formulation of state variables.',
    hints: [
      'Consider the formal mathematical definition.',
      'Examine how state variables interact.',
      'Recall boundary conditions and conservation laws.',
      'Analyze how state-variable constraints establish equilibrium.'
    ],
    type: 'mcq',
    format: 'Theory'
  };

  const validation = ValidateQuestion(screenshotFailureCandidate, {
    subjectName: 'Communication Engineering',
    topic: 'Curriculum Topic'
  });

  assert.strictEqual(validation.valid, false, 'Exact screenshot defect must fail validation');
  assert.ok(
    validation.failedGate === 'Gate A (Context Integrity)' || validation.failedGate === 'Gate B (Technical Meaning)',
    'Must fail at Gate A or Gate B'
  );
  assert.ok(
    validation.errors.some(e => e.includes('zero thermodynamic or computational cost') || e.includes('Curriculum Topic') || e.includes('Governing Conservation Equations')),
    'Must explicitly identify screenshot defect phrases'
  );
});

// -----------------------------------------------------------------------------
// 2. PLACEHOLDER TOPIC AND CONCEPT MAPPING
// -----------------------------------------------------------------------------
runGateTest('2. Placeholder topic "Curriculum Topic" maps to verified curriculum or is rejected', () => {
  // Communication Engineering has registered topic Digital Modulation
  const resolved = resolveAcademicContext({
    subjectName: 'Communication Engineering',
    topic: 'Curriculum Topic',
    concept: 'Core Concept'
  });

  assert.strictEqual(resolved.valid, true);
  assert.notStrictEqual(resolved.topic, 'Curriculum Topic', 'Must not retain placeholder topic');
  assert.notStrictEqual(resolved.concept, 'Core Concept', 'Must not retain placeholder concept');
  assert.ok(
    resolved.topic.toLowerCase().includes('modulation'),
    'Must resolve to genuine modulation topic for Communication Engineering'
  );

  // Unregistered subject with placeholder topic must be rejected
  const unregResolved = resolveAcademicContext({
    subjectName: 'Custom Unknown Subject',
    topic: 'Curriculum Topic',
    concept: 'Core Concept'
  });

  assert.strictEqual(unregResolved.valid, false, 'Unregistered placeholder must be rejected');
  assert.strictEqual(unregResolved.error, 'INVALID_TOPIC_PLACEHOLDER');
});

// -----------------------------------------------------------------------------
// 3. SEVEN-STAGE ACCEPTANCE GATES (GATES A THROUGH G)
// -----------------------------------------------------------------------------
runGateTest('3. Gate A rejects placeholder labels and context subject divergence', () => {
  const badQ = {
    subject: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'Core Concept', // Placeholder concept
    questionText: 'In digital modulation, explain the phase shift constellation mapping of QPSK.',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    modelAnswer: 'Option A',
    explanation: 'Option A is correct because QPSK uses four distinct constellation points.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const val = ValidateQuestion(badQ, { subjectName: 'Communication Engineering' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate A (Context Integrity)');
  assert.strictEqual(val.gates.gateA.passed, false);
});

runGateTest('4. Gate B rejects pseudotechnical boilerplate in options and question text', () => {
  const badOptionQ = {
    subject: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK Constellation',
    questionText: 'What primary advantage characterizes Quadrature Phase Shift Keying (QPSK) over BPSK in bandlimited RF channels?',
    options: [
      'Doubles spectral efficiency by transmitting two bits per symbol within identical bandwidth',
      'It operates completely detached from any boundary constraints',
      'It enforces an instantaneous zero-latency state transition with zero thermodynamic or computational cost',
      'It models signal phase as an uncalibrated stochastic divergence without deterministic structure'
    ],
    correctIndex: 0,
    modelAnswer: 'Doubles spectral efficiency by transmitting two bits per symbol within identical bandwidth',
    explanation: 'Option A is correct: QPSK maps two bits to each RF symbol state.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const val = ValidateQuestion(badOptionQ, { subjectName: 'Communication Engineering' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate B (Technical Meaning)');
  assert.strictEqual(val.gates.gateB.passed, false);
});

runGateTest('5. Gate C rejects missing question text or template interpolation leaks', () => {
  const leakQ = {
    subject: 'Computer Science',
    topic: 'Operating Systems',
    concept: 'Virtual Memory',
    questionText: 'How does ${cleanC} manage address translation in ${cleanTop}?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    modelAnswer: 'Option A',
    explanation: 'Option A is correct because the TLB caches page table entries.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const val = ValidateQuestion(leakQ, { subjectName: 'Computer Science' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate C (Question Quality)');
  assert.strictEqual(val.gates.gateC.passed, false);
});

runGateTest('6. Gate D validates numerical formulas and answer-key correctness', () => {
  const badNumQ = {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'Calculate the volumetric mass transfer rate for the given bioreactor.',
    options: ['0.24 mg/(L·s)', '0.08 mg/(L·s)', '0.48 mg/(L·s)', '2.40 mg/(L·s)'],
    correctIndex: 99, // Invalid index!
    modelAnswer: '0.24 mg/(L·s)',
    explanation: 'OTR is 0.24 mg/(L·s).',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Numerical',
    numericalDetails: {
      formula: 'OTR = kLa * (C* - CL)',
      calculatedValue: NaN // Invalid calculation!
    }
  };

  const val = ValidateQuestion(badNumQ, { subjectName: 'Biotechnology' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate D (Answer-Key Correctness)');
  assert.strictEqual(val.gates.gateD.passed, false);
});

runGateTest('7. Gate E rejects non-4 option sets or duplicate options', () => {
  const dupOptionQ = {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent?',
    options: [
      'Rate of oxygen transport across the gas-liquid interface',
      'Rate of oxygen transport across the gas-liquid interface', // Duplicate!
      'Total volumetric flow rate of sparged air',
      'Shear stress on filamentous cell walls'
    ],
    correctIndex: 0,
    modelAnswer: 'Rate of oxygen transport across the gas-liquid interface',
    explanation: 'Option A is correct.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const val = ValidateQuestion(dupOptionQ, { subjectName: 'Biotechnology' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate E (MCQ Integrity)');
  assert.strictEqual(val.gates.gateE.passed, false);
});

runGateTest('8. Gate F enforces 4-tier progressive hints and prevents answer leakage in Tiers 1-3', () => {
  const leakingHintQ = {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent?',
    options: [
      'Volumetric gas-liquid oxygen mass transfer coefficient',
      'Total volumetric air flow rate',
      'Rate of enzymatic substrate conversion',
      'Impeller shear stress'
    ],
    correctIndex: 0,
    modelAnswer: 'Volumetric gas-liquid oxygen mass transfer coefficient',
    explanation: 'Option A is correct: kLa combines liquid-side coefficient kL and specific area a.',
    hints: [
      'The answer is Volumetric gas-liquid oxygen mass transfer coefficient.', // Direct leak in Tier 1!
      'Consider the two-film theory.',
      'Think about kL and a.',
      'Use the formula OTR = kLa(C* - CL).'
    ],
    type: 'mcq',
    format: 'Theory'
  };

  const val = ValidateQuestion(leakingHintQ, { subjectName: 'Biotechnology' });
  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate F (Hint & Explanation Integrity)');
  assert.strictEqual(val.gates.gateF.passed, false);
});

runGateTest('9. Gate G detects duplicates via semantic and structural fingerprints', () => {
  const originalQ = {
    id: 'comm_q_101',
    semanticFingerprint: 'comm::digital_modulation::qpsk::in_digital_modulation_qpsk',
    subject: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK',
    questionText: 'In digital modulation, how does QPSK achieve twice the spectral efficiency of BPSK?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    modelAnswer: 'Option A',
    explanation: 'Option A is correct: QPSK maps two bits per symbol constellation.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
    type: 'mcq',
    format: 'Theory'
  };

  const seenFingerprints = new Set([originalQ.semanticFingerprint]);
  const val = ValidateQuestion(originalQ, {
    subjectName: 'Communication Engineering',
    seenFingerprints
  });

  assert.strictEqual(val.valid, false);
  assert.strictEqual(val.failedGate, 'Gate G (Duplicate Detection)');
  assert.strictEqual(val.gates.gateG.passed, false);
});

// -----------------------------------------------------------------------------
// 4. VERIFIED REPLACEMENT FOR COMMUNICATION ENGINEERING
// -----------------------------------------------------------------------------
runGateTest('10. Communication Engineering generation produces authentic modulation questions, never thermodynamics', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'Quadrature Phase Shift Keying (QPSK) Constellation and Phase States',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.valid, true, 'Package must be valid');
  assert.strictEqual(pkg.subject, 'Communication Engineering');
  assert.strictEqual(pkg.topic, 'Digital Modulation');
  assert.strictEqual(pkg.validation.valid, true);
  assert.strictEqual(pkg.validation.failedGate, null);

  const combinedText = (pkg.questionText + ' ' + pkg.options.join(' ') + ' ' + pkg.explanation).toLowerCase();
  assert.ok(
    combinedText.includes('qpsk') || combinedText.includes('phase') || combinedText.includes('constellation') || combinedText.includes('carrier') || combinedText.includes('symbol'),
    'Must contain authentic RF/telecom concepts'
  );
  assert.ok(!combinedText.includes('thermodynamic'), 'Must not contain thermodynamic references');
  assert.ok(!combinedText.includes('conservation equations'), 'Must not contain conservation equation references');
  assert.ok(!combinedText.includes('zero thermodynamic or computational cost'), 'Must not contain banned option');
});

// -----------------------------------------------------------------------------
// 5. AUTO-DETECT CONCEPTS PURGES PLACEHOLDERS
// -----------------------------------------------------------------------------
runGateTest('11. autoDetectConcepts purges "Curriculum Topic" and generates authentic domain concepts', () => {
  const detected = autoDetectConcepts('Communication Engineering', 'Curriculum Topic');
  assert.strictEqual(detected.subject, 'Communication Engineering');
  assert.notStrictEqual(detected.topic, 'Curriculum Topic');
  assert.ok(
    detected.concepts.every(c => !c.includes('Curriculum Topic') && !c.includes('Core Concept')),
    'Concepts must be free of placeholder strings'
  );
  assert.ok(
    detected.concepts.some(c => c.toLowerCase().includes('qpsk') || c.toLowerCase().includes('modulation') || c.toLowerCase().includes('carrier')),
    'Concepts must be relevant to Communication Engineering'
  );
});

// -----------------------------------------------------------------------------
// 6. MULTI-DISCIPLINE INTELLIGENCE: MECHANICAL & CIVIL ENGINEERING
// -----------------------------------------------------------------------------
runGateTest('12. Mechanical Engineering generates authentic Fourier conduction questions', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Mechanical Engineering',
    topic: 'Heat Transfer',
    concept: 'Fourier Conduction & Thermal Resistance',
    questionType: 'numerical'
  });

  assert.strictEqual(pkg.valid, true, 'Mechanical engineering package must be valid');
  assert.strictEqual(pkg.subject, 'Mechanical Engineering');
  assert.strictEqual(pkg.topic, 'Heat Transfer');
  assert.strictEqual(pkg.format, 'Numerical');
  assert.ok(pkg.numericalDetails, 'Must provide numericalDetails');
  assert.strictEqual(pkg.numericalDetails.calculatedValue, 3200, 'Conductive rate must equal 3200 W');
  assert.strictEqual(pkg.options[pkg.correctIndex], '3200 W (3.2 kW)');
});

runGateTest('13. Civil Engineering generates authentic Euler-Bernoulli beam questions', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Civil Engineering',
    topic: 'Structural Mechanics',
    concept: 'Euler-Bernoulli Beam Theory and Bending Stress',
    questionType: 'numerical'
  });

  assert.strictEqual(pkg.valid, true, 'Civil engineering package must be valid');
  assert.strictEqual(pkg.subject, 'Civil Engineering');
  assert.strictEqual(pkg.topic, 'Structural Mechanics');
  assert.strictEqual(pkg.format, 'Numerical');
  assert.strictEqual(pkg.numericalDetails.calculatedValue, 30, 'Bending stress must equal 30 MPa');
  assert.strictEqual(pkg.options[pkg.correctIndex], '30 MPa');
});

// -----------------------------------------------------------------------------
// 7. AUTHORITATIVE CONTEXT METADATA
// -----------------------------------------------------------------------------
runGateTest('14. resolveAcademicContext outputs authoritative context with canonical IDs and prerequisites', () => {
  const resolved = resolveAcademicContext({
    subjectName: 'Mechanical Engineering',
    topic: 'Heat Transfer',
    count: 5
  });

  assert.strictEqual(resolved.valid, true);
  assert.strictEqual(resolved.canonicalSubjectId, 'mech_eng');
  assert.ok(resolved.canonicalTopicId.includes('heat_transfer') || resolved.canonicalTopicId === 'heat transfer');
  assert.ok(Array.isArray(resolved.learningObjectives), 'Must provide learningObjectives array');
  assert.ok(Array.isArray(resolved.permittedPrerequisites), 'Must provide permittedPrerequisites');
  assert.strictEqual(resolved.syllabusSource, 'curriculum_registry');
  assert.strictEqual(resolved.requestedQuestionCount, 5);
});

// -----------------------------------------------------------------------------
// 8. MULTI-QUESTION BATCH INTEGRITY & DEDUPLICATION
// -----------------------------------------------------------------------------
runGateTest('15. Ten-question batch generates ten genuinely distinct, validated questions', () => {
  const list = generateConceptGroundedQuestions(
    'Communication Engineering',
    'Digital Modulation',
    'Quadrature Phase Shift Keying (QPSK) Constellation and Phase States',
    { count: 10, questionType: 'mcq' }
  );

  assert.strictEqual(list.length, 10, 'Must produce 10 questions');
  assert.ok(list.every(q => q.valid), 'All questions must pass validation');

  const texts = new Set(list.map(q => q.questionText));
  assert.strictEqual(texts.size, 10, 'All 10 questions must be distinct in text');

  const ids = new Set(list.map(q => q.id));
  assert.strictEqual(ids.size, 10, 'All 10 questions must have distinct IDs');

  // Verify none contain banned templates
  assert.ok(
    list.every(q => !q.questionText.includes('Governing Conservation Equations and Analytical Formulations in Communication Engineering')),
    'No circular generic topic expansions'
  );
  assert.ok(
    list.every(q => !(q.options || []).some(o => o.includes('zero thermodynamic or computational cost'))),
    'No banned distractor options'
  );
});

console.log(`\nResults: ${passCount} passed, ${failCount} failed.\n`);
if (failCount > 0) process.exit(1);
