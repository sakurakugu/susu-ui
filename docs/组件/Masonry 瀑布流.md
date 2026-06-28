# Masonry 瀑布流

瀑布流用于排列高度不一致的内容卡片，适合素材库、内容流、灵感看板和报告集合等场景。

## 基础用法

直接把卡片放入默认插槽，组件会按列排列并避免单个项目在列中断开：

```vue
<template>
  <SuMasonry :columns="3" :gap="16">
    <article v-for="note in notes" :key="note.title">
      {{ note.title }}
    </article>
  </SuMasonry>
</template>
```

## 自适应列宽

设置 `min-column-width` 后，组件会根据容器宽度自动计算列数：

```vue
<template>
  <SuMasonry min-column-width="220px" :gap="[16, 20]">
    <article v-for="report in reports" :key="report.id">
      <h3>{{ report.title }}</h3>
      <p>{{ report.summary }}</p>
    </article>
  </SuMasonry>
</template>
```

## 使用数据源

传入 `items` 后可使用 `item` 插槽渲染每个项目，`item-key` 支持字段路径或函数：

```vue
<template>
  <SuMasonry
    :items="reports"
    item-key="id"
    item-tag="article"
    min-column-width="240px"
  >
    <template #item="{ item, index }">
      <h3>{{ index + 1 }}. {{ item.title }}</h3>
      <p>{{ item.summary }}</p>
    </template>
  </SuMasonry>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuMasonry } from '@susu-ui/vue'
</script>
```

## Props

| 参数             | 说明                                   | 类型                                                                  | 默认值      |
| ---------------- | -------------------------------------- | --------------------------------------------------------------------- | ----------- |
| `items`          | 数据源，传入后使用 `item` 插槽逐项渲染 | `unknown[]`                                                           | `undefined` |
| `columns`        | 固定列数                               | `number`                                                              | `3`         |
| `minColumnWidth` | 最小列宽，设置后自动计算列数           | `number \| string`                                                    | `undefined` |
| `gap`            | 列间距和行间距                         | `'small' \| 'medium' \| 'large' \| number \| string \| [size, size]`  | `'medium'`  |
| `columnFill`     | 多列内容填充方式                       | `'balance' \| 'auto'`                                                 | `'balance'` |
| `tag`            | 根节点标签                             | `string`                                                              | `'div'`     |
| `itemTag`        | 数据源模式下的项目标签                 | `string`                                                              | `'div'`     |
| `itemKey`        | 数据源模式下的项目 key                 | `string \| number \| ((item: unknown, index: number) => PropertyKey)` | `undefined` |

## 插槽

| 名称      | 说明                  |
| --------- | --------------------- |
| `default` | 自定义瀑布流项目      |
| `item`    | 渲染 `items` 中的项目 |
