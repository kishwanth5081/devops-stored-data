import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pocs from './pages/Pocs';
import Tasks from './pages/Tasks';
import Files from './pages/Files';
import Notes from './pages/Notes';
import Audit from './pages/Audit';
import Deployment from './pages/Deployment';
import PdfViewer from './pages/PdfViewer';
import Settings from './pages/Settings';
import Commands from './pages/Commands';
import Technologies from './pages/Technologies';
import Profile from './pages/Profile';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    try {
      if (window.location.hash) {
        const hashTab = window.location.hash.replace('#', '').trim();
        if (hashTab) return hashTab;
      }
      const saved = localStorage.getItem('devops_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultTab) return parsed.defaultTab;
      }
    } catch {}
    return 'dashboard';
  });

  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Navigate to tab and update browser history
  const handleSetActiveTab = (newTab) => {
    if (!newTab) return;
    if (newTab === activeTabRef.current) return;

    window.history.pushState({ tab: newTab }, '', `#${newTab}`);
    setActiveTab(newTab);
  };

  // Intercept Browser Back / Forward navigation
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initialize initial browser state
    const currentTab = activeTabRef.current || 'dashboard';
    if (currentTab !== 'dashboard') {
      window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
      window.history.pushState({ tab: currentTab }, '', `#${currentTab}`);
    } else {
      window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
    }

    const handlePopState = (event) => {
      const prevTab = activeTabRef.current;

      // When navigating back from ANY tab/page, redirect to dashboard and keep the app open
      if (prevTab !== 'dashboard') {
        window.history.replaceState({ tab: 'dashboard' }, '', '#dashboard');
        setActiveTab('dashboard');
      } else {
        // If already on dashboard, trap the back button so the application doesn't exit/close
        window.history.pushState({ tab: 'dashboard' }, '', '#dashboard');
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Initializing DevOps Stored Data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onNewPoc={() => handleSetActiveTab('pocs')}
        onNewTask={() => handleSetActiveTab('tasks')}
        onUploadFile={() => handleSetActiveTab('files')}
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden min-h-0">
        <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto h-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={handleSetActiveTab}
              onNewPoc={() => handleSetActiveTab('pocs')}
              onNewTask={() => handleSetActiveTab('tasks')}
              onUploadFile={() => handleSetActiveTab('files')}
            />
          )}

          {activeTab === 'pocs' && (
            <Pocs
              onNewTask={() => handleSetActiveTab('tasks')}
              onUploadFile={() => handleSetActiveTab('files')}
            />
          )}

          {activeTab === 'pdfs' && <PdfViewer />}

          {activeTab === 'tasks' && <Tasks />}
          {activeTab === 'commands' && <Commands setActiveTab={handleSetActiveTab} />}
          {activeTab === 'technologies' && <Technologies setActiveTab={handleSetActiveTab} />}
          {activeTab === 'files' && <Files />}
          {activeTab === 'notes' && <Notes />}
          {activeTab === 'audit' && <Audit />}
          {activeTab === 'deployment' && <Deployment />}
          {activeTab === 'settings' && <Settings onNavigateAudit={() => handleSetActiveTab('audit')} />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
