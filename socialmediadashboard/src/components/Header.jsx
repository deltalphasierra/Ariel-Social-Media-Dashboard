import React from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Download,
  Users,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';

export default function Header({
  projects,
  selectedProjectId,
  accounts,
  selectedAccountId,
  searchQuery,
  setSearchQuery,
  onOpenNewPost,
  onOpenAIStudio,
  onOpenExport,
}) {
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const currentAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Current Context Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium">Project:</span>
          <span className="font-semibold text-slate-100 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">
            {currentProject ? currentProject.name : 'Semua Project'}
          </span>
          {currentAccount && (
            <>
              <span className="text-slate-600">/</span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-500/30">
                {currentAccount.platform === 'instagram' ? (
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                ) : (
                  <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                )}
                {currentAccount.handle}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari konten, ide, caption, hashtag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:w-80"
          />
        </div>

        {/* AI Quick Generator Button */}
        <button
          onClick={onOpenAIStudio}
          className="flex items-center gap-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          title="Buka AI Content Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Assist</span>
        </button>

        {/* Quick Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          title="Export CSV / Laporan"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export</span>
        </button>

        {/* Team indicator */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
          <div className="flex -space-x-1.5">
            <span className="w-7 h-7 rounded-full bg-indigo-500/30 border-2 border-slate-900 flex items-center justify-center text-xs" title="Ariel (Lead)">👨‍💼</span>
            <span className="w-7 h-7 rounded-full bg-amber-500/30 border-2 border-slate-900 flex items-center justify-center text-xs" title="Budi (Editor)">🎬</span>
            <span className="w-7 h-7 rounded-full bg-pink-500/30 border-2 border-slate-900 flex items-center justify-center text-xs" title="Siti (Copy)">✍️</span>
          </div>
        </div>
      </div>
    </header>
  );
}
