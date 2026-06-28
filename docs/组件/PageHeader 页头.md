# PageHeader 页头

页头用于承载页面标题、返回入口、层级路径、页面级操作和补充信息，适合详情页、配置页和带上下文的工作台页面。

## 基础用法

通过 `title`、`subtitle` 和 `breadcrumb` 描述页面上下文：

```vue
<script setup lang="ts">
const breadcrumb = [
  { label: '工作台', href: '/' },
  { label: '销售项目', href: '/projects' },
  { label: '客户增长计划' },
]
</script>

<template>
  <SuPageHeader
    title="客户增长计划"
    subtitle="统一查看线索来源、跟进节奏和本周转化目标。"
    :breadcrumb="breadcrumb"
  />
</template>
```

## 返回入口

设置 `showBack` 后展示返回按钮，点击时触发 `back` 事件：

```vue
<template>
  <SuPageHeader title="售后工单 #A2481" show-back @back="router.back()" />
</template>
```

## 操作区和标签

通过 `tags` 和 `extra` 插槽补充状态与页面级操作：

```vue
<template>
  <SuPageHeader title="客户增长计划">
    <template #tags>
      <SuTag type="success">进行中</SuTag>
      <SuTag type="primary" variant="outline">重点项目</SuTag>
    </template>

    <template #extra>
      <SuButton variant="outline">导出</SuButton>
      <SuButton type="primary">新建跟进</SuButton>
    </template>
  </SuPageHeader>
</template>
```

## 扩展内容

默认插槽可放置指标摘要、描述信息等页面概览内容，`footer` 插槽适合承载标签页或二级导航：

```vue
<template>
  <SuPageHeader title="客户增长计划">
    <div class="metrics">
      <span>本月新增线索：128</span>
      <span>商机转化率：42%</span>
    </div>

    <template #footer>
      <SuTabs v-model="activeTab" size="small">
        <SuTabPane label="概览" name="overview" />
        <SuTabPane label="跟进记录" name="records" />
      </SuTabs>
    </template>
  </SuPageHeader>
</template>
```

## 轻量样式

通过 `ghost` 去掉外层边框和背景，适合嵌入已有页面容器：

```vue
<template>
  <SuPageHeader title="资产台账" subtitle="查看当前组织的设备归属和维护状态。" ghost />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuPageHeader } from '@susu-ui/vue'
</script>

<template>
  <SuPageHeader title="客户增长计划" />
</template>
```

## Props

| 参数         | 说明                       | 类型                             | 默认值     |
| ------------ | -------------------------- | -------------------------------- | ---------- |
| `title`      | 页面标题                   | `string`                         | `''`       |
| `subtitle`   | 页面副标题或说明           | `string`                         | `''`       |
| `breadcrumb` | 面包屑节点列表             | `PageHeaderBreadcrumbItem[]`     | `[]`       |
| `backText`   | 返回按钮文本和无障碍标签   | `string`                         | `'返回'`   |
| `showBack`   | 是否展示返回按钮           | `boolean`                        | `false`    |
| `size`       | 页头尺寸                   | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `ghost`      | 是否使用无边框透明背景样式 | `boolean`                        | `false`    |

## PageHeaderBreadcrumbItem

继承 `BreadcrumbItem`，可直接使用面包屑组件的节点配置。

| 参数       | 说明             | 类型      | 默认值  |
| ---------- | ---------------- | --------- | ------- |
| `label`    | 节点文本         | `string`  | -       |
| `href`     | 链接地址         | `string`  | -       |
| `disabled` | 是否禁用当前节点 | `boolean` | `false` |

## 事件

| 名称              | 说明                   | 回调参数                                                 |
| ----------------- | ---------------------- | -------------------------------------------------------- |
| `back`            | 点击返回按钮时触发     | `(event: MouseEvent)`                                    |
| `breadcrumbClick` | 点击非当前面包屑时触发 | `(item: PageHeaderBreadcrumbItem, index: number, event)` |

## 插槽

| 名称         | 说明                           | 参数 |
| ------------ | ------------------------------ | ---- |
| `breadcrumb` | 自定义面包屑区域               | -    |
| `backIcon`   | 自定义返回图标                 | -    |
| `title`      | 自定义标题内容                 | -    |
| `subtitle`   | 自定义副标题内容               | -    |
| `tags`       | 标题旁的状态标签区域           | -    |
| `extra`      | 右侧页面级操作区               | -    |
| `default`    | 标题下方的扩展内容区域         | -    |
| `footer`     | 底部区域，适合标签页或二级导航 | -    |
