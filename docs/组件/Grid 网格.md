# Grid 网格

网格用于构建二维布局，适合指标看板、表单分区、卡片矩阵等需要跨列或响应式排列的场景。

## 基础用法

通过 `columns` 设置总列数，配合 `SuGridItem` 的 `span` 控制项目跨列：

```vue
<template>
  <SuGrid :columns="12" :gap="16">
    <SuGridItem :span="6">本月成交额</SuGridItem>
    <SuGridItem :span="3">新增客户</SuGridItem>
    <SuGridItem :span="3">待跟进</SuGridItem>
  </SuGrid>
</template>
```

## 间距和对齐

`gap` 支持预设值、数字、CSS 长度，也支持数组分别设置横向和纵向间距：

```vue
<template>
  <SuGrid :columns="4" :gap="[24, 12]" align="center" justify="start">
    <SuGridItem>销售线索</SuGridItem>
    <SuGridItem>合同审核</SuGridItem>
    <SuGridItem>回款计划</SuGridItem>
  </SuGrid>
</template>
```

## 自动适配

设置 `min-item-width` 后，网格会按项目最小宽度自动计算列数：

```vue
<template>
  <SuGrid min-item-width="180px" :gap="12">
    <div v-for="product in products" :key="product">
      {{ product }}
    </div>
  </SuGrid>
</template>
```

## 跨行、偏移和排序

`SuGridItem` 支持跨列、跨行、偏移和排序：

```vue
<template>
  <SuGrid :columns="6" dense>
    <SuGridItem :span="3" :row-span="2">重点客户</SuGridItem>
    <SuGridItem :span="2" :offset="1">合同审核</SuGridItem>
    <SuGridItem :span="2" :order="-1">今日提醒</SuGridItem>
  </SuGrid>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuGrid, SuGridItem } from '@susu-ui/vue'
</script>
```

## Grid Props

| 参数           | 说明                         | 类型                                                                         | 默认值      |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------- | ----------- |
| `columns`      | 网格总列数                   | `number`                                                                     | `12`        |
| `gap`          | 网格间距                     | `'small' \| 'medium' \| 'large' \| number \| string \| [GridSize, GridSize]` | `'medium'`  |
| `align`        | 项目交叉轴对齐方式           | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'`                    | `'stretch'` |
| `justify`      | 项目主轴对齐方式             | `'start' \| 'end' \| 'center' \| 'stretch'`                                  | `'stretch'` |
| `dense`        | 是否启用紧凑自动填充         | `boolean`                                                                    | `false`     |
| `minItemWidth` | 项目最小宽度，设置后自动适配 | `number \| string`                                                           | `undefined` |

## GridItem Props

| 参数      | 说明         | 类型     | 默认值      |
| --------- | ------------ | -------- | ----------- |
| `span`    | 跨列数       | `number` | `1`         |
| `rowSpan` | 跨行数       | `number` | `1`         |
| `offset`  | 左侧偏移列数 | `number` | `0`         |
| `order`   | 排序权重     | `number` | `undefined` |

## 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 网格项目内容 |
