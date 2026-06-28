# VirtualTree 虚拟树

虚拟树用于展示大量层级数据，只渲染可视区和缓冲区内的节点，适合大型组织架构、权限资源树、文件目录等场景。

## 基础用法

通过 `data` 传入树节点数据，节点需要包含唯一 `key` 和展示文本 `label`。`height` 设置滚动容器高度，`item-height` 设置每一行的固定高度：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKey = ref('team-1-user-1')
const expandedKeys = ref(['company', 'team-1'])

const data = [
  {
    key: 'company',
    label: '星河科技集团',
    children: Array.from({ length: 20 }, (_, index) => ({
      key: `team-${index + 1}`,
      label: `项目小组 ${index + 1}`,
      children: Array.from({ length: 30 }, (_, userIndex) => ({
        key: `team-${index + 1}-user-${userIndex + 1}`,
        label: `成员 ${index + 1}-${userIndex + 1}`,
      })),
    })),
  },
]
</script>

<template>
  <SuVirtualTree
    v-model:selected-key="selectedKey"
    v-model:expanded-keys="expandedKeys"
    :data="data"
    :height="360"
    :item-height="34"
  />
</template>
```

## 受控展开

通过 `v-model:expanded-keys` 控制展开节点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const expandedKeys = ref(['company'])
</script>

<template>
  <SuVirtualTree v-model:expanded-keys="expandedKeys" :data="data" />
</template>
```

## 复选节点

设置 `checkable` 后展示复选框，并通过 `v-model:checked-keys` 控制选中项：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checkedKeys = ref(['permission-project-read'])
</script>

<template>
  <SuVirtualTree
    v-model:checked-keys="checkedKeys"
    :data="permissionData"
    checkable
    default-expand-all
  />
</template>
```

## 自定义节点

默认插槽可以自定义节点内容：

```vue
<template>
  <SuVirtualTree :data="data" default-expand-all>
    <template #default="{ node }">
      <span class="tree-node">
        <strong>{{ node.label }}</strong>
        <SuTag v-if="node.disabled" size="small" type="info">停用</SuTag>
      </span>
    </template>
  </SuVirtualTree>
</template>
```

## 滚动到指定节点

组件暴露 `scrollTo`、`scrollToIndex` 和 `scrollToKey` 方法。`scrollToKey` 只会定位当前已经可见的节点，如果目标节点在折叠分支内，需要先展开它的祖先节点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const treeRef = ref()

function locateMember() {
  treeRef.value?.scrollToKey('team-8-user-16', 'center')
}
</script>

<template>
  <SuVirtualTree ref="treeRef" :data="data" default-expand-all />
  <SuButton @click="locateMember">定位成员</SuButton>
</template>
```

## 空状态

数据为空时显示 `empty-text`，也可以使用 `empty` 插槽自定义内容：

```vue
<template>
  <SuVirtualTree :data="[]" :height="160" empty-text="暂无目录">
    <template #empty>当前项目还没有同步组织目录</template>
  </SuVirtualTree>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuVirtualTree } from '@susu-ui/vue'
</script>
```

## Props

| 参数                | 说明                         | 类型                             | 默认值       |
| ------------------- | ---------------------------- | -------------------------------- | ------------ |
| `data`              | 树节点数据                   | `VirtualTreeNode[]`              | `[]`         |
| `selectedKey`       | 当前选中节点                 | `string \| number \| undefined`  | `undefined`  |
| `expandedKeys`      | 当前展开节点                 | `(string \| number)[]`           | `[]`         |
| `checkedKeys`       | 当前复选节点                 | `(string \| number)[]`           | `[]`         |
| `height`            | 滚动容器高度                 | `number \| string`               | `320`        |
| `itemHeight`        | 每一行固定高度，单位为像素   | `number`                         | `32`         |
| `size`              | 尺寸                         | `'small' \| 'medium' \| 'large'` | `'medium'`   |
| `selectable`        | 是否允许选择节点             | `boolean`                        | `true`       |
| `checkable`         | 是否展示复选框               | `boolean`                        | `false`      |
| `accordion`         | 根节点是否手风琴展开         | `boolean`                        | `false`      |
| `defaultExpandAll`  | 是否默认展开全部节点         | `boolean`                        | `false`      |
| `expandOnClickNode` | 点击节点时是否切换展开       | `boolean`                        | `true`       |
| `checkOnClickNode`  | 点击节点时是否切换复选       | `boolean`                        | `false`      |
| `disabled`          | 是否禁用整棵树               | `boolean`                        | `false`      |
| `buffer`            | 可视区上下额外渲染的节点数量 | `number`                         | `5`          |
| `emptyText`         | 空状态文案                   | `string`                         | `'暂无数据'` |

## VirtualTreeNode

| 参数       | 说明         | 类型                | 默认值      |
| ---------- | ------------ | ------------------- | ----------- |
| `key`      | 节点唯一键   | `string \| number`  | 必填        |
| `label`    | 节点文本     | `string`            | 必填        |
| `children` | 子节点       | `VirtualTreeNode[]` | `undefined` |
| `disabled` | 是否禁用节点 | `boolean`           | `false`     |
| `isLeaf`   | 是否强制叶子 | `boolean`           | `false`     |

## 事件

| 名称         | 说明             | 参数                    |
| ------------ | ---------------- | ----------------------- |
| `nodeClick`  | 点击节点时触发   | `(node, event)`         |
| `nodeExpand` | 展开状态变化触发 | `(node, expanded)`      |
| `check`      | 复选状态变化触发 | `(keys, node, checked)` |
| `scroll`     | 滚动列表时触发   | `(event, state)`        |

`state` 包含 `scrollTop`、`startIndex`、`endIndex` 和 `visibleCount`。

## 插槽

| 名称      | 说明           | 参数       |
| --------- | -------------- | ---------- |
| `default` | 自定义节点内容 | `{ node }` |
| `empty`   | 空状态内容     | 无         |

## 暴露方法

| 名称            | 说明               | 参数                                                            |
| --------------- | ------------------ | --------------------------------------------------------------- |
| `scrollTo`      | 滚动到指定偏移量   | `(offset: number)`                                              |
| `scrollToIndex` | 滚动到指定可见索引 | `(index: number, align?: 'start' \| 'center' \| 'end')`         |
| `scrollToKey`   | 滚动到指定可见节点 | `(key: string \| number, align?: 'start' \| 'center' \| 'end')` |
