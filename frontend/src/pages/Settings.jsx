import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Key,
  Database,
} from 'lucide-react';
import { authAPI } from '../services/api';

export default function Settings({
  authStatus,
  onResetSeed,
  onSimulateEmail,
  isSimulating,
}) {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const handleConnectGoogle = async () => {
    try {
      const res = await authAPI.getGoogleAuthUrl();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        alert(
          'Google OAuth is not configured yet in backend/.env.\n\nTo connect a real Gmail account:\n1. Open backend/.env\n2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\n\nMeanwhile, you can use the built-in "Simulate Inbound Email" demo mode seamlessly!'
        );
      }
    } catch (err) {
      alert('Failed to initiate Google OAuth: ' + err.message);
    }
  };

  const handleSyncGmail = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await authAPI.triggerSync();
      setSyncMessage({ type: 'success', text: res.message });
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: err.response?.data?.message || 'Sync failed. Connect Gmail via OAuth first.',
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Integrations & System Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure Google Workspace Gmail connection, Gemini AI keys, and demo simulations.
            </p>
          </div>
        </div>
      </div>

      {/* Integration 1: Gmail & Google OAuth */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Google Workspace & Gmail API
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sync live emails from the marketing agency's official Google inbox using OAuth 2.0.
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              authStatus?.connectedUser
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {authStatus?.connectedUser ? 'Connected' : 'Demo Sandbox Active'}
          </span>
        </div>

        {authStatus?.connectedUser ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {authStatus.connectedUser.picture ? (
                <img
                  src={authStatus.connectedUser.picture}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {authStatus.connectedUser.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {authStatus.connectedUser.name}
                </p>
                <p className="text-xs text-slate-500">{authStatus.connectedUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleSyncGmail}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing Gmail...' : 'Sync Gmail Now'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              To connect a live Gmail account, create OAuth 2.0 Client Credentials in{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5"
              >
                Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and set them in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">backend/.env</code>.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleConnectGoogle}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Mail className="w-4 h-4 text-rose-400" />
                <span>Connect with Google OAuth</span>
              </button>
              <span className="text-xs text-slate-400 font-medium">
                No OAuth credentials? You can demo every feature right now using the buttons below!
              </span>
            </div>
          </div>
        )}

        {syncMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              syncMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{syncMessage.text}</span>
          </div>
        )}
      </div>

      {/* Integration 2: AI Engine Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Email Classification Model (Google Gemini)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Categorization, priority scoring, and reply suggestion pipeline.
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              authStatus?.geminiConfigured
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {authStatus?.geminiConfigured
              ? 'Gemini 1.5 Flash Active'
              : 'Classification Pipeline Active'}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            MailLens supports both <strong>Live Gemini 1.5 Flash</strong> and an <strong>Internal Heuristic NLP Fallback</strong>.
          </p>
          <p>
            To use live Gemini API, simply generate a free API key at{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-semibold underline inline-flex items-center gap-0.5"
            >
              Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>{' '}
            and place it into <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">GEMINI_API_KEY</code> in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">backend/.env</code>.
          </p>
        </div>
      </div>

      {/* Demo Controls Box */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Demo & Testing Controls
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Use these controls during testing or presentation to trigger incoming agency emails on demand:
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onSimulateEmail}
            disabled={isSimulating}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Processing...' : 'Simulate New Email'}</span>
          </button>

          <button
            onClick={onResetSeed}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Sample Emails</span>
          </button>
        </div>
      </div>
    </div>
  );
}
