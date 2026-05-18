// Search & Filter Section per spec section 11.1.
// Filters: Status, Category, Priority (+ keyword per section 6.5)
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TicketAPI } from '../services/api.js'
import { StatusBadge, PriorityBadge } from '../components/Badges.jsx'

export default function Search() {
  const [lookups, setLookups] = useState({ categories: [], priorities: [], statuses: [] })
  const [filters, setFilters] = useState({ q: '', status: '', category: '', priority: '' })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => { TicketAPI.lookups().then(setLookups).catch(() => {}) }, [])

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value })

  async function run(e) {
    e?.preventDefault()
    setTouched(true); setLoading(true)
    const params = {}
    for (const [k, v] of Object.entries(filters)) if (v !== '') params[k] = v
    try {
      const data = await TicketAPI.search(params)
      setRows(data)
    } finally {
      setLoading(false)
    }
  }

  function clearAll() {
    setFilters({ q: '', status: '', category: '', priority: '' })
    setRows([]); setTouched(false)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Search &amp; Filter</h1>

      <form onSubmit={run} className="card">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="label">Keyword (matches name, department, description, resolution)</label>
            <input className="input" value={filters.q} onChange={set('q')}
                   placeholder="e.g. 'VPN', 'Outlook', 'Sarah'" />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={filters.status} onChange={set('status')}>
              <option value="">Any</option>
              {lookups.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={filters.category} onChange={set('category')}>
              <option value="">Any</option>
              {lookups.categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={filters.priority} onChange={set('priority')}>
              <option value="">Any</option>
              {lookups.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" className="btn-secondary" onClick={clearAll}>Clear</button>
        </div>
      </form>

      {touched && (
        <div className="card p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">Searching…</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">No tickets matched your filters.</div>
          ) : (
            <>
              <div className="px-4 py-2 text-xs text-slate-500 border-b">{rows.length} result{rows.length !== 1 && 's'}</div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="text-left">Employee</th>
                    <th className="text-left">Category</th>
                    <th className="text-left">Priority</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.ticket_id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono text-xs text-slate-500">#{t.ticket_id}</td>
                      <td>{t.employee_name}</td>
                      <td className="text-xs">{t.issue_category}</td>
                      <td><PriorityBadge priority={t.priority} /></td>
                      <td><StatusBadge status={t.status} /></td>
                      <td className="max-w-[280px] truncate text-slate-600" title={t.description}>{t.description}</td>
                      <td><Link to={`/tickets/${t.ticket_id}`} className="text-xs text-brand-700 hover:underline">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}
