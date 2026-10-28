// server/src/ai/orchestrator/multiModelOrchestrator.js
// VIVA ANALYZER X — Multi-Model Hidden Generation & Orchestration Engine
// Orchestrates 4 independent model instances:
// 1. Ollama Fast (e.g. llama3.2:1b)
// 2. Ollama Reasoning (e.g. llama3.2:latest / qwen2.5:1.5b)
// 3. Ollama Review (e.g. llama3:latest / qwen2.5:3b)
// 4. OpenAI GPT (when configured with valid API key)
// 100% Secure, Hidden Behind Backend, Canonical Context Enforced

import { modelRegistry, TASK_ROLES } from '../modelRegistry.js';
import { outputValidator } from '../outputValidator.js';
import { learningMemory } from '../../services/learningMemory.js';

const OLLAMA_BASE_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

export class MultiModelOrchestrator {
  constructor() {
    this.modelInstances = [
      { id: 'local_fast', name: 'Local Fast Model', role: TASK_ROLES.FAST, type: 'ollama', enabled: true },
      { id: 'local_reasoning', name: 'Local Reasoning Model', role: TASK_ROLES.REASONING, type: 'ollama', enabled: true },
      { id: 'local_review', name: 'Local Review Model', role: TASK_ROLES.REVIEW, type: 'ollama', enabled: true },
      { id: 'cloud_gpt', name: 'OpenAI GPT Integration', role: 'gpt', type: 'openai', enabled: Boolean(process.env.OPENAI_API_KEY) }
    ];
    this.telemetryLogs = [];
  }

  /**
   * Check configured model availability
   */
  async getOrchestrationStatus() {
    const installed = modelRegistry.installedModels || [];
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

    return {
      ensemblePolicy: 'multi_model_defensible_selection',
      activeInstances: [
        {
          id: 'local_fast',
          model: modelRegistry.roleAssignments[TASK_ROLES.FAST] || 'llama3.2:1b',
          available: installed.length > 0,
          type: 'ollama'
        },
        {
          id: 'local_reasoning',
          model: modelRegistry.roleAssignments[TASK_ROLES.REASONING] || 'llama3.2:latest',
          available: installed.length > 0,
          type: 'ollama'
        },
        {
          id: 'local_review',
          model: modelRegistry.roleAssignments[TASK_ROLES.REVIEW] || 'llama3:latest',
          available: installed.length > 0,
          type: 'ollama'
        },
        {
          id: 'cloud_gpt',
          model: 'gpt-4o-mini',
          available: hasOpenAI,
          type: 'openai'
        }
      ]
    };
  }

  /**
   * Build canonical prompt for candidate models
   */
  buildCanonicalPrompt(context) {
    const {
      subject,
      topic,
      concept,
      conceptId,
      learningObjective,
      difficulty = 'Intermediate',
      questionType = 'mcq',
      bloomLevel = 'Understanding',
      stageNumber = 1
    } = context;

    const targetConcept = concept || conceptId || topic;

    return `You are an expert university professor and viva examiner in "${subject}".
Academic Subject: ${subject}
Assigned Topic: ${topic}
Specific Concept: ${targetConcept}
Learning Objective: ${learningObjective || `Evaluate understanding of ${targetConcept} in ${topic}`}
Target Difficulty: ${difficulty}
Cognitive Level: ${bloomLevel}
Question Type: ${questionType}
Progression Stage: Stage ${stageNumber} of 10

CRITICAL RULES:
1. Every word must stay strictly within the assigned subject ("${subject}") and topic ("${topic}").
2. NO generic template filler phrases (e.g. DO NOT say "Core Theoretical Framework", "Foundational Principles, Definitions & Structural Axioms", "Operational purpose and governing significance", "Boundary criteria", "secondary startup transient factors", "Universal Discipline").
3. Ask ONE clear, direct question testing an authentic mechanism, equation, relationship, or principle.
4. For MCQ: Provide exactly 4 concise options. Exactly ONE is correct. Three are plausible technical distractors.
5. Provide a scientifically sound explanation referencing why the correct option is right and others wrong.
6. Provide exactly 4 progressive hints:
   - Hint 1: Relevant conceptual reminder
   - Hint 2: Principle, mechanism, or relationship clue
   - Hint 3: Guided reasoning step or formula clue
   - Hint 4: Final conceptual nudge (NEVER leak the direct answer!)

Return STRICT JSON matching this schema:
{
  "questionText": "Direct question here",
  "type": "${questionType === 'mcq' ? 'mcq' : 'text'}",
  "bloomLevel": "${bloomLevel}",
  "difficulty": "${difficulty}",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctIndex": 0,
  "modelAnswer": "Comprehensive model answer",
  "explanation": "Detailed explanation of correct answer and distractors",
  "hints": [
    "Hint 1: Conceptual reminder",
    "Hint 2: Mechanism clue",
    "Hint 3: Reasoning step",
    "Hint 4: Final nudge"
  ],
  "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
}`;
  }

  /**
   * Execute task on a single model instance
   */
  async queryInstance(instance, prompt, context, options = {}) {
    const start = Date.now();
    try {
      if (instance.type === 'ollama') {
        const modelName = modelRegistry.getModelForRole(instance.role);
        if (!modelName || (modelRegistry.installedModels || []).length === 0) {
          return { success: false, error: 'Ollama model not installed or offline' };
        }

        const controller = new AbortController();
        const timeoutMs = options.timeoutMs || 4000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: modelName,
            prompt: prompt,
            system: 'You are an authoritative oral viva examiner. Return strictly valid JSON.',
            stream: false,
            format: 'json',
            options: {
              temperature: 0.7,
              num_ctx: 4096,
              num_predict: 2048
            }
          })
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          return { success: false, error: `Ollama status ${res.status}` };
        }

        const data = await res.json();
        const parsed = JSON.parse(data.response);
        return {
          success: true,
          instanceId: instance.id,
          model: modelName,
          durationMs: Date.now() - start,
          candidate: parsed
        };
      }

      if (instance.type === 'openai') {
        const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return { success: false, error: 'OpenAI API key not configured' };
        }

        const controller = new AbortController();
        const timeoutMs = options.timeoutMs || 5000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: options.model || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an authoritative university oral viva examiner. Return strictly valid JSON.' },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
          })
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          return { success: false, error: `OpenAI status ${res.status}` };
        }

        const data = await res.json();
        const parsed = JSON.parse(data.choices?.[0]?.message?.content);
        return {
          success: true,
          instanceId: instance.id,
          model: 'gpt-4o-mini',
          durationMs: Date.now() - start,
          candidate: parsed
        };
      }
    } catch (err) {
      return {
        success: false,
        instanceId: instance.id,
        error: err.message,
        durationMs: Date.now() - start
      };
    }

    return { success: false, error: 'Unknown provider' };
  }

  /**
   * Normalize candidate to canonical structure
   */
  normalizeCandidate(raw, context, instanceId) {
    if (!raw || typeof raw !== 'object') return null;

    const questionText = String(raw.questionText || raw.question || raw.text || '').trim();
    if (questionText.length < 15) return null;

    const type = (raw.type || (Array.isArray(raw.options) && raw.options.length >= 2 ? 'mcq' : 'text')).toLowerCase();
    let options = null;
    let correctIndex = null;

    if (type === 'mcq') {
      options = Array.isArray(raw.options) ? raw.options.map(o => String(o).trim()) : null;
      if (!options || options.length !== 4) return null;
      correctIndex = typeof raw.correctIndex === 'number' && raw.correctIndex >= 0 && raw.correctIndex < 4
        ? raw.correctIndex
        : 0;
    }

    const hints = Array.isArray(raw.hints) && raw.hints.length >= 4
      ? raw.hints.slice(0, 4).map(h => String(h).trim())
      : [
          `Consider the foundational principle of ${context.concept || context.topic}.`,
          `Analyze the governing relationship between the key operational parameters.`,
          `Examine how altering the primary variables shifts system equilibrium.`,
          `Synthesize the critical mechanism governing ${context.concept || context.topic}.`
        ];

    return {
      id: `q_ens_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      subject: context.subject,
      topic: context.topic,
      concept: context.concept || context.topic,
      conceptId: context.conceptId || context.concept || context.topic,
      questionText,
      text: questionText,
      type,
      questionType: context.questionType || type,
      difficulty: context.difficulty || 'Intermediate',
      bloomLevel: raw.bloomLevel || context.bloomLevel || 'Understanding',
      options,
      correctIndex,
      modelAnswer: raw.modelAnswer || raw.explanation || (options ? options[correctIndex] : ''),
      explanation: raw.explanation || `The verified answer accurately states the governing principle of ${context.concept || context.topic}.`,
      hints,
      expectedKeywords: Array.isArray(raw.expectedKeywords) && raw.expectedKeywords.length > 0
        ? raw.expectedKeywords
        : [context.topic.toLowerCase(), (context.concept || '').toLowerCase()].filter(Boolean),
      sourceInstance: instanceId,
      sourceType: 'multi_model_orchestrated'
    };
  }

  /**
   * Score a validated candidate for educational excellence
   */
  scoreCandidate(candidate, context) {
    let score = 100;
    const qLower = candidate.questionText.toLowerCase();
    const topicWords = String(context.topic || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const conceptWords = String(context.concept || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // Topic alignment
    const matchesTopic = topicWords.some(w => qLower.includes(w));
    const matchesConcept = conceptWords.some(w => qLower.includes(w));
    if (matchesConcept) score += 20;
    if (matchesTopic) score += 10;

    // Option quality for MCQs
    if (candidate.type === 'mcq' && candidate.options) {
      const lengths = candidate.options.map(o => o.length);
      const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const lengthVariance = lengths.reduce((acc, l) => acc + Math.abs(l - avgLen), 0) / lengths.length;

      // Penalize options if correct answer is blatantly longer than distractors
      const correctLen = candidate.options[candidate.correctIndex].length;
      if (correctLen > avgLen * 1.8) {
        score -= 25;
      }
      // Reward uniform option lengths
      if (lengthVariance < 20) {
        score += 15;
      }
    }

    // Explanation depth
    if (candidate.explanation && candidate.explanation.length > 60) {
      score += 15;
    }

    // Hints quality
    if (candidate.hints && candidate.hints.length === 4) {
      score += 10;
    }

    return score;
  }

  /**
   * Generate question using Four-Model Ensemble with candidate selection
   */
  async generateEnsembleQuestion(context, options = {}) {
    const canonicalPrompt = this.buildCanonicalPrompt(context);

    // 1. Identify participating instances
    const activeInstances = this.modelInstances.filter(inst => {
      if (!inst.enabled) return false;
      if (inst.type === 'openai') {
        return Boolean(options.apiKey || process.env.OPENAI_API_KEY);
      }
      return true;
    });

    // 2. Query participating models in parallel
    const queryPromises = activeInstances.map(inst =>
      this.queryInstance(inst, canonicalPrompt, context, options)
    );

    const queryResults = await Promise.allSettled(queryPromises);

    // 3. Process candidate responses
    const validCandidates = [];
    const evaluationLogs = [];

    queryResults.forEach((res, idx) => {
      const inst = activeInstances[idx];
      if (res.status === 'fulfilled' && res.value.success && res.value.candidate) {
        const normalized = this.normalizeCandidate(res.value.candidate, context, inst.id);
        if (normalized) {
          const valRes = outputValidator.validate(normalized, context);
          if (valRes.isValid) {
            const defensibilityScore = this.scoreCandidate(normalized, context);
            validCandidates.push({
              candidate: normalized,
              score: defensibilityScore,
              instanceId: inst.id
            });
            evaluationLogs.push({ instance: inst.id, status: 'VALID', score: defensibilityScore });
          } else {
            evaluationLogs.push({ instance: inst.id, status: 'REJECTED', reasons: valRes.checks.reasons });
          }
        } else {
          evaluationLogs.push({ instance: inst.id, status: 'FAILED_NORMALIZATION' });
        }
      } else {
        const errorMsg = res.status === 'fulfilled' ? res.value.error : res.reason?.message;
        evaluationLogs.push({ instance: inst.id, status: 'EXECUTION_FAILED', error: errorMsg });
      }
    });

    this.telemetryLogs.push({
      timestamp: new Date().toISOString(),
      topic: context.topic,
      evaluationLogs
    });

    // 4. Select strongest defensible candidate
    if (validCandidates.length > 0) {
      validCandidates.sort((a, b) => b.score - a.score);
      const winning = validCandidates[0].candidate;

      // Safely record in persistent learning memory
      learningMemory.recordQuestion(winning, {
        sessionType: options.sessionType || 'live_viva',
        ensembleWinner: winning.sourceInstance,
        participatingCount: activeInstances.length
      });

      return winning;
    }

    // 5. If all AI models fail or offline, retrieve from persistent validated question bank or generate authentic curriculum package
    const cachedValid = learningMemory.getValidatedQuestion(context.subject, context.topic, context.concept, context.questionType);
    if (cachedValid) {
      return cachedValid;
    }

    try {
      const { GenerateAcademicQuestionPackage } = await import('../../../../src/services/academicAssessmentEngine.js');
      const curriculumPkg = GenerateAcademicQuestionPackage({
        subjectName: context.subject,
        topic: context.topic,
        concept: context.concept,
        questionType: context.questionType || 'mcq'
      });
      if (curriculumPkg && curriculumPkg.valid !== false) {
        return curriculumPkg;
      }
    } catch (e) {
      console.warn('Ensemble curriculum fallback error:', e.message);
    }

    return null;
  }
}

export const multiModelOrchestrator = new MultiModelOrchestrator();
