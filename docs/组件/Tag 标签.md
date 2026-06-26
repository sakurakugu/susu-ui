# Tag 标签

标签用于标记分类、状态或属性。

## 基础用法

```vue
<template>
  <SuTag>默认标签</SuTag>
  <SuTag type="primary">主要标签</SuTag>
  <SuTag type="success">成功</SuTag>
  <SuTag type="warning">警告</SuTag>
  <SuTag type="error">错误</SuTag>
  <SuTag type="info">信息</SuTag>
</template>
```

## 标签变体

通过 `variant` 控制标签视觉风格：

```vue
<template>
  <SuTag type="primary" variant="light">浅色标签</SuTag>
  <SuTag type="primary" variant="outline">描边标签</SuTag>
  <SuTag type="primary" variant="solid">实心标签</SuTag>
</template>
```

## 标签尺寸

通过 `size` 控制标签尺寸：

```vue
<template>
  <SuTag size="small">小标签</SuTag>
  <SuTag>默认标签</SuTag>
  <SuTag size="large">大标签</SuTag>
</template>
```

## 可关闭

通过 `closable` 展示关闭按钮，点击关闭按钮会触发 `close` 事件：

```vue
<template>
  <SuTag closable @close="handleClose">可关闭标签</SuTag>
  <SuTag closable disabled>禁用关闭</SuTag>
</template>
```

## 圆角标签

通过 `round` 展示胶囊形标签：

```vue
<template>
  <SuTag round>圆角标签</SuTag>
  <SuTag type="primary" round>主要圆角标签</SuTag>
</template>
```

## 前置内容

通过 `prefix` 插槽添加图标或标识：

```vue
<template>
  <SuTag type="primary">
    <template #prefix>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path
            d="M12 3l2.7 5.47 6.03.88-4.37 4.26 1.03 6.01L12 16.78l-5.39 2.84 1.03-6.01-4.37-4.26 6.03-.88L12 3z"
          />
        </svg>
      </SuIcon>
    </template>
    带图标
  </SuTag>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuTag } from '@susu-ui/vue'
</script>

<template>
  <SuTag type="primary">标签</SuTag>
</template>
```

## Props

| 参数       | 说明         | 类型                                                                    | 默认值      |
| ---------- | ------------ | ----------------------------------------------------------------------- | ----------- |
| `type`     | 标签类型     | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `variant`  | 标签变体     | `'light' \| 'outline' \| 'solid'`                                       | `'light'`   |
| `size`     | 标签尺寸     | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  |
| `closable` | 是否可关闭   | `boolean`                                                               | `false`     |
| `round`    | 是否圆角     | `boolean`                                                               | `false`     |
| `disabled` | 是否禁用关闭 | `boolean`                                                               | `false`     |

## 事件

| 名称    | 说明               | 参数                  |
| ------- | ------------------ | --------------------- |
| `close` | 点击关闭按钮时触发 | `(event: MouseEvent)` |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 标签内容 |
| `prefix`  | 前置内容 |
