# Avatar 头像

头像用于展示用户、团队或对象的缩略标识，支持图片、文字和图标回退。

## 基础用法

```vue
<template>
  <SuAvatar text="苏" />
  <SuAvatar text="青" background="#0f766e" />
  <SuAvatar text="满" background="#f97316" />
</template>
```

## 图片头像

通过 `src` 设置图片地址，`alt` 设置图片替代文本。图片加载失败后会回退到文字或默认插槽内容，并触发 `error` 事件：

```vue
<template>
  <SuAvatar src="/avatar.png" alt="用户头像" text="苏" />
</template>
```

## 尺寸和形状

通过 `size` 控制头像尺寸，支持预设尺寸、数字像素值和 CSS 长度；通过 `shape` 控制圆形或方形：

```vue
<template>
  <SuAvatar size="small" text="小" />
  <SuAvatar text="中" />
  <SuAvatar size="large" text="大" />
  <SuAvatar :size="48" text="48" />
  <SuAvatar shape="square" text="方" />
</template>
```

## 图标头像

通过 `icon` 插槽自定义图标内容：

```vue
<template>
  <SuAvatar>
    <template #icon>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
      </SuIcon>
    </template>
  </SuAvatar>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuAvatar } from '@susu-ui/vue'
</script>

<template>
  <SuAvatar text="苏" />
</template>
```

## Props

| 参数         | 说明                     | 类型                                                       | 默认值      |
| ------------ | ------------------------ | ---------------------------------------------------------- | ----------- |
| `src`        | 图片地址                 | `string`                                                   | `undefined` |
| `alt`        | 图片替代文本             | `string`                                                   | `''`        |
| `size`       | 头像尺寸                 | `'small' \| 'medium' \| 'large' \| number \| string`       | `'medium'`  |
| `shape`      | 头像形状                 | `'circle' \| 'square'`                                     | `'circle'`  |
| `fit`        | 图片适应方式             | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'`   |
| `text`       | 无图片或图片失败时的文字 | `string`                                                   | `undefined` |
| `color`      | 文字或图标颜色           | `string`                                                   | `undefined` |
| `background` | 背景色                   | `string`                                                   | `undefined` |

## 事件

| 名称    | 说明             | 参数             |
| ------- | ---------------- | ---------------- |
| `error` | 图片加载失败触发 | `(event: Event)` |

## 插槽

| 名称      | 说明                     |
| --------- | ------------------------ |
| `default` | 无图片或图片失败时的内容 |
| `icon`    | 图标内容                 |
