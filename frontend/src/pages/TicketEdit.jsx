// Update Ticket per spec section 6.3:
// "Update ticket status / Modify issue details / Add resolution notes"
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'

export default function TicketEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState(null)
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [] })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([TicketAPI.get(id), TicketAPI.lookups()])
      .then(([t, lk]) => {
        setForm({
          employee_name: t.employee_name,
          department: t.department,
          issue_category: t.issue_category,
          description: t.description,
          priority: t.priority,
          status: t.status,
          resolution_notes: t.resolution_notes || '',
        })
        setLookups(lk)
      })
      .catch((e) => setErr(e?.response?.data?.detail || 'Failed to load'))
  }, [id])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await TicketAPI.update(id, {
        ...form,
        resolution_notes: form.resolution_notes || null,
      })
      nav(`/tickets/${id}`)
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  if (err && !form) return <div className="card bg-rose-50 text-rose-700">{err}</div>
  if (!form) return <div className="text-sm text-slate-500">Loading…</div>

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Edit Ticket #{id}</h1>
      <form onSubmit={submit} className="card space-y-4">
        {err && <div className="text-sm bg-rose-50 text-rose-700 px-3 py-2 rounded">{err}</div>}

        <div>
          <label className="label">Employee Name</label>
          <input className="input" value={form.employee_name} onChange={set('employee_name')} required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="label">Department</label>
          <input className="input" value={form.department} onChange={set('department')} required maxLength={120} />
        </div>
        <div>
          <label className="label">Issue Category</label>
          <select className="input" value={form.issue_category} onChange={set('issue_category')} required>
            {lookups.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={5} value={form.description} onChange={set('description')} required minLength={3} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={set('priority')}>
              {lookups.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={set('status')}>
              {lookups.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Resolution Notes</label>
          <textarea className="input" rows={4} value={form.resolution_notes} onChange={set('resolution_notes')}
                    placeholder="Add notes when the ticket is resolved." />
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" className="btn-secondary" onClick={() => nav(-1)} disabled={busy}>Cancel</button>
          <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
