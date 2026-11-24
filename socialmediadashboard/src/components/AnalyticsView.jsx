import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowUpDown,
  FileSpreadsheet,
  Calendar,
  Layers,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';
import { exportAnalyticsToCSV } from '../utils/exportUtils';

export default function AnalyticsView({
  projects,
  accounts,
  posts,
  historicalAnalytics,
  selectedProjectId,
  selectedAccountId,
  onOpenExport,
}) {
  const [sortField, setSortField] = useState('publishDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter published posts that have metrics
  const publishedPosts = posts.filter(p => {
    if (selectedProjectId !== 'all' && p.projectId !== selectedProjectId) return false;
    if (selectedAccountId !== 'all' && p.accountId !== selectedAccountId) return false;
    return p.status === 'published' && p.metrics;
  });

  // Calculate totals
  const totalViews = publishedPosts.reduce((acc, p) => acc + (p.metrics?.views || 0), 0);
  const totalReach = publishedPosts.reduce((acc, p) => acc + (p.metrics?.reach || p.metrics?.views || 0), 0);
  const totalLikes = publishedPosts.reduce((acc, p) => acc + (p.metrics?.likes || 0), 0);
  const totalComments = publishedPosts.reduce((acc, p) => acc + (p.metrics?.comments || 0), 0);
  const totalShares = publishedPosts.reduce((acc, p) => acc + (p.metrics?.shares || 0), 0);
  const totalSaves = publishedPosts.reduce((acc, p) => acc + (p.metrics?.saves || 0), 0);
  const totalEngagements = totalLikes + totalComments + totalShares + totalSaves;
  const avgER = totalReach > 0 ? ((totalEngagements / totalReach) * 100).toFixed(2) : '0.00';

  // Sort posts
  const sortedPosts = [...publishedPosts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (['views', 'likes', 'comments', 'shares', 'saves', 'reach'].includes(sortField)) {
      valA = a.metrics?.[sortField] || 0;
      valB = b.metrics?.[sortField] || 0;
    } else if (sortField === 'er') {
      const mA = a.metrics || {};
      const totA = (mA.likes || 0) + (mA.comments || 0) + (mA.shares || 0) + (mA.saves || 0);
      valA = (mA.reach || mA.views || 1) > 0 ? (totA / (mA.reach || mA.views || 1)) : 0;

      const mB = b.metrics || {};
      const totB = (mB.likes || 0) + (mB.comments || 0) + (mB.shares || 0) + (mB.saves || 0);
      valB = (mB.reach || mB.views || 1) > 0 ? (totB / (mB.reach || mB.views || 1)) : 0;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleQuickDownload = () => {
    exportAnalyticsToCSV(posts, projects, accounts, `laporan_analitik_${selectedProjectId}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Download CTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Laporan Analitik Terverifikasi</span>
          </div>
          <h2 className="text-xl font-bold text-white">Performa Metrik & Interaksi</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis views, likes, reach, dan engagement rate untuk 3 akun Instagram dan 1 akun TikTok.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickDownload}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV (Excel)</span>
          </button>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Export Laporan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Views / Tayangan</span>
            <Eye className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalViews.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Likes</span>
            <Heart className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalLikes.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Komentar</span>
            <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalComments.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Shares / Dibagikan</span>
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalShares.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Saves / Disimpan</span>
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{totalSaves.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg. Engagement</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{avgER}%</div>
        </div>
      </div>

      {/* Visual Chart: 7-Day Follower Trend Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Tren Pertumbuhan Followers 7 Hari Terakhir</h3>
            <p className="text-xs text-slate-400">Pantauan grafik kenaikan audiens di tiap akun</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> @aura.official
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> @aura.daily (TikTok)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> @kopititiktemu.id
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> @zenliving.home
            </span>
          </div>
        </div>

        {/* CSS/SVG Bar Chart visualization */}
        <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
          {historicalAnalytics.map((item, idx) => {
            // normalized heights relative to baseline
            const hAuraIg = ((item.auraIg - 23500) / 1500) * 100;
            const hAuraTt = ((item.auraTt - 45000) / 4000) * 100;
            const hKopiIg = ((item.kopiIg - 11800) / 800) * 100;
            const hZenIg = ((item.zenIg - 17500) / 1600) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    style={{ height: `${Math.max(15, Math.min(100, hAuraIg))}%` }}
                    className="w-2 bg-purple-500 rounded-t hover:brightness-125 transition-all"
                    title={`Aura IG: ${item.auraIg}`}
                  />
                  <div
                    style={{ height: `${Math.max(15, Math.min(100, hAuraTt))}%` }}
                    className="w-2 bg-cyan-400 rounded-t hover:brightness-125 transition-all"
                    title={`Aura TikTok: ${item.auraTt}`}
                  />
                  <div
                    style={{ height: `${Math.max(15, Math.min(100, hKopiIg))}%` }}
                    className="w-2 bg-amber-400 rounded-t hover:brightness-125 transition-all"
                    title={`Kopi Titik Temu: ${item.kopiIg}`}
                  />
                  <div
                    style={{ height: `${Math.max(15, Math.min(100, hZenIg))}%` }}
                    className="w-2 bg-emerald-400 rounded-t hover:brightness-125 transition-all"
                    title={`Zen Living: ${item.zenIg}`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-300">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Post Performance Table with Sortable Columns */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Tabel Detail Performa Tiap Postingan</h3>
            <p className="text-xs text-slate-400">Klik header kolom untuk mengurutkan (sort) data</p>
          </div>
          <button
            onClick={handleQuickDownload}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Tabel Ini</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Konten & Akun</th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('format')}>
                  <span className="flex items-center gap-1">Format <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('publishDate')}>
                  <span className="flex items-center gap-1">Tanggal <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('views')}>
                  <span className="flex items-center justify-end gap-1">Views <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('likes')}>
                  <span className="flex items-center justify-end gap-1">Likes <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('comments')}>
                  <span className="flex items-center justify-end gap-1">Komentar <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('shares')}>
                  <span className="flex items-center justify-end gap-1">Shares <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('saves')}>
                  <span className="flex items-center justify-end gap-1">Saves <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('er')}>
                  <span className="flex items-center justify-end gap-1 text-emerald-400">ER (%) <ArrowUpDown className="w-3 h-3" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 text-xs font-sans">
                    Belum ada postingan berstatus "Published" dengan metrik performa.
                  </td>
                </tr>
              ) : (
                sortedPosts.map((post) => {
                  const acc = accounts.find(a => a.id === post.accountId);
                  const isIG = acc?.platform === 'instagram';
                  const m = post.metrics || {};
                  const views = m.views || 0;
                  const reach = m.reach || views;
                  const likes = m.likes || 0;
                  const comments = m.comments || 0;
                  const shares = m.shares || 0;
                  const saves = m.saves || 0;
                  const totalEng = likes + comments + shares + saves;
                  const er = reach > 0 ? ((totalEng / reach) * 100).toFixed(2) : '0.00';

                  return (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-sans">
                        <div className="font-semibold text-white">{post.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          {isIG ? <InstagramIcon className="w-3 h-3 text-pink-400" /> : <TikTokIcon className="w-3 h-3 text-cyan-400" />}
                          <span className="font-mono">{acc?.handle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {post.format}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{post.publishDate}</td>
                      <td className="py-3 px-3 text-right font-semibold text-white">{views.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3 text-right text-pink-300">{likes.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3 text-right text-indigo-300">{comments.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3 text-right text-cyan-300">{shares.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3 text-right text-amber-300">{saves.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 bg-emerald-500/5">
                        {er}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
