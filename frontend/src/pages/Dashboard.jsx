import React from 'react';
import {
  Mail,
  AlertTriangle,
  Clock,
  Flame,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const CATEGORY_COLORS = {
  Client: '#6366f1',
  Lead: '#f43f5e',
  Marketing: '#06b6d4',
  Finance: '#10b981',
  Influencer: '#d946ef',
  Internal: '#f59e0b',
  Other: '#64748b',
};

export default function Dashboard({
  metrics,
  emails,
  onSelectEmail,
  onToggleAction,
  setActiveTab,
}) {
  const summary = metrics?.summary || {};
  const categoryData = (metrics?.categoryBreakdown || []).map((item) => ({
    name: item.category,
    count: item.count,
    fill: CATEGORY_COLORS[item.category] || '#64748b',
  }));

  const priorityData = (metrics?.priorityBreakdown || []).map((item) => ({
    name: item.priority,
    count: item.count,
  }));

  const urgentEmails = emails.filter((e) => e.priority === 'Urgent').slice(0, 4);
  const pendingActions = emails
    .filter((e) => e.actionRequired && !e.isActionCompleted)
    .slice(0, 4);
  const leads = emails.filter((e) => e.isLead).slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome & Agency Headline */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Marketing Agency Email & Task Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Automated email triage, client request tracking, and deadline management.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Mailbox Status: Active</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Inbound Emails"
          value={summary.totalEmails}
          subtitle={`${summary.unreadEmails || 0} unread in inbox`}
          icon={Mail}
          color="blue"
          onClick={() => setActiveTab('inbox')}
        />
        <StatCard
          title="Urgent Incidents"
          value={summary.urgentEmails}
          subtitle="Campaign crises / halts"
          icon={AlertTriangle}
          color="rose"
          onClick={() => setActiveTab('inbox')}
        />
        <StatCard
          title="Action Items Pending"
          value={summary.pendingActionCount}
          subtitle="Deadlines requiring delivery"
          icon={Clock}
          color="amber"
          onClick={() => setActiveTab('needs-attention')}
        />
        <StatCard
          title="New Business Leads"
          value={summary.totalLeads}
          subtitle={`${summary.highIntentLeads || 0} high intent inquiries`}
          icon={Flame}
          color="emerald"
          onClick={() => setActiveTab('leads')}
        />
      </div>

      {/* Main Grid: Urgent Attention & Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Urgent Alerts & Tasks Requiring Action */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Incidents Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h3 className="text-base font-bold text-slate-800">
                  Critical Incidents & Escalations
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('inbox')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                No urgent incidents! All agency campaigns are running smoothly.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {urgentEmails.map((email) => (
                  <div
                    key={email._id}
                    onClick={() => onSelectEmail(email)}
                    className="py-3.5 hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={email.priority} size="xs" />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {email.from.name}
                        </span>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-xs text-slate-400">
                          {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {email.summary}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 shrink-0 mt-1">
                      Review <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Deadlines & Tasks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Upcoming Agency Deadlines
              </h3>
              <button
                onClick={() => setActiveTab('needs-attention')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Manage all ({pendingActions.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingActions.map((email) => (
                <div
                  key={email._id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-slate-100/80 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleAction(email._id, !email.isActionCompleted)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Mark task completed"
                    >
                      <div className="w-4 h-4 rounded border-2 border-slate-300 hover:border-emerald-500" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {email.actionTask || email.subject}
                      </p>
                      <p className="text-xs text-slate-500">
                        Client: <strong className="text-slate-700">{email.from.name}</strong> • Subject: {email.subject}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    {email.deadline && (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        Due: {new Date(email.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution Chart & Top Leads */}
        <div className="space-y-6">
          
          {/* Email Category Distribution Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              AI classified breakdown across agency operations
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list with counts */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.fill }} />
                    {cat.name}
                  </span>
                  <span className="font-bold text-slate-800">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Leads Quick Widget */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Hot Leads Pipeline
              </h3>
              <button
                onClick={() => setActiveTab('leads')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                View Pipeline
              </button>
            </div>

            <div className="space-y-3">
              {leads.map((email) => (
                <div
                  key={email._id}
                  onClick={() => onSelectEmail(email)}
                  className="p-3 bg-gradient-to-r from-rose-50/50 to-orange-50/40 border border-rose-100 rounded-xl cursor-pointer hover:border-rose-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {email.from.name}
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                      {email.leadDetails?.intentLevel || 'High'} Intent
                    </span>
                  </div>
                  <p className="text-xs font-medium text-rose-900 mt-1">
                    {email.leadDetails?.serviceInterest || 'Marketing Retainer'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Budget: <strong className="text-slate-800">{email.leadDetails?.estimatedBudget || 'Inquire'}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
