# Notification 通知

通知用于展示带标题的全局反馈，默认固定在页面右上角展示，并在 4.5 秒后自动消失。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const notificationKey = ref(0)

function showNotification() {
  notificationKey.value += 1
  visible.value = true
}
</script>

<template>
  <SuButton type="primary" @click="showNotification">显示通知</SuButton>
  <SuNotification
    v-if="visible"
    :key="notificationKey"
    title="发布完成"
    @close="visible = false"
  >
    线上内容已经更新。
  </SuNotification>
</template>
```

## 通知类型

通过 `type` 设置不同反馈类型：

```vue
<template>
  <SuNotification type="info" title="普通通知"
    >任务已经进入队列。</SuNotification
  >
  <SuNotification type="success" title="保存成功">
    配置已经同步。
  </SuNotification>
  <SuNotification type="warning" title="需要确认">
    当前操作会影响后续发布流程。
  </SuNotification>
  <SuNotification type="error" title="同步失败">
    请检查网络后重试。
  </SuNotification>
</template>
```

## 展示位置

通过 `placement` 设置通知展示位置：

```vue
<template>
  <SuNotification placement="top-right" title="右上通知" />
  <SuNotification placement="top-left" title="左上通知" />
  <SuNotification placement="bottom-right" title="右下通知" />
  <SuNotification placement="bottom-left" title="左下通知" />
</template>
```

## 展示时长

通过 `duration` 设置自动关闭时间，单位为毫秒。设置为 `0` 时不会自动关闭：

```vue
<template>
  <SuNotification :duration="6000" title="6 秒后自动关闭" />
  <SuNotification :duration="0" title="持续展示" />
</template>
```

## 自定义内容

可以隐藏图标和关闭按钮，也可以通过插槽自定义标题、图标和正文：

```vue
<template>
  <SuNotification :show-icon="false" :closable="false">
    <template #title>无图标通知</template>
    当前通知需要由外部状态控制隐藏。
  </SuNotification>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuNotification } from '@susu-ui/vue'
</script>

<template>
  <SuNotification type="success" title="保存成功">
    配置已经同步。
  </SuNotification>
</template>
```

## Props

| 参数          | 说明             | 类型                                                           | 默认值        |
| ------------- | ---------------- | -------------------------------------------------------------- | ------------- |
| `type`        | 通知类型         | `'info' \| 'success' \| 'warning' \| 'error'`                  | `'info'`      |
| `title`       | 通知标题         | `string`                                                       | `undefined`   |
| `description` | 通知内容         | `string`                                                       | `undefined`   |
| `duration`    | 自动关闭时间     | `number`                                                       | `4500`        |
| `showIcon`    | 是否显示前置图标 | `boolean`                                                      | `true`        |
| `closable`    | 是否显示关闭按钮 | `boolean`                                                      | `true`        |
| `placement`   | 展示位置         | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `width`       | 通知宽度         | `string \| number`                                             | `360`         |
| `offset`      | 距离视口边缘距离 | `number`                                                       | `24`          |
| `zIndex`      | 层级             | `number`                                                       | `undefined`   |

## 事件

| 名称    | 说明                     |
| ------- | ------------------------ |
| `close` | 通知自动或手动关闭时触发 |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 通知内容 |
| `title`   | 通知标题 |
| `icon`    | 前置图标 |
