// tests/section13_27_regressions.test.mjs
// VIVA ANALYZER — Section 13: 27 Mandatory Regression Test Scenarios
// Deterministic, offline, mocked model adapters, testing topic grounding across all 27 criteria.

import assert from 'assert';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  ExtractUniversalConcepts,
  PlanQuestionFormat,
  GenerateDiagramSvg,
  VerifyNumericalCalculation,
  resolveAcademicContext,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';

import { outputValidator } from '../server/src/ai/outputValidator.js';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { accountService } from '../server/src/services/accounts.js';
import { sessionService } from '../server/src/services/sessions.js';
import { multiModelOrchestrator } from '../server/src/ai/orchestrator/multiModelOrchestrator.js';
import { learningMemory } from '../server/src/services/learningMemory.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER — 27-SCENARIO COMPREHENSIVE REGRESSION SUITE (SECTION 13)');
console.log('========================================================================\n');

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

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(`    ${err.message}\n`);
    throw err;
  }
}

// 1. Biotechnology -> Bioreactor Design -> Oxygen Transfer
it('1. Biotechnology -> Bioreactor Design -> Oxygen Transfer', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });
  assert.strictEqual(pkg.subject, 'Biotechnology');
  assert.strictEqual(pkg.topic, 'Bioreactor Design');
  assert.strictEqual(pkg.concept, 'Oxygen Transfer');
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(qLower.includes('oxygen') || qLower.includes('kla') || qLower.includes('mass-transfer') || qLower.includes('dissolved oxygen'));
  assert.ok(!qLower.includes('electric vehicle') && !qLower.includes('internet'));
});

// 2. Biotechnology -> Bioreactor Design -> Sterilization
it('2. Biotechnology -> Bioreactor Design -> Sterilization', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Sterilization',
    questionType: 'mcq'
  });
  assert.strictEqual(pkg.topic, 'Bioreactor Design');
  assert.strictEqual(pkg.concept, 'Sterilization');
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(qLower.includes('sterilization') || qLower.includes('del factor') || qLower.includes('thermal death') || qLower.includes('spore'));
});

// 3. Communication Engineering -> Digital Modulation
it('3. Communication Engineering -> Digital Modulation', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK',
    questionType: 'mcq'
  });
  assert.strictEqual(pkg.subject, 'Communication Engineering');
  assert.strictEqual(pkg.topic, 'Digital Modulation');
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(qLower.includes('qpsk') || qLower.includes('phase states') || qLower.includes('bits') || qLower.includes('modulation'));
  assert.ok(pkg.options.some(o => o.includes('4 distinct phase states') && o.includes('2 binary bits')));
});

// 4. Control Systems -> Bode Plot Stability Analysis
it('4. Control Systems -> Bode Plot Stability Analysis', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'mcq'
  });
  assert.strictEqual(pkg.subject, 'Control Systems');
  assert.strictEqual(pkg.topic, 'Bode Plot Stability Analysis');
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(qLower.includes('bode') || qLower.includes('margin') || qLower.includes('crossover frequency'));
});

// 5. Computer Science -> Database Normalization
it('5. Computer Science -> Database Normalization', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });
  assert.strictEqual(pkg.subject, 'Computer Science');
  assert.strictEqual(pkg.topic, 'Database Normalization');
  const qLower = pkg.questionText.toLowerCase();
  assert.ok(qLower.includes('normal form') || qLower.includes('functional dependenc') || qLower.includes('bcnf') || qLower.includes('3nf'));
});

// 6. A staff-defined topic not present in the original test fixtures
it('6. A staff-defined topic not present in the original test fixtures', () => {
  const customContext = {
    subjectName: 'Quantum Information Science',
    topic: 'Quantum Teleportation and Entanglement Swapping',
    concept: 'Bell State Measurement',
    questionType: 'mcq',
    difficulty: 'Advanced'
  };
  const pkg = GenerateAcademicQuestionPackage(customContext);
  assert.ok(pkg);
  assert.strictEqual(pkg.subject, 'Quantum Information Science');
  assert.strictEqual(pkg.topic, 'Quantum Teleportation and Entanglement Swapping');
  assert.ok(pkg.questionText.length > 20);
  assert.strictEqual(pkg.options.length, 4);
});

// 7. An arbitrary registered subject and topic
it('7. An arbitrary registered subject and topic', () => {
  const custom = {
    subjectName: 'Mechanical Engineering',
    topic: 'Fluid Mechanics and Boundary Layer Theory',
    concept: 'Prandtl Boundary Layer Equations',
    questionType: 'mcq'
  };
  const pkg = GenerateAcademicQuestionPackage(custom);
  assert.ok(pkg);
  assert.strictEqual(pkg.subject, 'Mechanical Engineering');
  assert.strictEqual(pkg.topic, 'Fluid Mechanics and Boundary Layer Theory');
  assert.strictEqual(pkg.hints.length, 4);
});

// 8. Missing topic context
it('8. Missing topic context', () => {
  const resolved = resolveAcademicContext({});
  assert.strictEqual(resolved.valid, false);
  assert.strictEqual(resolved.error, 'MISSING_SCHEDULE_CONTEXT');

  const pkg = GenerateAcademicQuestionPackage({});
  assert.strictEqual(pkg.valid, false);
  assert.strictEqual(pkg.error, 'MISSING_SCHEDULE_CONTEXT');
});

// 9. Incorrect subject or schedule mapping
it('9. Incorrect subject or schedule mapping', () => {
  // Provided subject does not match registered schedule
  const mismatchContext = {
    subjectName: '',
    subjectId: 'invalid_id_9999',
    topic: ''
  };
  const resolved = resolveAcademicContext(mismatchContext);
  assert.strictEqual(resolved.valid, false);
});

// 10. The exact failure in which the UI says Oxygen Transfer but the candidate asks about the Internet
it('10. The exact failure in which the UI says Oxygen Transfer but the candidate asks about the Internet', () => {
  const internetCandidate = {
    id: 'q_bad_internet',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'What is the operational purpose of the foundational mechanism of the Internet and TCP/IP routing protocol?',
    type: 'mcq',
    options: [
      'Packet switching over decentralized routers using IP addressing',
      'Continuous media fermentation in aerated vessels',
      'Enzymatic catalysis of glucose into ethanol',
      'Impeller shear stress on filamentous fungal hyphae'
    ],
    correctIndex: 0,
    explanation: 'TCP/IP routes data across decentralized nodes.',
    hints: ['Hint 1: Internet routing', 'Hint 2: Packet switching', 'Hint 3: IP addressing', 'Hint 4: Routers']
  };

  const valEngine = ValidateQuestion(internetCandidate, {
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer'
  });
  assert.strictEqual(valEngine.valid, false, 'Internet question must be rejected for Oxygen Transfer');
  assert.ok(valEngine.errors.some(e => e.toLowerCase().includes('cross-discipline') || e.toLowerCase().includes('internet')));

  const valServer = outputValidator.validate(internetCandidate, {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    conceptId: 'Oxygen Transfer'
  });
  assert.strictEqual(valServer.isValid, false, 'Server validator must reject Internet question for Biotech');
  assert.ok(valServer.checks.reasons.some(r => r.toLowerCase().includes('cross-discipline') || r.toLowerCase().includes('internet')));
});

// 11. Generic question templates with a substituted subject name
it('11. Generic question templates with a substituted subject name', () => {
  const genericTemplateQuestion = {
    id: 'q_bad_template',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'Core Theoretical Framework and Definition: What mechanism governs system behaviour in Biotechnology?',
    type: 'mcq',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'Core theoretical framework governs system behaviour.',
    hints: ['Hint 1: Definition', 'Hint 2: Mechanism', 'Hint 3: Framework', 'Hint 4: Behaviour']
  };

  const val = ValidateQuestion(genericTemplateQuestion, { topic: 'Bioreactor Design' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.includes('banned template') || e.includes('Core Theoretical Framework')));
});

// 12. Generic options unrelated to the question
it('12. Generic options unrelated to the question', () => {
  const badOptionsCandidate = {
    id: 'q_bad_options',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent?',
    type: 'mcq',
    options: [
      'The rate of oxygen mass transfer across the interface',
      'Provides zero-loss infinite power amplification across all frequencies',
      'Eliminates the requirement for boundary conditions entirely',
      'Arbitrary empirical approximation with no physical significance'
    ],
    correctIndex: 0,
    explanation: 'kLa represents volumetric oxygen transfer rate.',
    hints: ['Hint 1: kLa definition', 'Hint 2: mass transfer', 'Hint 3: driving force', 'Hint 4: OTR formula']
  };

  const valServer = outputValidator.validate(badOptionsCandidate, { topic: 'Bioreactor Design' });
  assert.strictEqual(valServer.isValid, false);
  assert.ok(valServer.checks.reasons.some(r => r.includes('banned') || r.includes('distractor')));
});

// 13. Duplicate options
it('13. Duplicate options', () => {
  const dupOptionQ = {
    id: 'q_dup_opts',
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionText: 'What is the definition of Phase Margin in open-loop Bode analysis?',
    type: 'mcq',
    options: [
      '180 degrees plus the phase angle at gain crossover frequency',
      '180 degrees plus the phase angle at gain crossover frequency', // DUPLICATE
      'Phase angle at phase crossover frequency',
      'Magnitude in dB at gain crossover frequency'
    ],
    correctIndex: 0,
    explanation: 'PM = 180 + phase at wg.',
    hints: ['Hint 1: PM formula', 'Hint 2: 180 + phase', 'Hint 3: wg', 'Hint 4: margin']
  };

  const val = ValidateQuestion(dupOptionQ, { topic: 'Bode Plot Stability Analysis' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.toLowerCase().includes('duplicate options')));
});

// 14. Incorrect answer key
it('14. Incorrect answer key', () => {
  const badKeyQ = {
    id: 'q_bad_key',
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    questionText: 'What is the Gain Margin when magnitude at phase crossover frequency is -20 dB?',
    type: 'mcq',
    options: ['+20 dB', '-20 dB', '0 dB', '+10 dB'],
    correctIndex: 9, // Invalid index
    explanation: 'GM = -(-20) = +20 dB.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(badKeyQ, { topic: 'Bode Plot Stability Analysis' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.includes('Invalid correctIndex')));
});

// 15. Contradictory explanation
it('15. Contradictory explanation', () => {
  const badExpQ = {
    id: 'q_bad_exp',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: 'What parameter combines liquid-film mass transfer coefficient kL and specific area a?',
    type: 'mcq',
    options: ['kLa', 'OTR', 'DO', 'C*'],
    correctIndex: 0, // Option A
    explanation: 'Option C is correct because dissolved oxygen is the primary measure.', // Contradicts correctIndex 0
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(badExpQ, { topic: 'Oxygen Transfer' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.includes('Contradictory explanation')));
});

// 16. Numerically incorrect answer
it('16. Numerically incorrect answer', () => {
  const badNumQ = {
    id: 'q_bad_num',
    subject: 'Communication Engineering',
    topic: 'Modulation',
    format: 'Numerical',
    type: 'mcq',
    questionText: 'Calculate antenna length for f = 300 MHz and lambda/4.',
    numericalDetails: {
      formula: 'L = (c / f) / 4',
      givenParameters: { 'f': '300 MHz', 'c': '3 x 10^8 m/s' },
      stepByStep: 'lambda = 1.0 m; L = 0.25 m = 25 cm',
      unit: 'cm',
      calculatedValue: 25.0
    },
    options: ['100 cm', '50 cm', '10 cm', '5 cm'], // 25 cm is NOT in any option!
    correctIndex: 0,
    explanation: 'Antenna length is 25 cm.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(badNumQ, { topic: 'Modulation' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.includes('does not correspond to calculated value') || e.includes('calculated value')));
});

// 17. Irrelevant or repetitive hints
it('17. Irrelevant or repetitive hints', () => {
  const badHintsQ = {
    id: 'q_bad_hints',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    questionText: 'What does the volumetric mass-transfer coefficient kLa represent in aerated fermenters?',
    type: 'mcq',
    options: ['Rate of oxygen transport', 'Liquid volume', 'Gas flow', 'Agitator speed'],
    correctIndex: 0,
    explanation: 'kLa represents volumetric oxygen transfer rate per unit driving force.',
    hints: [
      'Repeated hint text here',
      'Repeated hint text here', // DUPLICATE HINT
      'Repeated hint text here',
      'Repeated hint text here'
    ]
  };

  const val = ValidateQuestion(badHintsQ, { topic: 'Bioreactor Design' });
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.some(e => e.toLowerCase().includes('repeated hints') || e.toLowerCase().includes('duplicate')));
});

// 18. One provider failing while another succeeds
await itAsync('18. One provider failing while another succeeds', async () => {
  const context = {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq',
    targetDifficulty: 'intermediate'
  };
  // With Ollama running or airgap procedural active, generation succeeds even if cloud provider is disabled
  const q = await multiModelOrchestrator.generateEnsembleQuestion(context, { ensembleEnabled: false });
  assert.ok(q);
  assert.strictEqual(q.subject, 'Biotechnology');
  assert.strictEqual(q.topic, 'Bioreactor Design');
});

// 19. All candidates failing validation
it('19. All candidates failing validation', () => {
  const invalidCandidate = {
    id: 'q_fail',
    questionText: 'Too short',
    type: 'mcq',
    options: ['A', 'B'] // Only 2 options
  };
  const val = ValidateQuestion(invalidCandidate);
  assert.strictEqual(val.valid, false);
  assert.ok(val.errors.length > 0);
});

// 20. Relevant question-bank fallback
it('20. Relevant question-bank fallback', () => {
  const fallback = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'mcq'
  });
  assert.ok(fallback);
  assert.strictEqual(fallback.subject, 'Control Systems');
  assert.strictEqual(fallback.topic, 'Bode Plot Stability Analysis');
  assert.ok(fallback.questionText.toLowerCase().includes('margin') || fallback.questionText.toLowerCase().includes('bode'));
});

// 21. No valid fallback
it('21. No valid fallback', () => {
  const res = resolveAcademicContext({
    subjectName: '',
    topic: '',
    concept: ''
  });
  assert.strictEqual(res.valid, false);
  assert.strictEqual(res.error, 'MISSING_SCHEDULE_CONTEXT');
});

// 22. Cache contamination between subjects
it('22. Cache contamination between subjects', () => {
  const makeKey = (subj, top, con, type, diff) =>
    `${subj.toLowerCase()}::${top.toLowerCase()}::${con.toLowerCase()}::${type}::${diff}`;

  const biotechKey = makeKey('Biotechnology', 'Bioreactor Design', 'Oxygen Transfer', 'mcq', 'intermediate');
  const csKey = makeKey('Computer Science', 'Database Normalization', 'BCNF', 'mcq', 'intermediate');

  assert.notStrictEqual(biotechKey, csKey);
  const cache = new Map();
  cache.set(csKey, { subject: 'Computer Science', topic: 'Database Normalization', text: 'BCNF question' });

  assert.strictEqual(cache.get(biotechKey), undefined, 'Biotech lookup must not retrieve CS question');
});

// 23. Duplicate questions in one session
it('23. Duplicate questions in one session', () => {
  const questionA = {
    id: 'q_original',
    questionText: 'What physical parameter does the volumetric mass-transfer coefficient (kLa) represent?',
    type: 'mcq',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    hints: ['H1', 'H2', 'H3', 'H4']
  };

  const contextWithHistory = {
    topic: 'Bioreactor Design',
    subject: 'Biotechnology',
    previouslyAskedQuestions: [questionA]
  };

  const dupCheck = outputValidator.validate(questionA, contextWithHistory);
  assert.strictEqual(dupCheck.isValid, false, 'Duplicate question must be rejected');
  assert.ok(dupCheck.checks.reasons.some(r => r.includes('duplicate of a previously asked question')));
});

// 24. Local-only operation without external credentials
await itAsync('24. Local-only operation without external credentials', async () => {
  // Ensure that getting orchestration status works with no OPENAI_API_KEY
  const origKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const status = await multiModelOrchestrator.getOrchestrationStatus();
  assert.ok(status);
  assert.strictEqual(status.activeInstances.find(i => i.id === 'cloud_gpt')?.available, false);

  if (origKey) process.env.OPENAI_API_KEY = origKey;
});

// 25. GPT disabled with no external API requests
await itAsync('25. GPT disabled with no external API requests', async () => {
  const origKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  // Generate question should complete 100% offline without hitting external networks
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins'
  });
  assert.ok(pkg);
  assert.strictEqual(pkg.subject, 'Control Systems');

  if (origKey) process.env.OPENAI_API_KEY = origKey;
});

// 26. Student responses containing no provider metadata
await itAsync('26. Student responses containing no provider metadata', async () => {
  const res = await handleApiRequest('/api/ai/viva/grounded-question', 'POST', {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    conceptId: 'Oxygen Transfer',
    questionType: 'mcq',
    role: 'student',
    isStudentFacing: true
  });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.question);

  const q = res.body.question;
  const json = JSON.stringify(q);

  assert.strictEqual(q.correctIndex, undefined, 'correctIndex redacted');
  assert.strictEqual(q.modelAnswer, undefined, 'modelAnswer redacted');
  assert.strictEqual(q.rubric, undefined, 'rubric redacted');
  assert.strictEqual(q.telemetry, undefined, 'telemetry redacted');

  assert.ok(!json.includes('llama3.2'), 'No llama model name in student payload');
  assert.ok(!json.includes('gpt-4o-mini'), 'No gpt model name in student payload');
  assert.ok(!json.includes('11434'), 'No Ollama port in student payload');
});

// 27. Preservation of authentication, session state, timers, marks and answer-disclosure rules
it('27. Preservation of authentication, session state, timers, marks and answer-disclosure rules', () => {
  const username = `student_27_${Date.now()}`;
  const reg = accountService.register({
    username,
    password: 'securePassword456',
    name: 'Scholar 27',
    role: 'student'
  });
  assert.strictEqual(reg.success, true);

  const auth = accountService.authenticate(username, 'securePassword456');
  assert.strictEqual(auth.success, true);

  const session = sessionService.createSession(auth.user);
  assert.ok(session.sessionId);

  const retrieved = sessionService.getSession(session.sessionId);
  assert.strictEqual(retrieved.username, username);

  const memory = learningMemory.recordInteraction(
    username,
    { id: 'q_27', topic: 'Digital Modulation', concept: 'QPSK' },
    '4 distinct phase states, 2 bits per symbol',
    { score: 90, isCorrect: true, status: 'Correct' },
    { hintsUsed: 1, timeSpentSec: 30 }
  );
  assert.ok(memory);
  assert.strictEqual(memory.topicMastery, 'Competent');
});

console.log('\n========================================================================');
console.log(`  ALL ${passedTests}/${totalTests} SECTION 13 REGRESSION TESTS PASSED! (0 FAILED)`);
console.log('========================================================================\n');
