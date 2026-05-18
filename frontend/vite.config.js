import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite dev server on port 5173, proxies API calls to the FastAPI backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/tickets': { target: 'http://localhost:8000', changeOrigin: true },
      '/search':  { target: 'http://localhost:8000', changeOrigin: true },
      '/health':  { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
