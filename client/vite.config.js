import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        allowedHosts: ['']
    },
    server: {
        port: 4000,
        proxy: {
            '/api': {
                target: '',
                changeOrigin: true,
            },
        },
    },
});
