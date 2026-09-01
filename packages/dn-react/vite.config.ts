import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const root = import.meta.dirname

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      outDirs: ['dist/types'],
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: {
        index: resolve(root, 'src/index.ts'),
        core: resolve(root, 'src/core/index.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        '@floating-ui/dom'
      ]
    }
  }
})
