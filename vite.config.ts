import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serve o site em /Health-tracker/, não na raiz do domínio.
  base: command === 'build' ? '/Health-tracker/' : '/',
  plugins: [react()],
}))
