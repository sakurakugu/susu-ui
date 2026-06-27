# TimeRangePicker 时间范围选择器

时间范围选择器用于输入或选择开始时间和结束时间，默认使用 `[start, end]` 字符串数组作为绑定值。

## 基础用法

通过 `v-model` 绑定时间范围：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const range = ref<[string, string]>(['09:00:00', '18:00:00'])
</script>

<template>
  <SuTimeRangePicker v-model="range" />
</template>
```

## 清空时间范围

设置 `clearable` 后，已有开始或结束时间时会显示清空按钮：

```vue
<template>
  <SuTimeRangePicker v-model="range" clearable />
</template>
```

## 分钟格式

通过 `format="HH:mm"` 使用不带秒的时间：

```vue
<template>
  <SuTimeRangePicker v-model="range" format="HH:mm" />
</template>
```

## 步进间隔

通过 `hourStep`、`minuteStep`、`secondStep` 控制面板选项间隔：

```vue
<template>
  <SuTimeRangePicker v-model="range" :minute-step="30" />
</template>
```

## 时间限制

通过 `min` 和 `max` 限制整体可选时间范围，组件也会自动限制开始时间不晚于结束时间、结束时间不早于开始时间：

```vue
<template>
  <SuTimeRangePicker v-model="range" min="09:00:00" max="18:00:00" />
</template>
```

## 禁用时间

通过 `disabledTime` 自定义不可选时间，第二个参数用于区分开始或结束输入框：

```vue
<script setup lang="ts">
function disableLunch(
  time: { hour: number; minute: number; second: number },
  type: 'start' | 'end',
) {
  return type === 'end' && time.hour === 12
}
</script>

<template>
  <SuTimeRangePicker v-model="range" :disabled-time="disableLunch" />
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuTimeRangePicker size="small" />
  <SuTimeRangePicker status="error" />
</template>
```

## 表单校验

组件内部使用两个原生 `input`，支持分别设置 `startName`、`endName`、`startId` 和 `endId`：

```vue
<template>
  <SuTimeRangePicker start-name="startTime" end-name="endTime" required />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTimeRangePicker } from '@susu-ui/vue'
</script>

<template>
  <SuTimeRangePicker v-model="range" />
</template>
```

## Props

| 参数               | 说明               | 类型                                             | 默认值       |
| ------------------ | ------------------ | ------------------------------------------------ | ------------ |
| `modelValue`       | 绑定值             | `[string, string]`                               | `['', '']`   |
| `size`             | 尺寸               | `'small' \| 'medium' \| 'large'`                 | 表单尺寸     |
| `status`           | 状态               | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  |
| `startPlaceholder` | 开始占位文本       | `string`                                         | `'开始时间'` |
| `endPlaceholder`   | 结束占位文本       | `string`                                         | `'结束时间'` |
| `disabled`         | 是否禁用           | `boolean`                                        | `false`      |
| `readonly`         | 是否只读           | `boolean`                                        | `false`      |
| `clearable`        | 是否支持清空       | `boolean`                                        | `false`      |
| `format`           | 时间格式           | `'HH:mm' \| 'HH:mm:ss'`                          | `'HH:mm:ss'` |
| `hourStep`         | 小时间隔           | `number`                                         | `1`          |
| `minuteStep`       | 分钟间隔           | `number`                                         | `1`          |
| `secondStep`       | 秒间隔             | `number`                                         | `1`          |
| `min`              | 最小可选时间       | `string`                                         | `undefined`  |
| `max`              | 最大可选时间       | `string`                                         | `undefined`  |
| `disabledTime`     | 自定义禁用时间     | `(time, type) => boolean`                        | `undefined`  |
| `startName`        | 开始输入框 `name`  | `string`                                         | `undefined`  |
| `endName`          | 结束输入框 `name`  | `string`                                         | `undefined`  |
| `startId`          | 开始输入框 `id`    | `string`                                         | `undefined`  |
| `endId`            | 结束输入框 `id`    | `string`                                         | `undefined`  |
| `required`         | 是否必填           | `boolean`                                        | `false`      |
| `autocomplete`     | 原生自动完成属性   | `string`                                         | `undefined`  |
| `startAriaLabel`   | 开始输入可访问名称 | `string`                                         | `'开始时间'` |
| `endAriaLabel`     | 结束输入可访问名称 | `string`                                         | `'结束时间'` |
| `separator`        | 分隔文本           | `string`                                         | `'至'`       |

## 事件

| 名称      | 说明               | 参数                   |
| --------- | ------------------ | ---------------------- |
| `input`   | 输入时触发         | `(value, type, event)` |
| `change`  | 时间范围变化时触发 | `(value, type, event)` |
| `focus`   | 聚焦时触发         | `(event, type)`        |
| `blur`    | 失焦时触发         | `(event, type)`        |
| `clear`   | 清空时间范围时触发 | -                      |
| `open`    | 面板打开时触发     | `(type)`               |
| `close`   | 面板关闭时触发     | `(type)`               |
| `invalid` | 原生校验失败时触发 | `(event, type)`        |

## 暴露方法

| 名称    | 说明             |
| ------- | ---------------- |
| `focus` | 聚焦开始输入框   |
| `blur`  | 失焦两个输入框   |
| `open`  | 打开指定时间面板 |
| `close` | 关闭两个时间面板 |
| `clear` | 清空时间范围     |
