# Switch 开关

开关用于在两个互斥状态之间切换，适合控制即时生效的设置项。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <SuSwitch v-model="enabled" />
</template>
```

## 文本说明

通过 `activeText` 和 `inactiveText` 展示当前状态：

```vue
<template>
  <SuSwitch v-model="enabled" active-text="已开启" inactive-text="已关闭" />
</template>
```

## 自定义值

通过 `activeValue` 和 `inactiveValue` 绑定非布尔值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const notice = ref('off')
</script>

<template>
  <SuSwitch v-model="notice" active-value="on" inactive-value="off" />
</template>
```

## 尺寸

通过 `size` 设置开关尺寸：

```vue
<template>
  <SuSwitch size="small" />
  <SuSwitch />
  <SuSwitch size="large" />
</template>
```

## 禁用和加载

设置 `disabled` 禁用操作，设置 `loading` 展示加载状态并暂时禁用：

```vue
<template>
  <SuSwitch disabled />
  <SuSwitch loading />
</template>
```

## 表单属性

组件基于原生 `checkbox`，支持 `name`、`id` 和辅助功能属性：

```vue
<template>
  <SuSwitch id="notice" name="notice" aria-label="通知开关" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuSwitch } from '@susu-ui/vue'
</script>

<template>
  <SuSwitch />
</template>
```

## Props

| 参数            | 说明             | 类型                             | 默认值      |
| --------------- | ---------------- | -------------------------------- | ----------- |
| `modelValue`    | 绑定值           | `boolean \| string \| number`    | `false`     |
| `activeValue`   | 打开时的值       | `boolean \| string \| number`    | `true`      |
| `inactiveValue` | 关闭时的值       | `boolean \| string \| number`    | `false`     |
| `activeText`    | 打开时显示的文本 | `string`                         | `undefined` |
| `inactiveText`  | 关闭时显示的文本 | `string`                         | `undefined` |
| `size`          | 尺寸             | `'small' \| 'medium' \| 'large'` | 表单尺寸    |
| `disabled`      | 是否禁用         | `boolean`                        | `false`     |
| `loading`       | 是否加载中       | `boolean`                        | `false`     |
| `name`          | 原生 `name` 属性 | `string`                         | `undefined` |
| `id`            | 原生 `id` 属性   | `string`                         | `undefined` |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 状态变化时触发 | `(value, event)` |
| `focus`  | 聚焦时触发     | `(event)`        |
| `blur`   | 失焦时触发     | `(event)`        |
