# Text 文本

文本用于统一正文、状态文案和辅助说明的颜色、尺寸、字重与省略样式。

## 基础用法

```vue
<template>
  <SuText>默认文本</SuText>
  <SuText type="primary">主要文本</SuText>
  <SuText type="muted">辅助文本</SuText>
</template>
```

## 文本类型

通过 `type` 控制语义颜色：

```vue
<template>
  <SuText type="success">成功文本</SuText>
  <SuText type="warning">警告文本</SuText>
  <SuText type="error">错误文本</SuText>
  <SuText type="info">信息文本</SuText>
</template>
```

## 尺寸和字重

通过 `size` 和 `weight` 控制文本层级：

```vue
<template>
  <SuText size="small">小号文本</SuText>
  <SuText>默认尺寸</SuText>
  <SuText size="large" weight="semibold">大号半粗文本</SuText>
</template>
```

## 语义标签

通过 `tag` 渲染不同 HTML 标签：

```vue
<template>
  <SuText tag="p" block>段落文本</SuText>
  <SuText tag="strong" weight="bold">强调文本</SuText>
  <SuText tag="code">inline-code</SuText>
</template>
```

## 文本修饰

支持下划线、删除线和斜体：

```vue
<template>
  <SuText underline>下划线文本</SuText>
  <SuText delete>删除线文本</SuText>
  <SuText italic>斜体文本</SuText>
</template>
```

## 省略

通过 `ellipsis` 控制单行省略，通过 `line-clamp` 控制多行省略：

```vue
<template>
  <SuText block ellipsis> 这是一段很长的单行文本，超出容器后会显示省略号。 </SuText>
  <SuText tag="p" block :line-clamp="2">
    这是一段很长的多行文本，适合摘要、说明和表格内容等场景。
  </SuText>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuText } from '@susu-ui/vue'
</script>

<template>
  <SuText type="primary">文本</SuText>
</template>
```

## Props

| 参数        | 说明           | 类型                                                                                 | 默认值      |
| ----------- | -------------- | ------------------------------------------------------------------------------------ | ----------- |
| `tag`       | 渲染标签       | `'span' \| 'p' \| 'strong' \| 'em' \| 'small' \| 'mark' \| 'del' \| 'ins' \| 'code'` | `'span'`    |
| `type`      | 文本类型       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'muted'`   | `'default'` |
| `size`      | 文本尺寸       | `'small' \| 'medium' \| 'large'`                                                     | `'medium'`  |
| `weight`    | 文本字重       | `'regular' \| 'medium' \| 'semibold' \| 'bold'`                                      | `'regular'` |
| `block`     | 是否块级显示   | `boolean`                                                                            | `false`     |
| `ellipsis`  | 是否单行省略   | `boolean`                                                                            | `false`     |
| `lineClamp` | 多行省略行数   | `number \| string`                                                                   | `undefined` |
| `underline` | 是否展示下划线 | `boolean`                                                                            | `false`     |
| `delete`    | 是否展示删除线 | `boolean`                                                                            | `false`     |
| `italic`    | 是否斜体       | `boolean`                                                                            | `false`     |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 文本内容 |
