# Transfer 穿梭框

穿梭框用于在两组列表之间移动选项，适合权限分配、成员选择和流程配置。

## 基础用法

通过 `data` 传入选项，`v-model` 绑定右侧目标列表的值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(['table'])
const data = [
  { label: 'Button 按钮', value: 'button' },
  { label: 'Input 输入框', value: 'input' },
  { label: 'Table 表格', value: 'table' },
]
</script>

<template>
  <SuTransfer v-model="value" :data="data" />
</template>
```

## 标题和禁用项

通过 `titles` 设置左右面板标题，选项设置 `disabled` 后不可勾选和移动：

```vue
<template>
  <SuTransfer v-model="value" :data="data" :titles="['可选组件', '已选组件']" />
</template>
```

## 筛选

设置 `filterable` 后会显示筛选输入框：

```vue
<template>
  <SuTransfer
    v-model="value"
    :data="data"
    filterable
    filter-placeholder="搜索组件"
  />
</template>
```

也可以使用 `filterMethod` 自定义筛选逻辑：

```vue
<script setup lang="ts">
function filterMethod(query, option) {
  return option.label.includes(query) || option.group === query
}
</script>

<template>
  <SuTransfer
    v-model="value"
    :data="data"
    filterable
    :filter-method="filterMethod"
  />
</template>
```

## 自定义选项

默认插槽可以自定义选项内容：

```vue
<template>
  <SuTransfer v-model="value" :data="data">
    <template #default="{ option }">
      <strong>{{ option.label }}</strong>
      <span>{{ option.description }}</span>
    </template>
  </SuTransfer>
</template>
```

## 自定义标题和空状态

```vue
<template>
  <SuTransfer v-model="value" :data="data">
    <template #left-title>待选择</template>
    <template #right-title>已选择</template>
    <template #empty="{ direction }">
      {{ direction === 'left' ? '暂无可选项' : '暂无已选项' }}
    </template>
  </SuTransfer>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTransfer } from '@susu-ui/vue'
</script>

<template>
  <SuTransfer v-model="value" :data="data" />
</template>
```

## Props

| 参数                | 说明                 | 类型                             | 默认值                   |
| ------------------- | -------------------- | -------------------------------- | ------------------------ |
| `modelValue`        | 右侧目标列表值       | `(string \| number)[]`           | `[]`                     |
| `data`              | 全量选项数据         | `TransferOption[]`               | `[]`                     |
| `titles`            | 左右面板标题         | `[string, string]`               | `['源列表', '目标列表']` |
| `size`              | 尺寸                 | `'small' \| 'medium' \| 'large'` | 表单尺寸                 |
| `disabled`          | 是否禁用             | `boolean`                        | `false`                  |
| `filterable`        | 是否显示筛选输入框   | `boolean`                        | `false`                  |
| `filterPlaceholder` | 筛选输入框占位文本   | `string`                         | `'请输入搜索内容'`       |
| `emptyText`         | 空状态文本           | `string`                         | `'暂无数据'`             |
| `leftButtonText`    | 左移按钮的无障碍说明 | `string`                         | `'移到左侧'`             |
| `rightButtonText`   | 右移按钮的无障碍说明 | `string`                         | `'移到右侧'`             |
| `filterMethod`      | 自定义筛选方法       | `(query, option) => boolean`     | `undefined`              |

## TransferOption

| 参数          | 说明         | 类型               | 默认值  |
| ------------- | ------------ | ------------------ | ------- |
| `label`       | 选项展示文本 | `string`           | -       |
| `value`       | 选项值       | `string \| number` | -       |
| `disabled`    | 是否禁用     | `boolean`          | `false` |
| `description` | 辅助说明     | `string`           | -       |

`TransferOption` 支持额外字段，可在插槽或 `filterMethod` 中使用。

## 事件

| 名称               | 说明                 | 参数                            |
| ------------------ | -------------------- | ------------------------------- |
| `change`           | 目标列表变化时触发   | `(value, direction, movedKeys)` |
| `leftCheckChange`  | 左侧勾选值变化时触发 | `(checkedKeys)`                 |
| `rightCheckChange` | 右侧勾选值变化时触发 | `(checkedKeys)`                 |

## 插槽

| 名称          | 说明               | 参数                    |
| ------------- | ------------------ | ----------------------- |
| `default`     | 自定义选项内容     | `{ option, direction }` |
| `left-title`  | 自定义左侧面板标题 | -                       |
| `right-title` | 自定义右侧面板标题 | -                       |
| `empty`       | 自定义空状态内容   | `{ direction }`         |
