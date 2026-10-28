// server/src/apiDispatcher.js
// Central API Request Dispatcher for VIVA ANALYSER.
// Directly integrated into standalone server (server.cjs) and Vite dev server (vite.config.js).
// 100% OFFLINE, ZERO CLOUD.

import { accountService } from './services/accounts.js';
import { sessionService } from './services/sessions.js';
import { modelRegistry } from './ai/modelRegistry.js';
import { modelHealth } from './ai/modelHealth.js';
import { contextBuilder } from './ai/contextBuilder.js';
import { questionGenerator } from './ai/questionGenerator.js';
import { answerAnalyser } from './ai/answerAnalyser.js';
import { hintGenerator } from './ai/hintGenerator.js';
import { difficultyEngine } from './ai/difficultyEngine.js';
import { masteryEngine } from './ai/masteryEngine.js';
import { documentProcessor } from './ai/documentProcessor.js';
import { referenceRetriever } from './ai/referenceRetriever.js';
import { eventLogger } from './antiCheat/eventLogger.js';
import { generateOfflineDeepQuestions } from '../../src/services/aiQuestionService.js';
import { sessionPlanner } from './ai/sessionPlanner.js';
import { learningMemory } from './services/learningMemory.js';
import { multiModelOrchestrator } from './ai/orchestrator/multiModelOrchestrator.js';
import { assessmentManager } from './services/assessmentManager.js';
import { conceptGraphEngine } from './ai/conceptGraphEngine.js';
import { adaptiveStudentIntelligence } from './ai/adaptiveStudentIntelligence.js';
import { selfLearningService } from './services/selfLearningService.js';

export async function handleApiRequest(pathname, method, body, headers = {}) {
  // Extract session token from Authorization header or Cookie
  const authHeader = headers['authorization'] || headers['Authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (headers['x-session-token'] || null);
  const session = sessionService.getSession(token);

  // 1. AUTH ROUTES
  if (pathname === '/api/auth/register' && method === 'POST') {
    return accountService.register(body);
  }

  if (pathname === '/api/auth/login' && method === 'POST') {
    const authRes = accountService.authenticate(body.username, body.password);
    if (!authRes.success) {
      return { status: 401, body: authRes };
    }
    const sess = sessionService.createSession(authRes.user);
    return {
      status: 200,
      body: {
        success: true,
        user: authRes.user,
        sessionId: sess.sessionId,
        token: sess.sessionId
      }
    };
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    sessionService.destroySession(token);
    return { status: 200, body: { success: true } };
  }

  if (pathname === '/api/auth/session' && method === 'GET') {
    if (!session) {
      return { status: 401, body: { authenticated: false, error: 'Session expired or invalid.' } };
    }
    return { status: 200, body: { authenticated: true, user: session } };
  }

  if (pathname === '/api/auth/recovery/request' && method === 'POST') {
    return { status: 200, body: accountService.generateRecoveryToken(body.username) };
  }

  if (pathname === '/api/auth/recovery/reset' && method === 'POST') {
    const resetRes = accountService.resetPasswordWithToken(body.username, body.token, body.newPassword);
    if (resetRes.success) {
      sessionService.destroyUserSessions(body.username);
    }
    return { status: resetRes.success ? 200 : 400, body: resetRes };
  }

  // 2. AI MODEL STATUS & ORCHESTRATION
  if (pathname === '/api/ai/models/status' && method === 'GET') {
    const health = await modelHealth.checkHealth();
    return { status: 200, body: { success: true, ...health } };
  }
  // 2b. ENSEMBLE ORCHESTRATION STATUS (Faculty only)
  if (pathname === '/api/ai/orchestrator/status' && method === 'GET') {
    const status = await multiModelOrchestrator.getOrchestrationStatus();
    return { status: 200, body: { success: true, ...status } };
  }

  // 2c. TEN-STAGE TOPIC-LOCKED CURRICULUM SESSION PLAN
  if (pathname === '/api/ai/viva/session-plan' && method === 'POST') {
    const { subject, topic, count, mode } = body;
    const plan = sessionPlanner.createSessionPlan(subject, topic, { count: count || 10, mode: mode || 'Mixed' });
    return { status: 200, body: { success: true, plan } };
  }

  // 3. GROUNDED MULTIMODAL QUESTION GENERATION
  if (pathname === '/api/ai/viva/grounded-question' && method === 'POST') {
    const context = contextBuilder.buildContext({
      facultyId: session?.username || body.facultyId || 'FACULTY_DEFAULT',
      subject: body.subject || 'Engineering',
      subjectId: body.subjectId || 'ENG',
      unit: body.unit || 'Unit 1',
      topic: body.topic || 'Core Concept',
      subtopic: body.subtopic || '',
      conceptId: body.conceptId || '',
      learningOutcome: body.learningOutcome || 'Demonstrate deep conceptual and analytical understanding',
      targetDifficulty: body.difficulty || 'moderate',
      questionType: body.questionType || 'conceptual',
      previouslyAsked: body.previouslyAsked || [],
      knownMisconceptions: body.knownMisconceptions || []
    });

    const question = await questionGenerator.generateQuestion(context, body);

    // Strict student-facing isolation: strip answer keys, rubrics, and internal model telemetry
    const isStudent = body.isStudentFacing || session?.role === 'student' || body.role === 'student';
    let safeQuestion = question;
    if (isStudent && question) {
      const { correctIndex, modelAnswer, rubric, telemetry, sourceInstance, distractorRationales, optionsRationale, ...sanitized } = question;
      safeQuestion = sanitized;
    }

    return {
      status: 200,
      body: {
        success: true,
        question: safeQuestion,
        context: {
          conceptId: context.conceptId,
          sourceType: context.sourceType,
          evidenceCount: context.referenceEvidence.length
        }
      }
    };
  }

  // 4. LAYERED ANSWER EVALUATION
  if (pathname === '/api/ai/viva/evaluate-layered' && method === 'POST') {
    const { question, studentAnswer, hintsUsed, answerTimeSec, sessionId } = body;
    const studentId = session?.username || body.studentId || 'STUDENT';

    const evaluation = await answerAnalyser.evaluateAnswer({
      question,
      studentAnswer,
      hintsUsed: hintsUsed || 0,
      answerTimeSec: answerTimeSec || 0
    });

    const masterySummary = masteryEngine.updateMastery(
      sessionId || `sess_${Date.now()}`,
      studentId,
      question,
      evaluation,
      { hintsUsed, timeSpentSec: answerTimeSec }
    );

    // Record in persistent learning memory and get topic-adaptive progression
    const persistentRecord = learningMemory.recordInteraction(
      studentId,
      question,
      studentAnswer,
      evaluation,
      { hintsUsed, timeSpentSec: answerTimeSec }
    );

    const adaptiveStep = learningMemory.getAdaptiveStep(
      studentId,
      question.subject,
      question.topic,
      body.assessmentMode || 'practice'
    );

    const adaptiveNext = difficultyEngine.determineNextStep(
      evaluation,
      question,
      masterySummary.historyCount
    );

    return {
      status: 200,
      body: {
        success: true,
        evaluation,
        adaptiveNext,
        adaptiveStep,
        masterySummary,
        persistentRecord
      }
    };
  }

  // 4b. STUDENT TOPIC-SPECIFIC LEARNING PROFILE
  if (pathname === '/api/ai/viva/learning-profile' && method === 'GET') {
    const studentId = session?.username || body.studentId || 'STUDENT';
    const profile = learningMemory.getStudentProfile(studentId);
    return { status: 200, body: { success: true, profile } };
  }

  // 5. CONCEPT-SPECIFIC PROGRESSIVE HINT
  if (pathname === '/api/ai/viva/hint' && method === 'POST') {
    const { question, currentHintLevel = 0, missingConcepts = [], studentError = null, errorCategory = null, studentAnswer = null } = body;
    const hint = hintGenerator.getNextHint(question, currentHintLevel, { missingConcepts, studentError, errorCategory, studentAnswer });
    return { status: 200, body: { success: true, hint } };
  }

  // 6. FACULTY DOCUMENT UPLOAD & INGESTION (PDF, DOCX, PPTX, XLSX, CSV, TXT, Images, ZIP)
  if ((pathname === '/api/documents/upload' || pathname === '/api/documents/process') && method === 'POST') {
    if (session && session.role !== 'faculty') {
      return { status: 403, body: { success: false, error: 'Only faculty members may upload reference documents.' } };
    }
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subjectId = 'GENERAL', filename, textContent, contentPayload, metadata = {} } = body;
    const payload = contentPayload !== undefined ? contentPayload : textContent;

    const result = documentProcessor.processDocument(facultyId, subjectId, filename, payload, metadata);
    return { status: 200, body: result };
  }

  // 6b. LIST & INSPECT PROCESSED DOCUMENTS
  if (pathname === '/api/documents/list' && (method === 'GET' || method === 'POST')) {
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const subjectId = body.subjectId || 'GENERAL';
    const docs = documentProcessor.listProcessedDocuments(facultyId, subjectId);
    return { status: 200, body: { success: true, count: docs.length, documents: docs } };
  }

  if (pathname === '/api/documents/inspect' && (method === 'GET' || method === 'POST')) {
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subjectId = 'GENERAL', filename } = body;
    const doc = documentProcessor.getProcessedDocument(facultyId, subjectId, filename);
    return { status: doc.found ? 200 : 404, body: doc };
  }

  if (pathname === '/api/documents/update-chunks' && method === 'POST') {
    if (session && session.role !== 'faculty') {
      return { status: 403, body: { success: false, error: 'Only faculty members may edit document chunks.' } };
    }
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subjectId = 'GENERAL', filename, chunks = [] } = body;
    const res = documentProcessor.updateDocumentChunks(facultyId, subjectId, filename, chunks);
    return { status: 200, body: res };
  }

  // 6c. HYBRID SOURCE RETRIEVAL
  if (pathname === '/api/documents/retrieve' && method === 'POST') {
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subjectId = 'GENERAL', topic, concept, learningObjective, maxPassages = 5, exclusiveSourceOnly = false, requiredFormat } = body;
    const res = referenceRetriever.retrievePassages(facultyId, subjectId, topic, maxPassages, {
      concept,
      learningObjective,
      exclusiveSourceOnly,
      requiredFormat
    });
    return { status: 200, body: res };
  }

  // 6d. CONCEPT KNOWLEDGE GRAPH
  if (pathname === '/api/ai/concept-graph' && method === 'POST') {
    const { subject, topic, referencePassages = [] } = body;
    const graph = conceptGraphEngine.buildConceptGraph(subject, topic, referencePassages);
    return { status: 200, body: { success: true, graph } };
  }

  // 6e. SELF-LEARNING ARENA APIS
  if (pathname === '/api/ai/self-learning/module' && method === 'POST') {
    const facultyId = session?.username || body.facultyId || 'FACULTY_DEFAULT';
    const { subject, topic, exclusiveSourceOnly = false } = body;
    const modData = selfLearningService.getLearningModule(subject, topic, facultyId, { exclusiveSourceOnly });
    return { status: 200, body: modData };
  }

  if (pathname === '/api/ai/self-learning/practice' && method === 'POST') {
    const { subject, topic, count = 5, exclusiveSourceOnly = false, referencePassages = [] } = body;
    const pSet = selfLearningService.generatePracticeSet(subject, topic, count, { exclusiveSourceOnly, referencePassages });
    return { status: 200, body: pSet };
  }

  if (pathname === '/api/ai/self-learning/attempt' && method === 'POST') {
    const studentId = session?.username || body.studentId || 'STUDENT';
    const { subject, topic, question, selectedIndex, hintsUsed = 0, timeSpentSec = 20 } = body;
    const aRes = selfLearningService.submitPracticeAttempt({
      studentId,
      subject,
      topic,
      question,
      selectedIndex,
      hintsUsed,
      timeSpentSec
    });
    return { status: 200, body: aRes };
  }

  // 6f. ADAPTIVE INTELLIGENCE BKT / IRT EVIDENCE UPDATE
  if (pathname === '/api/ai/adaptive/update-evidence' && method === 'POST') {
    const studentId = session?.username || body.studentId || 'STUDENT';
    const { subject, topic, question, studentAnswer, isCorrect, hintsUsed = 0, responseTimeSeconds = 30 } = body;
    const adRes = adaptiveStudentIntelligence.processAnswerAndPlanNext({
      studentId,
      subject,
      topic,
      question,
      studentAnswer,
      isCorrect,
      hintsUsed,
      responseTimeSeconds
    });
    return { status: 200, body: { success: true, ...adRes } };
  }

  // 7. ANTI-MALPRACTICE EVENT LOGGING
  if (pathname === '/api/anti-cheat/event' && method === 'POST') {
    const { eventType, eventData = {}, sessionId } = body;
    const studentId = session?.username || body.studentId || 'STUDENT';
    const record = eventLogger.logEvent(eventType, eventData, sessionId, studentId);
    return { status: 200, body: { success: true, loggedIndex: record.index } };
  }

  if (pathname === '/api/anti-cheat/verify' && method === 'GET') {
    const result = eventLogger.verifyAuditChain();
    return { status: 200, body: result };
  }

  // 8. OLLAMA STATUS CHECK
  if (pathname === '/api/ollama/status' && method === 'GET') {
    const discovery = await modelRegistry.discoverModels();
    const isOnline = discovery.available && discovery.installedModels.length > 0;
    const activeModel = modelRegistry.getModelForRole('fast') || modelRegistry.getModelForRole('reasoning') || 'llama3.2:1b';
    return {
      status: 200,
      body: {
        available: isOnline,
        models: discovery.installedModels || [],
        activeModel: isOnline ? activeModel : null,
        provider: isOnline ? 'ollama' : 'offline_ontology'
      }
    };
  }

  // 9. UNIFIED AI QUESTION GENERATION (/api/ai/generate proxy)
  if (pathname === '/api/ai/generate' && method === 'POST') {
    const { topic = 'Core Principles', count = 5, subject, model, documentContext = '' } = body;
    const targetCount = Math.min(50, Math.max(1, parseInt(count, 10) || 5));
    const cleanTopic = (topic || subject || 'Core Principles').trim();

    // 1. If local Ollama is active, attempt a fast single-prompt batch generation (max 6s timeout)
    const localModel = model || 'llama3.2:1b';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s max budget

      const prompt = `You are a distinguished university oral viva examiner on "${cleanTopic}".
Generate exactly ${targetCount} rigorous viva examination questions.
Format your response STRICTLY as valid JSON:
{
  "topic": "${cleanTopic}",
  "questions": [
    {
      "questionText": "Technical question statement",
      "type": "mcq",
      "options": ["Accurate Option A", "Plausible Distractor B", "Plausible Distractor C", "Plausible Distractor D"],
      "correctIndex": 0,
      "bloomLevel": "Understanding",
      "hints": [
        "Hint 1: Conceptual clue",
        "Hint 2: Governing formula clue",
        "Hint 3: Methodological clue",
        "Hint 4: Specific insight"
      ],
      "modelAnswer": "Comprehensive technical answer",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`;

      const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: localModel,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.7,
            num_predict: 2048,
            top_p: 0.9
          }
        })
      });
      clearTimeout(timeoutId);

      if (ollamaRes.ok) {
        const raw = await ollamaRes.json();
        const parsed = JSON.parse(raw.response);
        if (parsed?.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return {
            status: 200,
            body: {
              success: true,
              provider: 'ollama',
              model: localModel,
              data: {
                questions: parsed.questions
              }
            }
          };
        }
      }
    } catch (ollamaErr) {
      // Ollama timeout, connection refused, or invalid JSON -> instant fallback to domain ontology
    }

    // 2. High-speed subject-accurate offline ontology synthesis (Instant < 10ms, 100% domain pure)
    const cleanSubject = (subject || body.subjectName || '').trim();
    const domainQuestions = generateOfflineDeepQuestions(cleanTopic, targetCount, documentContext, cleanSubject);

    return {
      status: 200,
      body: {
        success: true,
        provider: 'offline_ontology',
        data: {
          questions: domainQuestions
        }
      }
    };
  }

  // 10. UNIFIED ASSESSMENT EVALUATION (/api/assessment/evaluate)
  if (pathname === '/api/assessment/evaluate' && method === 'POST') {
    const {
      question,
      studentAnswer,
      answerText: rawAnswerText,
      correctIndex,
      options,
      type,
      expectedKeywords = [],
      hintsUsed = 0,
      answerTimeSec = 0
    } = body;
    const effectiveAnswer = studentAnswer !== undefined ? studentAnswer : rawAnswerText;
    const qObj = (question && typeof question === 'object') ? question : {};
    const effType = (type || qObj.type || (Array.isArray(options || qObj.options) ? 'mcq' : 'text')).toLowerCase();
    const effCorrectIdx = correctIndex !== undefined ? correctIndex : qObj.correctIndex;
    const effOptions = options || qObj.options;
    const effKeywords = (expectedKeywords && expectedKeywords.length > 0) ? expectedKeywords : (qObj.expectedKeywords || []);

    if (effType === 'mcq' && effCorrectIdx !== undefined && effCorrectIdx !== null) {
      const targetIdx = typeof effCorrectIdx === 'number' ? effCorrectIdx : parseInt(effCorrectIdx, 10);
      const studentIdx = typeof effectiveAnswer === 'number' ? effectiveAnswer : parseInt(effectiveAnswer, 10);
      const isCorrect = studentIdx === targetIdx;
      const penalty = Math.min(30, (hintsUsed || 0) * 8);
      const score = isCorrect ? Math.max(50, 100 - penalty) : 0;
      const selectedText = (effOptions && effOptions[studentIdx]) ? effOptions[studentIdx] : `Option ${studentIdx + 1}`;
      return {
        status: 200,
        body: {
          success: true,
          isCorrect,
          score,
          feedback: isCorrect
            ? `Correct technical option selected: "${selectedText}".`
            : `Selected option does not articulate the required governing principle.`,
          evaluation: {
            score,
            isCorrect,
            status: isCorrect ? 'Correct' : 'Needs Work',
            demonstratedConcepts: isCorrect ? [`Understands ${qObj.topic || 'the concept'}`] : [],
            missingConcepts: isCorrect ? [] : [`Review ${qObj.topic || 'the concept'}`]
          }
        }
      };
    }

    // Conceptual & Multimodal Layered Evaluation
    const evaluation = await answerAnalyser.evaluateAnswer({
      question: question || {
        text: 'Assess conceptual foundation',
        topic: 'Subject Principle',
        expectedKeywords
      },
      studentAnswer: effectiveAnswer,
      hintsUsed,
      answerTimeSec
    });

    return {
      status: 200,
      body: {
        success: true,
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        feedback: evaluation.feedback,
        demonstratedConcepts: evaluation.demonstratedConcepts,
        missingConcepts: evaluation.missingConcepts,
        evaluation
      }
    };
  }

  // 11. STAFF ASSESSMENT CREATION, COHORT ENFORCEMENT & LIVE SESSIONS
  if (pathname === '/api/assessments/create' && method === 'POST') {
    const faculty = session || body.facultyUser || { role: 'faculty', username: 'faculty' };
    try {
      const created = await assessmentManager.createAssessment(body, faculty);
      return { status: 200, body: { success: true, assessment: created } };
    } catch (err) {
      return { status: 400, body: { success: false, error: err.message } };
    }
  }

  if (pathname === '/api/assessments/faculty' && method === 'GET') {
    const list = assessmentManager.listFacultyAssessments(session?.username);
    return { status: 200, body: { success: true, assessments: list } };
  }

  if (pathname === '/api/assessments/update' && method === 'POST') {
    try {
      const updated = assessmentManager.updateAssessment(body.assessmentId, body.updateData, session);
      return { status: 200, body: { success: true, assessment: updated } };
    } catch (err) {
      return { status: 400, body: { success: false, error: err.message } };
    }
  }

  if (pathname === '/api/assessments/duplicate' && method === 'POST') {
    try {
      const dup = assessmentManager.duplicateAssessment(body.assessmentId, session);
      return { status: 200, body: { success: true, assessment: dup } };
    } catch (err) {
      return { status: 400, body: { success: false, error: err.message } };
    }
  }

  if (pathname === '/api/assessments/close' && method === 'POST') {
    try {
      const closed = assessmentManager.closeAssessment(body.assessmentId);
      return { status: 200, body: { success: true, assessment: closed } };
    } catch (err) {
      return { status: 400, body: { success: false, error: err.message } };
    }
  }

  if (pathname === '/api/assessments/eligible' && (method === 'GET' || method === 'POST')) {
    const studentUser = session || body?.studentUser || accountService.getAccount(headers['x-student-id'] || body?.studentId);
    if (!studentUser) {
      return { status: 401, body: { success: false, error: 'Student authentication required.' } };
    }
    const eligible = assessmentManager.listEligibleAssessments(studentUser);
    return { status: 200, body: { success: true, assessments: eligible } };
  }

  if (pathname === '/api/assessments/start' && method === 'POST') {
    const studentUser = session || body?.studentUser || accountService.getAccount(headers['x-student-id'] || body?.studentId);
    if (!studentUser) {
      return { status: 401, body: { success: false, error: 'Student authentication required.' } };
    }
    const startRes = assessmentManager.startAttempt(body.assessmentId, studentUser, {
      ip: headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: headers['user-agent'] || 'Browser'
    });
    return { status: startRes.status || (startRes.success ? 200 : 400), body: startRes };
  }

  if (pathname === '/api/assessments/autosave' && method === 'POST') {
    const studentUser = session || body?.studentUser || accountService.getAccount(headers['x-student-id'] || body?.studentId);
    if (!studentUser) {
      return { status: 401, body: { success: false, error: 'Student authentication required.' } };
    }
    const saveRes = assessmentManager.autosaveAnswer(body.attemptId, studentUser, body.answer || body);
    return { status: saveRes.status || (saveRes.success ? 200 : 400), body: saveRes };
  }

  if (pathname === '/api/assessments/integrity-observation' && method === 'POST') {
    const studentUser = session || body?.studentUser || accountService.getAccount(headers['x-student-id'] || body?.studentId);
    if (!studentUser) {
      return { status: 401, body: { success: false, error: 'Student authentication required.' } };
    }
    const obsRes = assessmentManager.logIntegrityObservation(body.attemptId, studentUser, body.observation || body);
    return { status: 200, body: obsRes };
  }

  if (pathname === '/api/assessments/submit' && method === 'POST') {
    const studentUser = session || body?.studentUser || accountService.getAccount(headers['x-student-id'] || body?.studentId);
    if (!studentUser) {
      return { status: 401, body: { success: false, error: 'Student authentication required.' } };
    }
    const subRes = assessmentManager.submitAttempt(body.attemptId, studentUser, body);
    return { status: subRes.status || (subRes.success ? 200 : 400), body: subRes };
  }

  // Live Monitor Telemetry (Faculty only)
  if (pathname.startsWith('/api/assessments/') && pathname.endsWith('/live-monitor') && method === 'GET') {
    const parts = pathname.split('/');
    const assessmentId = parts[3];
    try {
      const monitorData = assessmentManager.getLiveMonitor(assessmentId, session);
      return { status: 200, body: { success: true, monitor: monitorData } };
    } catch (err) {
      return { status: 400, body: { success: false, error: err.message } };
    }
  }

  // Single assessment lookup
  if (pathname.startsWith('/api/assessments/') && method === 'GET') {
    const parts = pathname.split('/');
    const assessmentId = parts[3];
    if (assessmentId && assessmentId !== 'faculty' && assessmentId !== 'eligible') {
      const asg = assessmentManager.getAssessment(assessmentId);
      if (!asg) {
        return { status: 404, body: { success: false, error: 'Assessment not found.' } };
      }
      const isStudent = session?.role === 'student' || headers['x-user-role'] === 'student';
      if (isStudent) {
        const studentUser = session || accountService.getAccount(headers['x-student-id']);
        const elig = assessmentManager.checkStudentEligibility(asg, studentUser);
        if (!elig.eligible) {
          return { status: 403, body: { success: false, error: `Access denied: ${elig.reason}` } };
        }
        return { status: 200, body: { success: true, assessment: assessmentManager.sanitizeAssessmentForStudent(asg) } };
      }
      return { status: 200, body: { success: true, assessment: asg } };
    }
  }

  // Route not handled here
  return null;
}

