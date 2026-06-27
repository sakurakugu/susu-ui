# Calendar 日历

日历用于展示月份视图，并支持选择单个日期。绑定值使用 `YYYY-MM-DD` 字符串。

## 基础用法

通过 `v-model` 绑定选中的日期：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const date = ref('2026-06-27')
</script>

<template>
  <SuCalendar v-model="date" />
</template>
```

## 日期限制

通过 `min` 和 `max` 限制可选日期范围：

```vue
<template>
  <SuCalendar v-model="date" min="2026-06-01" max="2026-06-30" />
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
  <SuCalendar v-model="date" :disabled-date="disableWeekend" />
</template>
```

## 面板显示

设置 `showAdjacentMonths` 可以控制是否展示相邻月份日期，设置 `showToday` 可以控制底部今天按钮：

```vue
<template>
  <SuCalendar
    v-model="date"
    :show-adjacent-months="false"
    :show-today="false"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCalendar } from '@susu-ui/vue'
</script>

<template>
  <SuCalendar v-model="date" />
</template>
```

## Props

| 参数                 | 说明                 | 类型                             | 默认值      |
| -------------------- | -------------------- | -------------------------------- | ----------- |
| `modelValue`         | 绑定值               | `string`                         | `''`        |
| `size`               | 尺寸                 | `'small' \| 'medium' \| 'large'` | `'medium'`  |
| `min`                | 最小可选日期         | `string`                         | `undefined` |
| `max`                | 最大可选日期         | `string`                         | `undefined` |
| `disabledDate`       | 自定义禁用日期       | `(date: Date) => boolean`        | `undefined` |
| `disabled`           | 是否禁用             | `boolean`                        | `false`     |
| `readonly`           | 是否只读             | `boolean`                        | `false`     |
| `showAdjacentMonths` | 是否展示相邻月份日期 | `boolean`                        | `true`      |
| `showToday`          | 是否展示今天按钮     | `boolean`                        | `true`      |
| `ariaLabel`          | 可访问名称           | `string`                         | `'日历'`    |

## 事件

| 名称          | 说明               | 参数            |
| ------------- | ------------------ | --------------- |
| `change`      | 日期变化时触发     | `(value)`       |
| `panelChange` | 面板年月变化时触发 | `(year, month)` |

## 暴露方法

| 名称            | 说明           |
| --------------- | -------------- |
| `focusDate`     | 切换到指定日期 |
| `previousMonth` | 切换到上一月   |
| `nextMonth`     | 切换到下一月   |
| `previousYear`  | 切换到上一年   |
| `nextYear`      | 切换到下一年   |
| `selectToday`   | 选择今天       |
