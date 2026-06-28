# VirtualizedSelect 虚拟选择器

虚拟选择器用于从大量候选项中选择单个值，只渲染可视区和缓冲区选项，适合成员、客户、资源等规模较大的下拉选择场景。

## 基础用法

通过 `options` 传入选项数组，`height` 控制下拉面板高度，`item-height` 控制每个选项的固定高度：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const owner = ref('')
const owners = Array.from({ length: 1000 }, (_, index) => ({
  label: `客户经理 ${index + 1}`,
  value: index + 1,
}))
</script>

<template>
  <SuVirtualizedSelect
    v-model="owner"
    :options="owners"
    placeholder="请选择客户负责人"
    :height="280"
    :item-height="40"
    clearable
  />
</template>
```

## 自定义选项

使用 `option` 插槽可以展示更多业务信息：

```vue
<template>
  <SuVirtualizedSelect v-model="owner" :options="owners" :item-height="48">
    <template #option="{ option, index }">
      <div class="owner-option">
        <strong>{{ option.label }}</strong>
        <span>序号：{{ index + 1 }}</span>
      </div>
    </template>
  </SuVirtualizedSelect>
</template>
```

## 空状态

没有候选项时显示 `empty-text`，也可以通过 `empty` 插槽自定义：

```vue
<template>
  <SuVirtualizedSelect :options="[]" empty-text="当前项目没有可分配成员">
    <template #empty>请先把成员加入项目团队</template>
  </SuVirtualizedSelect>
</template>
```

## 表单提交

传入 `name` 后组件会渲染隐藏输入框，用于普通表单提交：

```vue
<template>
  <SuVirtualizedSelect
    v-model="owner"
    name="ownerId"
    required
    :options="owners"
  />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuVirtualizedSelect } from '@susu-ui/vue'
</script>
```

## Props

| 参数          | 说明                         | 类型                                             | 默认值         |
| ------------- | ---------------------------- | ------------------------------------------------ | -------------- |
| `modelValue`  | 绑定值                       | `string \| number`                               | `''`           |
| `options`     | 选项数组                     | `VirtualizedSelectOption[]`                      | `[]`           |
| `size`        | 尺寸                         | `'small' \| 'medium' \| 'large'`                 | 表单尺寸       |
| `status`      | 状态                         | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'`    |
| `placeholder` | 占位文本                     | `string`                                         | `'请选择'`     |
| `disabled`    | 是否禁用                     | `boolean`                                        | `false`        |
| `clearable`   | 是否支持清空                 | `boolean`                                        | `false`        |
| `height`      | 下拉面板可滚动区域最大高度   | `number`                                         | `256`          |
| `itemHeight`  | 每个选项固定高度，单位为像素 | `number`                                         | `34`           |
| `buffer`      | 可视区上下额外渲染的选项数量 | `number`                                         | `5`            |
| `emptyText`   | 空状态文案                   | `string`                                         | `'暂无数据'`   |
| `name`        | 表单字段名                   | `string`                                         | `undefined`    |
| `id`          | 触发按钮 `id`                | `string`                                         | `undefined`    |
| `required`    | 是否必填                     | `boolean`                                        | `false`        |
| `ariaLabel`   | 无障碍标签                   | `string`                                         | `'虚拟选择器'` |

## VirtualizedSelectOption

| 参数       | 说明         | 类型               | 默认值  |
| ---------- | ------------ | ------------------ | ------- |
| `label`    | 选项展示文本 | `string`           | -       |
| `value`    | 选项值       | `string \| number` | -       |
| `disabled` | 是否禁用选项 | `boolean`          | `false` |

## 事件

| 名称     | 说明             | 参数              |
| -------- | ---------------- | ----------------- |
| `change` | 选中值变化时触发 | `(value, option)` |
| `focus`  | 聚焦时触发       | `(event)`         |
| `blur`   | 失焦时触发       | `(event)`         |
| `clear`  | 清空选择时触发   | -                 |
| `open`   | 面板打开时触发   | -                 |
| `close`  | 面板关闭时触发   | -                 |

## 插槽

| 名称     | 说明         | 参数                                  |
| -------- | ------------ | ------------------------------------- |
| `option` | 自定义选项   | `{ option, index, selected, active }` |
| `empty`  | 自定义空状态 | 无                                    |

## 暴露方法

| 名称    | 说明         | 参数 |
| ------- | ------------ | ---- |
| `focus` | 聚焦触发按钮 | -    |
| `blur`  | 取消聚焦     | -    |
| `open`  | 打开面板     | -    |
| `close` | 关闭面板     | -    |
| `clear` | 清空选择     | -    |
