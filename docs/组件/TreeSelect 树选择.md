# TreeSelect 树选择

树选择用于在层级数据中选择单个节点，适合部门、目录、权限范围和分类归属等场景。

## 基础用法

通过 `data` 传入树形数据，使用 `v-model` 绑定选中节点值：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const team = ref<string | number>()

const data = [
  {
    label: '产品研发中心',
    value: 'product',
    children: [
      { label: '前端平台组', value: 'frontend' },
      { label: '设计系统组', value: 'design-system' },
    ],
  },
]
</script>

<template>
  <SuTreeSelect v-model="team" :data="data" placeholder="请选择团队" />
</template>
```

## 清空选择

设置 `clearable` 后，已有选择时会显示清空按钮：

```vue
<template>
  <SuTreeSelect v-model="team" :data="data" clearable />
</template>
```

## 搜索节点

设置 `searchable` 后，面板顶部会展示搜索输入框，并按节点文本过滤：

```vue
<template>
  <SuTreeSelect v-model="team" :data="data" searchable />
</template>
```

## 展开控制

通过 `v-model:expanded-keys` 控制当前展开节点，也可以设置 `default-expand-all` 默认展开全部节点：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const expandedKeys = ref<(string | number)[]>(['product'])
</script>

<template>
  <SuTreeSelect
    v-model="team"
    v-model:expanded-keys="expandedKeys"
    :data="data"
  />
</template>
```

## 自定义节点

通过 `node` 插槽可以自定义每一项内容：

```vue
<template>
  <SuTreeSelect :data="data" default-expand-all>
    <template #node="{ node }">
      <span>{{ node.label }}</span>
    </template>
  </SuTreeSelect>
</template>
```

## 表单提交

传入 `name` 后会渲染隐藏表单项：

```vue
<template>
  <SuTreeSelect name="team" required :data="data" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTreeSelect } from '@susu-ui/vue'
</script>
```

## Props

| 参数                | 说明                   | 类型                                             | 默认值             |
| ------------------- | ---------------------- | ------------------------------------------------ | ------------------ |
| `modelValue`        | 当前选中值             | `string \| number \| undefined`                  | `undefined`        |
| `expandedKeys`      | 当前展开节点           | `(string \| number)[]`                           | `[]`               |
| `data`              | 树节点数据             | `TreeSelectNode[]`                               | `[]`               |
| `size`              | 尺寸                   | `'small' \| 'medium' \| 'large'`                 | 表单尺寸           |
| `status`            | 状态                   | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`        |
| `placeholder`       | 占位文本               | `string`                                         | `'请选择'`         |
| `disabled`          | 是否禁用               | `boolean`                                        | `false`            |
| `clearable`         | 是否支持清空           | `boolean`                                        | `false`            |
| `searchable`        | 是否支持搜索           | `boolean`                                        | `false`            |
| `defaultExpandAll`  | 是否默认展开全部节点   | `boolean`                                        | `false`            |
| `expandOnClickNode` | 点击节点时是否切换展开 | `boolean`                                        | `true`             |
| `emptyText`         | 空状态文本             | `string`                                         | `'暂无数据'`       |
| `filterPlaceholder` | 搜索输入占位文本       | `string`                                         | `'请输入搜索内容'` |
| `name`              | 隐藏表单项名称         | `string`                                         | `undefined`        |
| `id`                | 触发按钮 `id`          | `string`                                         | `undefined`        |
| `required`          | 是否必填               | `boolean`                                        | `false`            |
| `ariaLabel`         | 无障碍标签             | `string`                                         | `'树选择'`         |

## TreeSelectNode

| 参数       | 说明         | 类型               | 默认值      |
| ---------- | ------------ | ------------------ | ----------- |
| `label`    | 节点展示文本 | `string`           | 必填        |
| `value`    | 节点值       | `string \| number` | 必填        |
| `children` | 子节点       | `TreeSelectNode[]` | `undefined` |
| `disabled` | 是否禁用节点 | `boolean`          | `false`     |
| `isLeaf`   | 是否强制叶子 | `boolean`          | `false`     |

## 事件

| 名称         | 说明             | 参数               |
| ------------ | ---------------- | ------------------ |
| `change`     | 选中值变化时触发 | `(value, node)`    |
| `clear`      | 清空选择时触发   | -                  |
| `focus`      | 聚焦时触发       | `(event)`          |
| `blur`       | 失焦时触发       | `(event)`          |
| `open`       | 展开面板时触发   | -                  |
| `close`      | 关闭面板时触发   | -                  |
| `nodeExpand` | 展开状态变化触发 | `(node, expanded)` |

## 插槽

| 名称    | 说明             | 参数       |
| ------- | ---------------- | ---------- |
| `node`  | 自定义节点内容   | `{ node }` |
| `empty` | 自定义空状态内容 | 无         |
