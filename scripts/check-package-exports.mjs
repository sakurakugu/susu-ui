import { access, readFile } from 'node:fs/promises'
import { join, normalize } from 'node:path'

const root = process.cwd()
const packages = ['packages/tokens', 'packages/theme', 'packages/vue']

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readPackageJson(packageDir) {
  const packageJsonPath = join(root, packageDir, 'package.json')
  const content = await readFile(packageJsonPath, 'utf8')

  return JSON.parse(content)
}

function collectExportTargets(exportsField) {
  if (!exportsField) return []

  if (typeof exportsField === 'string') {
    return [exportsField]
  }

  if (Array.isArray(exportsField)) {
    return exportsField.flatMap(collectExportTargets)
  }

  return Object.values(exportsField).flatMap(collectExportTargets)
}

function collectPackageTargets(packageJson) {
  const targets = [
    packageJson.main,
    packageJson.module,
    packageJson.types,
    ...collectExportTargets(packageJson.exports),
  ].filter((target) => typeof target === 'string')

  return [...new Set(targets)]
}

function collectPublishedEntries(packageJson) {
  return (packageJson.files ?? []).filter((entry) => typeof entry === 'string')
}

async function main() {
  const errors = []

  for (const packageDir of packages) {
    const packageJson = await readPackageJson(packageDir)
    const packageRoot = join(root, packageDir)

    for (const target of collectPackageTargets(packageJson)) {
      const targetPath = join(packageRoot, target)

      if (!(await exists(targetPath))) {
        errors.push(`${packageJson.name} 的导出目标不存在：${normalize(target)}`)
      }
    }

    for (const entry of collectPublishedEntries(packageJson)) {
      const entryPath = join(packageRoot, entry)

      if (!(await exists(entryPath))) {
        errors.push(`${packageJson.name} 的 files 条目不存在：${normalize(entry)}`)
      }
    }
  }

  if (errors.length > 0) {
    console.error('包导出检查失败：')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('包导出检查通过。')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
