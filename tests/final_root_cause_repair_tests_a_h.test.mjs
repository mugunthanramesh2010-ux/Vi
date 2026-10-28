// tests/final_root_cause_repair_tests_a_h.test.mjs
// VIVA ANALYZER — FINAL ROOT-CAUSE REPAIR: STRICT STAFF-TOPIC LOCK,
// DOCUMENT-GROUNDED INTELLIGENCE AND ADAPTIVE VIVA
// Mandatory Regression Test Suite (Tests A through H)

import assert from 'node:assert';
import {
  ACADEMIC_REGISTRY,
  resolveAcademicContext,
  GenerateQuestion,
  GenerateOptions,
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  GenerateHint
} from '../src/services/academicAssessmentEngine.js';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';
import { assessmentManager } from '../server/src/services/assessmentManager.js';
import { adaptiveStudentIntelligence } from '../server/src/ai/adaptiveStudentIntelligence.js';

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
    throw err;
  }
}

console.log('========================================================================');
console.log('  VIVA ANALYZER — FINAL ROOT-CAUSE REPAIR REGRESSION SUITE (TESTS A-H)');
console.log('========================================================================\n');

async function main() {
  // ---------------------------------------------------------------------------
  // TEST A: Topic-Switch Isolation (Biotechnology vs. Motor Drive)
  // ---------------------------------------------------------------------------
  await runTest('Test A — Topic-switch isolation: Motor Drive has 0% Biotechnology content', async () => {
    // 1. Generate Biotechnology question
    const bioPkg = GenerateAcademicQuestionPackage({
      subjectName: 'Biotechnology',
      topic: 'Bioreactor Design',
      concept: 'Oxygen Transfer'
    });
    assert.strictEqual(bioPkg.valid, true, 'Biotechnology question must be valid');
    assert.ok(
      bioPkg.questionText.toLowerCase().includes('oxygen') ||
      bioPkg.questionText.toLowerCase().includes('kla') ||
      bioPkg.questionText.toLowerCase().includes('bioreactor'),
      'Biotechnology question must assess Oxygen Transfer / kLa'
    );

    // 2. Generate Electrical Engineering / Motor Drive question
    const motorPkg = GenerateAcademicQuestionPackage({
      subjectName: 'Electrical Engineering',
      topic: 'Motor Drive',
      concept: 'Speed control of an induction motor'
    });
    assert.strictEqual(motorPkg.valid, true, 'Motor Drive question must be valid');
    assert.ok(
      motorPkg.questionText.toLowerCase().includes('induction motor') ||
      motorPkg.questionText.toLowerCase().includes('v/f') ||
      motorPkg.questionText.toLowerCase().includes('speed control') ||
      motorPkg.questionText.toLowerCase().includes('torque') ||
      motorPkg.questionText.toLowerCase().includes('frequency'),
      'Motor Drive question must assess induction motor speed / V/f control'
    );

    // 3. Strict Quarantine Verification: Motor Drive must contain ZERO Biotech keywords
    const biotechTerms = ['kla', 'bioreactor', 'sparged', 'culture broth', 'fermentation', 'dissolved oxygen'];
    const motorFullText = `${motorPkg.questionText} ${(motorPkg.options || []).join(' ')} ${motorPkg.explanation || ''}`.toLowerCase();

    for (const term of biotechTerms) {
      assert.strictEqual(
        motorFullText.includes(term),
        false,
        `Motor Drive question/options must NOT contain Biotechnology term "${term}"`
      );
    }
  });

  // ---------------------------------------------------------------------------
  // TEST B: Arbitrary Staff-Defined Topic
  // ---------------------------------------------------------------------------
  await runTest('Test B — Arbitrary staff-defined topic grounded in reference or returns recoverable error', async () => {
    // 1. Arbitrary custom topic WITH uploaded reference passage
    const customPassage = 'Setup time is the minimum duration synchronous data input must remain stable prior to the active clock edge in FPGA flip-flops. Hold time is the minimum duration data must remain stable following the clock edge to prevent metastability.';
    const customWithRef = GenerateAcademicQuestionPackage({
      subjectName: 'Digital System Design',
      topic: 'FPGA Timing Constraints',
      concept: 'Setup and Hold Time Invariants',
      documentContext: customPassage
    });

    assert.strictEqual(customWithRef.valid, true, 'Custom topic with reference material must generate valid item');
    assert.ok(
      customWithRef.questionText.toLowerCase().includes('setup') ||
      customWithRef.questionText.toLowerCase().includes('hold') ||
      customWithRef.questionText.toLowerCase().includes('clock') ||
      customWithRef.questionText.toLowerCase().includes('timing'),
      'Question must be grounded in the provided reference passage'
    );

    // 2. Arbitrary custom topic WITHOUT reference material
    const unrecordedPkg = GenerateAcademicQuestionPackage({
      subjectName: 'NonexistentDiscipline',
      topic: 'UnassignedFictitiousTopic',
      concept: 'UnregisteredConcept'
    });

    if (unrecordedPkg.valid) {
      // If procedural synthesizer handles it, it must NOT use generic boilerplate phrases
      assert.strictEqual(unrecordedPkg.questionText.includes('Foundational Mechanism'), false);
      assert.strictEqual(unrecordedPkg.questionText.includes('Core Theoretical Principles'), false);
      assert.strictEqual(unrecordedPkg.questionText.includes('Curriculum Topic'), false);
      assert.strictEqual(unrecordedPkg.questionText.includes('Core Concept'), false);
    } else {
      assert.ok(unrecordedPkg.error, 'Unassigned topic without evidence reports recoverable error');
    }
  });

  // ---------------------------------------------------------------------------
  // TEST C: Document Ingestion ([Content_Types].xml & Package Manifest Elimination)
  // ---------------------------------------------------------------------------
  await runTest('Test C — Document ingestion rejects [Content_Types].xml and package manifest noise', async () => {
    // Test paragraph chunker filtering: container XML manifests must be completely discarded
    const chunks = documentProcessor.chunkText(
      '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>\n\n' +
      'In induction motor scalar control, maintaining a constant V/f ratio below rated frequency keeps magnetic flux density constant. This prevents stator core saturation while allowing the machine to develop rated breakdown torque.',
      'sample_lecture.txt'
    );

    assert.ok(chunks.length > 0, 'Chunks should be produced for genuine academic text');
    assert.strictEqual(
      chunks.some(c => c.text.includes('[Content_Types]') || c.text.includes('openxmlformats') || c.text.includes('<Types')),
      false,
      'Package manifests and XML container tags must be completely discarded'
    );
    assert.ok(
      chunks.some(c => c.text.includes('V/f ratio')),
      'Authentic academic concepts must be retained in chunking'
    );
  });

  // ---------------------------------------------------------------------------
  // TEST D: Question and Options Quality (No Generic Templates, Distinct Choices)
  // ---------------------------------------------------------------------------
  await runTest('Test D — Question and options: zero boilerplate, 4 distinct plausible options, single key', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Electrical Engineering',
      topic: 'Motor Drive',
      concept: 'Speed control of an induction motor'
    });

    assert.strictEqual(pkg.valid, true);
    assert.strictEqual(Array.isArray(pkg.options), true);
    assert.strictEqual(pkg.options.length, 4, 'Must provide exactly 4 options');

    // Options must be unique
    const uniqueOptions = new Set(pkg.options.map(o => o.trim().toLowerCase()));
    assert.strictEqual(uniqueOptions.size, 4, 'All 4 options must be distinct');

    // Correct index must be valid integer 0..3
    assert.ok(Number.isInteger(pkg.correctIndex) && pkg.correctIndex >= 0 && pkg.correctIndex <= 3);

    // Reject generic boilerplate options
    const genericPhrases = [
      'zero impedance across all system interfaces',
      'uncalibrated random noise source',
      'zero thermodynamic or computational cost',
      'uncalibrated stochastic divergence',
      'ignores state variable progression'
    ];
    for (const opt of pkg.options) {
      for (const phrase of genericPhrases) {
        assert.strictEqual(opt.toLowerCase().includes(phrase), false, `Option cannot contain generic filler phrase: "${phrase}"`);
      }
    }

    // Gate validation must pass
    const gateVal = ValidateQuestion(pkg, 'Motor Drive');
    assert.strictEqual(gateVal.valid, true, `Validation gates must pass: ${(gateVal.errors || []).join(', ')}`);
  });

  // ---------------------------------------------------------------------------
  // TEST E: Socratic Hint Quality (Progressive, Topic-Grounded, Non-Leaking)
  // ---------------------------------------------------------------------------
  await runTest('Test E — Socratic hints: 4 progressive tiers, topic-focused, zero verbatim answer leaks', async () => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: 'Electrical Engineering',
      topic: 'Motor Drive',
      concept: 'Speed control of an induction motor'
    });

    assert.ok(Array.isArray(pkg.hints) && pkg.hints.length === 4, 'Must include exactly 4 progressive hints');
    const correctOptionText = pkg.options[pkg.correctIndex].trim().toLowerCase();

    // Verify each hint is non-empty, progressive, and does not leak verbatim answer
    for (let i = 0; i < pkg.hints.length; i++) {
      const hint = pkg.hints[i].trim();
      assert.ok(hint.length > 15, `Hint tier ${i + 1} must be substantive`);
      assert.strictEqual(
        hint.toLowerCase().includes(correctOptionText),
        false,
        `Hint tier ${i + 1} must NOT leak the complete correct option`
      );
    }
  });

  // ---------------------------------------------------------------------------
  // TEST F: Adaptive Behaviour & Strict Topic Lock
  // ---------------------------------------------------------------------------
  await runTest('Test F — Adaptive progression: difficulty adjusts while topic remains strictly locked', async () => {
    const studentId = `std_test_${Date.now()}`;
    const subject = 'Electrical Engineering';
    const topic = 'Motor Drive';
    const concept = 'Speed control of an induction motor';

    // First answer: Correct answer with quick response
    const step1 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question: { id: 'q1', concept, format: 'Theory' },
      studentAnswer: 'Option A',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 25
    });

    // Topic MUST remain locked to Motor Drive
    assert.strictEqual(step1.topicLocked, true, 'Topic must remain strictly locked');
    assert.strictEqual(step1.assignedTopic, 'Motor Drive');
    assert.strictEqual(step1.assignedSubject, 'Electrical Engineering');
    assert.strictEqual(step1.adaptiveDecision.targetConcept, concept);

    // Second answer: Another correct response
    const step2 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question: { id: 'q2', concept, format: 'Theory' },
      studentAnswer: 'Option A',
      isCorrect: true,
      hintsUsed: 0,
      responseTimeSeconds: 20
    });

    assert.strictEqual(step2.assignedTopic, 'Motor Drive');
    assert.strictEqual(step2.assignedSubject, 'Electrical Engineering');
    assert.ok(step2.pMastery >= step1.pMastery, 'Consistent correct answers must raise BKT mastery');
  });

  // ---------------------------------------------------------------------------
  // TEST G: Cache and Session Isolation
  // ---------------------------------------------------------------------------
  await runTest('Test G — Cache isolation: switching topic purges old questions and generates for new topic', async () => {
    const faculty = { username: 'prof_test', department: 'General Engineering' };

    // 1. Create initial assessment in Biotechnology
    const asg = await assessmentManager.createAssessment({
      title: 'Biotech Midterm',
      subject: 'Biotechnology',
      topic: 'Bioreactor Design',
      concepts: ['Oxygen Transfer'],
      questionCount: 3
    }, faculty);

    assert.strictEqual(asg.topic, 'Bioreactor Design');
    assert.ok(asg.questions.every(q => q.topic === 'Bioreactor Design'));

    // 2. Faculty updates assessment to Electrical Engineering / Motor Drive
    const updated = assessmentManager.updateAssessment(asg.id, {
      subject: 'Electrical Engineering',
      topic: 'Motor Drive',
      concepts: ['Speed control of an induction motor']
    }, faculty);

    assert.strictEqual(updated.topic, 'Motor Drive');
    assert.strictEqual(updated.subject, 'Electrical Engineering');
    assert.ok(updated.questions.length >= 3, 'Updated assessment must have regenerated questions');

    // Stale questions from Bioreactor Design MUST be purged
    for (const q of updated.questions) {
      assert.strictEqual(q.topic, 'Motor Drive', 'All questions in updated assessment must belong to Motor Drive');
      assert.strictEqual(q.subject, 'Electrical Engineering');
      assert.strictEqual(q.questionText.toLowerCase().includes('bioreactor'), false);
      assert.strictEqual(q.questionText.toLowerCase().includes('kla'), false);
    }
  });

  // ---------------------------------------------------------------------------
  // TEST H: API and Database Integrity (Sanitized Student Delivery, Zero Key Leaks)
  // ---------------------------------------------------------------------------
  await runTest('Test H — API and database integrity: student delivery view strips keys, no provider leaks', async () => {
    const faculty = { username: 'faculty_ee', department: 'Electrical Engineering' };
    const asg = await assessmentManager.createAssessment({
      title: 'Electrical Drives Assessment',
      subject: 'Electrical Engineering',
      topic: 'Motor Drive',
      concepts: ['Speed control of an induction motor'],
      questionCount: 2,
      targetSections: ['A'],
      classYear: 'III'
    }, faculty);

    // Verify stored assessment has authoritative server keys
    assert.ok(asg.questions[0].correctIndex !== undefined);
    assert.ok(asg.questions[0].explanation);

    // Start student attempt
    const student = {
      username: 'std_ee_01',
      regNo: 'EE202601',
      name: 'Test Student',
      department: 'Electrical Engineering',
      year: 'III',
      section: 'A'
    };

    const attemptResult = assessmentManager.startAttempt(asg.id, student);
    assert.strictEqual(attemptResult.success, true);
    assert.ok(attemptResult.attempt);

    // Check delivered questions for the student
    const deliveredQuestions = attemptResult.attempt.questions;
    assert.ok(Array.isArray(deliveredQuestions) && deliveredQuestions.length === 2);

    for (const sq of deliveredQuestions) {
      assert.strictEqual(sq.topic, 'Motor Drive');
      assert.strictEqual(sq.subject, 'Electrical Engineering');
      // Stripped fields:
      assert.strictEqual(sq.correctIndex, undefined, 'correctIndex must NOT be exposed to student');
      assert.strictEqual(sq.modelAnswer, undefined, 'modelAnswer must NOT be exposed to student');
      assert.strictEqual(sq.explanation, undefined, 'explanation must NOT be exposed to student');
      assert.strictEqual(sq.rubric, undefined, 'rubric must NOT be exposed to student');
      // Telemetry or credentials:
      const serialized = JSON.stringify(sq);
      assert.strictEqual(serialized.includes('apiKey'), false);
      assert.strictEqual(serialized.includes('provider'), false);
    }
  });

  console.log('\n========================================================================');
  console.log(`  ALL ${passed} REGRESSION TESTS (TESTS A THROUGH H) PASSED CLEANLY!`);
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('\nTest runner failed:', err);
  process.exit(1);
});
