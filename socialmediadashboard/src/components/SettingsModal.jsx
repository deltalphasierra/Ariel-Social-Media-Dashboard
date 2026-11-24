import React, { useState } from 'react';
import {
  X,
  Settings,
  Cloud,
  Key,
  Database,
  Download,
  Upload,
  RefreshCw,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  geminiApiKey,
  setGeminiApiKey,
  supabaseConfig,
  setSupabaseConfig,
  onExportBackup,
  onImportBackup,
  onResetDefaultData,
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud' | 'ai' | 'backup'
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const supabaseSqlSchema = `-- Schema Tabel Gratis untuk OmniSocial Dashboard di Supabase:
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  display_name TEXT,
  avatar TEXT,
  followers INTEGER DEFAULT 0,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  account_id TEXT,
  title TEXT NOT NULL,
  format TEXT,
  publish_date TEXT,
  publish_time TEXT,
  status TEXT DEFAULT 'draft',
  hook TEXT,
  caption TEXT,
  hashtags JSONB,
  asset_url TEXT,
  assignee TEXT,
  notes TEXT,
  metrics JSONB
);

-- Mengaktifkan Realtime untuk sinkronisasi otomatis tim
ALTER PUBLICATION supabase_realtime ADD TABLE posts, accounts;`;

  const handleSaveSettings = () => {
    setGeminiApiKey(apiKeyInput.trim());
    localStorage.setItem('omnisocial_gemini_key', apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Pengaturan & Cloud Sync (100% Gratis)</h3>
              <p className="text-xs text-slate-400">Konfigurasi sinkronisasi tim, AI key, dan backup data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'cloud'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Multi-User Cloud (Supabase)</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Google Gemini AI Key</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup & Reset</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {/* TAB 1: CLOUD SYNC */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 space-y-1.5 text-slate-300">
                <span className="font-bold text-indigo-200 flex items-center gap-1.5 text-xs">
                  <Cloud className="w-4 h-4 text-indigo-400" />
                  <span>Bagaimana Cara Tim Saya Bisa Mengakses Bersama Secara Gratis?</span>
                </span>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Untuk kolaborasi tim tanpa biaya server sepeser pun, kamu bisa gunakan database gratis dari <strong>Supabase</strong> (Free Tier selamanya). Seluruh anggota tim akan langsung tersinkronisasi secara real-time.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs">Langkah Cepat Setup (3 Menit):</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px]">
                  <li>
                    Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3 inline" /></a> dan buat akun gratis.
                  </li>
                  <li>
                    Klik <strong>New Project</strong> (pilih region terdekat: Singapore).
                  </li>
                  <li>
                    Buka menu <strong>SQL Editor</strong> di dashboard Supabase kamu, lalu paste SQL schema di bawah ini:
                  </li>
                </ol>

                {/* SQL Code Block with Copy Button */}
                <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto">
                  <button
                    onClick={handleCopySql}
                    className="absolute right-2.5 top-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-sans"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Tersalin!' : 'Copy SQL'}</span>
                  </button>
                  <pre>{supabaseSqlSchema}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI ENGINE */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3.5 space-y-1.5">
                <span className="font-bold text-purple-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>Google Gemini API Key (100% Free Quota)</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Google menyediakan akses gratis ke model Gemini 2.0 / 1.5 Flash via Google AI Studio tanpa perlu kartu kredit.
                  Jika kolom di bawah kosong, dashboard tetap bisa generate ide menggunakan template cerdas bawaan.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Dapatkan free key di: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 underline">aistudio.google.com/app/apikey</a>
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan API Key</span>
                </button>
                {savedSuccess && (
                  <span className="text-emerald-400 text-xs ml-3">Tersimpan di browser!</span>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-white text-xs">Backup & Pulihkan Data</h4>
                <p className="text-[11px] text-slate-400">
                  Semua data project, akun, konten, dan analitik tersimpan aman di browser kamu. Kamu bisa mengunduh file backup JSON kapan saja untuk dipindahkan ke laptop lain.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={onExportBackup}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg font-medium text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download Backup Data (JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg font-medium text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Restore Data dari File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={onImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 space-y-2">
                <span className="font-bold text-red-300 flex items-center gap-1 text-xs">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Reset Data</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Kembalikan seluruh project, 3 akun Instagram, 1 TikTok, dan analitik ke contoh default awal.
                </p>
                <button
                  onClick={onResetDefaultData}
                  className="mt-1 px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 rounded-lg text-xs font-semibold"
                >
                  Reset ke Contoh Awal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
