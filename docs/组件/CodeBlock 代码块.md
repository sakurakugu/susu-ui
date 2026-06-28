# CodeBlock 代码块

代码块用于展示 Markdown 代码围栏、配置片段和接口返回内容，支持标题、语言标识、行号、复制和最大高度。

## 基础用法

```vue
<script setup lang="ts">
const code = `pnpm add @susu-ui/vue
pnpm check`
</script>

<template>
  <SuCodeBlock title="安装命令" language="bash" :code="code" />
</template>
```

## 行号

通过 `show-line-numbers` 展示行号，适合文档示例和排查说明。

```vue
<template>
  <SuCodeBlock title="入口文件" language="ts" :code="code" show-line-numbers />
</template>
```

## 深色样式和换行

通过 `theme="dark"` 使用深色代码块，通过 `wrap` 允许长行自动换行。

```vue
<template>
  <SuCodeBlock title="接口返回" language="json" theme="dark" :code="response" wrap />
</template>
```

## 高度限制

通过 `max-height` 限制代码区域高度，超出后在代码区域内滚动。

```vue
<template>
  <SuCodeBlock :code="longCode" :max-height="320" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCodeBlock } from '@susu-ui/vue'
</script>

<template>
  <SuCodeBlock language="ts" code="const enabled = true" />
</template>
```

## Props

| 参数              | 说明               | 类型                | 默认值      |
| ----------------- | ------------------ | ------------------- | ----------- |
| `code`            | 代码内容           | `string`            | `''`        |
| `language`        | 语言标识           | `string`            | `''`        |
| `title`           | 标题               | `string`            | `undefined` |
| `theme`           | 样式主题           | `'light' \| 'dark'` | `'light'`   |
| `showHeader`      | 是否展示头部       | `boolean`           | `true`      |
| `showLineNumbers` | 是否展示行号       | `boolean`           | `false`     |
| `copyable`        | 是否展示复制按钮   | `boolean`           | `true`      |
| `wrap`            | 是否允许长行换行   | `boolean`           | `false`     |
| `maxHeight`       | 代码区域最大高度   | `number \| string`  | `undefined` |
| `ariaLabel`       | 代码区域无障碍标签 | `string`            | `'代码块'`  |

## 事件

| 名称   | 说明           | 参数             |
| ------ | -------------- | ---------------- |
| `copy` | 点击复制后触发 | `(code: string)` |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 自定义代码内容 |
| `title`   | 自定义标题内容 |
| `actions` | 自定义头部操作 |
