import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import purgecss from 'vite-plugin-purgecss';


export default defineConfig({
    plugins: [
        react(),
        viteCompression(),
        process.env.NODE_ENV === 'production' && purgecss({
            content: [
                './index.html',
                './src/**/*.{js,jsx,ts,tsx,html}',
            ],
            safelist: [
                /^pokemon-/, /^header-/, /^footer-/, /^type-badge/, /^generation-badge/, /^main-content/, /^container/, /^back-button/, /^evo-/, /^favorites-/, /^search-/, /^loader/, /^theme-/, /^error-/, /^not-found-/, /^reset-all-filters/, /^section-title/, /^attribute/, /^mini-pokemon-link/, /^burger-menu/, /^menu-icon/, /^logo/, /^pokeball-logo/, /^favorites-link/, /^searchbar/, /^card/, /^stat-/, /^ability-/, /^evolution-/, /^alternative-/, /^description-/, /^skeleton-/, /^empty-/, /^scroll-trigger/, /^app/, /^list/, /^grid/, /^row/, /^col/, /^icon-/, /^svg/, /^input/, /^button/, /^link/, /^active/, /^current/, /^selected/, /^large/, /^small/, /^dark/, /^light/, /^loaded/, /^error/, /^hidden/, /^show/, /^hide/, /^open/, /^close/, /^transition/, /^fade/, /^slide/, /^pulse/, /^rotate/, /^gentleFloat/, /^shadowPulse/, /^theme-transition/, /^theme-/
            ]
        })
    ],
    build: {
        sourcemap: true,
        minify: 'esbuild',
    },
});
