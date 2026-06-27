<script setup lang="ts">
function formatStatisticPercent(value: string | number) {
  return `${(Number(value) * 100).toFixed(1)}%`
}
</script>

<template>
  <section id="statistic" class="panel">
    <h2>统计数值</h2>
    <div class="statistic-demo">
      <SuStatistic title="总访问量" :value="12800" />
      <SuStatistic
        title="成交金额"
        :value="568920.5"
        prefix="¥"
        suffix="元"
        :precision="2"
        status="primary"
      />
      <SuStatistic
        title="转化率"
        :value="0.236"
        :format="formatStatisticPercent"
        trend="up"
        description="较上周增长 3.2%"
      />
      <SuStatistic
        title="异常工单"
        :value="18"
        suffix="件"
        trend="down"
        status="error"
        description="今日待处理"
      />
      <SuStatistic title="加载中" loading />
      <SuStatistic title="自定义内容" :value="42" align="center">
        <template #prefix>约</template>
        <template #value="{ formattedValue }">
          <strong>{{ formattedValue }}</strong>
        </template>
        <template #suffix>个项目</template>
        <template #description>已进入发布流程</template>
      </SuStatistic>
    </div>
  </section>
</template>
<style scoped>
.statistic-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.statistic-demo :deep(.su-statistic) {
  min-height: 128px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

@media (max-width: 640px) {
  .statistic-demo {
    grid-template-columns: 1fr;
  }
}
</style>
