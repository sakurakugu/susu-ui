# Descriptions 描述列表

描述列表用于展示一组只读字段，适合详情页、用户资料、订单信息和配置摘要。

## 基础用法

通过 `SuDescriptionsItem` 声明每一项：

```vue
<template>
  <SuDescriptions title="用户信息">
    <SuDescriptionsItem label="用户名">苏苏</SuDescriptionsItem>
    <SuDescriptionsItem label="角色">设计师</SuDescriptionsItem>
    <SuDescriptionsItem label="团队">体验组</SuDescriptionsItem>
  </SuDescriptions>
</template>
```

## 配置式用法

也可以通过 `items` 批量渲染内容：

```vue
<script setup lang="ts">
const items = [
  { label: '用户名', content: '苏苏' },
  { label: '角色', content: '设计师' },
  { label: '团队', content: '体验组' },
]
</script>

<template>
  <SuDescriptions :items="items" />
</template>
```

## 边框和列数

通过 `border` 显示边框，通过 `column` 控制每行列数，通过 `span` 控制单项跨列：

```vue
<template>
  <SuDescriptions title="项目信息" :column="2" border label-width="88px">
    <SuDescriptionsItem label="项目">Susu UI</SuDescriptionsItem>
    <SuDescriptionsItem label="版本">0.1.0</SuDescriptionsItem>
    <SuDescriptionsItem label="备注" :span="2"> 适合展示详情页和只读表单内容。 </SuDescriptionsItem>
  </SuDescriptions>
</template>
```

## 垂直布局

通过 `layout="vertical"` 让标签和内容上下排列：

```vue
<template>
  <SuDescriptions layout="vertical" :column="3" border :colon="false">
    <SuDescriptionsItem label="创建时间">2026-06-27</SuDescriptionsItem>
    <SuDescriptionsItem label="更新时间">2026-06-27</SuDescriptionsItem>
    <SuDescriptionsItem label="发布状态">草稿</SuDescriptionsItem>
  </SuDescriptions>
</template>
```

## 额外操作

通过 `extra` 插槽放置右侧操作：

```vue
<template>
  <SuDescriptions title="用户信息">
    <template #extra>
      <SuButton size="small" variant="text">编辑</SuButton>
    </template>
    <SuDescriptionsItem label="用户名">苏苏</SuDescriptionsItem>
  </SuDescriptions>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDescriptions, SuDescriptionsItem } from '@susu-ui/vue'
</script>
```

## Descriptions Props

| 参数         | 说明           | 类型                             | 默认值         |
| ------------ | -------------- | -------------------------------- | -------------- |
| `title`      | 标题           | `string`                         | `undefined`    |
| `items`      | 描述项配置     | `DescriptionsItem[]`             | `undefined`    |
| `column`     | 每行列数       | `number`                         | `3`            |
| `size`       | 尺寸           | `'small' \| 'medium' \| 'large'` | `'medium'`     |
| `layout`     | 标签和内容布局 | `'horizontal' \| 'vertical'`     | `'horizontal'` |
| `border`     | 是否显示边框   | `boolean`                        | `false`        |
| `colon`      | 是否显示冒号   | `boolean`                        | `true`         |
| `labelWidth` | 标签宽度       | `number \| string`               | `undefined`    |

## DescriptionsItem Props

| 参数               | 说明       | 类型     | 默认值      |
| ------------------ | ---------- | -------- | ----------- |
| `label`            | 标签文本   | `string` | `undefined` |
| `span`             | 跨列数     | `number` | `1`         |
| `className`        | 描述项类名 | `string` | `undefined` |
| `labelClassName`   | 标签类名   | `string` | `undefined` |
| `contentClassName` | 内容类名   | `string` | `undefined` |

## Descriptions 插槽

| 名称      | 说明         |
| --------- | ------------ |
| `default` | 描述项声明   |
| `title`   | 自定义标题   |
| `extra`   | 标题右侧内容 |

## DescriptionsItem 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 自定义内容     |
| `label`   | 自定义标签内容 |
