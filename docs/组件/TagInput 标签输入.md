# TagInput 标签输入

标签输入用于录入多个短文本标签，适合客户画像、任务标记和内容关键词等场景。

## 基础用法

输入内容后按回车或逗号添加标签：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['重点客户', '续费意向'])
</script>

<template>
  <SuTagInput v-model="tags" placeholder="输入客户标签后按回车" />
</template>
```

## 可清空

通过 `clearable` 展示清空按钮：

```vue
<template>
  <SuTagInput v-model="tags" clearable placeholder="添加任务标记" />
</template>
```

## 限制数量

通过 `max` 限制最多可添加的标签数量：

```vue
<template>
  <SuTagInput v-model="tags" :max="3" placeholder="最多添加 3 个标记" />
</template>
```

## 自定义校验

通过 `validateTag` 控制标签是否允许添加，不通过时触发 `invalid` 事件：

```vue
<script setup lang="ts">
function validateKeyword(tag: string) {
  return tag.length >= 2
}

function handleInvalid(tag: string) {
  console.log(`标签“${tag}”不可添加`)
}
</script>

<template>
  <SuTagInput
    v-model="tags"
    :validate-tag="validateKeyword"
    placeholder="关键词至少 2 个字"
    @invalid="handleInvalid"
  />
</template>
```

## 自定义标签内容

通过 `tag` 插槽自定义单个标签内容：

```vue
<template>
  <SuTagInput v-model="tags">
    <template #tag="{ tag, remove }">
      <strong>{{ tag }}</strong>
      <button type="button" @click="remove">移除</button>
    </template>
  </SuTagInput>
</template>
```

## 前后置内容

通过 `prefix` 和 `suffix` 插槽添加辅助内容：

```vue
<template>
  <SuTagInput v-model="tags" placeholder="添加关键词">
    <template #prefix>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path
            d="M10 4a6 6 0 014.47 9.99l4.27 4.27-1.48 1.48-4.27-4.27A6 6 0 1110 4zm0 2a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      </SuIcon>
    </template>
  </SuTagInput>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTagInput } from '@susu-ui/vue'
</script>

<template>
  <SuTagInput v-model="tags" />
</template>
```

## Props

| 参数             | 说明                       | 类型                                                                                  | 默认值           |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------- | ---------------- |
| `v-model`        | 标签数组                   | `string[]`                                                                            | `[]`             |
| `size`           | 输入框尺寸                 | `'small' \| 'medium' \| 'large'`                                                      | `'medium'`       |
| `status`         | 输入框状态                 | `'default' \| 'success' \| 'warning' \| 'error'`                                      | `'default'`      |
| `placeholder`    | 无标签时的占位提示         | `string`                                                                              | `undefined`      |
| `disabled`       | 是否禁用                   | `boolean`                                                                             | `false`          |
| `readonly`       | 是否只读                   | `boolean`                                                                             | `false`          |
| `clearable`      | 是否显示清空按钮           | `boolean`                                                                             | `false`          |
| `allowDuplicate` | 是否允许重复标签           | `boolean`                                                                             | `false`          |
| `addOnBlur`      | 失焦时是否提交当前输入     | `boolean`                                                                             | `true`           |
| `trim`           | 添加标签前是否去除首尾空格 | `boolean`                                                                             | `true`           |
| `max`            | 最多标签数量               | `number`                                                                              | `undefined`      |
| `maxlength`      | 原生输入框最大长度         | `number \| string`                                                                    | `undefined`      |
| `separators`     | 添加标签的按键列表         | `string[]`                                                                            | `['Enter', ',']` |
| `validateTag`    | 自定义标签校验             | `(tag: string, tags: string[]) => boolean`                                            | `undefined`      |
| `name`           | 原生输入框 name            | `string`                                                                              | `undefined`      |
| `id`             | 原生输入框 id              | `string`                                                                              | `undefined`      |
| `autocomplete`   | 原生输入框 autocomplete    | `string`                                                                              | `'off'`          |
| `inputmode`      | 原生输入框 inputmode       | `'none' \| 'text' \| 'tel' \| 'url' \| 'email' \| 'numeric' \| 'decimal' \| 'search'` | `undefined`      |

## 事件

| 名称      | 说明                 | 参数                            |
| --------- | -------------------- | ------------------------------- |
| `add`     | 成功添加标签时触发   | `(tag: string)`                 |
| `remove`  | 移除标签时触发       | `(tag: string, index: number)`  |
| `clear`   | 清空标签时触发       | `()`                            |
| `input`   | 输入内容变化时触发   | `(value: string, event: Event)` |
| `focus`   | 输入框聚焦时触发     | `(event: FocusEvent)`           |
| `blur`    | 输入框失焦时触发     | `(event: FocusEvent)`           |
| `invalid` | 标签未通过校验时触发 | `(value: string)`               |

## 插槽

| 名称     | 说明     | 参数                                                 |
| -------- | -------- | ---------------------------------------------------- |
| `tag`    | 标签内容 | `{ tag: string, index: number, remove: () => void }` |
| `prefix` | 前置内容 | -                                                    |
| `suffix` | 后置内容 | -                                                    |

## 暴露方法

| 名称    | 说明         |
| ------- | ------------ |
| `focus` | 聚焦输入框   |
| `blur`  | 失焦输入框   |
| `clear` | 清空所有标签 |
