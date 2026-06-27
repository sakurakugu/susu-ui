# Timeline 时间轴

时间轴用于按照时间顺序展示事件、任务流转或版本记录。

## 基础用法

通过 `items` 设置时间轴节点。每个节点可以配置时间、标题、描述和类型。

```vue
<template>
  <SuTimeline :items="items" />
</template>

<script setup lang="ts">
const items = [
  {
    time: '09:00',
    title: '创建发布任务',
    description: '负责人完成标题、摘要和素材录入。',
    type: 'primary',
  },
  {
    time: '10:20',
    title: '内容审核通过',
    description: '审核记录已归档，进入排期阶段。',
    type: 'success',
  },
  {
    time: '11:45',
    title: '等待定时发布',
    description: '系统将在指定时间同步到线上环境。',
    type: 'warning',
    hollow: true,
  },
]
</script>
```

## 展示位置

通过 `position` 控制内容展示位置，支持左侧、右侧和交替展示。

```vue
<template>
  <SuTimeline :items="items" position="right" />
  <SuTimeline :items="items" position="alternate" />
</template>
```

## 反向展示

设置 `reverse` 后，节点会按照传入顺序反向展示，适合展示最近事件优先的列表。

```vue
<template>
  <SuTimeline :items="items" reverse />
</template>
```

## 自定义节点

通过 `dot` 插槽自定义节点内容，也可以通过 `color` 或 `hollow` 调整单个节点样式。

```vue
<template>
  <SuTimeline :items="items">
    <template #dot="{ index }">
      {{ index + 1 }}
    </template>
  </SuTimeline>
</template>
```

## 自定义内容

使用默认插槽完全接管节点内容，也可以分别使用 `time`、`title`、`description` 插槽覆盖局部内容。

```vue
<template>
  <SuTimeline :items="items">
    <template #default="{ item }">
      <strong>{{ item.title }}</strong>
      <p>{{ item.description }}</p>
    </template>
  </SuTimeline>
</template>
```

## 按需导入

```ts
import { SuTimeline } from '@susu-ui/vue'
```

## API

### 属性

| 属性         | 说明           | 类型                               | 默认值     |
| ------------ | -------------- | ---------------------------------- | ---------- |
| `items`      | 时间轴数据     | `TimelineItem[]`                   | `[]`       |
| `position`   | 内容展示位置   | `'left' \| 'right' \| 'alternate'` | `'left'`   |
| `size`       | 尺寸           | `'small' \| 'medium' \| 'large'`   | `'medium'` |
| `reverse`    | 是否反向展示   | `boolean`                          | `false`    |
| `hide-tail`  | 是否隐藏连接线 | `boolean`                          | `false`    |
| `aria-label` | 无障碍标签     | `string`                           | `'时间轴'` |

### TimelineItem

| 字段          | 说明           | 类型                                                                    | 默认值      |
| ------------- | -------------- | ----------------------------------------------------------------------- | ----------- |
| `title`       | 节点标题       | `string`                                                                | `undefined` |
| `description` | 节点描述       | `string`                                                                | `undefined` |
| `time`        | 节点时间       | `string`                                                                | `undefined` |
| `type`        | 节点类型       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `color`       | 自定义节点颜色 | `string`                                                                | `undefined` |
| `hollow`      | 是否空心节点   | `boolean`                                                               | `false`     |

### 插槽

| 名称          | 说明           | 参数                    |
| ------------- | -------------- | ----------------------- |
| `default`     | 自定义节点内容 | `{ item, index, type }` |
| `dot`         | 自定义节点标识 | `{ item, index, type }` |
| `time`        | 自定义时间     | `{ item, index, type }` |
| `title`       | 自定义标题     | `{ item, index, type }` |
| `description` | 自定义描述     | `{ item, index, type }` |
