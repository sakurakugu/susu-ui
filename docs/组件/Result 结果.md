# Result 结果

结果用于反馈操作完成后的状态，适合放在提交成功页、异常页、空流程落点或步骤结束页中。

## 基础用法

通过 `title` 和 `description` 展示结果标题和说明：

```vue
<template>
  <SuResult title="提交成功" description="系统已经保存当前配置。" />
</template>
```

## 结果状态

通过 `status` 设置不同反馈类型：

```vue
<template>
  <SuResult status="info" title="等待处理" />
  <SuResult status="success" title="发布成功" />
  <SuResult status="warning" title="需要补充信息" />
  <SuResult status="error" title="提交失败" />
</template>
```

## 底部操作

通过 `footer` 插槽添加操作按钮：

```vue
<template>
  <SuResult
    status="success"
    title="发布成功"
    description="内容已经同步到线上环境。"
  >
    <template #footer>
      <SuButton type="primary">查看详情</SuButton>
      <SuButton>返回列表</SuButton>
    </template>
  </SuResult>
</template>
```

## 自定义内容

可以通过插槽自定义图标、标题和描述内容：

```vue
<template>
  <SuResult status="warning" icon-size="64px">
    <template #icon>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path d="M12 3 2 21h20L12 3Z" />
          <path d="M12 9v5M12 17h.01" />
        </svg>
      </SuIcon>
    </template>
    <template #title>字段仍需确认</template>
    发布前请检查权限、发布范围和附件内容。
  </SuResult>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuResult } from '@susu-ui/vue'
</script>

<template>
  <SuResult status="success" title="操作成功" />
</template>
```

## Props

| 参数          | 说明         | 类型                                          | 默认值   |
| ------------- | ------------ | --------------------------------------------- | -------- |
| `status`      | 结果状态     | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title`       | 结果标题     | `string`                                      | `-`      |
| `description` | 结果描述     | `string`                                      | `-`      |
| `iconSize`    | 图标区域尺寸 | `number \| string`                            | `72`     |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 结果描述内容   |
| `title`   | 自定义标题内容 |
| `icon`    | 自定义图标内容 |
| `footer`  | 底部操作区域   |
