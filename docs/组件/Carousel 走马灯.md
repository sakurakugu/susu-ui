# Carousel 走马灯

走马灯用于在有限区域内轮播展示横幅、公告、推荐内容或工作提醒，支持自动播放、指示器、方向按钮和受控切换。

## 基础用法

通过 `items` 传入轮播数据。每项可以包含标题、描述和图片：

```vue
<script setup lang="ts">
const items = [
  {
    title: '增长看板升级',
    description: '新增渠道贡献、线索转化和客户留存三组核心指标。',
    image: '/banner-growth.png',
  },
  {
    title: '六月版本发布',
    description: '统一权限配置入口，支持灰度发布和问题回滚记录。',
    image: '/banner-release.png',
  },
]
</script>

<template>
  <SuCarousel :items="items" height="260px" />
</template>
```

## 自动播放

通过 `autoplay` 开启自动播放，`interval` 控制切换间隔。默认在鼠标悬停和聚焦时暂停：

```vue
<template>
  <SuCarousel :items="items" autoplay :interval="3600" />
</template>
```

## 受控切换

组件支持 `v-model`，值为当前激活项的索引：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const active = ref(0)
</script>

<template>
  <SuCarousel
    v-model="active"
    :items="items"
    :loop="false"
    arrow="always"
    indicator-position="outside"
  />
</template>
```

## 自定义内容

通过默认作用域插槽自定义每一页内容：

```vue
<template>
  <SuCarousel :items="items" arrow="never" indicator-position="outside">
    <template #default="{ item, active }">
      <section class="notice-card" :data-active="active">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </section>
    </template>
  </SuCarousel>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuCarousel } from '@susu-ui/vue'
</script>

<template>
  <SuCarousel :items="items" />
</template>
```

## Props

| 参数                 | 说明                         | 类型                              | 默认值           |
| -------------------- | ---------------------------- | --------------------------------- | ---------------- |
| `v-model`            | 当前激活项索引               | `number`                          | `0`              |
| `items`              | 轮播数据                     | `CarouselItem[]`                  | `[]`             |
| `height`             | 轮播区域高度                 | `number \| string`                | `240`            |
| `autoplay`           | 是否自动播放                 | `boolean`                         | `false`          |
| `interval`           | 自动播放间隔，单位毫秒       | `number`                          | `3000`           |
| `loop`               | 是否循环切换                 | `boolean`                         | `true`           |
| `pause-on-hover`     | 鼠标悬停或聚焦时是否暂停播放 | `boolean`                         | `true`           |
| `arrow`              | 方向按钮展示方式             | `'always' \| 'hover' \| 'never'`  | `'hover'`        |
| `indicator-position` | 指示器位置                   | `'inside' \| 'outside' \| 'none'` | `'inside'`       |
| `label`              | 无障碍区域标签               | `string`                          | `'轮播图'`       |
| `empty-text`         | 无数据时的提示文本           | `string`                          | `'暂无轮播内容'` |

## 事件

| 名称     | 说明             | 参数                                     |
| -------- | ---------------- | ---------------------------------------- |
| `change` | 激活项变化时触发 | `(index: number, previousIndex: number)` |

## 插槽

| 名称      | 说明           | 参数                                                     |
| --------- | -------------- | -------------------------------------------------------- |
| `default` | 自定义每页内容 | `{ item: CarouselItem, index: number, active: boolean }` |

## 暴露方法

| 名称        | 说明           | 参数              |
| ----------- | -------------- | ----------------- |
| `next`      | 切换到下一张   | -                 |
| `previous`  | 切换到上一张   | -                 |
| `setActive` | 切换到指定索引 | `(index: number)` |

## 类型

```ts
type CarouselArrow = 'always' | 'hover' | 'never'
type CarouselIndicatorPosition = 'inside' | 'outside' | 'none'

interface CarouselItem {
  key?: string | number
  title?: string
  description?: string
  image?: string
  alt?: string
}
```
