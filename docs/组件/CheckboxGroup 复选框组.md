# CheckboxGroup 复选框组

复选框组用于管理一组多选项，绑定值为数组。它和 `Checkbox` 配合使用，适合权限配置、通知渠道、指标选择等场景。

## 基础用法

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

```vue
<template>
  <SuCheckboxGroup :model-value="['read']" direction="vertical">
    <SuCheckbox value="read">查看客户资料</SuCheckbox>
    <SuCheckbox value="export">导出报表</SuCheckbox>
    <SuCheckbox value="approve">审批退款</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 限制数量

```vue
<template>
  <SuCheckboxGroup :model-value="['sales']" :max="2">
    <SuCheckbox value="sales">销售额</SuCheckbox>
    <SuCheckbox value="conversion">转化率</SuCheckbox>
    <SuCheckbox value="retention">留存率</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 禁用状态

```vue
<template>
  <SuCheckboxGroup :model-value="['email']" disabled>
    <SuCheckbox value="email">邮件通知</SuCheckbox>
    <SuCheckbox value="sms">短信提醒</SuCheckbox>
  </SuCheckboxGroup>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCheckbox, SuCheckboxGroup } from '@susu-ui/vue'
</script>
```

## Props

| 参数         | 说明             | 类型                              | 默认值         |
| ------------ | ---------------- | --------------------------------- | -------------- |
| `modelValue` | 绑定值           | `(boolean \| string \| number)[]` | `[]`           |
| `size`       | 尺寸             | `'small' \| 'medium' \| 'large'`  | 表单尺寸       |
| `disabled`   | 是否禁用整组     | `boolean`                         | `false`        |
| `name`       | 原生 `name` 属性 | `string`                          | `undefined`    |
| `direction`  | 排列方向         | `'horizontal' \| 'vertical'`      | `'horizontal'` |
| `max`        | 最多可选数量     | `number`                          | `undefined`    |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 状态变化时触发 | `(value, event)` |
