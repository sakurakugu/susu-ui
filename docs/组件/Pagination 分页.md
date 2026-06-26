# Pagination 分页

分页用于切换大量列表数据的页码，支持页码折叠、每页条数、总数展示和快速跳转。

## 基础用法

通过 `v-model` 绑定当前页：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <SuPagination v-model="page" :total="80" />
</template>
```

## 总数和每页条数

通过 `show-total` 展示总数，通过 `show-size-changer` 开启每页条数选择：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <SuPagination
    v-model="page"
    v-model:page-size="pageSize"
    :total="236"
    show-total
    show-size-changer
  />
</template>
```

## 快速跳转

通过 `show-quick-jumper` 开启页码输入跳转：

```vue
<template>
  <SuPagination v-model="page" :total="236" show-quick-jumper />
</template>
```

## 简单模式

通过 `simple` 展示精简页码：

```vue
<template>
  <SuPagination v-model="page" :total="80" simple />
</template>
```

## 尺寸和禁用

通过 `size` 控制尺寸，通过 `disabled` 禁用分页：

```vue
<template>
  <SuPagination size="small" :total="80" />
  <SuPagination :total="80" />
  <SuPagination size="large" :total="80" />
  <SuPagination disabled :total="80" />
</template>
```

## 单页隐藏

通过 `hide-on-single-page` 在只有一页时隐藏分页：

```vue
<template>
  <SuPagination :total="5" hide-on-single-page />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuPagination } from '@susu-ui/vue'
</script>
```

## Props

| 参数               | 说明                 | 类型                             | 默认值              |
| ------------------ | -------------------- | -------------------------------- | ------------------- |
| `v-model`          | 当前页               | `number`                         | `1`                 |
| `v-model:pageSize` | 每页条数             | `number`                         | `10`                |
| `total`            | 数据总条数           | `number`                         | `0`                 |
| `pagerCount`       | 页码按钮数量         | `number`                         | `7`                 |
| `pageSizes`        | 每页条数选项         | `number[]`                       | `[10, 20, 50, 100]` |
| `size`             | 尺寸                 | `'small' \| 'medium' \| 'large'` | `'medium'`          |
| `disabled`         | 是否禁用             | `boolean`                        | `false`             |
| `showTotal`        | 是否展示总数         | `boolean`                        | `false`             |
| `showSizeChanger`  | 是否展示每页条数选择 | `boolean`                        | `false`             |
| `showQuickJumper`  | 是否展示快速跳转     | `boolean`                        | `false`             |
| `simple`           | 是否使用简单模式     | `boolean`                        | `false`             |
| `hideOnSinglePage` | 单页时是否隐藏       | `boolean`                        | `false`             |
| `prevText`         | 上一页按钮文本       | `string`                         | `'上一页'`          |
| `nextText`         | 下一页按钮文本       | `string`                         | `'下一页'`          |

## 事件

| 名称            | 说明                 | 参数               |
| --------------- | -------------------- | ------------------ |
| `change`        | 当前页或每页条数变化 | `(page, pageSize)` |
| `currentChange` | 当前页变化           | `(page)`           |
| `sizeChange`    | 每页条数变化         | `(pageSize)`       |
| `prevClick`     | 点击上一页           | `(page)`           |
| `nextClick`     | 点击下一页           | `(page)`           |
