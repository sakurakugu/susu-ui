import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        alert: resolve(__dirname, 'src/components/alert/index.ts'),
        breadcrumb: resolve(__dirname, 'src/components/breadcrumb/index.ts'),
        button: resolve(__dirname, 'src/components/button/index.ts'),
        card: resolve(__dirname, 'src/components/card/index.ts'),
        checkbox: resolve(__dirname, 'src/components/checkbox/index.ts'),
        'color-picker': resolve(
          __dirname,
          'src/components/color-picker/index.ts',
        ),
        'date-picker': resolve(
          __dirname,
          'src/components/date-picker/index.ts',
        ),
        descriptions: resolve(
          __dirname,
          'src/components/descriptions/index.ts',
        ),
        dialog: resolve(__dirname, 'src/components/dialog/index.ts'),
        divider: resolve(__dirname, 'src/components/divider/index.ts'),
        drawer: resolve(__dirname, 'src/components/drawer/index.ts'),
        empty: resolve(__dirname, 'src/components/empty/index.ts'),
        form: resolve(__dirname, 'src/components/form/index.ts'),
        icon: resolve(__dirname, 'src/components/icon/index.ts'),
        input: resolve(__dirname, 'src/components/input/index.ts'),
        'input-number': resolve(
          __dirname,
          'src/components/input-number/index.ts',
        ),
        menu: resolve(__dirname, 'src/components/menu/index.ts'),
        message: resolve(__dirname, 'src/components/message/index.ts'),
        popover: resolve(__dirname, 'src/components/popover/index.ts'),
        rate: resolve(__dirname, 'src/components/rate/index.ts'),
        select: resolve(__dirname, 'src/components/select/index.ts'),
        skeleton: resolve(__dirname, 'src/components/skeleton/index.ts'),
        slider: resolve(__dirname, 'src/components/slider/index.ts'),
        space: resolve(__dirname, 'src/components/space/index.ts'),
        switch: resolve(__dirname, 'src/components/switch/index.ts'),
        table: resolve(__dirname, 'src/components/table/index.ts'),
        tag: resolve(__dirname, 'src/components/tag/index.ts'),
        text: resolve(__dirname, 'src/components/text/index.ts'),
        tooltip: resolve(__dirname, 'src/components/tooltip/index.ts'),
        tree: resolve(__dirname, 'src/components/tree/index.ts'),
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
