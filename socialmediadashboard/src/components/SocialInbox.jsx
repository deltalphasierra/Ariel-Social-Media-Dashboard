import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  Bot,
  Reply,
  Check,
  Zap,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { replyToInstagramComment, sendInstagramDirectMessage } from '../utils/metaService';

export default function SocialInbox({
  accounts,
  comments,
  setComments,
  dms,
  setDms,
  selectedAccountId,
  setSelectedAccountId,
}) {
  const [inboxTab, setInboxTab] = useState('comments'); // 'comments' | 'dms'
  const [activeCommentId, setActiveCommentId] = useState(comments[0]?.id || null);
  const [activeDmId, setActiveDmId] = useState(dms[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Filter by account
  const filteredComments = comments.filter(c => {
    if (selectedAccountId !== 'all' && c.accountId !== selectedAccountId) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return c.senderUsername.toLowerCase().includes(q) || c.commentText.toLowerCase().includes(q) || c.postTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredDMs = dms.filter(d => {
    if (selectedAccountId !== 'all' && d.accountId !== selectedAccountId) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return d.senderUsername.toLowerCase().includes(q) || d.lastMessage.toLowerCase().includes(q);
    }
    return true;
  });

  const activeComment = comments.find(c => c.id === activeCommentId) || filteredComments[0];
  const activeDM = dms.find(d => d.id === activeDmId) || filteredDMs[0];
  const activeAccount = accounts.find(a => a.id === (inboxTab === 'comments' ? activeComment?.accountId : activeDM?.accountId));

  // Quick AI Templates for CS Replies
  const handleQuickAiDraft = (type) => {
    if (inboxTab === 'comments' && activeComment) {
      const name = activeComment.senderName.split(' ')[0];
      if (type === 'price') {
        setReplyText(`Halo Kak ${name}! Terima kasih sudah bertanya. Tim kami akan mengirimkan informasi harga dan detailnya melalui DM ya. ✨`);
      } else if (type === 'survey') {
        setReplyText(`Halo Kak ${name}! Terima kasih atas ketertarikannya. Silakan kirim waktu yang nyaman, nanti tim kami bantu atur jadwal konsultasi.`);
      } else if (type === 'wa') {
        setReplyText(`Halo Kak ${name}! Terima kasih sudah menghubungi kami. Silakan cek DM untuk informasi dan langkah selanjutnya ya.`);
      } else {
        setReplyText(`Halo Kak ${name}! Terima kasih banyak sudah mampir dan meninggalkan komentar. Kami senang bisa membantu. ✨`);
      }
    } else if (inboxTab === 'dms' && activeDM) {
      const name = activeDM.senderName.split(' ')[0];
      setReplyText(`Halo Kak ${name}! Terima kasih sudah menghubungi kami. Ceritakan informasi yang kamu butuhkan, dan tim kami akan segera membantu. ✨`);
    }
  };

  // Handle Comment Reply Submission
  const handleSendCommentReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeComment) return;

    setIsSending(true);
    setStatusMessage(null);

    // If account has live Meta Access Token, send to Meta Graph API
    if (activeAccount?.metaAccessToken && activeComment.metaCommentId) {
      const res = await replyToInstagramComment({
        commentId: activeComment.metaCommentId,
        message: replyText.trim(),
        accessToken: activeAccount.metaAccessToken,
      });

      if (!res.success) {
        console.warn('Gagal kirim via API Meta:', res.error);
      }
    }

    // Update local state
    const newReply = {
      id: `rep-${Date.now()}`,
      senderName: `${activeAccount?.displayName || 'Admin'} (You)`,
      text: replyText.trim(),
      timestamp: 'Baru saja',
    };

    setComments(prev => prev.map(c => {
      if (c.id === activeComment.id) {
        return {
          ...c,
          isReplied: true,
          replies: [...c.replies, newReply],
        };
      }
      return c;
    }));

    setReplyText('');
    setIsSending(false);
    setStatusMessage('Balasan komentar berhasil dikirim!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle DM Message Submission
  const handleSendDM = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeDM) return;

    setIsSending(true);
    setStatusMessage(null);

    // If account has live Meta Access Token, send to Meta Messaging API
    if (activeAccount?.metaAccessToken && activeAccount.metaAccountId && activeDM.senderId) {
      const res = await sendInstagramDirectMessage({
        igUserId: activeAccount.metaAccountId,
        recipientId: activeDM.senderId,
        message: replyText.trim(),
        accessToken: activeAccount.metaAccessToken,
      });

      if (!res.success) {
        console.warn('Gagal kirim via Meta Messaging API:', res.error);
      }
    }

    // Update local state
    const newMsg = {
      id: `m-${Date.now()}`,
      from: 'you',
      text: replyText.trim(),
      timestamp: 'Baru saja',
    };

    setDms(prev => prev.map(d => {
      if (d.id === activeDM.id) {
        return {
          ...d,
          lastMessage: replyText.trim(),
          unread: false,
          timestamp: 'Baru saja',
          messages: [...d.messages, newMsg],
        };
      }
      return d;
    }));

    setReplyText('');
    setIsSending(false);
    setStatusMessage('Pesan DM berhasil terkirim!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const unreadDMsCount = dms.filter(d => d.unread).length;
  const unrepliedCommentsCount = comments.filter(c => !c.isReplied).length;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Unified Social Inbox & CS Manager</span>
          </div>
          <h2 className="text-xl font-bold text-white">Pantau & Balas Komentar serta DM Instagram</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Semua interaksi audiens dari 4 akun Instagram kamu terpusat di satu layar, lengkap dengan asisten AI pembuat balasan cepat.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setInboxTab('comments')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inboxTab === 'comments'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Komentar Postingan</span>
            {unrepliedCommentsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unrepliedCommentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('dms')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inboxTab === 'dms'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Direct Message (DM)</span>
            {unreadDMsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unreadDMsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">
        {/* Left Column: Message Threads List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {/* Filter & Search Header */}
          <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={inboxTab === 'comments' ? 'Cari komentar / nama / post...' : 'Cari kontak / pesan DM...'}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Account Quick Filter */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Filter className="w-3 h-3 text-indigo-400" />
                <span>Filter Akun:</span>
              </span>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="bg-slate-800 text-slate-200 rounded px-2 py-1 border border-slate-700 text-[10px] focus:outline-none"
              >
                <option value="all">Semua Akun</option>
                {accounts.filter(a => a.platform === 'instagram').map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.handle}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Threads List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1">
            {inboxTab === 'comments' ? (
              filteredComments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">Tidak ada komentar ditemukan.</div>
              ) : (
                filteredComments.map((cm) => {
                  const isSelected = activeComment?.id === cm.id;
                  const acc = accounts.find(a => a.id === cm.accountId);

                  return (
                    <div
                      key={cm.id}
                      onClick={() => {
                        setActiveCommentId(cm.id);
                        setReplyText('');
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border border-pink-500/40 shadow'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={cm.senderAvatar}
                            alt={cm.senderName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-xs text-white leading-tight">{cm.senderName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">@{cm.senderUsername}</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">{cm.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 italic bg-slate-950/40 p-1.5 rounded border border-slate-800">
                        "{cm.commentText}"
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 font-mono text-indigo-400">
                          <InstagramIcon className="w-3 h-3 text-pink-400" />
                          <span>{acc?.handle}</span>
                        </span>
                        {cm.isReplied ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Dibalas
                          </span>
                        ) : (
                          <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-semibold">
                            Butuh Balasan
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // DMs List
              filteredDMs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">Tidak ada pesan DM ditemukan.</div>
              ) : (
                filteredDMs.map((dm) => {
                  const isSelected = activeDM?.id === dm.id;
                  const acc = accounts.find(a => a.id === dm.accountId);

                  return (
                    <div
                      key={dm.id}
                      onClick={() => {
                        setActiveDmId(dm.id);
                        setReplyText('');
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border border-indigo-500/40 shadow'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img
                              src={dm.senderAvatar}
                              alt={dm.senderName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            {dm.unread && (
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -top-0.5 -right-0.5 border-2 border-slate-900 animate-pulse"></span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white leading-tight flex items-center gap-1.5">
                              <span>{dm.senderName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">@{dm.senderUsername}</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">{dm.timestamp}</span>
                      </div>

                      <p className={`text-xs mt-2 line-clamp-1 ${dm.unread ? 'font-semibold text-white' : 'text-slate-400'}`}>
                        {dm.lastMessage}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1 font-mono text-indigo-400">
                          <InstagramIcon className="w-3 h-3 text-pink-400" />
                          <span>{acc?.handle}</span>
                        </span>
                        {dm.unread && (
                          <span className="bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.5 rounded text-[9px]">
                            Pesan Baru
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Right Column: Interaction Thread & Active Reply Box (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {inboxTab === 'comments' ? (
            activeComment ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Active Post & Sender Banner */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeComment.senderAvatar}
                      alt={activeComment.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{activeComment.senderName}</span>
                        <span className="text-slate-400 text-[11px] font-mono">(@{activeComment.senderUsername})</span>
                      </div>
                      <p className="text-[11px] text-indigo-400 mt-0.5">
                        Mengomentari postingan: <strong className="text-slate-200">"{activeComment.postTitle}"</strong> ({activeComment.postFormat})
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                    activeComment.isReplied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {activeComment.isReplied ? '✓ Sudah Dibalas' : '⏳ Menunggu Balasan'}
                  </span>
                </div>

                {/* Conversation History Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* The Original Comment */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">Komentar Asli dari Pengguna:</span>
                      <span className="text-slate-500 font-mono text-[10px]">{activeComment.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      {activeComment.commentText}
                    </p>
                  </div>

                  {/* Previous Replies (if any) */}
                  {activeComment.replies.length > 0 && (
                    <div className="space-y-2 pl-6 border-l-2 border-indigo-500/40">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Riwayat Balasan Kamu:
                      </span>
                      {activeComment.replies.map(rep => (
                        <div key={rep.id} className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl text-xs text-slate-200">
                          <div className="flex items-center justify-between text-[10px] text-indigo-300 mb-1">
                            <span className="font-semibold">{rep.senderName}</span>
                            <span className="font-mono text-slate-400">{rep.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Quick Reply Chips */}
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Draf AI Cepat:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAiDraft('friendly')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Ramah & Santun</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAiDraft('price')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Kirim Info Pricelist / DM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAiDraft('survey')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Ajak Survey / Booking</span>
                  </button>
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handleSendCommentReply} className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder={`Balas sebagai ${activeAccount?.handle || 'Admin'}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-24 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 leading-relaxed"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="absolute right-2.5 bottom-3.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Kirim...' : 'Kirim'}</span>
                    </button>
                  </div>
                  {statusMessage && (
                    <div className="text-emerald-400 text-xs flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{statusMessage}</span>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-xs">
                Pilih salah satu komentar di sebelah kiri untuk melihat dan membalas.
              </div>
            )
          ) : (
            // DMs Chat View
            activeDM ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Active DM Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeDM.senderAvatar}
                      alt={activeDM.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{activeDM.senderName}</span>
                        <span className="text-slate-400 text-[11px] font-mono">(@{activeDM.senderUsername})</span>
                      </div>
                      <p className="text-[11px] text-indigo-400 flex items-center gap-1">
                        <InstagramIcon className="w-3 h-3 text-pink-400" />
                        <span>Chat via {activeAccount?.displayName} ({activeAccount?.handle})</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Bubbles Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeDM.messages.map(m => {
                    const isMe = m.from === 'you';
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/60'
                        }`}>
                          <p>{m.text}</p>
                          <span className={`text-[9px] block text-right mt-1 font-mono ${
                            isMe ? 'text-indigo-200' : 'text-slate-400'
                          }`}>
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI Quick Response Button */}
                <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Asisten CS AI:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAiDraft('dm')}
                    className="px-3 py-1 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Buat Draf Balasan Cepat</span>
                  </button>
                </div>

                {/* DM Input Form */}
                <form onSubmit={handleSendDM} className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
                  <div className="relative">
                    <textarea
                      rows={2}
                      placeholder={`Ketik pesan balasan ke @${activeDM.senderUsername}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-24 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="absolute right-2.5 bottom-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Kirim...' : 'Kirim DM'}</span>
                    </button>
                  </div>
                  {statusMessage && (
                    <div className="text-emerald-400 text-xs flex items-center gap-1 animate-fadeIn">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{statusMessage}</span>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-xs">
                Pilih percakapan DM di sebelah kiri untuk membaca dan membalas.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
