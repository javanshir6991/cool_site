import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://dummyjson.com',
                changeOrigin: true,
                secure: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})
