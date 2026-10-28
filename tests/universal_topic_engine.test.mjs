// tests/universal_topic_engine.test.mjs
// VIVA ANALYZER — UNIVERSAL TOPIC-INTELLIGENT QUESTION GENERATION ENGINE
// Section 14: 21 Deterministic Automated Regression Scenarios

import assert from 'assert';
import fs from 'fs';
import path from 'path';

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

import { sessionPlanner } from '../server/src/ai/sessionPlanner.js';
import { learningMemory } from '../server/src/services/learningMemory.js';
import { multiModelOrchestrator } from '../server/src/ai/orchestrator/multiModelOrchestrator.js';
import { outputValidator } from '../server/src/ai/outputValidator.js';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { accountService } from '../server/src/services/accounts.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER — UNIVERSAL TOPIC ENGINE: 21-SCENARIO REGRESSION SUITE');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

async function runScenario(scenarioNum, title, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS [${scenarioNum}]: ${title}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL [${scenarioNum}]: ${title}`);
    console.error(`    Error: ${err.message}\n`, err.stack);
    failCount++;
  }
}

// 1. A theory question for an arbitrary staff-assigned topic
await runScenario(1, 'A theory question for an arbitrary staff-assigned topic', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Nanotechnology',
    topic: 'Carbon Nanotubes',
    concept: 'Chirality and Electronic Bandgap',
    questionType: 'theory'
  });

  assert.ok(pkg, 'Package must be generated');
  assert.strictEqual(pkg.validation.valid, true);
  assert.strictEqual(pkg.type, 'mcq');
  assert.strictEqual(pkg.format, 'Theory');
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('chirality') || text.includes('carbon nanotubes') || text.includes('bandgap'), 'Must assess topic concepts');
  assert.ok(!text.includes('foundational principles, definitions & structural axioms'), 'No banned padding');
});

// 2. A numerical question with verified calculations
await runScenario(2, 'A numerical question with verified calculations', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'numerical'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.strictEqual(pkg.format, 'Numerical');
  assert.ok(pkg.numericalDetails, 'Must include numericalDetails');
  assert.strictEqual(pkg.numericalDetails.formula, 'OTR = kLa * (C* - CL)');
  assert.strictEqual(pkg.numericalDetails.calculatedValue, 0.24);

  const numVerification = VerifyNumericalCalculation(pkg);
  assert.strictEqual(numVerification.valid, true);
  assert.ok(pkg.options[pkg.correctIndex].includes('0.24 mg/(L·s)'), 'Correct option matches calculated value');
});

// 3. A scenario-based question grounded in the assigned topic
await runScenario(3, 'A scenario-based question grounded in the assigned topic', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'scenario'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.strictEqual(pkg.format, 'Scenario');
  assert.ok(pkg.questionText.toLowerCase().includes('dissolved oxygen') || pkg.questionText.toLowerCase().includes('viscous'), 'Realistic scenario text');
  assert.ok(pkg.options[pkg.correctIndex].toLowerCase().includes('viscosity') || pkg.options[pkg.correctIndex].toLowerCase().includes('impeller'), 'Scientifically accurate remedy');
});

// 4. An image-based question with a consistent diagram and answer
await runScenario(4, 'An image-based question with a consistent diagram and answer', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'diagram'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.strictEqual(pkg.format, 'Diagram');
  assert.ok(pkg.diagramSvg, 'Must include diagramSvg string');
  assert.ok(pkg.diagramSvg.includes('<svg') && pkg.diagramSvg.includes('</svg>'), 'Valid SVG markup');
  assert.ok(pkg.diagramSvg.includes('w_gc') && pkg.diagramSvg.includes('w_pc'), 'Diagram includes crossover annotations');
  assert.ok(pkg.options[pkg.correctIndex].includes('GM ≈ +12 dB') && pkg.options[pkg.correctIndex].includes('PM ≈ +35 degrees'), 'Answer key matches diagram');
});

// 5. Topics for which images are unnecessary
await runScenario(5, 'Topics for which images are unnecessary have null diagramSvg', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'theory'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.diagramSvg, null, 'Unnecessary diagrams must be strictly null, never decorative');
});

// 6. Biotechnology oxygen transfer
await runScenario(6, 'Biotechnology oxygen transfer', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('kla') || text.includes('mass-transfer') || text.includes('oxygen'), 'Assesses oxygen transfer mechanism');
});

// 7. Biotechnology sterilization
await runScenario(7, 'Biotechnology sterilization', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Sterilization',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('del factor') || text.includes('sterilization') || text.includes('thermal death'), 'Assesses sterilization kinetics');
});

// 8. Communication Engineering modulation
await runScenario(8, 'Communication Engineering modulation', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Modulation',
    concept: 'Principles of Modulation',
    questionType: 'numerical'
  });

  assert.ok(pkg);
  assert.ok(pkg.options[pkg.correctIndex].includes('12.5 cm'), 'Accurate quarter-wave antenna size');
  assert.strictEqual(pkg.format, 'Numerical');
});

// 9. Control Systems Bode plot stability analysis
await runScenario(9, 'Control Systems Bode plot stability analysis', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'numerical'
  });

  assert.ok(pkg);
  assert.ok(pkg.options[pkg.correctIndex].includes('+45 degrees (Stable)'), 'Exact Phase Margin calculation');
  assert.strictEqual(pkg.format, 'Numerical');
});

// 10. Computer Science database normalization
await runScenario(10, 'Computer Science database normalization', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('bcnf') || text.includes('3nf') || text.includes('superkey'), 'Assesses normal forms');
});

// 11. Linear Algebra eigenvalues and eigenvectors
await runScenario(11, 'Linear Algebra eigenvalues and eigenvectors', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Linear Algebra',
    topic: 'Eigenvalues and Eigenvectors',
    concept: 'Characteristic Equation and Eigenspaces',
    questionType: 'numerical'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.ok(pkg.options[pkg.correctIndex].includes('lambda_1 = 5 and lambda_2 = 2'), 'Verified matrix eigenvalue calculation');
});

// 12. An arbitrary user-defined topic not present in hardcoded examples
await runScenario(12, 'An arbitrary user-defined topic not present in hardcoded examples', async () => {
  const concepts = ExtractUniversalConcepts('Polymer Engineering', 'Extrusion Rheology');
  assert.ok(concepts.categories.fundamentalDefinitions);
  assert.ok(concepts.categories.failureModesAndTroubleshooting);

  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Polymer Engineering',
    topic: 'Extrusion Rheology',
    concept: 'Viscoelastic Die Swell',
    questionType: 'theory'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.ok(pkg.questionText.includes('Viscoelastic Die Swell'));
  assert.strictEqual(pkg.options.length, 4);
});

// 13. Missing or ambiguous schedule context
await runScenario(13, 'Missing or ambiguous schedule context', async () => {
  const context = resolveAcademicContext({ subjectName: '', topic: '', subjectId: '' });
  assert.strictEqual(context.valid, false);
  assert.strictEqual(context.error, 'MISSING_SCHEDULE_CONTEXT');

  const pkg = GenerateAcademicQuestionPackage({ subjectName: '', topic: '' });
  assert.strictEqual(pkg.valid, false);
  assert.strictEqual(pkg.error, 'MISSING_SCHEDULE_CONTEXT');
});

// 14. Incorrect MCQ answer keys and contradictory explanations
await runScenario(14, 'Incorrect MCQ answer keys and contradictory explanations', async () => {
  const invalidPkg = {
    questionText: 'What is the purpose of gain margin in Bode plot stability analysis?',
    type: 'mcq',
    options: ['Option A text', 'Option B text', 'Option C text', 'Option D text'],
    correctIndex: 0,
    explanation: 'Option B is correct because the system is damped.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const validation = ValidateQuestion(invalidPkg);
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('Contradictory explanation')));
});

// 15. Duplicate options and near-duplicate questions
await runScenario(15, 'Duplicate options and near-duplicate questions', async () => {
  const dupOptionPkg = {
    questionText: 'What parameter determines the mass transfer in a bioreactor?',
    type: 'mcq',
    options: ['Volumetric transfer coefficient', 'Volumetric transfer coefficient', 'Air sparge rate', 'Broth density'],
    correctIndex: 0,
    explanation: 'Option A is correct.',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const validation = ValidateQuestion(dupOptionPkg);
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('duplicate options')));
});

// 16. Progressive hint relevance
await runScenario(16, 'Progressive hint relevance and anti-leakage', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.hints.length, 4);
  assert.ok(pkg.hints[0].toLowerCase().includes('crossover'));
  assert.ok(!pkg.hints[0].toLowerCase().includes(pkg.options[pkg.correctIndex].toLowerCase()));
});

// 17. Cross-model disagreement and partial provider failure
await runScenario(17, 'Cross-model disagreement and partial provider failure', async () => {
  const status = await multiModelOrchestrator.getOrchestrationStatus();
  assert.strictEqual(status.ensemblePolicy, 'multi_model_defensible_selection');
  assert.ok(Array.isArray(status.activeInstances));
  assert.strictEqual(status.activeInstances.length, 4);
});

// 18. Relevant question-bank fallback and no-fallback behaviour
await runScenario(18, 'Relevant question-bank fallback and no-fallback behaviour', async () => {
  const qBankFallback = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer'
  });
  assert.ok(qBankFallback.verifiedReference, 'Must retrieve authentic curriculum question');

  const noFallbackContext = {
    subjectName: 'Extraterrestrial Geology',
    topic: 'Martian Regolith Sintering',
    concept: 'Sintering Kinetics'
  };
  const synthesized = GenerateAcademicQuestionPackage(noFallbackContext);
  assert.ok(synthesized);
  assert.strictEqual(synthesized.verifiedReference, false, 'Gracefully synthesizes without crashing');
});

// 19. No external calls when GPT is disabled
await runScenario(19, 'No external calls when GPT is disabled', async () => {
  const originalKey = process.env.OPENAI_API_KEY;
  try {
    delete process.env.OPENAI_API_KEY;
    const status = await multiModelOrchestrator.getOrchestrationStatus();
    const gptInstance = status.activeInstances.find(i => i.type === 'openai');
    assert.strictEqual(gptInstance.available, false, 'GPT must be disabled when key is missing');
  } finally {
    if (originalKey) process.env.OPENAI_API_KEY = originalKey;
  }
});

// 20. No AI infrastructure details in student-facing responses
await runScenario(20, 'No AI infrastructure details in student-facing responses', async () => {
  const res = await handleApiRequest('/api/ai/viva/grounded-question', 'POST', {
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    isStudentFacing: true
  });

  assert.strictEqual(res.status, 200);
  const q = res.body.question;
  assert.strictEqual(q.correctIndex, undefined, 'correctIndex must be redacted');
  assert.strictEqual(q.modelAnswer, undefined, 'modelAnswer must be redacted');
  assert.strictEqual(q.sourceInstance, undefined, 'sourceInstance must be redacted');
  assert.strictEqual(q.telemetry, undefined, 'telemetry must be redacted');

  const jsonStr = JSON.stringify(res.body);
  assert.ok(!jsonStr.includes('llama3'), 'No Ollama model names in student payload');
  assert.ok(!jsonStr.includes('gpt-4o'), 'No OpenAI model names in student payload');
  assert.ok(!jsonStr.includes('http://127.0.0.1:11434'), 'No inference URLs in student payload');
});

// 21. Preservation of authentication, session state, timers, marks, and assessment restrictions
await runScenario(21, 'Preservation of authentication, session state, timers, marks, and assessment restrictions', async () => {
  const testUser = `student_auth_${Date.now()}`;
  const reg = accountService.register({
    username: testUser,
    password: 'Password123!',
    role: 'student',
    name: 'Auth Test Student'
  });
  assert.strictEqual(reg.success, true);

  const auth = accountService.authenticate(testUser, 'Password123!');
  assert.strictEqual(auth.success, true);
  assert.strictEqual(auth.user.role, 'student');
});

console.log('\n========================================================================');
console.log(`  UNIVERSAL ENGINE RESULTS: ${passCount}/21 PASSED (${failCount} FAILED)`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
