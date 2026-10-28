import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  Eye,
  Radio
} from 'lucide-react';

export default function LiveAssessmentMonitorPage({ currentUser, onNavigate }) {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [monitorData, setMonitorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch faculty assessments
  useEffect(() => {
    fetch('/api/assessments/faculty')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.assessments)) {
          setAssessments(data.assessments);
          if (data.assessments.length > 0) {
            setSelectedAssessmentId(data.assessments[0].id);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load faculty assessments:', err);
      });
  }, []);

  // Poll live monitor data for selected assessment
  const fetchMonitor = (assessmentId) => {
    if (!assessmentId) return;
    setLoading(true);
    fetch(`/api/assessments/${assessmentId}/live-monitor`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.monitor) {
          setMonitorData(data.monitor);
          setError('');
        } else {
          setError(data.error || 'Failed to fetch live monitoring telemetry.');
        }
      })
      .catch(err => {
        setError(err.message || 'Network error fetching live telemetry.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedAssessmentId) {
      fetchMonitor(selectedAssessmentId);
    }
  }, [selectedAssessmentId]);

  // Periodic polling when auto-refresh is active
  useEffect(() => {
    if (!autoRefresh || !selectedAssessmentId) return;
    const interval = setInterval(() => {
      fetch(`/api/assessments/${selectedAssessmentId}/live-monitor`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.monitor) {
            setMonitorData(data.monitor);
          }
        })
        .catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedAssessmentId]);

  const handleCloseAssessment = async () => {
    if (!window.confirm('Are you sure you want to close this viva? Students will not be able to start new attempts.')) {
      return;
    }
    try {
      const res = await fetch('/api/assessments/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: selectedAssessmentId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Assessment closed successfully.');
        fetchMonitor(selectedAssessmentId);
      } else {
        alert(data.error || 'Failed to close assessment.');
      }
    } catch (e) {
      alert(e.message || 'Error closing assessment.');
    }
  };

  const selectedAssessment = assessments.find(a => a.id === selectedAssessmentId);

  return (
    <div className="space-y-6 animate-fade-in w-full text-left py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#E2D3A7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#718096]">Staff Operations • Live Telemetry</span>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
              <Radio className="w-3 h-3 text-emerald-600" /> Live Feed Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            Staff Live Assessment Monitor
          </h1>
          <p className="text-sm font-medium text-[#718096]">
            Authoritative multi-device examination control, attendance tracking, and audited integrity telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAutoRefresh(prev => !prev)}
            className={`btn-outline text-xs h-[40px] px-3 font-bold flex items-center gap-1.5 cursor-pointer ${
              autoRefresh ? 'bg-amber-50 text-amber-900 border-amber-300' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-Polling (4s)' : 'Polling Paused'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('faculty-dashboard')}
            className="btn-outline text-xs h-[40px] px-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Dashboard
          </button>
        </div>
      </div>

      {/* Assessment Selector & Status Controls */}
      <div className="ent-card p-5 bg-[#FFFCF4] border-[#E2D3A7] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-sm font-bold text-[#2D3748] shrink-0">Select Assessment:</label>
          <select
            value={selectedAssessmentId}
            onChange={(e) => setSelectedAssessmentId(e.target.value)}
            className="form-input h-[42px] text-xs sm:text-sm font-bold max-w-md"
          >
            {assessments.map(a => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.subject} • Sec {Array.isArray(a.targetSections) ? a.targetSections.join(', ') : a.targetSection}) [{a.status.toUpperCase()}]
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {monitorData?.isClosed ? (
            <span className="px-3.5 py-1.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Examination Closed
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCloseAssessment}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Close Assessment
            </button>
          )}

          <button
            type="button"
            onClick={() => fetchMonitor(selectedAssessmentId)}
            className="btn-secondary h-[42px] px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      {monitorData && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="ent-card p-4 bg-[#FFFCF4] border-[#E2D3A7]">
            <span className="text-xs font-bold text-[#718096] uppercase">Eligible Cohort</span>
            <div className="text-2xl font-black text-[#2D3748] mt-1">{monitorData.totalEligibleCount}</div>
            <p className="text-[11px] text-[#718096]">Year {monitorData.classYear} • Sec {Array.isArray(monitorData.targetSections) ? monitorData.targetSections.join(', ') : monitorData.targetSections}</p>
          </div>

          <div className="ent-card p-4 bg-[#E6F4EA] border-[#A8DAB5]">
            <span className="text-xs font-bold text-[#2F855A] uppercase">Joined / Attending</span>
            <div className="text-2xl font-black text-[#2F855A] mt-1">{monitorData.joinedCount}</div>
            <p className="text-[11px] text-[#2F855A]">
              {monitorData.totalEligibleCount > 0 ? `${Math.round((monitorData.joinedCount / monitorData.totalEligibleCount) * 100)}% attendance` : '0%'}
            </p>
          </div>

          <div className="ent-card p-4 bg-[#FFF3D6] border-[#E2D3A7]">
            <span className="text-xs font-bold text-[#B7791F] uppercase">Currently Active</span>
            <div className="text-2xl font-black text-[#B7791F] mt-1">{monitorData.activeCount}</div>
            <p className="text-[11px] text-[#718096]">Live answers autosaving</p>
          </div>

          <div className="ent-card p-4 bg-[#FFF8E8] border-[#E2D3A7]">
            <span className="text-xs font-bold text-[#8B5E34] uppercase">Submitted Vivas</span>
            <div className="text-2xl font-black text-[#8B5E34] mt-1">{monitorData.submittedCount}</div>
            <p className="text-[11px] text-[#718096]">Final marks evaluated</p>
          </div>

          <div className="ent-card p-4 bg-[#FFF0F0] border-[#FECACA]">
            <span className="text-xs font-bold text-[#C53030] uppercase">Not Started</span>
            <div className="text-2xl font-black text-[#C53030] mt-1">{monitorData.notStartedCount}</div>
            <p className="text-[11px] text-[#718096]">Awaiting student login</p>
          </div>
        </div>
      )}

      {/* Security & Watermark Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E2D3A7] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#8B5E34]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#B7791F] shrink-0" />
          <span>
            <strong>Authoritative Assessment Security Policy:</strong> Live attempts are rendered with masked non-sensitive watermarks (e.g. <code>STU-***4055</code>). Clipboard copy, printing, and context menus are deterred. Focus loss and tab switches are recorded as <strong>audited observations</strong> without automatic false disqualification.
          </span>
        </div>
      </div>

      {/* Live Attempts Roster Table */}
      {monitorData && (
        <div className="ent-card p-6 bg-[#FFFCF4] border-[#E2D3A7] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2D3A7] pb-3">
            <h3 className="text-base sm:text-lg font-bold text-[#2D3748] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#B7791F]" />
              Active and Submitted Student Roster
            </h3>
            <span className="text-xs font-mono font-bold text-[#718096]">
              Total Records: {monitorData.joinedCount}
            </span>
          </div>

          {monitorData.activeAttempts.length === 0 && monitorData.submittedAttempts.length === 0 ? (
            <div className="py-12 text-center text-[#718096] text-sm">
              No students have started an attempt for this assessment yet. Students from the assigned section will appear here in real time as they log in.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2D3A7] text-[#718096] uppercase">
                    <th className="py-2.5 px-3">Student Reg No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Sec</th>
                    <th className="py-2.5 px-3">Session Status</th>
                    <th className="py-2.5 px-3">Server Remaining</th>
                    <th className="py-2.5 px-3">Progress</th>
                    <th className="py-2.5 px-3">Integrity Observations</th>
                    <th className="py-2.5 px-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D3A7]/60">
                  {/* Active Attempts */}
                  {monitorData.activeAttempts.map(att => (
                    <tr key={att.attemptId} className="hover:bg-[#FFF3D6]/30">
                      <td className="py-3 px-3 font-mono font-bold text-[#2D3748]">{att.studentRegNo}</td>
                      <td className="py-3 px-3 font-semibold text-[#2D3748]">{att.studentName}</td>
                      <td className="py-3 px-3 font-bold text-[#8B5E34]">{att.section}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 w-max">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          In Progress
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#B7791F]">
                        {Math.floor(att.remainingSeconds / 60)}m {att.remainingSeconds % 60}s
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2D3748]">
                        {att.answeredCount} / {att.totalQuestions} Qs
                      </td>
                      <td className="py-3 px-3">
                        {att.integrityObservationsCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[11px] inline-flex items-center gap-1" title={att.observations.map(o => `${o.type}: ${o.details}`).join('\n')}>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            {att.integrityObservationsCount} event(s) logged
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clear
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#718096] italic">Pending Final Submission</td>
                    </tr>
                  ))}

                  {/* Submitted Attempts */}
                  {monitorData.submittedAttempts.map(att => (
                    <tr key={att.attemptId} className="hover:bg-[#E6F4EA]/40">
                      <td className="py-3 px-3 font-mono font-bold text-[#2D3748]">{att.studentRegNo}</td>
                      <td className="py-3 px-3 font-semibold text-[#2D3748]">{att.studentName}</td>
                      <td className="py-3 px-3 font-bold text-[#8B5E34]">{att.section}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Submitted
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#718096]">Completed</td>
                      <td className="py-3 px-3 font-bold text-[#2F855A]">
                        {att.answeredCount} / {att.totalQuestions} Qs
                      </td>
                      <td className="py-3 px-3">
                        {att.integrityObservationsCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]" title={att.observations.map(o => `${o.type}: ${o.details}`).join('\n')}>
                            {att.integrityObservationsCount} observation(s)
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-black text-sm text-[#2F855A]">
                        {att.score !== null ? `${att.score}%` : 'Graded'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
