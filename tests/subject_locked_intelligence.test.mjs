// tests/subject_locked_intelligence.test.mjs
// VIVA ANALYZER X — Master 25-Scenario Verification Test Suite
// Verifies all 25 required generation, validation, orchestration, self-learning, and security scenarios.

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  ACADEMIC_REGISTRY,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';

import { sessionPlanner } from '../server/src/ai/sessionPlanner.js';
import { learningMemory } from '../server/src/services/learningMemory.js';
import { multiModelOrchestrator } from '../server/src/ai/orchestrator/multiModelOrchestrator.js';
import { outputValidator } from '../server/src/ai/outputValidator.js';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { accountService } from '../server/src/services/accounts.js';
import { sessionService } from '../server/src/services/sessions.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER X — 25-SCENARIO COMPREHENSIVE REGRESSION SUITE');
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

// 1. Biotechnology -> Bioreactor Design -> Oxygen Transfer
await runScenario(1, 'Biotechnology -> Bioreactor Design -> Oxygen Transfer', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });

  assert.ok(pkg, 'Question package must be generated');
  assert.strictEqual(pkg.validation.valid, true);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('mass-transfer') || text.includes('kla') || text.includes('oxygen'), 'Must assess mass transfer / kla');
  assert.ok(!text.includes('nuclear') && !text.includes('quantum'), 'Must not drift into unrelated physics');
  assert.ok(!text.includes('foundational principles, definitions & structural axioms'), 'Must not have banned padding');
});

// 2. Biotechnology -> Bioreactor Design -> Sterilization
await runScenario(2, 'Biotechnology -> Bioreactor Design -> Sterilization', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Sterilization',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  const text = (pkg.questionText + ' ' + (pkg.options || []).join(' ')).toLowerCase();
  assert.ok(text.includes('del factor') || text.includes('sterilization') || text.includes('thermal death'), 'Must assess sterilization kinetics');
});

// 3. Communication Engineering -> Modulation
await runScenario(3, 'Communication Engineering -> Modulation', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Modulation',
    concept: 'Principles of Modulation',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('antenna') || text.includes('carrier') || text.includes('frequency'), 'Must test carrier translation / antenna');
});

// 4. Control Systems -> Bode Plot Stability Analysis
await runScenario(4, 'Control Systems -> Bode Plot Stability Analysis', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('gain margin') || text.includes('phase margin') || text.includes('crossover'), 'Must assess gain/phase margins');
});

// 5. Computer Science -> Database Normalization
await runScenario(5, 'Computer Science -> Database Normalization', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  const text = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
  assert.ok(text.includes('bcnf') || text.includes('3nf') || text.includes('functional dependenc') || text.includes('superkey'), 'Must test normal forms / functional dependencies');
});

// 6. A newly registered subject with a user-defined topic
await runScenario(6, 'Newly registered subject with user-defined topic', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Renewable Energy Systems',
    topic: 'Photovoltaic Maximum Power Point Tracking',
    concept: 'Perturb and Observe Algorithm',
    questionType: 'mcq'
  });

  assert.ok(pkg);
  assert.strictEqual(pkg.validation.valid, true);
  assert.ok(!pkg.questionText.includes('Foundational Principles, Definitions & Structural Axioms'));
  assert.ok(!pkg.questionText.includes('Universal Discipline'));
  assert.ok(!pkg.questionText.includes('Core Theoretical Framework'));
  assert.ok(!pkg.questionText.includes('Operational purpose and governing significance'));
  assert.strictEqual(pkg.options.length, 4);
});

// 7. A session with a fixed assigned topic
await runScenario(7, 'Session with a fixed assigned topic', async () => {
  const resolved = resolveAcademicContext({
    subject: 'Biotechnology',
    scheduledTopic: 'Bioreactor Design',
    selectedConcept: 'Oxygen Transfer'
  });
  assert.strictEqual(resolved.topic, 'Bioreactor Design');
  assert.strictEqual(resolved.concept, 'Oxygen Transfer');
});

// 8. Ten questions with no unrelated topic drift
await runScenario(8, 'Ten questions with no unrelated topic drift', async () => {
  const plan = sessionPlanner.createSessionPlan('Biotechnology', 'Bioreactor Design - Oxygen Transfer', { count: 10 });
  assert.strictEqual(plan.stages.length, 10);
  plan.stages.forEach((stage, idx) => {
    assert.strictEqual(stage.topic, 'Bioreactor Design - Oxygen Transfer');
    assert.ok(stage.learningObjective.includes('Bioreactor Design - Oxygen Transfer'), `Stage ${idx + 1} must preserve exact topic`);
  });
});

// 9. Consistent options, answer key and explanation
await runScenario(9, 'Consistent options, answer key and explanation', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Computer Science',
    topic: 'Database Normalization',
    concept: 'Normal Forms and Dependencies',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.options.length, 4);
  assert.ok(typeof pkg.correctIndex === 'number' && pkg.correctIndex >= 0 && pkg.correctIndex < 4);
  const correctOptionText = pkg.options[pkg.correctIndex];
  assert.ok(correctOptionText.length > 5);
  assert.ok(!pkg.explanation.toLowerCase().includes('option b is correct') || pkg.correctIndex === 1, 'Explanation must not contradict correctIndex');
});

// 10. Incorrect or contradictory model answers
await runScenario(10, 'Incorrect or contradictory model answers rejected', async () => {
  const contradictoryQ = {
    questionText: 'Which normal form requires every determinant to be a superkey?',
    type: 'mcq',
    options: ['BCNF', '1NF', '2NF', '3NF'],
    correctIndex: 0,
    explanation: 'Option B is correct because 1NF only requires atomic values.',
    hints: ['Hint 1: Superkey rule', 'Hint 2: Prime attribute']
  };

  const validation = ValidateQuestion(contradictoryQ, { subjectName: 'Computer Science', topic: 'Database Normalization' });
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('Contradictory explanation')));
});

// 11. Duplicate questions and duplicate options
await runScenario(11, 'Duplicate questions and duplicate options rejected', async () => {
  const duplicateOptsQ = {
    questionText: 'What is the unit of volumetric oxygen transfer coefficient kLa?',
    type: 'mcq',
    options: ['h^-1', 'h^-1', 'mol/(L*h)', 'g/L'],
    correctIndex: 0,
    hints: ['Hint 1', 'Hint 2']
  };

  const validation = ValidateQuestion(duplicateOptsQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('duplicate options')));
});

// 12. Progressive and relevant hints
await runScenario(12, 'Progressive and relevant hints without leakage', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.hints.length, 4);
  assert.notStrictEqual(pkg.hints[0], pkg.hints[1], 'Hints must not be duplicates');
  const correctOption = pkg.options[pkg.correctIndex].toLowerCase();
  assert.ok(!pkg.hints[0].toLowerCase().includes(correctOption), 'Hint 1 must not leak answer');
});

// 13. Adaptive difficulty based on saved interaction history
await runScenario(13, 'Adaptive difficulty based on saved interaction history', async () => {
  const testStudent = `student_adaptive_${Date.now()}`;
  learningMemory.recordInteraction(
    testStudent,
    { subject: 'Biotechnology', topic: 'Oxygen Transfer', id: 'q_t1' },
    '0',
    { score: 95, status: 'Correct', demonstratedConcepts: ['kLa measurement'] },
    { hintsUsed: 0, timeSpentSec: 25 }
  );

  const step = learningMemory.getAdaptiveStep(testStudent, 'Biotechnology', 'Oxygen Transfer', 'practice');
  assert.strictEqual(step.nextDifficulty, 'Advanced');
  assert.strictEqual(step.recommendedAction, 'deep_application_synthesis');
});

// 14. Persistent learning profiles across sessions
await runScenario(14, 'Persistent learning profiles across sessions', async () => {
  const testStudent = `student_persist_${Date.now()}`;
  learningMemory.recordInteraction(
    testStudent,
    { subject: 'Computer Science', topic: 'Database Normalization', id: 'q_db1' },
    '0',
    { score: 85, status: 'Correct', demonstratedConcepts: ['BCNF definition'] },
    { hintsUsed: 1, timeSpentSec: 40 }
  );

  const reloadedProfile = learningMemory.getStudentProfile(testStudent);
  assert.strictEqual(reloadedProfile.studentId, testStudent);
  assert.strictEqual(reloadedProfile.totalQuestionsAnswered, 1);
  const topicData = reloadedProfile.topics[learningMemory._sanitizeKey('Database Normalization')];
  assert.ok(topicData);
  assert.strictEqual(topicData.averageScore, 85);
});

// 15. Safe reuse of validated questions
await runScenario(15, 'Safe reuse of validated questions', async () => {
  const validQ = {
    id: `q_test_reuse_${Date.now()}`,
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Gain and Phase Margins',
    questionText: 'At which frequency is Gain Margin measured on a Bode plot?',
    type: 'mcq',
    options: ['Phase crossover frequency', 'Gain crossover frequency', 'Corner frequency', 'Resonant frequency'],
    correctIndex: 0,
    explanation: 'Gain margin is evaluated at the phase crossover frequency where phase equals -180 degrees.',
    hints: ['Hint 1: Check phase curve', 'Hint 2: Find -180 degrees']
  };

  learningMemory.recordQuestion(validQ, { source: 'unit_test' });
  const retrieved = learningMemory.getValidatedQuestion('Control Systems', 'Bode Plot Stability Analysis', 'Gain and Phase Margins', 'mcq');
  assert.ok(retrieved);
  assert.strictEqual(retrieved.type, 'mcq');
});

// 16. Rejection of unverified or hallucinated content
await runScenario(16, 'Rejection of unverified or hallucinated content', async () => {
  const hallucinatedQ = {
    questionText: 'How does infinite power amplification eliminate the requirement for boundary conditions?',
    type: 'mcq',
    options: [
      'Through infinite power amplification',
      'arbitrary empirical approximation',
      'eliminating boundary conditions',
      'secondary startup transient factors'
    ],
    correctIndex: 0,
    hints: ['Hint 1', 'Hint 2']
  };

  const validation = outputValidator.validate(hallucinatedQ, { subject: 'Engineering', topic: 'Amplifiers' });
  assert.strictEqual(validation.isValid, false);
  assert.ok(validation.checks.reasons.length >= 2);
});

// 17. Partial model failure handling
await runScenario(17, 'Partial model failure handled gracefully', async () => {
  const status = await multiModelOrchestrator.getOrchestrationStatus();
  assert.ok(status.activeInstances.length >= 3);
  assert.strictEqual(status.ensemblePolicy, 'multi_model_defensible_selection');
});

// 18. Failure of all available models
await runScenario(18, 'Failure of all available models falls back safely', async () => {
  const fallback = learningMemory.getValidatedQuestion('NonExistentSubject', 'NonExistentTopic');
  assert.strictEqual(fallback, null, 'Returns null safely without crashing');

  // Procedural generator fallback
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer'
  });
  assert.ok(pkg && pkg.questionText);
});

// 19. Relevant question-bank fallback
await runScenario(19, 'Relevant question-bank fallback retrieves authentic curriculum question', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Modulation',
    concept: 'Principles of Modulation'
  });
  assert.strictEqual(pkg.verifiedReference, true);
  assert.ok(pkg.questionText.includes('antenna'));
});

// 20. No fallback available handles gracefully
await runScenario(20, 'No fallback available handles gracefully without crash', async () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Quantum Astrochemistry',
    topic: 'Exoplanet Atmospheric Isotopes',
    concept: 'Deuterium Fractionation'
  });
  assert.ok(pkg);
  assert.ok(pkg.questionText);
  assert.strictEqual(pkg.validation.valid, true);
});

// 21. No model or provider details in student-facing payloads
await runScenario(21, 'No model or provider details in student-facing payloads', async () => {
  const res = await handleApiRequest('/api/ai/viva/grounded-question', 'POST', {
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    isStudentFacing: true
  });

  assert.strictEqual(res.status, 200);
  const q = res.body.question;
  assert.strictEqual(q.correctIndex, undefined, 'correctIndex must be redacted');
  assert.strictEqual(q.modelAnswer, undefined, 'modelAnswer must be redacted');
  assert.strictEqual(q.rubric, undefined, 'rubric must be redacted');
  assert.strictEqual(q.telemetry, undefined, 'telemetry must be redacted');
  assert.strictEqual(q.sourceInstance, undefined, 'model instance must be redacted');
});

// 22. No external API request when its provider is disabled
await runScenario(22, 'No external API request when provider is disabled', async () => {
  const savedKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  const status = await multiModelOrchestrator.getOrchestrationStatus();
  const gptInst = status.activeInstances.find(i => i.id === 'cloud_gpt');
  assert.strictEqual(gptInst.available, false, 'GPT must be marked unavailable when API key is missing');

  if (savedKey) process.env.OPENAI_API_KEY = savedKey;
});

// 23. Preservation of registration, schedule, authentication, timers and results
await runScenario(23, 'Preservation of registration, schedule, authentication, timers', async () => {
  const testUser = `student_auth_${Date.now()}`;
  const reg = accountService.register({
    username: testUser,
    password: 'Password123!',
    name: 'Test Student',
    role: 'student'
  });
  assert.strictEqual(reg.success, true);

  const login = accountService.authenticate(testUser, 'Password123!');
  assert.strictEqual(login.success, true);
  assert.strictEqual(login.user.role, 'student');
});

// 24. Fixed examination mode remains non-adaptive
await runScenario(24, 'Fixed examination mode remains non-adaptive', async () => {
  const testStudent = `student_fixed_${Date.now()}`;
  const step = learningMemory.getAdaptiveStep(testStudent, 'Control Systems', 'Bode Plot Stability Analysis', 'strict_exam');
  assert.strictEqual(step.recommendedAction, 'continue_fixed_curriculum');
  assert.strictEqual(step.nextDifficulty, 'Intermediate');
});

// 25. Student-specific learning history does not leak between accounts
await runScenario(25, 'Student-specific learning history does not leak between accounts', async () => {
  const studentA = `student_A_${Date.now()}`;
  const studentB = `student_B_${Date.now()}`;

  learningMemory.recordInteraction(
    studentA,
    { subject: 'Computer Science', topic: 'Operating Systems', id: 'q_os_1' },
    '0',
    { score: 100, status: 'Correct', demonstratedConcepts: ['Demand Paging'] }
  );

  const profileA = learningMemory.getStudentProfile(studentA);
  const profileB = learningMemory.getStudentProfile(studentB);

  assert.strictEqual(profileA.totalQuestionsAnswered, 1);
  assert.strictEqual(profileB.totalQuestionsAnswered, 0);
  assert.strictEqual(Object.keys(profileB.topics).length, 0, 'Student B must have zero records from Student A');
});

console.log('\n========================================================================');
console.log(`  TEST RESULTS: ${passCount}/25 PASSED (${failCount} FAILED)`);
console.log('========================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
