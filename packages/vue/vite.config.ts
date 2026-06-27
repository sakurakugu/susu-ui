import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        affix: resolve(__dirname, 'src/components/affix/index.ts'),
        alert: resolve(__dirname, 'src/components/alert/index.ts'),
        anchor: resolve(__dirname, 'src/components/anchor/index.ts'),
        autocomplete: resolve(
          __dirname,
          'src/components/autocomplete/index.ts',
        ),
        avatar: resolve(__dirname, 'src/components/avatar/index.ts'),
        'back-top': resolve(__dirname, 'src/components/back-top/index.ts'),
        badge: resolve(__dirname, 'src/components/badge/index.ts'),
        breadcrumb: resolve(__dirname, 'src/components/breadcrumb/index.ts'),
        button: resolve(__dirname, 'src/components/button/index.ts'),
        calendar: resolve(__dirname, 'src/components/calendar/index.ts'),
        card: resolve(__dirname, 'src/components/card/index.ts'),
        cascader: resolve(__dirname, 'src/components/cascader/index.ts'),
        checkbox: resolve(__dirname, 'src/components/checkbox/index.ts'),
        collapse: resolve(__dirname, 'src/components/collapse/index.ts'),
        'color-picker': resolve(
          __dirname,
          'src/components/color-picker/index.ts',
        ),
        'command-palette': resolve(
          __dirname,
          'src/components/command-palette/index.ts',
        ),
        'date-range-picker': resolve(
          __dirname,
          'src/components/date-range-picker/index.ts',
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
        dropdown: resolve(__dirname, 'src/components/dropdown/index.ts'),
        empty: resolve(__dirname, 'src/components/empty/index.ts'),
        form: resolve(__dirname, 'src/components/form/index.ts'),
        icon: resolve(__dirname, 'src/components/icon/index.ts'),
        image: resolve(__dirname, 'src/components/image/index.ts'),
        input: resolve(__dirname, 'src/components/input/index.ts'),
        'input-number': resolve(
          __dirname,
          'src/components/input-number/index.ts',
        ),
        loading: resolve(__dirname, 'src/components/loading/index.ts'),
        menu: resolve(__dirname, 'src/components/menu/index.ts'),
        mention: resolve(__dirname, 'src/components/mention/index.ts'),
        message: resolve(__dirname, 'src/components/message/index.ts'),
        notification: resolve(
          __dirname,
          'src/components/notification/index.ts',
        ),
        pagination: resolve(__dirname, 'src/components/pagination/index.ts'),
        popconfirm: resolve(__dirname, 'src/components/popconfirm/index.ts'),
        popover: resolve(__dirname, 'src/components/popover/index.ts'),
        progress: resolve(__dirname, 'src/components/progress/index.ts'),
        qrcode: resolve(__dirname, 'src/components/qrcode/index.ts'),
        radio: resolve(__dirname, 'src/components/radio/index.ts'),
        rate: resolve(__dirname, 'src/components/rate/index.ts'),
        result: resolve(__dirname, 'src/components/result/index.ts'),
        resizable: resolve(__dirname, 'src/components/resizable/index.ts'),
        select: resolve(__dirname, 'src/components/select/index.ts'),
        segmented: resolve(__dirname, 'src/components/segmented/index.ts'),
        skeleton: resolve(__dirname, 'src/components/skeleton/index.ts'),
        slider: resolve(__dirname, 'src/components/slider/index.ts'),
        space: resolve(__dirname, 'src/components/space/index.ts'),
        splitter: resolve(__dirname, 'src/components/splitter/index.ts'),
        statistic: resolve(__dirname, 'src/components/statistic/index.ts'),
        steps: resolve(__dirname, 'src/components/steps/index.ts'),
        switch: resolve(__dirname, 'src/components/switch/index.ts'),
        tabs: resolve(__dirname, 'src/components/tabs/index.ts'),
        table: resolve(__dirname, 'src/components/table/index.ts'),
        tag: resolve(__dirname, 'src/components/tag/index.ts'),
        text: resolve(__dirname, 'src/components/text/index.ts'),
        'time-picker': resolve(
          __dirname,
          'src/components/time-picker/index.ts',
        ),
        'time-range-picker': resolve(
          __dirname,
          'src/components/time-range-picker/index.ts',
        ),
        timeline: resolve(__dirname, 'src/components/timeline/index.ts'),
        tooltip: resolve(__dirname, 'src/components/tooltip/index.ts'),
        tour: resolve(__dirname, 'src/components/tour/index.ts'),
        transfer: resolve(__dirname, 'src/components/transfer/index.ts'),
        tree: resolve(__dirname, 'src/components/tree/index.ts'),
        upload: resolve(__dirname, 'src/components/upload/index.ts'),
        'virtual-list': resolve(
          __dirname,
          'src/components/virtual-list/index.ts',
        ),
        watermark: resolve(__dirname, 'src/components/watermark/index.ts'),
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
