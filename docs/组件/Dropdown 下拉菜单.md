# Dropdown 下拉菜单

下拉菜单用于在触发元素旁展示一组操作项，适合更多操作、筛选入口或紧凑命令列表。

## 基础用法

通过 `options` 配置菜单项，点击选项会触发 `command` 事件：

```vue
<script setup lang="ts">
const actions = [
  { label: '编辑', value: 'edit' },
  { label: '复制', value: 'copy' },
  { label: '删除', value: 'delete', divided: true },
]

function handleCommand(value: string | number) {
  console.log(value)
}
</script>

<template>
  <SuDropdown :options="actions" @command="handleCommand">
    <SuButton>更多操作</SuButton>
  </SuDropdown>
</template>
```

## 触发方式

通过 `trigger` 切换点击、悬停或手动控制：

```vue
<template>
  <SuDropdown :options="actions" trigger="click">
    <SuButton>点击展开</SuButton>
  </SuDropdown>

  <SuDropdown :options="actions" trigger="hover">
    <SuButton>悬停展开</SuButton>
  </SuDropdown>
</template>
```

## 自定义菜单

通过 `menu` 插槽自定义菜单内容：

```vue
<template>
  <SuDropdown>
    <SuButton>自定义内容</SuButton>
    <template #menu>
      <div style="padding: 8px 12px">这里可以放入自定义结构。</div>
    </template>
  </SuDropdown>
</template>
```

## 受控显示

通过 `v-model:visible` 控制菜单显示状态：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <SuDropdown v-model:visible="visible" trigger="manual">
    <SuButton @click="visible = !visible">切换菜单</SuButton>
    <template #menu>
      <button class="su-dropdown__item" type="button">受控菜单</button>
    </template>
  </SuDropdown>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuDropdown } from '@susu-ui/vue'
</script>
```

## Props

| 参数          | 说明               | 类型                                                                              | 默认值           |
| ------------- | ------------------ | --------------------------------------------------------------------------------- | ---------------- |
| `options`     | 菜单选项           | `DropdownOption[]`                                                                | -                |
| `placement`   | 菜单位置           | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'bottom-start'` |
| `trigger`     | 触发方式           | `'click' \| 'hover' \| 'manual'`                                                  | `'click'`        |
| `disabled`    | 是否禁用           | `boolean`                                                                         | `false`          |
| `hideOnClick` | 点击选项后是否隐藏 | `boolean`                                                                         | `true`           |
| `showDelay`   | 显示延迟，单位毫秒 | `number`                                                                          | `0`              |
| `hideDelay`   | 隐藏延迟，单位毫秒 | `number`                                                                          | `120`            |
| `offset`      | 与触发元素的间距   | `number`                                                                          | `8`              |
| `menuClass`   | 菜单自定义类名     | `string`                                                                          | -                |
| `zIndex`      | 菜单层级           | `number`                                                                          | -                |

## DropdownOption

| 参数       | 说明             | 类型               | 默认值  |
| ---------- | ---------------- | ------------------ | ------- |
| `label`    | 选项文本         | `string`           | -       |
| `value`    | 选项值           | `string \| number` | -       |
| `disabled` | 是否禁用         | `boolean`          | `false` |
| `divided`  | 是否显示上分割线 | `boolean`          | `false` |

## 事件

| 名称      | 说明               | 参数                                             |
| --------- | ------------------ | ------------------------------------------------ |
| `command` | 点击可用选项时触发 | `(value: DropdownValue, option: DropdownOption)` |
| `show`    | 显示菜单时触发     | -                                                |
| `hide`    | 隐藏菜单时触发     | -                                                |

## 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 触发菜单的元素 |
| `menu`    | 自定义菜单内容 |
