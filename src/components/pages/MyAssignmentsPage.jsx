import React, { useState, useEffect } from 'react';
import { Clock, Award, Play, Eye, RotateCw, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { getCohortAssignments, isAssignmentCompletedByStudent } from '../../services/db';

export default function MyAssignmentsPage({ currentUser, onStartAssignment, onViewResult }) {
  const [assignments, setAssignments] = useState(() => {
    const list = getCohortAssignments();
    const userYear = currentUser?.year || 'III';
    const userSection = currentUser?.section || 'A';

    return (list || []).filter(a => {
      const yearMatch = !a.targetYear || a.targetYear === 'All Years' || a.targetYear === userYear;
      const secList = Array.isArray(a.targetSections) && a.targetSections.length > 0
        ? a.targetSections
        : (a.targetSection ? [a.targetSection] : ['A']);
      const secMatch = secList.includes('All Sections') || secList.includes('ALL') || secList.includes(userSection);
      return yearMatch && secMatch;
    }).map((a, idx) => {
      const resolvedSubject = (a.subject || a.subjectName || a.assignmentName || 'Engineering Viva').trim();
      const resolvedTopic = (a.topic && a.topic.trim()) || resolvedSubject;
      return {
        id: a.id || `asg-${idx}`,
        assignmentName: a.assignmentName || a.subjectName || resolvedSubject,
        subject: resolvedSubject,
        topic: resolvedTopic,
        faculty: a.facultyName || a.faculty || 'Faculty In-Charge',
        deadline: a.deadlineMinutes ? `${a.deadlineMinutes} mins session` : (a.deadline || 'Active Deadline'),
        marks: a.totalMarks || a.marks || 100,
        questionCount: a.questionCount || 10,
        mode: a.mode || 'Mixed',
        targetYear: a.targetYear || userYear,
        targetSection: a.targetSection || userSection,
        status: a.status || 'ACTIVE',
        documentContext: a.documentContext || ''
      };
    });
  });

  // Fetch live eligible assignments from server API
  useEffect(() => {
    fetch('/api/assessments/eligible', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUser: {
          username: currentUser?.regNo || currentUser?.username || 'student_a',
          name: currentUser?.fullName || currentUser?.name || 'Student',
          regNo: currentUser?.regNo || '22ECE042',
          year: currentUser?.year || 'III',
          section: currentUser?.section || 'A',
          department: currentUser?.department || 'Biotechnology'
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.assessments)) {
          setAssignments(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newItems = data.assessments
              .filter(a => !existingIds.has(a.id))
              .map(a => ({
                id: a.id,
                assignmentName: a.title,
                subject: a.subject,
                topic: a.topic,
                faculty: a.facultyName || 'Faculty In-Charge',
                deadline: `${a.durationMinutes || 15} mins session`,
                marks: a.totalMarks || 100,
                questionCount: a.questionCount || 10,
                mode: a.mode || 'Mixed',
                targetYear: a.classYear,
                targetSection: Array.isArray(a.targetSections) ? a.targetSections.join(', ') : a.targetSection,
                status: a.status || 'ACTIVE',
                documentContext: a.documentContext || ''
              }));
            return [...newItems, ...prev];
          });
        }
      })
      .catch(() => {});
  }, [currentUser]);

  return (
    <div className="space-y-[28px] animate-fade-in w-full text-left py-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E2D3A7] pb-4">
        <div>
          <span className="text-xs font-mono text-[#718096]">Page 9 • Student Portal • Coursework Viva</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] mt-1">
            My Coursework Assignments
          </h1>
          <p className="text-xs text-[#718096]">
            Faculty-assigned formal examinations • Strictly single-attempt policy enforced
          </p>
        </div>
      </div>

      {/* Security Policy Alert Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-[#E2D3A7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8B5E34]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#B7791F] shrink-0" />
          <span>
            <strong>Single-Attempt Examination Protocol:</strong> Once you complete an assigned Viva, your final marks and biometric telemetry are permanently submitted to the staff portal. Re-taking is strictly locked. For unlimited attempts, practice via <strong>Self Learning</strong>.
          </span>
        </div>
      </div>

      {/* Card Layout for Assignments (Edge-to-Edge Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full">
        {assignments.map((item) => {
          const isCompletedInDb = isAssignmentCompletedByStudent(item.id, currentUser?.regNo);
          const isCompleted = isCompletedInDb || item.status === 'COMPLETED';
          const isInProgress = !isCompleted && item.status === 'IN_PROGRESS';
          const isActive = !isCompleted && (item.status === 'ACTIVE' || !item.status);

          return (
            <div
              key={item.id}
              className={`ent-card flex flex-col justify-between transition-all bg-[#FFFCF4] border-2 ${
                isCompleted
                  ? 'border-[#CBD5E1] bg-[#FAF8F5]'
                  : 'border-[#E2D3A7] hover:border-[#B7791F]'
              }`}
            >
              <div className="space-y-4">
                
                {/* Status Badge & Question Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#8B5E34]">
                      {item.questionCount || 10} Questions
                    </span>
                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-md bg-[#E6F4EA] border border-[#A8DAB5] text-[11px] font-bold text-[#2F855A] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Submitted</span>
                      </span>
                    )}
                    {isInProgress && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF3D6] border border-[#E2D3A7] text-[11px] font-bold text-[#C05621]">
                        In Progress
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF8E8] border border-[#B7791F] text-[11px] font-bold text-[#B7791F]">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Assignment Name */}
                <div>
                  <h3 className="text-lg font-bold text-[#2D3748] leading-snug">
                    {item.assignmentName}
                  </h3>
                  <p className="text-xs text-[#718096] mt-1">
                    Faculty: <strong className="text-[#4A5568]">{item.faculty}</strong>
                  </p>
                </div>

                {/* Details Grid: Deadline, Marks */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-[12px] bg-[#FFF8E8] border border-[#E2D3A7] text-xs">
                  <div>
                    <span className="text-[#718096] block text-[11px]">Deadline</span>
                    <strong className="text-[#2D3748] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#C05621]" />
                      <span>{item.deadline}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[11px]">Marks</span>
                    <strong className="text-[#2D3748] flex items-center gap-1 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-[#2F855A]" />
                      <span>{item.marks} Total</span>
                    </strong>
                  </div>
                </div>

              </div>

              {/* Action Buttons: Start, Continue, or Locked Result */}
              <div className="pt-4 border-t border-[#E2D3A7]/60 mt-4 space-y-2">
                {isCompleted ? (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full text-xs h-[44px] rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4 text-[#94A3B8]" />
                      <span>Submitted to Faculty (Retake Locked)</span>
                    </button>
                    <button
                      onClick={() => onViewResult(item)}
                      className="btn-outline w-full text-xs h-[42px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#8B5E34]" />
                      <span>View Submitted Result</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {isActive && (
                      <button
                        onClick={() => onStartAssignment(item.topic || item.subject || item.assignmentName, item.questionCount || 10, item)}
                        className="btn-primary w-full text-xs h-[46px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Play className="w-4 h-4 text-[#FFF3D6]" />
                        <span>Start Exam ({item.questionCount || 10} Qs)</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => onStartAssignment(item.topic || item.subject || item.assignmentName, item.questionCount || 10, item)}
                        className="btn-warning w-full text-xs h-[46px] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>Continue Exam ({item.questionCount || 10} Qs)</span>
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
