# InfiniteScroll 无限滚动

无限滚动用于在滚动接近底部时自动触发加载，适合消息流、动态列表、搜索结果追加等不需要明确分页跳转的场景。

## 基础用法

通过 `load` 事件追加数据，并用 `loading` 控制加载状态，避免重复请求：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const allItems = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  title: `客户动态 ${index + 1}`,
}))
const count = ref(12)
const loading = ref(false)

const items = computed(() => allItems.slice(0, count.value))
const finished = computed(() => count.value >= allItems.length)

function loadMore() {
  if (loading.value || finished.value) {
    return
  }

  loading.value = true

  window.setTimeout(() => {
    count.value = Math.min(count.value + 12, allItems.length)
    loading.value = false
  }, 500)
}
</script>

<template>
  <SuInfiniteScroll
    :height="320"
    :loading="loading"
    :finished="finished"
    @load="loadMore"
  >
    <article v-for="item in items" :key="item.id">
      {{ item.title }}
    </article>
  </SuInfiniteScroll>
</template>
```

## 滚动阈值

通过 `distance` 设置距离底部多少像素时触发加载：

```vue
<template>
  <SuInfiniteScroll :distance="120" @load="loadMore">
    <CustomerCard v-for="customer in customers" :key="customer.id" />
  </SuInfiniteScroll>
</template>
```

## 自定义滚动容器

传入 `height` 时组件自身会成为滚动容器；也可以通过 `target` 绑定已有容器或窗口：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const panelRef = ref<HTMLElement>()
</script>

<template>
  <div ref="panelRef" class="activity-panel">
    <SuInfiniteScroll :target="() => panelRef" @load="loadMore">
      <ActivityItem v-for="item in activities" :key="item.id" />
    </SuInfiniteScroll>
  </div>
</template>
```

## 状态插槽

`loading`、`finished`、`error` 插槽可自定义加载中、加载完成和加载失败的展示：

```vue
<template>
  <SuInfiniteScroll :loading="loading" :finished="finished" :error="error">
    <MessageItem v-for="message in messages" :key="message.id" />

    <template #loading>正在同步更多消息</template>
    <template #finished>历史消息已全部加载</template>
    <template #error>
      <SuButton size="small" @click="retry">重新加载</SuButton>
    </template>
  </SuInfiniteScroll>
</template>
```

## 手动检测

组件暴露 `check` 方法，可在筛选条件变化、图片加载完成或容器尺寸变化后手动检测是否需要继续加载：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const scrollRef = ref()

function refreshList() {
  scrollRef.value?.check()
}
</script>

<template>
  <SuInfiniteScroll ref="scrollRef" @load="loadMore" />
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuInfiniteScroll } from '@susu-ui/vue'
</script>
```

## Props

| 参数           | 说明                       | 类型                          | 默认值                 |
| -------------- | -------------------------- | ----------------------------- | ---------------------- |
| `target`       | 自定义滚动容器             | `() => Window \| HTMLElement` | `window` 或组件自身    |
| `distance`     | 距离底部多少像素时触发加载 | `number`                      | `80`                   |
| `height`       | 组件自身滚动容器高度       | `number \| string`            | `undefined`            |
| `loading`      | 是否正在加载               | `boolean`                     | `false`                |
| `finished`     | 是否已加载完成             | `boolean`                     | `false`                |
| `disabled`     | 是否禁用触发               | `boolean`                     | `false`                |
| `error`        | 是否处于加载失败状态       | `boolean`                     | `false`                |
| `immediate`    | 挂载后是否立即检测一次     | `boolean`                     | `true`                 |
| `loadingText`  | 加载中文案                 | `string`                      | `加载中...`            |
| `finishedText` | 加载完成文案               | `string`                      | `没有更多了`           |
| `errorText`    | 加载失败文案               | `string`                      | `加载失败，请稍后重试` |

## 事件

| 名称     | 说明               | 参数             |
| -------- | ------------------ | ---------------- |
| `load`   | 触发加载更多时触发 | `(state)`        |
| `scroll` | 滚动容器滚动时触发 | `(event, state)` |

`state` 包含 `scrollTop`、`scrollHeight`、`clientHeight` 和 `remaining`。

## 插槽

| 名称       | 说明         | 参数 |
| ---------- | ------------ | ---- |
| `default`  | 列表内容     | 无   |
| `loading`  | 加载中状态   | 无   |
| `finished` | 加载完成状态 | 无   |
| `error`    | 加载失败状态 | 无   |

## 暴露方法

| 名称    | 说明                         | 参数 |
| ------- | ---------------------------- | ---- |
| `check` | 手动检测是否需要触发加载更多 | 无   |
