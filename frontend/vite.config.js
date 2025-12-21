import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This 'proxy' section is the bridge. 
    // It tells the local server: "When you see /api/..., don't look for a file. 
    // Forward the request to the real internet."
    proxy: {
      '/api/alpha': {
        target: 'https://www.alphavantage.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alpha/, ''),
      },
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      '/api/twelve': {
        target: 'https://api.twelvedata.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twelve/, ''),
      },
      '/ai-endpoint': {
        target: 'https://prishaa-stockpredictor.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-endpoint/, '/api/analyze'),
      },
    },
  },
})