# Message 消息

消息用于展示轻量反馈，默认固定在页面顶部展示，并在 3 秒后自动消失。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const messageKey = ref(0)

function showMessage() {
  messageKey.value += 1
  visible.value = true
}
</script>

<template>
  <SuButton type="primary" @click="showMessage">显示消息</SuButton>
  <SuMessage v-if="visible" :key="messageKey" @close="visible = false">
    消息会在顶部展示，并于 3 秒后消失
  </SuMessage>
</template>
```

## 消息类型

通过 `type` 设置不同反馈类型：

```vue
<template>
  <SuMessage type="info">普通消息</SuMessage>
  <SuMessage type="success">成功消息</SuMessage>
  <SuMessage type="warning">警告消息</SuMessage>
  <SuMessage type="error">错误消息</SuMessage>
</template>
```

## 展示时长

通过 `duration` 设置自动关闭时间，单位为毫秒。设置为 `0` 时不会自动关闭：

```vue
<template>
  <SuMessage :duration="5000">5 秒后自动消失</SuMessage>
  <SuMessage :duration="0">持续展示</SuMessage>
</template>
```

## 隐藏图标

通过 `showIcon` 控制是否展示前置图标：

```vue
<template>
  <SuMessage :show-icon="false">无图标消息</SuMessage>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuMessage } from '@susu-ui/vue'
</script>

<template>
  <SuMessage type="success">保存成功</SuMessage>
</template>
```

## Props

| 参数       | 说明             | 类型                                          | 默认值   |
| ---------- | ---------------- | --------------------------------------------- | -------- |
| `type`     | 消息类型         | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `duration` | 自动关闭时间     | `number`                                      | `3000`   |
| `showIcon` | 是否显示前置图标 | `boolean`                                     | `true`   |

## 事件

| 名称    | 说明               |
| ------- | ------------------ |
| `close` | 消息自动关闭时触发 |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 消息内容 |
