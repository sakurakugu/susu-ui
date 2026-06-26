# Skeleton 骨架屏

骨架屏用于在内容加载过程中展示占位结构，降低页面空白感。

## 基础用法

```vue
<template>
  <SuSkeleton />
</template>
```

## 多行段落

通过 `rows` 设置段落行数，最后一行会自动缩短：

```vue
<template>
  <SuSkeleton :rows="4" />
</template>
```

## 图形占位

通过 `variant` 设置文本、矩形或圆形占位：

```vue
<template>
  <SuSkeleton variant="rect" height="160px" />
  <SuSkeleton variant="circle" :width="48" :height="48" />
</template>
```

## 尺寸和圆角

`width` 和 `height` 支持数字或 CSS 长度字符串，通过 `round` 使用圆角胶囊样式：

```vue
<template>
  <SuSkeleton width="60%" />
  <SuSkeleton variant="rect" :height="32" round />
</template>
```

## 关闭动画

通过 `animated` 控制是否显示加载动画：

```vue
<template>
  <SuSkeleton :animated="false" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuSkeleton } from '@susu-ui/vue'
</script>

<template>
  <SuSkeleton :rows="3" />
</template>
```

## Props

| 参数       | 说明             | 类型                           | 默认值   |
| ---------- | ---------------- | ------------------------------ | -------- |
| `variant`  | 占位形态         | `'text' \| 'rect' \| 'circle'` | `'text'` |
| `width`    | 占位宽度         | `number \| string`             | -        |
| `height`   | 占位高度         | `number \| string`             | -        |
| `rows`     | 段落行数         | `number`                       | `1`      |
| `animated` | 是否显示加载动画 | `boolean`                      | `true`   |
| `round`    | 是否显示圆角形态 | `boolean`                      | `false`  |
