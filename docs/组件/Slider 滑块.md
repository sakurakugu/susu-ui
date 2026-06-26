# Slider 滑块

用于在连续或分段范围内选择数值。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(36)
</script>

<template>
  <SuSlider v-model="value" />
</template>
```

## 范围和步进

通过 `min`、`max` 和 `step` 控制可选范围与步进。

```vue
<SuSlider v-model="value" :min="0" :max="10" :step="0.5" />
```

## 范围选择

设置 `range` 后，`v-model` 使用 `[start, end]` 数组。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const rangeValue = ref<[number, number]>([20, 60])
</script>

<template>
  <SuSlider v-model="rangeValue" range />
</template>
```

## 刻度点

`show-stops` 展示步进刻度，`marks` 展示带标签的关键刻度。点击刻度标签可以切换到对应值。

```vue
<SuSlider
  v-model="value"
  :step="10"
  show-stops
  :marks="{ 0: '低', 50: '中', 100: '高' }"
/>
```

## 格式化提示

通过 `format-tooltip` 自定义悬浮提示和无障碍读值。

```vue
<SuSlider v-model="value" :format-tooltip="(value) => `${value}%`" />
```

## 尺寸和状态

支持 `small`、`medium`、`large` 三种尺寸，也支持禁用和只读状态。

```vue
<SuSlider v-model="value" size="small" />
<SuSlider v-model="value" size="large" />
<SuSlider :model-value="30" disabled />
<SuSlider :model-value="30" readonly />
```

## API

### 属性

| 属性               | 说明                   | 类型                                     | 默认值      |
| ------------------ | ---------------------- | ---------------------------------------- | ----------- |
| `v-model`          | 当前值                 | `number \| [number, number]`             | `0`         |
| `min`              | 最小值                 | `number`                                 | `0`         |
| `max`              | 最大值                 | `number`                                 | `100`       |
| `step`             | 步进                   | `number`                                 | `1`         |
| `range`            | 是否范围选择           | `boolean`                                | `false`     |
| `size`             | 尺寸                   | `'small' \| 'medium' \| 'large'`         | 表单尺寸    |
| `disabled`         | 是否禁用               | `boolean`                                | `false`     |
| `readonly`         | 是否只读               | `boolean`                                | `false`     |
| `show-stops`       | 是否显示步进刻度       | `boolean`                                | `false`     |
| `show-tooltip`     | 是否显示悬浮提示       | `boolean`                                | `true`      |
| `marks`            | 关键刻度               | `SliderMark[] \| Record<number, string>` | `undefined` |
| `format-tooltip`   | 格式化提示文本         | `(value: number) => string`              | `undefined` |
| `aria-label`       | 单值滑块无障碍标签     | `string`                                 | `'滑块'`    |
| `aria-label-start` | 范围起点滑块无障碍标签 | `string`                                 | `'起始值'`  |
| `aria-label-end`   | 范围终点滑块无障碍标签 | `string`                                 | `'结束值'`  |
| `name`             | 原生表单字段名         | `string`                                 | `undefined` |
| `id`               | 原生输入框 id          | `string`                                 | `undefined` |

### 事件

| 事件名   | 说明             | 回调参数                 |
| -------- | ---------------- | ------------------------ |
| `input`  | 拖动过程中触发   | `(value, event) => void` |
| `change` | 值提交变化时触发 | `(value, event) => void` |
| `focus`  | 聚焦时触发       | `(event) => void`        |
| `blur`   | 失焦时触发       | `(event) => void`        |

### 暴露方法

| 方法名  | 说明     |
| ------- | -------- |
| `focus` | 聚焦滑块 |
| `blur`  | 失焦滑块 |
