# Select 选择器

选择器用于从一组选项中选择一个值，适合表单、筛选和配置项。

## 基础用法

通过 `options` 传入选项数组：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const city = ref('')
const options = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
]
</script>

<template>
  <SuSelect v-model="city" :options="options" placeholder="请选择城市" />
</template>
```

## 清空选择

设置 `clearable` 后，已有选择时会显示清空按钮：

```vue
<template>
  <SuSelect v-model="city" :options="options" clearable />
</template>
```

## Option 选项

也可以通过默认插槽传入 `SuOption`：

```vue
<template>
  <SuSelect v-model="status">
    <SuOption value="enabled" label="启用" />
    <SuOption value="disabled">停用</SuOption>
    <SuOption value="archived" disabled>归档</SuOption>
  </SuSelect>
</template>
```

`SuOption` 会渲染为原生 `option`，因此会保留浏览器选择器和表单行为。

## 原生选项

如需直接使用原生 `option`，也可以继续通过默认插槽传入：

```vue
<template>
  <SuSelect v-model="status">
    <option value="enabled">启用</option>
    <option value="disabled">停用</option>
  </SuSelect>
</template>
```

## 尺寸和状态

通过 `size` 设置尺寸，通过 `status` 设置校验状态：

```vue
<template>
  <SuSelect size="small" :options="options" />
  <SuSelect status="error" placeholder="请选择" />
</template>
```

## 表单校验

选择器基于原生 `select`，支持 `name`、`required` 等表单属性：

```vue
<template>
  <SuSelect name="city" required :options="options" placeholder="请选择城市" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuOption, SuSelect } from '@susu-ui/vue'
</script>

<template>
  <SuSelect v-model="status">
    <SuOption value="enabled" label="启用" />
  </SuSelect>
</template>
```

## Props

| 参数          | 说明             | 类型                                             | 默认值      |
| ------------- | ---------------- | ------------------------------------------------ | ----------- |
| `modelValue`  | 绑定值           | `string \| number`                               | `''`        |
| `options`     | 选项数组         | `SelectOption[]`                                 | `undefined` |
| `size`        | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸    |
| `status`      | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` |
| `placeholder` | 占位文本         | `string`                                         | `undefined` |
| `disabled`    | 是否禁用         | `boolean`                                        | `false`     |
| `clearable`   | 是否支持清空     | `boolean`                                        | `false`     |
| `name`        | 原生 `name` 属性 | `string`                                         | `undefined` |
| `id`          | 原生 `id` 属性   | `string`                                         | `undefined` |
| `required`    | 是否必填         | `boolean`                                        | `false`     |

## SelectOption

| 参数       | 说明         | 类型               | 默认值  |
| ---------- | ------------ | ------------------ | ------- |
| `label`    | 选项展示文本 | `string`           | -       |
| `value`    | 选项值       | `string \| number` | -       |
| `disabled` | 是否禁用选项 | `boolean`          | `false` |

## Option Props

| 参数       | 说明         | 类型               | 默认值      |
| ---------- | ------------ | ------------------ | ----------- |
| `label`    | 选项展示文本 | `string`           | `undefined` |
| `value`    | 选项值       | `string \| number` | -           |
| `disabled` | 是否禁用选项 | `boolean`          | `false`     |

## 事件

| 名称     | 说明             | 参数             |
| -------- | ---------------- | ---------------- |
| `change` | 选中值变化时触发 | `(value, event)` |
| `focus`  | 聚焦时触发       | `(event)`        |
| `blur`   | 失焦时触发       | `(event)`        |
| `clear`  | 清空选择时触发   | -                |

## 插槽

| 名称      | 说明                                 |
| --------- | ------------------------------------ |
| `default` | 自定义 `SuOption` 或原生 `option` 项 |

## Option 插槽

| 名称      | 说明                                    |
| --------- | --------------------------------------- |
| `default` | 自定义选项内容，不传时显示 `label` 属性 |
