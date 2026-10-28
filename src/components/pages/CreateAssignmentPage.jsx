import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  Eye,
  Radio,
  Clock,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { saveCohortAssignment } from '../../services/db';
import { checkOllamaAvailability } from '../../services/aiQuestionService';
import { GenerateAcademicQuestionPackage, ValidateQuestion } from '../../services/academicAssessmentEngine';

const DEPARTMENTS = [
  'Biotechnology',
  'Electronics and Communication Engineering (ECE)',
  'Computer Science and Engineering (CSE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Information Technology (IT)',
  'Artificial Intelligence and Data Science (AI & DS)',
  'Mechatronics Engineering',
  'Automobile Engineering',
  'Aeronautical Engineering',
  'Textile Technology',
  'Fashion Technology',
  'Electronics & Instrumentation Engineering (E&I)'
];

const BLOOM_LEVELS = ['Remembering', 'Understanding', 'Application', 'Analysis', 'Evaluation'];
const QUESTION_FORMATS = ['mcq', 'descriptive', 'numerical', 'scenario', 'diagram'];

export default function CreateAssignmentPage({ currentUser, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '2026-2027',
    semester: 'Semester 5',
    subject: 'Biotechnology',
    subjectId: 'BIO-301',
    topic: 'Bioreactor Design',
    concepts: 'Oxygen Transfer, Sterilization, Bioreactor Kinetics',
    targetYear: 'III',
    targetSections: ['A'], // Default to Section A to prevent accidental institution-wide assignment
    targetDepartment: 'Biotechnology',
    instructions: 'Authoritative viva examination. Complete all questions within the allocated duration. Progressive hints are enabled.',
    durationMinutes: 15,
    totalMarks: 100,
    questionCount: 10,
    difficultyPolicy: 'Adaptive (Bloom Dynamic Scale)',
    bloomLevels: ['Remembering', 'Understanding', 'Application', 'Analysis'],
    questionFormats: ['mcq', 'descriptive'],
    attemptLimit: 1,
    allowLateEntry: false,
    allowProgressiveHints: true,
    answerDisclosurePolicy: 'after_submission',
    status: 'published',
    mode: 'Mixed',
    documentContext: '',
    uploadedFileName: ''
  });

  const [ollamaStatus, setOllamaStatus] = useState({ available: false, activeModel: null });
  const [loading, setLoading] = useState(false);
  const [createdAssessment, setCreatedAssessment] = useState(null);
  const [error, setError] = useState('');
  const [lanInfo, setLanInfo] = useState({ hostIp: '127.0.0.1', port: 5173, studentUrl: 'http://localhost:5173/' });

  // Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const questionPresets = [5, 10, 15, 20, 25, 30, 50];

  useEffect(() => {
    checkOllamaAvailability().then(res => setOllamaStatus(res));
    fetch('/api/lan-info')
      .then(res => res.json())
      .then(data => { if (data && data.studentUrl) setLanInfo(data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSection = (sec) => {
    setFormData(prev => {
      const exists = prev.targetSections.includes(sec);
      const next = exists ? prev.targetSections.filter(s => s !== sec) : [...prev.targetSections, sec];
      return { ...prev, targetSections: next.length > 0 ? next : [sec] };
    });
  };

  const toggleBloomLevel = (level) => {
    setFormData(prev => {
      const exists = prev.bloomLevels.includes(level);
      const next = exists ? prev.bloomLevels.filter(l => l !== level) : [...prev.bloomLevels, level];
      return { ...prev, bloomLevels: next.length > 0 ? next : [level] };
    });
  };

  const toggleFormat = (fmt) => {
    setFormData(prev => {
      const exists = prev.questionFormats.includes(fmt);
      const next = exists ? prev.questionFormats.filter(f => f !== fmt) : [...prev.questionFormats, fmt];
      return { ...prev, questionFormats: next.length > 0 ? next : [fmt] };
    });
  };

  // Handle Document Upload (PDF, PPT, DOC, TXT)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setFormData(prev => ({
          ...prev,
          documentContext: content,
          uploadedFileName: file.name
        }));
      }
    };
    reader.readAsText(file);
  };

  // Staff Pre-Publish Question Preview & Validation
  const handlePreviewQuestions = () => {
    if (!formData.topic.trim() || !formData.subject.trim()) {
      return setError('Please enter Subject and Topic before previewing questions.');
    }
    setError('');
    setPreviewLoading(true);

    try {
      const pkg = GenerateAcademicQuestionPackage(formData.subject.trim(), formData.topic.trim(), {
        count: Math.min(10, parseInt(formData.questionCount, 10) || 5),
        difficulty: formData.difficultyPolicy,
        mode: formData.mode,
        documentContext: formData.documentContext
      });

      // Validate each question
      pkg.questions.forEach(q => {
        const val = ValidateQuestion(q, formData.topic.trim());
        if (!val.valid) {
          throw new Error(`Question validation failure: ${val.reasons.join(', ')}`);
        }
      });

      setPreviewQuestions(pkg.questions);
      setPreviewModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to generate preview questions.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const count = parseInt(formData.questionCount, 10);
    if (!count || count < 1 || count > 100) {
      return setError('Question count must be between 1 and 100 questions.');
    }

    if (!formData.title.trim() || !formData.subject.trim() || !formData.topic.trim()) {
      return setError('Please fill in Assessment Title, Subject, and Topic.');
    }

    setLoading(true);
    try {
      const conceptsList = formData.concepts.split(',').map(c => c.trim()).filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        subjectId: formData.subjectId.trim(),
        topic: formData.topic.trim(),
        concepts: conceptsList,
        academicYear: formData.academicYear,
        semester: formData.semester,
        department: formData.targetDepartment,
        classYear: formData.targetYear,
        targetSections: formData.targetSections,
        instructions: formData.instructions,
        durationMinutes: parseInt(formData.durationMinutes, 10) || 15,
        totalMarks: parseInt(formData.totalMarks, 10) || 100,
        questionCount: count,
        questionFormats: formData.questionFormats,
        difficultyPolicy: formData.difficultyPolicy,
        bloomLevels: formData.bloomLevels,
        attemptLimit: parseInt(formData.attemptLimit, 10) || 1,
        allowLateEntry: formData.allowLateEntry,
        allowProgressiveHints: formData.allowProgressiveHints,
        answerDisclosurePolicy: formData.answerDisclosurePolicy,
        status: formData.status,
        documentContext: formData.documentContext,
        uploadedFileName: formData.uploadedFileName
      };

      // 1. Submit to authoritative server endpoint
      const res = await fetch('/api/assessments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          facultyUser: {
            username: currentUser?.regNo || currentUser?.username || 'faculty',
            name: currentUser?.fullName || currentUser?.name || 'Lead Faculty Examiner',
            department: currentUser?.department || formData.targetDepartment
          }
        })
      });

      const serverRes = await res.json();
      if (!serverRes.success) {
        throw new Error(serverRes.error || 'Server rejected assessment creation.');
      }

      // 2. Also synchronize to local cohort storage for client compatibility
      const cohortLabel = `Year ${formData.targetYear} • Sec ${formData.targetSections.join(', ')} (${formData.targetDepartment})`;
      saveCohortAssignment({
        id: serverRes.assessment.id,
        assignmentName: formData.title.trim(),
        subjectName: formData.title.trim(),
        subject: formData.subject.trim(),
        topic: formData.topic.trim(),
        targetYear: formData.targetYear,
        targetSection: formData.targetSections[0] || 'A',
        targetSections: formData.targetSections,
        targetDepartment: formData.targetDepartment,
        assignedTo: cohortLabel,
        deadlineMinutes: parseInt(formData.durationMinutes, 10) || 15,
        totalMarks: parseInt(formData.totalMarks, 10) || 100,
        questionCount: count,
        difficultyPolicy: formData.difficultyPolicy,
        hintPolicy: formData.allowProgressiveHints ? 'Progressive 4-Level Guidance' : 'Disabled',
        mode: formData.mode,
        documentContext: formData.documentContext,
        facultyName: currentUser?.fullName || 'Lead Faculty Examiner',
        facultyId: currentUser?.regNo || 'faculty'
      });

      setCreatedAssessment(serverRes.assessment);
    } catch (err) {
      setError(err.message || 'Failed to create assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full py-2 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Integrated Viva Creator • Authoritative Staff Suite</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Create & Assign Viva Assessment
          </h1>
          <p className="text-sm font-medium text-[#718096]">
            Configure academic context, target specific class & sections, attach reference notes, and schedule multi-device examination
          </p>
        </div>
        <button
          onClick={() => onNavigate('faculty-dashboard')}
          className="btn-outline text-xs h-[40px] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Dashboard
        </button>
      </div>

      <div className="w-full">
        <div className="ent-card p-6 sm:p-10 space-y-8 bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl shadow-xl shadow-[#B7791F]/10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D3A7] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] border-2 border-[#E2D3A7] flex items-center justify-center text-[#B7791F]">
                <PlusCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2D3748]">Staff Viva Assessment Architect</h2>
                <p className="text-xs sm:text-sm text-[#718096]">Document-grounded, multi-device delivery with server-authoritative sessions</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF3D6] border border-[#E2D3A7] text-xs font-bold text-[#8B5E34]">
              <Sparkles className="w-4 h-4 text-[#B7791F]" />
              <span>AI Question Generation: {ollamaStatus.available ? 'Inference Engine Ready' : 'Domain Ontology Active'}</span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-[#FFF0F0] border-2 border-[#FECACA] text-[#C53030] text-sm font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {createdAssessment && (
            <div className="p-6 rounded-2xl bg-[#E6F4EA] border-2 border-[#A8DAB5] space-y-4">
              <div className="flex items-center gap-2.5 text-lg font-extrabold text-[#2F855A]">
                <CheckCircle2 className="w-6 h-6" />
                <span>Viva Assessment Successfully Published & Locked!</span>
              </div>
              <p className="text-sm text-[#2F855A]">
                Assigned strictly to <strong>Year {createdAssessment.classYear} • Section(s) [{createdAssessment.targetSections.join(', ')}] ({createdAssessment.department})</strong>.
                Only enrolled students in these sections are authorized to attend.
              </p>

              <div className="p-3 bg-white/95 rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">Authorized Student PC / Mobile URL:</span>
                  <span className="font-mono text-emerald-800 select-all">{lanInfo.studentUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(lanInfo.studentUrl);
                      alert(`Copied link: ${lanInfo.studentUrl}`);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer text-xs"
                  >
                    Copy Student Link
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('live-monitor')}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Radio className="w-3.5 h-3.5" /> Open Staff Live Monitor
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('live-monitor')}
                  className="btn-primary h-[40px] px-5 text-xs font-bold cursor-pointer"
                >
                  Go to Live Assessment Monitor
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedAssessment(null)}
                  className="btn-outline h-[40px] px-5 text-xs font-bold cursor-pointer"
                >
                  Create Another Assignment
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Academic Year, Semester, and Department */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2D3748]">Academic Year</label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2D3748]">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#2D3748]">Department / Programme</label>
                <select
                  name="targetDepartment"
                  value={formData.targetDepartment}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* 2. Assessment Title, Subject & Subject ID */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Assessment Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Bioreactor Oxygen Transfer & Sterilization Viva"
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Subject Name</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Biotechnology"
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Subject Code / ID</label>
                <input
                  type="text"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  placeholder="BIO-301"
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>
            </div>

            {/* 3. Topic and Concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Staff-Assigned Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Bioreactor Design"
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#2D3748]">Key Concepts (Comma separated)</label>
                <input
                  type="text"
                  name="concepts"
                  value={formData.concepts}
                  onChange={handleChange}
                  placeholder="e.g. Oxygen Transfer, Sterilization, Bioreactor Kinetics"
                  className="w-full text-sm font-bold p-3 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>
            </div>

            {/* 4. CLASS & SECTION ASSIGNMENT ENFORCEMENT */}
            <div className="p-5 rounded-2xl bg-[#FFF3D6]/60 border-2 border-[#E2D3A7] space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#8B5E34] uppercase tracking-wide">
                <ShieldCheck className="w-5 h-5 text-[#B7791F]" />
                <span>Class & Section Authorization (Strict Backend Enforcement)</span>
              </div>
              <p className="text-xs text-[#718096]">
                Only students actively registered in the selected Class Year and Sections can see or attend this assessment. All unauthorized requests will be rejected by the authoritative server.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2D3748]">Class / Academic Year</label>
                  <select
                    name="targetYear"
                    value={formData.targetYear}
                    onChange={handleChange}
                    className="w-full text-sm font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                  >
                    <option value="I">1st Year (I)</option>
                    <option value="II">2nd Year (II)</option>
                    <option value="III">3rd Year (III)</option>
                    <option value="IV">4th Year (IV)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2D3748]">Assigned Section(s) [Multi-Select Supported]</label>
                  <div className="flex items-center gap-3 pt-1">
                    {['A', 'B', 'C', 'D'].map(sec => (
                      <label key={sec} className="flex items-center gap-1.5 text-xs font-bold cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#E2D3A7]">
                        <input
                          type="checkbox"
                          checked={formData.targetSections.includes(sec)}
                          onChange={() => toggleSection(sec)}
                          className="rounded text-[#B7791F]"
                        />
                        <span>Section {sec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. DOCUMENT UPLOAD & KNOWLEDGE ENGINE INTEGRATION */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] border-2 border-dashed border-[#B7791F] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D3748]">
                  <Upload className="w-5 h-5 text-[#B7791F]" />
                  <span>Document-Grounded Knowledge Ingestion (PDF, DOCX, PPTX, TXT)</span>
                </div>
                {formData.uploadedFileName && (
                  <span className="text-xs font-bold text-[#2F855A] bg-[#E6F4EA] px-2.5 py-1 rounded-md">
                    ✓ {formData.uploadedFileName} Indexed
                  </span>
                )}
              </div>
              <p className="text-xs text-[#718096]">
                Passages from uploaded documents are retrieved and passed into the academic validation engine to ensure questions assess real course notes.
              </p>
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="w-full text-xs text-[#718096] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#B7791F] file:text-white hover:file:bg-[#975A16] cursor-pointer"
              />
            </div>

            {/* 6. Question Formats & Bloom's Taxonomy Levels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E2D3A7] space-y-2">
                <label className="block text-xs font-bold text-[#2D3748] uppercase">Permitted Question Formats</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUESTION_FORMATS.map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        formData.questionFormats.includes(fmt)
                          ? 'bg-[#B7791F] text-white border-[#B7791F]'
                          : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7]'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E2D3A7] space-y-2">
                <label className="block text-xs font-bold text-[#2D3748] uppercase">Bloom's Taxonomy Levels</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {BLOOM_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => toggleBloomLevel(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        formData.bloomLevels.includes(lvl)
                          ? 'bg-[#8B5E34] text-white border-[#8B5E34]'
                          : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. Duration, Marks, Count & Policies */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3748]">Question Count</label>
                <input
                  type="number"
                  name="questionCount"
                  min="1"
                  max="100"
                  value={formData.questionCount}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3748]">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  min="10"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3748]">Duration (Mins)</label>
                <input
                  type="number"
                  name="durationMinutes"
                  min="5"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3748]">Attempt Limit</label>
                <input
                  type="number"
                  name="attemptLimit"
                  min="1"
                  max="5"
                  value={formData.attemptLimit}
                  onChange={handleChange}
                  className="w-full text-sm font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                />
              </div>
            </div>

            {/* 8. Progressive Hints and Disclosure Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E2D3A7]">
                <input
                  type="checkbox"
                  id="allowProgressiveHints"
                  name="allowProgressiveHints"
                  checked={formData.allowProgressiveHints}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#B7791F] rounded"
                />
                <label htmlFor="allowProgressiveHints" className="text-xs font-bold text-[#2D3748] cursor-pointer">
                  Enable Progressive 4-Tier Adaptive Hints Engine (Controlled deductions)
                </label>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3748]">Answer Disclosure Policy</label>
                <select
                  name="answerDisclosurePolicy"
                  value={formData.answerDisclosurePolicy}
                  onChange={handleChange}
                  className="w-full text-xs font-bold p-2.5 rounded-xl bg-[#FFFDF8] border-2 border-[#E2D3A7] text-[#2D3748]"
                >
                  <option value="after_submission">Disclose explanation after student submission</option>
                  <option value="after_close">Disclose only after examination closes</option>
                  <option value="never">Never disclose answer keys (Strict formal viva)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons: Preview & Publish */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handlePreviewQuestions}
                disabled={previewLoading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FFF3D6] hover:bg-[#FFE8A3] text-[#8B5E34] border-2 border-[#E2D3A7] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Eye className="w-4 h-4 text-[#B7791F]" />
                {previewLoading ? 'Synthesizing...' : 'Preview & Validate Questions'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 w-full py-3.5 rounded-xl bg-[#B7791F] hover:bg-[#975A16] text-white text-sm sm:text-base font-extrabold shadow-lg shadow-[#B7791F]/25 transition-all cursor-pointer text-center"
              >
                {loading ? 'Publishing Assessment...' : `Publish Viva (${formData.questionCount} Qs to Year ${formData.targetYear} • Sec ${formData.targetSections.join(', ')})`}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Staff Pre-Publish Question Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-[#2D3748]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFCF4] border-2 border-[#E2D3A7] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#2D3748]">Pre-Publish Question Validation Preview</h3>
                <p className="text-xs text-[#718096]">Topic: <strong>{formData.topic}</strong> • Subject: <strong>{formData.subject}</strong></p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {previewQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E2D3A7] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#B7791F]">Question {idx + 1} ({q.type?.toUpperCase()})</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">✓ Validated</span>
                  </div>
                  <p className="font-semibold text-[#2D3748] text-sm">{q.questionText}</p>
                  
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <div className="space-y-1 pl-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-1.5 rounded ${oIdx === q.correctIndex ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-300' : 'text-gray-700'}`}>
                          {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex && '✓ (Answer Key)'}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-[#718096] bg-amber-50 p-2 rounded border border-amber-200">
                    <strong>Technical Explanation:</strong> {q.explanation}
                  </div>

                  {Array.isArray(q.hints) && q.hints.length > 0 && (
                    <div className="text-[11px] text-gray-600 pl-2">
                      <span className="font-bold">Progressive Hints:</span> {q.hints.join(' | ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="btn-primary px-5 py-2 text-xs font-bold cursor-pointer"
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
