// Ticket Details Page per spec section 11.1.
// "Displays complete information about a ticket."
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'
import { StatusBadge, PriorityBadge } from '../components/Badges.jsx'

export default function TicketDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [t, setT] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    TicketAPI.get(id).then(setT).catch((e) => setErr(e?.response?.data?.detail || 'Not found'))
  }, [id])

  async function onDelete() {
    if (!confirm('Delete this ticket? This cannot be undone.')) return
    setBusy(true)
    try {
      await TicketAPI.remove(t.ticket_id)
      nav('/tickets')
    } catch (e) {
      alert(e?.response?.data?.detail || 'Delete failed')
      setBusy(false)
    }
  }

  if (err) return (
    <div className="card bg-rose-50 text-rose-700">
      {err} · <Link to="/tickets" className="underline">back to list</Link>
    </div>
  )
  if (!t) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link to="/tickets" className="text-sm text-brand-700 hover:underline">← Back to list</Link>

      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-mono text-slate-500">Ticket #{t.ticket_id}</div>
            <h1 className="text-xl font-semibold text-slate-800 mt-1">{t.issue_category}</h1>
            <div className="text-sm text-slate-500 mt-1">
              by {t.employee_name} · {t.department}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-slate-500">Description</div>
          <p className="text-sm text-slate-800 whitespace-pre-wrap mt-1">{t.description}</p>
        </div>

        {t.resolution_notes && (
          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
            <div className="text-xs uppercase text-emerald-700 font-semibold">Resolution Notes</div>
            <p className="text-sm text-emerald-900 whitespace-pre-wrap mt-1">{t.resolution_notes}</p>
          </div>
        )}

        <div className="text-xs text-slate-500 pt-2 border-t">
          Created on {new Date(t.created_at).toLocaleString()}
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/tickets/${t.ticket_id}/edit`} className="btn-secondary">Edit</Link>
          <button onClick={onDelete} disabled={busy} className="btn-danger">
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
