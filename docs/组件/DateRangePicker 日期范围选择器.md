# DateRangePicker 日期范围选择器

日期范围选择器用于输入或选择开始日期和结束日期，默认使用 `[start, end]` 字符串数组作为绑定值。

## 基础用法

通过 `v-model` 绑定日期范围：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const range = ref<[string, string]>(['2026-06-01', '2026-06-15'])
</script>

<template>
  <SuDateRangePicker v-model="range" />
</template>
```

## 清空日期范围

设置 `clearable` 后，已有开始或结束日期时会显示清空按钮：

```vue
<template>
  <SuDateRangePicker v-model="range" clearable />
</template>
```

## 日期限制

通过 `min` 和 `max` 限制整体可选日期范围，组件也会自动限制开始日期不晚于结束日期、结束日期不早于开始日期：

```vue
<template>
  <SuDateRangePicker v-model="range" min="2026-06-01" max="2026-06-30" />
</template>
```

## 禁用日期

通过 `disabledDate` 自定义不可选日期，第二个参数用于区分开始或结束输入框：

```vue
<script setup lang="ts">
function disableWeekend(date: Date, type: 'start' | 'end') {
  return type === 'end' && (date.getDay() === 0 || date.getDay() === 6)
}
</script>

<template>
  <SuDateRangePicker v-model="range" :disabled-date="disableWeekend" />
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuDateRangePicker size="small" />
  <SuDateRangePicker status="error" />
</template>
```

## 表单校验

组件内部使用两个原生 `input`，支持分别设置 `startName`、`endName`、`startId` 和 `endId`：

```vue
<template>
  <SuDateRangePicker start-name="startDate" end-name="endDate" required />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDateRangePicker } from '@susu-ui/vue'
</script>

<template>
  <SuDateRangePicker v-model="range" />
</template>
```

## Props

| 参数               | 说明               | 类型                                             | 默认值       |
| ------------------ | ------------------ | ------------------------------------------------ | ------------ |
| `modelValue`       | 绑定值             | `[string, string]`                               | `['', '']`   |
| `size`             | 尺寸               | `'small' \| 'medium' \| 'large'`                 | 表单尺寸     |
| `status`           | 状态               | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  |
| `startPlaceholder` | 开始占位文本       | `string`                                         | `'开始日期'` |
| `endPlaceholder`   | 结束占位文本       | `string`                                         | `'结束日期'` |
| `disabled`         | 是否禁用           | `boolean`                                        | `false`      |
| `readonly`         | 是否只读           | `boolean`                                        | `false`      |
| `clearable`        | 是否支持清空       | `boolean`                                        | `false`      |
| `min`              | 最小可选日期       | `string`                                         | `undefined`  |
| `max`              | 最大可选日期       | `string`                                         | `undefined`  |
| `disabledDate`     | 自定义禁用日期     | `(date, type) => boolean`                        | `undefined`  |
| `startName`        | 开始输入框 `name`  | `string`                                         | `undefined`  |
| `endName`          | 结束输入框 `name`  | `string`                                         | `undefined`  |
| `startId`          | 开始输入框 `id`    | `string`                                         | `undefined`  |
| `endId`            | 结束输入框 `id`    | `string`                                         | `undefined`  |
| `required`         | 是否必填           | `boolean`                                        | `false`      |
| `autocomplete`     | 原生自动完成属性   | `string`                                         | `undefined`  |
| `startAriaLabel`   | 开始输入可访问名称 | `string`                                         | `'开始日期'` |
| `endAriaLabel`     | 结束输入可访问名称 | `string`                                         | `'结束日期'` |
| `separator`        | 分隔文本           | `string`                                         | `'至'`       |

## 事件

| 名称      | 说明               | 参数            |
| --------- | ------------------ | --------------- |
| `change`  | 日期范围变化时触发 | `(value)`       |
| `focus`   | 聚焦时触发         | `(event, type)` |
| `blur`    | 失焦时触发         | `(event, type)` |
| `clear`   | 清空日期范围时触发 | -               |
| `open`    | 面板打开时触发     | `(type)`        |
| `close`   | 面板关闭时触发     | `(type)`        |
| `invalid` | 原生校验失败时触发 | `(event, type)` |

## 暴露方法

| 名称    | 说明             |
| ------- | ---------------- |
| `focus` | 聚焦开始输入框   |
| `blur`  | 失焦两个输入框   |
| `open`  | 打开指定日期面板 |
| `close` | 关闭两个日期面板 |
| `clear` | 清空日期范围     |
