# Tree 树

树用于展示具有层级关系的数据，适合目录、组织结构、权限配置和分类列表。

## 基础用法

通过 `data` 传入节点数据，节点需要包含唯一 `key` 和展示文本 `label`：

```vue
<script setup lang="ts">
const data = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'guide', label: '指南' },
      { key: 'components', label: '组件' },
    ],
  },
]
</script>

<template>
  <SuTree :data="data" />
</template>
```

## 受控展开

通过 `v-model:expanded-keys` 控制展开节点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const expandedKeys = ref(['docs'])
</script>

<template>
  <SuTree v-model:expanded-keys="expandedKeys" :data="data" />
</template>
```

## 选择节点

通过 `v-model:selected-key` 获取当前选中的节点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKey = ref('guide')
</script>

<template>
  <SuTree v-model:selected-key="selectedKey" :data="data" />
</template>
```

## 复选节点

设置 `checkable` 后展示复选框，并通过 `v-model:checked-keys` 控制选中项：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checkedKeys = ref(['guide'])
</script>

<template>
  <SuTree v-model:checked-keys="checkedKeys" :data="data" checkable default-expand-all />
</template>
```

## 自定义节点

默认插槽可以自定义节点内容：

```vue
<template>
  <SuTree :data="data" default-expand-all>
    <template #default="{ node }">
      <strong>{{ node.label }}</strong>
    </template>
  </SuTree>
</template>
```

## 禁用节点

节点设置 `disabled` 后不会响应选择、展开和复选操作：

```vue
<template>
  <SuTree
    :data="[
      { key: 'enabled', label: '可用节点' },
      { key: 'disabled', label: '禁用节点', disabled: true },
    ]"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTree } from '@susu-ui/vue'
</script>

<template>
  <SuTree :data="data" />
</template>
```

## Props

| 参数                | 说明                   | 类型                             | 默认值       |
| ------------------- | ---------------------- | -------------------------------- | ------------ |
| `data`              | 树节点数据             | `TreeNode[]`                     | `[]`         |
| `selectedKey`       | 当前选中节点           | `string \| number \| undefined`  | `undefined`  |
| `expandedKeys`      | 当前展开节点           | `(string \| number)[]`           | `[]`         |
| `checkedKeys`       | 当前复选节点           | `(string \| number)[]`           | `[]`         |
| `size`              | 尺寸                   | `'small' \| 'medium' \| 'large'` | `'medium'`   |
| `selectable`        | 是否允许选择节点       | `boolean`                        | `true`       |
| `checkable`         | 是否展示复选框         | `boolean`                        | `false`      |
| `accordion`         | 根节点是否手风琴展开   | `boolean`                        | `false`      |
| `defaultExpandAll`  | 是否默认展开全部节点   | `boolean`                        | `false`      |
| `expandOnClickNode` | 点击节点时是否切换展开 | `boolean`                        | `true`       |
| `checkOnClickNode`  | 点击节点时是否切换复选 | `boolean`                        | `false`      |
| `disabled`          | 是否禁用整棵树         | `boolean`                        | `false`      |
| `emptyText`         | 空状态文案             | `string`                         | `'暂无数据'` |

## TreeNode

| 参数       | 说明         | 类型               | 默认值      |
| ---------- | ------------ | ------------------ | ----------- |
| `key`      | 节点唯一键   | `string \| number` | 必填        |
| `label`    | 节点文本     | `string`           | 必填        |
| `children` | 子节点       | `TreeNode[]`       | `undefined` |
| `disabled` | 是否禁用节点 | `boolean`          | `false`     |
| `isLeaf`   | 是否强制叶子 | `boolean`          | `false`     |

## 事件

| 名称         | 说明             | 参数                    |
| ------------ | ---------------- | ----------------------- |
| `nodeClick`  | 点击节点时触发   | `(node, event)`         |
| `nodeExpand` | 展开状态变化触发 | `(node, expanded)`      |
| `check`      | 复选状态变化触发 | `(keys, node, checked)` |

## 插槽

| 名称      | 说明           | 参数       |
| --------- | -------------- | ---------- |
| `default` | 自定义节点内容 | `{ node }` |
| `empty`   | 空状态内容     | 无         |
