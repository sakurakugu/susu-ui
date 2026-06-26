# Menu 菜单

菜单用于展示页面导航或功能分组，适合侧边栏、顶部导航和设置页分组入口。

## 基础用法

通过 `items` 传入菜单数据，菜单项需要包含唯一 `key` 和展示文本 `label`：

```vue
<script setup lang="ts">
const items = [
  { key: 'overview', label: '概览' },
  {
    key: 'components',
    label: '组件',
    children: [
      { key: 'button', label: 'Button 按钮' },
      { key: 'menu', label: 'Menu 菜单' },
    ],
  },
]
</script>

<template>
  <SuMenu :items="items" />
</template>
```

## 受控展开

通过 `v-model:open-keys` 控制展开的子菜单：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const openKeys = ref(['components'])
</script>

<template>
  <SuMenu v-model:open-keys="openKeys" :items="items" />
</template>
```

## 选择菜单项

通过 `v-model:selected-key` 获取当前选中的菜单项：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedKey = ref('overview')
</script>

<template>
  <SuMenu v-model:selected-key="selectedKey" :items="items" />
</template>
```

## 水平菜单

设置 `mode="horizontal"` 可以展示顶部导航样式：

```vue
<template>
  <SuMenu :items="items" mode="horizontal" selected-key="overview" />
</template>
```

## 自定义菜单项

默认插槽可以自定义菜单项内容：

```vue
<template>
  <SuMenu :items="items" default-open-all>
    <template #default="{ item }">
      <strong>{{ item.label }}</strong>
    </template>
  </SuMenu>
</template>
```

## 禁用菜单项

菜单项设置 `disabled` 后不会响应点击和键盘操作：

```vue
<template>
  <SuMenu
    :items="[
      { key: 'enabled', label: '可用菜单' },
      { key: 'disabled', label: '禁用菜单', disabled: true },
    ]"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuMenu } from '@susu-ui/vue'
</script>

<template>
  <SuMenu :items="items" />
</template>
```

## Props

| 参数             | 说明                 | 类型                             | 默认值       |
| ---------------- | -------------------- | -------------------------------- | ------------ |
| `items`          | 菜单数据             | `MenuItem[]`                     | `[]`         |
| `selectedKey`    | 当前选中的菜单项     | `string \| number \| undefined`  | `undefined`  |
| `openKeys`       | 当前展开的子菜单     | `(string \| number)[]`           | `[]`         |
| `mode`           | 菜单模式             | `'vertical' \| 'horizontal'`     | `'vertical'` |
| `size`           | 尺寸                 | `'small' \| 'medium' \| 'large'` | `'medium'`   |
| `accordion`      | 根级子菜单是否手风琴 | `boolean`                        | `false`      |
| `collapse`       | 是否折叠垂直菜单     | `boolean`                        | `false`      |
| `selectable`     | 是否允许选择菜单项   | `boolean`                        | `true`       |
| `defaultOpenAll` | 是否默认展开全部菜单 | `boolean`                        | `false`      |
| `disabled`       | 是否禁用整个菜单     | `boolean`                        | `false`      |
| `emptyText`      | 空状态文案           | `string`                         | `'暂无菜单'` |

## MenuItem

| 参数       | 说明             | 类型               | 默认值      |
| ---------- | ---------------- | ------------------ | ----------- |
| `key`      | 菜单项唯一键     | `string \| number` | 必填        |
| `label`    | 菜单项文本       | `string`           | 必填        |
| `icon`     | 菜单项图标组件   | `unknown`          | `undefined` |
| `children` | 子菜单           | `MenuItem[]`       | `undefined` |
| `disabled` | 是否禁用菜单项   | `boolean`          | `false`     |
| `divided`  | 是否显示上分割线 | `boolean`          | `false`     |

## 事件

| 名称         | 说明               | 参数                   |
| ------------ | ------------------ | ---------------------- |
| `select`     | 选择菜单项时触发   | `(key, item)`          |
| `openChange` | 子菜单展开变化触发 | `(keys, item, opened)` |

## 插槽

| 名称      | 说明             | 参数       |
| --------- | ---------------- | ---------- |
| `default` | 自定义菜单项内容 | `{ item }` |
| `empty`   | 空状态内容       | 无         |
