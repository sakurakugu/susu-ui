import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const root = process.cwd()
export const vuePackageDir = join(root, 'packages/vue')
export const componentsDir = join(vuePackageDir, 'src/components')

export function toPascalCase(id) {
  const overrides = {
    qrcode: 'QRCode',
  }

  return (
    overrides[id] ??
    id
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  )
}

export function getDemoFileName(id) {
  return `${toPascalCase(id)}Demo.vue`
}

export async function getComponentIds() {
  const entries = await readdir(componentsDir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => existsSync(join(componentsDir, id, 'index.ts')))
    .sort((left, right) => left.localeCompare(right))
}

export async function getComponentEntries() {
  const ids = await getComponentIds()

  return Promise.all(
    ids.map(async (id) => {
      const indexPath = join(componentsDir, id, 'index.ts')
      const source = await readFile(indexPath, 'utf8')
      const exportNames = [...source.matchAll(/export\s+const\s+(Su\w+)\s*=/g)]
        .map((match) => match[1])
        .sort((left, right) => left.localeCompare(right))

      if (exportNames.length === 0) {
        throw new Error(`${indexPath} 未导出 SuXxx 组件`)
      }

      return {
        id,
        exportNames,
      }
    }),
  )
}

export function buildVuePackageExports(entries) {
  return {
    '.': {
      types: './dist/index.d.ts',
      import: './dist/susu-ui-vue.js',
      require: './dist/susu-ui-vue.cjs',
    },
    './style.css': './dist/vue.css',
    ...Object.fromEntries(
      entries.map((entry) => [
        `./${entry.id}`,
        {
          types: `./dist/components/${entry.id}/index.d.ts`,
          import: `./dist/${entry.id}.js`,
          require: `./dist/${entry.id}.cjs`,
        },
      ]),
    ),
  }
}

function buildComponentImport({ id, exportNames }) {
  const inlineImport = `import { ${exportNames.join(', ')} } from './components/${id}'`

  if (inlineImport.length <= 100) {
    return inlineImport
  }

  return `import {
${exportNames.map((name) => `  ${name},`).join('\n')}
} from './components/${id}'`
}

export function buildVueIndexContent(entries) {
  const componentImports = entries.map((entry) => buildComponentImport(entry)).join('\n')

  const componentExports = entries.map(({ id }) => `export * from './components/${id}'`).join('\n')

  const installComponents = ['SuConfigProvider', ...entries.flatMap((entry) => entry.exportNames)]
    .map((name) => `  ${name},`)
    .join('\n')

  return `import type { App, Plugin } from 'vue'
import { computed } from 'vue'
import {
  configProviderKey,
  mergeConfig,
  SuConfigProvider,
  type SusuConfigProviderProps,
} from './config-provider'
${componentImports}

export * from './config-provider'
${componentExports}
export * from './locale'

const components = [
${installComponents}
]

export const SusuUI: Plugin = {
  install(app: App, options?: SusuConfigProviderProps) {
    app.provide(
      configProviderKey,
      computed(() => mergeConfig(options)),
    )

    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
`
}
