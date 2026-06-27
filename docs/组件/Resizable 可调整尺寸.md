# Resizable 可调整尺寸

用于让内容区域通过拖拽或键盘调整宽度、高度。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const size = ref({
  width: 360,
  height: 220,
})
</script>

<template>
  <SuResizable v-model="size" :min-width="240" :min-height="160">
    <div>销售看板</div>
  </SuResizable>
</template>
```

## 单轴调整

设置 `direction` 为 `horizontal` 或 `vertical` 后，`v-model` 可以直接使用数字表示主轴尺寸。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const width = ref(280)
const height = ref(180)
</script>

<template>
  <SuResizable v-model="width" direction="horizontal" :height="160" />
  <SuResizable v-model="height" direction="vertical" :width="360" />
</template>
```

## 步进和边界

通过 `step`、`min-width`、`max-width`、`min-height`、`max-height` 控制调整粒度和边界。

```vue
<SuResizable
  v-model="size"
  :step="8"
  :min-width="240"
  :max-width="640"
  :min-height="160"
  :max-height="360"
/>
```

## 禁用状态

```vue
<SuResizable :width="280" :height="160" disabled>
  <div>归档内容</div>
</SuResizable>
```

## API

### 属性

| 属性         | 说明               | 类型                                            | 默认值       |
| ------------ | ------------------ | ----------------------------------------------- | ------------ |
| `v-model`    | 当前尺寸           | `number \| { width?: number; height?: number }` | `undefined`  |
| `direction`  | 调整方向           | `'horizontal' \| 'vertical' \| 'both'`          | `'both'`     |
| `width`      | 初始宽度           | `number`                                        | `undefined`  |
| `height`     | 初始高度           | `number`                                        | `undefined`  |
| `min-width`  | 最小宽度           | `number`                                        | `80`         |
| `max-width`  | 最大宽度           | `number`                                        | `Infinity`   |
| `min-height` | 最小高度           | `number`                                        | `80`         |
| `max-height` | 最大高度           | `number`                                        | `Infinity`   |
| `disabled`   | 是否禁用调整       | `boolean`                                       | `false`      |
| `step`       | 拖拽和键盘调整步进 | `number`                                        | `1`          |
| `aria-label` | 调整手柄无障碍标签 | `string`                                        | `'调整尺寸'` |

### 事件

| 事件名         | 说明           | 回调参数                 |
| -------------- | -------------- | ------------------------ |
| `resize-start` | 开始拖拽时触发 | `(value, event) => void` |
| `resize`       | 尺寸变化时触发 | `(value, event) => void` |
| `resize-end`   | 拖拽结束时触发 | `(value, event) => void` |

### 插槽

| 插槽名    | 说明     |
| --------- | -------- |
| `default` | 区域内容 |
