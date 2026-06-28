# Collapse 折叠面板

折叠面板用于收纳可分组的信息，适合详情页、配置页和常见问题列表。

## 基础用法

通过 `v-model` 绑定当前展开面板，`SuCollapseItem` 声明每个面板：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['overview'])
</script>

<template>
  <SuCollapse v-model="activeNames">
    <SuCollapseItem title="项目概览" name="overview">
      当前版本聚焦基础组件、主题能力和文档体验。
    </SuCollapseItem>
    <SuCollapseItem title="任务进度" name="task"> 本周目标完成率稳步提升。 </SuCollapseItem>
  </SuCollapse>
</template>
```

## 手风琴模式

设置 `accordion` 后，同一时间只展开一个面板：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('basic')
</script>

<template>
  <SuCollapse v-model="activeName" accordion>
    <SuCollapseItem title="基础信息" name="basic">基础信息内容</SuCollapseItem>
    <SuCollapseItem title="权限配置" name="permission"> 权限配置内容 </SuCollapseItem>
  </SuCollapse>
</template>
```

## 禁用面板

设置 `disabled` 后，面板不会响应点击和键盘切换：

```vue
<template>
  <SuCollapse v-model="activeNames">
    <SuCollapseItem title="项目概览" name="overview">项目内容</SuCollapseItem>
    <SuCollapseItem title="审计记录" name="audit" disabled> 审计记录内容 </SuCollapseItem>
  </SuCollapse>
</template>
```

## 自定义标题和额外内容

`SuCollapseItem` 支持 `title` 和 `extra` 插槽：

```vue
<template>
  <SuCollapse v-model="activeNames">
    <SuCollapseItem name="task">
      <template #title>任务进度</template>
      <template #extra>
        <SuTag size="small" type="primary">68%</SuTag>
      </template>
      本周目标完成率稳步提升。
    </SuCollapseItem>
  </SuCollapse>
</template>
```

## 轻量样式

通过 `ghost` 使用轻量分组样式，通过 `bordered` 控制边框：

```vue
<template>
  <SuCollapse v-model="activeNames" ghost>
    <SuCollapseItem title="基础信息" name="basic">基础信息内容</SuCollapseItem>
    <SuCollapseItem title="权限配置" name="permission"> 权限配置内容 </SuCollapseItem>
  </SuCollapse>
</template>
```

## 销毁未展开内容

设置 `destroy-inactive-panel` 后，未展开面板内容不会保留在 DOM 中：

```vue
<template>
  <SuCollapse v-model="activeNames" destroy-inactive-panel>
    <SuCollapseItem title="项目概览" name="overview">项目内容</SuCollapseItem>
    <SuCollapseItem title="统计图表" name="chart">图表内容</SuCollapseItem>
  </SuCollapse>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCollapse, SuCollapseItem } from '@susu-ui/vue'
</script>
```

## Collapse Props

| 参数                   | 说明                     | 类型                             | 默认值     |
| ---------------------- | ------------------------ | -------------------------------- | ---------- |
| `modelValue`           | 当前展开面板             | `string \| number \| Array`      | `[]`       |
| `accordion`            | 是否启用手风琴模式       | `boolean`                        | `false`    |
| `size`                 | 尺寸                     | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `bordered`             | 是否显示边框             | `boolean`                        | `true`     |
| `ghost`                | 是否使用轻量分组样式     | `boolean`                        | `false`    |
| `destroyInactivePanel` | 是否销毁未展开面板的内容 | `boolean`                        | `false`    |

## CollapseItem Props

| 参数       | 说明         | 类型               | 默认值      |
| ---------- | ------------ | ------------------ | ----------- |
| `title`    | 面板标题     | `string`           | `undefined` |
| `name`     | 面板唯一值   | `string \| number` | 顺序索引    |
| `disabled` | 是否禁用面板 | `boolean`          | `false`     |

## 事件

| 名称        | 说明                     | 参数            |
| ----------- | ------------------------ | --------------- |
| `change`    | 展开面板变化时触发       | `(activeNames)` |
| `itemClick` | 点击或键盘切换面板时触发 | `(name, event)` |

## Collapse 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 面板内容 |

## CollapseItem 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 面板主体内容     |
| `title`   | 自定义面板标题   |
| `extra`   | 标题右侧额外内容 |
