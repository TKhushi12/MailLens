import React, { useState } from 'react';
import {
  Inbox as InboxIcon,
  Filter,
  CheckCircle2,
  Clock,
  Flame,
  Mail,
  MailCheck,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';

export default function Inbox({
  emails,
  selectedCategory,
  setSelectedCategory,
  onSelectEmail,
  onToggleRead,
  onToggleAction,
  onDeleteEmail,
}) {
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [onlyActionRequired, setOnlyActionRequired] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const categories = [
    'All',
    'Client',
    'Lead',
    'Marketing',
    'Finance',
    'Influencer',
    'Internal',
    'Other',
  ];

  // Filtering
  const filteredEmails = emails.filter((email) => {
    if (selectedCategory !== 'All' && email.category !== selectedCategory) {
      return false;
    }
    if (priorityFilter !== 'All' && email.priority !== priorityFilter) {
      return false;
    }
    if (onlyActionRequired && !email.actionRequired) {
      return false;
    }
    if (onlyUnread && email.isRead) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        
        {/* Top: Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'All' ? 'All Messages' : cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">🔴 Urgent</option>
                <option value="Important">🟠 Important</option>
                <option value="Normal">🟡 Normal</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            {/* Only Action Required Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyActionRequired}
                onChange={(e) => setOnlyActionRequired(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Needs Action</span>
            </label>

            {/* Unread Only Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0"
              />
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Unread Only</span>
            </label>
          </div>

          <div className="text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{filteredEmails.length}</strong> of {emails.length} emails
          </div>
        </div>

      </div>

      {/* Email List View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredEmails.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <InboxIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <h4 className="text-base font-semibold text-slate-700">No emails matched your filters</h4>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your category or priority selection, or click "Reset Demo Data".
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isUnread = !email.isRead;
            const timeStr = new Date(email.receivedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateStr = new Date(email.receivedAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={email._id}
                onClick={() => onSelectEmail(email)}
                className={`p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors group ${
                  isUnread ? 'bg-blue-50/20 font-medium' : 'bg-white'
                }`}
              >
                {/* Unread dot / Status Indicator */}
                <div className="pt-1 shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isUnread ? 'bg-blue-600 shadow-sm shadow-blue-500/50' : 'bg-transparent border border-slate-300'
                    }`}
                  />
                </div>

                {/* Sender Avatar */}
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                  {email.from.name ? email.from.name[0].toUpperCase() : 'U'}
                </div>

                {/* Center Content: Sender, Subject, AI Summary snippet */}
                <div className="flex-1 min-w-0 space-y-1">
                  
                  {/* Line 1: Sender Name + Badges + Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                        {email.from.name}
                      </span>
                      <CategoryBadge category={email.category} size="xs" />
                      <PriorityBadge priority={email.priority} size="xs" />
                      {email.isLead && (
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-rose-500" />
                          Lead
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 shrink-0 flex items-center gap-2">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </div>
                  </div>

                  {/* Line 2: Subject */}
                  <h3 className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'} truncate`}>
                    {email.subject}
                  </h3>

                  {/* Line 3: Email Summary Snippet */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <p className="line-clamp-1 text-slate-500">
                      {email.summary || email.body.substring(0, 100)}
                    </p>
                  </div>

                  {/* Line 4 (Optional): Action required banner */}
                  {email.actionRequired && (
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {email.actionTask || 'Action Needed'}
                      </span>
                      {email.deadline && (
                        <span className="text-rose-600 font-semibold">
                          Deadline: {new Date(email.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      {email.isActionCompleted && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                  )}

                </div>

                {/* Quick Row Hover Actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRead(email._id, !email.isRead);
                    }}
                    title={isUnread ? 'Mark as read' : 'Mark as unread'}
                    className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-md transition-colors"
                  >
                    <MailCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEmail(email._id);
                    }}
                    title="Delete"
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
