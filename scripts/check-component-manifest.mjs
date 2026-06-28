import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.cwd()
const componentsDir = join(root, 'packages/vue/src/components')

async function readText(path) {
  return readFile(path, 'utf8')
}

function toPascalCase(id) {
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

function getDemoFileName(id) {
  return `${toPascalCase(id)}Demo.vue`
}

async function getComponentIds() {
  const entries = await readdir(componentsDir, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
}

async function main() {
  const componentIds = await getComponentIds()
  const [
    packageJson,
    viteConfig,
    vueIndex,
    docsIndex,
    playgroundNav,
    playgroundDemos,
  ] = await Promise.all([
    readText(join(root, 'packages/vue/package.json')),
    readText(join(root, 'packages/vue/vite.config.ts')),
    readText(join(root, 'packages/vue/src/index.ts')),
    readText(join(root, 'docs/README.md')),
    readText(join(root, 'playground/src/playgroundNav.ts')),
    readText(join(root, 'playground/src/demos/index.ts')),
  ])

  const errors = []

  if (
    !viteConfig.includes('function getComponentEntries()') ||
    !viteConfig.includes('...getComponentEntries()')
  ) {
    errors.push('packages/vue/vite.config.ts 未使用组件目录自动生成构建入口')
  }

  for (const id of componentIds) {
    const pascalName = toPascalCase(id)
    const componentName = `Su${pascalName}`
    const demoFileName = getDemoFileName(id)

    const checks = [
      {
        ok: packageJson.includes(`"./${id}"`),
        message: `packages/vue/package.json 缺少 ./${id} 子路径导出`,
      },
      {
        ok:
          vueIndex.includes(`./components/${id}`) &&
          vueIndex.includes(componentName),
        message: `packages/vue/src/index.ts 缺少 ${componentName} 导入、导出或安装注册`,
      },
      {
        ok: docsIndex.includes(`./组件/${pascalName}%20`),
        message: `docs/README.md 缺少 ${pascalName} 文档索引`,
      },
      {
        ok: playgroundNav.includes(`id: '${id}'`),
        message: `playground/src/playgroundNav.ts 缺少 ${id} 导航项`,
      },
      {
        ok:
          playgroundDemos.includes(`./${demoFileName}`) &&
          playgroundDemos.includes(`id: '${id}'`),
        message: `playground/src/demos/index.ts 缺少 ${id} 示例注册`,
      },
    ]

    for (const check of checks) {
      if (!check.ok) errors.push(check.message)
    }
  }

  if (!packageJson.includes('"./style.css": "./dist/vue.css"')) {
    errors.push('packages/vue/package.json 缺少 ./style.css 样式导出')
  }

  if (errors.length > 0) {
    console.error('组件清单检查失败：')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log(`组件清单检查通过，共 ${componentIds.length} 个组件。`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
