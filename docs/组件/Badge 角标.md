# Badge 角标

角标用于在元素旁展示数量、状态或轻量提醒。

## 基础用法

使用默认插槽包裹目标元素，通过 `value` 展示角标内容：

```vue
<template>
  <SuBadge :value="8">
    <SuButton>消息</SuButton>
  </SuBadge>

  <SuBadge value="新">
    <SuButton>版本</SuButton>
  </SuBadge>
</template>
```

## 最大值

当 `value` 为数字时，可以通过 `max` 限制最大展示值：

```vue
<template>
  <SuBadge :value="120" :max="99">
    <SuButton>待办</SuButton>
  </SuBadge>
</template>
```

## 小红点

通过 `dot` 展示无文本的小点提醒：

```vue
<template>
  <SuBadge dot>
    <SuAvatar text="苏" />
  </SuBadge>
</template>
```

## 独立使用

不传默认插槽时，角标会作为独立元素展示：

```vue
<template>
  <SuBadge value="离线" type="info" size="small" />
  <SuBadge dot type="success" />
</template>
```

## 零值和隐藏

`value` 为 `0` 时默认隐藏，通过 `show-zero` 可以展示零值，通过 `hidden` 可以主动隐藏角标：

```vue
<template>
  <SuBadge :value="0" show-zero>
    <SuButton>归档</SuButton>
  </SuBadge>

  <SuBadge :value="12" hidden>
    <SuButton>通知</SuButton>
  </SuBadge>
</template>
```

## 类型和位置

通过 `type` 控制状态色，通过 `position` 控制角标位置：

```vue
<template>
  <SuBadge value="热" type="warning" position="bottom-right">
    <SuTag type="warning" variant="outline">活动</SuTag>
  </SuBadge>

  <SuBadge value="新" type="primary" position="top-left">
    <SuButton>功能</SuButton>
  </SuBadge>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuBadge } from '@susu-ui/vue'
</script>

<template>
  <SuBadge :value="8">
    <button>消息</button>
  </SuBadge>
</template>
```

## Props

| 参数       | 说明                      | 类型                                                           | 默认值        |
| ---------- | ------------------------- | -------------------------------------------------------------- | ------------- |
| `value`    | 角标内容                  | `string \| number`                                             | `undefined`   |
| `max`      | 数字最大显示值            | `number`                                                       | `undefined`   |
| `dot`      | 是否展示为小点            | `boolean`                                                      | `false`       |
| `hidden`   | 是否隐藏角标              | `boolean`                                                      | `false`       |
| `showZero` | `value` 为 `0` 时是否展示 | `boolean`                                                      | `false`       |
| `type`     | 角标类型                  | `'primary' \| 'success' \| 'warning' \| 'error' \| 'info'`     | `'error'`     |
| `size`     | 角标尺寸                  | `'small' \| 'medium'`                                          | `'medium'`    |
| `position` | 角标位置                  | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |

## 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 被包裹的元素 |
