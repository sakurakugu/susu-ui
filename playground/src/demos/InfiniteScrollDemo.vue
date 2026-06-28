<script setup lang="ts">
import { computed, ref } from 'vue'

const allActivities = Array.from({ length: 36 }, (_, index) => ({
  id: index + 1,
  title: [
    '客户补充了采购预算',
    '销售提交了折扣审批',
    '实施团队更新了上线排期',
    '客户成功完成了续约回访',
  ][index % 4],
  owner: ['苏苏', '小满', '青禾', '知夏'][index % 4],
  time: `今天 ${9 + (index % 8)}:${index % 2 === 0 ? '00' : '30'}`,
}))

const pageSize = 8
const visibleCount = ref(pageSize)
const loading = ref(false)
const failed = ref(false)
const retryCount = ref(0)

const visibleActivities = computed(() =>
  allActivities.slice(0, visibleCount.value),
)
const finished = computed(() => visibleCount.value >= allActivities.length)

function loadMore() {
  if (loading.value || finished.value) {
    return
  }

  loading.value = true

  window.setTimeout(() => {
    if (retryCount.value === 0 && visibleCount.value >= pageSize * 2) {
      failed.value = true
      retryCount.value += 1
      loading.value = false
      return
    }

    visibleCount.value = Math.min(
      visibleCount.value + pageSize,
      allActivities.length,
    )
    failed.value = false
    loading.value = false
  }, 520)
}

function retryLoad() {
  failed.value = false
  loadMore()
}
</script>

<template>
  <section id="infinite-scroll" class="panel">
    <h2>无限滚动</h2>

    <div class="infinite-scroll-demo">
      <SuInfiniteScroll
        :height="360"
        :distance="56"
        :loading="loading"
        :finished="finished"
        :error="failed"
        @load="loadMore"
      >
        <div class="infinite-scroll-demo__list">
          <article
            v-for="activity in visibleActivities"
            :key="activity.id"
            class="infinite-scroll-demo__item"
          >
            <div>
              <strong>{{ activity.title }}</strong>
              <span>负责人：{{ activity.owner }}</span>
            </div>
            <time>{{ activity.time }}</time>
          </article>
        </div>

        <template #loading>
          <span class="infinite-scroll-demo__spinner" aria-hidden="true" />
          <span>正在加载更多客户动态</span>
        </template>

        <template #finished>所有客户动态已加载完成</template>

        <template #error>
          <span>加载失败，网络状态可能不稳定</span>
          <SuButton size="small" @click="retryLoad">重新加载</SuButton>
        </template>
      </SuInfiniteScroll>
    </div>
  </section>
</template>

<style scoped>
.infinite-scroll-demo {
  max-width: 760px;
}

.infinite-scroll-demo :deep(.su-infinite-scroll) {
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.infinite-scroll-demo__list {
  display: grid;
}

.infinite-scroll-demo__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--su-space-md) var(--su-space-lg);
  border-bottom: 1px solid var(--su-color-border);
  gap: var(--su-space-lg);
}

.infinite-scroll-demo__item > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.infinite-scroll-demo__item strong {
  color: var(--su-color-text);
}

.infinite-scroll-demo__item span,
.infinite-scroll-demo__item time {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.infinite-scroll-demo__item time {
  flex: none;
}

.infinite-scroll-demo__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid color-mix(in srgb, currentcolor 22%, transparent);
  border-top-color: currentcolor;
  border-radius: var(--su-radius-round);
  animation: infinite-scroll-demo-spin 0.8s linear infinite;
}

@keyframes infinite-scroll-demo-spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
