// tests/dynamic_knowledge_and_adaptive_learning.test.mjs
// Verifies Dynamic Subject Knowledge Representation and Adaptive Learning Engine

import assert from 'assert';
import {
  BuildDynamicKnowledgeMap,
  GenerateAcademicQuestionPackage,
  resolveAcademicContext
} from '../src/services/academicAssessmentEngine.js';

import { masteryEngine } from '../server/src/ai/masteryEngine.js';
import { difficultyEngine } from '../server/src/ai/difficultyEngine.js';

console.log('========================================================================');
console.log('  DYNAMIC SUBJECT KNOWLEDGE & ADAPTIVE LEARNING ENGINE SUITE');
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

// 1. Dynamic knowledge map generation for arbitrary subject
it('1. Generates complete dynamic knowledge map for arbitrary subject and topic', () => {
  const map = BuildDynamicKnowledgeMap(
    'Biomedical Engineering',
    'Hemodialysis Membrane Transport',
    { syllabusSection: 'Unit 3: Artificial Organs' }
  );

  assert.ok(map);
  assert.strictEqual(map.subject, 'Biomedical Engineering');
  assert.strictEqual(map.topic, 'Hemodialysis Membrane Transport');
  assert.strictEqual(map.syllabusSection, 'Unit 3: Artificial Organs');
  assert.ok(Array.isArray(map.concepts));
  assert.ok(map.concepts.length >= 3);

  // Check structure: prerequisites, equations/laws, failure modes, misconceptions, rubrics
  const fundamentalNode = map.concepts[0];
  assert.ok(fundamentalNode.prerequisites.length > 0);
  assert.ok(fundamentalNode.learningObjectives.length > 0);

  const mechanismNode = map.concepts[1];
  assert.ok(mechanismNode.equations.length > 0);
  assert.ok(mechanismNode.assumptions.length > 0);

  const diagNode = map.concepts[2];
  assert.ok(diagNode.failureConditions.length > 0);
  assert.ok(diagNode.commonMisconceptions.length > 0);

  assert.ok(map.pedagogicalRubric['Conceptual Understanding']);
  assert.ok(map.pedagogicalRubric['Analytical Rigor']);
});

// 2. Adaptive student capability model: single answer does NOT equate to full mastery
it('2. Single correct answer does NOT equate to full concept mastery (evidence count >= 2 required)', () => {
  const studentId = `scholar_${Date.now()}`;
  const sessionId = `sess_${Date.now()}`;
  const question = {
    id: 'q_test_concept_1',
    topic: 'Bioreactor Design',
    concept: 'Oxygen Transfer',
    difficulty: 'Intermediate'
  };

  // Attempt 1: 100% score
  masteryEngine.updateMastery(sessionId, studentId, question, {
    score: 100,
    status: 'Correct',
    demonstratedConcepts: ['kLa mass transfer'],
    missingConcepts: [],
    misconceptions: []
  });

  const state1 = masteryEngine.getOrCreateSessionState(sessionId, studentId);
  const cState1 = state1.conceptMastery['Oxygen Transfer'];
  const unc1 = cState1.uncertainty;
  assert.strictEqual(cState1.evidenceCount, 1);
  assert.strictEqual(cState1.mastered, false, 'Single correct answer must NOT declare mastery');
  assert.ok(unc1 > 0.4, 'Uncertainty remains non-trivial after 1 attempt');

  // Attempt 2: 90% score -> Now evidenceCount is 2 and scoreAvg >= 75
  masteryEngine.updateMastery(sessionId, studentId, question, {
    score: 90,
    status: 'Correct',
    demonstratedConcepts: ['kLa mass transfer', 'driving force'],
    missingConcepts: [],
    misconceptions: []
  });

  const cState2 = state1.conceptMastery['Oxygen Transfer'];
  assert.strictEqual(cState2.evidenceCount, 2);
  assert.strictEqual(cState2.mastered, true, 'Sustained performance across evidence confirms mastery');
  assert.ok(cState2.uncertainty < unc1, 'Uncertainty must strictly decrease as evidence accumulates');
});

// 3. Adaptive concept selection locked strictly to assigned topic
it('3. Selects subsequent concept locked to assigned topic without domain drift', () => {
  const studentId = `student_seq_${Date.now()}`;
  const sessionId = `sess_seq_${Date.now()}`;
  const assignedTopic = 'Bioreactor Design';
  const availableConcepts = [
    { id: 'Oxygen Transfer', name: 'Oxygen Transfer' },
    { id: 'Sterilization', name: 'Sterilization Kinetics' },
    { id: 'Impeller Hydrodynamics', name: 'Impeller Hydrodynamics' }
  ];

  // First pick should select an unassessed concept in Bioreactor Design
  const next1 = masteryEngine.selectSubsequentConcept(assignedTopic, availableConcepts, studentId, sessionId);
  assert.ok(next1.nextConcept);
  assert.strictEqual(next1.reason, 'unassessed_concept_coverage');

  // Simulate struggling on Oxygen Transfer
  masteryEngine.updateMastery(sessionId, studentId, { topic: assignedTopic, concept: 'Oxygen Transfer' }, {
    score: 35,
    status: 'Needs Improvement',
    demonstratedConcepts: [],
    missingConcepts: ['kLa'],
    misconceptions: ['Confounded gas velocity with liquid transfer']
  });

  // Next selection must provide scaffolding and prerequisite review on struggling concept
  const next2 = masteryEngine.selectSubsequentConcept(assignedTopic, availableConcepts, studentId, sessionId);
  assert.strictEqual(next2.scaffoldingNeeded, true);
  assert.strictEqual(next2.nextConcept, 'Oxygen Transfer');
  assert.strictEqual(next2.challengeLevel, 'Foundational');
});

// 4. Adaptive difficulty scaling with difficulty engine
it('4. Increases challenge level on sustained high score and steps down on difficulty', () => {
  const highStep = difficultyEngine.determineNextStep({ score: 95 }, { difficulty: 'moderate', conceptId: 'Bode Plot' });
  assert.strictEqual(highStep.nextDifficulty, 'tough');
  assert.strictEqual(highStep.nextAction, 'advance_to_deeper_problem');

  const lowStep = difficultyEngine.determineNextStep({ score: 30 }, { difficulty: 'tough', conceptId: 'Bode Plot' });
  assert.strictEqual(lowStep.nextDifficulty, 'moderate');
  assert.strictEqual(lowStep.nextAction, 'prerequisite_remediation');
});

console.log('\n========================================================================');
console.log(`  ALL ${passedTests}/${totalTests} DYNAMIC KNOWLEDGE & ADAPTIVE TESTS PASSED!`);
console.log('========================================================================\n');
