# Popconfirm 气泡确认框

在触发元素旁边弹出轻量确认框，适合删除、归档、提交审批等需要二次确认但不必打开对话框的操作。

## 基础用法

```vue
<SuPopconfirm
  title="确认归档这个项目？"
  description="归档后项目会从当前工作台移除，可在归档列表中恢复。"
  @confirm="archiveProject"
>
  <SuButton type="primary">归档项目</SuButton>
</SuPopconfirm>
```

## 自定义按钮文案

```vue
<SuPopconfirm
  title="确认删除客户资料？"
  description="删除后将同步移除关联的跟进记录。"
  confirm-text="删除"
  cancel-text="再想想"
  placement="bottom"
>
  <SuButton variant="outline">删除资料</SuButton>
</SuPopconfirm>
```

## 异步确认

使用 `v-model:visible`、`confirm-loading` 和 `hide-after-confirm="false"` 可以在异步任务完成后再关闭确认框。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const loading = ref(false)

function submitApproval() {
  loading.value = true

  window.setTimeout(() => {
    loading.value = false
    visible.value = false
  }, 1200)
}
</script>

<template>
  <SuPopconfirm
    v-model:visible="visible"
    title="确认提交审批？"
    description="系统会通知财务负责人处理这笔付款申请。"
    :confirm-loading="loading"
    :hide-after-confirm="false"
    @confirm="submitApproval"
  >
    <SuButton @click="visible = true">提交审批</SuButton>
  </SuPopconfirm>
</template>
```

## 自定义内容

```vue
<SuPopconfirm placement="top-start" width="320px">
  <SuButton variant="text">自定义内容</SuButton>
  <template #icon>?</template>
  <template #title>需要通知项目成员吗？</template>
  <template #description>
    启用后，系统会向项目群发送变更说明和新的交付时间。
  </template>
  <template #actions>
    <SuButton size="small" variant="text">仅保存</SuButton>
    <SuButton size="small" type="primary">保存并通知</SuButton>
  </template>
</SuPopconfirm>
```

## API

| 属性                 | 说明               | 类型                                                                                                                                                               | 默认值    |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `v-model:visible`    | 是否显示确认框     | `boolean`                                                                                                                                                          | -         |
| `title`              | 标题内容           | `string`                                                                                                                                                           | -         |
| `description`        | 说明内容           | `string`                                                                                                                                                           | -         |
| `placement`          | 弹出位置           | `top` \| `top-start` \| `top-end` \| `bottom` \| `bottom-start` \| `bottom-end` \| `left` \| `left-start` \| `left-end` \| `right` \| `right-start` \| `right-end` | `top`     |
| `disabled`           | 是否禁用           | `boolean`                                                                                                                                                          | `false`   |
| `show-arrow`         | 是否显示箭头       | `boolean`                                                                                                                                                          | `true`    |
| `offset`             | 与触发元素的距离   | `number`                                                                                                                                                           | `8`       |
| `width`              | 确认框宽度         | `string \| number`                                                                                                                                                 | `280`     |
| `popper-class`       | 浮层自定义类名     | `string`                                                                                                                                                           | -         |
| `z-index`            | 浮层层级           | `number`                                                                                                                                                           | -         |
| `confirm-text`       | 确认按钮文案       | `string`                                                                                                                                                           | `确定`    |
| `cancel-text`        | 取消按钮文案       | `string`                                                                                                                                                           | `取消`    |
| `confirm-type`       | 确认按钮类型       | `default \| primary`                                                                                                                                               | `primary` |
| `confirm-variant`    | 确认按钮样式       | `solid \| outline \| ghost \| text`                                                                                                                                | `solid`   |
| `cancel-type`        | 取消按钮类型       | `default \| primary`                                                                                                                                               | `default` |
| `cancel-variant`     | 取消按钮样式       | `solid \| outline \| ghost \| text`                                                                                                                                | `text`    |
| `confirm-loading`    | 确认按钮加载态     | `boolean`                                                                                                                                                          | `false`   |
| `hide-after-confirm` | 点击确认后是否关闭 | `boolean`                                                                                                                                                          | `true`    |
| `hide-after-cancel`  | 点击取消后是否关闭 | `boolean`                                                                                                                                                          | `true`    |

## 事件

| 事件名    | 说明               | 参数 |
| --------- | ------------------ | ---- |
| `show`    | 确认框显示时触发   | -    |
| `hide`    | 确认框隐藏时触发   | -    |
| `confirm` | 点击确认按钮时触发 | -    |
| `cancel`  | 点击取消按钮时触发 | -    |

## 插槽

| 插槽名        | 说明           |
| ------------- | -------------- |
| `default`     | 触发元素       |
| `title`       | 自定义标题     |
| `description` | 自定义说明     |
| `icon`        | 自定义提示图标 |
| `actions`     | 自定义操作区   |
