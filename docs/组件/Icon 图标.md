# Icon 图标

图标用于承载内联 SVG，默认继承当前文字颜色和字号。

## 基础用法

```vue
<template>
  <SuIcon>
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  </SuIcon>
</template>
```

## 尺寸和颜色

通过 `size` 设置图标尺寸，通过 `color` 设置图标颜色：

```vue
<template>
  <SuIcon :size="20" color="var(--su-color-primary)">
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  </SuIcon>
</template>
```

## 在按钮中使用

```vue
<template>
  <SuButton type="primary">
    <template #prefix>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </SuIcon>
    </template>
    新建
  </SuButton>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuIcon } from '@susu-ui/vue'
</script>
```

## Props

| 参数    | 说明     | 类型               | 默认值 |
| ------- | -------- | ------------------ | ------ |
| `size`  | 图标尺寸 | `number \| string` | -      |
| `color` | 图标颜色 | `string`           | -      |

## 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `default` | SVG 图标内容 |
