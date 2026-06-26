# Susu UI

Susu UI 是一个开发早期的个人前端组件库，当前优先支持 Vue 3。项目使用 monorepo 管理，把设计令牌、Web 主题能力和 Vue 组件实现拆成独立包。

## 当前状态

项目还在起步阶段，当前已具备：

- Vue 3 组件包 `@susu-ui/vue`
- Web 主题包 `@susu-ui/theme`
- 共享设计令牌包 `@susu-ui/tokens`
- 明暗模式切换
- 多主题色预设和动态色相调整
- 本地 playground
- 初始文档

## 包结构

```txt
susu-ui/
  packages/
    tokens/       设计令牌和主题基础配置。
    theme/        Web CSS 变量和运行时主题 API。
    vue/          Vue 3 组件库。
  playground/     本地调试示例。
  docs/           使用文档和技术设计文档。
```

## 开发

安装依赖：

```bash
pnpm install
```

启动 playground：

```bash
pnpm dev
```

类型检查和构建检查：

```bash
pnpm typecheck
```

构建组件库：

```bash
pnpm build
```

## 使用文档

- [文档入口](./docs/README.md)
- [快速开始](./docs/指南/快速开始.md)
- [主题](./docs/指南/主题.md)
- [Button 按钮](./docs/组件/Button%20按钮.md)

## 技术设计

内部架构、主题模型和后续规划见 [技术文档](./docs/技术文档.md)。
