// tests/viva_analyzer_x_deep_conceptual_intelligence.test.mjs
// VIVA ANALYZER X — DEEP CONCEPTUAL INTELLIGENCE, HIGH-QUALITY MCQ OPTIONS,
// SOCRATIC HINTS & ADAPTIVE MASTERY REGRESSION TEST SUITE (Tests A through H)

import assert from 'assert';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  GenerateHint,
  EvaluateResponse
} from '../src/services/academicAssessmentEngine.js';
import { hintGenerator } from '../server/src/ai/hintGenerator.js';
import { adaptiveStudentIntelligence } from '../server/src/ai/adaptiveStudentIntelligence.js';
import { handleApiRequest } from '../server/src/apiDispatcher.js';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';
import { accountService } from '../server/src/services/accounts.js';
import { sessionService } from '../server/src/services/sessions.js';

console.log('========================================================================');
console.log('  VIVA ANALYZER X — DEEP CONCEPTUAL INTELLIGENCE & ADAPTIVE MASTERY');
console.log('  MANDATORY REGRESSION TEST SUITE (TESTS A THROUGH H)');
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
  // --------------------------------------------------------------------------
  // TEST A: Communication Engineering / QPSK
  // --------------------------------------------------------------------------
  await test('Test A — Communication Engineering / QPSK (All 4 options, key, explanation, hints assess QPSK)', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Communication Engineering',
      topic: 'Digital Modulation',
      concept: 'QPSK (Quadrature Phase Shift Keying)',
      questionType: 'mcq',
      difficulty: 'Intermediate'
    });

    assert.ok(pkg.valid, 'Generated QPSK package must pass all quality gates');
    assert.strictEqual(pkg.options.length, 4, 'Must have exactly 4 options');
    assert.ok(typeof pkg.correctIndex === 'number' && pkg.correctIndex >= 0 && pkg.correctIndex <= 3, 'Must have valid correctIndex');

    // Verify all 4 options belong to the digital modulation domain
    const allOptText = pkg.options.join(' ').toLowerCase();
    assert.ok(allOptText.includes('phase') || allOptText.includes('bit'), 'Options must focus on phase states and bit representation');

    // Verify distractor rationales are present
    assert.ok(Array.isArray(pkg.distractorRationales) && pkg.distractorRationales.length === 4, 'Must have distractor rationales for all 4 options');
    const correctRationale = pkg.distractorRationales.find(r => r.isCorrect);
    assert.ok(correctRationale, 'Must have rationale for correct answer');
    const distractors = pkg.distractorRationales.filter(r => !r.isCorrect);
    assert.strictEqual(distractors.length, 3, 'Must have rationales for all 3 distractors');

    // Verify hints assess QPSK without leaking the correct answer
    assert.strictEqual(pkg.hints.length, 4, 'Must have 4-level progressive hints');
    const correctText = pkg.options[pkg.correctIndex].toLowerCase();
    pkg.hints.slice(0, 3).forEach((h, idx) => {
      assert.ok(!h.toLowerCase().includes(correctText), `Hint level ${idx + 1} must not leak full correct answer`);
      assert.ok(!h.toLowerCase().includes('option a') && !h.toLowerCase().includes('option b'), `Hint level ${idx + 1} must not name option letter`);
    });

    // Verify explanation supports the correct option
    assert.ok(pkg.explanation.toLowerCase().includes('qpsk') || pkg.explanation.toLowerCase().includes('carrier phase'), 'Explanation must justify QPSK principles');
  });

  // --------------------------------------------------------------------------
  // TEST B: Biotechnology / Oxygen Transfer
  // --------------------------------------------------------------------------
  await test('Test B — Biotechnology / Oxygen Transfer (kLa, OTR, DO, all options and hints focused on concept)', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Biotechnology',
      topic: 'Bioreactor Design & Scale-up',
      concept: 'Oxygen Transfer',
      questionType: 'mcq',
      difficulty: 'Intermediate'
    });

    assert.ok(pkg.valid, 'Biotechnology oxygen transfer question must pass validation');
    assert.strictEqual(pkg.options.length, 4, 'Must have exactly 4 options');

    // Ensure options are about mass transfer / oxygen / bioreactor
    const qLower = pkg.questionText.toLowerCase();
    assert.ok(qLower.includes('kla') || qLower.includes('oxygen transfer') || qLower.includes('volumetric'), 'Question must assess kLa or oxygen transfer');

    // Distractors must be plausible mass-transfer alternatives or misconceptions
    assert.ok(pkg.distractorRationales && pkg.distractorRationales.length === 4, 'Must provide distractor rationales');
    assert.ok(pkg.hints.length === 4, 'Must provide 4-tier hints');

    // Check no cross-discipline leakage
    const combined = (pkg.questionText + ' ' + pkg.options.join(' ')).toLowerCase();
    assert.ok(!combined.includes('bode plot'), 'Must not contain Control Systems concepts');
    assert.ok(!combined.includes('virtual memory'), 'Must not contain CS concepts');
  });

  // --------------------------------------------------------------------------
  // TEST C: Control Systems
  // --------------------------------------------------------------------------
  await test('Test C — Control Systems (Bode plots, stability margins, technical invariants)', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Control Systems Engineering',
      topic: 'Bode Plot Stability Analysis',
      concept: 'Gain and Phase Margins',
      questionType: 'mcq',
      difficulty: 'Intermediate'
    });

    assert.ok(pkg.valid, 'Control Systems question must pass validation');
    assert.strictEqual(pkg.options.length, 4, 'Must have 4 options');

    // Check technical relationships
    const expl = pkg.explanation.toLowerCase();
    assert.ok(expl.includes('margin') || expl.includes('crossover') || expl.includes('phase') || expl.includes('stability'), 'Must explain stability margin principles');

    // Verify distractors represent real control engineering misconceptions
    assert.ok(Array.isArray(pkg.distractorRationales), 'Distractor rationales must be present');
    assert.ok(pkg.hints.length === 4, 'Must provide 4-tier hints');
  });

  // ----------------------------------------------------
  // TEST D: Arbitrary Staff-Created Topic
  // ----------------------------------------------------
  await test('Test D — Arbitrary staff-created topic (Generates grounded question or returns recoverable error, zero boilerplate)', async () => {
    const facultyAuth = accountService.authenticate('faculty', 'faculty123');
    const facultySession = sessionService.createSession(facultyAuth.user);

    // 1. Ingest arbitrary staff document
    const uploadRes = await handleApiRequest(
      '/api/documents/process',
      'POST',
      {
        filename: 'Cryogenic_Propellant_Stratification.txt',
        subjectId: 'AEROSPACE_ENG',
        contentPayload: `
          SECTION: Cryogenic Boil-off and Thermal Stratification
          Liquid hydrogen (LH2) storage vessels in microgravity experience thermal stratification where heat leak creates a buoyant vapor cushion at the tank dome.
          The non-dimensional Rayleigh number Ra_H = (g * beta * DeltaT * H^3) / (nu * alpha) governs the transition from conduction to natural convection.
          Destratification is actively achieved using axial thermodynamic vent systems (TVS) with submerged spray bars.
        `,
        metadata: { department: 'Aerospace Engineering', course: 'Cryogenic Propulsion' }
      },
      { 'x-session-token': facultySession.sessionId }
    );
    assert.strictEqual(uploadRes.status, 200, 'Staff reference ingestion should succeed');

    // 2. Retrieve grounded evidence
    const retRes = referenceRetriever.retrievePassages(
      'faculty',
      'AEROSPACE_ENG',
      'Cryogenic Boil-off and Thermal Stratification',
      5,
      { concept: 'Rayleigh Number' }
    );
    assert.ok(retRes.passages.length > 0, 'Reference retriever must find ingested cryogenic passages');

    // 3. Generate question using retrieved passages
    const qRes = await handleApiRequest(
      '/api/ai/viva/grounded-question',
      'POST',
      {
        facultyId: 'faculty',
        subject: 'Aerospace Engineering',
        subjectId: 'AEROSPACE_ENG',
        topic: 'Cryogenic Boil-off and Thermal Stratification',
        conceptId: 'Rayleigh Number',
        learningOutcome: 'Analyze natural convection transition in cryogenic propellant tanks.',
        difficulty: 'Advanced',
        questionType: 'mcq',
        referenceEvidence: retRes.passages
      }
    );

    assert.strictEqual(qRes.status, 200, 'Generation must succeed');
    const q = qRes.body.question;
    assert.ok(q && (q.questionText || q.text), 'Must return a generated question');
    const qCombined = (q.questionText || q.text || '').toLowerCase();
    assert.ok(qCombined.includes('cryogenic') || qCombined.includes('stratification') || qCombined.includes('rayleigh') || qCombined.includes('convection') || qCombined.includes('boil-off'), 'Question must be grounded in uploaded text');

    // 4. Test Exclusive Source Mode when material is missing -> must return recoverable error
    const missingPkg = GenerateAcademicQuestionPackage({
      subjectName: 'NonExistentDiscipline',
      topic: 'FictionalTopic',
      concept: 'FictionalConcept',
      exclusiveSourceOnly: true,
      referencePassages: []
    });
    assert.strictEqual(missingPkg.valid, false, 'Must fail in exclusive source mode when evidence is missing');
    assert.strictEqual(missingPkg.error, 'INSUFFICIENT_SOURCE_EVIDENCE', 'Must return recoverable error code');
  });

  // --------------------------------------------------------------------------
  // TEST E: Option Quality Validator
  // --------------------------------------------------------------------------
  await test('Test E — Option Quality Validator (Rejects duplicate options, unrelated distractors, conflicting keys, imbalanced lengths)', async () => {
    // 1. Duplicate options rejection
    const dupPkg = {
      questionText: 'What is the function of an equalizer in a high-speed digital communications receiver?',
      subject: 'Communication Engineering',
      topic: 'Digital Communications',
      concept: 'Equalization',
      type: 'mcq',
      options: [
        'Compensates for inter-symbol interference (ISI) caused by channel dispersion',
        'Compensates for inter-symbol interference (ISI) caused by channel dispersion', // DUPLICATE
        'Increases carrier frequency beyond Nyquist limit',
        'Converts digital symbols directly into analog acoustic pressure'
      ],
      correctIndex: 0,
      hints: ['H1', 'H2', 'H3', 'H4'],
      explanation: 'Equalizers compensate for channel dispersion and inter-symbol interference.'
    };
    const dupVal = ValidateQuestion(dupPkg);
    assert.strictEqual(dupVal.valid, false, 'Duplicate options must be rejected by Gate E');
    assert.ok(dupVal.errors.some(e => e.includes('duplicate options')), 'Error must cite duplicate options');

    // 2. Paraphrased options rejection
    const paraPkg = {
      questionText: 'What is the function of an equalizer in a high-speed digital communications receiver?',
      subject: 'Communication Engineering',
      topic: 'Digital Communications',
      concept: 'Equalization',
      type: 'mcq',
      options: [
        'Compensates for inter symbol interference caused by channel dispersion',
        'Compensates for inter symbol interference caused by dispersion in channel', // PARAPHRASE
        'Increases carrier frequency beyond Nyquist limit',
        'Converts digital symbols directly into analog acoustic pressure'
      ],
      correctIndex: 0,
      hints: ['H1', 'H2', 'H3', 'H4'],
      explanation: 'Equalizers compensate for channel dispersion and inter-symbol interference.'
    };
    const paraVal = ValidateQuestion(paraPkg);
    assert.strictEqual(paraVal.valid, false, 'Paraphrased options must be rejected by Gate E');

    // 3. Conspicuously imbalanced correct option length (giveaway pattern)
    const longPkg = {
      questionText: 'What is the function of an equalizer in a high-speed digital communications receiver?',
      subject: 'Communication Engineering',
      topic: 'Digital Communications',
      concept: 'Equalization',
      type: 'mcq',
      options: [
        'It meticulously and comprehensively compensates for severe inter-symbol interference (ISI) introduced by finite channel bandwidth and dispersion by dynamically synthesizing the inverse transfer function of the multipath channel filter',
        'Noise filter',
        'Gain booster',
        'Phase shifter'
      ],
      correctIndex: 0,
      hints: ['H1', 'H2', 'H3', 'H4'],
      explanation: 'Option A is correct because it inverts channel response.'
    };
    const longVal = ValidateQuestion(longPkg);
    assert.strictEqual(longVal.valid, false, 'Conspicuously long giveaway option must be rejected by Gate E');

    // 4. Invalid correctIndex rejection
    const invalidIndexPkg = {
      questionText: 'What is the function of an equalizer in a high-speed digital communications receiver?',
      subject: 'Communication Engineering',
      topic: 'Digital Communications',
      concept: 'Equalization',
      type: 'mcq',
      options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4'],
      correctIndex: 5, // OUT OF RANGE
      hints: ['H1', 'H2', 'H3', 'H4'],
      explanation: 'Explanation text here.'
    };
    const idxVal = ValidateQuestion(invalidIndexPkg);
    assert.strictEqual(idxVal.valid, false, 'Out-of-range correctIndex must be rejected by Gate D');
  });

  // --------------------------------------------------------------------------
  // TEST F: Socratic 4-Level Hint Progression
  // --------------------------------------------------------------------------
  await test('Test F — Socratic 4-level hint progression (L1-L4 add information, guide reasoning, zero answer leaks)', async () => {
    const q = {
      id: 'q_test_qpsk',
      subject: 'Communication Engineering',
      topic: 'Digital Modulation',
      concept: 'QPSK (Quadrature Phase Shift Keying)',
      type: 'mcq',
      options: [
        '4 distinct phase states, 2 bits per symbol',
        '2 distinct phase states, 1 bit per symbol',
        '8 distinct phase states, 3 bits per symbol',
        '16 distinct phase states, 4 bits per symbol'
      ],
      correctIndex: 0,
      hints: [
        'Recall the relationship between the number of distinct signal symbols and bits encoded.',
        'Consider how many binary bits can be represented by four distinct signal states.',
        'Use the relationship between symbols M and bits per symbol: k = log2(M).',
        'Substitute the four distinct QPSK constellation states into that relationship.'
      ]
    };

    // Test progression from L1 to L4
    const h1 = hintGenerator.getNextHint(q, 0);
    const h2 = hintGenerator.getNextHint(q, 1);
    const h3 = hintGenerator.getNextHint(q, 2);
    const h4 = hintGenerator.getNextHint(q, 3);

    assert.strictEqual(h1.level, 1, 'Hint 1 must be level 1');
    assert.strictEqual(h2.level, 2, 'Hint 2 must be level 2');
    assert.strictEqual(h3.level, 3, 'Hint 3 must be level 3');
    assert.strictEqual(h4.level, 4, 'Hint 4 must be level 4');

    // Verify all 4 hints are distinct and add information
    const hintTexts = [h1.hintText, h2.hintText, h3.hintText, h4.hintText];
    const uniqueTexts = new Set(hintTexts);
    assert.strictEqual(uniqueTexts.size, 4, 'All 4 hints must provide distinct information');

    // Verify hints do not leak the exact correct option string
    hintTexts.forEach((txt, idx) => {
      assert.ok(!txt.toLowerCase().includes('4 distinct phase states, 2 bits per symbol'), `Hint ${idx + 1} must not leak raw answer text`);
    });

    // Test response-adaptive hint targeting observed student misconception
    const adaptiveHint = hintGenerator.getNextHint(q, 1, {
      errorCategory: 'conceptual',
      studentError: { category: 'conceptual', message: 'Confused symbol rate with bit rate' }
    });
    assert.ok(adaptiveHint.targetedGuidance, 'Must provide targeted guidance for observed conceptual error');
    assert.ok(adaptiveHint.targetedGuidance.toLowerCase().includes('distinguish') || adaptiveHint.targetedGuidance.toLowerCase().includes('mechanism'), 'Targeted guidance must guide understanding');
  });

  // --------------------------------------------------------------------------
  // TEST G: Adaptive Learning & Capability Progression
  // --------------------------------------------------------------------------
  await test('Test G — Adaptive learning & capability progression (Success increases challenge, errors trigger targeted support, topic locked)', async () => {
    const studentId = 'adapt_student_viva_x';
    const subject = 'Control Systems Engineering';
    const topic = 'Bode Plot Stability Analysis';

    // Step 1: Student gets an initial question wrong with a calculation error
    const r1 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question: { id: 'cs_q1', concept: 'Gain and Phase Margins', difficulty: 'Intermediate' },
      studentAnswer: 'Phase margin is -45 degrees',
      isCorrect: false,
      hintsUsed: 2,
      responseTimeSeconds: 45
    });

    assert.strictEqual(r1.topicLocked, true, 'Topic must remain strictly locked');
    assert.strictEqual(r1.assignedTopic, topic, 'Assigned topic must never deviate');
    assert.ok(r1.errorClassification, 'Must classify error type');
    assert.ok(r1.recommendedAction === 'DIAGNOSTIC_RETRY' || r1.recommendedAction === 'REMEDIATE_SIMPLIFIED', 'Recurring/initial error must trigger targeted support');

    // Step 2: Student succeeds after remediation with zero hints and good reflection
    const r2 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question: { id: 'cs_q2', concept: 'Gain and Phase Margins', difficulty: 'Foundation' },
      studentAnswer: 'Phase Margin is 180 + phase at gain crossover = +45 degrees (Stable)',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 65
    });

    assert.strictEqual(r2.topicLocked, true, 'Topic must remain locked');
    assert.ok(r2.masterySummary.estimatedMastery >= r1.masterySummary.estimatedMastery, 'Mastery estimate should increase upon unassisted success');

    // Step 3: Continued success triggers progression
    const r3 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question: { id: 'cs_q3', concept: 'Gain and Phase Margins', difficulty: 'Intermediate' },
      studentAnswer: 'Gain Margin is -20*log10|G(j*w_pc)| at phase crossover',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 70
    });

    assert.strictEqual(r3.topicLocked, true, 'Topic remains locked');
    assert.ok(r3.recommendedAction === 'CONSOLIDATE' || r3.recommendedAction === 'ADVANCE_TRANSFER', 'Repeated success should consolidate or advance transfer');
  });

  // --------------------------------------------------------------------------
  // TEST H: Real Assessment Integration
  // --------------------------------------------------------------------------
  await test('Test H — Real assessment integration (Student payload has zero leaked keys, zero provider branding)', async () => {
    // 1. Staff creates assessment
    const facultyAuth = accountService.authenticate('faculty', 'faculty123');
    assert.ok(facultyAuth.success, 'Faculty must authenticate');
    const facultySession = sessionService.createSession(facultyAuth.user);

    const createRes = await handleApiRequest(
      '/api/assessments/create',
      'POST',
      {
        title: 'Communication Engineering Digital Modulation Viva',
        subject: 'Communication Engineering',
        topic: 'Digital Modulation',
        concept: 'QPSK (Quadrature Phase Shift Keying)',
        department: 'Electronics and Communication Engineering',
        year: 'III',
        section: 'A',
        durationMinutes: 30,
        questionsCount: 5,
        type: 'mcq'
      },
      { 'x-session-token': facultySession.sessionId }
    );
    assert.strictEqual(createRes.status, 200, 'Assessment creation must succeed');
    const assessmentId = createRes.body.assessment.id;

    // 2. Register and login student in Section A
    accountService.register({
      username: 'student_viva_x_comm',
      password: 'password123',
      name: 'Ananya Roy',
      department: 'Electronics and Communication Engineering',
      year: 'III',
      section: 'A',
      regNo: 'ECE2026A501'
    });
    const studentUser = accountService.getAccount('student_viva_x_comm');

    // 3. Student starts attempt
    const startRes = await handleApiRequest(
      '/api/assessments/start',
      'POST',
      { assessmentId, studentUser }
    );
    assert.strictEqual(startRes.status, 200, 'Student attempt must start');
    const attempt = startRes.body.attempt;
    assert.ok(attempt.questions && attempt.questions.length > 0, 'Attempt must deliver questions');

    // 4. Verify student-facing questions have zero leaked keys
    attempt.questions.forEach((q, idx) => {
      assert.strictEqual(q.correctIndex, undefined, `Question ${idx + 1} must not contain correctIndex in student view`);
      assert.strictEqual(q.modelAnswer, undefined, `Question ${idx + 1} must not contain modelAnswer in student view`);
      assert.strictEqual(q.explanation, undefined, `Question ${idx + 1} must not contain explanation in student view`);
      assert.strictEqual(q.rubric, undefined, `Question ${idx + 1} must not contain rubric in student view`);
      assert.strictEqual(q.distractorRationales, undefined, `Question ${idx + 1} must not contain distractorRationales in student view`);
    });

    // 5. Verify zero AI provider branding in student payload
    const rawPayload = JSON.stringify(startRes.body);
    const bannedBrandings = ['ollama', 'openai', 'gpt-4', 'llama3', 'gemini-1.5'];
    bannedBrandings.forEach(brand => {
      assert.ok(!rawPayload.toLowerCase().includes(brand), `Student payload must not expose AI provider brand "${brand}"`);
    });
  });

  console.log('\n========================================================================');
  console.log(`  ALL ${passedTests}/${totalTests} VIVA ANALYZER X DEEP CONCEPTUAL INTELLIGENCE TESTS PASSED!`);
  console.log('========================================================================\n');
}

runAllTests().catch(err => {
  console.error('\nTest Suite Terminated with Error:', err);
  process.exit(1);
});
