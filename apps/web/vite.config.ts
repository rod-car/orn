import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa'

const manifestIcons = [
  {
    src: '/logo-mini.png',
    sizes: '180x180',
    type: 'image/png',
  },
  {
    src: '/logo-mini.png',
    sizes: '512x512',
    type: 'image/png',
  }
]

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000
      },
      manifest: {
        name: 'ORN Atsinanana - Cantinte Scolaire',
        short_name: 'Cantine Scolaire',
        icons: manifestIcons,
      }
    })
  ],
  resolve: {
    alias: [{ find: '@base', replacement: path.resolve(__dirname, 'src') }]
  },
  build: {
    target: 'esnext',
  },
  base: "/"
})
