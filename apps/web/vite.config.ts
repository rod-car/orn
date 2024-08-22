import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@base', replacement: path.resolve(__dirname, 'src') }]
  },
  base: "/"
})
