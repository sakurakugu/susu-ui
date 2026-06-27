<script setup lang="ts">
import { ref } from 'vue'

const timeValue = ref('09:30:00')
const shortTimeValue = ref('18:00')
const limitedTimeValue = ref('')

function disableLunchTime(time: {
  hour: number
  minute: number
  second: number
}) {
  return time.hour === 12
}
</script>

<template>
  <section id="time-picker" class="panel">
    <h2>时间选择器</h2>
    <div class="time-picker-demo">
      <SuTimePicker v-model="timeValue" clearable placeholder="请选择时间" />
      <SuTimePicker
        v-model="shortTimeValue"
        format="HH:mm"
        :minute-step="15"
        placeholder="选择小时和分钟"
      />
      <SuTimePicker
        v-model="limitedTimeValue"
        min="09:00:00"
        max="18:00:00"
        placeholder="限制在工作时间"
      />
      <SuTimePicker
        :model-value="timeValue"
        :disabled-time="disableLunchTime"
        placeholder="禁用 12 点"
      />
      <SuTimePicker size="small" model-value="09:30:00" />
      <SuTimePicker size="large" model-value="09:30:00" />
      <SuTimePicker status="success" model-value="09:30:00" />
      <SuTimePicker status="warning" placeholder="警告状态" />
      <SuTimePicker status="error" placeholder="错误状态" />
      <SuTimePicker disabled placeholder="禁用时间选择器" />
      <SuTimePicker readonly model-value="09:30:00" />
    </div>
  </section>
</template>
<style scoped>
.time-picker-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .time-picker-demo {
    grid-template-columns: 1fr;
  }
}
</style>
