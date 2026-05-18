// Simple status / priority badges.
const STATUS_COLORS = {
  'Open':        'bg-blue-100 text-blue-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  'Resolved':    'bg-emerald-100 text-emerald-800',
  'Closed':      'bg-slate-200 text-slate-700',
}

const PRIORITY_COLORS = {
  'Low':      'bg-slate-100 text-slate-700',
  'Medium':   'bg-sky-100 text-sky-800',
  'High':     'bg-amber-100 text-amber-800',
  'Critical': 'bg-rose-100 text-rose-800',
}

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
}

export function PriorityBadge({ priority }) {
  return <span className={`badge ${PRIORITY_COLORS[priority] || 'bg-slate-100 text-slate-700'}`}>{priority}</span>
}
