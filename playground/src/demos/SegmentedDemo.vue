<script setup lang="ts">
import { ref } from 'vue'

const segmentedRangeValue = ref('week')
const segmentedViewValue = ref('list')

const segmentedRangeOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

const segmentedViewOptions = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' },
  { label: '看板', value: 'board', disabled: true },
]
</script>

<template>
  <section id="segmented" class="panel">
    <h2>分段控制器</h2>
    <div class="segmented-demo">
      <SuSegmented v-model="segmentedRangeValue" :options="segmentedRangeOptions" name="range" />
      <SuSegmented v-model="segmentedViewValue" :options="segmentedViewOptions" />
      <SuSegmented size="small" model-value="day" :options="segmentedRangeOptions" />
      <SuSegmented size="large" model-value="month" :options="segmentedRangeOptions" />
      <SuSegmented disabled model-value="week" :options="segmentedRangeOptions" />
      <SuSegmented block model-value="grid" :options="segmentedViewOptions" />
    </div>
  </section>
</template>
<style scoped>
.segmented-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.segmented-demo :deep(.su-segmented.is-block) {
  grid-column: 1 / -1;
}
</style>
