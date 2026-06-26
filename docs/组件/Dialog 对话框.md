# Dialog 对话框

对话框用于承载需要用户确认、补充信息或短流程操作的浮层内容。

## 基础用法

通过 `v-model` 控制显示状态，点击确认按钮会触发 `confirm` 事件。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

function confirm() {
  visible.value = false
}
</script>

<template>
  <SuButton type="primary" @click="visible = true">打开对话框</SuButton>
  <SuDialog v-model="visible" title="确认发布" @confirm="confirm">
    发布后内容会同步到线上环境，请确认当前配置已经完成校验。
  </SuDialog>
</template>
```

## 自定义底部

通过 `footer` 插槽替换默认操作区：

```vue
<template>
  <SuDialog v-model="visible" title="编辑说明">
    对话框支持自定义底部区域，适合放置更多业务操作。
    <template #footer>
      <SuButton @click="visible = false">稍后处理</SuButton>
      <SuButton type="primary" @click="visible = false">保存</SuButton>
    </template>
  </SuDialog>
</template>
```

## 异步确认

确认事件不会自动关闭对话框，适合在业务处理完成后再更新 `v-model`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)

function confirm() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
    visible.value = false
  }, 900)
}
</script>

<template>
  <SuDialog
    v-model="visible"
    title="删除成员"
    confirm-text="确认删除"
    :confirm-loading="loading"
    :close-on-click-mask="false"
    @confirm="confirm"
  >
    当前操作需要服务端确认，确认过程中会保持弹窗打开并展示加载状态。
  </SuDialog>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDialog } from '@susu-ui/vue'
</script>
```

## Props

| 参数                 | 说明                     | 类型               | 默认值    |
| -------------------- | ------------------------ | ------------------ | --------- |
| `v-model`            | 是否显示对话框           | `boolean`          | `false`   |
| `title`              | 标题                     | `string`           | -         |
| `width`              | 对话框宽度               | `string \| number` | `'520px'` |
| `top`                | 距离视口顶部的间距       | `string`           | `'15vh'`  |
| `closeOnClickMask`   | 点击遮罩是否关闭         | `boolean`          | `true`    |
| `closeOnPressEscape` | 按下 ESC 是否关闭        | `boolean`          | `true`    |
| `showClose`          | 是否显示右上角关闭按钮   | `boolean`          | `true`    |
| `showFooter`         | 是否显示默认底部操作区   | `boolean`          | `true`    |
| `confirmText`        | 确认按钮文本             | `string`           | `'确定'`  |
| `cancelText`         | 取消按钮文本             | `string`           | `'取消'`  |
| `confirmLoading`     | 确认按钮是否显示加载状态 | `boolean`          | `false`   |
| `zIndex`             | 遮罩层级                 | `number`           | -         |

## 事件

| 名称      | 说明                 | 参数                                     |
| --------- | -------------------- | ---------------------------------------- |
| `open`    | 对话框开始打开时触发 | -                                        |
| `opened`  | 打开动画结束后触发   | -                                        |
| `close`   | 请求关闭时触发       | `'close' \| 'cancel' \| 'mask' \| 'esc'` |
| `closed`  | 关闭动画结束后触发   | -                                        |
| `cancel`  | 点击取消按钮时触发   | -                                        |
| `confirm` | 点击确认按钮时触发   | -                                        |

## 插槽

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 对话框内容 |
| `header`  | 自定义头部 |
| `title`   | 自定义标题 |
| `footer`  | 自定义底部 |
