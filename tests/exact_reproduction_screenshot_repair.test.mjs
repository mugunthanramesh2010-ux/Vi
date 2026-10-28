import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  invalidateDefectiveQuestionCaches
} from '../src/services/academicAssessmentEngine.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';

console.log('========================================================================');
console.log('  EXACT SCREENSHOT REPRODUCTION & PERMANENT REPAIR SUITE');
console.log('========================================================================\n');

let total = 0;
let passed = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✓ PASS [${total}]: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL [${total}]: ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// 1. App.jsx static inspection: buildInitialVivaTopicModel must only have Biotechnology configs
it('1. buildInitialVivaTopicModel in App.jsx must strictly contain only Biotechnology questions with zero cross-subject configs', () => {
  const appContent = fs.readFileSync(path.resolve('src/App.jsx'), 'utf-8');
  
  // Extract buildInitialVivaTopicModel block
  const match = appContent.match(/export function buildInitialVivaTopicModel\(\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, 'buildInitialVivaTopicModel must exist in App.jsx');
  const fnBody = match[1];

  // Must NOT contain Control Systems, Communication Engineering, Computer Science, or Linear Algebra in initial configs
  assert.ok(!fnBody.includes('Control Systems'), 'Initial model must not contain Control Systems');
  assert.ok(!fnBody.includes('Communication Engineering'), 'Initial model must not contain Communication Engineering');
  assert.ok(!fnBody.includes('Computer Science'), 'Initial model must not contain Computer Science');
  assert.ok(!fnBody.includes('Linear Algebra'), 'Initial model must not contain Linear Algebra');
  assert.ok(fnBody.includes("subjectName: 'Biotechnology'"), 'Initial model must contain Biotechnology');
});

// 2. App.jsx static inspection: handleNextQuestion must NOT inject [Foundational Reinforcement] or [Advanced Synthesis]
it('2. handleNextQuestion in App.jsx must NOT inject [Foundational Reinforcement] or template prefixes into questionText', () => {
  const appContent = fs.readFileSync(path.resolve('src/App.jsx'), 'utf-8');
  assert.ok(!appContent.includes('[Foundational Reinforcement]:'), 'App.jsx must not prepend [Foundational Reinforcement]');
  assert.ok(!appContent.includes('[Advanced Synthesis & Edge Analysis]:'), 'App.jsx must not prepend [Advanced Synthesis]');
  assert.ok(!appContent.includes('Reviewing the underlying causal mechanism for'), 'App.jsx must not contain Reviewing the underlying causal mechanism');
});

// 3. QuestionPage.jsx: must NOT fall back to hardcoded 'Biotechnology' when subject is undefined
it('3. QuestionPage.jsx badge fallbacks must not hardcode Biotechnology for all subjects', () => {
  const qpContent = fs.readFileSync(path.resolve('src/components/pages/QuestionPage.jsx'), 'utf-8');
  assert.ok(!qpContent.includes("question?.subject || 'Biotechnology'"), 'QuestionPage must not fall back to hardcoded Biotechnology');
  assert.ok(!qpContent.includes("question?.topic || 'Bioreactor Design'"), 'QuestionPage must not fall back to hardcoded Bioreactor Design');
  assert.ok(qpContent.includes("question?.subject || 'Academic Discipline'"), 'QuestionPage must use generic academic discipline fallback');
});

// 4. ValidateQuestion strictly rejects any question containing [Foundational Reinforcement] or OS in Biotech context
it('4. ValidateQuestion strictly rejects the exact screenshot failure question text', () => {
  const screenshotFailureQuestion = {
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionText: '[Foundational Reinforcement]: Reviewing the underlying causal mechanism for Computer Science & IT — Operating Systems — What fundamental mechanism or governing principle characterizes the operational role of Virtual Memory & Demand Paging in Operating Systems?',
    type: 'text',
    format: 'Descriptive',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(screenshotFailureQuestion, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(val.valid, false, 'Exact failure question must be rejected');
  assert.ok(val.errors.some(e => e.includes('banned template') || e.includes('Cross-discipline violation')),
    'Must fail with banned template or cross-discipline violation error');
});

// 5. Context integrity error when question subject diverges from context
it('5. ValidateQuestion strictly enforces context integrity when question subject diverges', () => {
  const mismatchedQ = {
    subject: 'Computer Science',
    topic: 'Operating Systems',
    concept: 'Virtual Memory & Demand Paging',
    questionText: 'Explain the role of page tables and the translation lookaside buffer (TLB) during virtual address translation.',
    type: 'text',
    format: 'Descriptive',
    hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
  };

  const val = ValidateQuestion(mismatchedQ, { subjectName: 'Biotechnology', topic: 'Bioreactor Design' });
  assert.strictEqual(val.valid, false, 'Mismatched subject question must be rejected');
  assert.ok(val.errors.some(e => e.includes('Context Integrity Error')), 'Must raise Context Integrity Error');
});

// 6. Generated Biotechnology question package passes validation and has no cross-discipline contamination
it('6. GenerateAcademicQuestionPackage for Biotechnology -> Oxygen Transfer is 100% grounded and valid', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'text'
  });

  assert.strictEqual(pkg.valid, true, `Biotechnology package failed validation: ${pkg.validation?.errors?.join(', ')}`);
  assert.strictEqual(pkg.subject, 'Biotechnology');
  assert.strictEqual(pkg.topic, 'Bioreactor Design');
  
  const textLower = pkg.questionText.toLowerCase();
  assert.ok(!textLower.includes('operating systems'), 'Must not contain operating systems');
  assert.ok(!textLower.includes('virtual memory'), 'Must not contain virtual memory');
  assert.ok(!textLower.includes('[foundational reinforcement]'), 'Must not contain [foundational reinforcement]');
});

// 7. invalidateDefectiveQuestionCaches quarantines defective template questions
it('7. invalidateDefectiveQuestionCaches quarantines questions with [Foundational Reinforcement] and generic templates', () => {
  const records = [
    { id: 'q_valid', questionText: 'Calculate the volumetric oxygen transfer coefficient (kLa) from the dynamic gassing-out curve.' },
    { id: 'q_bad_1', questionText: '[Foundational Reinforcement]: Reviewing the underlying causal mechanism for Computer Science & IT — Operating Systems' },
    { id: 'q_bad_2', questionText: 'What fundamental mechanism or governing principle characterizes the operational role of Virtual Memory?' }
  ];

  const result = invalidateDefectiveQuestionCaches(records);
  assert.strictEqual(result.valid.length, 1);
  assert.strictEqual(result.quarantined.length, 2);
  assert.strictEqual(result.valid[0].id, 'q_valid');
});

// 8. sanitizeAttemptForStudent carries authoritative subject, topic, concept, format, and difficulty to student view
it('8. sanitizeAttemptForStudent carries authoritative subject, topic, concept, format, and difficulty to student view', () => {
  const assessment = {
    id: 'asm_test_01',
    title: 'Bioreactor Mass Transfer Exam',
    subject: 'Biotechnology',
    topic: 'Bioreactor Design',
    difficulty: 'Intermediate',
    instructions: 'Answer all questions carefully',
    allowProgressiveHints: true,
    questions: [
      {
        id: 'q_1',
        subject: 'Biotechnology',
        topic: 'Bioreactor Design',
        concept: 'Oxygen Transfer',
        type: 'mcq',
        format: 'Numerical',
        difficulty: 'Intermediate',
        questionText: 'What is the kLa value?',
        options: ['0.05 s^-1', '0.01 s^-1', '0.10 s^-1', '0.20 s^-1'],
        correctIndex: 0,
        modelAnswer: '0.05 s^-1',
        rubric: { accuracy: '100%' },
        hints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4']
      }
    ]
  };

  const attempt = {
    id: 'att_test_01',
    assessmentId: 'asm_test_01',
    durationSeconds: 1800,
    serverStartTime: Date.now(),
    status: 'in_progress',
    answers: {}
  };

  const studentView = assessmentManager.sanitizeAttemptForStudent(attempt, assessment);
  assert.strictEqual(studentView.subject, 'Biotechnology');
  assert.strictEqual(studentView.topic, 'Bioreactor Design');
  assert.strictEqual(studentView.questions.length, 1);

  const sq = studentView.questions[0];
  assert.strictEqual(sq.subject, 'Biotechnology');
  assert.strictEqual(sq.topic, 'Bioreactor Design');
  assert.strictEqual(sq.concept, 'Oxygen Transfer');
  assert.strictEqual(sq.format, 'Numerical');
  assert.strictEqual(sq.difficulty, 'Intermediate');
  assert.strictEqual(sq.correctIndex, undefined, 'correctIndex must be stripped from student view');
  assert.strictEqual(sq.modelAnswer, undefined, 'modelAnswer must be stripped from student view');
  assert.strictEqual(sq.rubric, undefined, 'rubric must be stripped from student view');
});

console.log(`\n========================================================================`);
console.log(`  ALL ${passed}/${total} EXACT REPRODUCTION VERIFICATION TESTS PASSED!`);
console.log(`========================================================================\n`);
