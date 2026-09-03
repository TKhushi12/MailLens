import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  Flame,
  BarChart3,
  Settings,
  Users,
  CreditCard,
  Building2,
  Mail,
  Send,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  metrics,
  selectedCategory,
  setSelectedCategory,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'inbox',
      label: 'Agency Inbox',
      icon: Inbox,
      badge: metrics?.unreadEmails,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'needs-attention',
      label: 'Needs Attention',
      icon: Clock,
      badge: metrics?.pendingActionCount,
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      id: 'leads',
      label: 'Leads CRM',
      icon: Flame,
      badge: metrics?.totalLeads,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Settings & Integrations',
      icon: Settings,
    },
  ];

  const categoryFilters = [
    { id: 'All', label: 'All Categories', icon: Mail },
    { id: 'Client', label: 'Clients', icon: Users, color: 'text-indigo-600' },
    { id: 'Lead', label: 'Leads', icon: Flame, color: 'text-rose-600' },
    { id: 'Marketing', label: 'Marketing Platforms', icon: BarChart3, color: 'text-sky-600' },
    { id: 'Finance', label: 'Finance & Invoices', icon: CreditCard, color: 'text-emerald-600' },
    { id: 'Influencer', label: 'Influencers', icon: Send, color: 'text-purple-600' },
    { id: 'Internal', label: 'Internal Operations', icon: Building2, color: 'text-amber-600' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-base tracking-tight">MailLens</h1>
          <p className="text-xs text-slate-500 font-medium">Agency Email Manager</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'inbox') setSelectedCategory('All');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Quick Filter */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Filter by Category
          </p>
          {categoryFilters.map((cat) => {
            const Icon = cat.icon;
            const isCatActive = activeTab === 'inbox' && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab('inbox');
                  setSelectedCategory(cat.id);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCatActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${cat.color || 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agency Account Info Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
            KA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Khushi Agency</p>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected & Synced
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
