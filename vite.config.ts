import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from GitHub Pages at /hive-and-honey/. Routing lives in the hash, so a
// relative base keeps every asset path working wherever the folder is hosted.
// Pages deploys this branch's docs/ folder, so the build goes there.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'docs', emptyOutDir: true },
})
