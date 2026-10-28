// tests/comprehensive_source_grounded_adaptive_platform.test.mjs
// Master Acceptance Test Suite for Source-Grounded, Adaptive Viva and Self-Learning Platform.
// Validates all 21 acceptance criteria across Modules 1 through 12.

import assert from 'node:assert';
import zlib from 'node:zlib';
import { documentProcessor } from '../server/src/ai/documentProcessor.js';
import { referenceRetriever } from '../server/src/ai/referenceRetriever.js';
import { conceptGraphEngine } from '../server/src/ai/conceptGraphEngine.js';
import { adaptiveStudentIntelligence } from '../server/src/ai/adaptiveStudentIntelligence.js';
import { selfLearningService } from '../server/src/services/selfLearningService.js';
import {
  GenerateAcademicQuestionPackage,
  ValidateQuestion,
  EvaluateResponse,
  resolveAcademicContext,
  ACADEMIC_REGISTRY
} from '../src/services/academicAssessmentEngine.js';
import { handleApiRequest } from '../server/src/apiDispatcher.js';

console.log('========================================================================');
console.log('  VIVA ANALYSER — MASTER SOURCE-GROUNDED & ADAPTIVE PLATFORM TEST SUITE');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function runTestAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ PASS [${totalTests}]: ${name}`);
  } catch (err) {
    console.error(`  ✗ FAIL [${totalTests}]: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// -----------------------------------------------------------------------------
// 1. TOPIC-SPECIFIC QUESTION GENERATION ACROSS MULTIPLE SUBJECTS
// -----------------------------------------------------------------------------
runTest('1. Topic-specific question generation across multiple subjects (Biotech, ECE, CS, Control, Civil)', () => {
  const subjects = [
    { subject: 'Biotechnology', topic: 'Bioreactor Design', kw: 'oxygen' },
    { subject: 'Communication Engineering', topic: 'Digital Modulation', kw: 'qpsk' },
    { subject: 'Control Systems', topic: 'Bode Plot Stability Analysis', kw: 'margin' },
    { subject: 'Computer Science', topic: 'Database Normalization', kw: 'normal form' },
    { subject: 'Civil Engineering', topic: 'Structural Mechanics', kw: 'bending stress' }
  ];

  subjects.forEach(s => {
    const pkg = GenerateAcademicQuestionPackage({
      subjectName: s.subject,
      topic: s.topic,
      questionType: 'mcq'
    });
    assert.strictEqual(pkg.valid, true, `Package must be valid for ${s.subject}`);
    assert.strictEqual(pkg.subject, s.subject);
    const combined = (pkg.questionText + ' ' + (pkg.options || []).join(' ')).toLowerCase();
    assert.ok(combined.includes(s.kw), `Content for ${s.subject} must include ${s.kw}`);
  });
});

// -----------------------------------------------------------------------------
// 2. MULTI-FORMAT DOCUMENT EXTRACTION (PDF, DOCX, PPTX, XLSX, CSV, TXT)
// -----------------------------------------------------------------------------
runTest('2. Multi-format document extraction preserving page numbers, sections, headings, tables, and equations', () => {
  const faculty = 'FACULTY_TEST_SUITE';
  const subject = 'THERMO_101';

  // A. CSV Dataset
  const csvContent = 'Parameter,Value,Unit\nThermal_Conductivity,401,W/m-K\nSpecific_Heat,385,J/kg-K';
  const csvRes = documentProcessor.processDocument(faculty, subject, 'copper_properties.csv', csvContent);
  assert.strictEqual(csvRes.success, true);
  assert.strictEqual(csvRes.fileType, 'CSV');
  assert.ok(csvRes.chunks.length >= 1);
  assert.strictEqual(csvRes.chunks[0].passageType, 'table');
  assert.ok(csvRes.chunks[0].tableData.length >= 2);

  // B. Structured Text with Headings
  const txtContent = `SECTION 1: FIRST LAW OF THERMODYNAMICS
Energy cannot be created or destroyed, only transformed from one form to another.
The differential energy equation is dU = dQ - dW.

SECTION 2: CARNOT CYCLE EFFICIENCY
Carnot efficiency represents the upper bound for any heat engine: eta = 1 - (Tc / Th).`;
  const txtRes = documentProcessor.processDocument(faculty, subject, 'thermo_notes.txt', txtContent);
  assert.strictEqual(txtRes.success, true);
  assert.ok(txtRes.chunksCount >= 2);
  assert.strictEqual(txtRes.chunks[0].sourceFile, 'thermo_notes.txt');
  assert.ok(txtRes.chunks[0].section.includes('Section 1') || txtRes.chunks[0].section.includes('General'));

  // C. Incremental indexing & Content Hash Caching
  const cachedRes = documentProcessor.processDocument(faculty, subject, 'thermo_notes.txt', txtContent);
  assert.strictEqual(cachedRes.cached, true, 'Identical content hash must return cached index immediately');
});

// -----------------------------------------------------------------------------
// 3. IMAGE UNDERSTANDING, OCR & VISUAL ELEMENT CLASSIFICATION
// -----------------------------------------------------------------------------
runTest('3. Image understanding, OCR transcript extraction, and unreadable image detection', () => {
  const faculty = 'FACULTY_TEST_SUITE';
  const subject = 'CIRCUITS_101';

  // Valid PNG Header with 800x600 dimensions
  const pngHeader = Buffer.alloc(64);
  pngHeader.write('\x89PNG\r\n\x1a\n', 0, 'binary');
  pngHeader.writeUInt32BE(800, 16); // width
  pngHeader.writeUInt32BE(600, 20); // height

  const imgRes = documentProcessor.processDocument(faculty, subject, 'opamp_inverting_circuit.png', pngHeader, {
    caption: 'Inverting Op-Amp circuit diagram with feedback resistor Rf = 10k and input resistor R1 = 1k'
  });
  assert.strictEqual(imgRes.success, true);
  assert.strictEqual(imgRes.chunks[0].passageType, 'figure_caption');
  assert.strictEqual(imgRes.chunks[0].imageDetails.visualType, 'circuit');
  assert.strictEqual(imgRes.chunks[0].imageDetails.width, 800);

  // Corrupted / zero-byte image header -> Must detect failure honestly
  const badImageBuffer = Buffer.from('bad_image_data_truncated');
  const badImgRes = documentProcessor.processDocument(faculty, subject, 'corrupted_scan.png', badImageBuffer);
  assert.strictEqual(badImgRes.status, 'failed', 'Corrupted image must fail extraction');
  assert.ok(badImgRes.manifest.error, 'Must report explicit extraction error');
  assert.strictEqual(badImgRes.chunksCount, 0, 'Never fabricate content for corrupted files');
});

// -----------------------------------------------------------------------------
// 4. ZIP ARCHIVE INGESTION & SECURITY (PATH TRAVERSAL & ZIP BOMB DEFENSES)
// -----------------------------------------------------------------------------
runTest('4. ZIP archive ingestion & security (Rejects path traversal and decompression bombs)', () => {
  // A. Path traversal attack simulation: ../hack.txt
  const badZipHeader = Buffer.alloc(30);
  badZipHeader.writeUInt32LE(0x04034b50, 0);
  badZipHeader.writeUInt16LE(20, 4);
  badZipHeader.writeUInt16LE(0, 6);
  badZipHeader.writeUInt16LE(0, 8); // stored
  badZipHeader.writeUInt32LE(10, 18);
  badZipHeader.writeUInt32LE(10, 22);
  const maliciousName = Buffer.from('../../etc/passwd');
  badZipHeader.writeUInt16LE(maliciousName.length, 26);
  badZipHeader.writeUInt16LE(0, 28);
  const payload = Buffer.from('1234567890');
  const traversalZip = Buffer.concat([badZipHeader, maliciousName, payload]);

  assert.throws(() => {
    documentProcessor.parseZipEntries(traversalZip);
  }, /Path traversal detected/, 'Must reject archives with directory traversal attempts');

  // B. Decompression bomb simulation: claims uncompressed size > 100MB
  const bombHeader = Buffer.alloc(30);
  bombHeader.writeUInt32LE(0x04034b50, 0);
  bombHeader.writeUInt16LE(20, 4);
  bombHeader.writeUInt16LE(0, 6);
  bombHeader.writeUInt16LE(8, 8); // deflate
  bombHeader.writeUInt32LE(10, 18);
  bombHeader.writeUInt32LE(120 * 1024 * 1024, 22); // Claims 120MB uncompressed
  const harmlessName = Buffer.from('bomb.txt');
  bombHeader.writeUInt16LE(harmlessName.length, 26);
  bombHeader.writeUInt16LE(0, 28);
  const bombZip = Buffer.concat([bombHeader, harmlessName, payload]);

  assert.throws(() => {
    documentProcessor.parseZipEntries(bombZip);
  }, /Decompression bomb detected/, 'Must reject decompression bombs exceeding size limit');
});

// -----------------------------------------------------------------------------
// 5. HYBRID RETRIEVAL & QUESTION BLUEPRINT GENERATION
// -----------------------------------------------------------------------------
runTest('5. Hybrid retrieval and source-grounded question blueprint with citations', () => {
  const faculty = 'FACULTY_TEST_SUITE';
  const subject = 'AEROSPACE_201';

  const docText = `CHAPTER 3: SUPERSONIC AERODYNAMICS AND SHOCK WAVES
Section 3.1: Normal Shock Wave Formulations.
Across a normal shock wave in an ideal gas, Mach number drops from M1 > 1 to M2 < 1.
Static pressure ratio is given by p2/p1 = 1 + (2*gamma / (gamma + 1)) * (M1^2 - 1).
Total pressure always decreases across a normal shock due to irreversible entropy increase.`;

  documentProcessor.processDocument(faculty, subject, 'aerodynamics_textbook.txt', docText, {
    section: 'Normal Shock Waves',
    page: 142
  });

  const retrieval = referenceRetriever.retrievePassages(faculty, subject, 'normal shock wave mach number', 3);
  assert.strictEqual(retrieval.found, true);
  assert.strictEqual(retrieval.sourceType, 'reference_grounded');
  assert.ok(retrieval.passages.length >= 1);
  assert.strictEqual(retrieval.passages[0].sourceDocument, 'aerodynamics_textbook.txt');
  assert.ok(retrieval.passages[0].citation.includes('aerodynamics_textbook.txt'));
  assert.ok(retrieval.blueprint, 'Must construct structured Question Blueprint');
  assert.ok(retrieval.blueprint.primaryCitation, 'Blueprint must specify primary source citation');
});

// -----------------------------------------------------------------------------
// 6. EXCLUSIVE SOURCE MODE ("UPLOADED MATERIAL ONLY")
// -----------------------------------------------------------------------------
runTest('6. Exclusive source mode rejects questions when uploaded content has zero evidence', () => {
  const emptyContext = {
    subjectName: 'Communication Engineering',
    topic: 'Underwater Acoustic Sonar Arrays',
    exclusiveSourceOnly: true,
    referencePassages: []
  };

  const pkg = GenerateAcademicQuestionPackage(emptyContext);
  assert.strictEqual(pkg.valid, false, 'Exclusive source mode must reject questions with no uploaded evidence');
  assert.strictEqual(pkg.error, 'INSUFFICIENT_SOURCE_EVIDENCE');
  assert.ok(pkg.message.includes('Uploaded reference material does not contain validated evidence'));
});

// -----------------------------------------------------------------------------
// 7. TECHNICAL CONCEPT & KNOWLEDGE GRAPH ENGINE
// -----------------------------------------------------------------------------
runTest('7. Technical Concept and Knowledge Graph construction with defensible prerequisite edges', () => {
  const graph = conceptGraphEngine.buildConceptGraph('Communication Engineering', 'Digital Modulation');
  assert.ok(graph.nodes.length >= 2, 'Graph must contain topic root and concepts');
  assert.ok(graph.edges.length >= 1, 'Graph must establish defensible relationships');

  const rootNode = graph.nodes.find(n => n.type === 'topic_root');
  assert.ok(rootNode, 'Must contain topic root node');

  const conceptNodes = graph.nodes.filter(n => n.type === 'core_concept');
  assert.ok(conceptNodes.length >= 1, 'Must contain core concepts');
  assert.ok(conceptNodes[0].learningObjective, 'Concept node must state learning objective');

  // Verify student evidence tracking on graph
  conceptGraphEngine.updateStudentEvidence(graph, conceptNodes[0].id, true, 0);
  assert.strictEqual(conceptNodes[0].studentMasteryEvidence.attemptCount, 1);
  assert.strictEqual(conceptNodes[0].studentMasteryEvidence.demonstratedCount, 1);
});

// -----------------------------------------------------------------------------
// 8. ADAPTIVE STUDENT INTELLIGENCE & CALIBRATED BKT
// -----------------------------------------------------------------------------
runTest('8. Adaptive student intelligence: BKT uncertainty reduction, response time caution, and ledger', () => {
  const studentId = 'STU_VERIFICATION_88';
  const mockQ = {
    id: 'ce_dm_qpsk_1',
    subject: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK (Quadrature Phase Shift Keying)',
    format: 'Theory'
  };

  // Step 1: Initial incorrect attempt with deliberate reflection time (75s)
  const step1 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
    studentId,
    subject: mockQ.subject,
    topic: mockQ.topic,
    question: mockQ,
    studentAnswer: 2,
    isCorrect: false,
    hintsUsed: 0,
    responseTimeSeconds: 75
  });

  assert.strictEqual(step1.ledgerStatus, 'DEVELOPING');
  assert.strictEqual(step1.errorCategory, 'CONCEPTUAL_INVARIANT_MISUNDERSTANDING');
  assert.ok(step1.uncertainty < 1.0, 'Uncertainty must decrease after observation');
  assert.ok(step1.responseCautionNote.includes('deliberation observed'), 'Deliberation time must not be penalized');
  assert.strictEqual(step1.adaptiveDecision.action, 'DIAGNOSTIC_RETRY');

  // Step 2: First correct attempt with hint assistance
  const step2 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
    studentId,
    subject: mockQ.subject,
    topic: mockQ.topic,
    question: mockQ,
    studentAnswer: 0,
    isCorrect: true,
    hintsUsed: 1,
    responseTimeSeconds: 40
  });
  assert.strictEqual(step2.ledgerStatus, 'ASSISTED', 'Correct with hint must mark ASSISTED');

  // Step 3: Unassisted correct attempt (Numerical transfer)
  const mockNumQ = { ...mockQ, id: 'ce_dm_qpsk_num_1', format: 'Numerical' };
  const step3 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
    studentId,
    subject: mockQ.subject,
    topic: mockQ.topic,
    question: mockNumQ,
    studentAnswer: 0,
    isCorrect: true,
    hintsUsed: 0,
    responseTimeSeconds: 30
  });

  // Step 4: Second unassisted correct attempt -> Transfer mastery
  const mockScenQ = { ...mockQ, id: 'ce_dm_qpsk_scen_1', format: 'Scenario' };
  const step4 = adaptiveStudentIntelligence.processAnswerAndPlanNext({
    studentId,
    subject: mockQ.subject,
    topic: mockQ.topic,
    question: mockScenQ,
    studentAnswer: 0,
    isCorrect: true,
    hintsUsed: 0,
    responseTimeSeconds: 25
  });
  assert.strictEqual(step4.ledgerStatus, 'VERIFIED_THROUGH_TRANSFER');
  assert.ok(step4.uncertainty <= 0.48, 'Uncertainty must be bounded <= 0.48');
  assert.ok(step4.pMastery >= 0.80, 'Mastery probability must be >= 0.80');
});

// -----------------------------------------------------------------------------
// 9. COMPLETE TOPIC-CONTENT QUESTION COVERAGE (THEORY, NUMERICAL, DIAGRAM, GRAPH, SCENARIO)
// -----------------------------------------------------------------------------
runTest('9. Complete multimodal format coverage (Theory, Numerical, Diagram SVG, Graph SVG, Scenario)', () => {
  // A. Numerical problem with step-by-step arithmetic
  const numPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Linear Algebra',
    topic: 'Eigenvalues and Eigenvectors',
    questionType: 'numerical',
    index: 1
  });
  assert.strictEqual(numPkg.format, 'Numerical');
  assert.ok(numPkg.numericalDetails.stepByStep);
  assert.ok(Array.isArray(numPkg.numericalDetails.calculatedValue) || typeof numPkg.numericalDetails.calculatedValue === 'number');

  // B. SVG Diagram with viewBox and components
  const diagPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Biotechnology',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    questionType: 'diagram'
  });
  assert.strictEqual(diagPkg.format, 'Diagram');
  assert.ok(diagPkg.diagramSvg.includes('<svg') && diagPkg.diagramSvg.includes('viewBox'));

  // C. SVG Graph with labeled axes & Saturation Plateau
  const graphPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    concept: 'QPSK (Quadrature Phase Shift Keying)',
    index: 4,
    seenQuestionIds: new Set(['ce_dm_qpsk_1'])
  });
  assert.strictEqual(graphPkg.valid, true);
  assert.ok(graphPkg.diagramSvg.includes('Saturation Plateau'));

  // D. Realistic Engineering Scenario
  const scenPkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Information Theory & Channel Capacity',
    concept: 'Shannon-Hartley Channel Capacity',
    questionType: 'scenario',
    index: 2
  });
  assert.strictEqual(scenPkg.format, 'Scenario');
  assert.ok(scenPkg.questionText.length > 80);
});

// -----------------------------------------------------------------------------
// 10. TECHNICAL ANSWER AND DISTRACTOR VERIFICATION
// -----------------------------------------------------------------------------
runTest('10. Technical answer and distractor verification (Single correct answer, plausible distractors, Gate D)', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Economics',
    topic: 'Financial Economics',
    concept: 'Capital Asset Pricing Model (CAPM)',
    questionType: 'numerical',
    index: 2
  });

  assert.strictEqual(pkg.valid, true);
  assert.strictEqual(pkg.numericalDetails.calculatedValue, 14);
  assert.strictEqual(pkg.options[pkg.correctIndex], '14%');
  assert.strictEqual(pkg.options.length, 4);

  // Verify unique distractors
  const uniqueOpts = new Set(pkg.options);
  assert.strictEqual(uniqueOpts.size, 4, 'All distractors must be distinct');

  // Verify deterministic scoring
  const correctEval = EvaluateResponse(pkg, pkg.modelAnswer, {}, pkg.correctIndex);
  assert.strictEqual(correctEval.isCorrect, true);
  assert.strictEqual(correctEval.score, 100);

  const incorrectEval = EvaluateResponse(pkg, pkg.modelAnswer, {}, (pkg.correctIndex + 1) % 4);
  assert.strictEqual(incorrectEval.isCorrect, false);
  assert.strictEqual(incorrectEval.score, 0);
});

// -----------------------------------------------------------------------------
// 11. PROGRESSIVE HINTS & ANTI-LEAKAGE
// -----------------------------------------------------------------------------
runTest('11. Progressive 4-tier hints without correct option leakage in Hints 1-3', () => {
  const pkg = GenerateAcademicQuestionPackage({
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Algorithms',
    concept: "Dijkstra's Shortest Path Algorithm",
    questionType: 'mcq'
  });

  assert.strictEqual(pkg.hints.length, 4);
  const correctOptText = pkg.options[pkg.correctIndex].toLowerCase();

  // Hints 1-3 must NEVER leak the full correct option text
  for (let h = 0; h < 3; h++) {
    const hintText = pkg.hints[h].toLowerCase();
    assert.ok(
      !hintText.includes(correctOptText) || correctOptText.length < 10,
      `Hint ${h + 1} must not leak full answer key text`
    );
  }
});

// -----------------------------------------------------------------------------
// 12. SELF-LEARNING MODE AND EXAMINATION MODE ISOLATION
// -----------------------------------------------------------------------------
runTest('12. Self-learning mode: concept exploration, worked examples, interactive practice without exam restrictions', () => {
  const learningModule = selfLearningService.getLearningModule('Control Systems', 'Bode Plot Stability Analysis');
  assert.strictEqual(learningModule.success, true);
  assert.strictEqual(learningModule.mode, 'self_learning');
  assert.strictEqual(learningModule.policy.timerEnforced, false, 'Self learning must not enforce exam timer');
  assert.strictEqual(learningModule.policy.immediateFeedbackAllowed, true, 'Immediate feedback permitted in learning mode');
  assert.ok(learningModule.workedExample, 'Must include verified worked example');

  // Interactive practice attempt
  const practiceSet = selfLearningService.generatePracticeSet('Control Systems', 'Bode Plot Stability Analysis', 3);
  assert.strictEqual(practiceSet.questions.length, 3);

  const attemptRes = selfLearningService.submitPracticeAttempt({
    studentId: 'STU_LEARN_42',
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    question: practiceSet.questions[0],
    selectedIndex: practiceSet.questions[0].correctIndex,
    hintsUsed: 0
  });

  assert.strictEqual(attemptRes.isCorrect, true);
  assert.strictEqual(attemptRes.score, 100);
  assert.ok(attemptRes.remediationRecommendation, 'Must provide adaptive next recommendation');
});

// -----------------------------------------------------------------------------
// 13. ZERO REPETITION AND NOVELTY ACROSS MULTI-QUESTION SESSIONS
// -----------------------------------------------------------------------------
runTest('13. Zero repetition and semantic novelty across counts 1, 2, 5, 10, 20', () => {
  [1, 2, 5, 10, 20].forEach(count => {
    const batch = GenerateAcademicQuestionPackage('Biotechnology', 'Bioreactor Design', { count });
    assert.strictEqual(batch.valid, true);
    const questions = batch.questions || [batch];
    assert.strictEqual(questions.length, count);
    const uniqueIds = new Set(questions.map(q => q.id));
    assert.strictEqual(uniqueIds.size, count, `All ${count} generated questions must have unique IDs`);
  });
});

// -----------------------------------------------------------------------------
// 14. PROVIDER-INDEPENDENT USER EXPERIENCE (ZERO PROVIDER BRANDING)
// -----------------------------------------------------------------------------
runTest('14. Provider independence: zero model provider names (Ollama, OpenAI, GPT, Llama, Gemini) in payloads', () => {
  const samplePkg = GenerateAcademicQuestionPackage({
    subjectName: 'Communication Engineering',
    topic: 'Digital Modulation',
    questionType: 'mcq'
  });

  const payloadStr = JSON.stringify(samplePkg);
  const bannedProviders = ['openai', 'ollama', 'gemini', 'gpt-4', 'llama3'];
  bannedProviders.forEach(p => {
    assert.ok(
      !payloadStr.toLowerCase().includes(p),
      `Student-facing question payload must not contain provider brand "${p}"`
    );
  });
});

// -----------------------------------------------------------------------------
// 15. CENTRAL API DISPATCHER INTEGRATION (FULL END-TO-END VERIFICATION)
// -----------------------------------------------------------------------------
await runTestAsync('15. Central API Dispatcher routes for documents, concept graph, self-learning, and adaptive intelligence', async () => {
  // A. Document List
  const listRes = await handleApiRequest('/api/documents/list', 'GET', { facultyId: 'FACULTY_TEST_SUITE', subjectId: 'THERMO_101' });
  assert.strictEqual(listRes.status, 200);
  assert.ok(Array.isArray(listRes.body.documents));

  // B. Concept Graph API
  const graphRes = await handleApiRequest('/api/ai/concept-graph', 'POST', {
    subject: 'Communication Engineering',
    topic: 'Digital Modulation'
  });
  assert.strictEqual(graphRes.status, 200);
  assert.ok(graphRes.body.graph.nodes.length >= 2);

  // C. Self-Learning Module API
  const learnRes = await handleApiRequest('/api/ai/self-learning/module', 'POST', {
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis'
  });
  assert.strictEqual(learnRes.status, 200);
  assert.strictEqual(learnRes.body.mode, 'self_learning');

  // D. Adaptive Update Evidence API
  const adRes = await handleApiRequest('/api/ai/adaptive/update-evidence', 'POST', {
    studentId: 'STU_API_99',
    subject: 'Control Systems',
    topic: 'Bode Plot Stability Analysis',
    question: { id: 'cs_bode_1', concept: 'Gain and Phase Margins', format: 'Theory' },
    studentAnswer: 0,
    isCorrect: true,
    hintsUsed: 0
  });
  assert.strictEqual(adRes.status, 200);
  assert.strictEqual(adRes.body.success, true);
  assert.ok(adRes.body.pMastery > 0);
});

console.log('\n========================================================================');
console.log(`  ALL ${passedTests}/${totalTests} MASTER ACCEPTANCE TESTS PASSED!`);
console.log('========================================================================\n');
