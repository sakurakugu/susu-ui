# Sidebar 侧栏

侧栏用于承载页面中长期存在的导航、筛选和辅助信息面板，是页面布局的一部分。

`SuSidebar` 和 `SuDrawer` 的区别在于：`SuDrawer` 是临时打开的浮层面板，`SuSidebar` 会占据页面布局空间并随页面长期存在。`SuSidebar` 和 `SuSider` 的区别在于：`SuSider` 是 `SuLayout` 的布局子组件，`SuSidebar` 是可独立使用的侧栏容器。

## 基础用法

```vue
<template>
  <div class="page">
    <SuSidebar title="销售工作台" width="240px">
      <nav>总览、客户线索、合同回款</nav>
    </SuSidebar>
    <main>客户推进看板</main>
  </div>
</template>
```

## 右侧辅助栏

通过 `placement` 设置侧栏方向，右侧侧栏适合承载筛选条件、详情摘要和页面工具。

```vue
<template>
  <div class="page">
    <main>线索列表</main>
    <SuSidebar placement="right" title="筛选条件" shadow="always">
      <p>负责人：华东销售一组</p>
      <p>预计成交：本季度</p>
    </SuSidebar>
  </div>
</template>
```

## 可折叠侧栏

通过 `v-model:collapsed` 控制折叠状态，默认插槽和触发器插槽会收到当前折叠状态。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <SuSidebar v-model:collapsed="collapsed" collapsible>
    <template #default="{ collapsed: isCollapsed }">
      {{ isCollapsed ? '窄栏' : '完整导航菜单' }}
    </template>
    <template #trigger="{ collapsed: isCollapsed }">
      {{ isCollapsed ? '展开' : '收起' }}
    </template>
  </SuSidebar>
</template>
```

## 固定在视口内

通过 `sticky` 让侧栏在滚动页面中保持可见，`offsetTop` 用于避开固定顶栏。

```vue
<template>
  <SuSidebar sticky offset-top="64px" title="页面目录">
    <nav>概览、明细、操作记录</nav>
  </SuSidebar>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuSidebar } from '@susu-ui/vue'
</script>
```

## Props

| 参数               | 说明                 | 类型                  | 默认值    |
| ------------------ | -------------------- | --------------------- | --------- |
| `title`            | 标题                 | `string`              | -         |
| `placement`        | 侧栏位置             | `'left' \| 'right'`   | `'left'`  |
| `width`            | 展开宽度             | `number \| string`    | `280`     |
| `collapsedWidth`   | 折叠宽度             | `number \| string`    | `64`      |
| `collapsed`        | 折叠状态             | `boolean`             | `false`   |
| `collapsible`      | 是否显示折叠触发器   | `boolean`             | `false`   |
| `defaultCollapsed` | 非受控模式的初始状态 | `boolean`             | `false`   |
| `bordered`         | 是否显示分隔边框     | `boolean`             | `true`    |
| `shadow`           | 阴影模式             | `'always' \| 'never'` | `'never'` |
| `sticky`           | 是否启用粘性定位     | `boolean`             | `false`   |
| `offsetTop`        | 粘性定位的顶部偏移   | `number \| string`    | `0`       |

## 事件

| 名称       | 说明             | 参数                   |
| ---------- | ---------------- | ---------------------- |
| `collapse` | 折叠状态变化触发 | `(collapsed: boolean)` |

## 插槽

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `default` | 侧栏内容，参数为当前折叠状态 |
| `header`  | 自定义头部                   |
| `title`   | 自定义标题                   |
| `footer`  | 自定义底部                   |
| `trigger` | 自定义折叠触发器             |
