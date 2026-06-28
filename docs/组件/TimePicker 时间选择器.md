# TimePicker 时间选择器

时间选择器用于输入或选择单个时间，默认使用 `HH:mm:ss` 字符串作为绑定值。

## 基础用法

通过 `v-model` 绑定时间：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const time = ref('09:30:00')
</script>

<template>
  <SuTimePicker v-model="time" placeholder="请选择时间" />
</template>
```

## 清空时间

设置 `clearable` 后，已有时间时会显示清空按钮：

```vue
<template>
  <SuTimePicker v-model="time" clearable />
</template>
```

## 分钟格式

通过 `format="HH:mm"` 使用不带秒的时间：

```vue
<template>
  <SuTimePicker v-model="time" format="HH:mm" />
</template>
```

## 步进间隔

通过 `hourStep`、`minuteStep`、`secondStep` 控制面板选项间隔：

```vue
<template>
  <SuTimePicker v-model="time" :minute-step="15" :second-step="30" />
</template>
```

## 时间限制

通过 `min` 和 `max` 限制可选时间范围：

```vue
<template>
  <SuTimePicker v-model="time" min="09:00:00" max="18:00:00" placeholder="请选择工作时间" />
</template>
```

## 禁用时间

通过 `disabledTime` 自定义不可选时间：

```vue
<script setup lang="ts">
function disableLunch(time: { hour: number; minute: number; second: number }) {
  return time.hour === 12
}
</script>

<template>
  <SuTimePicker v-model="time" :disabled-time="disableLunch" />
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuTimePicker size="small" />
  <SuTimePicker status="error" />
</template>
```

## 表单校验

组件内部使用原生 `input`，支持 `name`、`required` 等表单属性：

```vue
<template>
  <SuTimePicker name="startTime" required placeholder="请选择开始时间" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTimePicker } from '@susu-ui/vue'
</script>

<template>
  <SuTimePicker v-model="time" />
</template>
```

## Props

| 参数           | 说明             | 类型                                             | 默认值         |
| -------------- | ---------------- | ------------------------------------------------ | -------------- |
| `modelValue`   | 绑定值           | `string`                                         | `''`           |
| `size`         | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸       |
| `status`       | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`    |
| `placeholder`  | 占位文本         | `string`                                         | `'请选择时间'` |
| `disabled`     | 是否禁用         | `boolean`                                        | `false`        |
| `readonly`     | 是否只读         | `boolean`                                        | `false`        |
| `clearable`    | 是否支持清空     | `boolean`                                        | `false`        |
| `format`       | 时间格式         | `'HH:mm' \| 'HH:mm:ss'`                          | `'HH:mm:ss'`   |
| `hourStep`     | 小时间隔         | `number`                                         | `1`            |
| `minuteStep`   | 分钟间隔         | `number`                                         | `1`            |
| `secondStep`   | 秒间隔           | `number`                                         | `1`            |
| `min`          | 最小可选时间     | `string`                                         | `undefined`    |
| `max`          | 最大可选时间     | `string`                                         | `undefined`    |
| `disabledTime` | 自定义禁用时间   | `(time) => boolean`                              | `undefined`    |
| `name`         | 原生 `name` 属性 | `string`                                         | `undefined`    |
| `id`           | 原生 `id` 属性   | `string`                                         | `undefined`    |
| `required`     | 是否必填         | `boolean`                                        | `false`        |
| `autocomplete` | 原生自动完成属性 | `string`                                         | `undefined`    |
| `ariaLabel`    | 输入框可访问名称 | `string`                                         | `'时间选择'`   |

## 事件

| 名称      | 说明               | 参数             |
| --------- | ------------------ | ---------------- |
| `input`   | 输入时触发         | `(value, event)` |
| `change`  | 时间变化时触发     | `(value, event)` |
| `focus`   | 聚焦时触发         | `(event)`        |
| `blur`    | 失焦时触发         | `(event)`        |
| `clear`   | 清空时间时触发     | -                |
| `open`    | 面板打开时触发     | -                |
| `close`   | 面板关闭时触发     | -                |
| `invalid` | 原生校验失败时触发 | `(event)`        |

## 暴露方法

| 名称    | 说明       |
| ------- | ---------- |
| `focus` | 聚焦输入框 |
| `blur`  | 失焦输入框 |
| `open`  | 打开面板   |
| `close` | 关闭面板   |
| `clear` | 清空时间   |
