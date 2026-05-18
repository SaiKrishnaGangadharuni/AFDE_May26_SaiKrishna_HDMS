import { Link, NavLink } from 'react-router-dom'

const NAV = [
  { path: '/',         label: 'Dashboard' },
  { path: '/tickets',  label: 'All Tickets' },
  { path: '/new',      label: 'Create Ticket' },
  { path: '/search',   label: 'Search & Filter' },
]

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-brand-700 rounded font-bold flex items-center justify-center">H</div>
            <div>
              <div className="font-semibold leading-none">HDMS</div>
              <div className="text-xs text-brand-100">Helpdesk Tickets</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((m) => (
              <NavLink key={m.path} to={m.path} end={m.path === '/'}
                className={({ isActive }) =>
                  'px-3 py-1.5 rounded ' +
                  (isActive ? 'bg-brand-900 text-white' : 'text-brand-100 hover:bg-brand-600')}>
                {m.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <nav className="md:hidden border-t border-brand-600 px-4 py-2 flex gap-2 text-xs overflow-x-auto">
          {NAV.map((m) => (
            <NavLink key={m.path} to={m.path} end={m.path === '/'}
              className={({ isActive }) =>
                'px-2 py-1 rounded whitespace-nowrap ' +
                (isActive ? 'bg-brand-900 text-white' : 'text-brand-100 hover:bg-brand-600')}>
              {m.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        HDMS · Capstone Phase 1 · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
