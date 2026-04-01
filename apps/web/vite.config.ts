import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),

    // ✅ GZIP (compatibilité)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      compressionOptions: {
        level: 9,
      },
      deleteOriginFile: false,
    }),

    // ✅ BROTLI (meilleure compression)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      compressionOptions: {
        level: 11,
      },
      deleteOriginFile: false,
    }),
  ],

  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    target: 'es2020',

    // 🔥 Optimisation globale
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,

    modulePreload: {
      polyfill: true,
    },

    // 🔥 CHUNKING INTELLIGENT
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/')
            const lib = parts[0]

            // Regroupement stratégique
            if (['react', 'react-dom'].includes(lib)) {
              return 'vendor-react'
            }

            if (['react-router-dom'].includes(lib)) {
              return 'vendor-router'
            }

            // 1 chunk par lib (cache optimal)
            return `vendor-${lib}`
          }
        },

        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',

        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop()

          if (/png|jpe?g|svg|gif|webp/i.test(ext || '')) {
            return 'images/[name]-[hash][extname]'
          }

          if (/woff2?|ttf|eot/i.test(ext || '')) {
            return 'fonts/[name]-[hash][extname]'
          }

          return 'assets/[name]-[hash][extname]'
        },
      },

      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },

  // 🔥 Nettoyage du code
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },

  // ⚡ Pré-bundling deps
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },

  base: '/',
})