## 项目概览

Susu UI 是一个个人 Vue 3 组件库 monorepo，当前主要包含以下包和目录：

| 目录               | 技术栈                    | 说明                          |
| ------------------ | ------------------------- | ----------------------------- |
| `packages/vue/`    | Vue 3 + TypeScript + Vite | Vue 组件库主体                |
| `packages/theme/`  | TypeScript + CSS          | 主题 CSS 变量和运行时主题能力 |
| `packages/tokens/` | TypeScript                | 共享设计令牌和主题基础配置    |
| `playground/`      | Vue 3 + TypeScript + Vite | 本地组件调试和示例页面        |
| `docs/`            | Markdown                  | 使用文档、组件文档和技术文档  |

## 约定

- 修改vue等代码文件后要通过检查来防止编辑错误
- 开发阶段页面均为热更新，修改代码后无需重启服务，如要使用浏览器可以用 playwright（python） 测试
- 如需安装库，直接安装
- 所有注释、描述一律使用中文，回复也使用中文
- 不用向前兼容
- 如有表述不清晰的就直接问，不用一直猜测

## 项目结构

- 包管理器使用 `pnpm`
- Vue 组件位于 `packages/vue/src/components`
- playground 位于 `playground/src`
- 组件文档位于 `docs/组件`
- 主题样式优先使用已有 CSS 变量，例如 `--su-color-*`、`--su-space-*`、`--su-radius-*`

## 新增组件流程

新增组件时需要同步完成：

- 在 `packages/vue/src/components/<组件名>/` 下新增组件、`index.ts` 和测试文件
- 运行 `pnpm sync:components`，自动同步 `packages/vue/src/index.ts` 和 `packages/vue/package.json` 的组件导出清单
- 在 `playground/src/playgroundNav.ts` 中加入导航
- 在 `playground/src/demos/<ComponentName>Demo.vue` 中新增示例，并在 `playground/src/demos/index.ts` 注册
- 如需示例样式，优先写入对应 Demo 单文件；确需复用或覆盖全局布局时再写入 `playground/src/style.css`
- 在 `docs/组件` 中新增组件文档
- 更新 `docs/README.md` 的文档索引

## 组件实现约定

- 组件名使用 `SuXxx`
- 样式类名使用 `su-xxx` BEM 风格
- 类型定义尽量从组件文件中导出，方便用户按需引用
- 文案、注释、测试描述、文档全部使用中文
- 示例应覆盖基础用法、主要状态、自定义插槽或常见交互
- 示例文案使用真实业务语境，避免占位文本

## 检查命令

修改完成后运行：

```bash
pnpm check
```

如果只改单个组件，可先运行相关测试，再运行完整检查：

```bash
pnpm test -- <组件名>
pnpm check
```
