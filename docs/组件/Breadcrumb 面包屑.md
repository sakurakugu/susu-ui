# Breadcrumb 面包屑

面包屑用于展示当前页面在层级结构中的位置，并提供返回上级页面的入口。

## 基础用法

通过 `items` 传入路径节点，最后一项会自动作为当前页：

```vue
<template>
  <SuBreadcrumb
    :items="[
      { label: '首页', href: '/' },
      { label: '组件', href: '/components' },
      { label: 'Breadcrumb 面包屑' },
    ]"
  />
</template>
```

## 自定义分隔符

通过 `separator` 设置节点之间的分隔符：

```vue
<template>
  <SuBreadcrumb :items="items" separator=">" />
</template>
```

## 点击事件

没有 `href` 的非当前项会渲染为按钮，点击时触发 `click` 事件：

```vue
<script setup lang="ts">
const items = [{ label: '首页' }, { label: '组件' }, { label: 'Breadcrumb 面包屑' }]

function handleClick(item: { label: string }, index: number) {
  console.log(item, index)
}
</script>

<template>
  <SuBreadcrumb :items="items" @click="handleClick" />
</template>
```

## 自定义节点

通过 `item` 和 `separator` 插槽自定义节点内容：

```vue
<template>
  <SuBreadcrumb :items="items">
    <template #item="{ item, isLast }">
      <strong v-if="isLast">{{ item.label }}</strong>
      <span v-else>{{ item.label }}</span>
    </template>

    <template #separator>></template>
  </SuBreadcrumb>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuBreadcrumb } from '@susu-ui/vue'
</script>

<template>
  <SuBreadcrumb :items="items" />
</template>
```

## Props

| 参数        | 说明                 | 类型               | 默认值         |
| ----------- | -------------------- | ------------------ | -------------- |
| `items`     | 面包屑节点列表       | `BreadcrumbItem[]` | `[]`           |
| `separator` | 分隔符文本           | `string`           | `'/'`          |
| `ariaLabel` | 导航区域的无障碍标签 | `string`           | `'面包屑导航'` |

## BreadcrumbItem

| 参数       | 说明             | 类型      | 默认值  |
| ---------- | ---------------- | --------- | ------- |
| `label`    | 节点文本         | `string`  | -       |
| `href`     | 链接地址         | `string`  | -       |
| `disabled` | 是否禁用当前节点 | `boolean` | `false` |

## 事件

| 名称    | 说明                 | 回调参数                                       |
| ------- | -------------------- | ---------------------------------------------- |
| `click` | 点击非当前节点时触发 | `(item: BreadcrumbItem, index: number, event)` |

## 插槽

| 名称        | 说明                 | 参数                      |
| ----------- | -------------------- | ------------------------- |
| `default`   | 完全自定义面包屑内容 | -                         |
| `item`      | 自定义节点内容       | `{ item, index, isLast }` |
| `separator` | 自定义分隔符         | -                         |
