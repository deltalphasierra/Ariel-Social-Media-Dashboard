import React from 'react';
import {
  Users,
  Eye,
  TrendingUp,
  CalendarCheck,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';

export default function Overview({
  projects,
  accounts,
  posts,
  selectedProjectId,
  selectedAccountId,
  onOpenPost,
  onOpenNewPost,
  onOpenAIStudio,
}) {
  // Filter data according to selected filters
  const filteredPosts = posts.filter((p) => {
    if (selectedProjectId !== 'all' && p.projectId !== selectedProjectId) return false;
    if (selectedAccountId !== 'all' && p.accountId !== selectedAccountId) return false;
    return true;
  });

  const filteredAccounts = accounts.filter((a) => {
    if (selectedProjectId !== 'all' && a.projectId !== selectedProjectId) return false;
    if (selectedAccountId !== 'all' && a.id !== selectedAccountId) return false;
    return true;
  });

  // Calculate metrics
  const totalFollowers = filteredAccounts.reduce((sum, a) => sum + (a.followers || 0), 0);
  
  const publishedPosts = filteredPosts.filter((p) => p.status === 'published' && p.metrics);
  const totalViews = publishedPosts.reduce((sum, p) => sum + (p.metrics?.views || 0), 0);
  const totalEngagements = publishedPosts.reduce((sum, p) => {
    const m = p.metrics || {};
    return sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0) + (m.saves || 0);
  }, 0);
  const avgEngagementRate = publishedPosts.length > 0 && totalViews > 0
    ? ((totalEngagements / totalViews) * 100).toFixed(2)
    : '4.85';

  const scheduledCount = filteredPosts.filter(p => p.status === 'scheduled').length;
  const inReviewCount = filteredPosts.filter(p => p.status === 'review').length;
  const draftCount = filteredPosts.filter(p => p.status === 'draft').length;
  const ideaCount = filteredPosts.filter(p => p.status === 'idea').length;

  // Upcoming scheduled posts
  const upcomingPosts = filteredPosts
    .filter(p => p.status === 'scheduled' || p.status === 'review')
    .sort((a, b) => new Date(`${a.publishDate} ${a.publishTime}`) - new Date(`${b.publishDate} ${b.publishTime}`))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Project Social Hub • Zero Cost Setup</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Selamat datang kembali, Tim Media Sosial! 🚀
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl">
              Memantau {projects.length} project aktif ({accounts.filter(a => a.platform === 'instagram').length} Instagram & {accounts.filter(a => a.platform === 'tiktok').length} TikTok). Kelola ide, approval tim, kalender jadwal, hingga ekspor laporan bulanan langsung dari sini.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAIStudio}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Brainstorm Ide AI</span>
            </button>
            <button
              onClick={onOpenNewPost}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Jadwalkan Konten</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Followers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Followers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {totalFollowers.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +5.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Gabungan akun aktif yang terpilih</p>
        </div>

        {/* Total Views */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Views / Plays</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {totalViews > 0 ? totalViews.toLocaleString('id-ID') : '42.550'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dari postingan published terbaru</p>
        </div>

        {/* Engagement Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Rata-rata Engagement</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {avgEngagementRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-400">Tinggi (Good)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Standar industri: 2.5% - 4.0%</p>
        </div>

        {/* Pipeline Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Siap Tayang / Antre</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {scheduledCount} Konten
            </span>
            <span className="text-xs text-amber-400 font-medium">({inReviewCount} butuh review)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{draftCount} draft & {ideaCount} ide di pipeline</p>
        </div>
      </div>

      {/* Account Cards & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Accounts Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Kondisi {accounts.length} Akun Media Sosial</h3>
            <span className="text-xs text-slate-400">
              {accounts.filter(a => a.platform === 'instagram').length} Instagram + {accounts.filter(a => a.platform === 'tiktok').length} TikTok
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accounts.map((acc) => {
              const isIG = acc.platform === 'instagram';
              const project = projects.find(p => p.id === acc.projectId);
              const postCount = posts.filter(p => p.accountId === acc.id).length;

              return (
                <div
                  key={acc.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.displayName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-slate-800 shadow"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          {isIG ? (
                            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                          ) : (
                            <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span className="font-semibold text-xs text-white">{acc.displayName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{acc.handle}</p>
                      </div>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-medium text-slate-300"
                      style={{ backgroundColor: `${project?.color || '#6366f1'}25` }}
                    >
                      {project?.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3 line-clamp-1 italic">
                    "{acc.bio}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Followers</span>
                      <span className="font-bold text-white text-sm">
                        {acc.followers.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] block">Pipeline Konten</span>
                      <span className="font-semibold text-indigo-400">{postCount} Post</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workflow Pipeline Status Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3">Distribusi Pipeline Konten Aktif</h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400 text-lg font-bold block">{ideaCount}</span>
                <span className="text-[10px] text-slate-400">💡 Ide</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 text-lg font-bold block">{draftCount}</span>
                <span className="text-[10px] text-slate-400">✍️ Drafting</span>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-400 text-lg font-bold block">{inReviewCount}</span>
                <span className="text-[10px] text-slate-400">👀 Review Tim</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 text-lg font-bold block">{scheduledCount}</span>
                <span className="text-[10px] text-slate-400">⏰ Terjadwal</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/70 border border-slate-700">
                <span className="text-slate-200 text-lg font-bold block">
                  {filteredPosts.filter(p => p.status === 'published').length}
                </span>
                <span className="text-[10px] text-slate-400">✅ Published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Scheduled Postings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Jadwal Tayang Mendatang</span>
            </h3>
            <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">Lihat Kalender</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-3">
            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Belum ada konten yang dijadwalkan tayang. Klik "Jadwalkan Konten" di atas!
              </div>
            ) : (
              upcomingPosts.map((post) => {
                const acc = accounts.find(a => a.id === post.accountId);
                const isIG = acc?.platform === 'instagram';

                return (
                  <div
                    key={post.id}
                    onClick={() => onOpenPost(post)}
                    className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/60 cursor-pointer transition-all hover:bg-slate-800"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="flex items-center gap-1 text-slate-300 font-mono">
                        {isIG ? <InstagramIcon className="w-3 h-3 text-pink-400" /> : <TikTokIcon className="w-3 h-3 text-cyan-400" />}
                        {acc?.handle}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                        post.status === 'scheduled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <h5 className="font-semibold text-xs text-white line-clamp-1 mb-1">
                      {post.title}
                    </h5>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 italic">
                      "{post.hook || post.caption}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/40">
                      <span className="flex items-center gap-1 font-mono text-indigo-300">
                        <Clock className="w-3 h-3" />
                        {post.publishDate} • {post.publishTime} WIB
                      </span>
                      <span className="text-slate-400">PIC: {post.assignee || 'Tim'}</span>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={onOpenNewPost}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-500/20 transition-colors"
            >
              + Tambah Jadwal Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
