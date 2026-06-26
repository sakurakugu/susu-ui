# Button 按钮

按钮用于触发一个即时操作。

## 基础用法

```vue
<template>
  <SuButton>默认按钮</SuButton>
  <SuButton type="primary">主要按钮</SuButton>
</template>
```

## 按钮变体

通过 `variant` 控制按钮视觉风格：

```vue
<template>
  <SuButton variant="solid">实心按钮</SuButton>
  <SuButton variant="outline">描边按钮</SuButton>
  <SuButton variant="ghost">幽灵按钮</SuButton>
  <SuButton variant="text">文本按钮</SuButton>
</template>
```

## 按钮尺寸

通过 `size` 控制按钮尺寸：

```vue
<template>
  <SuButton size="small">小按钮</SuButton>
  <SuButton>默认按钮</SuButton>
  <SuButton size="large">大按钮</SuButton>
</template>
```

## 加载状态

通过 `loading` 展示加载状态，加载中按钮不可点击：

```vue
<template>
  <SuButton type="primary" loading>提交中</SuButton>
</template>
```

## 禁用状态

通过 `disabled` 禁用按钮：

```vue
<template>
  <SuButton disabled>禁用按钮</SuButton>
  <SuButton type="primary" disabled>禁用主要按钮</SuButton>
</template>
```

## 原生类型

表单中可以通过 `nativeType` 设置原生按钮类型：

```vue
<template>
  <SuButton native-type="submit">提交</SuButton>
  <SuButton native-type="reset">重置</SuButton>
</template>
```

## 前后置内容

通过 `prefix` 和 `suffix` 插槽添加前后置内容：

```vue
<template>
  <SuButton>
    <template #prefix>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </SuIcon>
    </template>
    新建
  </SuButton>
</template>

<template>
  <SuButton>
    <template #prefix>+</template>
    新建
  </SuButton>
</template>
```

## 按钮组

通过 `SuButtonGroup` 组合一组相关按钮。按钮组可以统一设置 `type`、`variant` 和 `size`，组内按钮也可以单独覆盖：

```vue
<template>
  <SuButtonGroup type="primary" variant="outline" size="small">
    <SuButton>左</SuButton>
    <SuButton>中</SuButton>
    <SuButton>右</SuButton>
  </SuButtonGroup>

  <SuButtonGroup direction="vertical">
    <SuButton>上</SuButton>
    <SuButton>中</SuButton>
    <SuButton>下</SuButton>
  </SuButtonGroup>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuButton, SuButtonGroup } from '@susu-ui/vue'
</script>

<template>
  <SuButtonGroup>
    <SuButton type="primary">提交</SuButton>
    <SuButton>取消</SuButton>
  </SuButtonGroup>
</template>
```

## Props

| 参数         | 说明         | 类型                                        | 默认值      |
| ------------ | ------------ | ------------------------------------------- | ----------- |
| `type`       | 按钮类型     | `'default' \| 'primary'`                    | `'default'` |
| `variant`    | 按钮变体     | `'solid' \| 'outline' \| 'text' \| 'ghost'` | `'solid'`   |
| `size`       | 按钮尺寸     | `'small' \| 'medium' \| 'large'`            | `'medium'`  |
| `disabled`   | 是否禁用     | `boolean`                                   | `false`     |
| `loading`    | 是否加载中   | `boolean`                                   | `false`     |
| `nativeType` | 原生按钮类型 | `'button' \| 'submit' \| 'reset'`           | `'button'`  |

## ButtonGroup Props

| 参数        | 说明     | 类型                                        | 默认值         |
| ----------- | -------- | ------------------------------------------- | -------------- |
| `type`      | 按钮类型 | `'default' \| 'primary'`                    | -              |
| `variant`   | 按钮变体 | `'solid' \| 'outline' \| 'text' \| 'ghost'` | -              |
| `size`      | 按钮尺寸 | `'small' \| 'medium' \| 'large'`            | -              |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'`                | `'horizontal'` |

## 插槽

| 名称      | 说明     |
| --------- | -------- |
| `default` | 按钮内容 |
| `prefix`  | 前置内容 |
| `suffix`  | 后置内容 |
