# Tour 漫游式引导

漫游式引导用于围绕页面中的关键控件展示分步说明，帮助用户理解新功能或完成首次配置。

## 基础用法

通过 `v-model` 控制显示状态，`steps` 配置每一步的目标元素、标题和说明。

```vue
<script setup lang="ts">
import type { TourStep } from '@susu-ui/vue'
import { ref } from 'vue'

const visible = ref(false)
const steps: TourStep[] = [
  {
    title: '查看核心指标',
    description: '这里汇总本周新增客户、续费金额和待跟进商机。',
    target: '#metric-card',
    placement: 'bottom-start',
  },
  {
    title: '导出经营报表',
    description: '完成筛选后可以导出当前视图。',
    target: '#export-button',
    placement: 'top-end',
  },
]
</script>

<template>
  <SuButton type="primary" @click="visible = true">开启引导</SuButton>
  <div id="metric-card">本周新增客户 128</div>
  <SuButton id="export-button">导出报表</SuButton>
  <SuTour v-model="visible" :steps="steps" />
</template>
```

## 受控步骤

通过 `v-model:current` 控制当前步骤，步骤变化时会触发 `change` 事件。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const current = ref(0)
</script>

<template>
  <SuTour
    v-model="visible"
    v-model:current="current"
    :steps="steps"
    @change="(index) => (current = index)"
  />
</template>
```

## 自定义内容

通过 `title`、`description` 和 `footer` 插槽定制标题、描述和操作区。

```vue
<template>
  <SuTour v-model="visible" :steps="steps" :width="360">
    <template #title="{ step }">
      <strong>{{ step.title }}</strong>
    </template>
    <template #description="{ step }">
      <p>{{ step.description }}</p>
    </template>
    <template #footer="{ close }">
      <SuButton size="small" type="primary" @click="close">我知道了</SuButton>
    </template>
  </SuTour>
</template>
```

## 无目标引导

当步骤没有配置 `target`，或目标元素不存在时，引导浮层会展示在视口中部，适合用于全局说明。

```vue
<template>
  <SuTour
    v-model="visible"
    :steps="[
      {
        title: '欢迎使用经营看板',
        description: '这里会展示当前团队最需要关注的业务数据。',
      },
    ]"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTour } from '@susu-ui/vue'
</script>
```

## Props

| 参数                 | 说明                               | 类型                                                                                                                                                                 | 默认值     |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `v-model`            | 是否显示引导                       | `boolean`                                                                                                                                                            | `false`    |
| `v-model:current`    | 当前步骤索引                       | `number`                                                                                                                                                             | `0`        |
| `steps`              | 引导步骤列表                       | `TourStep[]`                                                                                                                                                         | `[]`       |
| `placement`          | 默认浮层位置                       | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` |
| `offset`             | 浮层与目标元素的距离               | `number`                                                                                                                                                             | `12`       |
| `padding`            | 高亮区域与目标元素的留白           | `number`                                                                                                                                                             | `8`        |
| `width`              | 浮层宽度                           | `string \| number`                                                                                                                                                   | `320`      |
| `showMask`           | 是否显示遮罩和高亮区域             | `boolean`                                                                                                                                                            | `true`     |
| `showArrow`          | 是否显示箭头                       | `boolean`                                                                                                                                                            | `true`     |
| `showClose`          | 是否显示关闭按钮                   | `boolean`                                                                                                                                                            | `true`     |
| `closeOnClickMask`   | 点击遮罩是否关闭                   | `boolean`                                                                                                                                                            | `true`     |
| `closeOnPressEscape` | 按下 ESC 是否关闭                  | `boolean`                                                                                                                                                            | `true`     |
| `scrollIntoView`     | 展示步骤时是否滚动目标元素到视口内 | `boolean \| ScrollIntoViewOptions`                                                                                                                                   | `true`     |
| `zIndex`             | 浮层层级                           | `number`                                                                                                                                                             | -          |
| `nextText`           | 默认下一步按钮文本                 | `string`                                                                                                                                                             | `'下一步'` |
| `prevText`           | 默认上一步按钮文本                 | `string`                                                                                                                                                             | `'上一步'` |
| `finishText`         | 默认完成按钮文本                   | `string`                                                                                                                                                             | `'完成'`   |

## TourStep

| 字段               | 说明                             | 类型            | 默认值 |
| ------------------ | -------------------------------- | --------------- | ------ |
| `title`            | 步骤标题                         | `string`        | -      |
| `description`      | 步骤描述                         | `string`        | -      |
| `target`           | 目标元素，支持选择器、元素或函数 | `TourTarget`    | -      |
| `placement`        | 当前步骤的浮层位置               | `TourPlacement` | -      |
| `nextText`         | 当前步骤的下一步按钮文本         | `string`        | -      |
| `prevText`         | 当前步骤的上一步按钮文本         | `string`        | -      |
| `finishText`       | 当前步骤的完成按钮文本           | `string`        | -      |
| `closeOnClickMask` | 当前步骤点击遮罩是否关闭         | `boolean`       | -      |

## 事件

| 名称     | 说明             | 参数                                     |
| -------- | ---------------- | ---------------------------------------- |
| `change` | 当前步骤变化触发 | `(current: number, step?: TourStep)`     |
| `close`  | 请求关闭时触发   | `'close' \| 'finish' \| 'mask' \| 'esc'` |
| `finish` | 点击完成时触发   | -                                        |

## 插槽

| 名称          | 说明         |
| ------------- | ------------ |
| `title`       | 自定义标题   |
| `description` | 自定义描述   |
| `footer`      | 自定义操作区 |
