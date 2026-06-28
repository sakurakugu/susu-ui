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
  <SuInput v-model="keyword" clearable clear-focus placeholder="清空后继续输入" />
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

通过 `prepend` 和 `append` 插槽添加块级前后置内容：

```vue
<template>
  <SuInput v-model="domain" placeholder="请输入域名">
    <template #prepend>https://</template>
    <template #append>.com</template>
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

## 密码输入

通过 `show-password` 展示密码显示切换按钮：

```vue
<template>
  <SuInput v-model="password" type="password" show-password placeholder="请输入密码" />
</template>
```

## 多行输入

通过 `type="textarea"` 渲染多行文本输入框，配合 `rows`、`autosize` 和 `resize` 控制高度与缩放：

```vue
<template>
  <SuInput
    v-model="description"
    type="textarea"
    :rows="4"
    autosize
    resize="vertical"
    placeholder="请输入描述"
  />
</template>
```

## 字数统计

通过 `show-word-limit` 和 `maxlength` 展示当前字数：

```vue
<template>
  <SuInput v-model="nickname" :maxlength="20" show-word-limit placeholder="请输入昵称" />
</template>
```

## 校验状态

通过 `status` 设置输入框状态样式：

```vue
<template>
  <SuInput status="success" placeholder="成功状态" />
  <SuInput status="warning" placeholder="警告状态" />
  <SuInput status="error" placeholder="错误状态" />
</template>
```

## 表单属性

组件会透传常用原生表单属性，适合配合浏览器原生校验和移动端键盘：

```vue
<template>
  <SuInput required pattern="[a-z]+" inputmode="text" placeholder="请输入小写字母" />
  <SuInput type="number" min="1" max="10" step="1" placeholder="请输入 1 到 10" />
</template>
```

## 格式化输入

通过 `formatter` 控制展示内容，通过 `parser` 控制写回 `v-model` 的值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const price = ref(12800)

function formatter(value: string | number) {
  return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parser(value: string) {
  return Number(value.replace(/[^\d.]/g, ''))
}
</script>

<template>
  <SuInput v-model="price" :formatter="formatter" :parser="parser" />
</template>
```

## 输入控制

通过 `trim` 在写入前去除首尾空格，通过 `allow-input` 拦截不符合规则的输入：

```vue
<script setup lang="ts">
function onlyDigits(value: string) {
  return /^\d*$/.test(value)
}
</script>

<template>
  <SuInput trim placeholder="自动去除首尾空格" />
  <SuInput :allow-input="onlyDigits" placeholder="只允许输入数字" />
</template>
```

## 聚焦行为

通过 `select-on-focus` 在聚焦时选中输入内容：

```vue
<template>
  <SuInput model-value="可快速替换的内容" select-on-focus />
</template>
```

## 输入框方法

通过模板引用调用输入框方法：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputRef = ref()

function focusInput() {
  inputRef.value?.focus()
}
</script>

<template>
  <SuInput ref="inputRef" />
  <button type="button" @click="focusInput">聚焦</button>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuInput } from '@susu-ui/vue'
</script>
```

## Props

| 参数              | 说明                | 类型                                                                                                   | 默认值      |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------ | ----------- |
| `v-model`         | 绑定值              | `string \| number`                                                                                     | `''`        |
| `type`            | 输入类型            | `'text' \| 'password' \| 'email' \| 'number' \| 'search' \| 'tel' \| 'url' \| 'id-card' \| 'textarea'` | `'text'`    |
| `size`            | 输入框尺寸          | `'small' \| 'medium' \| 'large'`                                                                       | `'medium'`  |
| `status`          | 输入框状态          | `'default' \| 'success' \| 'warning' \| 'error'`                                                       | `'default'` |
| `placeholder`     | 占位文本            | `string`                                                                                               | -           |
| `disabled`        | 是否禁用            | `boolean`                                                                                              | `false`     |
| `readonly`        | 是否只读            | `boolean`                                                                                              | `false`     |
| `clearable`       | 是否显示清空按钮    | `boolean`                                                                                              | `false`     |
| `show-password`   | 是否显示密码切换    | `boolean`                                                                                              | `false`     |
| `show-word-limit` | 是否显示字数统计    | `boolean`                                                                                              | `false`     |
| `clear-focus`     | 清空后是否自动聚焦  | `boolean`                                                                                              | `false`     |
| `select-on-focus` | 聚焦时是否选中内容  | `boolean`                                                                                              | `false`     |
| `trim`            | 是否去除首尾空格    | `boolean`                                                                                              | `false`     |
| `allow-input`     | 输入拦截函数        | `(value: string, event: Event) => boolean`                                                             | -           |
| `formatter`       | 输入展示格式化函数  | `(value: string \| number) => string`                                                                  | -           |
| `parser`          | 输入值解析函数      | `(value: string) => string \| number`                                                                  | -           |
| `name`            | 原生 name 属性      | `string`                                                                                               | -           |
| `id`              | 原生 id 属性        | `string`                                                                                               | -           |
| `autocomplete`    | 自动完成属性        | `string`                                                                                               | -           |
| `inputmode`       | 原生 inputmode 属性 | `string`                                                                                               | -           |
| `pattern`         | 原生 pattern 属性   | `string`                                                                                               | -           |
| `required`        | 是否必填            | `boolean`                                                                                              | `false`     |
| `minlength`       | 最小输入长度        | `number \| string`                                                                                     | -           |
| `maxlength`       | 最大输入长度        | `number \| string`                                                                                     | -           |
| `min`             | 最小值              | `number \| string`                                                                                     | -           |
| `max`             | 最大值              | `number \| string`                                                                                     | -           |
| `step`            | 数值步进            | `number \| string`                                                                                     | -           |
| `rows`            | 多行输入行数        | `number \| string`                                                                                     | `2`         |
| `autosize`        | 是否自动调整高度    | `boolean`                                                                                              | `false`     |
| `resize`          | 多行输入缩放方向    | `'none' \| 'both' \| 'horizontal' \| 'vertical'`                                                       | -           |

## 事件

| 名称               | 说明                     |
| ------------------ | ------------------------ |
| `input`            | 输入值变化时触发         |
| `change`           | 输入值提交变化触发       |
| `focus`            | 获取焦点时触发           |
| `blur`             | 失去焦点时触发           |
| `clear`            | 点击清空按钮时触发       |
| `enter`            | 按下回车键时触发         |
| `invalid`          | 原生校验失败时触发       |
| `compositionstart` | 输入法组合输入开始时触发 |
| `compositionend`   | 输入法组合输入结束时触发 |

## 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `prefix`  | 前置内容     |
| `suffix`  | 后置内容     |
| `prepend` | 块级前置内容 |
| `append`  | 块级后置内容 |

## 方法

| 名称     | 说明           |
| -------- | -------------- |
| `focus`  | 聚焦输入框     |
| `blur`   | 取消输入框焦点 |
| `select` | 选中输入框内容 |
| `clear`  | 清空输入框内容 |
