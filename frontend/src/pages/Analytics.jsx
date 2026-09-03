import React from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
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
  Legend,
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

const PRIORITY_COLORS = {
  Urgent: '#ef4444',
  Important: '#f59e0b',
  Normal: '#3b82f6',
  Low: '#94a3b8',
};

export default function Analytics({ metrics }) {
  const summary = metrics?.summary || {};

  const categoryData = (metrics?.categoryBreakdown || []).map((item) => ({
    name: item.category,
    value: item.count,
    fill: CATEGORY_COLORS[item.category] || '#64748b',
  }));

  const priorityData = (metrics?.priorityBreakdown || []).map((item) => ({
    name: item.priority,
    value: item.count,
    fill: PRIORITY_COLORS[item.priority] || '#3b82f6',
  }));

  const total = summary.totalEmails || 1;
  const estimatedHoursSaved = ((summary.totalEmails || 0) * 4) / 60; // ~4 minutes per email reading/tagging

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Agency Email Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Email volume breakdown, category distribution, and priority ratios.
          </p>
        </div>

        {/* Agency ROI pill */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Estimated Manual Time Saved
            </span>
            <span className="text-base font-extrabold text-emerald-900">
              ~{estimatedHoursSaved.toFixed(1)} Hours
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Category Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Email Distribution by Category
            </h3>
            <p className="text-xs text-slate-400">
              Volume split across clients, prospective leads, platforms, and finances
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Urgency & Priority Classification
            </h3>
            <p className="text-xs text-slate-400">
              Proportion of urgent client escalations vs normal correspondence
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Agency Health Metrics Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">
          Operational Metrics Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold block">Total Ingested</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{summary.totalEmails || 0}</span>
            <span className="text-[11px] text-slate-400">Synchronized emails</span>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <span className="text-xs text-rose-700 font-semibold block">Critical Urgent Ratio</span>
            <span className="text-2xl font-bold text-rose-900 mt-1 block">
              {Math.round(((summary.urgentEmails || 0) / total) * 100)}%
            </span>
            <span className="text-[11px] text-rose-600">{summary.urgentEmails || 0} urgent tickets</span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="text-xs text-amber-700 font-semibold block">Action Pending</span>
            <span className="text-2xl font-bold text-amber-900 mt-1 block">
              {summary.pendingActionCount || 0}
            </span>
            <span className="text-[11px] text-amber-600">Requires follow-through</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-xs text-emerald-700 font-semibold block">Lead Capture Rate</span>
            <span className="text-2xl font-bold text-emerald-900 mt-1 block">
              {Math.round(((summary.totalLeads || 0) / total) * 100)}%
            </span>
            <span className="text-[11px] text-emerald-600">{summary.totalLeads || 0} potential retainers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
