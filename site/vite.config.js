import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import writings from './server/plugin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), writings()],
  base: './',
  server: { host: '127.0.0.1' },
  build: {
    outDir: path.resolve(__dirname, '../'),
    assetsDir: 'assets',
    emptyOutDir: false,
    /* three.js is loaded lazily (after the page is idle), so it lives in its own chunk and is allowed to be large. */
    chunkSizeWarningLimit: 700,
    rollupOptions: { output: { manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined) } },
  },
})
