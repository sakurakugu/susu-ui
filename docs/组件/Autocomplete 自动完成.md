# Autocomplete 自动完成

自动完成用于在输入时展示候选建议，适合搜索、城市、成员或标签录入。

## 基础用法

通过 `options` 传入建议项，输入内容会默认按 `label` 和 `value` 过滤：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const city = ref('')
const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
]
</script>

<template>
  <SuAutocomplete v-model="city" :options="options" placeholder="请输入城市" />
</template>
```

## 清空输入

设置 `clearable` 后，有输入内容时会显示清空按钮：

```vue
<template>
  <SuAutocomplete v-model="city" :options="options" clearable />
</template>
```

## 自定义建议

通过 `fetch-suggestions` 可以根据输入动态返回建议项：

```vue
<script setup lang="ts">
function fetchSuggestions(query: string) {
  return query
    ? [{ label: `搜索 ${query}`, value: query }]
    : [{ label: '默认建议', value: 'default' }]
}
</script>

<template>
  <SuAutocomplete :fetch-suggestions="fetchSuggestions" />
</template>
```

## 禁用过滤

设置 `filterable` 为 `false` 后，聚焦时会展示完整建议列表：

```vue
<template>
  <SuAutocomplete :options="options" :filterable="false" />
</template>
```

## 自定义选项

通过 `option` 插槽可以自定义建议项内容：

```vue
<template>
  <SuAutocomplete :options="options">
    <template #option="{ option }">
      <span>{{ option.label }}</span>
      <small>{{ option.value }}</small>
    </template>
  </SuAutocomplete>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuAutocomplete } from '@susu-ui/vue'
</script>
```

## Props

| 参数               | 说明             | 类型                                             | 默认值           |
| ------------------ | ---------------- | ------------------------------------------------ | ---------------- |
| `modelValue`       | 绑定值           | `string \| number`                               | `''`             |
| `options`          | 建议项数组       | `AutocompleteOption[]`                           | `undefined`      |
| `size`             | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸         |
| `status`           | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`      |
| `placeholder`      | 占位文本         | `string`                                         | `undefined`      |
| `disabled`         | 是否禁用         | `boolean`                                        | `false`          |
| `readonly`         | 是否只读         | `boolean`                                        | `false`          |
| `clearable`        | 是否支持清空     | `boolean`                                        | `false`          |
| `filterable`       | 是否按输入过滤   | `boolean`                                        | `true`           |
| `fetchSuggestions` | 自定义建议函数   | `(query: string) => AutocompleteOption[]`        | `undefined`      |
| `emptyText`        | 空状态文本       | `string`                                         | `'暂无匹配结果'` |
| `name`             | 原生 `name` 属性 | `string`                                         | `undefined`      |
| `id`               | 原生 `id` 属性   | `string`                                         | `undefined`      |
| `autocomplete`     | 原生自动填充属性 | `string`                                         | `'off'`          |
| `required`         | 是否必填         | `boolean`                                        | `false`          |

## AutocompleteOption

| 参数       | 说明         | 类型               | 默认值  |
| ---------- | ------------ | ------------------ | ------- |
| `label`    | 建议展示文本 | `string`           | -       |
| `value`    | 建议值       | `string \| number` | -       |
| `disabled` | 是否禁用建议 | `boolean`          | `false` |

## 事件

| 名称     | 说明             | 参数             |
| -------- | ---------------- | ---------------- |
| `input`  | 输入时触发       | `(value, event)` |
| `change` | 值变化后触发     | `(value, event)` |
| `focus`  | 聚焦时触发       | `(event)`        |
| `blur`   | 失焦时触发       | `(event)`        |
| `clear`  | 清空输入时触发   | -                |
| `select` | 选择建议项时触发 | `(option)`       |

## 插槽

| 名称     | 说明             |
| -------- | ---------------- |
| `option` | 自定义建议项内容 |
| `empty`  | 自定义空状态内容 |
