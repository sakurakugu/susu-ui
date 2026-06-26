import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        button: resolve(__dirname, 'src/components/button/index.ts'),
        divider: resolve(__dirname, 'src/components/divider/index.ts'),
        empty: resolve(__dirname, 'src/components/empty/index.ts'),
        icon: resolve(__dirname, 'src/components/icon/index.ts'),
        input: resolve(__dirname, 'src/components/input/index.ts'),
        message: resolve(__dirname, 'src/components/message/index.ts'),
        rate: resolve(__dirname, 'src/components/rate/index.ts'),
        tag: resolve(__dirname, 'src/components/tag/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName(format, entryName) {
        const extension = format === 'es' ? 'js' : 'cjs'
        const fileName = entryName === 'index' ? 'susu-ui-vue' : entryName
        return `${fileName}.${extension}`
      },
    },
    rollupOptions: {
      external: ['vue', '@susu-ui/theme'],
      output: {
        exports: 'named',
      },
    },
  },
})
