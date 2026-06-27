# Cascader 级联选择

级联选择用于在多层级数据中选择一个路径，适合地区、组织、分类等有关联层级的场景。

## 基础用法

通过 `options` 传入树形选项，`v-model` 绑定完整路径值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const region = ref<(string | number)[]>([])

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [{ label: '西湖区', value: 'xihu' }],
      },
    ],
  },
]
</script>

<template>
  <SuCascader v-model="region" :options="options" placeholder="请选择地区" />
</template>
```

## 清空选择

设置 `clearable` 后，已有选择时会显示清空按钮：

```vue
<template>
  <SuCascader v-model="region" :options="options" clearable />
</template>
```

## 选择任意层级

默认只会在选择叶子节点时更新绑定值。设置 `change-on-select` 后，可以选择任意层级：

```vue
<template>
  <SuCascader v-model="category" :options="options" change-on-select />
</template>
```

## 自定义选项

通过 `option` 插槽可以自定义每一项内容：

```vue
<template>
  <SuCascader :options="options">
    <template #option="{ option }">
      <span>{{ option.label }}</span>
    </template>
  </SuCascader>
</template>
```

## 表单提交

传入 `name` 后会渲染隐藏表单项，值会按英文逗号拼接：

```vue
<template>
  <SuCascader name="region" required :options="options" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCascader } from '@susu-ui/vue'
</script>
```

## Props

| 参数             | 说明             | 类型                                             | 默认值       |
| ---------------- | ---------------- | ------------------------------------------------ | ------------ |
| `modelValue`     | 绑定路径值       | `(string \| number)[]`                           | `[]`         |
| `options`        | 级联选项         | `CascaderOption[]`                               | `[]`         |
| `size`           | 尺寸             | `'small' \| 'medium' \| 'large'`                 | 表单尺寸     |
| `status`         | 状态             | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`  |
| `placeholder`    | 占位文本         | `string`                                         | `'请选择'`   |
| `disabled`       | 是否禁用         | `boolean`                                        | `false`      |
| `clearable`      | 是否支持清空     | `boolean`                                        | `false`      |
| `changeOnSelect` | 是否选择任意层级 | `boolean`                                        | `false`      |
| `separator`      | 展示分隔符       | `string`                                         | `' / '`      |
| `emptyText`      | 空状态文本       | `string`                                         | `'暂无数据'` |
| `name`           | 隐藏表单项名称   | `string`                                         | `undefined`  |
| `id`             | 触发按钮 `id`    | `string`                                         | `undefined`  |
| `required`       | 是否必填         | `boolean`                                        | `false`      |
| `ariaLabel`      | 无障碍标签       | `string`                                         | `'级联选择'` |

## CascaderOption

| 参数       | 说明         | 类型               | 默认值  |
| ---------- | ------------ | ------------------ | ------- |
| `label`    | 选项展示文本 | `string`           | -       |
| `value`    | 选项值       | `string \| number` | -       |
| `children` | 子选项       | `CascaderOption[]` | -       |
| `disabled` | 是否禁用选项 | `boolean`          | `false` |
| `isLeaf`   | 是否强制叶子 | `boolean`          | `false` |

## 事件

| 名称     | 说明             | 参数                       |
| -------- | ---------------- | -------------------------- |
| `change` | 选中值变化时触发 | `(value, selectedOptions)` |
| `focus`  | 聚焦时触发       | `(event)`                  |
| `blur`   | 失焦时触发       | `(event)`                  |
| `clear`  | 清空选择时触发   | -                          |
| `open`   | 展开面板时触发   | -                          |
| `close`  | 关闭面板时触发   | -                          |

## 插槽

| 名称     | 说明             |
| -------- | ---------------- |
| `option` | 自定义选项内容   |
| `empty`  | 自定义空状态内容 |
