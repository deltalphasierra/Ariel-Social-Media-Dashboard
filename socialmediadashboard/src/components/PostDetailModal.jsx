import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  User,
  Link2,
  Hash,
  CheckCircle,
  TrendingUp,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';
import { generateSmartFallback } from '../utils/aiService';

export default function PostDetailModal({
  post,
  isOpen,
  onClose,
  onSave,
  onDelete,
  projects,
  accounts,
  teamMembers,
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: post?.id || `post-${Date.now()}`,
    projectId: post?.projectId || projects[0]?.id || 'proj-1',
    accountId: post?.accountId || accounts[0]?.id || 'acc-ig-1',
    title: post?.title || '',
    format: post?.format || 'Reels',
    publishDate: post?.publishDate || new Date().toISOString().split('T')[0],
    publishTime: post?.publishTime || '18:30',
    status: post?.status || 'draft',
    hook: post?.hook || '',
    caption: post?.caption || '',
    hashtags: post?.hashtags || ['#KontenHarian', '#SocialMedia'],
    assetUrl: post?.assetUrl || '',
    assignee: post?.assignee || teamMembers[0]?.name || '',
    notes: post?.notes || '',
    metrics: post?.metrics || {
      views: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
    },
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const selectedAccount = accounts.find(a => a.id === formData.accountId);
  const isIG = selectedAccount?.platform === 'instagram';

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = newTagInput.trim().replace(/^#/, '');
      if (tag && !formData.hashtags.includes(`#${tag}`)) {
        setFormData(prev => ({
          ...prev,
          hashtags: [...prev.hashtags, `#${tag}`],
        }));
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(t => t !== tagToRemove),
    }));
  };

  const handleAiAutoFill = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const generated = generateSmartFallback({
        platform: selectedAccount?.platform || 'instagram',
        format: formData.format,
        topic: formData.title || 'Inspirasi Konten',
        tone: 'Casual & Relatable',
      });

      setFormData(prev => ({
        ...prev,
        hook: generated.hook,
        caption: generated.caption,
        hashtags: generated.hashtags,
        publishTime: generated.bestTime ? generated.bestTime.split(' ')[0] : prev.publishTime,
      }));
      setIsAiLoading(false);
    }, 600);
  };

  const calculateEngagementRate = () => {
    const m = formData.metrics || {};
    const total = (Number(m.likes) || 0) + (Number(m.comments) || 0) + (Number(m.shares) || 0) + (Number(m.saves) || 0);
    const reach = Number(m.reach) || Number(m.views) || 0;
    if (reach === 0) return '0.00%';
    return `${((total / reach) * 100).toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl ${isIG ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              {isIG ? <InstagramIcon className="w-5 h-5" /> : <TikTokIcon className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-bold text-white text-base">
                {post ? 'Edit Rencana Konten' : 'Buat Konten Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Detail perancangan, copywriting, dan analitik performa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Project & Account Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Project Target</label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  const newProjId = e.target.value;
                  const firstAcc = accounts.find(a => a.projectId === newProjId);
                  setFormData(prev => ({
                    ...prev,
                    projectId: newProjId,
                    accountId: firstAcc ? firstAcc.id : prev.accountId,
                  }));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Akun Media Sosial</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {accounts
                  .filter(a => a.projectId === formData.projectId)
                  .map(a => (
                    <option key={a.id} value={a.id}>
                      {a.platform.toUpperCase()}: {a.handle} ({a.displayName})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Row 2: Title & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Judul / Topik Konten</label>
              <input
                type="text"
                placeholder="Contoh: 3 Tips Styling Kemeja Linen untuk Kuliah & Kerja"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Format Konten</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Reels">Reels Video</option>
                <option value="TikTok Video">TikTok Video</option>
                <option value="Feed Carousel">Feed Carousel (Multi-slide)</option>
                <option value="Single Post">Single Post (Feed Image)</option>
                <option value="Story">Instagram Story</option>
              </select>
            </div>
          </div>

          {/* AI Assistance Prompt Box */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-200">
                Mau AI buatkan hook & copywriting untuk topik ini?
              </span>
            </div>
            <button
              type="button"
              onClick={handleAiAutoFill}
              disabled={isAiLoading || !formData.title}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiLoading ? 'Menulis...' : 'Generate with AI'}</span>
            </button>
          </div>

          {/* Hook / 3s Stopper */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Hook (3 Detik Pertama / Headline Cover)</span>
              <span className="text-[11px] text-slate-500">Paling krusial untuk menahan scrolling</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Stop pakai kemeja oversize kayak gini kalau gak mau keliatan tenggelam!"
              value={formData.hook}
              onChange={(e) => setFormData(prev => ({ ...prev, hook: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Copywriting Caption</label>
            <textarea
              rows={5}
              placeholder="Tulis caption lengkap beserta Call To Action (CTA) di sini..."
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-normal leading-relaxed"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Hashtags</span>
              <span className="text-[11px] text-slate-500">Tekan Enter atau Koma untuk tambah tag</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.hashtags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Ketik hashtag baru..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Row 3: Schedule, PIC, Asset Link, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tanggal Tayang</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Jam Tayang (WIB)</label>
              <input
                type="time"
                value={formData.publishTime}
                onChange={(e) => setFormData(prev => ({ ...prev, publishTime: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Assignee (PIC)</label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Status Konten</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="idea">💡 Ide Konten</option>
                <option value="draft">✍️ Drafting</option>
                <option value="review">👀 Review & Approval</option>
                <option value="scheduled">⏰ Terjadwal</option>
                <option value="published">✅ Published (Tayang)</option>
              </select>
            </div>
          </div>

          {/* Asset URL & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Link File / Asset Desain</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="Link Google Drive, Canva, Figma..."
                  value={formData.assetUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetUrl: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Catatan Tim</label>
              <input
                type="text"
                placeholder="Catatan revisi, musik trending, sound ID..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Performance Tracking Section (If Published or logging analytics) */}
          {formData.status === 'published' && (
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Pencatatan Analitik Hasil Tayang (Real Metrics)
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Engagement Rate: {calculateEngagementRate()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Views / Tayangan</label>
                  <input
                    type="number"
                    value={formData.metrics?.views || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, views: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Reach (Akun Unik)</label>
                  <input
                    type="number"
                    value={formData.metrics?.reach || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, reach: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Likes</label>
                  <input
                    type="number"
                    value={formData.metrics?.likes || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, likes: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Comments</label>
                  <input
                    type="number"
                    value={formData.metrics?.comments || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, comments: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Shares</label>
                  <input
                    type="number"
                    value={formData.metrics?.shares || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, shares: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Saves / Bookmark</label>
                  <input
                    type="number"
                    value={formData.metrics?.saves || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metrics: { ...prev.metrics, saves: Number(e.target.value) }
                    }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {post ? (
            <button
              type="button"
              onClick={() => onDelete(formData.id)}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Konten</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              Simpan Konten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
