# Anchor 锚点

锚点用于长页面或滚动容器内的目录导航，帮助用户快速跳转到指定内容段落，并随滚动同步当前激活项。

## 基础用法

通过 `items` 配置锚点列表，`href` 指向页面内对应元素的 `id`：

```vue
<script setup lang="ts">
import type { AnchorItem } from '@susu-ui/vue'

const items: AnchorItem[] = [
  { key: 'overview', href: '#overview', title: '项目概览' },
  { key: 'process', href: '#process', title: '上线流程' },
  { key: 'report', href: '#report', title: '复盘报告' },
]
</script>

<template>
  <SuAnchor :items="items" :offset-top="80" />

  <section id="overview">项目概览</section>
  <section id="process">上线流程</section>
  <section id="report">复盘报告</section>
</template>
```

## 多级目录

使用 `children` 可以渲染多级锚点目录：

```vue
<script setup lang="ts">
const items = [
  {
    key: 'process',
    href: '#process',
    title: '上线流程',
    children: [
      { key: 'check', href: '#check', title: '检查清单' },
      { key: 'risk', href: '#risk', title: '风险确认' },
    ],
  },
]
</script>

<template>
  <SuAnchor :items="items" />
</template>
```

## 指定滚动容器

通过 `target` 返回滚动容器，锚点会在该容器内滚动和计算激活项：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const containerRef = ref<HTMLElement>()
const items = [
  { key: 'brief', href: '#brief', title: '投放目标' },
  { key: 'material', href: '#material', title: '素材规范' },
]
</script>

<template>
  <div ref="containerRef" style="max-height: 260px; overflow: auto">
    <section id="brief">投放目标</section>
    <section id="material">素材规范</section>
  </div>

  <SuAnchor :items="items" :target="() => containerRef" :offset-top="12" />
</template>
```

## 受控激活项

使用 `v-model:active-key` 可以读取或控制当前激活锚点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeKey = ref<string>()
</script>

<template>
  <SuAnchor v-model:active-key="activeKey" :items="items" />
  <span>当前段落：{{ activeKey }}</span>
</template>
```

## 自定义内容

默认插槽会收到当前项和激活状态，可用于添加状态标识：

```vue
<template>
  <SuAnchor :items="items">
    <template #default="{ item, active }">
      <span :class="{ active }">{{ item.title }}</span>
    </template>
  </SuAnchor>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuAnchor } from '@susu-ui/vue'
</script>

<template>
  <SuAnchor :items="items" />
</template>
```

## Props

| 参数        | 说明                            | 类型                                  | 默认值       |
| ----------- | ------------------------------- | ------------------------------------- | ------------ |
| `items`     | 锚点数据                        | `AnchorItem[]`                        | `[]`         |
| `activeKey` | 当前激活锚点，支持 `v-model`    | `string \| number`                    | `undefined`  |
| `offsetTop` | 滚动到目标位置时保留的顶部偏移  | `number`                              | `0`          |
| `bounds`    | 判断当前激活项时的额外偏移范围  | `number`                              | `5`          |
| `target`    | 返回滚动容器，默认使用 `window` | `() => Window \| HTMLElement \| null` | `undefined`  |
| `behavior`  | 滚动行为                        | `'auto' \| 'instant' \| 'smooth'`     | `'smooth'`   |
| `disabled`  | 是否禁用全部锚点                | `boolean`                             | `false`      |
| `emptyText` | 空数据文案                      | `string`                              | `'暂无锚点'` |

## AnchorItem

| 字段       | 说明             | 类型               | 必填 |
| ---------- | ---------------- | ------------------ | ---- |
| `key`      | 锚点唯一标识     | `string \| number` | 是   |
| `href`     | 目标元素选择器   | `string`           | 是   |
| `title`    | 展示标题         | `string`           | 是   |
| `children` | 子级锚点         | `AnchorItem[]`     | 否   |
| `disabled` | 是否禁用当前锚点 | `boolean`          | 否   |

## 事件

| 名称     | 说明               | 参数                                                               |
| -------- | ------------------ | ------------------------------------------------------------------ |
| `click`  | 点击锚点时触发     | `event: MouseEvent, item: AnchorRenderItem`                        |
| `change` | 激活锚点变化时触发 | `key: AnchorKey \| undefined, item: AnchorRenderItem \| undefined` |

## 插槽

| 名称      | 说明         | 参数                                          |
| --------- | ------------ | --------------------------------------------- |
| `default` | 自定义锚点项 | `{ item: AnchorRenderItem; active: boolean }` |
| `empty`   | 自定义空状态 | -                                             |
