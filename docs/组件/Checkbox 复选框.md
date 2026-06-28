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

## 复选框组

使用 `CheckboxGroup` 管理多选数组，子项通过 `value` 写入当前选中集合：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const channels = ref(['email'])
</script>

<template>
  <SuCheckboxGroup v-model="channels" name="notice">
    <SuCheckbox value="email">邮件通知</SuCheckbox>
    <SuCheckbox value="sms">短信提醒</SuCheckbox>
    <SuCheckbox value="webhook">Webhook 推送</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 垂直排列

通过 `direction` 设置分组排列方向：

```vue
<template>
  <SuCheckboxGroup :model-value="['read']" direction="vertical">
    <SuCheckbox value="read">查看客户资料</SuCheckbox>
    <SuCheckbox value="export">导出报表</SuCheckbox>
    <SuCheckbox value="approve">审批退款</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 最多可选数量

通过 `max` 限制最多可选项数量，达到上限后未选中的选项会被禁用：

```vue
<template>
  <SuCheckboxGroup :model-value="['sales']" :max="2">
    <SuCheckbox value="sales">销售额</SuCheckbox>
    <SuCheckbox value="conversion">转化率</SuCheckbox>
    <SuCheckbox value="retention">留存率</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 尺寸

通过 `size` 设置复选框尺寸，也可以在 `CheckboxGroup` 上统一设置：

```vue
<template>
  <SuCheckbox size="small">小尺寸</SuCheckbox>
  <SuCheckbox>默认尺寸</SuCheckbox>
  <SuCheckbox size="large">大尺寸</SuCheckbox>

  <SuCheckboxGroup :model-value="['small']" size="small">
    <SuCheckbox value="small">小尺寸分组选项</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 禁用状态

设置 `disabled` 禁用操作。`CheckboxGroup` 设置 `disabled` 会禁用整组，`Checkbox` 设置 `disabled` 会禁用单个选项：

```vue
<template>
  <SuCheckbox disabled>禁用状态</SuCheckbox>

  <SuCheckboxGroup :model-value="['enabled']" disabled>
    <SuCheckbox value="enabled">启用</SuCheckbox>
    <SuCheckbox value="disabled">停用</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 表单属性

组件基于原生 `checkbox`，支持 `name`、`id`、`value`、`required` 和辅助功能属性。放在 `CheckboxGroup` 中时，`name` 会从分组传递给子选项：

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
import { SuCheckbox, SuCheckboxGroup } from '@susu-ui/vue'
</script>

<template>
  <SuCheckboxGroup>
    <SuCheckbox value="email">邮件通知</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## CheckboxGroup Props

| 参数         | 说明             | 类型                              | 默认值         |
| ------------ | ---------------- | --------------------------------- | -------------- |
| `modelValue` | 绑定值           | `(boolean \| string \| number)[]` | `[]`           |
| `size`       | 尺寸             | `'small' \| 'medium' \| 'large'`  | 表单尺寸       |
| `disabled`   | 是否禁用整组     | `boolean`                         | `false`        |
| `name`       | 原生 `name` 属性 | `string`                          | `undefined`    |
| `direction`  | 排列方向         | `'horizontal' \| 'vertical'`      | `'horizontal'` |
| `max`        | 最多可选数量     | `number`                          | `undefined`    |

## Checkbox Props

| 参数            | 说明                 | 类型                             | 默认值      |
| --------------- | -------------------- | -------------------------------- | ----------- |
| `modelValue`    | 单独使用时的绑定值   | `boolean \| string \| number`    | `false`     |
| `trueValue`     | 选中时的值           | `boolean \| string \| number`    | `true`      |
| `falseValue`    | 未选中时的值         | `boolean \| string \| number`    | `false`     |
| `label`         | 复选框文本           | `string`                         | `undefined` |
| `size`          | 尺寸                 | `'small' \| 'medium' \| 'large'` | 分组尺寸    |
| `disabled`      | 是否禁用             | `boolean`                        | `false`     |
| `indeterminate` | 是否展示半选状态     | `boolean`                        | `false`     |
| `name`          | 原生 `name` 属性     | `string`                         | 分组 `name` |
| `id`            | 原生 `id` 属性       | `string`                         | `undefined` |
| `value`         | 分组内的当前选项值   | `boolean \| string \| number`    | `trueValue` |
| `required`      | 是否参与原生必填校验 | `boolean`                        | `false`     |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 状态变化时触发 | `(value, event)` |
| `focus`  | 聚焦时触发     | `(event)`        |
| `blur`   | 失焦时触发     | `(event)`        |
