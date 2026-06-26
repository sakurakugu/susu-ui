# Checkbox 复选框

复选框用于在一组选项中选择一个或多个项目，也适合承载需要用户确认的开关型表单项。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <SuCheckbox v-model="checked">同意服务协议</SuCheckbox>
</template>
```

## 自定义值

通过 `trueValue` 和 `falseValue` 绑定非布尔值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const feature = ref('disabled')
</script>

<template>
  <SuCheckbox v-model="feature" true-value="enabled" false-value="disabled">
    启用高级功能
  </SuCheckbox>
</template>
```

## 半选状态

设置 `indeterminate` 可以展示半选状态，常用于树形或全选场景：

```vue
<template>
  <SuCheckbox indeterminate>部分选中</SuCheckbox>
</template>
```

## 尺寸

通过 `size` 设置复选框尺寸：

```vue
<template>
  <SuCheckbox size="small">小尺寸</SuCheckbox>
  <SuCheckbox>默认尺寸</SuCheckbox>
  <SuCheckbox size="large">大尺寸</SuCheckbox>
</template>
```

## 禁用状态

设置 `disabled` 禁用操作：

```vue
<template>
  <SuCheckbox disabled>禁用状态</SuCheckbox>
</template>
```

## 表单属性

组件基于原生 `checkbox`，支持 `name`、`id`、`value`、`required` 和辅助功能属性：

```vue
<template>
  <SuCheckbox
    id="agreement"
    name="agreement"
    value="agree"
    required
    aria-label="同意协议"
  >
    同意服务协议
  </SuCheckbox>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCheckbox } from '@susu-ui/vue'
</script>

<template>
  <SuCheckbox />
</template>
```

## Props

| 参数            | 说明                 | 类型                             | 默认值      |
| --------------- | -------------------- | -------------------------------- | ----------- |
| `modelValue`    | 绑定值               | `boolean \| string \| number`    | `false`     |
| `trueValue`     | 选中时的值           | `boolean \| string \| number`    | `true`      |
| `falseValue`    | 未选中时的值         | `boolean \| string \| number`    | `false`     |
| `label`         | 复选框文本           | `string`                         | `undefined` |
| `size`          | 尺寸                 | `'small' \| 'medium' \| 'large'` | 表单尺寸    |
| `disabled`      | 是否禁用             | `boolean`                        | `false`     |
| `indeterminate` | 是否展示半选状态     | `boolean`                        | `false`     |
| `name`          | 原生 `name` 属性     | `string`                         | `undefined` |
| `id`            | 原生 `id` 属性       | `string`                         | `undefined` |
| `value`         | 原生 `value` 属性    | `string \| number`               | `trueValue` |
| `required`      | 是否参与原生必填校验 | `boolean`                        | `false`     |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 状态变化时触发 | `(value, event)` |
| `focus`  | 聚焦时触发     | `(event)`        |
| `blur`   | 失焦时触发     | `(event)`        |
