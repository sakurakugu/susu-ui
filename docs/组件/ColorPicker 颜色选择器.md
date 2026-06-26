# ColorPicker 颜色选择器

颜色选择器用于输入或选择颜色，默认使用 `#RRGGBB` 字符串作为绑定值。

## 基础用法

通过 `v-model` 绑定颜色：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const color = ref('#1677ff')
</script>

<template>
  <SuColorPicker v-model="color" placeholder="请选择颜色" />
</template>
```

## 清空颜色

设置 `clearable` 后，已有颜色时会显示清空按钮：

```vue
<template>
  <SuColorPicker v-model="color" clearable />
</template>
```

## 透明度

设置 `showAlpha` 后会显示透明度滑块，透明度小于 `1` 时输出 `rgba(...)`：

```vue
<template>
  <SuColorPicker v-model="color" show-alpha />
</template>
```

## 输出格式

通过 `format` 设置颜色输出格式：

```vue
<template>
  <SuColorPicker v-model="color" format="rgb" />
</template>
```

## 预设颜色

通过 `presets` 设置面板中的预设颜色：

```vue
<template>
  <SuColorPicker
    v-model="color"
    :presets="['#1677ff', '#52c41a', '#faad14', '#ff4d4f']"
  />
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuColorPicker size="small" />
  <SuColorPicker status="error" />
</template>
```

## 表单校验

组件内部使用原生 `input`，支持 `name`、`required` 等表单属性：

```vue
<template>
  <SuColorPicker name="brandColor" required placeholder="请选择品牌色" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuColorPicker } from '@susu-ui/vue'
</script>

<template>
  <SuColorPicker v-model="color" />
</template>
```

## Props

| 参数          | 说明             | 类型                                             | 默认值         |
| ------------- | ---------------- | ------------------------------------------------ | -------------- |
| `modelValue`  | 绑定值           | `string`                                         | `''`           |
| `size`        | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸       |
| `status`      | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`    |
| `placeholder` | 占位文本         | `string`                                         | `'请选择颜色'` |
| `disabled`    | 是否禁用         | `boolean`                                        | `false`        |
| `readonly`    | 是否只读         | `boolean`                                        | `false`        |
| `clearable`   | 是否支持清空     | `boolean`                                        | `false`        |
| `showAlpha`   | 是否支持透明度   | `boolean`                                        | `false`        |
| `format`      | 输出格式         | `'hex' \| 'rgb'`                                 | `'hex'`        |
| `presets`     | 预设颜色         | `string[]`                                       | 内置预设       |
| `name`        | 原生 `name` 属性 | `string`                                         | `undefined`    |
| `id`          | 原生 `id` 属性   | `string`                                         | `undefined`    |
| `required`    | 是否必填         | `boolean`                                        | `false`        |
| `ariaLabel`   | 输入框可访问名称 | `string`                                         | `'颜色选择'`   |

## 事件

| 名称      | 说明               | 参数              |
| --------- | ------------------ | ----------------- |
| `input`   | 输入时触发         | `(value, event)`  |
| `change`  | 颜色变化时触发     | `(value, event?)` |
| `focus`   | 聚焦时触发         | `(event)`         |
| `blur`    | 失焦时触发         | `(event)`         |
| `clear`   | 清空颜色时触发     | -                 |
| `open`    | 面板打开时触发     | -                 |
| `close`   | 面板关闭时触发     | -                 |
| `invalid` | 原生校验失败时触发 | `(event)`         |

## 暴露方法

| 名称    | 说明       |
| ------- | ---------- |
| `focus` | 聚焦输入框 |
| `blur`  | 失焦输入框 |
| `open`  | 打开面板   |
| `close` | 关闭面板   |
| `clear` | 清空颜色   |
