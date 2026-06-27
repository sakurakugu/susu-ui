# Segmented 分段控制器

分段控制器用于在少量互斥选项之间快速切换，适合视图模式、时间范围和筛选条件。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('week')

const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]
</script>

<template>
  <SuSegmented v-model="value" :options="options" />
</template>
```

## 禁用选项

在单个选项上设置 `disabled` 可以禁用该项：

```vue
<template>
  <SuSegmented
    model-value="list"
    :options="[
      { label: '列表', value: 'list' },
      { label: '网格', value: 'grid' },
      { label: '看板', value: 'board', disabled: true },
    ]"
  />
</template>
```

## 尺寸

通过 `size` 设置分段控制器尺寸：

```vue
<template>
  <SuSegmented size="small" :options="options" />
  <SuSegmented :options="options" />
  <SuSegmented size="large" :options="options" />
</template>
```

## 块级展示

设置 `block` 后组件会撑满父容器宽度：

```vue
<template>
  <SuSegmented v-model="value" block :options="options" />
</template>
```

## 禁用状态

设置 `disabled` 禁用整组操作：

```vue
<template>
  <SuSegmented disabled :options="options" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuSegmented } from '@susu-ui/vue'
</script>

<template>
  <SuSegmented :options="options" />
</template>
```

## Props

| 参数         | 说明             | 类型                             | 默认值      |
| ------------ | ---------------- | -------------------------------- | ----------- |
| `modelValue` | 绑定值           | `string \| number \| boolean`    | `undefined` |
| `options`    | 选项列表         | `SegmentedOption[]`              | 必填        |
| `size`       | 尺寸             | `'small' \| 'medium' \| 'large'` | 表单尺寸    |
| `disabled`   | 是否禁用整组     | `boolean`                        | `false`     |
| `block`      | 是否撑满父容器   | `boolean`                        | `false`     |
| `name`       | 原生 `name` 属性 | `string`                         | `undefined` |

## SegmentedOption

| 参数       | 说明         | 类型                          | 默认值  |
| ---------- | ------------ | ----------------------------- | ------- |
| `label`    | 选项文本     | `string`                      | 必填    |
| `value`    | 选项值       | `string \| number \| boolean` | 必填    |
| `disabled` | 是否禁用选项 | `boolean`                     | `false` |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 选中变化时触发 | `(value, event)` |
