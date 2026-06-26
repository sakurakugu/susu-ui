# Divider 分割线

分割线用于区隔内容区域或行内元素。

## 基础用法

```vue
<template>
  <p>上方内容</p>
  <SuDivider />
  <p>下方内容</p>
</template>
```

## 带文字

通过默认插槽展示分组标题：

```vue
<template>
  <SuDivider>基础信息</SuDivider>
</template>
```

## 文字位置

通过 `contentPosition` 控制文字位置：

```vue
<template>
  <SuDivider content-position="left">左侧标题</SuDivider>
  <SuDivider>居中标题</SuDivider>
  <SuDivider content-position="right">右侧标题</SuDivider>
</template>
```

## 虚线

通过 `dashed` 展示虚线分割线：

```vue
<template>
  <SuDivider dashed>虚线分割</SuDivider>
</template>
```

## 纵向分割线

通过 `direction` 设置纵向分割线：

```vue
<template>
  <span>选项一</span>
  <SuDivider direction="vertical" />
  <span>选项二</span>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDivider } from '@susu-ui/vue'
</script>

<template>
  <SuDivider>标题</SuDivider>
</template>
```

## Props

| 参数              | 说明         | 类型                            | 默认值         |
| ----------------- | ------------ | ------------------------------- | -------------- |
| `direction`       | 分割线方向   | `'horizontal' \| 'vertical'`    | `'horizontal'` |
| `dashed`          | 是否虚线     | `boolean`                       | `false`        |
| `contentPosition` | 横向文字位置 | `'left' \| 'center' \| 'right'` | `'center'`     |

## 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 横向分割线的内容 |
