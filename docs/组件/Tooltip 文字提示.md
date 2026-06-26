# Tooltip 文字提示

文字提示用于在悬停、聚焦或点击目标元素时展示简短说明。

## 基础用法

通过 `content` 设置提示内容：

```vue
<template>
  <SuTooltip content="保存当前页面配置">
    <SuButton type="primary">悬停提示</SuButton>
  </SuTooltip>
</template>
```

## 提示位置

通过 `placement` 控制提示出现的位置：

```vue
<template>
  <SuTooltip content="上方提示" placement="top">
    <SuButton>上方</SuButton>
  </SuTooltip>
  <SuTooltip content="下方提示" placement="bottom">
    <SuButton>下方</SuButton>
  </SuTooltip>
  <SuTooltip content="左侧提示" placement="left">
    <SuButton>左侧</SuButton>
  </SuTooltip>
  <SuTooltip content="右侧提示" placement="right">
    <SuButton>右侧</SuButton>
  </SuTooltip>
</template>
```

## 触发方式

通过 `trigger` 切换触发方式：

```vue
<template>
  <SuTooltip content="悬停显示" trigger="hover">
    <SuButton>悬停</SuButton>
  </SuTooltip>
  <SuTooltip content="聚焦显示" trigger="focus">
    <SuButton>聚焦</SuButton>
  </SuTooltip>
  <SuTooltip content="点击显示" trigger="click">
    <SuButton>点击</SuButton>
  </SuTooltip>
</template>
```

## 自定义内容

通过 `content` 插槽放入更灵活的提示内容：

```vue
<template>
  <SuTooltip placement="bottom">
    <SuButton>查看说明</SuButton>
    <template #content>
      <span>支持插槽内容，适合展示更完整的上下文说明。</span>
    </template>
  </SuTooltip>
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
  <SuTooltip v-model:visible="visible" trigger="manual" content="受控提示">
    <SuButton @click="visible = !visible">切换提示</SuButton>
  </SuTooltip>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTooltip } from '@susu-ui/vue'
</script>

<template>
  <SuTooltip content="文字提示">
    <SuButton>目标元素</SuButton>
  </SuTooltip>
</template>
```

## Props

| 参数          | 说明               | 类型                                                                                                                                                                 | 默认值    |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `content`     | 提示内容           | `string`                                                                                                                                                             | -         |
| `placement`   | 提示位置           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`   |
| `trigger`     | 触发方式           | `'hover' \| 'focus' \| 'click' \| 'manual'`                                                                                                                          | `'hover'` |
| `disabled`    | 是否禁用           | `boolean`                                                                                                                                                            | `false`   |
| `showArrow`   | 是否显示箭头       | `boolean`                                                                                                                                                            | `true`    |
| `showDelay`   | 显示延迟，单位毫秒 | `number`                                                                                                                                                             | `0`       |
| `hideDelay`   | 隐藏延迟，单位毫秒 | `number`                                                                                                                                                             | `120`     |
| `offset`      | 与触发元素的间距   | `number`                                                                                                                                                             | `8`       |
| `popperClass` | 浮层自定义类名     | `string`                                                                                                                                                             | -         |
| `zIndex`      | 浮层层级           | `number`                                                                                                                                                             | -         |

## 事件

| 名称   | 说明           | 参数 |
| ------ | -------------- | ---- |
| `show` | 显示提示时触发 | -    |
| `hide` | 隐藏提示时触发 | -    |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 触发提示的元素 |
| `content` | 自定义提示内容 |
