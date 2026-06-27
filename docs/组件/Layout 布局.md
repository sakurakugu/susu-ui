# Layout 布局

布局用于组织页面的顶部、侧边栏、内容区和底部区域，适合后台、控制台和文档类页面骨架。

## 基础用法

```vue
<template>
  <SuLayout>
    <SuHeader>产品运营中心</SuHeader>
    <SuContent>今日概览和待办事项</SuContent>
    <SuFooter>最近同步：10:24</SuFooter>
  </SuLayout>
</template>
```

## 侧边栏布局

`SuLayout` 会自动识别内部的 `SuSider`，也可以通过 `has-sider` 手动声明横向布局。

```vue
<template>
  <SuLayout>
    <SuSider>
      <nav>工作台、项目、团队</nav>
    </SuSider>
    <SuLayout>
      <SuHeader>项目排期</SuHeader>
      <SuContent>任务看板</SuContent>
    </SuLayout>
  </SuLayout>
</template>
```

## 可折叠侧边栏

通过 `v-model:collapsed` 控制侧边栏折叠状态，`trigger` 插槽可以替换默认触发器。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <SuSider v-model:collapsed="collapsed" collapsible>
    <template #default="{ collapsed: isCollapsed }">
      {{ isCollapsed ? '菜单' : '完整导航菜单' }}
    </template>
    <template #trigger="{ collapsed: isCollapsed }">
      {{ isCollapsed ? '展开导航' : '收起导航' }}
    </template>
  </SuSider>
</template>
```

## 自定义尺寸

`SuHeader` 和 `SuFooter` 支持设置高度，`SuSider` 支持设置展开宽度和折叠宽度。

```vue
<template>
  <SuLayout>
    <SuHeader :height="72">顶部工具栏</SuHeader>
    <SuLayout>
      <SuSider width="248px" :collapsed-width="80">导航</SuSider>
      <SuContent>内容区</SuContent>
    </SuLayout>
    <SuFooter height="48px">页脚信息</SuFooter>
  </SuLayout>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuContent, SuFooter, SuHeader, SuLayout, SuSider } from '@susu-ui/vue'
</script>
```

## Layout Props

| 参数       | 说明                 | 类型      | 默认值  |
| ---------- | -------------------- | --------- | ------- |
| `hasSider` | 是否按侧边栏布局渲染 | `boolean` | `false` |

## Header Props

| 参数     | 说明     | 类型               | 默认值 |
| -------- | -------- | ------------------ | ------ |
| `height` | 顶部高度 | `number \| string` | `64`   |

## Sider Props

| 参数               | 说明                 | 类型                | 默认值    |
| ------------------ | -------------------- | ------------------- | --------- |
| `collapsed`        | 折叠状态             | `boolean`           | `false`   |
| `width`            | 展开宽度             | `number \| string`  | `220`     |
| `collapsedWidth`   | 折叠宽度             | `number \| string`  | `64`      |
| `collapsible`      | 是否显示折叠触发器   | `boolean`           | `false`   |
| `defaultCollapsed` | 非受控模式的初始状态 | `boolean`           | `false`   |
| `theme`            | 侧边栏主题           | `'light' \| 'dark'` | `'light'` |

## Footer Props

| 参数     | 说明     | 类型               | 默认值 |
| -------- | -------- | ------------------ | ------ |
| `height` | 底部高度 | `number \| string` | `56`   |

## Sider 事件

| 事件名     | 说明             | 回调参数               |
| ---------- | ---------------- | ---------------------- |
| `collapse` | 折叠状态变化触发 | `(collapsed: boolean)` |

## 插槽

| 组件        | 名称      | 说明             |
| ----------- | --------- | ---------------- |
| `SuLayout`  | `default` | 布局内容         |
| `SuHeader`  | `default` | 顶部内容         |
| `SuSider`   | `default` | 侧边栏内容       |
| `SuSider`   | `trigger` | 自定义折叠触发器 |
| `SuContent` | `default` | 主内容           |
| `SuFooter`  | `default` | 底部内容         |
