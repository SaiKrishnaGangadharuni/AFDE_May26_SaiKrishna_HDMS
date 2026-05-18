// Ticket Listing Page per spec section 11.1.
// "Displays all tickets in tabular/card format."
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'
import { StatusBadge, PriorityBadge } from '../components/Badges.jsx'

export default function TicketList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    TicketAPI.list()
      .then(setRows)
      .catch((e) => setErr(e?.response?.data?.detail || 'Failed to load tickets'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">All Tickets</h1>
          <p className="text-sm text-slate-500">{rows.length} ticket{rows.length !== 1 && 's'}</p>
        </div>
        <Link to="/new" className="btn-primary">+ New Ticket</Link>
      </div>

      {err && <div className="card bg-rose-50 text-rose-700 text-sm">{err}</div>}
      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="card text-center text-slate-500">
          No tickets yet. <Link to="/new" className="text-brand-700 hover:underline">Create the first one →</Link>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="text-left">Employee</th>
                <th className="text-left">Department</th>
                <th className="text-left">Category</th>
                <th className="text-left">Priority</th>
                <th className="text-left">Status</th>
                <th className="text-left">Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.ticket_id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">#{t.ticket_id}</td>
                  <td>{t.employee_name}</td>
                  <td className="text-xs">{t.department}</td>
                  <td className="text-xs">{t.issue_category}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/tickets/${t.ticket_id}`} className="text-xs text-brand-700 hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
