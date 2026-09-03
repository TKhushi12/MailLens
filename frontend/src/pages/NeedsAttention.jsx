import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';

export default function NeedsAttention({
  emails,
  onSelectEmail,
  onToggleAction,
}) {
  const [tab, setTab] = useState('pending'); // 'pending' | 'completed' | 'all'

  const actionEmails = emails.filter((e) => e.actionRequired);
  const pendingEmails = actionEmails.filter((e) => !e.isActionCompleted);
  const completedEmails = actionEmails.filter((e) => e.isActionCompleted);

  const displayedList =
    tab === 'pending'
      ? pendingEmails
      : tab === 'completed'
      ? completedEmails
      : actionEmails;

  const completionRate = actionEmails.length > 0
    ? Math.round((completedEmails.length / actionEmails.length) * 100)
    : 100;

  // Calculate days remaining helper
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { label: 'No explicit date', color: 'text-slate-500 bg-slate-100' };
    const now = new Date();
    const target = new Date(deadline);
    const diffMs = target - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
    } else if (diffDays === 0) {
      return { label: 'Due Today', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else if (diffDays === 1) {
      return { label: 'Due Tomorrow', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else {
      return { label: `Due in ${diffDays} days`, color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Agency Action Items & Deadlines
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Track client deliverables, revisions, and campaign tasks with automatic deadline countdowns.
          </p>
        </div>

        {/* Completion Progress Metric */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4 min-w-[240px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Action Resolution</span>
              <span className="text-blue-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {completedEmails.length} completed • {pendingEmails.length} pending
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'pending', label: `Pending Actions (${pendingEmails.length})` },
          { id: 'completed', label: `Completed (${completedEmails.length})` },
          { id: 'all', label: `All Action Items (${actionEmails.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-slate-400 border border-slate-200">
            <CheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
            <h4 className="text-base font-semibold text-slate-800">
              All caught up!
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              No pending action items in this filter view.
            </p>
          </div>
        ) : (
          displayedList.map((email) => {
            const status = getDeadlineStatus(email.deadline);
            const isCompleted = email.isActionCompleted;

            return (
              <div
                key={email._id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isCompleted
                    ? 'border-slate-200 opacity-75 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Checkbox + Action Task details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleAction(email._id, !isCompleted)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-lg border-2 border-slate-300 hover:border-blue-500 transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={email.priority} size="xs" />
                        <CategoryBadge category={email.category} size="xs" />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <h3
                        className={`text-base font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {email.actionTask || email.subject}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        From: <strong className="text-slate-700">{email.from.name}</strong> ({email.from.email}) • Subject: {email.subject}
                      </p>
                    </div>
                  </div>

                  {/* Right: Deadline Date & View Details button */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
                    {email.deadline && (
                      <div className="text-right text-xs">
                        <span className="text-slate-400 block font-medium">Target Deadline</span>
                        <span className="font-bold text-slate-800">
                          {new Date(email.deadline).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectEmail(email)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      <span>View Email</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
