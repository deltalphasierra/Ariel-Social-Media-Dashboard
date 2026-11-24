import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  CalendarPlus,
  RefreshCw,
  Lightbulb,
  Zap,
  Flame,
  Key,
} from 'lucide-react';
import { generateContentWithGemini } from '../utils/aiService';

export default function AIStudio({
  projects,
  accounts,
  onApplyToPlanner,
  geminiApiKey,
  onOpenSettings,
}) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'acc-ig-1');
  const [format, setFormat] = useState('Reels');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Casual & Relatable');
  const [targetAudience, setTargetAudience] = useState('Anak muda & profesional Indonesia usia 20-35');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const selectedProject = projects.find(p => p.id === selectedAccount?.projectId);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const generated = await generateContentWithGemini({
        apiKey: geminiApiKey,
        platform: selectedAccount?.platform || 'instagram',
        format,
        topic,
        tone,
        targetAudience,
        niche: selectedProject?.category || 'Umum',
      });
      setResult(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePushToPlanner = () => {
    if (!result) return;
    onApplyToPlanner({
      projectId: selectedAccount?.projectId || 'proj-1',
      accountId: selectedAccount?.id || 'acc-ig-1',
      title: result.title || topic,
      format: format,
      hook: result.hook || '',
      caption: result.caption || '',
      hashtags: result.hashtags || ['#KontenViral'],
      publishDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      publishTime: result.bestTime ? result.bestTime.split(' ')[0] : '18:30',
      status: 'draft',
      notes: `Dibuat via AI Studio. Arahan visual: ${result.visualDirection || '-'}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Copywriter & Strategist</span>
            </div>
            <h2 className="text-xl font-bold text-white">AI Content Generation Studio</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Hasilkan hook pemikat, naskah video TikTok, slide carousel terstruktur, dan caption persuasif dalam hitungan detik. 
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{geminiApiKey ? 'API Key Aktif' : 'Atur Gemini Key (Free)'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Parameter Konten</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            {/* Account Selector */}
            <div>
              <label className="font-medium text-slate-300 block mb-1">Target Akun</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.platform.toUpperCase()}: {acc.handle} ({projects.find(p => p.id === acc.projectId)?.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Format Selector */}
            <div>
              <label className="font-medium text-slate-300 block mb-1">Format Konten</label>
              <div className="grid grid-cols-2 gap-2">
                {['Reels', 'TikTok Video', 'Feed Carousel', 'Single Post', 'Story'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-2 px-3 rounded-lg border text-left font-medium transition-all ${
                      format === fmt
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="font-medium text-slate-300 block mb-1 flex items-center justify-between">
                <span>Topik / Masalah / Produk yang Dibahas</span>
                <span className="text-[10px] text-slate-500">Wajib diisi</span>
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Mengapa kemeja bahan linen cocok untuk cuaca panas dan cara merawatnya agar awet"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" /> Contoh cepat:
              </span>
              {[
                '3 Kesalahan pemula saat styling outfit',
                'Rahasia seduh kopi di rumah rasa cafe',
                'Cara rapikan meja kerja biar produktif',
              ].map(pill => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setTopic(pill)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Tone of Voice */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                >
                  <option value="Casual & Relatable">Casual & Relatable (Santai)</option>
                  <option value="Edukatif & Informatif">Edukatif & Informatif</option>
                  <option value="Storytelling Emosional">Storytelling Emosional</option>
                  <option value="Hard Selling & Promo">Hard Selling & Promo</option>
                  <option value="Humor & Satir Halus">Humor & Ringan</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Sedang Berpikir & Menulis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Konten Sekarang</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">Belum ada hasil generate</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Isi topik di panel sebelah kiri lalu tekan tombol "Generate Konten". Hasilnya bisa langsung kamu kirim ke Kalender Konten!
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
              <h4 className="text-sm font-semibold text-white">Sedang meracik ide viral...</h4>
              <p className="text-xs text-slate-400 mt-1">Menganalisis hook psikologis, struktur naskah, dan hashtag relevan.</p>
            </div>
          )}

          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              {/* Output Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Hasil Generate AI</span>
                  <h4 className="text-sm font-bold text-white">{result.title}</h4>
                </div>
                <button
                  onClick={handlePushToPlanner}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Masukkan ke Planner</span>
                </button>
              </div>

              {/* Hook Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hook (3 Detik Pertama)</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.hook, 'hook')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'hook' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 font-medium italic pt-1">
                  "{result.hook}"
                </p>
              </div>

              {/* Caption Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                  <span>Copywriting Caption & Call to Action</span>
                  <button
                    onClick={() => copyToClipboard(result.caption, 'caption')}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'caption' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-normal pt-1">
                  {result.caption}
                </p>
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Rekomendasi Tag:</span>
                {result.hashtags?.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Visual Guidance */}
              {result.visualDirection && (
                <div className="bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 flex items-start gap-2">
                  <span className="font-semibold text-slate-300 shrink-0">🎨 Arahan Visual:</span>
                  <span>{result.visualDirection}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
