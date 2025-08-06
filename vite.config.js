import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3022',
        changeOrigin: true,
        rewrite: (path) => path,//.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        }
      },
      '/admin/api': {
        target: 'http://localhost:3022',
        changeOrigin: true,
        rewrite: (path) => path,//.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        }
      },
    }
  }
})
