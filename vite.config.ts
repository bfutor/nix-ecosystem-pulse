import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/reddit-api': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reddit-api/, ''),
      },
      '/repology-api': {
        target: 'https://repology.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/repology-api/, ''),
      },
    },
  },
})
