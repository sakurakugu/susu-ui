# Splitter 分割面板

用于将容器分成两个可拖拽调整比例的面板。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const size = ref(280)
</script>

<template>
  <SuSplitter v-model="size" :min="200" :max="480">
    <template #first>列表</template>
    <template #second>详情</template>
  </SuSplitter>
</template>
```

## 垂直分割

设置 `direction="vertical"` 后，上下面板通过水平拖拽条分隔。

```vue
<SuSplitter direction="vertical" default-size="45%" :min="120">
  <template #first>查询条件</template>
  <template #second>结果预览</template>
</SuSplitter>
```

## 步进和边界

`v-model` 表示第一个面板的像素尺寸。`default-size` 支持数字、像素字符串和百分比字符串。

```vue
<SuSplitter v-model="size" default-size="40%" :min="160" :max="520" :step="8" />
```

## API

### 属性

| 属性           | 说明                 | 类型                         | 默认值           |
| -------------- | -------------------- | ---------------------------- | ---------------- |
| `v-model`      | 第一个面板的像素尺寸 | `number \| string`           | `undefined`      |
| `direction`    | 分割方向             | `'horizontal' \| 'vertical'` | `'horizontal'`   |
| `default-size` | 非受控初始尺寸       | `number \| string`           | `'50%'`          |
| `min`          | 第一个面板最小尺寸   | `number`                     | `80`             |
| `max`          | 第一个面板最大尺寸   | `number`                     | `Infinity`       |
| `disabled`     | 是否禁用调整         | `boolean`                    | `false`          |
| `step`         | 拖拽和键盘调整步进   | `number`                     | `1`              |
| `aria-label`   | 调整条无障碍标签     | `string`                     | `'调整面板尺寸'` |

### 事件

| 事件名         | 说明           | 回调参数                |
| -------------- | -------------- | ----------------------- |
| `resize-start` | 开始拖拽时触发 | `(size, event) => void` |
| `resize`       | 尺寸变化时触发 | `(size, event) => void` |
| `resize-end`   | 拖拽结束时触发 | `(size, event) => void` |

### 插槽

| 插槽名   | 说明       |
| -------- | ---------- |
| `first`  | 第一个面板 |
| `second` | 第二个面板 |
