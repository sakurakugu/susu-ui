import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  buildVueIndexContent,
  buildVuePackageExports,
  getComponentEntries,
  getDemoFileName,
  root,
  toPascalCase,
} from './vue-component-manifest.mjs'

async function readText(path) {
  return readFile(path, 'utf8')
}

async function main() {
  const componentEntries = await getComponentEntries()
  const componentIds = componentEntries.map((entry) => entry.id)
  const [packageJson, viteConfig, vueIndex, docsIndex, playgroundNav, playgroundDemos] =
    await Promise.all([
      readText(join(root, 'packages/vue/package.json')),
      readText(join(root, 'packages/vue/vite.config.ts')),
      readText(join(root, 'packages/vue/src/index.ts')),
      readText(join(root, 'docs/README.md')),
      readText(join(root, 'playground/src/playgroundNav.ts')),
      readText(join(root, 'playground/src/demos/index.ts')),
    ])

  const errors = []
  const expectedExports = buildVuePackageExports(componentEntries)
  const actualExports = JSON.parse(packageJson).exports

  if (JSON.stringify(actualExports) !== JSON.stringify(expectedExports)) {
    errors.push('packages/vue/package.json 的 exports 未同步，请运行 pnpm sync:components')
  }

  if (vueIndex !== buildVueIndexContent(componentEntries)) {
    errors.push('packages/vue/src/index.ts 的组件入口未同步，请运行 pnpm sync:components')
  }

  if (
    !viteConfig.includes('function getComponentEntries()') ||
    !viteConfig.includes('...getComponentEntries()')
  ) {
    errors.push('packages/vue/vite.config.ts 未使用组件目录自动生成构建入口')
  }

  for (const id of componentIds) {
    const pascalName = toPascalCase(id)
    const demoFileName = getDemoFileName(id)

    const checks = [
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
          playgroundDemos.includes(`./${demoFileName}`) && playgroundDemos.includes(`id: '${id}'`),
        message: `playground/src/demos/index.ts 缺少 ${id} 示例注册`,
      },
    ]

    for (const check of checks) {
      if (!check.ok) errors.push(check.message)
    }
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
