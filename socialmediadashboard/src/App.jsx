import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import ContentPlanner from './components/ContentPlanner';
import AnalyticsView from './components/AnalyticsView';
import AIStudio from './components/AIStudio';
import TeamView from './components/TeamView';
import PostDetailModal from './components/PostDetailModal';
import ExportCenterModal from './components/ExportCenterModal';
import SettingsModal from './components/SettingsModal';

import {
  initialProjects,
  initialAccounts,
  initialPosts,
  initialTeamMembers,
  initialHistoricalAnalytics,
} from './data/initialData';

export default function App() {
  // Load state from localStorage or fallback to defaults
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('omnisocial_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('omnisocial_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('omnisocial_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = localStorage.getItem('omnisocial_team');
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [historicalAnalytics] = useState(initialHistoricalAnalytics);

  // Active filters and views
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [currentTab, setCurrentTab] = useState('overview'); // 'overview' | 'planner' | 'analytics' | 'ai-studio' | 'team'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [editingPost, setEditingPost] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // API Key for Gemini
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return localStorage.getItem('omnisocial_gemini_key') || '';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('omnisocial_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('omnisocial_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('omnisocial_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('omnisocial_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Handle post save (create or update)
  const handleSavePost = (savedPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === savedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPost.id ? savedPost : p));
      } else {
        return [savedPost, ...prev];
      }
    });
    setEditingPost(null);
    setIsNewPostModalOpen(false);
  };

  // Handle post delete
  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setEditingPost(null);
  };

  // Add post directly from AI Studio
  const handleApplyFromAI = (aiPost) => {
    const newPost = {
      ...aiPost,
      id: `post-${Date.now()}`,
      assignee: teamMembers[0]?.name || 'Ariel (You)',
      assetUrl: '',
      metrics: null,
    };
    setPosts((prev) => [newPost, ...prev]);
    setCurrentTab('planner');
  };

  // Backup & Restore
  const handleExportBackup = () => {
    const backupData = {
      projects,
      accounts,
      posts,
      teamMembers,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnisocial_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.projects) setProjects(imported.projects);
        if (imported.accounts) setAccounts(imported.accounts);
        if (imported.posts) setPosts(imported.posts);
        if (imported.teamMembers) setTeamMembers(imported.teamMembers);
        alert('Data berhasil dipulihkan!');
      } catch (err) {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaultData = () => {
    if (window.confirm('Apakah kamu yakin ingin mengembalikan seluruh data ke contoh awal?')) {
      localStorage.clear();
      setProjects(initialProjects);
      setAccounts(initialAccounts);
      setPosts(initialPosts);
      setTeamMembers(initialTeamMembers);
      window.location.reload();
    }
  };

  // Filter posts by search query across tabs
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = p.title?.toLowerCase().includes(q);
    const hookMatch = p.hook?.toLowerCase().includes(q);
    const captionMatch = p.caption?.toLowerCase().includes(q);
    const tagMatch = p.hashtags?.some((t) => t.toLowerCase().includes(q));
    return titleMatch || hookMatch || captionMatch || tagMatch;
  });

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'export') {
            setIsExportModalOpen(true);
          } else if (tab === 'settings') {
            setIsSettingsModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        projects={projects}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        onOpenNewPost={() => setIsNewPostModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          projects={projects}
          selectedProjectId={selectedProjectId}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewPost={() => setIsNewPostModalOpen(true)}
          onOpenAIStudio={() => setCurrentTab('ai-studio')}
          onOpenExport={() => setIsExportModalOpen(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {currentTab === 'overview' && (
            <Overview
              projects={projects}
              accounts={accounts}
              posts={filteredPosts}
              selectedProjectId={selectedProjectId}
              selectedAccountId={selectedAccountId}
              onOpenPost={(post) => setEditingPost(post)}
              onOpenNewPost={() => setIsNewPostModalOpen(true)}
              onOpenAIStudio={() => setCurrentTab('ai-studio')}
            />
          )}

          {currentTab === 'planner' && (
            <ContentPlanner
              projects={projects}
              accounts={accounts}
              posts={filteredPosts}
              setPosts={setPosts}
              selectedProjectId={selectedProjectId}
              selectedAccountId={selectedAccountId}
              onOpenPost={(post) => setEditingPost(post)}
              onOpenNewPost={() => setIsNewPostModalOpen(true)}
              onOpenAIStudio={() => setCurrentTab('ai-studio')}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              projects={projects}
              accounts={accounts}
              posts={filteredPosts}
              historicalAnalytics={historicalAnalytics}
              selectedProjectId={selectedProjectId}
              selectedAccountId={selectedAccountId}
              onOpenExport={() => setIsExportModalOpen(true)}
            />
          )}

          {currentTab === 'ai-studio' && (
            <AIStudio
              projects={projects}
              accounts={accounts}
              onApplyToPlanner={handleApplyFromAI}
              geminiApiKey={geminiApiKey}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
            />
          )}

          {currentTab === 'team' && (
            <TeamView
              teamMembers={teamMembers}
              setTeamMembers={setTeamMembers}
              posts={posts}
            />
          )}
        </main>
      </div>

      {/* Post Detail / Create Modal */}
      {(editingPost || isNewPostModalOpen) && (
        <PostDetailModal
          post={editingPost}
          isOpen={true}
          onClose={() => {
            setEditingPost(null);
            setIsNewPostModalOpen(false);
          }}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
          projects={projects}
          accounts={accounts}
          teamMembers={teamMembers}
        />
      )}

      {/* Export Center Modal */}
      <ExportCenterModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projects={projects}
        accounts={accounts}
        posts={filteredPosts}
      />

      {/* Settings & Free Cloud Sync Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        projects={projects}
        setProjects={setProjects}
        accounts={accounts}
        setAccounts={setAccounts}
        geminiApiKey={geminiApiKey}
        setGeminiApiKey={setGeminiApiKey}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onResetDefaultData={handleResetDefaultData}
      />
    </div>
  );
}
