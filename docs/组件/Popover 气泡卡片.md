# Popover 气泡卡片

气泡卡片用于在目标元素附近展示较完整的说明、操作或上下文信息。

## 基础用法

通过 `title` 和 `content` 设置标题与内容：

```vue
<template>
  <SuPopover title="项目说明" content="这里展示更完整的补充信息。">
    <SuButton type="primary">查看说明</SuButton>
  </SuPopover>
</template>
```

## 提示位置

通过 `placement` 控制气泡卡片出现的位置：

```vue
<template>
  <SuPopover title="上方" content="内容显示在触发元素上方" placement="top">
    <SuButton>上方</SuButton>
  </SuPopover>
  <SuPopover title="下方" content="内容显示在触发元素下方" placement="bottom">
    <SuButton>下方</SuButton>
  </SuPopover>
  <SuPopover title="左侧" content="内容显示在触发元素左侧" placement="left">
    <SuButton>左侧</SuButton>
  </SuPopover>
  <SuPopover title="右侧" content="内容显示在触发元素右侧" placement="right">
    <SuButton>右侧</SuButton>
  </SuPopover>
</template>
```

## 触发方式

通过 `trigger` 切换触发方式：

```vue
<template>
  <SuPopover title="点击触发" content="点击页面空白处关闭" trigger="click">
    <SuButton>点击</SuButton>
  </SuPopover>
  <SuPopover title="悬停触发" content="鼠标移出后关闭" trigger="hover">
    <SuButton>悬停</SuButton>
  </SuPopover>
  <SuPopover title="聚焦触发" content="失焦后关闭" trigger="focus">
    <SuButton>聚焦</SuButton>
  </SuPopover>
</template>
```

## 自定义内容

通过 `title` 和 `content` 插槽放入更灵活的内容：

```vue
<template>
  <SuPopover placement="bottom-start" width="320px">
    <SuButton>查看详情</SuButton>
    <template #title>任务详情</template>
    <template #content>
      <p>可以放入说明、状态、按钮或其他组件。</p>
      <SuButton size="small" type="primary">立即处理</SuButton>
    </template>
  </SuPopover>
</template>
```

## 受控显示

通过 `v-model:visible` 控制显示状态：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <SuPopover v-model:visible="visible" trigger="manual" title="受控气泡">
    <SuButton @click="visible = !visible">切换气泡</SuButton>
    <template #content> 当前显示状态由外部数据控制。 </template>
  </SuPopover>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuPopover } from '@susu-ui/vue'
</script>

<template>
  <SuPopover title="气泡卡片" content="补充说明">
    <SuButton>目标元素</SuButton>
  </SuPopover>
</template>
```

## Props

| 参数          | 说明               | 类型                                                                                                                                                                 | 默认值     |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `title`       | 标题内容           | `string`                                                                                                                                                             | -          |
| `content`     | 正文内容           | `string`                                                                                                                                                             | -          |
| `placement`   | 气泡位置           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'bottom'` |
| `trigger`     | 触发方式           | `'click' \| 'hover' \| 'focus' \| 'manual'`                                                                                                                          | `'click'`  |
| `disabled`    | 是否禁用           | `boolean`                                                                                                                                                            | `false`    |
| `showArrow`   | 是否显示箭头       | `boolean`                                                                                                                                                            | `true`     |
| `showDelay`   | 显示延迟，单位毫秒 | `number`                                                                                                                                                             | `0`        |
| `hideDelay`   | 隐藏延迟，单位毫秒 | `number`                                                                                                                                                             | `120`      |
| `offset`      | 与触发元素的间距   | `number`                                                                                                                                                             | `8`        |
| `width`       | 气泡宽度           | `string \| number`                                                                                                                                                   | `280`      |
| `popperClass` | 浮层自定义类名     | `string`                                                                                                                                                             | -          |
| `zIndex`      | 浮层层级           | `number`                                                                                                                                                             | -          |

## 事件

| 名称   | 说明           | 参数 |
| ------ | -------------- | ---- |
| `show` | 显示气泡时触发 | -    |
| `hide` | 隐藏气泡时触发 | -    |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 触发气泡的元素 |
| `title`   | 自定义标题内容 |
| `content` | 自定义正文内容 |
