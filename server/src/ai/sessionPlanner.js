// server/src/ai/sessionPlanner.js
// VIVA ANALYZER X — Ten-Question Progressive Session Planner
// Creates a structured, pedagogical 10-stage curriculum plan locked strictly to the assigned topic.
// Progresses across Bloom's Taxonomy without topic drift.
// 100% OFFLINE, ZERO CLOUD.

export const SESSION_STAGES = [
  {
    stage: 1,
    name: 'Foundational Definition',
    bloomLevel: 'Remembering',
    difficulty: 'Foundation',
    objectiveTemplate: 'Define foundational terminology, governing equations, and fundamental parameters of {topic}'
  },
  {
    stage: 2,
    name: 'Conceptual Understanding',
    bloomLevel: 'Understanding',
    difficulty: 'Foundation',
    objectiveTemplate: 'Explain underlying physical/computational behavior and operational significance of {topic}'
  },
  {
    stage: 3,
    name: 'Principle or Mechanism',
    bloomLevel: 'Understanding',
    difficulty: 'Intermediate',
    objectiveTemplate: 'Analyze core operating principles, state transitions, and governing mechanisms in {topic}'
  },
  {
    stage: 4,
    name: 'Relationships Between Variables',
    bloomLevel: 'Analysis',
    difficulty: 'Intermediate',
    objectiveTemplate: 'Evaluate how changing primary control variables or boundary conditions shifts system response in {topic}'
  },
  {
    stage: 5,
    name: 'Interpretation of Practical Example',
    bloomLevel: 'Application',
    difficulty: 'Intermediate',
    objectiveTemplate: 'Interpret a concrete engineering or experimental scenario demonstrating {topic}'
  },
  {
    stage: 6,
    name: 'Application to Practical Scenario',
    bloomLevel: 'Application',
    difficulty: 'Intermediate',
    objectiveTemplate: 'Apply principles of {topic} to resolve operational design challenges or real-world implementation'
  },
  {
    stage: 7,
    name: 'Calculation or Analytical Derivation',
    bloomLevel: 'Application',
    difficulty: 'Advanced',
    objectiveTemplate: 'Calculate key metrics or derive analytical relationships governing {topic}'
  },
  {
    stage: 8,
    name: 'Analysis of Problem or Misconception',
    bloomLevel: 'Analysis',
    difficulty: 'Advanced',
    objectiveTemplate: 'Diagnose common failure modes, misconceptions, or stability limits in {topic}'
  },
  {
    stage: 9,
    name: 'Troubleshooting or Comparison',
    bloomLevel: 'Evaluation',
    difficulty: 'Advanced',
    objectiveTemplate: 'Compare alternative methodologies, trade-offs, and mitigation strategies in {topic}'
  },
  {
    stage: 10,
    name: 'Synthesis or Deeper Application',
    bloomLevel: 'Synthesis',
    difficulty: 'Advanced',
    objectiveTemplate: 'Synthesize optimal architectural decisions, regulatory safety margins, or advanced optimization for {topic}'
  }
];

export class SessionPlanner {
  /**
   * Generates a 10-question structured session plan locked strictly to the target subject and topic
   */
  createSessionPlan(subject, topic, options = {}) {
    const cleanSubj = String(subject || 'General Engineering').trim();
    const cleanTopic = String(topic || 'Core Topic').trim();
    const totalCount = Math.max(1, Math.min(20, options.count || 10));

    // Map stages to requested count
    const stages = [];
    for (let i = 0; i < totalCount; i++) {
      const stageTemplate = SESSION_STAGES[i % SESSION_STAGES.length];
      const objective = stageTemplate.objectiveTemplate.replace(/\{topic\}/g, cleanTopic);

      stages.push({
        stageNumber: i + 1,
        stageName: stageTemplate.name,
        subject: cleanSubj,
        topic: cleanTopic,
        bloomLevel: stageTemplate.bloomLevel,
        difficulty: stageTemplate.difficulty,
        learningObjective: objective,
        questionType: options.mode === 'mcq'
          ? 'mcq'
          : options.mode === 'text'
          ? 'text'
          : (i % 2 === 0 ? 'mcq' : 'text')
      });
    }

    return {
      subject: cleanSubj,
      topic: cleanTopic,
      totalQuestions: totalCount,
      stages
    };
  }
}

export const sessionPlanner = new SessionPlanner();
