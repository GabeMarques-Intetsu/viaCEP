import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa ('./') faz os assets funcionarem no GitHub Pages
// independentemente do nome do repositório.
export default defineConfig({
  plugins: [react()],
  base: './',
});
