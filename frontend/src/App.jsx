import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TicketList from './pages/TicketList.jsx'
import TicketNew from './pages/TicketNew.jsx'
import TicketDetail from './pages/TicketDetail.jsx'
import TicketEdit from './pages/TicketEdit.jsx'
import Search from './pages/Search.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="/tickets/:id/edit" element={<TicketEdit />} />
        <Route path="/new" element={<TicketNew />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
