import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@config': resolve('src/renderer/config')
            }
        },
        build: {
            rollupOptions: {
                input: {
                    main: 'src/renderer/index.html',
                    auth: 'src/renderer/auth.html'
                }
            }
        },
        plugins: [react()]
    }
})
