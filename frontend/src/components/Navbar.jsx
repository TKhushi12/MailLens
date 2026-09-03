import React from 'react';
import {
  Search,
  Plus,
  RotateCcw,
  Mail,
  CheckCircle,
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onSimulateEmail,
  onResetSeed,
  isSimulating,
  authStatus,
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search emails by sender, subject, or task..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Action Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Add Test Email Button */}
        <button
          onClick={onSimulateEmail}
          disabled={isSimulating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          title="Simulate a new incoming agency email"
        >
          <Plus className="w-4 h-4" />
          <span>{isSimulating ? 'Processing...' : 'Simulate New Email'}</span>
        </button>

        {/* Re-seed demo data */}
        <button
          onClick={onResetSeed}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
          title="Reset inbox to default demo emails"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Emails</span>
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Mailbox status pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              authStatus?.connectedUser ? 'bg-emerald-500' : 'bg-emerald-500'
            }`}
          />
          <span className="text-slate-600 font-medium">
            {authStatus?.connectedUser
              ? `Connected: ${authStatus.connectedUser.email}`
              : 'Mailbox: Active'}
          </span>
        </div>
      </div>
    </header>
  );
}
