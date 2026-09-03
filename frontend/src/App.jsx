import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import NeedsAttention from './pages/NeedsAttention';
import LeadsCRM from './pages/LeadsCRM';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import EmailDetailModal from './components/EmailDetailModal';
import ReplyComposerModal from './components/ReplyComposerModal';
import { emailAPI, analyticsAPI, authAPI } from './services/api';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [emails, setEmails] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  // Modals state
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyComposer, setReplyComposer] = useState(null); // { email, tone, text }

  const loadData = async () => {
    try {
      const [emailsRes, metricsRes, authRes] = await Promise.all([
        emailAPI.getEmails({ q: searchTerm }),
        analyticsAPI.getMetrics(),
        authAPI.getStatus(),
      ]);

      if (emailsRes.success) setEmails(emailsRes.data);
      if (metricsRes.success) setMetrics(metricsRes.data);
      if (authRes.success) setAuthStatus(authRes);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      emailAPI.getEmails({ q: searchTerm }).then((res) => {
        if (res.success) setEmails(res.data);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      try {
        await emailAPI.toggleRead(email._id, true);
        setEmails((prev) =>
          prev.map((e) => (e._id === email._id ? { ...e, isRead: true } : e))
        );
        analyticsAPI.getMetrics().then((res) => {
          if (res.success) setMetrics(res.data);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleRead = async (id, isRead) => {
    try {
      const res = await emailAPI.toggleRead(id, isRead);
      if (res.success) {
        setEmails((prev) =>
          prev.map((e) => (e._id === id ? { ...e, isRead } : e))
        );
        if (selectedEmail && selectedEmail._id === id) {
          setSelectedEmail((prev) => ({ ...prev, isRead }));
        }
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAction = async (id, isActionCompleted) => {
    try {
      const res = await emailAPI.toggleActionCompleted(id, isActionCompleted);
      if (res.success) {
        setEmails((prev) =>
          prev.map((e) => (e._id === id ? { ...e, isActionCompleted } : e))
        );
        if (selectedEmail && selectedEmail._id === id) {
          setSelectedEmail((prev) => ({ ...prev, isActionCompleted }));
        }
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReprocessAI = async (id) => {
    try {
      const res = await emailAPI.reprocessAI(id);
      if (res.success) {
        setSelectedEmail(res.data);
        setEmails((prev) =>
          prev.map((e) => (e._id === id ? res.data : e))
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmail = async (id) => {
    if (!confirm('Are you sure you want to delete this email?')) return;
    try {
      await emailAPI.deleteEmail(id);
      setEmails((prev) => prev.filter((e) => e._id !== id));
      if (selectedEmail && selectedEmail._id === id) {
        setSelectedEmail(null);
      }
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateEmail = async () => {
    setIsSimulating(true);
    try {
      const res = await emailAPI.simulateIncoming();
      if (res.success) {
        await loadData();
        setSelectedEmail(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetSeed = async () => {
    try {
      setIsLoading(true);
      await emailAPI.seedDemoEmails(true);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReply = (email, tone = 'professional', text = '') => {
    setReplyComposer({ email, tone, text });
  };

  const handleReplySent = (emailId) => {
    setEmails((prev) =>
      prev.map((e) =>
        e._id === emailId
          ? { ...e, isRead: true, isActionCompleted: e.actionRequired ? true : e.isActionCompleted }
          : e
      )
    );
    loadData();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics?.summary}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSimulateEmail={handleSimulateEmail}
          onResetSeed={handleResetSeed}
          isSimulating={isSimulating}
          authStatus={authStatus}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Connecting to SmartMail AI Pipeline...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  metrics={metrics}
                  emails={emails}
                  onSelectEmail={handleSelectEmail}
                  onToggleAction={handleToggleAction}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'inbox' && (
                <Inbox
                  emails={emails}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onSelectEmail={handleSelectEmail}
                  onToggleRead={handleToggleRead}
                  onToggleAction={handleToggleAction}
                  onDeleteEmail={handleDeleteEmail}
                />
              )}

              {activeTab === 'needs-attention' && (
                <NeedsAttention
                  emails={emails}
                  onSelectEmail={handleSelectEmail}
                  onToggleAction={handleToggleAction}
                />
              )}

              {activeTab === 'leads' && (
                <LeadsCRM
                  emails={emails}
                  onSelectEmail={handleSelectEmail}
                  onOpenReply={handleOpenReply}
                />
              )}

              {activeTab === 'analytics' && (
                <Analytics metrics={metrics} />
              )}

              {activeTab === 'settings' && (
                <Settings
                  authStatus={authStatus}
                  onResetSeed={handleResetSeed}
                  onSimulateEmail={handleSimulateEmail}
                  isSimulating={isSimulating}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onToggleAction={handleToggleAction}
          onToggleRead={handleToggleRead}
          onReprocessAI={handleReprocessAI}
          onOpenReply={(email, tone, text) => {
            setSelectedEmail(null);
            handleOpenReply(email, tone, text);
          }}
          onDelete={handleDeleteEmail}
        />
      )}

      {/* Reply Composer Modal */}
      {replyComposer && (
        <ReplyComposerModal
          email={replyComposer.email}
          initialTone={replyComposer.tone}
          initialText={replyComposer.text}
          onClose={() => setReplyComposer(null)}
          onReplySent={handleReplySent}
        />
      )}
    </div>
  );
}
