import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss(),],
      define: {
        // Fix: Use API_KEY as per Gemini guidelines.
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});