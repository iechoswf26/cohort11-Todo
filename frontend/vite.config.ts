/// <reference types="vitest"  />

import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    outDir: 'build',
  },
  test: {
    globals: true, // Allows using `describe`, `it`, `expect` without imports
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './src/setupTests.ts', // File for test setup (see below)
    css: false, // Optional: Include CSS in tests if needed
  },
});
