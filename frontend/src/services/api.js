// Axios instance pointed at the FastAPI backend.
// Vite's dev proxy forwards /tickets and /search to localhost:8000.
import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  timeout: 30000,
})

export const TicketAPI = {
  list:    (params = {}) => api.get('/tickets', { params }).then((r) => r.data),
  get:     (id)          => api.get(`/tickets/${id}`).then((r) => r.data),
  create:  (payload)     => api.post('/tickets', payload).then((r) => r.data),
  update:  (id, payload) => api.put(`/tickets/${id}`, payload).then((r) => r.data),
  remove:  (id)          => api.delete(`/tickets/${id}`).then((r) => r.data),
  summary: ()            => api.get('/tickets/summary').then((r) => r.data),
  lookups: ()            => api.get('/tickets/lookups').then((r) => r.data),
  search:  (params = {}) => api.get('/search',  { params }).then((r) => r.data),
}

export default api
