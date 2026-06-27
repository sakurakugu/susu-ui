<script setup lang="ts">
import { ref } from 'vue'

const dateValue = ref('2026-06-27')
const limitedDateValue = ref('')

function disableWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<template>
  <section id="date-picker" class="panel">
    <h2>日期选择器</h2>
    <div class="date-picker-demo">
      <SuDatePicker v-model="dateValue" clearable placeholder="请选择日期" />
      <SuDatePicker
        v-model="limitedDateValue"
        min="2026-06-01"
        max="2026-06-30"
        placeholder="限制在 2026 年 6 月"
      />
      <SuDatePicker
        :model-value="dateValue"
        :disabled-date="disableWeekend"
        placeholder="禁用周末"
      />
      <SuDatePicker size="small" model-value="2026-06-27" />
      <SuDatePicker size="large" model-value="2026-06-27" />
      <SuDatePicker status="success" model-value="2026-06-27" />
      <SuDatePicker status="warning" placeholder="警告状态" />
      <SuDatePicker status="error" placeholder="错误状态" />
      <SuDatePicker disabled placeholder="禁用日期选择器" />
      <SuDatePicker readonly model-value="2026-06-27" />
    </div>
  </section>
</template>
<style scoped>
.date-picker-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .date-picker-demo {
    grid-template-columns: 1fr;
  }
}
</style>
