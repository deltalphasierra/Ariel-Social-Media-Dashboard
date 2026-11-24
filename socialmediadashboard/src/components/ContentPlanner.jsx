import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Kanban,
  ListFilter,
  Plus,
  Sparkles,
  Clock,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';

export default function ContentPlanner({
  projects,
  accounts,
  posts,
  setPosts,
  selectedProjectId,
  selectedAccountId,
  onOpenPost,
  onOpenNewPost,
  onOpenAIStudio,
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'calendar' | 'list'
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 10, 1)); // November 2026

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (selectedProjectId !== 'all' && post.projectId !== selectedProjectId) return false;
    if (selectedAccountId !== 'all' && post.accountId !== selectedAccountId) return false;
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (formatFilter !== 'all' && post.format !== formatFilter) return false;
    return true;
  });

  const columns = [
    { id: 'idea', label: '💡 Ide Konten', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'draft', label: '✍️ Drafting', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'review', label: '👀 Review & Approval', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { id: 'scheduled', label: '⏰ Terjadwal', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { id: 'published', label: '✅ Published', color: 'border-slate-600 text-slate-300 bg-slate-800' },
  ];

  const handleMoveStatus = (postId, newStatus, e) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'calendar'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Kalender Jadwal</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Daftar / List</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">Semua Format</option>
            <option value="Reels">Reels</option>
            <option value="TikTok Video">TikTok Video</option>
            <option value="Feed Carousel">Feed Carousel</option>
            <option value="Single Post">Single Post</option>
            <option value="Story">Story</option>
          </select>

          {/* New Post & AI */}
          <button
            onClick={onOpenAIStudio}
            className="flex items-center gap-1 bg-indigo-950 border border-indigo-700/60 hover:bg-indigo-900 text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bantuan AI</span>
          </button>

          <button
            onClick={onOpenNewPost}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Konten</span>
          </button>
        </div>
      </div>

      {/* View Mode: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
          {columns.map((col) => {
            const colPosts = filteredPosts.filter((p) => p.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col min-h-[500px] max-h-[82vh]"
              >
                {/* Column Header */}
                <div className={`p-3 border-b border-slate-800 flex items-center justify-between font-semibold text-xs rounded-t-xl ${col.color}`}>
                  <span>{col.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/60 text-[10px] font-mono font-bold">
                    {colPosts.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {colPosts.length === 0 ? (
                    <div className="text-center py-10 px-2 text-slate-500 text-[11px] border border-dashed border-slate-800 rounded-lg">
                      Kosong di tahap ini
                    </div>
                  ) : (
                    colPosts.map((post) => {
                      const acc = accounts.find((a) => a.id === post.accountId);
                      const isIG = acc?.platform === 'instagram';
                      const proj = projects.find((p) => p.id === post.projectId);

                      return (
                        <div
                          key={post.id}
                          onClick={() => onOpenPost(post)}
                          className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/80 rounded-xl p-3 shadow-md hover:shadow-indigo-500/10 cursor-pointer transition-all group"
                        >
                          {/* Channel & Format */}
                          <div className="flex items-center justify-between text-[11px] mb-2">
                            <span className="flex items-center gap-1 font-mono text-slate-300 font-medium">
                              {isIG ? (
                                <InstagramIcon className="w-3 h-3 text-pink-400" />
                              ) : (
                                <TikTokIcon className="w-3 h-3 text-cyan-400" />
                              )}
                              <span className="truncate max-w-[100px]">{acc?.handle}</span>
                            </span>
                            <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                              {post.format}
                            </span>
                          </div>

                          {/* Post Title */}
                          <h4 className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
                            {post.title}
                          </h4>

                          {/* Hook preview */}
                          {post.hook && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 italic bg-slate-900/40 p-1.5 rounded border border-slate-700/30">
                              "{post.hook}"
                            </p>
                          )}

                          {/* Footer Info */}
                          <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono text-indigo-300">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {post.publishDate}
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <User className="w-3 h-3 text-slate-500" />
                              {post.assignee ? post.assignee.split(' ')[0] : 'Tim'}
                            </span>
                          </div>

                          {/* Quick Move Status Buttons on hover */}
                          <div className="mt-2.5 pt-2 border-t border-slate-700/30 flex items-center justify-between gap-1 text-[9px]">
                            {col.id !== 'idea' && (
                              <button
                                onClick={(e) => {
                                  const idx = columns.findIndex(c => c.id === col.id);
                                  handleMoveStatus(post.id, columns[idx - 1].id, e);
                                }}
                                className="text-slate-400 hover:text-white px-1.5 py-0.5 bg-slate-700/50 rounded"
                              >
                                ← Mundur
                              </button>
                            )}
                            <span className="text-slate-600">•</span>
                            {col.id !== 'published' && (
                              <button
                                onClick={(e) => {
                                  const idx = columns.findIndex(c => c.id === col.id);
                                  handleMoveStatus(post.id, columns[idx + 1].id, e);
                                }}
                                className="text-indigo-400 hover:text-indigo-200 px-1.5 py-0.5 bg-indigo-950/60 rounded font-semibold"
                              >
                                Maju →
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>Kalender Konten: November 2026</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total {filteredPosts.length} konten di kalender
            </span>
          </div>

          {/* Simple Month Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((d) => (
              <div key={d} className="text-center font-bold text-xs text-slate-400 py-1 border-b border-slate-800">
                {d}
              </div>
            ))}

            {/* Days 23 to 30 November (sample active window) */}
            {Array.from({ length: 14 }).map((_, i) => {
              const dayNum = 20 + i;
              if (dayNum > 30) return null;
              const dateStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayPosts = filteredPosts.filter((p) => p.publishDate === dateStr);

              return (
                <div
                  key={dateStr}
                  className="min-h-[110px] bg-slate-800/40 border border-slate-800 rounded-lg p-2 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-mono font-bold ${dayNum === 24 ? 'text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded' : 'text-slate-400'}`}>
                      {dayNum} Nov
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-300">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayPosts.map((p) => {
                      const acc = accounts.find(a => a.id === p.accountId);
                      const isIG = acc?.platform === 'instagram';

                      return (
                        <div
                          key={p.id}
                          onClick={() => onOpenPost(p)}
                          className={`text-[10px] p-1.5 rounded border cursor-pointer truncate transition-all ${
                            p.status === 'published'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : p.status === 'scheduled'
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                              : 'bg-indigo-950/70 text-indigo-300 border-indigo-800/60'
                          }`}
                        >
                          <span className="font-semibold">{p.publishTime}</span> {p.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Konten & Hook</th>
                  <th className="py-3 px-3">Akun / Platform</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Jadwal Tayang</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map((post) => {
                  const acc = accounts.find((a) => a.id === post.accountId);
                  const isIG = acc?.platform === 'instagram';

                  return (
                    <tr
                      key={post.id}
                      onClick={() => onOpenPost(post)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{post.title}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm italic">
                          "{post.hook || post.caption}"
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1.5 font-mono text-slate-300">
                          {isIG ? <InstagramIcon className="w-3.5 h-3.5 text-pink-400" /> : <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />}
                          {acc?.handle}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                          {post.format}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-indigo-300">
                        {post.publishDate} {post.publishTime}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          post.status === 'published' ? 'bg-slate-700 text-slate-300' :
                          post.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300' :
                          post.status === 'review' ? 'bg-purple-500/20 text-purple-300' :
                          post.status === 'draft' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {post.assignee || 'Unassigned'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPost(post);
                          }}
                          className="text-indigo-400 hover:text-indigo-200 text-xs font-medium"
                        >
                          Edit Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
