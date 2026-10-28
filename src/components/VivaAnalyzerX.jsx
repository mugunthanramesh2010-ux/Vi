// src/components/VivaAnalyzerX.jsx
// VIVA ANALYZER X — Universal AI-Powered, Subject-Aware Adaptive Viva Examination Platform
// Implements 7-Step Universal Workflow:
// 1. Subject Selection (11 Universal Disciplines + Custom)
// 2. Topic Selection & Custom Input
// 3. Concept Selection & Automated AI Concept Identification
// 4. Question Type, Difficulty, Count & Assessment Mode
// 5. Subject & Concept Grounded Question Generation (Zero boilerplate fallbacks)
// 6. Verified Answer Key, Explanations, 4-Tier Hints & Evaluation Criteria
// 7. Interactive Viva Interface Launch

import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Search,
  Sliders,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import {
  UNIVERSAL_SUBJECTS,
  autoDetectConcepts,
  generateConceptGroundedQuestions
} from '../services/subjectConceptOntology';
import { normalizeQuestion } from '../services/aiQuestionService';
import { soundEffects } from '../services/soundEffects';

export default function VivaAnalyzerX({ onStartViva, currentUser }) {
  // Step 1: Subject Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState('cs_it');
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // Step 2: Topic Selection
  const [selectedTopicId, setSelectedTopicId] = useState('os');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  // Step 3: Concept Selection & Auto-Detection
  const [selectedConcept, setSelectedConcept] = useState('');
  const [detectedConceptsList, setDetectedConceptsList] = useState([]);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);

  // Step 4: Examination Parameters
  const [questionType, setQuestionType] = useState('mixed'); // 'mixed' | 'mcq' | 'text' | 'derivation' | 'numerical' | 'case_study'
  const [difficulty, setDifficulty] = useState('Adaptive'); // 'Foundation' | 'Proficient' | 'Advanced' | 'Adaptive'
  const [questionCount, setQuestionCount] = useState(5);
  const [assessmentMode, setAssessmentMode] = useState('practice'); // 'practice' | 'strict_exam'

  // Step 5 & 6: Generated Grounded Questions & Preview State
  const [generatedPackage, setGeneratedPackage] = useState([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [showAnswerKeyInPreview, setShowAnswerKeyInPreview] = useState(false);
  const [expandedHintLevel, setExpandedHintLevel] = useState(1);

  // Resolve active subject & topic objects
  const activeSubject = useMemo(() => {
    if (selectedSubjectId === 'custom') {
      return {
        id: 'custom',
        name: customSubjectInput.trim() || 'Custom Discipline',
        icon: '🎓',
        topics: []
      };
    }
    return UNIVERSAL_SUBJECTS.find(s => s.id === selectedSubjectId) || UNIVERSAL_SUBJECTS[0];
  }, [selectedSubjectId, customSubjectInput]);

  const activeTopic = useMemo(() => {
    if (customTopicInput.trim()) {
      return {
        id: 'custom_topic',
        name: customTopicInput.trim(),
        concepts: []
      };
    }
    return activeSubject?.topics?.find(t => t.id === selectedTopicId) || activeSubject?.topics?.[0] || {
      id: 'default_topic',
      name: 'Core Principles',
      concepts: []
    };
  }, [activeSubject, selectedTopicId, customTopicInput]);

  // Update concepts list when topic changes
  useEffect(() => {
    const rawTopicName = customTopicInput.trim() || activeTopic?.name || '';
    const rawSubjName = customSubjectInput.trim() || activeSubject?.name || '';

    if (rawTopicName) {
      const result = autoDetectConcepts(rawSubjName, rawTopicName);
      setDetectedConceptsList(result.concepts || []);
      if (!selectedConcept || !result.concepts?.includes(selectedConcept)) {
        setSelectedConcept(result.concepts?.[0] || 'All Key Concepts in Topic');
      }
    }
  }, [activeSubject, activeTopic, customTopicInput, customSubjectInput]);

  // Trigger Grounded Question Generation whenever parameters change
  useEffect(() => {
    const subjName = customSubjectInput.trim() || activeSubject.name;
    const topName = customTopicInput.trim() || activeTopic.name;
    const conceptName = selectedConcept || detectedConceptsList[0] || 'Core Fundamental Mechanism';

    const questions = generateConceptGroundedQuestions(subjName, topName, conceptName, {
      questionType,
      difficulty,
      count: questionCount,
      assessmentMode
    });

    setGeneratedPackage(questions);
    setActivePreviewIndex(0);
  }, [
    activeSubject,
    activeTopic,
    selectedConcept,
    questionType,
    difficulty,
    questionCount,
    assessmentMode,
    customSubjectInput,
    customTopicInput,
    detectedConceptsList
  ]);

  // Handle Manual Auto-Detect Concepts Click
  const handleAutoDetectClick = () => {
    soundEffects.playClick();
    setIsAutoDetecting(true);
    setTimeout(() => {
      const subjName = customSubjectInput.trim() || activeSubject.name;
      const topName = customTopicInput.trim() || activeTopic.name;
      const result = autoDetectConcepts(subjName, topName);
      setDetectedConceptsList(result.concepts || []);
      setSelectedConcept(result.concepts?.[0] || 'All Key Concepts');
      setIsAutoDetecting(false);
      soundEffects.playSuccess();
    }, 450);
  };

  // Launch Viva into existing assessment arena
  const handleLaunchViva = () => {
    soundEffects.playClick();
    if (!generatedPackage || generatedPackage.length === 0) return;

    const subjName = customSubjectInput.trim() || activeSubject.name;
    const topName = customTopicInput.trim() || activeTopic.name;
    const title = `${subjName} — ${topName}`;

    // Synthesize topic model compatible with existing assessment engine
    const normalizedQuestions = generatedPackage.map((q, idx) => normalizeQuestion(q, idx, topName));

    const topicModel = {
      title,
      fullName: `${topName} (${selectedConcept || 'Comprehensive Concepts'})`,
      domain: subjName,
      category: 'Viva Analyzer X Grounded Examination',
      complexity: difficulty === 'Foundation' ? 2 : difficulty === 'Proficient' ? 3.5 : 5,
      questions: normalizedQuestions,
      prerequisites: [
        {
          id: 'prereq_viva_x_1',
          name: `Prerequisites for ${selectedConcept || topName}`,
          level: 'Fundamental',
          desc: `Governing axioms, assumptions, and foundational relationships in ${topName}.`
        }
      ],
      graphNodes: [
        { id: 'node_base', label: `Foundations of ${topName}`, status: 'mastered', x: 80, y: 160 },
        { id: 'node_active', label: `${selectedConcept || topName}`, status: 'active', x: 440, y: 180 },
        { id: 'node_mastery', label: 'Synthesis & Mastery', status: 'unvisited', x: 800, y: 190 }
      ],
      graphEdges: [
        { from: 'node_base', to: 'node_active' },
        { from: 'node_active', to: 'node_mastery' }
      ]
    };

    if (onStartViva) {
      onStartViva(
        topicModel,
        title,
        100, // Total marks
        questionType === 'mcq' ? 'Choice Based (MCQ)' : questionType === 'text' ? 'Conceptual Text' : 'Mixed',
        null // Self-learning mode (unlimited retakes)
      );
    }
  };

  const previewQ = generatedPackage[activePreviewIndex] || generatedPackage[0];

  return (
    <div className="w-full space-y-6 text-left animate-fade-in pb-12">
      
      {/* 1. Header Banner */}
      <div className="ent-card p-6 bg-gradient-to-r from-[#FFF8E8] via-[#FFFCF4] to-[#FFF3D6] border-2 border-[#E2D3A7]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#B7791F] text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                VIVA ANALYZER X
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs font-bold">
                100% Subject-Aware & Grounded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2D3748] tracking-tight mt-2">
              Universal Viva Examination Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#718096] mt-1 max-w-3xl leading-relaxed">
              Synthesize precision oral examination packages specifically grounded in your chosen discipline, topic, and concept. Zero generic nuclear-physics fallback strings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLaunchViva}
              className="btn-primary h-[48px] px-6 text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#FFF3D6]" />
              <span>Launch Grounded Viva ({questionCount} Qs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Configuration (Workflow Steps 1 to 4) | Right Grounded Preview (Steps 5 to 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Steps 1-4 Configuration */}
        <div className="lg:col-span-7 space-y-6">

          {/* STEP 1: Select Subject */}
          <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7791F] text-white text-xs font-black flex items-center justify-center">1</span>
                <h2 className="text-sm font-bold text-[#2D3748] uppercase tracking-wide">
                  Select Subject / Discipline
                </h2>
              </div>
              <span className="text-xs text-[#718096] font-medium">
                {UNIVERSAL_SUBJECTS.length} Master Disciplines
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {UNIVERSAL_SUBJECTS.map((subj) => {
                const isSelected = selectedSubjectId === subj.id;
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedSubjectId(subj.id);
                      setCustomSubjectInput('');
                      setSelectedTopicId(subj.topics[0]?.id || '');
                      setCustomTopicInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF3D6] border-[#B7791F] ring-2 ring-[#B7791F]/20 shadow-sm'
                        : 'bg-[#FFF8E8] border-[#E2D3A7] hover:bg-[#FFF3D6]/60'
                    }`}
                  >
                    <div className="text-lg">{subj.icon}</div>
                    <div className="text-xs font-bold text-[#2D3748] mt-1 line-clamp-1">
                      {subj.name}
                    </div>
                    <div className="text-[10px] text-[#718096] line-clamp-1">
                      {subj.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Subject Write-in */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Or type ANY custom subject (e.g. Nanotechnology, Geophysics, Macroeconomics)..."
                value={customSubjectInput}
                onChange={(e) => {
                  setCustomSubjectInput(e.target.value);
                  setSelectedSubjectId('custom');
                }}
                className="w-full h-[40px] px-3.5 text-xs font-semibold rounded-xl border border-[#E2D3A7] bg-white text-[#2D3748] focus:border-[#B7791F] focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 2: Select Topic */}
          <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7791F] text-white text-xs font-black flex items-center justify-center">2</span>
                <h2 className="text-sm font-bold text-[#2D3748] uppercase tracking-wide">
                  Select or Enter Topic
                </h2>
              </div>
              <span className="text-xs text-[#8B5E34] font-semibold">
                Domain: {customSubjectInput.trim() || activeSubject.name}
              </span>
            </div>

            {/* Curated Topic Pills for Selected Subject */}
            {activeSubject?.topics?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeSubject.topics.map((t) => {
                  const isSelected = selectedTopicId === t.id && !customTopicInput;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedTopicId(t.id);
                        setCustomTopicInput('');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-sm'
                          : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom Topic Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Or enter any custom topic name (e.g. Distributed Consensus Raft, CRISPR Gene Editing)..."
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                className="w-full h-[42px] px-3.5 pr-10 text-xs font-semibold rounded-xl border border-[#E2D3A7] bg-white text-[#2D3748] focus:border-[#B7791F] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#A0AEC0] absolute right-3 top-3" />
            </div>
          </div>

          {/* STEP 3: Concept Selection & Automated Identification */}
          <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7791F] text-white text-xs font-black flex items-center justify-center">3</span>
                <h2 className="text-sm font-bold text-[#2D3748] uppercase tracking-wide">
                  Select Specific Concept
                </h2>
              </div>

              <button
                type="button"
                onClick={handleAutoDetectClick}
                disabled={isAutoDetecting}
                className="px-2.5 py-1 rounded-lg bg-[#FFF3D6] hover:bg-[#FFE8A3] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34] flex items-center gap-1.5 transition-all cursor-pointer"
                title="Use offline AI to analyze topic and generate sequenced concepts"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#B7791F] ${isAutoDetecting ? 'animate-spin' : ''}`} />
                <span>{isAutoDetecting ? 'Detecting...' : 'Auto-Detect Concepts (AI)'}</span>
              </button>
            </div>

            <p className="text-xs text-[#718096]">
              Questions will be specifically grounded in the selected concept:
            </p>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {detectedConceptsList.map((conceptStr, idx) => {
                const isSelected = selectedConcept === conceptStr;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedConcept(conceptStr);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#FFF3D6] border-[#B7791F] text-[#2D3748] font-bold shadow-sm'
                        : 'bg-[#FFF8E8] border-[#E2D3A7]/70 text-[#4A5568] hover:bg-[#FFF3D6]/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${
                      isSelected ? 'bg-[#B7791F] border-[#B7791F] text-white' : 'border-[#CBD5E0] bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className="leading-snug">{conceptStr}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Examination Parameters */}
          <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7791F] text-white text-xs font-black flex items-center justify-center">4</span>
                <h2 className="text-sm font-bold text-[#2D3748] uppercase tracking-wide">
                  Examination Parameters
                </h2>
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">
                Question Type:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: 'mixed', label: 'Mixed' },
                  { id: 'mcq', label: 'MCQ' },
                  { id: 'text', label: 'Conceptual' },
                  { id: 'derivation', label: 'Derivation' },
                  { id: 'numerical', label: 'Numerical' },
                  { id: 'case_study', label: 'Case Study' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { soundEffects.playClick(); setQuestionType(t.id); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      questionType === t.id
                        ? 'bg-[#B7791F] text-white border-[#B7791F]'
                        : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Question Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">
                  Difficulty Level:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Adaptive', 'Foundation', 'Proficient', 'Advanced'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => { soundEffects.playClick(); setDifficulty(lvl); }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        difficulty === lvl
                          ? 'bg-[#B7791F] text-white border-[#B7791F]'
                          : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">
                  Number of Questions:
                </label>
                <div className="flex items-center gap-1.5">
                  {[3, 5, 10, 15, 20].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => { soundEffects.playClick(); setQuestionCount(qty); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        questionCount === qty
                          ? 'bg-[#B7791F] text-white border-[#B7791F]'
                          : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assessment Mode */}
            <div>
              <label className="text-xs font-bold text-[#718096] uppercase tracking-wider block mb-1.5">
                Assessment Mode:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { soundEffects.playClick(); setAssessmentMode('practice'); }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    assessmentMode === 'practice'
                      ? 'bg-[#FFF3D6] border-[#B7791F] ring-1 ring-[#B7791F]'
                      : 'bg-[#FFF8E8] border-[#E2D3A7]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#2D3748] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
                    <span>Practice & Self-Mastery</span>
                  </div>
                  <div className="text-[11px] text-[#718096] mt-0.5">
                    Progressive hints visible, instant explanations, unlimited retakes.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { soundEffects.playClick(); setAssessmentMode('strict_exam'); }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    assessmentMode === 'strict_exam'
                      ? 'bg-[#FFF3D6] border-[#B7791F] ring-1 ring-[#B7791F]'
                      : 'bg-[#FFF8E8] border-[#E2D3A7]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#2D3748] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2F855A]" />
                    <span>Strict Viva Examination</span>
                  </div>
                  <div className="text-[11px] text-[#718096] mt-0.5">
                    Anti-cheat shield active, timed questions, answers redacted until finish.
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Steps 5, 6 & 7 Live Grounded Preview & Launch */}
        <div className="lg:col-span-5 space-y-6">

          <div className="ent-card p-5 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7791F] text-white text-xs font-black flex items-center justify-center">5</span>
                <h2 className="text-sm font-bold text-[#2D3748] uppercase tracking-wide">
                  Grounded Question Package
                </h2>
              </div>
              <span className="text-xs font-bold text-[#B7791F]">
                {activePreviewIndex + 1} of {generatedPackage.length}
              </span>
            </div>

            {/* Pagination Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {generatedPackage.map((q, idx) => (
                <button
                  key={q.id || idx}
                  onClick={() => { soundEffects.playClick(); setActivePreviewIndex(idx); }}
                  className={`h-7 px-3 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activePreviewIndex === idx
                      ? 'bg-[#B7791F] text-white shadow-sm'
                      : 'bg-[#FFF8E8] text-[#718096] border border-[#E2D3A7] hover:bg-[#FFF3D6]'
                  }`}
                >
                  Q{idx + 1} {q.type === 'mcq' ? '(MCQ)' : '(Text)'}
                </button>
              ))}
            </div>

            {/* Question Details Card */}
            {previewQ && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E2D3A7] shadow-sm">
                
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF3D6] text-[10px] font-bold text-[#8B5E34]">
                    {previewQ.bloomLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E6F4EA] text-[10px] font-bold text-[#2F855A]">
                    Difficulty: {previewQ.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDF2F7] text-[10px] font-bold text-[#4A5568]">
                    {previewQ.assignedMarks} Marks
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF8E8] text-[10px] font-bold text-[#B7791F] border border-[#E2D3A7]">
                    Type: {previewQ.questionType?.toUpperCase()}
                  </span>
                </div>

                {/* Grounded Concept Label */}
                <div className="text-[11px] text-[#8B5E34] font-bold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#B7791F]" />
                  <span>Concept: {previewQ.concept}</span>
                </div>

                {/* Question Text */}
                <div className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-relaxed">
                  {previewQ.questionText}
                </div>

                {/* MCQ Options (If MCQ) */}
                {previewQ.options && previewQ.options.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-bold text-[#718096] uppercase">Options:</div>
                    {previewQ.options.map((opt, oIdx) => {
                      const isCorrect = showAnswerKeyInPreview && oIdx === previewQ.correctIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-xs leading-snug flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-[#E6F4EA] border-[#2F855A] text-[#1E4620] font-bold'
                              : 'bg-[#FFFDF7] border-[#E2D3A7] text-[#4A5568]'
                          }`}
                        >
                          <span className="font-bold shrink-0">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 6: Verified Answer Key & Model Explanation */}
                <div className="pt-2 border-t border-[#E2D3A7]/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#718096] uppercase">
                      6. Verified Answer Key & Hints:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAnswerKeyInPreview(!showAnswerKeyInPreview)}
                      className="text-[11px] font-bold text-[#B7791F] flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      {showAnswerKeyInPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showAnswerKeyInPreview ? 'Hide Key' : 'Inspect Key'}</span>
                    </button>
                  </div>

                  {showAnswerKeyInPreview && (
                    <div className="mt-2 p-3 rounded-xl bg-[#FFFDF7] border border-[#E2D3A7] text-xs space-y-2 animate-fade-in">
                      <div>
                        <span className="font-bold text-[#2D3748]">Model Answer: </span>
                        <span className="text-[#4A5568]">{previewQ.modelAnswer}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#2D3748]">Technical Explanation: </span>
                        <span className="text-[#718096]">{previewQ.explanation}</span>
                      </div>
                      {previewQ.expectedKeywords?.length > 0 && (
                        <div>
                          <span className="font-bold text-[#2D3748]">Scoring Keywords: </span>
                          <span className="text-[#8B5E34] font-mono text-[11px]">
                            {previewQ.expectedKeywords.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4-Tier Hints Dropdown Preview */}
                  {previewQ.hints && previewQ.hints.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-[11px] font-bold text-[#718096]">
                        4-Tier Progressive Scaffolding Hints:
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {previewQ.hints.map((hintText, hIdx) => (
                          <button
                            key={hIdx}
                            type="button"
                            onClick={() => setExpandedHintLevel(hIdx + 1)}
                            className={`py-1 text-[10px] font-bold rounded border cursor-pointer ${
                              expandedHintLevel === hIdx + 1
                                ? 'bg-[#B7791F] text-white border-[#B7791F]'
                                : 'bg-[#FFF8E8] text-[#8B5E34] border-[#E2D3A7]'
                            }`}
                          >
                            L{hIdx + 1}
                          </button>
                        ))}
                      </div>
                      <div className="p-2 rounded-lg bg-[#FFF8E8] border border-[#E2D3A7] text-[11px] text-[#4A5568] italic">
                        {previewQ.hints[expandedHintLevel - 1] || previewQ.hints[0]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: Interactive Viva Launch Action */}
            <div className="pt-2">
              <button
                onClick={handleLaunchViva}
                className="btn-primary w-full h-[50px] text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#FFF3D6]" />
                <span>7. Launch Interactive Viva Arena</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-center text-[11px] text-[#718096] mt-2">
                Loads questions into interactive test arena with audio synthesis, timing, and evaluation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
