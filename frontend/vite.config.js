import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Proxy for Alpha Vantage (Real Market Data)
      '/api/alpha': {
        target: 'https://www.alphavantage.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alpha/, ''),
      },
      // 2. Proxy for Yahoo Finance (Fallback API)
      '/api/yahoo': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ''),
      },
      // 3. Proxy for AI Predictor
      '/ai-endpoint': {
        target: 'https://prishaa-stockpredictor.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-endpoint/, '/api/analyze'),
      },
      // 4. Proxy for Twelve Data (Secondary API)
      '/api/twelve': {
        target: 'https://api.twelvedata.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twelve/, ''),
      }
    },
  },
})