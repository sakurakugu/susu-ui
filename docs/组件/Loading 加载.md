# Loading 加载

Loading 用于在数据请求、页面切换或异步任务执行时展示加载状态。

## 基础用法

```vue
<template>
  <SuLoading />
</template>
```

## 加载文案

通过 `text` 或默认插槽展示辅助说明：

```vue
<template>
  <SuLoading text="正在加载" />
  <SuLoading>正在同步数据</SuLoading>
</template>
```

## 不同尺寸

通过 `size` 设置小、中、大三种尺寸：

```vue
<template>
  <SuLoading size="small" />
  <SuLoading />
  <SuLoading size="large" />
</template>
```

## 遮罩加载

通过 `overlay` 展示容器遮罩。父级容器需要具备可定位上下文，例如 `position: relative`：

```vue
<template>
  <div class="loading-box">
    <p>这里是被加载内容。</p>
    <SuLoading overlay text="加载内容" />
  </div>
</template>

<style>
.loading-box {
  position: relative;
  min-height: 160px;
}
</style>
```

## 全屏加载

通过 `fullscreen` 展示全屏加载层：

```vue
<template>
  <SuLoading fullscreen text="正在初始化" />
</template>
```

## 自定义图标

通过 `icon` 插槽替换默认旋转图标：

```vue
<template>
  <SuLoading text="加载中">
    <template #icon>
      <span>...</span>
    </template>
  </SuLoading>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuLoading } from '@susu-ui/vue'
</script>

<template>
  <SuLoading text="加载中" />
</template>
```

## Props

| 参数         | 说明                   | 类型                             | 默认值     |
| ------------ | ---------------------- | -------------------------------- | ---------- |
| `loading`    | 是否显示加载状态       | `boolean`                        | `true`     |
| `text`       | 加载文案               | `string`                         | -          |
| `size`       | 加载尺寸               | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `fullscreen` | 是否全屏展示           | `boolean`                        | `false`    |
| `overlay`    | 是否展示容器遮罩       | `boolean`                        | `false`    |
| `blur`       | 是否为遮罩添加背景模糊 | `boolean`                        | `false`    |
| `ariaLabel`  | 无障碍标签             | `string`                         | `'加载中'` |

## Slots

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 自定义加载文案 |
| `icon`    | 自定义加载图标 |
