import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/neural-network-obsidian/',
  plugins: [react()],
})