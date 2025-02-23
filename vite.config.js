export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://dh.soulmachines.cloud',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
});