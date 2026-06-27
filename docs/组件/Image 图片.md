# Image 图片

图片组件用于展示远程或本地图片，支持固定尺寸、填充方式、懒加载、加载占位、错误回退和预览点击事件。

## 基础用法

通过 `src` 设置图片地址，`alt` 设置图片替代文本：

```vue
<template>
  <SuImage src="/cover.png" alt="封面图" :width="240" :height="150" />
</template>
```

## 填充方式

通过 `fit` 控制图片在容器中的适应方式，取值与原生 `object-fit` 一致：

```vue
<template>
  <SuImage src="/cover.png" fit="cover" :width="160" :height="120" />
  <SuImage src="/cover.png" fit="contain" :width="160" :height="120" />
</template>
```

## 懒加载和圆角

通过 `loading="lazy"` 开启浏览器原生懒加载，通过 `radius` 设置圆角：

```vue
<template>
  <SuImage
    src="/cover.png"
    alt="项目封面"
    loading="lazy"
    radius="12px"
    :width="240"
    :height="150"
  />
</template>
```

## 错误回退

图片加载失败时会展示错误占位，也可以通过 `fallback` 指定回退图片：

```vue
<template>
  <SuImage
    src="/missing.png"
    fallback="/fallback.png"
    fallback-text="暂无图片"
    :width="160"
    :height="120"
  />
</template>
```

## 自定义占位

通过 `placeholder` 和 `error` 插槽自定义加载中与失败状态：

```vue
<template>
  <SuImage src="/cover.png" :width="240" :height="150">
    <template #placeholder>加载中</template>
    <template #error>图片不可用</template>
  </SuImage>
</template>
```

## 预览入口

开启 `preview` 后，图片加载完成时会展示预览蒙层，点击后触发 `preview` 事件：

```vue
<template>
  <SuImage
    src="/cover.png"
    preview
    :width="240"
    :height="150"
    @preview="(src) => console.log(src)"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuImage } from '@susu-ui/vue'
</script>

<template>
  <SuImage src="/cover.png" alt="封面图" />
</template>
```

## Props

| 参数            | 说明                 | 类型                                                       | 默认值           |
| --------------- | -------------------- | ---------------------------------------------------------- | ---------------- |
| `src`           | 图片地址             | `string`                                                   | `undefined`      |
| `alt`           | 图片替代文本         | `string`                                                   | `''`             |
| `width`         | 图片容器宽度         | `number \| string`                                         | `undefined`      |
| `height`        | 图片容器高度         | `number \| string`                                         | `undefined`      |
| `fit`           | 图片适应方式         | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'`        |
| `radius`        | 圆角                 | `number \| string`                                         | `undefined`      |
| `loading`       | 图片加载策略         | `'eager' \| 'lazy'`                                        | `'eager'`        |
| `preview`       | 是否展示预览入口     | `boolean`                                                  | `false`          |
| `preview-text`  | 预览按钮文本         | `string`                                                   | `'预览'`         |
| `fallback`      | 加载失败时的回退图片 | `string`                                                   | `undefined`      |
| `fallback-text` | 加载失败时的提示文本 | `string`                                                   | `'图片加载失败'` |

## 事件

| 名称      | 说明               | 参数             |
| --------- | ------------------ | ---------------- |
| `load`    | 图片加载完成时触发 | `(event: Event)` |
| `error`   | 图片加载失败时触发 | `(event: Event)` |
| `preview` | 点击预览入口时触发 | `(src: string)`  |

## 插槽

| 名称          | 说明         |
| ------------- | ------------ |
| `placeholder` | 加载中内容   |
| `error`       | 加载失败内容 |
| `preview`     | 预览蒙层内容 |

## 类型

```ts
type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
type ImageLoading = 'eager' | 'lazy'
```
