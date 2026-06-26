# Empty 空状态

空状态用于在列表、表格、搜索结果或内容区域没有数据时展示占位信息。

## 基础用法

```vue
<template>
  <SuEmpty />
</template>
```

## 自定义描述

通过 `description` 设置描述文本，也可以使用默认插槽传入更灵活的内容：

```vue
<template>
  <SuEmpty description="没有搜索结果" />
  <SuEmpty>当前筛选条件下没有匹配内容</SuEmpty>
</template>
```

## 自定义图片

通过 `image` 设置图片地址，通过 `imageSize` 设置图片区域尺寸：

```vue
<template>
  <SuEmpty image="/empty.png" :image-size="120" />
</template>
```

## 自定义图形

通过 `image` 插槽自定义空状态图形：

```vue
<template>
  <SuEmpty description="暂未添加成员">
    <template #image>
      <SuIcon>
        <svg viewBox="0 0 24 24">
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </SuIcon>
    </template>
  </SuEmpty>
</template>
```

## 底部操作

通过 `footer` 插槽添加操作按钮：

```vue
<template>
  <SuEmpty description="还没有项目">
    <template #footer>
      <SuButton type="primary">新建项目</SuButton>
    </template>
  </SuEmpty>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuEmpty } from '@susu-ui/vue'
</script>

<template>
  <SuEmpty />
</template>
```

## Props

| 参数          | 说明         | 类型               | 默认值         |
| ------------- | ------------ | ------------------ | -------------- |
| `description` | 空状态描述   | `string`           | 国际化默认文案 |
| `image`       | 图片地址     | `string`           | `undefined`    |
| `imageSize`   | 图片区域尺寸 | `number \| string` | `96`           |

## 插槽

| 名称      | 说明             |
| --------- | ---------------- |
| `default` | 空状态描述内容   |
| `image`   | 自定义空状态图形 |
| `footer`  | 底部操作区域     |
