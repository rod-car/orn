import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true, // Enable console output for compression results
      disable: false, // Enable compression
      threshold: 10240, // Minimum file size to compress (in bytes)
      algorithm: 'gzip', // Compression algorithm ('gzip' or 'brotliCompress')
      ext: '.gz', // File extension for compressed files
    }),
  ],
  resolve: {
    alias: [{ find: '@base', replacement: path.resolve(__dirname, 'src') }]
  },
  build: {
    target: 'esnext', // Specify the target for modern browsers
  },
  base: "/"
})
