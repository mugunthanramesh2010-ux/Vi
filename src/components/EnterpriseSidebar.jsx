import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Layers,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Users,
  FileSpreadsheet,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export default function EnterpriseSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  onLogout
}) {
  const isFaculty = currentUser?.role === 'faculty';

  // Student Navigation (6 main items)
  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-assignments', label: 'Assignments', icon: BookOpen },
    { id: 'self-learning', label: 'Viva Analyzer X', icon: Cpu },
    { id: 'knowledge-map', label: 'Knowledge Map', icon: Layers },
    { id: 'final-result', label: 'Results & Reports', icon: FileSpreadsheet },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  // Faculty Navigation (8 main items)
  const facultyNav = [
    { id: 'faculty-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'create-assignment', label: 'Create Assignment', icon: PlusCircle },
    { id: 'live-monitor', label: 'Live Viva Monitor', icon: BarChart3 },
    { id: 'faculty-students', label: 'Student Cohort', icon: Users },
    { id: 'faculty-results', label: 'Exam Results', icon: FileSpreadsheet },
    { id: 'security-analytics', label: 'Security & Telemetry', icon: ShieldCheck },
    { id: 'export-center', label: 'Export Center', icon: FileText },
    { id: 'profile', label: 'Faculty Profile', icon: User }
  ];

  const menuItems = isFaculty ? facultyNav : studentNav;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-[#FFF2CC] border-r-2 border-[#E2D3A7] transition-all duration-300 flex flex-col justify-between select-none shadow-[4px_0_16px_rgba(183,121,31,0.06)] ${
        isCollapsed ? 'w-[84px]' : 'w-[280px]'
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Brand Header */}
        <div className="h-[80px] border-b-2 border-[#E2D3A7] px-4 flex items-center justify-between shrink-0 bg-[#FFE8A3]">
          <div
            onClick={() => setActiveTab(isFaculty ? 'faculty-dashboard' : 'student-dashboard')}
            className={`flex items-center gap-3 cursor-pointer overflow-hidden ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="VIVA ANALYSER Enterprise"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#B7791F] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              <Cpu className="w-7 h-7 text-[#FFF3D6]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="font-extrabold text-[17px] tracking-tight text-[#2D3748]">
                  VIVA <span className="text-[#B7791F]">ANALYSER</span>
                </div>
                <div className="text-[11px] font-bold text-[#8B5E34] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#2F855A] animate-pulse"></span>
                  <span>{isFaculty ? 'Faculty Portal' : 'Student Portal'}</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="btn-icon w-9 h-9 text-[#718096] hover:text-[#B7791F] bg-[#FFF8E8] border-[#E2D3A7] rounded-xl cursor-pointer"
              title="Collapse Toolbar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Expand Trigger when collapsed */}
        {isCollapsed && (
          <div className="p-3 border-b border-[#E2D3A7] flex justify-center shrink-0">
            <button
              onClick={() => setIsCollapsed(false)}
              className="btn-icon w-10 h-10 text-[#718096] hover:text-[#B7791F] bg-[#FFF8E8] border-[#E2D3A7] rounded-xl flex items-center justify-center cursor-pointer shadow-xs"
              title="Expand Toolbar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Nav Items List: Big Boxes, Big Letters, Covering Full Space */}
        <nav className="p-3.5 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex-1 min-h-[58px] max-h-[76px] flex items-center gap-4 px-4.5 py-3.5 rounded-2xl transition-all border-2 cursor-pointer shadow-sm ${
                  isCollapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-[#B7791F] text-white border-[#B7791F] shadow-lg shadow-[#B7791F]/25 scale-[1.02]'
                    : 'bg-[#FFFBF0] text-[#2D3748] border-[#E2D3A7] hover:bg-[#FFF3D6] hover:border-[#B7791F] hover:text-[#8B5E34]'
                }`}
                title={item.label}
              >
                <Icon className={`w-7 h-7 shrink-0 ${isActive ? 'text-white' : 'text-[#B7791F]'}`} />
                {!isCollapsed && (
                  <span className="truncate tracking-wide text-left flex-1 font-black text-[16px] sm:text-[17px]">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Profile / Logout Area */}
      <div className="p-3.5 border-t-2 border-[#E2D3A7] space-y-2.5 shrink-0 bg-[#FFE8A3]">
        {!isCollapsed && (
          <div className="p-3 rounded-2xl bg-[#FFF8E8] border-2 border-[#E2D3A7] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7791F] text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold text-[#2D3748] truncate">
                {currentUser?.fullName || 'Academic User'}
              </div>
              <div className="text-xs font-mono font-bold text-[#8B5E34] truncate">
                {currentUser?.regNo || 'REG-ID'} • {currentUser?.year ? `Year ${currentUser.year}` : (currentUser?.role || 'User')}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-[#C53030] bg-[#FFF0F0] hover:bg-[#FED7D7] border border-[#FECACA] transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
