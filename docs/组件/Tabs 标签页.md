# Tabs 标签页

标签页用于在同一区域内切换多组内容，适合详情页、配置页和分组表单。

## 基础用法

通过 `v-model` 绑定当前激活标签页，`SuTabPane` 声明每个面板：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('overview')
</script>

<template>
  <SuTabs v-model="activeTab">
    <SuTabPane label="概览" name="overview">概览内容</SuTabPane>
    <SuTabPane label="成员" name="members">成员内容</SuTabPane>
  </SuTabs>
</template>
```

## 禁用标签页

设置 `disabled` 后，标签页不会响应点击和键盘切换：

```vue
<template>
  <SuTabs v-model="activeTab">
    <SuTabPane label="概览" name="overview">概览内容</SuTabPane>
    <SuTabPane label="审计" name="audit" disabled>审计内容</SuTabPane>
  </SuTabs>
</template>
```

## 卡片样式

通过 `type="card"` 使用卡片样式：

```vue
<template>
  <SuTabs v-model="activeTab" type="card">
    <SuTabPane label="基础信息" name="basic">基础信息</SuTabPane>
    <SuTabPane label="权限" name="permission">权限配置</SuTabPane>
  </SuTabs>
</template>
```

## 标签位置

通过 `placement` 设置标签导航位置：

```vue
<template>
  <SuTabs v-model="activeTab" placement="left">
    <SuTabPane label="基础信息" name="basic">基础信息</SuTabPane>
    <SuTabPane label="权限" name="permission">权限配置</SuTabPane>
  </SuTabs>
</template>
```

## 自定义标签和额外内容

`SuTabPane` 支持 `label` 插槽，`SuTabs` 支持 `extra` 插槽：

```vue
<template>
  <SuTabs v-model="activeTab">
    <SuTabPane name="message">
      <template #label>消息</template>
      消息内容
    </SuTabPane>
    <template #extra>
      <SuButton size="small">新增</SuButton>
    </template>
  </SuTabs>
</template>
```

## 延迟渲染

设置 `lazy` 后，面板会在首次激活时渲染。设置 `destroy-inactive-pane` 后，非激活面板会被销毁：

```vue
<template>
  <SuTabs v-model="activeTab" destroy-inactive-pane>
    <SuTabPane label="概览" name="overview">概览内容</SuTabPane>
    <SuTabPane label="图表" name="chart" lazy>图表内容</SuTabPane>
  </SuTabs>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTabPane, SuTabs } from '@susu-ui/vue'
</script>
```

## Tabs Props

| 参数                  | 说明                   | 类型                                     | 默认值     |
| --------------------- | ---------------------- | ---------------------------------------- | ---------- |
| `modelValue`          | 当前激活标签页         | `string \| number`                       | 第一项可用 |
| `type`                | 标签页样式             | `'line' \| 'card'`                       | `'line'`   |
| `size`                | 尺寸                   | `'small' \| 'medium' \| 'large'`         | `'medium'` |
| `placement`           | 标签导航位置           | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    |
| `stretch`             | 是否撑满横向导航       | `boolean`                                | `false`    |
| `destroyInactivePane` | 是否销毁非激活面板内容 | `boolean`                                | `false`    |

## TabPane Props

| 参数       | 说明             | 类型               | 默认值      |
| ---------- | ---------------- | ------------------ | ----------- |
| `label`    | 标签文本         | `string`           | `undefined` |
| `name`     | 标签页唯一值     | `string \| number` | 顺序索引    |
| `disabled` | 是否禁用         | `boolean`          | `false`     |
| `lazy`     | 是否首次激活渲染 | `boolean`          | `false`     |

## 事件

| 名称       | 说明                     | 参数            |
| ---------- | ------------------------ | --------------- |
| `change`   | 激活标签页变化时触发     | `(name)`        |
| `tabClick` | 点击或键盘选中标签时触发 | `(name, event)` |

## Tabs 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 标签页面板内容   |
| `extra`   | 标签导航额外内容 |

## TabPane 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 面板内容       |
| `label`   | 自定义标签标题 |
