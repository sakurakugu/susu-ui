# Button 按钮

按钮用于触发一个即时操作。

## 基础用法

```vue
<template>
  <SuButton>默认按钮</SuButton>
  <SuButton type="primary">主要按钮</SuButton>
</template>
```

## 禁用状态

通过 `disabled` 禁用按钮：

```vue
<template>
  <SuButton disabled>禁用按钮</SuButton>
  <SuButton type="primary" disabled>禁用主要按钮</SuButton>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuButton } from '@susu-ui/vue'
</script>

<template>
  <SuButton type="primary">提交</SuButton>
</template>
```

## Props

| 参数       | 说明     | 类型                     | 默认值      |
| ---------- | -------- | ------------------------ | ----------- |
| `type`     | 按钮类型 | `'default' \| 'primary'` | `'default'` |
| `disabled` | 是否禁用 | `boolean`                | `false`     |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 按钮内容 |
