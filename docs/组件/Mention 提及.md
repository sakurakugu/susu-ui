# Mention 提及

提及用于在文本输入中通过 `@` 触发候选列表，适合评论、任务协作、审批流和成员分配等场景。

## 基础用法

通过 `options` 传入成员候选项。输入 `@` 后展示候选列表，选择后会把 `@value` 插入到当前光标位置：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const content = ref('')
const members = [
  { label: '张晨', value: 'zhangchen', description: '产品经理' },
  { label: '李明', value: 'liming', description: '前端工程师' },
]
</script>

<template>
  <SuMention v-model="content" :options="members" placeholder="输入 @ 提及成员" />
</template>
```

## 多行输入

设置 `type="textarea"` 后可用于评论、备注等长文本输入：

```vue
<template>
  <SuMention
    v-model="content"
    :options="members"
    type="textarea"
    placeholder="输入评论，使用 @ 提及同事"
  />
</template>
```

## 自定义触发符

通过 `prefix` 可以把触发符改为 `#`、`/` 等字符：

```vue
<script setup lang="ts">
const topics = [
  { label: '客户反馈', value: 'customer-feedback' },
  { label: '预算审批', value: 'budget-review' },
]
</script>

<template>
  <SuMention v-model="content" :options="topics" prefix="#" />
</template>
```

## 自定义候选来源

通过 `fetch-suggestions` 根据关键词动态返回候选项：

```vue
<script setup lang="ts">
function fetchMembers(query: string) {
  return query
    ? [{ label: `搜索 ${query}`, value: query }]
    : [{ label: '默认成员', value: 'default' }]
}
</script>

<template>
  <SuMention v-model="content" :fetch-suggestions="fetchMembers" />
</template>
```

## 自定义候选项

通过 `option` 插槽可以展示头像、职位或其他补充信息：

```vue
<template>
  <SuMention v-model="content" :options="members">
    <template #option="{ option }">
      <strong>{{ option.label }}</strong>
      <small>{{ option.description }}</small>
    </template>
  </SuMention>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuMention } from '@susu-ui/vue'
</script>
```

## Props

| 参数               | 说明                 | 类型                                             | 默认值           |
| ------------------ | -------------------- | ------------------------------------------------ | ---------------- |
| `modelValue`       | 绑定文本值           | `string`                                         | `''`             |
| `options`          | 候选项数组           | `MentionOption[]`                                | `undefined`      |
| `size`             | 尺寸                 | `'small' \| 'medium' \| 'large'`                 | 表单尺寸         |
| `status`           | 状态                 | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`      |
| `type`             | 输入类型             | `'text' \| 'textarea'`                           | `'text'`         |
| `placeholder`      | 占位文本             | `string`                                         | `undefined`      |
| `disabled`         | 是否禁用             | `boolean`                                        | `false`          |
| `readonly`         | 是否只读             | `boolean`                                        | `false`          |
| `clearable`        | 是否支持清空         | `boolean`                                        | `false`          |
| `filterable`       | 是否按关键词过滤     | `boolean`                                        | `true`           |
| `prefix`           | 触发符               | `string`                                         | `'@'`            |
| `split`            | 插入提及后的分隔文本 | `string`                                         | `' '`            |
| `placement`        | 下拉层方向           | `'bottom' \| 'top'`                              | `'bottom'`       |
| `emptyText`        | 空状态文本           | `string`                                         | `'暂无匹配成员'` |
| `name`             | 原生 `name` 属性     | `string`                                         | `undefined`      |
| `id`               | 原生 `id` 属性       | `string`                                         | `undefined`      |
| `autocomplete`     | 原生自动填充属性     | `string`                                         | `'off'`          |
| `required`         | 是否必填             | `boolean`                                        | `false`          |
| `rows`             | 多行输入行数         | `number \| string`                               | `3`              |
| `maxlength`        | 最大输入长度         | `number \| string`                               | `undefined`      |
| `fetchSuggestions` | 自定义候选函数       | `(query, prefix) => MentionOption[]`             | `undefined`      |

## MentionOption

| 参数          | 说明         | 类型      | 默认值  |
| ------------- | ------------ | --------- | ------- |
| `label`       | 候选展示文本 | `string`  | -       |
| `value`       | 插入值       | `string`  | -       |
| `disabled`    | 是否禁用候选 | `boolean` | `false` |
| `avatar`      | 头像地址     | `string`  | -       |
| `description` | 补充描述     | `string`  | -       |

## 事件

| 名称     | 说明             | 参数              |
| -------- | ---------------- | ----------------- |
| `input`  | 输入时触发       | `(value, event)`  |
| `change` | 值变化后触发     | `(value, event)`  |
| `focus`  | 聚焦时触发       | `(event)`         |
| `blur`   | 失焦时触发       | `(event)`         |
| `clear`  | 清空输入时触发   | -                 |
| `select` | 选择候选项时触发 | `(option, value)` |

## 插槽

| 名称     | 说明             |
| -------- | ---------------- |
| `option` | 自定义候选项内容 |
| `empty`  | 自定义空状态内容 |
