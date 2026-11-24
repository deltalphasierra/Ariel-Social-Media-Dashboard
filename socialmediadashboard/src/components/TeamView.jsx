import React, { useState } from 'react';
import {
  Users2,
  UserPlus,
  ShieldCheck,
  Mail,
  CalendarCheck,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export default function TeamView({
  teamMembers,
  setTeamMembers,
  posts,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Content Creator & Video Editor',
    email: '',
    avatar: '👨‍🎨',
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    setTeamMembers(prev => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email || `${newMember.name.toLowerCase().replace(/\s+/g, '')}@workspace.local`,
        avatar: newMember.avatar,
      },
    ]);
    setNewMember({ name: '', role: 'Content Creator & Video Editor', email: '', avatar: '👨‍🎨' });
    setShowAddModal(false);
  };

  const handleDeleteMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
            <Users2 className="w-3.5 h-3.5" />
            <span>Manajemen Akses & Kolaborasi Tim</span>
          </div>
          <h2 className="text-xl font-bold text-white">Anggota Tim & Pembagian Tugas (PIC)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Setiap anggota bisa ditugaskan untuk copywriting, review konten, maupun desain visual.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Anggota Tim</span>
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member) => {
          const assignedPosts = posts.filter(p => p.assignee?.includes(member.name.split(' ')[0]));
          const pendingReview = assignedPosts.filter(p => p.status === 'review').length;

          return (
            <div
              key={member.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
                    {member.avatar}
                  </div>
                  {member.isLead ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Lead
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Hapus anggota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-sm text-white">{member.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{member.role}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <Mail className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Tugas Aktif</span>
                  <span className="font-bold text-white text-xs">{assignedPosts.length} Konten</span>
                </div>
                {pendingReview > 0 && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                    {pendingReview} review
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collaboration Workflow Guide */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Cara Tim Berkolaborasi di Dashboard Ini (Zero-Cost)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="font-semibold text-white block mb-1">1. Penugasan Konten (PIC)</span>
            Saat membuat atau mengedit konten di Content Planner, pilih nama anggota tim pada kolom "Assignee (PIC)".
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="font-semibold text-white block mb-1">2. Approval & Review</span>
            Pindahkan kartu ke kolom "Review & Approval" agar Lead atau Klien dapat memeriksa caption & asset visual sebelum tayang.
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="font-semibold text-white block mb-1">3. Sinkronisasi Real-Time</span>
            Aktifkan free cloud sync (Supabase) di menu Pengaturan agar seluruh anggota tim dapat membuka link web ini dari perangkat masing-masing secara bersamaan.
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Tambah Anggota Tim Baru</h3>
            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Peran / Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Social Media Specialist">Social Media Specialist</option>
                  <option value="Content Creator & Video Editor">Content Creator & Video Editor</option>
                  <option value="Copywriter & Scriptwriter">Copywriter & Scriptwriter</option>
                  <option value="Graphic Designer">Graphic Designer</option>
                  <option value="Client / Brand Reviewer">Client / Brand Reviewer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="rian@team.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
