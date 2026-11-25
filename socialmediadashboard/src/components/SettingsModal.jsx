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
  Link2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './SocialIcons';
import { fetchInstagramProfile } from '../utils/metaService';

export default function SettingsModal({
  isOpen,
  onClose,
  projects,
  setProjects,
  accounts,
  setAccounts,
  geminiApiKey,
  setGeminiApiKey,
  onExportBackup,
  onImportBackup,
  onResetDefaultData,
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('meta'); // 'meta' | 'cloud' | 'ai' | 'backup'
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable accounts state inside modal
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [testingAccId, setTestingAccId] = useState(null);
  const [testResult, setTestResult] = useState({}); // { [accId]: { success: boolean, message: string } }
  const [showMetaGuide, setShowMetaGuide] = useState(false);

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

  const handleAccountChange = (id, field, value) => {
    setLocalAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, [field]: value };
      }
      return acc;
    }));
  };

  const handleTestMetaConnection = async (acc) => {
    if (!acc.metaAccountId || !acc.metaAccessToken) {
      setTestResult(prev => ({
        ...prev,
        [acc.id]: {
          success: false,
          message: 'Harap isi Instagram Business ID dan Meta Access Token terlebih dahulu.',
        },
      }));
      return;
    }

    setTestingAccId(acc.id);
    setTestResult(prev => ({ ...prev, [acc.id]: null }));

    const res = await fetchInstagramProfile({
      igAccountId: acc.metaAccountId,
      accessToken: acc.metaAccessToken,
    });

    setTestingAccId(null);

    if (res.success) {
      // Auto update account with real live data from Meta
      const liveData = res.data;
      setLocalAccounts(prev => prev.map(a => {
        if (a.id === acc.id) {
          return {
            ...a,
            metaAccountId: liveData.id || a.metaAccountId,
            handle: liveData.handle || a.handle,
            displayName: liveData.displayName || a.displayName,
            followers: liveData.followers !== undefined ? liveData.followers : a.followers,
            bio: liveData.bio || a.bio,
            avatar: liveData.avatar || a.avatar,
            isMetaConnected: true,
          };
        }
        return a;
      }));

      setTestResult(prev => ({
        ...prev,
        [acc.id]: {
          success: true,
          message: res.note
            ? `Berhasil! ${res.note} Followers (${(liveData.followers || 0).toLocaleString('id-ID')}) diperbarui.`
            : `Berhasil terhubung ke Meta! Data followers (${(liveData.followers || 0).toLocaleString('id-ID')}) dan profil langsung diperbarui.`,
        },
      }));
    } else {
      setTestResult(prev => ({
        ...prev,
        [acc.id]: {
          success: false,
          message: `Gagal: ${res.error}`,
        },
      }));
    }
  };

  const handleSaveAllAccounts = () => {
    setAccounts(localAccounts);
    localStorage.setItem('omnisocial_accounts', JSON.stringify(localAccounts));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Pengaturan Akun & Integrasi Meta Business</h3>
              <p className="text-xs text-slate-400">Ganti nama akun aslimu atau hubungkan langsung ke Meta Graph API (Gratis)</p>
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
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('meta')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'meta'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Akun Saya & Meta Business API</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Google Gemini AI</span>
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'cloud'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Multi-User Cloud (Supabase)</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup Data</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
          {/* TAB: AKUN & META BUSINESS API */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Kelola 3 Akun Instagram & 1 Akun TikTok Aslimu</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Kamu bisa langsung mengganti username (@), nama brand, dan followers akun aslimu secara manual, ATAU menyambungkannya ke **Meta Graph API** untuk menarik data otomatis!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMetaGuide(!showMetaGuide)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-medium text-xs"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showMetaGuide ? 'Tutup Panduan' : 'Cara Dapat Token Meta'}</span>
                </button>
              </div>

              {/* Expandable Guide for Meta Developer Token */}
              {showMetaGuide && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-[11px] text-slate-300">
                  <h5 className="font-bold text-indigo-300 text-xs flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Langkah Cepat Ambil Token Meta Gratis di Graph API Explorer:</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                    <li>Buka <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline">developers.facebook.com</a> dan login dengan Facebook pengelola Page kamu.</li>
                    <li>Klik menu atas <strong>Tools &rarr; Graph API Explorer</strong>.</li>
                    <li>Di bagian <strong>User or Page</strong>, pilih Halaman Facebook yang tersambung ke Instagram Business kamu.</li>
                    <li>Di bagian <strong>Permissions</strong>, centang: <code className="text-pink-300">instagram_basic</code> dan <code className="text-pink-300">instagram_manage_insights</code>.</li>
                    <li>Klik tombol biru <strong>Generate Access Token</strong> &rarr; Salin Token-nya ke kolom di bawah ini.</li>
                    <li>Untuk <strong>Instagram Business Account ID</strong>, ketik query <code className="text-indigo-300">me?fields=instagram_business_account</code> di explorer untuk melihat ID angkanya.</li>
                  </ol>
                </div>
              )}

              {/* List of 4 Accounts */}
              <div className="space-y-4 pt-1">
                {localAccounts.map((acc, index) => {
                  const isIG = acc.platform === 'instagram';
                  const project = projects?.find(p => p.id === acc.projectId);
                  const isTesting = testingAccId === acc.id;
                  const result = testResult[acc.id];

                  return (
                    <div
                      key={acc.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3.5 hover:border-slate-700 transition-colors"
                    >
                      {/* Top Account Identity */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1.5 rounded-lg ${isIG ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {isIG ? <InstagramIcon className="w-4 h-4" /> : <TikTokIcon className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="font-bold text-white text-xs">{acc.displayName}</span>
                            <span className="text-[10px] text-slate-400 ml-2 font-mono">({project?.name || 'Project'})</span>
                          </div>
                        </div>

                        {isIG && acc.isMetaConnected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Live Terhubung ke Meta
                          </span>
                        )}
                      </div>

                      {/* Row 1: Handle, Display Name, Followers */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Username / Handle Sosmed
                          </label>
                          <input
                            type="text"
                            value={acc.handle}
                            onChange={(e) => handleAccountChange(acc.id, 'handle', e.target.value)}
                            placeholder="@nama_akun_kamu"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Nama Tampilan (Display Name)
                          </label>
                          <input
                            type="text"
                            value={acc.displayName}
                            onChange={(e) => handleAccountChange(acc.id, 'displayName', e.target.value)}
                            placeholder="Contoh: Brand Fashion Saya"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Jumlah Followers
                          </label>
                          <input
                            type="number"
                            value={acc.followers}
                            onChange={(e) => handleAccountChange(acc.id, 'followers', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Meta Graph API Integration Inputs (for Instagram) */}
                      {isIG && (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2">
                          <span className="text-[11px] font-semibold text-indigo-300 block flex items-center justify-between">
                            <span>Integrasi Meta Graph API Langsung (Opsional)</span>
                            <span className="text-[10px] text-slate-500 font-normal">Tarik data real-time</span>
                          </span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text"
                                placeholder="Instagram Business ID (contoh: 17841405822381234)"
                                value={acc.metaAccountId || ''}
                                onChange={(e) => handleAccountChange(acc.id, 'metaAccountId', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="password"
                                placeholder="Meta Access Token (EAABsb...)"
                                value={acc.metaAccessToken || ''}
                                onChange={(e) => handleAccountChange(acc.id, 'metaAccessToken', e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleTestMetaConnection(acc)}
                                disabled={isTesting}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded font-semibold text-[11px] shrink-0 flex items-center gap-1 transition-colors"
                              >
                                {isTesting ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    <span>Cek...</span>
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Tarik Data</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Result feedback */}
                          {result && (
                            <div className={`p-2 rounded text-[11px] flex items-center gap-1.5 ${
                              result.success ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/60 border border-red-500/40 text-red-300'
                            }`}>
                              {result.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                              <span>{result.message}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Perubahan akan langsung mengupdate seluruh halaman dashboard (Overview, Kalender, & Analitik).
                </span>
                <button
                  type="button"
                  onClick={handleSaveAllAccounts}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan Akun</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: CLOUD SYNC */}
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

          {/* TAB: AI ENGINE */}
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
              </div>
            </div>
          )}

          {/* TAB: BACKUP & RESTORE */}
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
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> Data berhasil disimpan ke browser!
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
