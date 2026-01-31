import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [react()],
        // Base path for GitHub Pages (repo name)
        base: mode === 'production' ? '/bixi-dashboard/' : '/',
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:8000',
                    changeOrigin: true,
                }
            }
        },
        define: {
            // Make API URL available at build time
            'import.meta.env.VITE_API_URL': JSON.stringify(
                env.VITE_API_URL || ''
            )
        }
    }
})
