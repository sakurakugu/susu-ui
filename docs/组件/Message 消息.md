# Message 消息

消息用于展示轻量反馈，默认固定在页面顶部展示，并在 3 秒后自动消失。

## 命令式调用

通过 `SuMessage` 可以直接创建消息：

```ts
import { SuMessage } from '@susu-ui/vue'

SuMessage('客户资料已更新')
SuMessage.success('保存成功')
SuMessage.warning('库存低于安全线')
SuMessage.error('提交失败，请稍后重试')
```

## 基础用法

仍然可以把 `SuMessage` 作为组件使用：

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

通过快捷方法或 `type` 设置不同反馈类型：

```ts
SuMessage.info('普通消息')
SuMessage.success('成功消息')
SuMessage.warning('警告消息')
SuMessage.error('错误消息')
```

```vue
<template>
  <SuMessage type="info">普通消息</SuMessage>
  <SuMessage type="success">成功消息</SuMessage>
  <SuMessage type="warning">警告消息</SuMessage>
  <SuMessage type="error">错误消息</SuMessage>
</template>
```

## 展示位置

通过 `placement` 设置消息位置，支持上方三个和下方三个位置：

```ts
SuMessage.success({
  content: '保存成功',
  placement: 'top-right',
})

SuMessage.warning({
  content: '请检查库存',
  placement: 'bottom-left',
})
```

可选值为 `top-left`、`top`、`top-right`、`bottom-left`、`bottom`、`bottom-right`。

## 展示时长

通过 `duration` 设置自动关闭时间，单位为毫秒。设置为 `0` 时不会自动关闭：

```ts
SuMessage({
  content: '持续展示',
  duration: 0,
})
```

```vue
<template>
  <SuMessage :duration="5000">5 秒后自动消失</SuMessage>
  <SuMessage :duration="0">持续展示</SuMessage>
</template>
```

## 关闭按钮

消息默认显示关闭按钮，通过 `closable` 可以隐藏：

```ts
SuMessage.warning({
  content: '库存低于安全线',
  closable: false,
})
```

```vue
<template>
  <SuMessage :closable="false">无关闭按钮消息</SuMessage>
</template>
```

## 合并相同内容

命令式调用默认会合并相同内容、相同类型和相同位置的消息，并刷新自动关闭时间。通过 `merge: false` 可以关闭合并：

```ts
SuMessage.error('接口请求失败')
SuMessage.error('接口请求失败')

SuMessage.info({
  content: '这条消息不会合并',
  merge: false,
})
```

## 隐藏图标

通过 `showIcon` 控制是否展示前置图标：

```vue
<template>
  <SuMessage :show-icon="false">无图标消息</SuMessage>
</template>
```

## 手动关闭

命令式调用会返回关闭句柄，也可以通过 `SuMessage.closeAll()` 关闭全部命令式消息：

```ts
const handle = SuMessage.success('保存成功')

handle.close()
SuMessage.closeAll()
```

## 按需导入

```vue
<script setup lang="ts">
import { SuMessage } from '@susu-ui/vue'

SuMessage.success('保存成功')
</script>
```

## Props

| 参数        | 说明             | 类型                                                                                | 默认值      |
| ----------- | ---------------- | ----------------------------------------------------------------------------------- | ----------- |
| `type`      | 消息类型         | `'info' \| 'success' \| 'warning' \| 'error'`                                       | `'info'`    |
| `duration`  | 自动关闭时间     | `number`                                                                            | `3000`      |
| `showIcon`  | 是否显示前置图标 | `boolean`                                                                           | `true`      |
| `closable`  | 是否显示关闭按钮 | `boolean`                                                                           | `true`      |
| `placement` | 展示位置         | `'top-left' \| 'top' \| 'top-right' \| 'bottom-left' \| 'bottom' \| 'bottom-right'` | `'top'`     |
| `offset`    | 距离窗口边缘距离 | `number`                                                                            | `24`        |
| `zIndex`    | 层级             | `number`                                                                            | `undefined` |

## 命令式 Options

| 参数        | 说明             | 类型                                                                                | 默认值      |
| ----------- | ---------------- | ----------------------------------------------------------------------------------- | ----------- |
| `content`   | 消息内容         | `string \| number \| VNode`                                                         | `''`        |
| `type`      | 消息类型         | `'info' \| 'success' \| 'warning' \| 'error'`                                       | `'info'`    |
| `duration`  | 自动关闭时间     | `number`                                                                            | `3000`      |
| `showIcon`  | 是否显示前置图标 | `boolean`                                                                           | `true`      |
| `closable`  | 是否显示关闭按钮 | `boolean`                                                                           | `true`      |
| `placement` | 展示位置         | `'top-left' \| 'top' \| 'top-right' \| 'bottom-left' \| 'bottom' \| 'bottom-right'` | `'top'`     |
| `offset`    | 距离窗口边缘距离 | `number`                                                                            | `24`        |
| `zIndex`    | 层级             | `number`                                                                            | `undefined` |
| `merge`     | 是否合并相同内容 | `boolean`                                                                           | `true`      |
| `onClose`   | 关闭时回调       | `() => void`                                                                        | `undefined` |

## 方法

| 名称                 | 说明               |
| -------------------- | ------------------ |
| `SuMessage(content)` | 创建普通消息       |
| `SuMessage.info`     | 创建普通消息       |
| `SuMessage.success`  | 创建成功消息       |
| `SuMessage.warning`  | 创建警告消息       |
| `SuMessage.error`    | 创建错误消息       |
| `SuMessage.closeAll` | 关闭全部命令式消息 |

## 事件

| 名称    | 说明           |
| ------- | -------------- |
| `close` | 消息关闭时触发 |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 消息内容 |
