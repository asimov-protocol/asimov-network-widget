import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuration for building the demo/examples as a static site
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Build configuration for static site
  build: {
    outDir: './dist-demo',
    emptyOutDir: true,
  },
  // Base path for GitHub Pages (replace 'asimov-network-widget' with your repo name if different)
  base: '/asimov-network-widget/',
})
