# FloatButton 浮动按钮

浮动按钮用于在页面固定位置承载高频操作入口，适合新建、反馈、帮助和快捷命令组。

## 基础用法

```vue
<template>
  <SuFloatButton description="新建" type="primary" @click="createTask">
    <template #icon>
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </template>
  </SuFloatButton>
</template>
```

## 形状和类型

通过 `shape` 设置圆形或方形，通过 `type` 设置默认或主要按钮。

```vue
<template>
  <SuFloatButton description="反馈" />
  <SuFloatButton shape="square" type="primary" description="发布" />
</template>
```

## 角标提醒

通过 `badge` 展示数量提醒，`badge-dot` 展示红点提醒。

```vue
<template>
  <SuFloatButton description="消息" :badge="12" :badge-max="9" />
  <SuFloatButton description="备注" badge-dot />
</template>
```

## 链接模式

传入 `href` 后会渲染为链接，适合帮助中心、工单系统等外部入口。

```vue
<template>
  <SuFloatButton href="https://example.com" target="_blank" description="帮助" />
</template>
```

## 浮动按钮组

`SuFloatButtonGroup` 可以直接堆叠多个浮动按钮，也可以通过 `trigger` 改为点击或悬浮后展开。

```vue
<template>
  <SuFloatButtonGroup trigger="click" placement="top" shape="square">
    <SuFloatButton description="电话" />
    <SuFloatButton description="备注" badge-dot />
    <SuFloatButton description="帮助" />
  </SuFloatButtonGroup>
</template>
```

## 受控展开

使用 `v-model:open` 控制菜单模式的展开状态。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <SuFloatButtonGroup v-model:open="open" trigger="click">
    <SuFloatButton description="审批" />
    <SuFloatButton description="转交" />
  </SuFloatButtonGroup>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuFloatButton, SuFloatButtonGroup } from '@susu-ui/vue'
</script>
```

## FloatButton Props

| 参数            | 说明                | 类型                     | 默认值       |
| --------------- | ------------------- | ------------------------ | ------------ |
| `type`          | 按钮类型            | `'default' \| 'primary'` | `'default'`  |
| `shape`         | 按钮形状            | `'circle' \| 'square'`   | `'circle'`   |
| `description`   | 按钮描述文本        | `string`                 | -            |
| `href`          | 链接地址            | `string`                 | -            |
| `target`        | 链接打开方式        | `string`                 | -            |
| `rel`           | 链接关系属性        | `string`                 | -            |
| `badge`         | 角标内容            | `string \| number`       | -            |
| `badgeMax`      | 数字角标最大值      | `number`                 | -            |
| `badgeDot`      | 是否显示红点角标    | `boolean`                | `false`      |
| `badgeHidden`   | 是否隐藏角标        | `boolean`                | `false`      |
| `badgeShowZero` | 角标为 0 时是否展示 | `boolean`                | `false`      |
| `right`         | 距离视口右侧的位置  | `number \| string`       | `40`         |
| `bottom`        | 距离视口底部的位置  | `number \| string`       | `40`         |
| `zIndex`        | 层级                | `number`                 | `100`        |
| `ariaLabel`     | 无障碍标签          | `string`                 | `'浮动操作'` |

## FloatButtonGroup Props

| 参数        | 说明               | 类型                                     | 默认值           |
| ----------- | ------------------ | ---------------------------------------- | ---------------- |
| `shape`     | 组内按钮形状       | `'circle' \| 'square'`                   | -                |
| `trigger`   | 展开触发方式       | `'click' \| 'hover'`                     | -                |
| `placement` | 菜单展开方向       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`          |
| `open`      | 是否展开           | `boolean`                                | -                |
| `right`     | 距离视口右侧的位置 | `number \| string`                       | `40`             |
| `bottom`    | 距离视口底部的位置 | `number \| string`                       | `40`             |
| `zIndex`    | 层级               | `number`                                 | `100`            |
| `ariaLabel` | 触发器无障碍标签   | `string`                                 | `'展开浮动操作'` |

## 事件

| 名称          | 说明                   | 参数              |
| ------------- | ---------------------- | ----------------- |
| `click`       | 点击浮动按钮时触发     | `(event) => void` |
| `update:open` | 分组展开状态变化时触发 | `(open) => void`  |
| `openChange`  | 分组展开状态变化时触发 | `(open) => void`  |

## 插槽

| 名称      | 说明               |
| --------- | ------------------ |
| `default` | 按钮内容或分组按钮 |
| `icon`    | 浮动按钮图标       |
| `trigger` | 分组菜单触发器内容 |
