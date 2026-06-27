# BackTop 回到顶部

回到顶部用于在长页面或滚动容器中快速返回顶部，适合列表、表单、配置页等纵向内容较长的场景。

## 基础用法

页面滚动超过 `visibility-height` 后显示按钮，点击后回到窗口顶部：

```vue
<template>
  <SuBackTop :visibility-height="240" />
</template>
```

## 指定滚动容器

通过 `target` 返回滚动容器，可以让按钮根据容器滚动位置显示，并将容器滚回顶部：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const containerRef = ref<HTMLElement>()
</script>

<template>
  <div ref="containerRef" style="max-height: 320px; overflow: auto">
    <div style="height: 800px">客户跟进记录</div>
    <SuBackTop :target="() => containerRef" :visibility-height="160" />
  </div>
</template>
```

## 自定义内容

默认按钮显示向上箭头，也可以通过默认插槽替换为业务需要的内容：

```vue
<template>
  <SuBackTop :bottom="88">
    <span class="quick-top">顶部</span>
  </SuBackTop>
</template>
```

## 监听状态

通过 `change` 事件可以同步按钮显示状态，通过 `click` 事件可以记录用户主动返回顶部：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <SuBackTop
    :visibility-height="300"
    @change="visible = $event"
    @click="console.log('用户返回顶部')"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuBackTop } from '@susu-ui/vue'
</script>

<template>
  <SuBackTop />
</template>
```

## Props

| 参数               | 说明                            | 类型                                  | 默认值       |
| ------------------ | ------------------------------- | ------------------------------------- | ------------ |
| `visibilityHeight` | 滚动超过该高度后显示按钮        | `number`                              | `200`        |
| `right`            | 按钮距离视口右侧的距离          | `number \| string`                    | `40`         |
| `bottom`           | 按钮距离视口底部的距离          | `number \| string`                    | `40`         |
| `target`           | 返回滚动容器，默认使用 `window` | `() => Window \| HTMLElement \| null` | `undefined`  |
| `behavior`         | 滚动行为                        | `ScrollBehavior`                      | `'smooth'`   |
| `zIndex`           | 按钮层级                        | `number`                              | `100`        |
| `ariaLabel`        | 按钮无障碍名称                  | `string`                              | `'回到顶部'` |

## 事件

| 名称     | 说明                   | 参数                |
| -------- | ---------------------- | ------------------- |
| `click`  | 点击按钮时触发         | `event: MouseEvent` |
| `change` | 显示状态发生变化时触发 | `visible: boolean`  |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 自定义按钮内容 |
