import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function getComponentEntries() {
  const componentsDir = resolve(__dirname, 'src/components')
  const componentNames = readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))

  const entries: Record<string, string> = {}

  componentNames.forEach((name) => {
    const entry = resolve(componentsDir, name, 'index.ts')

    if (existsSync(entry)) {
      entries[name] = entry
    }
  })

  return entries
}

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        ...getComponentEntries(),
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
