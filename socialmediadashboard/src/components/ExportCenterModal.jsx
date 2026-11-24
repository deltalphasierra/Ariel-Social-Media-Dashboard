import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  BarChart3,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { exportPostsToCSV, exportAnalyticsToCSV } from '../utils/exportUtils';

export default function ExportCenterModal({
  isOpen,
  onClose,
  projects,
  accounts,
  posts,
}) {
  if (!isOpen) return null;

  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');

  const filteredPosts = posts.filter(p => {
    if (selectedProjectId !== 'all' && p.projectId !== selectedProjectId) return false;
    if (selectedFormat !== 'all' && p.format !== selectedFormat) return false;
    return true;
  });

  const handleExportPlan = () => {
    const today = new Date().toISOString().split('T')[0];
    exportPostsToCSV(filteredPosts, projects, accounts, `content_plan_${selectedProjectId}_${today}.csv`);
  };

  const handleExportAnalytics = () => {
    const today = new Date().toISOString().split('T')[0];
    exportAnalyticsToCSV(filteredPosts, projects, accounts, `laporan_analitik_${selectedProjectId}_${today}.csv`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Pusat Download & Ekspor Laporan</h3>
              <p className="text-xs text-slate-400">Download data perencanaan dan analitik ke Excel / CSV / PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Filter options */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filter Data yang Mau Didownload</span>
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pilih Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value="all">Semua Project (Gabungan)</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Format Konten</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value="all">Semua Format</option>
                  <option value="Reels">Reels</option>
                  <option value="TikTok Video">TikTok Video</option>
                  <option value="Feed Carousel">Feed Carousel</option>
                  <option value="Single Post">Single Post</option>
                  <option value="Story">Story</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Data yang terpilih: <span className="text-indigo-400 font-semibold">{filteredPosts.length} konten</span>
            </p>
          </div>

          {/* Export Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Content Calendar Plan */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/60 transition-all">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-xs">Jadwal & Naskah Konten</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Export seluruh kalender postingan, copywriting caption, hashtag, dan PIC dalam format CSV Excel.
                </p>
              </div>
              <button
                onClick={handleExportPlan}
                className="mt-4 w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV Plan</span>
              </button>
            </div>

            {/* 2. Analytics & Performance */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/60 transition-all">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-white text-xs">Laporan Metrik Analitik</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Export angka views, likes, reach, shares, saves, dan Engagement Rate (%) untuk laporan evaluasi/klien.
                </p>
              </div>
              <button
                onClick={handleExportAnalytics}
                className="mt-4 w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV Analitik</span>
              </button>
            </div>
          </div>

          {/* Print preview option */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white text-xs block">Cetak / Save as PDF</span>
              <span className="text-[11px] text-slate-400">Buka dialog cetak browser untuk menyimpan laporan dalam bentuk PDF estetik.</span>
            </div>
            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
