import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load .env file variables
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],
    define: {
      "import.meta.env": env
    },
    build: {
      outDir: 'dist', // ✅ Ensure Vercel serves the correct folder
    },
    base: '/', // ✅ Needed for Vercel hosting
  };
});

