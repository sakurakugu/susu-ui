# InputNumber 数字输入框

数字输入框用于接收数字，并提供步进控制、范围限制和精度格式化。

## 基础用法

通过 `v-model` 绑定数字值。空值会写回 `null`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number | null>(1)
</script>

<template>
  <SuInputNumber v-model="value" placeholder="请输入数量" />
</template>
```

## 步进和范围

通过 `step` 控制每次加减的步长，通过 `min` 和 `max` 限制可输入范围：

```vue
<template>
  <SuInputNumber v-model="value" :min="0" :max="10" :step="2" />
</template>
```

## 精度

通过 `precision` 控制展示和写回值的小数位：

```vue
<template>
  <SuInputNumber v-model="price" :step="0.1" :precision="2" />
</template>
```

## 尺寸和状态

通过 `size` 控制尺寸，通过 `status` 设置状态样式：

```vue
<template>
  <SuInputNumber size="small" />
  <SuInputNumber />
  <SuInputNumber size="large" />
  <SuInputNumber status="success" />
  <SuInputNumber status="warning" />
  <SuInputNumber status="error" />
</template>
```

## 禁用和只读

通过 `disabled` 禁用数字输入框，通过 `readonly` 设置只读：

```vue
<template>
  <SuInputNumber disabled :model-value="1" />
  <SuInputNumber readonly :model-value="2" />
</template>
```

## 可清空

通过 `clearable` 展示清空按钮：

```vue
<template>
  <SuInputNumber v-model="value" clearable />
</template>
```

## 隐藏控制按钮

通过 `controls="false"` 隐藏加减按钮：

```vue
<template>
  <SuInputNumber v-model="value" :controls="false" />
</template>
```

## 前后置内容

通过 `prefix` 和 `suffix` 插槽添加前后置内容：

```vue
<template>
  <SuInputNumber v-model="amount" :controls="false">
    <template #prefix>¥</template>
    <template #suffix>元</template>
  </SuInputNumber>
</template>
```

## 键盘操作

聚焦后可以使用方向键调整数值：

| 按键        | 说明     |
| ----------- | -------- |
| `ArrowUp`   | 增加一步 |
| `ArrowDown` | 减少一步 |

## 按需导入

```vue
<script setup lang="ts">
import { SuInputNumber } from '@susu-ui/vue'
</script>
```

## Props

| 参数           | 说明             | 类型                                             | 默认值       |
| -------------- | ---------------- | ------------------------------------------------ | ------------ |
| `v-model`      | 绑定值           | `number \| null`                                 | `null`       |
| `min`          | 最小值           | `number`                                         | -            |
| `max`          | 最大值           | `number`                                         | -            |
| `step`         | 步进值           | `number`                                         | `1`          |
| `precision`    | 小数精度         | `number`                                         | -            |
| `size`         | 输入框尺寸       | `'small' \| 'medium' \| 'large'`                 | `'medium'`   |
| `status`       | 输入框状态       | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  |
| `placeholder`  | 占位文本         | `string`                                         | -            |
| `disabled`     | 是否禁用         | `boolean`                                        | `false`      |
| `readonly`     | 是否只读         | `boolean`                                        | `false`      |
| `clearable`    | 是否显示清空按钮 | `boolean`                                        | `false`      |
| `controls`     | 是否显示控制按钮 | `boolean`                                        | `true`       |
| `name`         | 原生 name 属性   | `string`                                         | -            |
| `id`           | 原生 id 属性     | `string`                                         | -            |
| `required`     | 是否必填         | `boolean`                                        | `false`      |
| `autocomplete` | 自动完成属性     | `string`                                         | -            |
| `aria-label`   | 无障碍标签       | `string`                                         | `'数字输入'` |

## 事件

| 名称      | 说明                     |
| --------- | ------------------------ |
| `input`   | 输入有效数字或清空时触发 |
| `change`  | 输入提交或点击加减时触发 |
| `focus`   | 获取焦点时触发           |
| `blur`    | 失去焦点时触发           |
| `clear`   | 点击清空按钮时触发       |
| `invalid` | 原生校验失败时触发       |

## 插槽

| 名称     | 说明     |
| -------- | -------- |
| `prefix` | 前置内容 |
| `suffix` | 后置内容 |

## 方法

| 名称       | 说明           |
| ---------- | -------------- |
| `focus`    | 聚焦输入框     |
| `blur`     | 取消输入框焦点 |
| `select`   | 选中输入框内容 |
| `clear`    | 清空输入框内容 |
| `increase` | 增加一步       |
| `decrease` | 减少一步       |
