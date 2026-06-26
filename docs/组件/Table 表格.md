# Table 表格

表格用于展示结构化数据，适合列表、统计结果和配置项明细。

## 基础用法

通过 `data` 和 `columns` 渲染基础表格：

```vue
<script setup lang="ts">
const data = [
  { id: 1, name: '苏苏', role: '设计师' },
  { id: 2, name: '小满', role: '前端工程师' },
]

const columns = [
  { prop: 'name', label: '成员' },
  { prop: 'role', label: '角色' },
]
</script>

<template>
  <SuTable :data="data" :columns="columns" row-key="id" />
</template>
```

## TableColumn 列

也可以通过 `SuTableColumn` 声明列，适合需要插槽自定义内容的场景：

```vue
<template>
  <SuTable :data="data" row-key="id">
    <SuTableColumn prop="name" label="成员" />
    <SuTableColumn prop="status" label="状态" align="center">
      <template #default="{ value }">
        <SuTag size="small">{{ value }}</SuTag>
      </template>
    </SuTableColumn>
  </SuTable>
</template>
```

## 格式化内容

通过 `formatter` 格式化单元格内容，`prop` 支持 `user.name` 这类多级字段：

```vue
<template>
  <SuTable
    :data="data"
    :columns="[
      { prop: 'user.name', label: '姓名' },
      {
        prop: 'score',
        label: '评分',
        align: 'right',
        formatter: (_row, _column, value) => `${value} 分`,
      },
    ]"
  />
</template>
```

## 边框、斑马纹和尺寸

通过 `border` 显示列边框，通过 `stripe` 显示斑马纹，通过 `size` 控制尺寸：

```vue
<template>
  <SuTable :data="data" :columns="columns" border stripe size="small" />
</template>
```

## 固定高度

设置 `height` 或 `max-height` 后，表格内容区域会滚动，表头保持吸顶：

```vue
<template>
  <SuTable :data="data" :columns="columns" max-height="240px" />
</template>
```

## 空状态和加载状态

通过 `empty-text` 设置空状态文案，也可以使用 `empty` 和 `loading` 插槽：

```vue
<template>
  <SuTable :columns="columns" loading>
    <template #empty>暂无成员</template>
    <template #loading>同步中</template>
  </SuTable>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTable, SuTableColumn } from '@susu-ui/vue'
</script>

<template>
  <SuTable :data="data">
    <SuTableColumn prop="name" label="成员" />
  </SuTable>
</template>
```

## Table Props

| 参数        | 说明             | 类型                                            | 默认值       |
| ----------- | ---------------- | ----------------------------------------------- | ------------ |
| `data`      | 表格数据         | `TableRow[]`                                    | `[]`         |
| `columns`   | 列配置           | `TableColumn[]`                                 | `undefined`  |
| `rowKey`    | 行唯一键         | `string \| (row, rowIndex) => string \| number` | `undefined`  |
| `size`      | 尺寸             | `'small' \| 'medium' \| 'large'`                | `'medium'`   |
| `stripe`    | 是否显示斑马纹   | `boolean`                                       | `false`      |
| `border`    | 是否显示列边框   | `boolean`                                       | `false`      |
| `loading`   | 是否显示加载遮罩 | `boolean`                                       | `false`      |
| `emptyText` | 空状态文案       | `string`                                        | `'暂无数据'` |
| `height`    | 表格区域高度     | `number \| string`                              | `undefined`  |
| `maxHeight` | 表格区域最大高度 | `number \| string`                              | `undefined`  |

## TableColumn Props

| 参数              | 说明               | 类型                                           | 默认值       |
| ----------------- | ------------------ | ---------------------------------------------- | ------------ |
| `prop`            | 数据字段，支持多级 | `string`                                       | `undefined`  |
| `label`           | 表头文本           | `string`                                       | `undefined`  |
| `width`           | 列宽               | `number \| string`                             | `undefined`  |
| `minWidth`        | 最小列宽           | `number \| string`                             | `undefined`  |
| `align`           | 单元格对齐方式     | `'left' \| 'center' \| 'right'`                | `'left'`     |
| `headerAlign`     | 表头对齐方式       | `'left' \| 'center' \| 'right'`                | 跟随 `align` |
| `className`       | 单元格类名         | `string`                                       | `undefined`  |
| `headerClassName` | 表头单元格类名     | `string`                                       | `undefined`  |
| `formatter`       | 单元格格式化函数   | `(row, column, value, rowIndex) => VNodeChild` | `undefined`  |

## Table 事件

| 名称        | 说明             | 参数                                          |
| ----------- | ---------------- | --------------------------------------------- |
| `rowClick`  | 点击行时触发     | `(row, rowIndex, event)`                      |
| `cellClick` | 点击单元格时触发 | `(row, column, rowIndex, columnIndex, event)` |

## Table 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 表格列声明   |
| `empty`   | 空状态内容   |
| `loading` | 加载状态内容 |

## TableColumn 插槽

| 名称      | 说明             | 参数                               |
| --------- | ---------------- | ---------------------------------- |
| `default` | 自定义单元格内容 | `{ row, column, rowIndex, value }` |
| `header`  | 自定义表头内容   | `{ column, columnIndex }`          |
