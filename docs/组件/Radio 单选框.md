# Radio 单选框

单选框用于在一组选项中选择一个项目。`RadioGroup` 负责分组选值，`RadioButton` 负责单个选项展示。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('weekly')
</script>

<template>
  <SuRadioGroup v-model="value" name="plan">
    <SuRadioButton value="daily">每日</SuRadioButton>
    <SuRadioButton value="weekly">每周</SuRadioButton>
    <SuRadioButton value="monthly">每月</SuRadioButton>
  </SuRadioGroup>
</template>
```

## 垂直排列

通过 `direction` 设置排列方向：

```vue
<template>
  <SuRadioGroup model-value="email" direction="vertical">
    <SuRadioButton value="email">邮件通知</SuRadioButton>
    <SuRadioButton value="sms">短信通知</SuRadioButton>
    <SuRadioButton value="webhook">Webhook</SuRadioButton>
  </SuRadioGroup>
</template>
```

## 尺寸

通过 `size` 设置整组单选框尺寸，也可以在单个 `RadioButton` 上单独设置：

```vue
<template>
  <SuRadioGroup model-value="small" size="small">
    <SuRadioButton value="small">小尺寸</SuRadioButton>
    <SuRadioButton value="default">默认尺寸</SuRadioButton>
  </SuRadioGroup>

  <SuRadioButton model-value="large" value="large" size="large"> 大尺寸 </SuRadioButton>
</template>
```

## 禁用状态

`RadioGroup` 设置 `disabled` 会禁用整组，`RadioButton` 设置 `disabled` 会禁用单个选项：

```vue
<template>
  <SuRadioGroup model-value="enabled">
    <SuRadioButton value="enabled">启用</SuRadioButton>
    <SuRadioButton value="disabled" disabled>停用</SuRadioButton>
  </SuRadioGroup>
</template>
```

## 单独使用

`RadioButton` 可以不放在 `RadioGroup` 中单独绑定：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('custom')
</script>

<template>
  <SuRadioButton v-model="value" value="custom">自定义选项</SuRadioButton>
</template>
```

## 表单属性

组件基于原生 `radio`，支持 `name`、`id`、`required` 和辅助功能属性。放在 `RadioGroup` 中时，`name` 会从分组传递给子选项：

```vue
<template>
  <SuRadioGroup model-value="daily" name="plan">
    <SuRadioButton id="plan-daily" value="daily" required> 每日 </SuRadioButton>
  </SuRadioGroup>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuRadioButton, SuRadioGroup } from '@susu-ui/vue'
</script>

<template>
  <SuRadioGroup>
    <SuRadioButton value="daily">每日</SuRadioButton>
  </SuRadioGroup>
</template>
```

## RadioGroup Props

| 参数         | 说明             | 类型                             | 默认值         |
| ------------ | ---------------- | -------------------------------- | -------------- |
| `modelValue` | 绑定值           | `string \| number \| boolean`    | `undefined`    |
| `size`       | 尺寸             | `'small' \| 'medium' \| 'large'` | 表单尺寸       |
| `disabled`   | 是否禁用整组     | `boolean`                        | `false`        |
| `name`       | 原生 `name` 属性 | `string`                         | `undefined`    |
| `direction`  | 排列方向         | `'horizontal' \| 'vertical'`     | `'horizontal'` |

## RadioButton Props

| 参数         | 说明                 | 类型                             | 默认值      |
| ------------ | -------------------- | -------------------------------- | ----------- |
| `modelValue` | 单独使用时的绑定值   | `string \| number \| boolean`    | `undefined` |
| `value`      | 当前选项值           | `string \| number \| boolean`    | 必填        |
| `label`      | 单选框文本           | `string`                         | `undefined` |
| `size`       | 尺寸                 | `'small' \| 'medium' \| 'large'` | 分组尺寸    |
| `disabled`   | 是否禁用             | `boolean`                        | `false`     |
| `name`       | 原生 `name` 属性     | `string`                         | 分组 `name` |
| `id`         | 原生 `id` 属性       | `string`                         | `undefined` |
| `required`   | 是否参与原生必填校验 | `boolean`                        | `false`     |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `change` | 状态变化时触发 | `(value, event)` |
| `focus`  | 聚焦时触发     | `(event)`        |
| `blur`   | 失焦时触发     | `(event)`        |
