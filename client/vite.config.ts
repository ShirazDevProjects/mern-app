import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        allowedHosts: ['server.srv1011002.hstgr.cloud']
    },
    server: {
        port: 4000,
        proxy: {
            '/api': {
                target: 'https://server.srv1011002.hstgr.cloud',
                changeOrigin: true,
            },
        },
    },
});
