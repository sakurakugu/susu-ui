# VirtualList 虚拟列表

虚拟列表用于渲染大量同高列表项，只保留可视区和缓冲区内容，适合客户列表、日志流、任务队列等长列表场景。

## 基础用法

通过 `items` 传入数据，`height` 设置滚动容器高度，`item-height` 设置每一项的固定高度：

```vue
<script setup lang="ts">
const customers = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `企业客户 ${index + 1}`,
  owner: ['苏苏', '小满', '青禾'][index % 3],
}))
</script>

<template>
  <SuVirtualList :items="customers" :height="320" :item-height="56" item-key="id">
    <template #default="{ item, index }">
      <div class="customer-row">
        <strong>{{ item.name }}</strong>
        <span>负责人：{{ item.owner }}，序号：{{ index + 1 }}</span>
      </div>
    </template>
  </SuVirtualList>
</template>
```

## 缓冲区

通过 `buffer` 控制可视区上下额外渲染的列表项数量。滚动速度较快或列表项内容较复杂时，可以适当增大缓冲区：

```vue
<template>
  <SuVirtualList :items="logs" height="360px" :item-height="48" :buffer="8" item-key="id" />
</template>
```

## 空状态

数据为空时显示 `empty-text`，也可以使用 `empty` 插槽自定义内容：

```vue
<template>
  <SuVirtualList :items="[]" :height="160" empty-text="暂无记录">
    <template #empty>当前筛选条件下没有客户记录</template>
  </SuVirtualList>
</template>
```

## 滚动到指定位置

组件暴露 `scrollTo` 和 `scrollToIndex` 方法，可通过模板引用控制滚动位置：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const listRef = ref()

function jumpToLatest() {
  listRef.value?.scrollToIndex(99, 'center')
}
</script>

<template>
  <SuVirtualList ref="listRef" :items="items" :item-height="44" />
  <SuButton @click="jumpToLatest">定位到最新记录</SuButton>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuVirtualList } from '@susu-ui/vue'
</script>
```

## Props

| 参数         | 说明                         | 类型                                                    | 默认值     |
| ------------ | ---------------------------- | ------------------------------------------------------- | ---------- |
| `items`      | 列表数据                     | `unknown[]`                                             | `[]`       |
| `height`     | 滚动容器高度                 | `number \| string`                                      | `320`      |
| `itemHeight` | 每一项固定高度，单位为像素   | `number`                                                | `40`       |
| `itemKey`    | 列表项唯一键                 | `string \| number \| (item, index) => string \| number` | `index`    |
| `buffer`     | 可视区上下额外渲染的项目数量 | `number`                                                | `5`        |
| `emptyText`  | 空状态文案                   | `string`                                                | `暂无数据` |

## 事件

| 名称     | 说明           | 参数             |
| -------- | -------------- | ---------------- |
| `scroll` | 滚动列表时触发 | `(event, state)` |

`state` 包含 `scrollTop`、`startIndex`、`endIndex` 和 `visibleCount`。

## 插槽

| 名称      | 说明         | 参数                         |
| --------- | ------------ | ---------------------------- |
| `default` | 自定义列表项 | `{ item, index, itemIndex }` |
| `empty`   | 自定义空状态 | 无                           |

## 暴露方法

| 名称            | 说明               | 参数                                                    |
| --------------- | ------------------ | ------------------------------------------------------- |
| `scrollTo`      | 滚动到指定偏移量   | `(offset: number)`                                      |
| `scrollToIndex` | 滚动到指定数据索引 | `(index: number, align?: 'start' \| 'center' \| 'end')` |
