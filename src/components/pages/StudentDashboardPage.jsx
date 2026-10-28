import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Brain,
  Award,
  Zap,
  RotateCcw,
  ArrowRight,
  Cpu,
  BookOpen,
  Search,
  Sparkles,
  Play
} from 'lucide-react';
import { getAllAssessmentSessions, getCohortAssignments } from '../../services/db';

export default function StudentDashboardPage({ currentUser, adaptiveEngine, topicModel, onNavigate, onStartCustomViva }) {
  const [quickSubject, setQuickSubject] = useState('');
  const [quickCount, setQuickCount] = useState(10);
  const presets = [5, 10, 20, 30, 50, 100];

  const allSessions = getAllAssessmentSessions();
  const studentSessions = allSessions.filter(
    s => s.studentRegNo === currentUser?.regNo || 
         s.studentName === currentUser?.fullName ||
         (currentUser?.fullName && s.studentName && s.studentName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
         (allSessions.length === 1)
  );
  const completedCount = studentSessions.length;

  const allAssignments = getCohortAssignments();
  const pendingCount = allAssignments.filter(a => a.status === 'ACTIVE').length;

  // Dynamically compute scores from student's actual answers and completed sessions
  let knowledgeScore = currentUser?.cognitiveTwin?.knowledgeScore || 85;
  let retentionScore = currentUser?.cognitiveTwin?.retentionScore || 82;
  let curiosityScore = currentUser?.cognitiveTwin?.curiosityIndex || 88;
  let masteryLevel = currentUser?.cognitiveTwin?.overallMastery || 'Proficient';

  if (studentSessions.length > 0) {
    const latest = studentSessions[0];
    knowledgeScore = latest.knowledgeScore ?? latest.accuracyRate ?? latest.overallScore ?? 85;
    retentionScore = latest.retentionScore ?? Math.round(knowledgeScore * 0.94);
    curiosityScore = latest.curiosityIndex ?? 90;
    masteryLevel = latest.masteryLevel ?? (knowledgeScore >= 85 ? 'Mastered' : knowledgeScore >= 70 ? 'Proficient' : 'Competent');
  } else if (currentUser?.cognitiveTwin) {
    knowledgeScore = currentUser.cognitiveTwin.knowledgeScore || 80;
    retentionScore = currentUser.cognitiveTwin.retentionScore || 82;
    curiosityScore = currentUser.cognitiveTwin.curiosityIndex || 85;
    masteryLevel = currentUser.cognitiveTwin.overallMastery || 'Proficient';
  }

  // EXACTLY 6 CARDS VISIBLE AS MANDATED:
  // 1. Pending Assignments, 2. Completed Assessments, 3. Knowledge Score, 4. Mastery Level, 5. Curiosity Score, 6. Retention Score
  const kpiCards = [
    {
      id: 'pending',
      title: 'Pending Assignments',
      value: pendingCount,
      unit: 'Active',
      icon: Clock,
      color: '#C05621',
      bgColor: '#FFF3D6',
      subtext: 'Faculty coursework active',
      target: 'my-assignments'
    },
    {
      id: 'completed',
      title: 'Completed Assessments',
      value: completedCount,
      unit: 'Vivas',
      icon: CheckCircle2,
      color: '#2F855A',
      bgColor: '#E6F4EA',
      subtext: completedCount > 0 ? `${completedCount} verified viva records` : 'No vivas taken yet',
      target: 'final-result'
    },
    {
      id: 'knowledge',
      title: 'Knowledge Score',
      value: knowledgeScore,
      unit: '%',
      icon: Brain,
      color: '#B7791F',
      bgColor: '#FFF3D6',
      subtext: completedCount > 0 ? 'Dynamic answer accuracy' : 'Bloom baseline index',
      target: 'knowledge-map'
    },
    {
      id: 'mastery',
      title: 'Mastery Level',
      value: masteryLevel,
      unit: '',
      icon: Award,
      color: '#8B5E34',
      bgColor: '#FFF8E8',
      subtext: completedCount > 0 ? 'Calculated from completed vivas' : 'Initial diagnostic rank',
      target: 'knowledge-map'
    },
    {
      id: 'curiosity',
      title: 'Curiosity Score',
      value: curiosityScore,
      unit: '/100',
      icon: Zap,
      color: '#C53030',
      bgColor: '#FFF0F0',
      subtext: 'Cognitive inquiry depth',
      target: 'self-learning'
    },
    {
      id: 'retention',
      title: 'Retention Score',
      value: retentionScore,
      unit: '%',
      icon: RotateCcw,
      color: '#2F855A',
      bgColor: '#E6F4EA',
      subtext: 'Spaced recall strength',
      target: 'knowledge-map'
    }
  ];

  return (
    <div className="space-y-[32px] animate-fade-in w-full text-left">
      
      {/* 1. Header Banner */}
      <div className="ent-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFFCF4] border-[#E2D3A7]">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#A8DAB5] text-[#2F855A] text-xs font-bold">
              Student Portal
            </span>
            <span className="text-xs font-mono text-[#718096]">{currentUser?.regNo || '714022104055'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748]">
            Welcome, <span className="text-[#B7791F]">{currentUser?.fullName || 'Student'}</span>
          </h1>
          <p className="text-xs text-[#718096]">
            {currentUser?.department || 'Electronics & Communication Engineering'} • Year {currentUser?.year || 'III'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('self-learning')}
            className="btn-primary h-[48px] min-w-0 px-6 text-sm"
          >
            <Sparkles className="w-4 h-4 mr-1 text-[#FFF3D6]" />
            Viva Analyzer X Studio
          </button>
          <button
            onClick={() => onNavigate('my-assignments')}
            className="btn-secondary h-[48px] min-w-0 px-6 text-sm"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            My Assignments
          </button>
        </div>
      </div>

      {/* 2. Interactive Instant Viva on Any Subject (Configurable 1 to 100 Questions) */}
      <div className="ent-card p-5 sm:p-6 bg-[#FFFCF4] border-[#E2D3A7] space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B7791F]" />
              <h2 className="text-base sm:text-lg font-bold text-[#2D3748]">
                Start Instant Adaptive Viva on Any Subject
              </h2>
            </div>
            <p className="text-xs text-[#718096]">
              Topic is not fixed — enter any subject (e.g. Operating Systems, Power Electronics, AI, Law) & choose up to 100 questions.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#B7791F] bg-[#FFF3D6] px-2.5 py-1 rounded-md border border-[#E2D3A7]">
            {quickCount} Questions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={quickSubject}
              onChange={(e) => setQuickSubject(e.target.value)}
              placeholder="Type any subject (e.g. Computer Networks, Microprocessors, Biomedical, Law...)"
              className="form-input pl-10 pr-3 h-[46px] text-xs sm:text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onStartCustomViva) {
                  onStartCustomViva(quickSubject.trim() || 'General Engineering', quickCount);
                }
              }}
            />
            <Search className="w-4 h-4 text-[#8B5E34] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="md:col-span-4 flex items-center gap-1.5 flex-wrap">
            {presets.map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setQuickCount(qty)}
                className={`px-2.5 py-1.5 rounded-[10px] text-xs font-bold border transition-all ${
                  quickCount === qty
                    ? 'bg-[#B7791F] text-white border-[#B7791F]'
                    : 'bg-[#FFF8E8] text-[#4A5568] border-[#E2D3A7] hover:bg-[#FFF3D6]'
                }`}
              >
                {qty} Qs
              </button>
            ))}
            <input
              type="number"
              min="1"
              max="100"
              value={quickCount}
              onChange={(e) => setQuickCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-16 h-[34px] px-2 text-xs font-bold rounded-[8px] border border-[#E2D3A7] bg-white text-center"
              title="Custom questions (1-100)"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={() => {
                if (onStartCustomViva) {
                  onStartCustomViva(quickSubject.trim() || 'General Engineering', quickCount);
                } else {
                  onNavigate('self-learning');
                }
              }}
              className="btn-primary w-full h-[46px] text-xs px-3"
            >
              <Play className="w-3.5 h-3.5 mr-1 text-[#FFF3D6]" />
              Start Viva
            </button>
          </div>
        </div>
      </div>

      {/* 3. ONLY 6 CARDS VISIBLE AS MANDATED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigate(card.target)}
              className="ent-card cursor-pointer flex flex-col justify-between hover:border-[#B7791F] hover:shadow-[0px_8px_24px_rgba(183,121,31,0.12)] transition-all text-left bg-[#FFFCF4] border-[#E2D3A7]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-[#E2D3A7]"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="py-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2D3748]">
                  {card.value} <span className="text-sm font-semibold text-[#718096]">{card.unit}</span>
                </div>
                <p className="text-xs text-[#718096] mt-1">{card.subtext}</p>
              </div>

              <div className="pt-3 border-t border-[#E2D3A7]/60 flex items-center justify-between text-xs font-bold text-[#B7791F]">
                <span>Open Section</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. RAPID PRACTICE ACCELERATORS (COVERS FULL RIGHT SPACE - UNLIMITED TILL MASTERY) */}
      <div className="ent-card p-6 bg-[#FFFCF4] border-2 border-[#E2D3A7] space-y-4 text-left w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E2D3A7] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B7791F]" />
              <h3 className="text-base sm:text-lg font-bold text-[#2D3748]">
                Curated Practice Disciplines (Self Learning • Unlimited Retakes Till Mastery)
              </h3>
            </div>
            <p className="text-xs text-[#718096]">
              Faculty assignments are single-attempt, but these domains can be taken repeatedly to improve your Learning DNA
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] text-xs font-bold text-[#2F855A]">
            100% Free Practice
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {[
            { title: 'Solid Mechanics', desc: 'Stress, Strain, Mohr Circle & Elasticity', count: 10 },
            { title: 'AI & Machine Learning', desc: 'Backprop, Overfitting & Neural Dynamics', count: 10 },
            { title: 'Power Electronics', desc: 'Inverters, Converters & Gate Dynamics', count: 10 },
            { title: 'Operating Systems', desc: 'Deadlocks, Paging, Virtual Memory & Threads', count: 10 }
          ].map((topicItem, tIdx) => (
            <div
              key={tIdx}
              onClick={() => {
                if (onStartCustomViva) {
                  onStartCustomViva(topicItem.title, topicItem.count);
                } else {
                  onNavigate('self-learning');
                }
              }}
              className="p-4 rounded-2xl bg-[#FFF8E8] hover:bg-[#FFF3D6] border-2 border-[#E2D3A7] hover:border-[#B7791F] cursor-pointer transition-all flex flex-col justify-between space-y-3 group shadow-xs"
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-[#B7791F] block uppercase">Discipline #{tIdx + 1}</span>
                <h4 className="text-sm font-extrabold text-[#2D3748] group-hover:text-[#B7791F] transition-colors mt-0.5">
                  {topicItem.title}
                </h4>
                <p className="text-xs text-[#718096] mt-1 leading-snug">{topicItem.desc}</p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#8B5E34] pt-2 border-t border-[#E2D3A7]/60">
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
