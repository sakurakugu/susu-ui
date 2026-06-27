# CommandPalette 命令面板

命令面板用于在应用内集中搜索页面、命令和快捷操作，适合后台工作台、编辑器和复杂业务系统。

## 基础用法

通过 `v-model` 控制显示状态，选择命令后触发 `select` 事件并默认关闭面板。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { CommandPaletteOption } from '@susu-ui/vue'

const visible = ref(false)

const commands: CommandPaletteOption[] = [
  {
    label: '打开销售工作台',
    value: 'sales-dashboard',
    description: '查看今日线索、商机和回款提醒',
    group: '导航',
    shortcut: ['G', 'S'],
  },
  {
    label: '新建客户档案',
    value: 'create-customer',
    description: '录入客户公司、联系人和跟进负责人',
    group: '快捷操作',
    shortcut: 'N',
  },
]

function selectCommand(option: CommandPaletteOption) {
  console.log(option)
}
</script>

<template>
  <SuButton type="primary" @click="visible = true">打开命令面板</SuButton>
  <SuCommandPalette
    v-model="visible"
    :options="commands"
    title="工作台命令"
    placeholder="搜索页面、客户或操作"
    @select="selectCommand"
  />
</template>
```

## 受控搜索词

通过 `v-model:query` 控制搜索词，可用于记住上次搜索内容或从外部同步搜索条件。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const query = ref('客户')
</script>

<template>
  <SuCommandPalette
    v-model="visible"
    v-model:query="query"
    :options="commands"
    :clear-query-on-close="false"
  />
</template>
```

## 自定义命令项

通过 `option` 插槽自定义每条命令的展示内容。

```vue
<template>
  <SuCommandPalette v-model="visible" :options="commands">
    <template #option="{ option }">
      <span class="command-option">
        <span>{{ option.label }}</span>
        <small>{{ option.description }}</small>
      </span>
    </template>
  </SuCommandPalette>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCommandPalette } from '@susu-ui/vue'
import type { CommandPaletteOption } from '@susu-ui/vue'
</script>
```

## Props

| 参数                 | 说明                 | 类型                     | 默认值                   |
| -------------------- | -------------------- | ------------------------ | ------------------------ |
| `v-model`            | 是否显示命令面板     | `boolean`                | `false`                  |
| `v-model:query`      | 搜索词               | `string`                 | `''`                     |
| `options`            | 命令列表             | `CommandPaletteOption[]` | -                        |
| `title`              | 标题                 | `string`                 | `'命令面板'`             |
| `placeholder`        | 搜索框占位文本       | `string`                 | `'搜索命令、页面或操作'` |
| `emptyText`          | 空状态文本           | `string`                 | `'暂无匹配命令'`         |
| `closeOnClickMask`   | 点击遮罩是否关闭     | `boolean`                | `true`                   |
| `closeOnPressEscape` | 按下 ESC 是否关闭    | `boolean`                | `true`                   |
| `clearQueryOnClose`  | 关闭时是否清空搜索词 | `boolean`                | `false`                  |
| `width`              | 面板宽度             | `string \| number`       | `'640px'`                |
| `zIndex`             | 遮罩层级             | `number`                 | -                        |

## CommandPaletteOption

| 字段          | 说明       | 类型                 | 默认值 |
| ------------- | ---------- | -------------------- | ------ |
| `label`       | 命令标题   | `string`             | -      |
| `value`       | 命令值     | `string \| number`   | -      |
| `description` | 命令描述   | `string`             | -      |
| `group`       | 分组名称   | `string`             | -      |
| `shortcut`    | 快捷键展示 | `string \| string[]` | -      |
| `disabled`    | 是否禁用   | `boolean`            | -      |

## 事件

| 名称     | 说明                   | 参数                                     |
| -------- | ---------------------- | ---------------------------------------- |
| `open`   | 命令面板开始打开时触发 | -                                        |
| `close`  | 请求关闭时触发         | `'select' \| 'close' \| 'mask' \| 'esc'` |
| `select` | 选择命令时触发         | `CommandPaletteOption`                   |

## 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 自定义列表内容   |
| `option`  | 自定义命令项内容 |
| `empty`   | 自定义空状态     |
