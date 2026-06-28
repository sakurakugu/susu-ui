<script setup lang="ts">
import { ref } from 'vue'

const timeRangeValue = ref<[string, string]>(['09:00:00', '18:00:00'])
const shortTimeRangeValue = ref<[string, string]>(['09:30', '17:30'])
const limitedTimeRangeValue = ref<[string, string]>(['', ''])

function disableRangeLunchTime(time: { hour: number; minute: number; second: number }) {
  return time.hour === 12
}
</script>

<template>
  <section id="time-range-picker" class="panel">
    <h2>时间范围选择器</h2>
    <div class="time-range-picker-demo">
      <SuTimeRangePicker
        v-model="timeRangeValue"
        clearable
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
      <SuTimeRangePicker
        v-model="shortTimeRangeValue"
        format="HH:mm"
        :minute-step="30"
        start-placeholder="开始"
        end-placeholder="结束"
      />
      <SuTimeRangePicker
        v-model="limitedTimeRangeValue"
        min="09:00:00"
        max="18:00:00"
        start-placeholder="工作开始"
        end-placeholder="工作结束"
      />
      <SuTimeRangePicker
        :model-value="timeRangeValue"
        :disabled-time="disableRangeLunchTime"
        start-placeholder="禁用 12 点"
        end-placeholder="禁用 12 点"
      />
      <SuTimeRangePicker size="small" :model-value="['09:00:00', '18:00:00']" />
      <SuTimeRangePicker size="large" :model-value="['09:00:00', '18:00:00']" />
      <SuTimeRangePicker status="success" :model-value="['09:00:00', '18:00:00']" />
      <SuTimeRangePicker status="warning" start-placeholder="警告状态" />
      <SuTimeRangePicker status="error" start-placeholder="错误状态" />
      <SuTimeRangePicker disabled start-placeholder="禁用时间范围" />
      <SuTimeRangePicker readonly :model-value="['09:00:00', '18:00:00']" />
    </div>
  </section>
</template>
<style scoped>
.time-range-picker-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .time-range-picker-demo {
    grid-template-columns: 1fr;
  }
}
</style>
