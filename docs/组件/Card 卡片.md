# Card 卡片

卡片用于承载一组相关内容和操作。

## 基础用法

```vue
<template>
  <SuCard> 卡片内容 </SuCard>
</template>
```

## 标题和额外内容

通过 `title` 设置标题，通过 `extra` 插槽放置右侧操作。

```vue
<template>
  <SuCard title="基础信息">
    <template #extra>
      <SuButton variant="text">编辑</SuButton>
    </template>
    用户名称：苏苏
  </SuCard>
</template>
```

## 自定义头部和底部

通过 `header` 和 `footer` 插槽自定义头部与底部区域。

```vue
<template>
  <SuCard>
    <template #header>
      <span>自定义头部</span>
    </template>
    卡片主体内容
    <template #footer>
      <SuButton type="primary">保存</SuButton>
    </template>
  </SuCard>
</template>
```

## 阴影和悬浮

通过 `shadow` 控制阴影展示策略，通过 `hoverable` 启用悬浮反馈。

```vue
<template>
  <SuCard shadow="hover" hoverable> 鼠标悬浮时展示反馈 </SuCard>
</template>
```

## 内边距

通过 `padding` 控制卡片内部留白。

```vue
<template>
  <SuCard padding="small">小内边距</SuCard>
  <SuCard padding="large">大内边距</SuCard>
  <SuCard padding="none">无内边距</SuCard>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCard } from '@susu-ui/vue'
</script>

<template>
  <SuCard title="标题"> 内容 </SuCard>
</template>
```

## Props

| 参数        | 说明             | 类型                                       | 默认值     |
| ----------- | ---------------- | ------------------------------------------ | ---------- |
| `title`     | 卡片标题         | `string`                                   | -          |
| `shadow`    | 阴影展示策略     | `'always' \| 'hover' \| 'never'`           | `'always'` |
| `padding`   | 内边距尺寸       | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` |
| `bordered`  | 是否显示边框     | `boolean`                                  | `true`     |
| `hoverable` | 是否启用悬浮反馈 | `boolean`                                  | `false`    |

## 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 卡片主体内容     |
| `header`  | 自定义头部内容   |
| `extra`   | 头部右侧额外内容 |
| `footer`  | 底部内容         |
