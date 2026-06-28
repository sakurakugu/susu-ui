# Alert 提示

提示用于在页面内容中展示上下文反馈，适合承载状态说明、操作结果或需要用户关注的信息。

## 基础用法

```vue
<template>
  <SuAlert>这是一条普通提示。</SuAlert>
</template>
```

## 标题和描述

通过 `title` 和 `description` 展示结构化内容，也可以使用默认插槽作为描述内容：

```vue
<template>
  <SuAlert title="保存成功" description="配置已经同步到当前项目。" />

  <SuAlert title="需要确认"> 当前操作会影响后续发布流程，请确认信息完整。 </SuAlert>
</template>
```

## 提示类型

通过 `type` 设置不同反馈类型：

```vue
<template>
  <SuAlert type="info" title="普通提示" />
  <SuAlert type="success" title="成功提示" />
  <SuAlert type="warning" title="警告提示" />
  <SuAlert type="error" title="错误提示" />
</template>
```

## 可关闭

通过 `closable` 展示关闭按钮，点击后组件会隐藏并触发 `close` 事件：

```vue
<template>
  <SuAlert closable title="可关闭提示" @close="handleClose">
    用户关闭后会触发 close 事件。
  </SuAlert>
</template>
```

## 自定义图标

通过 `showIcon` 控制是否展示图标，也可以使用 `icon` 插槽自定义图标内容：

```vue
<template>
  <SuAlert :show-icon="false">不展示图标。</SuAlert>

  <SuAlert title="自定义图标">
    <template #icon>?</template>
    使用插槽覆盖默认图标。
  </SuAlert>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuAlert } from '@susu-ui/vue'
</script>

<template>
  <SuAlert type="success" title="保存成功" />
</template>
```

## Props

| 参数          | 说明             | 类型                                          | 默认值   |
| ------------- | ---------------- | --------------------------------------------- | -------- |
| `type`        | 提示类型         | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title`       | 提示标题         | `string`                                      | `-`      |
| `description` | 提示描述         | `string`                                      | `-`      |
| `showIcon`    | 是否显示前置图标 | `boolean`                                     | `true`   |
| `closable`    | 是否可关闭       | `boolean`                                     | `false`  |

## 事件

| 名称    | 说明           |
| ------- | -------------- |
| `close` | 点击关闭时触发 |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 提示描述内容   |
| `title`   | 自定义标题内容 |
| `icon`    | 自定义图标内容 |
