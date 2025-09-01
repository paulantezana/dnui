import { defineConfig } from 'vite';
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'dnui',
      fileName: 'dnui',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});