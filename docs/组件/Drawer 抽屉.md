# Drawer 抽屉

抽屉用于从页面边缘滑出补充内容，适合承载详情、筛选、编辑表单等不中断主页面上下文的操作。

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
  <SuButton type="primary" @click="visible = true">打开抽屉</SuButton>
  <SuDrawer v-model="visible" title="任务详情" @confirm="confirm">
    这里展示任务的详细信息，用户可以在不离开当前页面的情况下完成查看和处理。
  </SuDrawer>
</template>
```

## 弹出方向

通过 `placement` 设置抽屉弹出的方向，支持 `left`、`right`、`top` 和 `bottom`。

```vue
<template>
  <SuDrawer v-model="visible" title="筛选条件" placement="left" size="360px">
    从左侧打开的抽屉适合放置筛选项或导航内容。
  </SuDrawer>
</template>
```

## 自定义底部

通过 `footer` 插槽替换默认操作区：

```vue
<template>
  <SuDrawer v-model="visible" title="编辑资料">
    抽屉支持自定义底部区域，适合放置更多业务操作。
    <template #footer>
      <SuButton @click="visible = false">取消</SuButton>
      <SuButton type="primary" @click="visible = false">保存</SuButton>
    </template>
  </SuDrawer>
</template>
```

## 异步确认

确认事件不会自动关闭抽屉，适合在业务处理完成后再更新 `v-model`：

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
  <SuDrawer
    v-model="visible"
    title="保存配置"
    confirm-text="保存"
    :confirm-loading="loading"
    :close-on-click-mask="false"
    @confirm="confirm"
  >
    保存过程中会保持抽屉打开，并在确认按钮上展示加载状态。
  </SuDrawer>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDrawer } from '@susu-ui/vue'
</script>
```

## Props

| 参数                 | 说明                   | 类型                                     | 默认值    |
| -------------------- | ---------------------- | ---------------------------------------- | --------- |
| `v-model`            | 是否显示抽屉           | `boolean`                                | `false`   |
| `title`              | 标题                   | `string`                                 | -         |
| `placement`          | 弹出方向               | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `size`               | 抽屉宽度或高度         | `string \| number`                       | `'420px'` |
| `closeOnClickMask`   | 点击遮罩是否关闭       | `boolean`                                | `true`    |
| `closeOnPressEscape` | 按下 ESC 是否关闭      | `boolean`                                | `true`    |
| `showClose`          | 是否显示关闭按钮       | `boolean`                                | `true`    |
| `showFooter`         | 是否显示默认底部操作区 | `boolean`                                | `true`    |
| `confirmText`        | 确认按钮文本           | `string`                                 | `'确定'`  |
| `cancelText`         | 取消按钮文本           | `string`                                 | `'取消'`  |
| `confirmLoading`     | 确认按钮是否加载中     | `boolean`                                | `false`   |
| `zIndex`             | 遮罩层级               | `number`                                 | -         |

## 事件

| 名称      | 说明               | 参数                                     |
| --------- | ------------------ | ---------------------------------------- |
| `open`    | 抽屉开始打开时触发 | -                                        |
| `opened`  | 打开动画结束后触发 | -                                        |
| `close`   | 请求关闭时触发     | `'close' \| 'cancel' \| 'mask' \| 'esc'` |
| `closed`  | 关闭动画结束后触发 | -                                        |
| `cancel`  | 点击取消按钮时触发 | -                                        |
| `confirm` | 点击确认按钮时触发 | -                                        |

## 插槽

| 名称      | 说明       |
| --------- | ---------- |
| `default` | 抽屉内容   |
| `header`  | 自定义头部 |
| `title`   | 自定义标题 |
| `footer`  | 自定义底部 |
