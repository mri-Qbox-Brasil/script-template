import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

function serveLocales(): Plugin {
    return {
        name: 'serve-locales',
        configureServer(server) {
            server.middlewares.use('/locales', (req, res, next) => {
                const lang = (req.url ?? '/').replace(/^\//, '').replace(/\.json$/, '') || 'pt-br'
                const filePath = resolve(__dirname, '..', 'locales', `${lang}.json`)
                if (fs.existsSync(filePath)) {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(fs.readFileSync(filePath))
                } else {
                    next()
                }
            })
        },
    }
}

export default defineConfig({
    plugins: [react(), serveLocales()],
    base: './',
    build: {
        outDir: '../html',
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
