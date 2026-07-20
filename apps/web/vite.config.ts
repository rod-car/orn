import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// ✅ Utilisez la version 2 du plugin
import { compression } from 'vite-plugin-compression2' 

export default defineConfig({
  plugins: [
    react(),

    // ✅ GZIP corrigé
    compression({
      algorithms: ['gzip'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),

    // ✅ BROTLI corrigé
    compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],

  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    target: 'es2020',
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

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('react-router')
            ) {
              return 'vendor-core'
            }
            return 'vendor-libs'
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
      // 🔥 LE BLOC TREESHAKE A ÉTÉ SUPPRIMÉ ICI
    },
  },

  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },

  base: '/',
})