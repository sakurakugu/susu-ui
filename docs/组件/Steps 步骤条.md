# Steps 步骤条

步骤条用于展示流程进度，适合发布、审核、支付、配置向导等多阶段任务。

## 基础用法

通过 `items` 设置步骤项，`current` 设置当前步骤。`current` 可以是步骤索引，也可以匹配步骤项的 `value`。

```vue
<template>
  <SuSteps :items="items" :current="1" />
</template>

<script setup lang="ts">
const items = [
  { title: '填写信息', description: '录入基础资料' },
  { title: '确认内容', description: '检查提交内容' },
  { title: '完成提交', description: '等待系统处理' },
]
</script>
```

## 当前状态

通过 `status` 设置当前步骤状态，步骤项自身的 `status` 优先级更高。

```vue
<template>
  <SuSteps :items="items" :current="1" status="error" />
</template>
```

## 纵向步骤

设置 `direction="vertical"` 后纵向展示。

```vue
<template>
  <SuSteps :items="items" :current="1" direction="vertical" />
</template>
```

## 可点击步骤

设置 `clickable` 后，可用步骤会触发 `change` 事件。禁用步骤不会响应点击。

```vue
<template>
  <SuSteps :items="items" :current="current" clickable @change="current = Number($event)" />
</template>
```

## 简洁模式

设置 `simple` 后展示更紧凑的点状步骤，适合空间较小的区域。

```vue
<template>
  <SuSteps :items="items" current="review" simple size="small" />
</template>

<script setup lang="ts">
const items = [
  { title: '草稿', value: 'draft' },
  { title: '审核', value: 'review' },
  { title: '发布', value: 'publish' },
]
</script>
```

## 自定义内容

使用 `icon`、`title`、`description` 插槽自定义步骤节点内容。

```vue
<template>
  <SuSteps :items="items" :current="1">
    <template #icon="{ index }">
      <span>{{ index + 1 }}</span>
    </template>
    <template #title="{ item }">
      <strong>{{ item.title }}</strong>
    </template>
  </SuSteps>
</template>
```

## 按需导入

```ts
import { SuSteps } from '@susu-ui/vue'
```

## API

### 属性

| 属性         | 说明                 | 类型                               | 默认值         |
| ------------ | -------------------- | ---------------------------------- | -------------- |
| `items`      | 步骤数据             | `StepsItem[]`                      | `[]`           |
| `current`    | 当前步骤索引或步骤值 | `string \| number`                 | `0`            |
| `direction`  | 展示方向             | `'horizontal' \| 'vertical'`       | `'horizontal'` |
| `size`       | 尺寸                 | `'small' \| 'medium' \| 'large'`   | `'medium'`     |
| `status`     | 当前步骤状态         | `'process' \| 'finish' \| 'error'` | `'process'`    |
| `simple`     | 是否使用简洁模式     | `boolean`                          | `false`        |
| `clickable`  | 是否允许点击步骤     | `boolean`                          | `false`        |
| `aria-label` | 无障碍标签           | `string`                           | `'步骤条'`     |

### StepsItem

| 字段          | 说明         | 类型                                         | 默认值      |
| ------------- | ------------ | -------------------------------------------- | ----------- |
| `title`       | 步骤标题     | `string`                                     | 必填        |
| `description` | 步骤描述     | `string`                                     | `undefined` |
| `value`       | 步骤值       | `string \| number`                           | 顺序索引    |
| `status`      | 单项状态     | `'wait' \| 'process' \| 'finish' \| 'error'` | 自动计算    |
| `disabled`    | 是否禁用点击 | `boolean`                                    | `false`     |

### 事件

| 名称     | 说明           | 参数                   |
| -------- | -------------- | ---------------------- |
| `change` | 点击步骤时触发 | `(value, item, index)` |

### 插槽

| 名称          | 说明           | 参数                             |
| ------------- | -------------- | -------------------------------- |
| `icon`        | 自定义步骤图标 | `{ item, index, status, value }` |
| `title`       | 自定义步骤标题 | `{ item, index, status, value }` |
| `description` | 自定义步骤描述 | `{ item, index, status, value }` |
