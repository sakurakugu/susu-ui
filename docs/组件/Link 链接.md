# Link 链接

链接用于页面跳转或打开外部资源。触发即时操作时应使用 `SuButton`。

## 基础用法

```vue
<template>
  <SuLink href="/docs">查看文档</SuLink>
  <SuLink href="/orders" type="default">订单列表</SuLink>
</template>
```

## 链接类型

通过 `type` 控制链接的语义颜色：

```vue
<template>
  <SuLink href="/projects" type="primary">项目详情</SuLink>
  <SuLink href="/status" type="success">同步记录</SuLink>
  <SuLink href="/risk" type="warning">风险提示</SuLink>
  <SuLink href="/exceptions" type="error">异常单据</SuLink>
  <SuLink href="/help" type="info">帮助中心</SuLink>
</template>
```

## 下划线

通过 `underline` 控制下划线显示方式：

```vue
<template>
  <SuLink href="/reports" underline="always">始终显示</SuLink>
  <SuLink href="/reports/monthly" underline="hover">悬停显示</SuLink>
  <SuLink href="/reports/archive" underline="never">不显示</SuLink>
</template>
```

## 外部链接

当 `target="_blank"` 且没有手动传入 `rel` 时，组件会默认补充 `noopener noreferrer`。

```vue
<template>
  <SuLink href="https://example.com" target="_blank"> 打开外部系统 </SuLink>
</template>
```

## 禁用状态

禁用后链接不可聚焦、不可跳转，也不会触发点击事件。

```vue
<template>
  <SuLink href="/billing" disabled>账单归档中</SuLink>
</template>
```

## 前后置内容

通过 `prefix` 和 `suffix` 插槽添加前后置内容：

```vue
<template>
  <SuLink href="/files/invoice">
    <template #prefix>↗</template>
    查看发票附件
  </SuLink>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuLink } from '@susu-ui/vue'
</script>

<template>
  <SuLink href="/docs">查看文档</SuLink>
</template>
```

## Props

| 参数        | 说明           | 类型                                                                    | 默认值      |
| ----------- | -------------- | ----------------------------------------------------------------------- | ----------- |
| `href`      | 链接地址       | `string`                                                                | -           |
| `target`    | 打开方式       | `'_self' \| '_blank' \| '_parent' \| '_top' \| string`                  | -           |
| `rel`       | 链接关系       | `string`                                                                | -           |
| `type`      | 链接类型       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` |
| `underline` | 下划线显示方式 | `'always' \| 'hover' \| 'never'`                                        | `'hover'`   |
| `disabled`  | 是否禁用       | `boolean`                                                               | `false`     |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 链接内容 |
| `prefix`  | 前置内容 |
| `suffix`  | 后置内容 |
