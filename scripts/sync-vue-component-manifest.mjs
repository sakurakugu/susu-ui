import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  buildVueIndexContent,
  buildVuePackageExports,
  getComponentEntries,
  vuePackageDir,
} from './vue-component-manifest.mjs'

async function main() {
  const entries = await getComponentEntries()
  const packageJsonPath = join(vuePackageDir, 'package.json')
  const vueIndexPath = join(vuePackageDir, 'src/index.ts')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))

  packageJson.exports = buildVuePackageExports(entries)

  await Promise.all([
    writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`),
    writeFile(vueIndexPath, buildVueIndexContent(entries)),
  ])

  console.log(`Vue 组件清单已同步，共 ${entries.length} 个组件。`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
