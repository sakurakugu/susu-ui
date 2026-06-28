# Form 表单

表单用于组织输入控件、标签、说明文案和原生提交行为。

## 基础用法

通过 `SuForm` 包裹多个 `SuFormItem`，每个表单项负责标签和控件布局：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
</script>

<template>
  <SuForm label-width="88px">
    <SuFormItem label="用户名" label-for="name" required>
      <SuInput id="name" v-model="name" required placeholder="请输入用户名" />
    </SuFormItem>
    <SuFormItem label="邮箱" label-for="email" help="用于接收通知">
      <SuInput id="email" v-model="email" type="email" placeholder="请输入邮箱" />
    </SuFormItem>
  </SuForm>
</template>
```

## 标签位置

通过 `label-position` 设置标签位置：

```vue
<template>
  <SuForm label-position="left">
    <SuFormItem label="左对齐">
      <SuInput />
    </SuFormItem>
  </SuForm>

  <SuForm label-position="top">
    <SuFormItem label="顶部标签">
      <SuInput />
    </SuFormItem>
  </SuForm>
</template>
```

## 行内表单

通过 `inline` 展示紧凑的行内布局：

```vue
<template>
  <SuForm inline label-position="top" size="small">
    <SuFormItem label="关键词">
      <SuInput size="small" placeholder="请输入关键词" />
    </SuFormItem>
    <SuFormItem>
      <SuButton size="small" type="primary">查询</SuButton>
    </SuFormItem>
  </SuForm>
</template>
```

## 状态和说明

通过 `help` 展示说明文案，通过 `error` 或 `status` 设置表单项状态：

```vue
<template>
  <SuForm>
    <SuFormItem label="昵称" help="2 到 12 个字符">
      <SuInput />
    </SuFormItem>
    <SuFormItem label="邮箱" error="邮箱格式不正确">
      <SuInput status="error" />
    </SuFormItem>
    <SuFormItem label="备注" status="success" help="内容已保存">
      <SuInput type="textarea" />
    </SuFormItem>
  </SuForm>
</template>
```

## 提交和重置

`SuForm` 保留原生表单行为，默认在提交时执行原生校验：

```vue
<template>
  <SuForm @submit.prevent="submit" @reset.prevent="reset">
    <SuFormItem label="用户名" required>
      <SuInput required />
    </SuFormItem>
    <SuFormItem>
      <SuButton type="primary" native-type="submit">提交</SuButton>
      <SuButton native-type="reset">重置</SuButton>
    </SuFormItem>
  </SuForm>
</template>
```

## 禁用表单

通过 `disabled` 禁用整组表单控件：

```vue
<template>
  <SuForm disabled>
    <SuFormItem label="用户名">
      <SuInput model-value="不可编辑" />
    </SuFormItem>
  </SuForm>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuForm, SuFormItem } from '@susu-ui/vue'
</script>
```

## Form Props

| 参数                 | 说明                       | 类型                             | 默认值     |
| -------------------- | -------------------------- | -------------------------------- | ---------- |
| `label-width`        | 标签宽度                   | `number \| string`               | -          |
| `label-position`     | 标签位置                   | `'left' \| 'right' \| 'top'`     | `'right'`  |
| `size`               | 表单尺寸                   | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `disabled`           | 是否禁用整组表单           | `boolean`                        | `false`    |
| `inline`             | 是否使用行内布局           | `boolean`                        | `false`    |
| `validate-on-submit` | 提交前是否执行原生表单校验 | `boolean`                        | `true`     |

## Form 事件

| 名称     | 说明           |
| -------- | -------------- |
| `submit` | 表单提交时触发 |
| `reset`  | 表单重置时触发 |

## Form 方法

| 名称             | 说明                   |
| ---------------- | ---------------------- |
| `submit`         | 触发表单提交           |
| `reset`          | 触发表单重置           |
| `checkValidity`  | 返回原生表单校验结果   |
| `reportValidity` | 展示并返回原生校验结果 |

## FormItem Props

| 参数             | 说明                | 类型                                             | 默认值      |
| ---------------- | ------------------- | ------------------------------------------------ | ----------- |
| `label`          | 标签文本            | `string`                                         | -           |
| `label-for`      | 标签关联控件的 `id` | `string`                                         | -           |
| `label-width`    | 当前表单项标签宽度  | `number \| string`                               | -           |
| `label-position` | 当前表单项标签位置  | `'left' \| 'right' \| 'top'`                     | -           |
| `size`           | 当前表单项尺寸      | `'small' \| 'medium' \| 'large'`                 | -           |
| `required`       | 是否展示必填标记    | `boolean`                                        | `false`     |
| `status`         | 表单项状态          | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` |
| `help`           | 帮助文案            | `string`                                         | -           |
| `error`          | 错误文案            | `string`                                         | -           |
| `disabled`       | 是否禁用当前表单项  | `boolean`                                        | `false`     |

## FormItem 插槽

| 名称      | 说明           |
| --------- | -------------- |
| `default` | 表单控件内容   |
| `label`   | 自定义标签内容 |
| `help`    | 自定义说明内容 |
