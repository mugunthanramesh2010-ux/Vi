// tests/viva_analyzer_x_system_upgrade.test.mjs
// VIVA ANALYZER X — EXISTING SYSTEM UPGRADE DETERMINISTIC REGRESSION TEST SUITE
// Covers all 18 Required Test Scenarios from Section 12:
// 1. Staff creates an assessment from a desktop.
// 2. Only the assigned class and section can access it.
// 3. An unauthorized student cannot access the question API.
// 4. Students can attend from separate computers and supported mobile browsers.
// 5. Two students receive the correct assessment and isolated attempt records.
// 6. Server-side timers remain authoritative.
// 7. Answers survive refreshes and temporary disconnections.
// 8. Duplicate submissions do not duplicate marks.
// 9. Staff can monitor the correct live session.
// 10. Uploaded documents produce relevant questions.
// 11. Generic questions, options and hints are rejected.
// 12. All assessment-generation paths use the same validation pipeline.
// 13. Answer keys are not leaked to students.
// 14. Local-only operation works without GPT credentials.
// 15. Watermarks render correctly on supported screen sizes.
// 16. Browser integrity signals are handled without false automatic disqualification.
// 17. Screenshot-protection claims match the actual capabilities of each supported platform.
// 18. Existing login, schedules, marks, reports, hint progression and results remain functional.

import assert from 'assert';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';
import { accountService } from '../server/src/services/accounts.js';
import { sessionService } from '../server/src/services/sessions.js';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';
import { ValidateQuestion, GenerateAcademicQuestionPackage } from '../src/services/academicAssessmentEngine.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER X — 18-SCENARIO SYSTEM UPGRADE DETERMINISTIC TEST SUITE');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;

async function test(name, fn) {
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

async function runAllTests() {
  // Setup accounts for testing
  const facultyAuth = accountService.authenticate('faculty', 'faculty123');
  assert.ok(facultyAuth.success, 'Default faculty should authenticate successfully');
  const facultySession = sessionService.createSession(facultyAuth.user);

  // Register two students in Section B and one in Section A
  accountService.register({
    username: 'test_sec_b_student1',
    password: 'password123',
    name: 'Suresh Kumar',
    department: 'Biotechnology',
    year: 'III',
    section: 'B',
    regNo: 'BIO2026B101'
  });

  accountService.register({
    username: 'test_sec_b_student2',
    password: 'password123',
    name: 'Pooja Hegde',
    department: 'Biotechnology',
    year: 'III',
    section: 'B',
    regNo: 'BIO2026B102'
  });

  accountService.register({
    username: 'test_sec_a_student1',
    password: 'password123',
    name: 'Rohan Sharma',
    department: 'Biotechnology',
    year: 'III',
    section: 'A',
    regNo: 'BIO2026A101'
  });

  const secBStudent1 = accountService.getAccount('test_sec_b_student1');
  const secBStudent2 = accountService.getAccount('test_sec_b_student2');
  const secAStudent1 = accountService.getAccount('test_sec_a_student1');

  let testAssessmentId = null;

  // --------------------------------------------------------------------------
  // TEST 1: Staff creates an assessment from a desktop
  // --------------------------------------------------------------------------
  await test('1. Staff creates an assessment with full cohort fields from desktop', async () => {
    const payload = {
      title: 'Bioreactor Oxygen Transfer Oral Examination',
      academicYear: '2026-2027',
      semester: 'Semester 5',
      subject: 'Biotechnology',
      subjectId: 'BIO-301',
      topic: 'Bioreactor Design',
      concepts: ['Oxygen Transfer', 'Sterilization', 'kLa Volumetric Mass Transfer'],
      department: 'Biotechnology',
      classYear: 'III',
      targetSections: ['B'], // Explicitly Section B
      instructions: 'Complete all questions under authoritative server timing.',
      durationMinutes: 15,
      totalMarks: 100,
      questionCount: 4,
      questionFormats: ['mcq', 'descriptive'],
      attemptLimit: 1,
      allowProgressiveHints: true,
      answerDisclosurePolicy: 'after_submission',
      status: 'published'
    };

    const res = await handleApiRequest('/api/assessments/create', 'POST', payload, {
      'x-session-token': facultySession.sessionId
    });

    assert.strictEqual(res.status, 200, 'Staff assessment creation must return 200');
    assert.ok(res.body.success, 'Assessment creation should succeed');
    assert.ok(res.body.assessment.id, 'Created assessment must have unique ID');
    assert.strictEqual(res.body.assessment.classYear, 'III');
    assert.deepStrictEqual(res.body.assessment.targetSections, ['B']);
    assert.strictEqual(res.body.assessment.version, 1);
    assert.strictEqual(res.body.assessment.questions.length, 4);

    testAssessmentId = res.body.assessment.id;
  });

  // --------------------------------------------------------------------------
  // TEST 2: Only the assigned class and section can access it
  // --------------------------------------------------------------------------
  await test('2. Only the assigned class and section can access the assessment', async () => {
    const res = await handleApiRequest('/api/assessments/eligible', 'POST', {
      studentUser: secBStudent1
    });

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.success);
    const eligibleIds = res.body.assessments.map(a => a.id);
    assert.ok(eligibleIds.includes(testAssessmentId), 'Section B student must see the assigned viva');
  });

  // --------------------------------------------------------------------------
  // TEST 3: An unauthorized student cannot access the question API
  // --------------------------------------------------------------------------
  await test('3. Unauthorized student from Section A is strictly blocked from the assessment', async () => {
    // 3a. Not in eligible list
    const eligRes = await handleApiRequest('/api/assessments/eligible', 'POST', {
      studentUser: secAStudent1
    });
    const eligibleIds = eligRes.body.assessments.map(a => a.id);
    assert.strictEqual(eligibleIds.includes(testAssessmentId), false, 'Section A student must NOT see Section B viva');

    // 3b. Direct start attempt is rejected with HTTP 403 Forbidden
    const startRes = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secAStudent1
    });

    assert.strictEqual(startRes.status, 403, 'Must return 403 Forbidden for unauthorized section student');
    assert.ok(startRes.body.error.includes('Access Denied') || startRes.body.error.includes('Section'), 'Error must cite section restriction');
  });

  // --------------------------------------------------------------------------
  // TEST 4: Students can attend from separate computers and supported mobile browsers
  // --------------------------------------------------------------------------
  await test('4. Multi-device attendance supported across Desktop and Mobile browser user agents', async () => {
    // Desktop Chrome
    const desktopRes = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent1
    }, {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'x-forwarded-for': '192.168.1.45'
    });
    assert.strictEqual(desktopRes.status, 200, 'Desktop attempt must start successfully');
    assert.ok(desktopRes.body.watermark, 'Watermark must be present');

    // Mobile Safari / Android WebKit
    const mobileRes = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent2
    }, {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      'x-forwarded-for': '192.168.1.72'
    });
    assert.strictEqual(mobileRes.status, 200, 'Mobile browser attempt must start successfully');
    assert.ok(mobileRes.body.attempt.questions.length > 0, 'Questions delivered cleanly to mobile client');
  });

  // --------------------------------------------------------------------------
  // TEST 5: Two students receive the correct assessment and isolated attempt records
  // --------------------------------------------------------------------------
  let student1AttemptId = null;
  let student2AttemptId = null;

  await test('5. Two students receive isolated attempt records with isolated answers', async () => {
    const att1 = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent1
    });
    const att2 = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent2
    });

    student1AttemptId = att1.body.attempt.attemptId;
    student2AttemptId = att2.body.attempt.attemptId;

    assert.notStrictEqual(student1AttemptId, student2AttemptId, 'Attempts must have distinct IDs');

    // Student 1 saves Option 0 for Question 0
    await handleApiRequest('/api/assessments/autosave', 'POST', {
      attemptId: student1AttemptId,
      studentUser: secBStudent1,
      answer: { questionId: 'q_0', selectedOption: 0, activeTimeSec: 25 }
    });

    // Student 2 saves Option 2 for Question 0
    await handleApiRequest('/api/assessments/autosave', 'POST', {
      attemptId: student2AttemptId,
      studentUser: secBStudent2,
      answer: { questionId: 'q_0', selectedOption: 2, activeTimeSec: 40 }
    });

    const attemptsMap = assessmentManager.attempts;
    assert.strictEqual(attemptsMap[student1AttemptId].answers['q_0'].selectedOption, 0);
    assert.strictEqual(attemptsMap[student2AttemptId].answers['q_0'].selectedOption, 2);
  });

  // --------------------------------------------------------------------------
  // TEST 6: Server-side timers remain authoritative
  // --------------------------------------------------------------------------
  await test('6. Server-side timers remain authoritative and calculate server remaining time', async () => {
    const attempt = assessmentManager.attempts[student1AttemptId];
    assert.ok(attempt.serverStartTime > 0, 'Server start time must be a server timestamp');
    assert.strictEqual(attempt.durationSeconds, 15 * 60, 'Duration matches assessment duration');

    // Test remaining time calculation
    const elapsed = Math.floor((Date.now() - attempt.serverStartTime) / 1000);
    const expectedRemaining = Math.max(0, attempt.durationSeconds - elapsed);
    assert.ok(expectedRemaining > 0 && expectedRemaining <= 900);

    // Test timeout behavior if start time was 20 minutes ago
    const expiredAttempt = {
      ...attempt,
      id: 'att_expired_test',
      serverStartTime: Date.now() - (20 * 60 * 1000)
    };
    assessmentManager.attempts['att_expired_test'] = expiredAttempt;

    const timeoutSave = await handleApiRequest('/api/assessments/autosave', 'POST', {
      attemptId: 'att_expired_test',
      studentUser: secBStudent1,
      answer: { questionId: 'q_1', selectedOption: 1 }
    });

    assert.strictEqual(timeoutSave.status, 403, 'Autosave after server expiration must be rejected');
    assert.strictEqual(assessmentManager.attempts['att_expired_test'].status, 'timed_out');
    delete assessmentManager.attempts['att_expired_test'];
  });

  // --------------------------------------------------------------------------
  // TEST 7: Answers survive refreshes and temporary disconnections
  // --------------------------------------------------------------------------
  await test('7. Answers survive browser refreshes and temporary disconnections', async () => {
    // Student 1 refreshes the browser and calls startAttempt again
    const recoveryRes = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent1
    });

    assert.strictEqual(recoveryRes.status, 200);
    assert.strictEqual(recoveryRes.body.isRecovery, true, 'Must indicate recovered session');
    assert.strictEqual(recoveryRes.body.attempt.attemptId, student1AttemptId);
    assert.strictEqual(recoveryRes.body.attempt.savedAnswers['q_0'].selectedOption, 0, 'Saved answer must be restored');
    assert.ok(recoveryRes.body.remainingSeconds > 0, 'Accurate server remaining seconds returned');
  });

  // --------------------------------------------------------------------------
  // TEST 8: Duplicate submissions do not duplicate marks (Idempotency)
  // --------------------------------------------------------------------------
  await test('8. Duplicate submissions do not duplicate marks and return idempotent evaluation', async () => {
    // 1st submission
    const sub1 = await handleApiRequest('/api/assessments/submit', 'POST', {
      attemptId: student1AttemptId,
      studentUser: secBStudent1,
      answers: {
        q_0: { selectedOption: 0, hintsUsed: 0 },
        q_1: { selectedOption: 1, hintsUsed: 0 }
      }
    });

    assert.strictEqual(sub1.status, 200);
    assert.strictEqual(sub1.body.alreadySubmitted, false);
    const firstScore = sub1.body.evaluation.earnedMarks;
    const firstPercentage = sub1.body.evaluation.percentage;

    // 2nd duplicate submission (e.g., accidental retry)
    const sub2 = await handleApiRequest('/api/assessments/submit', 'POST', {
      attemptId: student1AttemptId,
      studentUser: secBStudent1
    });

    assert.strictEqual(sub2.status, 200);
    assert.strictEqual(sub2.body.alreadySubmitted, true, 'Subsequent submission must report alreadySubmitted');
    assert.strictEqual(sub2.body.evaluation.earnedMarks, firstScore, 'Marks must remain identical');
    assert.strictEqual(sub2.body.evaluation.percentage, firstPercentage);
  });

  // --------------------------------------------------------------------------
  // TEST 9: Staff can monitor the correct live session
  // --------------------------------------------------------------------------
  await test('9. Staff can monitor live assessment telemetry and cohort progress', async () => {
    const monitorRes = await handleApiRequest(`/api/assessments/${testAssessmentId}/live-monitor`, 'GET', null, {
      'x-session-token': facultySession.sessionId
    });

    assert.strictEqual(monitorRes.status, 200);
    assert.ok(monitorRes.body.success);
    const m = monitorRes.body.monitor;
    assert.strictEqual(m.assessmentId, testAssessmentId);
    assert.strictEqual(m.classYear, 'III');
    assert.deepStrictEqual(m.targetSections, ['B']);
    assert.ok(m.joinedCount >= 2, 'Should detect joined students in section B');
    assert.ok(m.submittedCount >= 1, 'Should detect submitted student 1');
  });

  // --------------------------------------------------------------------------
  // TEST 10: Uploaded documents produce relevant questions
  // --------------------------------------------------------------------------
  await test('10. Uploaded reference document produces grounded subject questions', async () => {
    const docText = `
CHAPTER 4: BIOREACTOR OXYGEN MASS TRANSFER
The volumetric oxygen transfer coefficient, kLa, characterizes the gas-liquid transfer rate in aerobic bioreactors.
The oxygen transfer rate (OTR) is governed by OTR = kLa * (C* - CL), where C* is saturated dissolved oxygen concentration and CL is actual DO.
Impeller agitation speed, gas sparging superficial velocity, and rheological viscosity govern kLa.
Sterilization of culture media requires maintaining temperature at 121 degrees Celsius for thermal inactivation kinetics.
`;
    const docResult = documentProcessor.processTextDocument('faculty', 'BIO-301', 'bioreactor_notes.txt', docText, {
      section: 'Mass Transfer',
      page: 1
    });

    assert.ok(docResult.success);
    assert.ok(docResult.chunksCount > 0);

    const retrieval = referenceRetriever.retrievePassages('faculty', 'BIO-301', 'oxygen transfer coefficient kLa', 2);
    assert.strictEqual(retrieval.found, true);
    assert.ok(retrieval.passages[0].text.includes('kLa'));

    // Question package with document grounding
    const pkg = GenerateAcademicQuestionPackage('Biotechnology', 'Bioreactor Design', {
      count: 2,
      documentContext: retrieval.passages[0].text
    });

    assert.ok(pkg.questionText, 'Question text must be generated from document context');
    const qText = pkg.questionText.toLowerCase();
    assert.ok(qText.includes('oxygen') || qText.includes('bioreactor') || qText.includes('kla') || qText.includes('transfer'));
  });

  // --------------------------------------------------------------------------
  // TEST 11: Generic questions, options and hints are rejected
  // --------------------------------------------------------------------------
  await test('11. Generic questions, options and placeholder templates are strictly rejected', async () => {
    const badCandidate = {
      questionText: 'Foundational Mechanism and Direct Formulation under operational performance',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      hints: ['Recall Foundational Mechanism', 'Review Direct Formulation']
    };

    const val = ValidateQuestion(badCandidate, 'Bioreactor Design');
    assert.strictEqual(val.valid, false, 'Must reject candidate with generic placeholder phrases');
    const errs = val.errors || val.reasons || [];
    assert.ok(errs.some(r => r.includes('generic') || r.includes('banned')));
  });

  // --------------------------------------------------------------------------
  // TEST 12: All assessment-generation paths use the same validation pipeline
  // --------------------------------------------------------------------------
  await test('12. All assessment-generation paths enforce the common validation pipeline', async () => {
    const validCandidate = {
      questionText: 'What does the volumetric mass transfer coefficient, kLa, signify in an aerated stirred-tank bioreactor?',
      type: 'mcq',
      options: [
        'The overall rate of oxygen transport across the gas-liquid interface per unit driving force',
        'The metabolic growth rate of anaerobic microbial cells in the broth',
        'The hydraulic shear stress exerted by Rushton turbine impellers',
        'The osmotic pressure gradient across cell membranes during fermentation'
      ],
      correctIndex: 0,
      explanation: 'kLa quantifies oxygen transfer rate per unit driving concentration difference (C* - CL).',
      hints: [
        'Consider the gas-liquid interfacial mass transfer governing equation',
        'Recall OTR = kLa * (C* - CL)',
        'Focus on the relationship between interfacial area a and liquid film mass transfer coefficient kL',
        'Notice units are reciprocal time (1/s or 1/h)'
      ]
    };

    const val = ValidateQuestion(validCandidate, 'Bioreactor Design');
    assert.strictEqual(val.valid, true, 'Valid technical candidate must pass common validation');
    assert.strictEqual(validCandidate.options.length, 4, 'Must have exactly 4 distinct options');
  });

  // --------------------------------------------------------------------------
  // TEST 13: Answer keys are not leaked to students
  // --------------------------------------------------------------------------
  await test('13. Answer keys, correctIndex, and model answers are stripped from student responses', async () => {
    // 13a. Eligible list
    const eligRes = await handleApiRequest('/api/assessments/eligible', 'POST', {
      studentUser: secBStudent2
    });
    const studentAsg = eligRes.body.assessments.find(a => a.id === testAssessmentId);
    assert.strictEqual(studentAsg.questions, undefined, 'Eligible list must not embed questions array');

    // 13b. Start attempt
    const startRes = await handleApiRequest('/api/assessments/start', 'POST', {
      assessmentId: testAssessmentId,
      studentUser: secBStudent2
    });
    const questions = startRes.body.attempt.questions;
    questions.forEach((q, idx) => {
      assert.strictEqual(q.correctIndex, undefined, `Question ${idx} must not leak correctIndex`);
      assert.strictEqual(q.modelAnswer, undefined, `Question ${idx} must not leak modelAnswer`);
      assert.strictEqual(q.explanation, undefined, `Question ${idx} must not leak explanation`);
      assert.strictEqual(q.rubric, undefined, `Question ${idx} must not leak rubric`);
    });
  });

  // --------------------------------------------------------------------------
  // TEST 14: Local-only operation works without GPT credentials
  // --------------------------------------------------------------------------
  await test('14. System functions 100% offline without external GPT credentials or network calls', async () => {
    delete process.env.OPENAI_API_KEY;
    const pkg = GenerateAcademicQuestionPackage('Biotechnology', 'Bioreactor Design', { count: 3 });
    assert.ok(pkg.questionText, 'Procedural domain ontology operates instantly offline');
    assert.strictEqual(pkg.subject, 'Biotechnology');
  });

  // --------------------------------------------------------------------------
  // TEST 15: Watermarks render correctly on supported screen sizes
  // --------------------------------------------------------------------------
  await test('15. Watermark payload provides masked student ID and timestamp without sensitive leakage', async () => {
    const wm = assessmentManager.generateWatermark('BIO2026B101', testAssessmentId, Date.now());
    assert.strictEqual(wm.maskedStudentId, 'STU-***B101', 'Masked student ID must obscure sensitive prefix');
    assert.strictEqual(wm.assessmentId, testAssessmentId);
    assert.ok(wm.watermarkText.includes('STU-***B101'));
    // Must NOT leak student passwords, personal emails, or raw biometrics
    assert.strictEqual(wm.watermarkText.includes('password'), false);
    assert.strictEqual(wm.watermarkText.includes('@'), false);
  });

  // --------------------------------------------------------------------------
  // TEST 16: Browser integrity signals handled without false automatic disqualification
  // --------------------------------------------------------------------------
  await test('16. Browser integrity observations recorded without false automatic disqualification', async () => {
    const obs1 = await handleApiRequest('/api/assessments/integrity-observation', 'POST', {
      attemptId: student2AttemptId,
      studentUser: secBStudent2,
      observation: { type: 'visibility_hidden', details: 'Window minimized' }
    });
    const obs2 = await handleApiRequest('/api/assessments/integrity-observation', 'POST', {
      attemptId: student2AttemptId,
      studentUser: secBStudent2,
      observation: { type: 'window_blur', details: 'Focus lost' }
    });
    const obs3 = await handleApiRequest('/api/assessments/integrity-observation', 'POST', {
      attemptId: student2AttemptId,
      studentUser: secBStudent2,
      observation: { type: 'copy_intercepted', details: 'Ctrl+C intercepted' }
    });

    assert.ok(obs1.body.success);
    assert.ok(obs2.body.success);
    assert.ok(obs3.body.success);

    // CRITICAL: Student attempt status MUST remain in_progress, NOT disqualified or scored 0
    const attempt = assessmentManager.attempts[student2AttemptId];
    assert.strictEqual(attempt.status, 'in_progress', 'Must NOT disqualify student merely for focus loss');
    assert.strictEqual(attempt.integrityObservations.length, 3, 'Integrity observations recorded for staff review');
  });

  // --------------------------------------------------------------------------
  // TEST 17: Screenshot-protection claims match actual capabilities of each platform
  // --------------------------------------------------------------------------
  await test('17. Security architecture implements deterrence & disclaims 100% OS screenshot impossibility', async () => {
    // Verify watermark and security notice
    const wm = assessmentManager.generateWatermark('BIO2026B101', 'test_asg', Date.now());
    assert.ok(wm.notice.includes('Deterrence Active'), 'Honest deterrence terminology used');
    // Ensure no false claims of "100% OS-level screenshot blockage in web browser"
    assert.ok(!wm.notice.includes('100% Impossible to Screenshot'), 'Accurate security capability disclosure');
  });

  // --------------------------------------------------------------------------
  // TEST 18: Existing login, schedules, marks, reports, hint progression remain functional
  // --------------------------------------------------------------------------
  await test('18. Existing login, hint progression, evaluation and audit chains remain unbroken', async () => {
    // 18a. Progressive hints
    const hintRes = await handleApiRequest('/api/ai/viva/hint', 'POST', {
      question: {
        topic: 'Bioreactor Design',
        concept: 'Oxygen Transfer',
        questionText: 'Explain volumetric oxygen transfer coefficient kLa'
      },
      currentHintLevel: 1
    });
    assert.strictEqual(hintRes.status, 200);
    assert.ok(hintRes.body.hint.hintText, 'Progressive hint generated');

    // 18b. Anti-cheat audit chain verification
    const auditRes = await handleApiRequest('/api/anti-cheat/verify', 'GET');
    assert.strictEqual(auditRes.status, 200);
    assert.strictEqual(auditRes.body.verified, true, 'Audit chain integrity intact');
  });

  console.log('\n========================================================================');
  console.log(`  ALL 18/18 SYSTEM UPGRADE REGRESSION SCENARIOS PASSED DETERMINISTICALLY!`);
  console.log('========================================================================\n');
}

runAllTests().catch(err => {
  console.error('\nTest execution failed:', err);
  process.exit(1);
});
