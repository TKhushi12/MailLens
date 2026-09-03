import React from 'react';
import {
  Users,
  Flame,
  BarChart3,
  CreditCard,
  Sparkles,
  Building2,
  Inbox,
} from 'lucide-react';

const categoryConfig = {
  Client: {
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Users,
    label: 'Client',
  },
  Lead: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Flame,
    label: 'Lead',
  },
  Marketing: {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: BarChart3,
    label: 'Marketing Platform',
  },
  Finance: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CreditCard,
    label: 'Finance',
  },
  Influencer: {
    bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    icon: Sparkles,
    label: 'Influencer',
  },
  Internal: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Building2,
    label: 'Internal Team',
  },
  Other: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Inbox,
    label: 'Other',
  },
};

export default function CategoryBadge({ category = 'Other', showIcon = true, size = 'sm' }) {
  const config = categoryConfig[category] || categoryConfig.Other;
  const Icon = config.icon;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
}
