# Space 间距

间距用于在一组元素之间保持一致的空隙。

## 基础用法

```vue
<template>
  <SuSpace>
    <SuButton>取消</SuButton>
    <SuButton type="primary">保存</SuButton>
  </SuSpace>
</template>
```

## 纵向排列

通过 `direction` 设置排列方向：

```vue
<template>
  <SuSpace direction="vertical">
    <SuCard title="基础信息">姓名、邮箱和部门</SuCard>
    <SuCard title="权限设置">角色、范围和状态</SuCard>
  </SuSpace>
</template>
```

## 间距尺寸

`size` 支持预设值、数字、CSS 长度，也支持数组分别设置横向和纵向间距：

```vue
<template>
  <SuSpace size="large">
    <SuTag>设计</SuTag>
    <SuTag>开发</SuTag>
    <SuTag>测试</SuTag>
  </SuSpace>

  <SuSpace :size="[16, 8]" wrap>
    <SuTag v-for="item in tags" :key="item">{{ item }}</SuTag>
  </SuSpace>
</template>
```

## 对齐和换行

通过 `align`、`justify` 和 `wrap` 控制主轴、交叉轴和换行：

```vue
<template>
  <SuSpace align="center" justify="between" fill>
    <span>当前状态：已发布</span>
    <SuButton type="primary">更新</SuButton>
  </SuSpace>
</template>
```

## 分隔符

通过 `separator` 或 `separator` 插槽设置相邻元素之间的分隔符：

```vue
<template>
  <SuSpace separator="/">
    <span>首页</span>
    <span>组件</span>
    <span>Space 间距</span>
  </SuSpace>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuSpace } from '@susu-ui/vue'
</script>

<template>
  <SuSpace>
    <SuButton>取消</SuButton>
    <SuButton type="primary">保存</SuButton>
  </SuSpace>
</template>
```

## Props

| 参数        | 说明                 | 类型                                                                           | 默认值         |
| ----------- | -------------------- | ------------------------------------------------------------------------------ | -------------- |
| `direction` | 排列方向             | `'horizontal' \| 'vertical'`                                                   | `'horizontal'` |
| `size`      | 间距尺寸             | `'small' \| 'medium' \| 'large' \| number \| string \| [SpaceSize, SpaceSize]` | `'medium'`     |
| `align`     | 交叉轴对齐方式       | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'`                      | `undefined`    |
| `justify`   | 主轴对齐方式         | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'`            | `'start'`      |
| `wrap`      | 横向排列时是否换行   | `boolean`                                                                      | `false`        |
| `inline`    | 是否使用行内弹性布局 | `boolean`                                                                      | `false`        |
| `fill`      | 是否撑满父容器       | `boolean`                                                                      | `false`        |
| `separator` | 相邻元素之间的分隔符 | `string \| number`                                                             | `undefined`    |

## 插槽

| 名称        | 说明                 |
| ----------- | -------------------- |
| `default`   | 间距内的内容         |
| `separator` | 自定义相邻元素分隔符 |
