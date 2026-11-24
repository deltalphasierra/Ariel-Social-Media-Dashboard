import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  BarChart3,
  Users2,
  FileSpreadsheet,
  Settings,
  Layers,
  ChevronDown,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';

export default function Sidebar({
  currentTab,
  setCurrentTab,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  accounts,
  selectedAccountId,
  setSelectedAccountId,
  onOpenNewPost,
}) {
  // Filter accounts based on selected project
  const filteredAccounts = selectedProjectId === 'all'
    ? accounts
    : accounts.filter(acc => acc.projectId === selectedProjectId);

  const navItems = [
    { id: 'overview', label: 'Ringkasan / Overview', icon: LayoutDashboard },
    { id: 'planner', label: 'Content Planner', icon: CalendarDays },
    { id: 'analytics', label: 'Analitik & Metrik', icon: BarChart3 },
    { id: 'ai-studio', label: 'AI Content Studio', icon: Sparkles, badge: 'AI' },
    { id: 'team', label: 'Tim & Kolaborasi', icon: Users2 },
    { id: 'export', label: 'Export Data & Laporan', icon: FileSpreadsheet },
    { id: 'settings', label: 'Pengaturan & Cloud Sync', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base leading-tight tracking-wide flex items-center gap-1.5">
              OmniSocial <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-semibold">HQ</span>
            </h1>
            <p className="text-xs text-slate-400">3 Projects • 4 Accounts</p>
          </div>
        </div>
      </div>

      {/* Project Switcher */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2 block flex items-center justify-between">
          <span>Pilih Project Aktif</span>
          <span className="text-indigo-400 text-[10px]">{projects.length} Aktif</span>
        </label>
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSelectedAccountId('all');
            }}
            className="w-full bg-slate-800/90 text-slate-200 text-xs rounded-lg px-3 py-2.5 pr-8 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none font-medium"
          >
            <option value="all">🌐 Semua Project (Gabungan)</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                📁 {proj.name} ({proj.category})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase px-3 py-1">Menu Utama</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isActive ? 'bg-white/20 text-white' : 'bg-pink-500/20 text-pink-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Filter: Accounts */}
        <div className="pt-5 pb-2">
          <div className="text-[10px] font-semibold text-slate-500 uppercase px-3 py-1 flex items-center justify-between">
            <span>Filter Akun ({filteredAccounts.length})</span>
            {selectedAccountId !== 'all' && (
              <button
                onClick={() => setSelectedAccountId('all')}
                className="text-[10px] text-indigo-400 hover:underline capitalize"
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-1 mt-1">
            <button
              onClick={() => setSelectedAccountId('all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                selectedAccountId === 'all'
                  ? 'bg-slate-800 text-indigo-300 font-medium border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
              }`}
            >
              <span className="truncate">Semua Akun di Project</span>
              {selectedAccountId === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
            </button>

            {filteredAccounts.map((acc) => {
              const isSelected = selectedAccountId === acc.id;
              const isIG = acc.platform === 'instagram';
              return (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isIG ? (
                      <span className="p-1 rounded bg-pink-500/20 text-pink-400 shrink-0">
                        <InstagramIcon className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 shrink-0">
                        <TikTokIcon className="w-3 h-3" />
                      </span>
                    )}
                    <span className="truncate">{acc.handle}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{(acc.followers / 1000).toFixed(1)}k</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Post Button & User info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <button
          onClick={onOpenNewPost}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white py-2.5 px-3 rounded-lg text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Konten Baru</span>
        </button>
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud: Supabase / Local
          </span>
          <span className="text-[10px] text-slate-500">v1.0 Free</span>
        </div>
      </div>
    </aside>
  );
}
