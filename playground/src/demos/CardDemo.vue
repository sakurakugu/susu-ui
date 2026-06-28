<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="card" class="panel">
    <h2>卡片</h2>
    <div class="card-demo">
      <SuCard title="项目概览">
        <template #extra>
          <SuButton variant="text" @click="showTopMessage">详情</SuButton>
        </template>
        <p>今日访问量较昨日提升 12%，核心流程保持稳定。</p>
      </SuCard>
      <SuCard shadow="hover" hoverable>
        <template #header>
          <span>任务进度</span>
        </template>
        <div class="card-demo-metric">
          <strong>68%</strong>
          <span>本周目标完成率</span>
        </div>
        <template #footer>
          <SuButton type="primary" size="small" @click="showTopMessage"> 继续处理 </SuButton>
        </template>
      </SuCard>
      <SuCard padding="small" shadow="never">
        <p>轻量卡片适合承载简短信息或列表项。</p>
      </SuCard>
    </div>
  </section>
</template>
<style scoped>
.card-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.card-demo :deep(.su-card) {
  min-height: 180px;
}

.card-demo :deep(.su-card__body p) {
  margin-top: 0;
}

.card-demo-metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-demo-metric strong {
  color: var(--su-color-primary);
  font-size: 32px;
  line-height: 1;
}

.card-demo-metric span {
  color: var(--su-color-text-muted);
}

@media (max-width: 640px) {
  .card-demo {
    grid-template-columns: 1fr;
  }
}
</style>
