# OtpInput 验证码输入

验证码输入用于录入短信、邮箱、支付确认或双因素认证的一次性验证码。

## 基础用法

通过 `v-model` 绑定验证码字符串。默认长度为 6，并只允许输入数字：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const code = ref('')
</script>

<template>
  <SuOtpInput v-model="code" />
</template>
```

## 完成输入

当验证码长度达到 `length` 时触发 `complete` 事件：

```vue
<template>
  <SuOtpInput v-model="code" @complete="submitCode" />
</template>
```

## 粘贴验证码

组件支持从任意一格粘贴整串验证码，会自动按顺序填充并截断到指定长度。

## 文本验证码

通过 `type="text"` 支持字母和数字混合的恢复代码：

```vue
<template>
  <SuOtpInput v-model="backupCode" type="text" :length="4" />
</template>
```

## 掩码展示

通过 `mask` 隐藏每一位验证码，适合支付确认等敏感场景：

```vue
<template>
  <SuOtpInput v-model="payCode" mask />
</template>
```

## 尺寸和状态

通过 `size` 控制尺寸，通过 `status` 设置状态样式：

```vue
<template>
  <SuOtpInput size="small" />
  <SuOtpInput />
  <SuOtpInput size="large" />
  <SuOtpInput status="success" />
  <SuOtpInput status="warning" />
  <SuOtpInput status="error" />
</template>
```

## 禁用和只读

通过 `disabled` 禁用输入，通过 `readonly` 设置只读：

```vue
<template>
  <SuOtpInput disabled model-value="123456" />
  <SuOtpInput readonly model-value="654321" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuOtpInput } from '@susu-ui/vue'
</script>
```

## Props

| 参数           | 说明                          | 类型                                             | 默认值            |
| -------------- | ----------------------------- | ------------------------------------------------ | ----------------- |
| `v-model`      | 绑定验证码                    | `string`                                         | `''`              |
| `length`       | 验证码长度                    | `number`                                         | `6`               |
| `type`         | 输入类型                      | `'number' \| 'text'`                             | `'number'`        |
| `size`         | 输入框尺寸                    | `'small' \| 'medium' \| 'large'`                 | `'medium'`        |
| `status`       | 输入框状态                    | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`       |
| `placeholder`  | 单格占位文本                  | `string`                                         | -                 |
| `disabled`     | 是否禁用                      | `boolean`                                        | `false`           |
| `readonly`     | 是否只读                      | `boolean`                                        | `false`           |
| `clearable`    | 是否显示清空按钮              | `boolean`                                        | `false`           |
| `mask`         | 是否掩码展示                  | `boolean`                                        | `false`           |
| `autofocus`    | 是否自动聚焦第一格            | `boolean`                                        | `false`           |
| `name`         | 隐藏输入框 name，用于表单提交 | `string`                                         | -                 |
| `id`           | 输入框 id 前缀                | `string`                                         | -                 |
| `autocomplete` | 第一格自动完成属性            | `string`                                         | `'one-time-code'` |
| `aria-label`   | 无障碍标签                    | `string`                                         | `'验证码'`        |

## 事件

| 名称       | 说明                     | 参数                                 |
| ---------- | ------------------------ | ------------------------------------ |
| `input`    | 输入内容变化时触发       | `(value: string, event: Event)`      |
| `change`   | 原生 change 或清空时触发 | `(value: string, event?: Event)`     |
| `complete` | 输入达到指定长度时触发   | `(value: string)`                    |
| `focus`    | 单格聚焦时触发           | `(event: FocusEvent, index: number)` |
| `blur`     | 单格失焦时触发           | `(event: FocusEvent, index: number)` |
| `clear`    | 点击清空按钮时触发       | `()`                                 |

## 方法

| 名称     | 说明               |
| -------- | ------------------ |
| `focus`  | 聚焦当前待输入位置 |
| `blur`   | 取消所有输入框焦点 |
| `select` | 选中指定输入格     |
| `clear`  | 清空验证码         |
