# Watermark 水印

水印用于在页面区域或全屏范围内叠加不可交互的文字、图片标识，常见于合同、报表、资料预览和内部系统页面。

## 基础用法

将业务内容放入默认插槽，组件会在内容上方重复绘制水印层：

```vue
<template>
  <SuWatermark content="财务中心">
    <section class="document">
      <h3>供应商付款申请</h3>
      <p>审批编号 AP-20260628-014</p>
    </section>
  </SuWatermark>
</template>
```

## 多行水印

`content` 支持字符串数组，适合展示部门、人员、环境等组合信息：

```vue
<template>
  <SuWatermark :content="['内部资料', '研发中心']" :font-size="15">
    <div class="preview">项目风险清单</div>
  </SuWatermark>
</template>
```

## 图片水印

传入 `image` 后会优先使用图片绘制水印，可以通过 `image-width` 和 `image-height` 控制图片尺寸：

```vue
<template>
  <SuWatermark
    image="/brand-watermark.svg"
    :image-width="96"
    :image-height="32"
    :opacity="0.45"
  >
    <div class="preview">品牌素材预览</div>
  </SuWatermark>
</template>
```

## 全屏水印

设置 `fullscreen` 后水印层会固定到视口，适合给整页工作台叠加环境或人员标识：

```vue
<template>
  <SuWatermark fullscreen content="测试环境" :z-index="1200">
    <RouterView />
  </SuWatermark>
</template>
```

## 禁用水印

通过 `disabled` 可以临时关闭水印层，但保留内容结构：

```vue
<template>
  <SuWatermark content="内部资料" :disabled="isPublic">
    <ArticlePreview />
  </SuWatermark>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuWatermark } from '@susu-ui/vue'
</script>

<template>
  <SuWatermark content="内部资料">
    <main>资料内容</main>
  </SuWatermark>
</template>
```

## Props

| 参数          | 说明                                | 类型                 | 默认值          |
| ------------- | ----------------------------------- | -------------------- | --------------- |
| `content`     | 文本水印内容，支持多行              | `string \| string[]` | `'Susu UI'`     |
| `image`       | 图片水印地址，传入后优先使用图片    | `string`             | `undefined`     |
| `width`       | 单个水印内容区域宽度                | `number`             | `160`           |
| `height`      | 单个水印内容区域高度                | `number`             | `100`           |
| `gapX`        | 水印之间的水平间距                  | `number`             | `40`            |
| `gapY`        | 水印之间的垂直间距                  | `number`             | `40`            |
| `offsetX`     | 背景起始水平偏移                    | `number`             | `0`             |
| `offsetY`     | 背景起始垂直偏移                    | `number`             | `0`             |
| `rotate`      | 水印旋转角度                        | `number`             | `-22`           |
| `color`       | 文本水印颜色                        | `string`             | `rgb(15 23 42)` |
| `opacity`     | 水印透明度，范围会限制在 `0` 到 `1` | `number`             | `0.12`          |
| `fontSize`    | 文本水印字号                        | `number`             | `16`            |
| `fontWeight`  | 文本水印字重                        | `string \| number`   | `'normal'`      |
| `fontFamily`  | 文本水印字体                        | `string`             | 系统字体        |
| `imageWidth`  | 图片水印宽度                        | `number`             | `undefined`     |
| `imageHeight` | 图片水印高度                        | `number`             | `undefined`     |
| `zIndex`      | 水印层级                            | `number`             | `9`             |
| `fullscreen`  | 是否固定到视口                      | `boolean`            | `false`         |
| `disabled`    | 是否禁用水印层                      | `boolean`            | `false`         |

## 插槽

| 名称      | 说明               |
| --------- | ------------------ |
| `default` | 需要叠加水印的内容 |
