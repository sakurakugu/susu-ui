<script setup lang="ts">
import { ref } from 'vue'

const dateRangeValue = ref<[string, string]>(['2026-06-01', '2026-06-15'])
const limitedDateRangeValue = ref<[string, string]>(['', ''])

function disableRangeWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<template>
  <section id="date-range-picker" class="panel">
    <h2>日期范围选择器</h2>
    <div class="date-range-picker-demo">
      <SuDateRangePicker
        v-model="dateRangeValue"
        clearable
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <SuDateRangePicker
        v-model="limitedDateRangeValue"
        min="2026-06-01"
        max="2026-06-30"
        start-placeholder="开始"
        end-placeholder="结束"
      />
      <SuDateRangePicker
        :model-value="dateRangeValue"
        :disabled-date="disableRangeWeekend"
        start-placeholder="禁用周末"
        end-placeholder="禁用周末"
      />
      <SuDateRangePicker
        size="small"
        :model-value="['2026-06-01', '2026-06-15']"
      />
      <SuDateRangePicker
        size="large"
        :model-value="['2026-06-01', '2026-06-15']"
      />
      <SuDateRangePicker
        status="success"
        :model-value="['2026-06-01', '2026-06-15']"
      />
      <SuDateRangePicker status="warning" start-placeholder="警告状态" />
      <SuDateRangePicker status="error" start-placeholder="错误状态" />
      <SuDateRangePicker disabled start-placeholder="禁用日期范围" />
      <SuDateRangePicker readonly :model-value="['2026-06-01', '2026-06-15']" />
    </div>
  </section>
</template>
<style scoped>
.date-range-picker-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .date-range-picker-demo {
    grid-template-columns: 1fr;
  }
}
</style>
