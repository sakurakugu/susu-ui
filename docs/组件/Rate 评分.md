# Rate 评分

用于收集或展示用户对内容的评分。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <SuRate v-model="value" />
</template>
```

## 半星

设置 `allow-half` 后可选择半星。

```vue
<SuRate v-model="value" allow-half />
```

## 小数精度

设置 `precision` 可以控制选择精度。例如 `0.1` 可选择 `3.7` 这样的评分。直接传入 `3.7` 也会按比例展示。

```vue
<SuRate v-model="value" :precision="0.1" />
<SuRate :model-value="3.7" readonly show-text />
```

## 自定义图标

通过 `icon` 插槽可以替换默认星星图标。插槽会同时用于底色层和填充层。

```vue
<SuRate v-model="value">
  <template #icon>
    <svg viewBox="0 0 24 24">
      <path d="M12 21s-7-4.35-9.33-8.8C.68 8.4 2.8 4 7.05 4c2.15 0 3.73 1.14 4.95 2.72C13.22 5.14 14.8 4 16.95 4c4.25 0 6.37 4.4 4.38 8.2C19 16.65 12 21 12 21z" />
    </svg>
  </template>
</SuRate>
```

## 清除评分

设置 `clearable` 后，点击当前分值可清空为 `0`。

```vue
<SuRate v-model="value" clearable />
```

## 辅助文本

设置 `show-text` 显示当前分值，也可以通过 `texts` 自定义文案。

```vue
<SuRate
  v-model="value"
  show-text
  :texts="['极差', '失望', '一般', '满意', '惊喜']"
/>
```

## 只读和禁用

`readonly` 用于展示不可编辑的评分，`disabled` 用于禁用状态。

```vue
<SuRate :model-value="4" readonly />
<SuRate :model-value="2" disabled />
```

## API

### 属性

| 属性         | 说明                 | 类型                             | 默认值      |
| ------------ | -------------------- | -------------------------------- | ----------- |
| `v-model`    | 当前评分值           | `number`                         | `0`         |
| `max`        | 最大分值             | `number`                         | `5`         |
| `size`       | 尺寸                 | `'small' \| 'medium' \| 'large'` | `'medium'`  |
| `precision`  | 选择精度             | `number`                         | 见下方说明  |
| `allow-half` | 是否允许半星         | `boolean`                        | `false`     |
| `clearable`  | 是否允许再次点击清除 | `boolean`                        | `false`     |
| `disabled`   | 是否禁用             | `boolean`                        | `false`     |
| `readonly`   | 是否只读             | `boolean`                        | `false`     |
| `show-text`  | 是否显示辅助文本     | `boolean`                        | `false`     |
| `texts`      | 自定义辅助文本       | `string[]`                       | `undefined` |
| `aria-label` | 无障碍标签           | `string`                         | `'评分'`    |

### 事件

| 事件名         | 说明               | 回调参数                  |
| -------------- | ------------------ | ------------------------- |
| `change`       | 评分变化时触发     | `(value: number) => void` |
| `hover-change` | 悬停预览变化时触发 | `(value: number) => void` |

`precision` 未设置时，`allow-half` 为 `true` 使用 `0.5`，否则使用 `1`。

### 插槽

| 插槽名 | 说明           | 参数                              |
| ------ | -------------- | --------------------------------- |
| `icon` | 自定义评分图标 | `{ item, value, active, filled }` |
