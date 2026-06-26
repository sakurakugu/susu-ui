# DatePicker 日期选择器

日期选择器用于输入或选择单个日期，默认使用 `YYYY-MM-DD` 字符串作为绑定值。

## 基础用法

通过 `v-model` 绑定日期：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2026-06-27')
</script>

<template>
  <SuDatePicker v-model="date" placeholder="请选择日期" />
</template>
```

## 清空日期

设置 `clearable` 后，已有日期时会显示清空按钮：

```vue
<template>
  <SuDatePicker v-model="date" clearable />
</template>
```

## 日期限制

通过 `min` 和 `max` 限制可选日期范围：

```vue
<template>
  <SuDatePicker
    v-model="date"
    min="2026-06-01"
    max="2026-06-30"
    placeholder="请选择 2026 年 6 月内的日期"
  />
</template>
```

## 禁用日期

通过 `disabledDate` 自定义不可选日期：

```vue
<script setup lang="ts">
function disableWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<template>
  <SuDatePicker v-model="date" :disabled-date="disableWeekend" />
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuDatePicker size="small" />
  <SuDatePicker status="error" />
</template>
```

## 表单校验

组件内部使用原生 `input`，支持 `name`、`required` 等表单属性：

```vue
<template>
  <SuDatePicker name="startDate" required placeholder="请选择开始日期" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDatePicker } from '@susu-ui/vue'
</script>

<template>
  <SuDatePicker v-model="date" />
</template>
```

## Props

| 参数           | 说明             | 类型                                             | 默认值         |
| -------------- | ---------------- | ------------------------------------------------ | -------------- |
| `modelValue`   | 绑定值           | `string`                                         | `''`           |
| `size`         | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸       |
| `status`       | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`    |
| `placeholder`  | 占位文本         | `string`                                         | `'请选择日期'` |
| `disabled`     | 是否禁用         | `boolean`                                        | `false`        |
| `readonly`     | 是否只读         | `boolean`                                        | `false`        |
| `clearable`    | 是否支持清空     | `boolean`                                        | `false`        |
| `min`          | 最小可选日期     | `string`                                         | `undefined`    |
| `max`          | 最大可选日期     | `string`                                         | `undefined`    |
| `disabledDate` | 自定义禁用日期   | `(date: Date) => boolean`                        | `undefined`    |
| `name`         | 原生 `name` 属性 | `string`                                         | `undefined`    |
| `id`           | 原生 `id` 属性   | `string`                                         | `undefined`    |
| `required`     | 是否必填         | `boolean`                                        | `false`        |
| `autocomplete` | 原生自动完成属性 | `string`                                         | `undefined`    |
| `ariaLabel`    | 输入框可访问名称 | `string`                                         | `'日期选择'`   |

## 事件

| 名称      | 说明               | 参数      |
| --------- | ------------------ | --------- |
| `change`  | 日期变化时触发     | `(value)` |
| `focus`   | 聚焦时触发         | `(event)` |
| `blur`    | 失焦时触发         | `(event)` |
| `clear`   | 清空日期时触发     | -         |
| `open`    | 面板打开时触发     | -         |
| `close`   | 面板关闭时触发     | -         |
| `invalid` | 原生校验失败时触发 | `(event)` |

## 暴露方法

| 名称    | 说明       |
| ------- | ---------- |
| `focus` | 聚焦输入框 |
| `blur`  | 失焦输入框 |
| `open`  | 打开面板   |
| `close` | 关闭面板   |
| `clear` | 清空日期   |
