import React from 'react';

const priorityConfig = {
  Urgent: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: '⚡',
    label: 'Urgent',
  },
  Important: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: '🔥',
    label: 'Important',
  },
  Normal: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: '●',
    label: 'Normal',
  },
  Low: {
    bg: 'bg-slate-50 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    icon: '○',
    label: 'Low',
  },
};

export default function PriorityBadge({ priority = 'Normal', showDot = true, size = 'sm' }) {
  const config = priorityConfig[priority] || priorityConfig.Normal;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${sizeClasses}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${config.dot} ${
            priority === 'Urgent' ? 'animate-ping' : ''
          }`}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
