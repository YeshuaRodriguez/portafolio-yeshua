import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // En desarrollo, /api va al server de Express (server/app.js)
    proxy: { '/api': 'http://localhost:3000' },
  },
})
