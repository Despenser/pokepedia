import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';


export default defineConfig({
  plugins: [viteCompression()],
  build: {
    sourcemap: false,
    minify: 'esbuild',
  },
});

