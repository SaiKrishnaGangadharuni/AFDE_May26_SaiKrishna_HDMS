// Create Ticket Page per spec section 11.1 / 6.1.
// Fields: Employee Name, Department, Issue Category, Description, Priority.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'

export default function TicketNew() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    employee_name: '', department: '', issue_category: '', description: '', priority: 'Medium',
  })
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [] })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { TicketAPI.lookups().then(setLookups).catch(() => {}) }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function validate() {
    if (form.employee_name.trim().length < 2) return 'Employee name must be at least 2 characters.'
    if (!form.department.trim())               return 'Department is required.'
    if (!form.issue_category)                  return 'Issue category is required.'
    if (form.description.trim().length < 3)    return 'Description must be at least 3 characters.'
    return null
  }

  async function submit(e) {
    e.preventDefault()
    const v = validate()
    if (v) { setErr(v); return }
    setErr(''); setBusy(true)
    try {
      const t = await TicketAPI.create(form)
      nav(`/tickets/${t.ticket_id}`)
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Failed to create ticket')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">Create Support Ticket</h1>
      <form onSubmit={submit} className="card space-y-4">
        {err && <div className="text-sm bg-rose-50 text-rose-700 px-3 py-2 rounded">{err}</div>}
        <div>
          <label className="label">Employee Name *</label>
          <input className="input" value={form.employee_name} onChange={set('employee_name')} required minLength={2} maxLength={120} />
        </div>
        <div>
          <label className="label">Department *</label>
          <input className="input" value={form.department} onChange={set('department')} required maxLength={120}
                 placeholder="e.g. Engineering, Finance, HR" />
        </div>
        <div>
          <label className="label">Issue Category *</label>
          <select className="input" value={form.issue_category} onChange={set('issue_category')} required>
            <option value="">Select a category…</option>
            {lookups.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Description *</label>
          <textarea className="input" rows={5} value={form.description} onChange={set('description')} required minLength={3}
                    placeholder="Describe the issue in detail" />
        </div>
        <div>
          <label className="label">Priority *</label>
          <select className="input" value={form.priority} onChange={set('priority')}>
            {lookups.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" className="btn-secondary" onClick={() => nav(-1)} disabled={busy}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Submitting…' : 'Submit Ticket'}</button>
        </div>
      </form>
    </div>
  )
}
