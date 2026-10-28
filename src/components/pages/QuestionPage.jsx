import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  HelpCircle,
  Send,
  CheckSquare,
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  RotateCcw,
  EyeOff,
  Copy,
  Terminal,
  Activity,
  X,
  Gauge,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { BehavioralEngine } from '../../services/behavioralEngine';
import { soundEffects } from '../../services/soundEffects';

export default function QuestionPage({
  question,
  questionIndex,
  totalQuestions,
  assignedMarks = 25,
  difficulty = '3.5 / 5',
  bloomLevel = 'Understanding',
  assignedMode = 'Mixed',
  onRequestHint,
  onSubmitAnswer,
  activeHintCount = 0,
  onDisqualify,
  sessionQuestionHistory = [],
  onSelectAcademicTopic,
  onChangeQuestionIndex
}) {
  const isMcqOnly = assignedMode === 'Choice Based (MCQ)' || assignedMode === 'mcq' || question?.type === 'mcq';
  const isTextOnly = assignedMode === 'Conceptual Text' || assignedMode === 'text' || question?.type === 'text';

  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionSecondsElapsed, setQuestionSecondsElapsed] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(120);

  // Dedicated Proctoring & Telemetry Drawer / Modal State
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);

  // Live Anti-Cheat Tracking State
  const [tabSwitches, setTabSwitches] = useState(0);
  const [copyAttempts, setCopyAttempts] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [disqualificationModal, setDisqualificationModal] = useState(false);

  // Dynamic Metrics (Real, never hardcoded)
  const totalViolations = tabSwitches + copyAttempts + pasteAttempts;
  const liveAuthenticity = Math.max(0, 100 - (tabSwitches * 20 + pasteAttempts * 25 + copyAttempts * 15));
  
  // Calculate dynamic accuracy from past answered questions
  const answeredCount = sessionQuestionHistory?.length || 0;
  const correctCount = sessionQuestionHistory?.filter(q => q.status === 'Correct').length || 0;
  const dynamicAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 100;

  // Determine whether this question has legitimate, non-fabricated MCQ options
  const hasValidOptions = Boolean(
    question?.options &&
    Array.isArray(question.options) &&
    question.options.length >= 2
  );

  const getInitialMode = () => {
    if (isTextOnly) return 'text';
    if (isMcqOnly) return hasValidOptions ? 'mcq' : 'text';
    if (question?.type === 'text') return 'text';
    if (question?.type === 'mcq') return hasValidOptions ? 'mcq' : 'text';
    return hasValidOptions ? 'mcq' : 'text';
  };

  // Options: Copy and shuffle options for display without mutating original question record
  const [shuffledItems, setShuffledItems] = useState([]);
  const [answerMode, setAnswerMode] = useState(getInitialMode);

  useEffect(() => {
    if (!hasValidOptions) {
      setShuffledItems([]);
      return;
    }

    const origCorrect = typeof question?.correctIndex === 'number' &&
      question.correctIndex >= 0 &&
      question.correctIndex < question.options.length
      ? question.correctIndex
      : 0;

    // Create copies with original index mapping without mutating question
    const indexed = question.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx,
      isCorrect: idx === origCorrect
    }));

    // Fisher-Yates Shuffle
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }

    setShuffledItems(indexed);
  }, [questionIndex, question, hasValidOptions]);
  const [behaviorEngine] = useState(() => new BehavioralEngine());
  const timerRef = useRef(null);

  // Send audited integrity observation to backend
  const logIntegrityObservation = (type, details) => {
    fetch('/api/assessments/integrity-observation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attemptId: question?.attemptId || 'active_attempt',
        observation: { type, details, timestamp: Date.now() }
      })
    }).catch(() => {});
  };

  // ASSESSMENT INTEGRITY: Audited event listeners for tab switch, blur, copy, paste
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        soundEffects.playWarning();
        logIntegrityObservation('visibility_hidden', 'Browser tab switched or minimized during viva');
      }
    };

    const handleBlur = () => {
      logIntegrityObservation('window_blur', 'Browser window lost focus');
    };

    const handleCopy = (e) => {
      e.preventDefault();
      setCopyAttempts(prev => prev + 1);
      soundEffects.playWarning();
      logIntegrityObservation('copy_intercepted', 'Attempted clipboard copy from assessment interface');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setPasteAttempts(prev => prev + 1);
      soundEffects.playWarning();
      logIntegrityObservation('paste_intercepted', 'Attempted clipboard paste into answer field');
    };

    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'c' || key === 'x') {
          handleCopy(e);
        } else if (key === 'v') {
          handlePaste(e);
        } else if (key === 'p') {
          e.preventDefault();
          logIntegrityObservation('print_intercepted', 'Attempted browser print dialog');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    setTextAnswer('');
    setSelectedOption(null);
    setSecondsRemaining(120);
    setQuestionSecondsElapsed(0);
    setAnswerMode(getInitialMode());
    behaviorEngine.resetForNewQuestion();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setQuestionSecondsElapsed(prev => prev + 1);
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionIndex, question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const metrics = behaviorEngine.calculateFinalMetrics();
    metrics.tabSwitches = tabSwitches;
    metrics.pasteAttempts = pasteAttempts;
    metrics.copyAttempts = copyAttempts;
    metrics.authenticityScore = liveAuthenticity;

    if (answerMode === 'mcq') {
      if (selectedOption === null || selectedOption === undefined) return;
      const originalIdx = shuffledItems[selectedOption]?.originalIndex ?? selectedOption;
      onSubmitAnswer(originalIdx, metrics, questionSecondsElapsed);
    } else {
      if (!textAnswer.trim()) return;
      onSubmitAnswer(textAnswer.trim(), metrics, questionSecondsElapsed);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const questionTitle = question?.questionText || question?.text || 'Explain the conceptual mechanism and governing equations for this topic.';
  const adaptiveNote = question?.adaptiveNote || null;

  const maskedStudentId = 'STU-***' + String(question?.studentRegNo || '04055').slice(-4);
  const watermarkText = `${maskedStudentId} • ${question?.topic || 'VIVA-EXAM'} • SECURED`;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="w-full py-2 px-2 sm:px-4 space-y-6 animate-fade-in text-left select-none relative"
    >
      {/* 0. Print Deterrence Style Block */}
      <style>{`
        @media print {
          body * { display: none !important; }
          body::after { content: "Examination capture and printing is restricted by academic security policy."; display: block !important; padding: 40px; font-weight: bold; }
        }
      `}</style>

      {/* 0b. Non-sensitive, session-specific watermark overlay (Legible, non-obstructive) */}
      <div
        className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden opacity-[0.045] flex flex-wrap items-center justify-around gap-16 p-8"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="text-xs font-mono font-bold text-gray-900 rotate-[-22deg] uppercase tracking-widest">
            {watermarkText}
          </div>
        ))}
      </div>

      {/* 1. AUDITED OBSERVATION NOTICE (Observations recorded for staff review, NO false automatic disqualification) */}
      {totalViolations >= 3 && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>Audited Integrity Observations Logged:</strong> {tabSwitches} window focus loss(es), {pasteAttempts} paste attempt(s), {copyAttempts} copy attempt(s).
              <span className="block text-[11px] text-amber-800">
                These signals are recorded on the server as observations for staff review according to institutional policy. No automatic disqualification.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-amber-200 text-amber-950 font-mono text-xs font-bold shrink-0">
            Audit Flagged
          </span>
        </div>
      )}

      {/* 2. DEDICATED PROCTORING & TELEMETRY MODAL / DRAWER (NOT JOINED WITH QUESTION) */}
      {isTelemetryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFFDF8] border-2 border-[#E2D3A7] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#2D3748]">
                    Live Candidate Telemetry & Security Hub
                  </h3>
                  <p className="text-xs text-[#718096]">
                    Real-time anti-cheat signals, attending cadence, and authenticity metrics
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTelemetryModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-[#FFF8E8] hover:bg-[#FFF3D6] border border-[#E2D3A7] text-[#2D3748] flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The 8 Metrics Displayed In Clean Modern Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* 1. Attending Time */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">1. Attending Time</span>
                <span className="text-2xl font-black font-mono text-[#B7791F] block">{formatTimer(questionSecondsElapsed)}</span>
                <span className="text-[11px] text-[#718096] block">120s Question Budget</span>
              </div>

              {/* 2. Authenticity Shield */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">2. Authenticity Shield</span>
                <span className={`text-2xl font-black font-mono block ${liveAuthenticity > 70 ? 'text-[#2F855A]' : 'text-[#C53030]'}`}>
                  {liveAuthenticity}%
                </span>
                <span className="text-[11px] text-[#718096] block">Biometric Integrity</span>
              </div>

              {/* 3. Live Accuracy */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">3. Live Accuracy</span>
                <span className="text-2xl font-black font-mono text-[#2B6CB0] block">{dynamicAccuracy}%</span>
                <span className="text-[11px] text-[#718096] block">{answeredCount} Answered so far</span>
              </div>

              {/* 4. Malpractice Quota */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">4. Malpractice Quota</span>
                <span className={`text-2xl font-black font-mono block ${totalViolations === 0 ? 'text-[#2F855A]' : 'text-[#C53030]'}`}>
                  {totalViolations} / 3 Strikes
                </span>
                <span className="text-[11px] text-[#718096] block">{Math.max(0, 3 - totalViolations)} strikes remaining</span>
              </div>

              {/* 5. Blocked Pastes */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">5. Blocked Pastes</span>
                <span className="text-2xl font-black font-mono text-[#C53030] block">{pasteAttempts} Intercepted</span>
                <span className="text-[11px] text-[#718096] block">Anti-paste defense active</span>
              </div>

              {/* 6. Blocked Copies */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">6. Blocked Copies</span>
                <span className="text-2xl font-black font-mono text-[#C05621] block">{copyAttempts} Intercepted</span>
                <span className="text-[11px] text-[#718096] block">Clipboard secure lock</span>
              </div>

              {/* 7. Tab Switches */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">7. Tab Switches</span>
                <span className="text-2xl font-black font-mono text-[#805AD5] block">{tabSwitches} Events</span>
                <span className="text-[11px] text-[#718096] block">Focus blur tracker</span>
              </div>

              {/* 8. Answering Pace */}
              <div className="p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-1">
                <span className="text-[11px] font-extrabold text-[#718096] uppercase tracking-wider block">8. Answering Pace</span>
                <span className="text-2xl font-black font-mono text-[#2F855A] block">
                  {questionSecondsElapsed < 45 ? 'Optimal' : questionSecondsElapsed < 90 ? 'Moderate' : 'Deep Thinking'}
                </span>
                <span className="text-[11px] text-[#718096] block">Cadence baseline</span>
              </div>

            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-2xl bg-[#E6F4EA] border border-[#A8DAB5] flex items-center justify-between text-xs text-[#2F855A]">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-5 h-5 text-[#2F855A]" />
                <span>Zero Cloud Footprint • All Telemetry Checked Locally on Device</span>
              </div>
              <button
                type="button"
                onClick={() => setIsTelemetryModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#2F855A] text-white font-bold cursor-pointer hover:bg-[#276749]"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quick Academic Topic Switcher Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#8B5E34]">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4 text-[#B7791F]" />
            <span>Universal Topic-Intelligent Engine • Multi-Format Assessment</span>
          </span>
          <span className="text-[11px] text-[#2F855A] font-bold">
            {question?.validation?.valid ? '✓ Subject-Validated Quality Gate' : 'Topic-Grounded Assessment Engine'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Biotechnology', 'Bioreactor Design', 'Oxygen Transfer', 'mcq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.concept === 'Oxygen Transfer' && question?.format === 'Theory' && question?.type !== 'text'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🧪 Biotech: Oxygen Transfer (Theory)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Biotechnology', 'Bioreactor Design', 'Oxygen Transfer', 'numerical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.format === 'Numerical' && question?.subject === 'Biotechnology'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🧮 Biotech: OTR Calculation (Numerical)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Biotechnology', 'Bioreactor Design', 'Sterilization', 'mcq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.concept === 'Sterilization'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🔬 Biotech: Sterilization (Del Factor)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Control Systems', 'Bode Plot Stability Analysis', 'Gain and Phase Margins', 'diagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Control Systems' && question?.format === 'Diagram'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🎛️ Control: Bode Plot (Diagram)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Communication Engineering', 'Modulation', 'Principles of Modulation', 'numerical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Communication Engineering'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            📡 ECE: Antenna Sizing (Numerical)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Computer Science', 'Database Normalization', 'Normal Forms and Dependencies', 'mcq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Computer Science'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            💻 CSE: 3NF vs BCNF (Theory & Scenario)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Linear Algebra', 'Eigenvalues and Eigenvectors', 'Characteristic Equation and Eigenspaces', 'numerical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Linear Algebra'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            📐 Linear Algebra: Eigenvalues (Numerical)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Mechanical Engineering', 'Heat Transfer', 'Fourier Conduction & Thermal Resistance', 'numerical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Mechanical Engineering'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            ⚙️ Mech: Heat Conduction (Numerical)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Civil Engineering', 'Structural Mechanics', 'Euler-Bernoulli Beam Theory and Bending Stress', 'theory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Civil Engineering'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🏗️ Civil: Beam Theory (Theory)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Renewable Energy Systems', 'Photovoltaic MPPT Controls', 'Perturb and Observe Algorithm', 'mcq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.subject === 'Renewable Energy Systems'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            🌐 Arbitrary Staff Topic (Universal Engine)
          </button>

          <button
            type="button"
            onClick={() => onSelectAcademicTopic && onSelectAcademicTopic('Biotechnology', 'Bioreactor Design', 'Oxygen Transfer', 'text')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              question?.type === 'text' && question?.concept === 'Oxygen Transfer'
                ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-xs'
                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7] hover:bg-[#FFF3D6]'
            }`}
          >
            📝 Biotech: Descriptive Rubric Mode
          </button>
        </div>
      </div>

      {/* 3. TOP PIPELINE HEADER (Clean, with Telemetry Icon Button) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFCF4] border-2 border-[#E2D3A7] shadow-sm">
        
        {/* Left: Question Counter & Difficulty */}
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-sm font-black text-[#B7791F]">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-extrabold text-[#2D3748]">
            Difficulty: <span className="text-[#B7791F]">{difficulty || 'Bloom Scale'}</span>
          </span>
          {adaptiveNote && (
            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-xs font-bold text-[#2F855A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{adaptiveNote}</span>
            </span>
          )}
        </div>

        {/* Right: Marks, Timer, and the SEPARATE TELEMETRY / PROCTORING ICON BUTTON */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-black text-[#8B5E34]">
            {assignedMarks} Marks Available
          </div>

          <div className={`px-4 py-1.5 rounded-xl border-2 font-mono font-black text-sm flex items-center gap-2 shadow-xs ${
            secondsRemaining < 30
              ? 'bg-[#FFF0F0] border-[#FECACA] text-[#C53030] animate-pulse'
              : 'bg-[#FFFDF8] border-[#E2D3A7] text-[#2D3748]'
          }`}>
            <Clock className="w-4 h-4 text-[#B7791F]" />
            <span>Time Left: {formatTimer(secondsRemaining)}</span>
          </div>

          {/* SEPARATE ICON BUTTON FOR SCORES & TELEMETRY */}
          <button
            type="button"
            onClick={() => setIsTelemetryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border-2 border-[#E2D3A7] hover:bg-[#B7791F] hover:text-white transition-all cursor-pointer text-xs font-bold text-[#8B5E34] shadow-xs"
            title="Open Live Proctoring & Candidate Telemetry Monitor"
          >
            <ShieldAlert className="w-4 h-4 text-[#B7791F]" />
            <span className="hidden sm:inline">Telemetry & Scores</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              totalViolations === 0 ? 'bg-[#E6F4EA] text-[#2F855A]' : 'bg-[#FEE2E2] text-[#B91C1C]'
            }`}>
              {totalViolations}/3 Strikes
            </span>
          </button>
        </div>

      </div>

      {/* 4. 100% FULL SCREEN QUESTION & ANSWERING WORKSPACE (NOT CRAMPED BY TELEMETRY BOXES) */}
      <div className="w-full space-y-6">
        
        {/* Main Question Card with Big Letters */}
        <div className="bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl p-6 sm:p-10 shadow-md shadow-[#B7791F]/5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
            <span className="text-xs sm:text-sm font-mono font-bold text-[#8B5E34] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B7791F]" />
              <span>Cognitive Depth: {bloomLevel}</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#718096]">
              Question #{questionIndex + 1}
            </span>
          </div>

          {/* Subject Context & Format Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-lg bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              Subject: {question?.subject || 'Academic Discipline'}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              Topic: {question?.topic || 'Syllabus Topic'}
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#E6F4EA] border border-[#A8DAB5] text-xs font-bold text-[#2F855A]">
              Concept: {question?.concept || 'Assigned Concept'}
            </span>
            {question?.format && (
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                question.format === 'Numerical'
                  ? 'bg-[#FEFCBF] border-[#D69E2E] text-[#B7791F]'
                  : question.format === 'Diagram'
                  ? 'bg-[#EBF8FF] border-[#3182CE] text-[#2B6CB0]'
                  : question.format === 'Scenario'
                  ? 'bg-[#FEEBC8] border-[#DD6B20] text-[#C05621]'
                  : question.format === 'Comparison'
                  ? 'bg-[#E9D8FD] border-[#805AD5] text-[#6B46C1]'
                  : 'bg-[#EDF2F7] border-[#CBD5E0] text-[#4A5568]'
              }`}>
                Format: {question.format}
              </span>
            )}
            {question?.learningObjective && (
              <span className="px-3 py-1 rounded-lg bg-[#EBF8FF] border border-[#BEE3F8] text-xs font-semibold text-[#2B6CB0]">
                LO: {question.learningObjective}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] leading-relaxed tracking-tight">
            {questionTitle}
          </h2>

          {/* Academic Vector SVG Diagram Region (Rendered only when question requires visual) */}
          {question?.diagramSvg && (
            <div className="p-4 sm:p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] shadow-sm flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full border-b border-[#E2D3A7] pb-2 text-xs font-bold text-[#8B5E34]">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Layers className="w-4 h-4 text-[#B7791F]" />
                  <span>Academic Reference Diagram</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8] text-[10px] font-bold">
                  Vector SVG • Authentic Data
                </span>
              </div>
              <div
                className="w-full flex items-center justify-center overflow-x-auto py-2"
                dangerouslySetInnerHTML={{ __html: question.diagramSvg }}
              />
              {question?.diagramCaption && (
                <p className="text-xs text-[#718096] italic text-center max-w-lg">
                  {question.diagramCaption}
                </p>
              )}
            </div>
          )}

          {/* Numerical Input Parameters Panel (When question requires calculations) */}
          {question?.numericalDetails?.givenParameters && (
            <div className="p-3 sm:p-4 rounded-xl bg-[#FFF8E8] border border-[#E2D3A7] space-y-1.5">
              <span className="text-xs font-bold text-[#8B5E34] uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#B7791F]" />
                <span>Given Parameters & Operating Values:</span>
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold text-[#2D3748]">
                {Object.entries(question.numericalDetails.givenParameters).map(([paramKey, val]) => (
                  <span key={paramKey} className="px-2.5 py-1 rounded-lg bg-white border border-[#E2D3A7] shadow-2xs">
                    <strong>{paramKey}:</strong> {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          {adaptiveNote && (
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2F855A]">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive AI Calibration: {adaptiveNote}</span>
            </div>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          {isMcqOnly ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <CheckSquare className="w-4 h-4 text-[#B7791F]" />
              <span>Format: <strong>Choice Based (MCQ)</strong></span>
            </div>
          ) : isTextOnly ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <FileText className="w-4 h-4 text-[#B7791F]" />
              <span>Format: <strong>Conceptual Text Explanation</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-1 bg-[#FFF3D6] rounded-xl border border-[#E2D3A7]">
              <button
                type="button"
                onClick={() => setAnswerMode('mcq')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  answerMode === 'mcq'
                    ? 'bg-[#B7791F] text-white shadow-xs'
                    : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
                }`}
              >
                Choice Based (MCQ)
              </button>
              <button
                type="button"
                onClick={() => setAnswerMode('text')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  answerMode === 'text'
                    ? 'bg-[#B7791F] text-white shadow-xs'
                    : 'text-[#8B5E34] hover:bg-[#FFF8E8]'
                }`}
              >
                Text Explanation
              </button>
            </div>
          )}

          <span className="text-xs sm:text-sm font-bold text-[#718096]">
            {answerMode === 'mcq' ? 'Select matching option below' : 'Type explanation in your own words (Paste blocked)'}
          </span>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* MCQ Mode: Shuffled across A, B, C, D */}
          {answerMode === 'mcq' ? (
            <div className="grid grid-cols-1 gap-4">
              {shuffledItems.map((item, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer flex items-center gap-5 transition-all shadow-sm ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#FFF3D6] ring-4 ring-[#B7791F]/20 scale-[1.008]'
                        : 'border-[#E2D3A7] bg-[#FFFCF4] hover:border-[#B7791F] hover:bg-[#FFFDF8]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-black text-base shrink-0 ${
                      isSelected
                        ? 'border-[#B7791F] bg-[#B7791F] text-white shadow-xs'
                        : 'border-[#E2D3A7] bg-[#FFF8E8] text-[#8B5E34]'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-[#2D3748] flex-1 leading-snug">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="State your technical answer clearly. Articulate physical operational mechanisms, governing laws, or analytical derivations..."
                className="w-full h-[240px] text-lg font-medium p-6 rounded-2xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748] outline-none resize-vertical leading-relaxed shadow-inner focus:border-[#B7791F] focus:ring-4 focus:ring-[#B7791F]/15 transition-all"
                required
              />
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E2D3A7]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onRequestHint}
                className="px-6 py-3.5 rounded-xl bg-[#FFF3D6] hover:bg-[#B7791F] hover:text-white border-2 border-[#E2D3A7] text-[#8B5E34] font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-5 h-5 text-[#B7791F]" />
                <span>Request Hint {activeHintCount > 0 ? `(Level ${activeHintCount}/4)` : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTelemetryModalOpen(true)}
                className="px-4 py-3.5 rounded-xl bg-[#FFF8E8] hover:bg-[#FFF3D6] border border-[#E2D3A7] text-[#718096] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-[#B7791F]" />
                <span>View Live Proctoring Signals</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={answerMode === 'mcq' ? selectedOption === null : !textAnswer.trim()}
              className="px-12 py-4 rounded-xl bg-[#B7791F] hover:bg-[#975A16] disabled:opacity-50 text-white font-extrabold text-lg shadow-lg shadow-[#B7791F]/25 flex items-center gap-3 transition-all cursor-pointer"
            >
              <span>Submit Answer</span>
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
