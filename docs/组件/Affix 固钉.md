# Affix 固钉

固钉用于将操作栏、快捷入口或状态区域固定在滚动容器的可视范围内。

## 基础用法

默认按照顶部吸附，滚动超过组件位置后固定在视口顶部：

```vue
<template>
  <SuAffix :offset="80">
    <SuButton type="primary">提交审批</SuButton>
  </SuAffix>
</template>
```

## 底部固定

通过 `position="bottom"` 可以让组件在滚动到指定位置后固定在视口底部：

```vue
<template>
  <SuAffix position="bottom" :offset="24">
    <SuButton type="primary">批量发布</SuButton>
  </SuAffix>
</template>
```

## 指定滚动容器

通过 `target` 返回滚动容器，可以让固钉相对容器吸附：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const containerRef = ref<HTMLElement>()
</script>

<template>
  <div ref="containerRef" style="max-height: 240px; overflow: auto">
    <div style="height: 160px">滚动内容</div>
    <SuAffix :target="() => containerRef" :offset="12">
      <SuButton>同步库存状态</SuButton>
    </SuAffix>
    <div style="height: 360px">更多内容</div>
  </div>
</template>
```

## 固定状态

通过 `change` 事件可以感知吸附状态变化：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const fixed = ref(false)
</script>

<template>
  <SuAffix :offset="80" @change="fixed = $event">
    <div :class="{ 'is-fixed': fixed }">批量操作栏</div>
  </SuAffix>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuAffix } from '@susu-ui/vue'
</script>

<template>
  <SuAffix :offset="80">
    <button>提交审批</button>
  </SuAffix>
</template>
```

## Props

| 参数       | 说明                            | 类型                                  | 默认值      |
| ---------- | ------------------------------- | ------------------------------------- | ----------- |
| `position` | 吸附位置                        | `'top' \| 'bottom'`                   | `'top'`     |
| `offset`   | 距离目标容器吸附边缘的偏移      | `number`                              | `0`         |
| `target`   | 返回滚动容器，默认使用 `window` | `() => Window \| HTMLElement \| null` | `undefined` |
| `zIndex`   | 固定状态下的层级                | `number`                              | `100`       |

## 事件

| 名称     | 说明             | 参数             |
| -------- | ---------------- | ---------------- |
| `change` | 固定状态变化触发 | `fixed: boolean` |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 需要固定的内容 |
