# List 列表

列表用于展示结构相近的一组记录，适合客户跟进、任务队列、通知记录等场景。

## 基础用法

通过 `SuList` 包裹多个 `SuListItem`：

```vue
<template>
  <SuList title="客户跟进">
    <SuListItem
      title="星河制造"
      description="本周确认二期扩容方案，负责人：青禾"
    />
    <SuListItem
      title="云启科技"
      description="等待采购部门反馈合同条款，负责人：小满"
    />
  </SuList>
</template>
```

## 自定义列表项

`SuListItem` 提供头像、操作区和右侧扩展内容插槽：

```vue
<template>
  <SuList title="客户跟进" hoverable>
    <SuListItem title="北辰零售" description="需要补充门店数据迁移评估">
      <template #avatar>
        <SuAvatar name="北辰零售" />
      </template>
      <template #actions>
        <SuButton size="small" type="primary">记录结果</SuButton>
        <SuButton size="small" variant="outline">查看详情</SuButton>
      </template>
      <template #extra>
        <SuTag type="warning">待确认</SuTag>
      </template>
    </SuListItem>
  </SuList>
</template>
```

## 尺寸和样式

通过 `size` 控制密度，通过 `bordered`、`divided`、`striped` 和 `hoverable` 控制视觉状态：

```vue
<template>
  <SuList size="small" :bordered="false" striped hoverable>
    <SuListItem title="线索导入" description="已完成 320 条数据清洗" />
    <SuListItem title="合同同步" description="等待财务系统返回结果" />
  </SuList>
</template>
```

## 加载和空状态

`loading` 会显示加载状态；没有默认插槽内容时显示空状态：

```vue
<template>
  <SuList title="同步任务" loading />
  <SuList title="审批记录" empty-text="暂无审批记录" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuList, SuListItem } from '@susu-ui/vue'
</script>
```

## List Props

| 参数         | 说明               | 类型                             | 默认值         |
| ------------ | ------------------ | -------------------------------- | -------------- |
| `title`      | 列表标题           | `string`                         | `undefined`    |
| `bordered`   | 是否显示边框       | `boolean`                        | `true`         |
| `divided`    | 是否显示项目分割线 | `boolean`                        | `true`         |
| `striped`    | 是否显示斑马纹背景 | `boolean`                        | `false`        |
| `hoverable`  | 是否显示悬浮背景   | `boolean`                        | `false`        |
| `size`       | 列表尺寸           | `'small' \| 'medium' \| 'large'` | `'medium'`     |
| `itemLayout` | 列表项布局方向     | `'horizontal' \| 'vertical'`     | `'horizontal'` |
| `loading`    | 是否显示加载状态   | `boolean`                        | `false`        |
| `emptyText`  | 空状态文案         | `string`                         | `'暂无数据'`   |

## ListItem Props

| 参数          | 说明     | 类型     | 默认值      |
| ------------- | -------- | -------- | ----------- |
| `title`       | 项目标题 | `string` | `undefined` |
| `description` | 项目描述 | `string` | `undefined` |

## 插槽

| 名称          | 说明               |
| ------------- | ------------------ |
| `default`     | 列表内容或项目正文 |
| `header`      | 自定义列表头部     |
| `footer`      | 自定义列表底部     |
| `empty`       | 自定义空状态       |
| `title`       | 自定义项目标题     |
| `description` | 自定义项目描述     |
| `avatar`      | 项目前置头像区域   |
| `actions`     | 项目操作区         |
| `extra`       | 项目右侧扩展区     |
