# Input 输入框

输入框用于接收用户输入的单行文本。

## 基础用法

通过 `v-model` 绑定输入值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <SuInput v-model="value" placeholder="请输入内容" />
</template>
```

## 输入框尺寸

通过 `size` 控制输入框尺寸：

```vue
<template>
  <SuInput size="small" placeholder="小尺寸" />
  <SuInput placeholder="默认尺寸" />
  <SuInput size="large" placeholder="大尺寸" />
</template>
```

## 可清空

通过 `clearable` 展示清空按钮：

```vue
<template>
  <SuInput v-model="value" clearable placeholder="可清空输入" />
</template>
```

## 禁用和只读

通过 `disabled` 禁用输入框，通过 `readonly` 设置只读：

```vue
<template>
  <SuInput disabled placeholder="禁用状态" />
  <SuInput readonly model-value="只读内容" />
</template>
```

## 前后置内容

通过 `prefix` 和 `suffix` 插槽添加前后置内容：

```vue
<template>
  <SuInput placeholder="请输入金额">
    <template #prefix>¥</template>
    <template #suffix>元</template>
  </SuInput>
</template>
```

## 输入类型

通过 `type` 设置输入类型。`id-card` 用于中国居民身份证号码校验，底层会渲染为文本输入框并写入原生表单校验状态：

```vue
<template>
  <SuInput type="text" placeholder="请输入文本" />
  <SuInput type="password" placeholder="请输入密码" />
  <SuInput type="email" placeholder="请输入邮箱" />
  <SuInput type="number" placeholder="请输入数字" />
  <SuInput type="search" placeholder="请输入搜索内容" />
  <SuInput type="tel" placeholder="请输入电话" />
  <SuInput type="url" placeholder="请输入网址" />
  <SuInput type="id-card" placeholder="请输入身份证号码" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuInput } from '@susu-ui/vue'
</script>
```

## Props

| 参数           | 说明             | 类型                                                                                     | 默认值     |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------- | ---------- |
| `v-model`      | 绑定值           | `string \| number`                                                                       | `''`       |
| `type`         | 输入类型         | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url' \| 'id-card'` | `'text'`   |
| `size`         | 输入框尺寸       | `'small' \| 'medium' \| 'large'`                                                         | `'medium'` |
| `placeholder`  | 占位文本         | `string`                                                                                 | -          |
| `disabled`     | 是否禁用         | `boolean`                                                                                | `false`    |
| `readonly`     | 是否只读         | `boolean`                                                                                | `false`    |
| `clearable`    | 是否显示清空按钮 | `boolean`                                                                                | `false`    |
| `name`         | 原生 name 属性   | `string`                                                                                 | -          |
| `id`           | 原生 id 属性     | `string`                                                                                 | -          |
| `autocomplete` | 自动完成属性     | `string`                                                                                 | -          |
| `minlength`    | 最小输入长度     | `number \| string`                                                                       | -          |
| `maxlength`    | 最大输入长度     | `number \| string`                                                                       | -          |

## 事件

| 名称     | 说明               |
| -------- | ------------------ |
| `input`  | 输入值变化时触发   |
| `change` | 输入值提交变化触发 |
| `focus`  | 获取焦点时触发     |
| `blur`   | 失去焦点时触发     |
| `clear`  | 点击清空按钮时触发 |

## 插槽

| 名称     | 说明     |
| -------- | -------- |
| `prefix` | 前置内容 |
| `suffix` | 后置内容 |
