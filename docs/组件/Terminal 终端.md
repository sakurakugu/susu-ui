# Terminal 终端

终端用于展示命令执行结果、构建日志和运维输出。它内部复用 `SuCodeBlock` 承载等宽文本、滚动和复制能力，但对外是独立组件。

## 基础用法

```vue
<script setup lang="ts">
const content = `pnpm check
packages/vue typecheck passed
全部检查通过`
</script>

<template>
  <SuTerminal title="发布检查" status="success" :content="content" />
</template>
```

## 结构化行

通过 `lines` 传入结构化输出。`type: 'command'` 的行会自动添加提示符。

```vue
<script setup lang="ts">
const lines = [
  { type: 'command', text: 'pnpm build' },
  { type: 'output', text: 'vite build completed' },
  { type: 'success', text: '产物已生成' },
]
</script>

<template>
  <SuTerminal title="构建日志" status="success" :lines="lines" />
</template>
```

## 运行状态

通过 `status` 表达当前终端任务状态。

```vue
<template>
  <SuTerminal title="实时日志" status="running" :content="serviceLog" />
</template>
```

## 换行和高度

通过 `wrap` 允许长日志换行，通过 `max-height` 限制终端内容区域高度。

```vue
<template>
  <SuTerminal :content="longLog" wrap :max-height="360" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTerminal } from '@susu-ui/vue'
</script>

<template>
  <SuTerminal content="pnpm test" />
</template>
```

## Props

| 参数         | 说明               | 类型                                          | 默认值       |
| ------------ | ------------------ | --------------------------------------------- | ------------ |
| `title`      | 终端标题           | `string`                                      | `'终端'`     |
| `content`    | 终端文本内容       | `string`                                      | `''`         |
| `lines`      | 结构化终端行       | `TerminalLine[]`                              | `undefined`  |
| `prompt`     | 命令行提示符       | `string`                                      | `'$'`        |
| `status`     | 运行状态           | `'idle' \| 'running' \| 'success' \| 'error'` | `'idle'`     |
| `showHeader` | 是否展示终端头部   | `boolean`                                     | `true`       |
| `copyable`   | 是否展示复制按钮   | `boolean`                                     | `true`       |
| `wrap`       | 是否允许长行换行   | `boolean`                                     | `false`      |
| `maxHeight`  | 内容区域最大高度   | `number \| string`                            | `320`        |
| `ariaLabel`  | 内容区域无障碍标签 | `string`                                      | `'终端输出'` |

## TerminalLine

| 字段     | 说明         | 类型                                                                   | 默认值        |
| -------- | ------------ | ---------------------------------------------------------------------- | ------------- |
| `type`   | 行类型       | `'command' \| 'output' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'output'`    |
| `text`   | 行内容       | `string`                                                               | -             |
| `prompt` | 当前行提示符 | `string`                                                               | 组件 `prompt` |

## 事件

| 名称   | 说明                 | 参数                |
| ------ | -------------------- | ------------------- |
| `copy` | 点击复制终端内容触发 | `(content: string)` |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `title`   | 自定义终端标题 |
| `actions` | 自定义头部操作 |
