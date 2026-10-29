import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spaRoutesPlugin } from './spaRoutes';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaRoutesPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'es2020',
  },
});
