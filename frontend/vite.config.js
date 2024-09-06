import { defineConfig} from 'vite';

export default defineConfig({
    server:{
        port: 3000,
        open: "/index.html"
    },
    root: './',
    base: '/',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    plugins: [],
})