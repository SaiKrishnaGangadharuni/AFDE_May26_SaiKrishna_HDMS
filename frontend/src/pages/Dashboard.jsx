// Dashboard Page per spec section 11.1:
//   Total tickets · Ticket summary · Recent tickets
// Note: Section 5 excludes "Analytics dashboards" — we keep it to simple counts only.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'
import { StatusBadge, PriorityBadge } from '../components/Badges.jsx'

function StatCard({ label, value, accent }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-3xl font-semibold mt-1 ${accent || 'text-slate-800'}`}>{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    TicketAPI.summary().then(setData)
       .catch((e) => setErr(e?.response?.data?.detail || e.message || 'Failed to load'))
  }, [])

  if (err) return <div className="card bg-rose-50 text-rose-700">{err}</div>
  if (!data) return <div className="text-sm text-slate-500">Loading dashboard…</div>

  const openCount = (data.by_status['Open'] || 0) + (data.by_status['In Progress'] || 0)
  const resolved = (data.by_status['Resolved'] || 0) + (data.by_status['Closed'] || 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Helpdesk Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of internal IT support tickets.</p>
        </div>
        <Link to="/new" className="btn-primary">+ Create Ticket</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={data.total} />
        <StatCard label="Open + In Progress" value={openCount} accent="text-amber-600" />
        <StatCard label="Resolved / Closed" value={resolved} accent="text-emerald-600" />
        <StatCard label="Critical Priority" value={data.by_priority['Critical'] || 0} accent="text-rose-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">By Status</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(data.by_status).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b last:border-0 py-1">
                <StatusBadge status={k} />
                <span className="font-mono">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">By Priority</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(data.by_priority).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b last:border-0 py-1">
                <PriorityBadge priority={k} />
                <span className="font-mono">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Recent Tickets</h3>
          <Link to="/tickets" className="text-sm text-brand-700 hover:underline">View all →</Link>
        </div>
        {data.recent.length === 0 ? (
          <div className="text-sm text-slate-500">No tickets yet.</div>
        ) : (
          <ul className="text-sm space-y-2">
            {data.recent.map((t) => (
              <li key={t.ticket_id} className="border-b last:border-0 py-2 flex flex-wrap items-center justify-between gap-2">
                <Link to={`/tickets/${t.ticket_id}`} className="text-brand-700 hover:underline font-mono text-xs">
                  #{t.ticket_id}
                </Link>
                <span className="flex-1 min-w-0 truncate" title={t.description}>
                  <span className="font-medium">{t.employee_name}</span>
                  <span className="text-slate-500"> · {t.issue_category}</span>
                </span>
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
