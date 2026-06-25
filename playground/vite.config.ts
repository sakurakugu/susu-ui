import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@susu-ui/theme/style.css',
        replacement: resolve(__dirname, '../packages/theme/style.css'),
      },
      {
        find: '@susu-ui/theme',
        replacement: resolve(__dirname, '../packages/theme/src/index.ts'),
      },
      {
        find: '@susu-ui/vue',
        replacement: resolve(__dirname, '../packages/vue/src/index.ts'),
      },
    ],
  },
})
