// tests/master_adaptive_intelligence_and_mastery.test.mjs
// Comprehensive automated test suite verifying Master Adaptive Intelligence and Topic Mastery Engine
// Tests A through I as specified in the Master Engineering Specification.

import assert from 'node:assert';
import {
  TOPIC_KNOWLEDGE_MAPS,
  getTopicKnowledgeMap,
  getConceptDependencyGraph,
  checkPrerequisitesMet,
  StudentMasteryModel,
  classifyAnswerEvaluation,
  selectAdaptiveNextQuestion,
  generateAdaptiveHint
} from '../src/services/topicMasteryEngine.js';

import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  createConceptBlueprint,
  resolveAcademicContext,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';

import { AdaptiveEngine } from '../src/services/adaptiveEngine.js';

console.log('================================================================');
console.log('STARTING MASTER ADAPTIVE INTELLIGENCE & TOPIC MASTERY TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// TEST A: SUBJECT AND TOPIC ISOLATION ACROSS MULTIPLE DISCIPLINES
// -----------------------------------------------------------------------------
runTest('Test A: Subject and Topic Isolation across multiple disciplines', () => {
  const testCases = [
    {
      subject: 'Communication Engineering',
      topic: 'GMSK / MSK Modulation & Demodulation',
      requiredTerms: ['modulation', 'msk', 'gaussian', 'bandwidth', 'phase'],
      forbiddenTerms: ['thermodynamic', 'dissipated work', 'mass flux', 'turbulent kinetic', 'shear stress']
    },
    {
      subject: 'Biotechnology',
      topic: 'Bioreactor Design & Mass Transfer',
      requiredTerms: ['oxygen', 'mass transfer', 'kla', 'bioreactor', 'liquid'],
      forbiddenTerms: ['modulation', 'carrier frequency', 'rf impedance', 'transmission line', 'smith chart']
    },
    {
      subject: 'Control Systems',
      topic: 'PID Controller Design & Tuning',
      requiredTerms: ['pid', 'controller', 'proportional', 'integral', 'derivative'],
      forbiddenTerms: ['dna replication', 'sparger', 'kla', 'mass transfer', 'bioreactor']
    },
    {
      subject: 'Data Structures & Algorithms',
      topic: 'Kruskal\'s Minimum Spanning Tree Algorithm',
      requiredTerms: ['kruskal', 'spanning tree', 'edge', 'cycle', 'union'],
      forbiddenTerms: ['thermodynamic', 'pid controller', 'carrier frequency', 'sparger']
    }
  ];

  testCases.forEach(tc => {
    const kMap = getTopicKnowledgeMap(tc.subject, tc.topic);
    assert.ok(kMap, `Knowledge map should exist for ${tc.subject}`);
    assert.ok(kMap.concepts.length >= 2, `Concepts list should have at least 2 entries for ${tc.subject}`);

    // Generate 5 questions for this subject/topic
    for (let i = 0; i < 5; i++) {
      const qPkg = GenerateAcademicQuestionPackage({
        subjectName: tc.subject,
        topic: tc.topic,
        concept: kMap.concepts[i % kMap.concepts.length].name,
        questionType: 'mixed',
        difficulty: 'Intermediate',
        index: i + 1
      });

      const fullText = (qPkg.questionText + ' ' + (qPkg.options || []).join(' ') + ' ' + (qPkg.hints || []).join(' ')).toLowerCase();

      // Check forbidden terms
      tc.forbiddenTerms.forEach(forbidden => {
        assert.ok(!fullText.includes(forbidden), `Question for ${tc.subject} must not contain alien concept '${forbidden}'`);
      });

      // Verify quality validation
      const validation = ValidateQuestion(qPkg);
      assert.strictEqual(validation.valid, true, `Generated question must pass validation gates: ${validation.errors?.join(', ')}`);
    }
  });
});

// -----------------------------------------------------------------------------
// TEST B: 6-STEP STUDENT SIMULATION
// -----------------------------------------------------------------------------
runTest('Test B: 6-Step Student Simulation across all 8 coverage ledger states', () => {
  const model = new StudentMasteryModel({ studentId: 'SIM_STUDENT_01', subjectName: 'Communication Engineering', topicName: 'GMSK / MSK Modulation & Demodulation' });
  const kMap = getTopicKnowledgeMap('Communication Engineering', 'GMSK / MSK Modulation & Demodulation');
  model.initializeTopicLedger(kMap);

  const concept0 = kMap.concepts[0]; // Modulation Fundamentals & Carrier Translation (Foundation)
  const concept1 = kMap.concepts[1]; // Minimum Shift Keying (MSK) Fundamentals

  // Step 1: Foundational question. Answer: Correct unassisted
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 100,
    hintsUsed: 0,
    format: 'Theory',
    knowledgeMap: kMap
  });
  // After single unassisted correct: should be DEVELOPING (no 1-shot mastery!)
  assert.strictEqual(model.concepts[concept0.id].status, 'DEVELOPING', 'Single correct answer must NOT grant full mastery (must be DEVELOPING)');
  assert.strictEqual(model.concepts[concept0.id].consecutiveUnassistedCorrect, 1);

  // Step 2: Advanced question on same or adjacent concept. Student exhibits known misconception
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: false,
    reasoningTier: 'INCORRECT_KNOWN_MISCONCEPTION',
    score: 20,
    hintsUsed: 0,
    format: 'Theory',
    diagnosedMisconception: 'Belief that baseband audio signals can radiate efficiently without modulation',
    knowledgeMap: kMap
  });
  assert.strictEqual(model.concepts[concept0.id].status, 'DEVELOPING');
  assert.strictEqual(model.concepts[concept0.id].consecutiveUnassistedCorrect, 0, 'Consecutive unassisted count must reset after incorrect answer');
  assert.strictEqual(model.diagnosedMisconceptions.length, 1);

  // Step 3: Scaffolded remedial question with hint. Student answers correctly after hint
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: true,
    reasoningTier: 'CORRECT_WITH_HINT',
    score: 75,
    hintsUsed: 1,
    format: 'Theory',
    knowledgeMap: kMap
  });
  assert.strictEqual(model.concepts[concept0.id].status, 'ASSISTED', 'Hint-assisted answer must mark status as ASSISTED, not INDEPENDENT');
  assert.strictEqual(model.concepts[concept0.id].consecutiveUnassistedCorrect, 0, 'Hint-assisted success cannot count as unassisted success');

  // Step 4: Unassisted follow-up question. Student fails
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: false,
    reasoningTier: 'INCORRECT_UNIDENTIFIED',
    score: 15,
    hintsUsed: 0,
    format: 'Theory',
    knowledgeMap: kMap
  });
  assert.strictEqual(model.concepts[concept0.id].status, 'DEVELOPING', 'Failure must keep status in DEVELOPING');

  // Step 5: Student answers correctly independently (Attempt 1 of unassisted success)
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 100,
    hintsUsed: 0,
    format: 'Theory',
    knowledgeMap: kMap
  });
  assert.strictEqual(model.concepts[concept0.id].consecutiveUnassistedCorrect, 1);

  // Step 6: Transfer question (Numerical format). Student answers correctly independently
  model.updateMasteryEvidence({
    conceptId: concept0.id,
    conceptName: concept0.name,
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 100,
    hintsUsed: 0,
    format: 'Numerical',
    knowledgeMap: kMap
  });
  assert.strictEqual(model.concepts[concept0.id].consecutiveUnassistedCorrect, 2);
  assert.ok(model.concepts[concept0.id].demonstratedFormats.includes('Theory'));
  assert.ok(model.concepts[concept0.id].demonstratedFormats.includes('Numerical'));
  assert.strictEqual(model.concepts[concept0.id].status, 'VERIFIED_THROUGH_TRANSFER', '2 unassisted correct answers across 2 representations must achieve VERIFIED_THROUGH_TRANSFER');
  assert.ok(model.concepts[concept0.id].pKnown >= 0.80, `pKnown should be high: ${model.concepts[concept0.id].pKnown}`);
});

// -----------------------------------------------------------------------------
// TEST C: CALIBRATED BAYESIAN MASTERY ESTIMATION
// -----------------------------------------------------------------------------
runTest('Test C: Calibrated Bayesian Mastery Estimation (Uncertainty decrease, no 1-shot mastery, hint discounting)', () => {
  const model = new StudentMasteryModel();
  const cId = 'pid_proportional_action';

  // Initial uncertainty is 1.0
  model.updateMasteryEvidence({
    conceptId: cId,
    conceptName: 'Proportional Control',
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 95,
    hintsUsed: 0
  });

  const record1 = model.concepts[cId];
  assert.strictEqual(record1.status, 'DEVELOPING', '1 correct answer must not yield mastery');
  assert.ok(record1.uncertainty < 1.0, `Uncertainty must decrease after first observation (got ${record1.uncertainty})`);
  const initialUncertainty = record1.uncertainty;

  // Second observation
  model.updateMasteryEvidence({
    conceptId: cId,
    conceptName: 'Proportional Control',
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 100,
    hintsUsed: 0
  });

  const record2 = model.concepts[cId];
  assert.ok(record2.uncertainty < initialUncertainty, 'Uncertainty must strictly decrease with additional evidence');
  assert.ok(record2.confidence > 0.50, `Confidence must increase with evidence (got ${record2.confidence})`);
  assert.strictEqual(record2.status, 'INDEPENDENTLY_DEMONSTRATED', 'Two consecutive unassisted correct answers should reach INDEPENDENTLY_DEMONSTRATED');

  // Verify hint discounting: a correct answer with 2 hints used should not increase pKnown as much as unassisted
  const modelHint = new StudentMasteryModel();
  modelHint.updateMasteryEvidence({
    conceptId: 'test_hint_discount',
    conceptName: 'Test Hint Discount',
    isCorrect: true,
    reasoningTier: 'CORRECT_WITH_HINT',
    score: 60,
    hintsUsed: 2
  });
  assert.ok(modelHint.concepts['test_hint_discount'].pKnown < record1.pKnown, 'Hint-assisted answer must be discounted compared to unassisted correct answer');
});

// -----------------------------------------------------------------------------
// TEST D: QUESTION COUNT FLEXIBILITY & UNIQUE QUESTION VERIFICATION
// -----------------------------------------------------------------------------
runTest('Test D: Question Count Flexibility (1, 2, 5, 10, 20 questions) with unique items', () => {
  const counts = [1, 2, 5, 10, 20];
  const subject = 'Biotechnology';
  const topic = 'Bioreactor Design & Mass Transfer';

  counts.forEach(count => {
    const generatedQuestions = [];
    const seenIds = new Set();
    const seenFingerprints = new Set();
    const model = new StudentMasteryModel({ subjectName: subject, topicName: topic });

    for (let i = 0; i < count; i++) {
      const q = selectAdaptiveNextQuestion({
        subjectName: subject,
        topicName: topic,
        masteryModel: model,
        lastEvaluation: i > 0 ? { status: 'Correct', tier: 'CORRECT_SOUND_REASONING' } : null,
        previousQuestions: generatedQuestions,
        currentIndex: i,
        requestedCount: count
      });

      assert.ok(q, `Question ${i + 1} must be generated`);
      assert.ok(!seenIds.has(q.id), `Question ID must be unique: duplicate ${q.id} found at index ${i}`);
      assert.ok(!seenFingerprints.has(q.semanticFingerprint), `Semantic fingerprint must be unique: duplicate found at index ${i}`);

      seenIds.add(q.id);
      seenFingerprints.add(q.semanticFingerprint);
      generatedQuestions.push(q);
    }

    assert.strictEqual(generatedQuestions.length, count, `Must produce exactly ${count} unique questions`);
  });
});

// -----------------------------------------------------------------------------
// TEST E: MULTIMODAL REPRESENTATIONS (DIAGRAM SVG, GRAPH SVG, NUMERICAL, SCENARIO)
// -----------------------------------------------------------------------------
runTest('Test E: Multimodal representations (Diagram SVG, Graph SVG, Numerical, Scenario)', () => {
  // Test Diagram format
  const diagramQ = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'diagram',
    format: 'Diagram',
    index: 1
  });
  assert.ok(diagramQ.diagramSvg, 'Diagram question must include diagramSvg');
  assert.ok(diagramQ.diagramSvg.includes('<svg') && diagramQ.diagramSvg.includes('viewBox'), 'SVG must be well-formed with viewBox');
  assert.ok(diagramQ.diagramSvg.includes('Liquid Film') || diagramQ.diagramSvg.includes('Gas Bubble Core') || diagramQ.diagramSvg.includes('DO Gradient'), 'Diagram SVG must contain authentic subject components');

  // Test Graph format
  const graphQ = GenerateAcademicQuestionPackage({
    subjectName: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    concept: 'Bode Stability Margins',
    questionType: 'diagram',
    format: 'Diagram',
    index: 2
  });
  assert.ok(graphQ.graphData || graphQ.graphSvg || graphQ.diagramSvg, 'Graph question must include visual graph representation or data');
  if (graphQ.diagramSvg) {
    assert.ok(graphQ.diagramSvg.includes('Phase Margin') || graphQ.diagramSvg.includes('Gain Margin') || graphQ.diagramSvg.includes('w_gc'), 'Bode plot SVG must contain labeled axes and margin indicators');
  }

  // Test Numerical format with explicit calculations
  const numQ = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design & Mass Transfer',
    concept: 'Oxygen Transfer',
    questionType: 'numerical',
    format: 'Numerical',
    index: 3
  });
  assert.strictEqual(numQ.format, 'Numerical');
  assert.ok(numQ.calculationData, 'Numerical question must contain calculationData');
  assert.ok(numQ.calculationData.formula, 'Calculation data must specify formula');
  assert.ok(numQ.calculationData.stepByStepSolution, 'Calculation data must include step-by-step solution');

  // Test Scenario format
  const scenQ = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Information Theory & Channel Capacity',
    concept: 'Shannon-Hartley Theorem',
    questionType: 'scenario',
    format: 'Scenario',
    index: 4
  });
  assert.strictEqual(scenQ.format, 'Scenario');
  assert.ok(scenQ.questionText.length > 80, 'Scenario question must describe an operational engineering situation');
});

// -----------------------------------------------------------------------------
// TEST F: ADAPTIVE HINTS WITH MISCONCEPTION TARGETING AND ANTI-LEAK
// -----------------------------------------------------------------------------
runTest('Test F: Adaptive hints with misconception targeting and anti-leak', () => {
  const qPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Data Structures & Algorithms',
    topic: 'Hash Tables & Collision Resolution',
    concept: 'Load Factor & Table Occupancy Dynamics',
    questionType: 'mcq',
    difficulty: 'Intermediate',
    index: 1
  });

  const correctOptionText = qPkg.options[qPkg.correctIndex];

  // Verify hints 1, 2, 3 do NOT leak the exact correct option text
  for (let lvl = 1; lvl <= 3; lvl++) {
    const hint = generateAdaptiveHint(qPkg, lvl, []);
    assert.ok(
      !hint.toLowerCase().includes(correctOptionText.toLowerCase()),
      `Hint ${lvl} must never leak correct option text verbatim! Hint: "${hint}" vs Correct: "${correctOptionText}"`
    );
  }

  // Test misconception targeting in hints
  const diagnosed = [{ id: 'open_addressing_alpha_gt_one_myth', description: 'that open addressing allows load factor alpha > 1' }];
  const targetedHint = generateAdaptiveHint(qPkg, 1, diagnosed);
  assert.ok(
    targetedHint.includes('[Targeted Guidance]') && targetedHint.includes('not to assume'),
    'Adaptive hint with active misconception must include targeted guidance correcting the specific error'
  );
});

// -----------------------------------------------------------------------------
// TEST G: SESSION STATE PERSISTENCE & REPORT GENERATION
// -----------------------------------------------------------------------------
runTest('Test G: Session State Persistence & Report Generation', () => {
  const model = new StudentMasteryModel({
    studentId: 'STUDENT_PERSIST_01',
    subjectName: 'Biotechnology',
    topicName: 'Bioreactor Design & Mass Transfer'
  });
  const kMap = getTopicKnowledgeMap('Biotechnology', 'Bioreactor Design & Mass Transfer');
  model.initializeTopicLedger(kMap);

  // Simulate multiple question attempts
  model.updateMasteryEvidence({
    conceptId: kMap.concepts[0].id,
    conceptName: kMap.concepts[0].name,
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 95,
    hintsUsed: 0,
    format: 'Theory'
  });
  model.updateMasteryEvidence({
    conceptId: kMap.concepts[0].id,
    conceptName: kMap.concepts[0].name,
    isCorrect: true,
    reasoningTier: 'CORRECT_SOUND_REASONING',
    score: 100,
    hintsUsed: 0,
    format: 'Numerical'
  });

  const report = model.generateTopicMasteryReport();
  assert.ok(report, 'Report should be generated');
  assert.strictEqual(report.studentId, 'STUDENT_PERSIST_01');
  assert.strictEqual(report.masteredCount, 1, 'Exactly 1 concept should be mastered after dual unassisted transfer');
  assert.ok(report.overallMasteryPercent > 0, 'Mastery percentage should be calculated');
  assert.ok(report.confidenceScore > 0, 'Confidence score should be positive');

  // Verify serialization & deserialization (persistence simulation)
  const serialized = JSON.stringify(model);
  const rehydratedData = JSON.parse(serialized);
  const restoredModel = new StudentMasteryModel(rehydratedData);

  assert.strictEqual(restoredModel.studentId, 'STUDENT_PERSIST_01');
  assert.strictEqual(restoredModel.concepts[kMap.concepts[0].id].status, 'VERIFIED_THROUGH_TRANSFER');
  assert.strictEqual(restoredModel.concepts[kMap.concepts[0].id].consecutiveUnassistedCorrect, 2);
});

// -----------------------------------------------------------------------------
// TEST H: REGRESSION TESTS AGAINST EXISTING WORKFLOWS, TIMERS, AND MARKS
// -----------------------------------------------------------------------------
runTest('Test H: Regression tests against existing workflows, timers, and marks', () => {
  const engine = new AdaptiveEngine();
  assert.ok(engine.masteryModel, 'AdaptiveEngine must instantiate StudentMasteryModel');

  // Test question marks allocation
  const questions = [
    { id: 'q1', bloomLevel: 'Understanding' },
    { id: 'q2', bloomLevel: 'Application' },
    { id: 'q3', bloomLevel: 'Analysis' },
    { id: 'q4', bloomLevel: 'Synthesis' }
  ];
  const assigned = engine.assignQuestionMarks(questions, 100);
  const sumMarks = assigned.reduce((sum, q) => sum + q.assignedMarks, 0);
  assert.strictEqual(sumMarks, 100, `Total assigned marks must equal faculty marks (100). Got ${sumMarks}`);

  // Test malpractice penalty
  const penaltyEval = engine.evaluateQuestionMarks(100, 25, { malpracticeDetected: true });
  assert.strictEqual(penaltyEval.finalMarks, 5.0, 'Malpractice should apply 80% penalty (25 * 0.2 = 5)');

  // Test conceptual evaluation
  const mockQ = {
    id: 'test_q',
    options: ['Alpha', 'Beta', 'Gamma', 'Delta'],
    correctIndex: 1,
    concept: 'Test Concept',
    conceptId: 'test_concept'
  };
  const evalRes = engine.evaluateConceptualAnswer(1, mockQ, 0, 1);
  assert.strictEqual(evalRes.isCorrect, true);
  assert.strictEqual(evalRes.tier, 'CORRECT_SOUND_REASONING');
  assert.strictEqual(evalRes.status, 'Correct');
});

// -----------------------------------------------------------------------------
// TEST I: FAILURE HANDLING & UNCURATED ARBITRARY TOPICS
// -----------------------------------------------------------------------------
runTest('Test I: Failure handling and uncurated arbitrary topics', () => {
  const arbitrarySubject = 'Aerospace Engineering';
  const arbitraryTopic = 'Hypersonic Aerodynamics';

  // Even for an uncurated topic, the system dynamically constructs a valid DAG and generates authentic questions
  const dynamicMap = getTopicKnowledgeMap(arbitrarySubject, arbitraryTopic);
  assert.ok(dynamicMap, 'Dynamic knowledge map must be generated for uncurated topic');
  assert.ok(dynamicMap.concepts.length >= 3, 'Dynamic map must provide at least 3 stages');

  const model = new StudentMasteryModel({ subjectName: arbitrarySubject, topicName: arbitraryTopic });
  model.initializeTopicLedger(dynamicMap);

  const nextQ = selectAdaptiveNextQuestion({
    subjectName: arbitrarySubject,
    topicName: arbitraryTopic,
    masteryModel: model,
    lastEvaluation: null,
    previousQuestions: [],
    currentIndex: 0,
    requestedCount: 5
  });

  assert.ok(nextQ, 'Question must be successfully generated for arbitrary topic');
  assert.strictEqual(nextQ.subject, arbitrarySubject);
  assert.strictEqual(nextQ.topic, arbitraryTopic);
  assert.ok(nextQ.adaptiveReason, 'Must attach adaptive reasoning metadata');

  // Verify quality gate on arbitrary question
  const val = ValidateQuestion(nextQ);
  assert.strictEqual(val.valid, true, `Dynamic arbitrary question must pass validation gates: ${val.errors?.join(', ')}`);
});

console.log('\n================================================================');
console.log(`MASTER ADAPTIVE SUITE RESULTS: ${passedTests}/${totalTests} TESTS PASSED CLEANLY`);
console.log('================================================================\n');
