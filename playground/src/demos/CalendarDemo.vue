<script setup lang="ts">
import { ref } from 'vue'

const calendarValue = ref('2026-06-27')
const limitedCalendarValue = ref('')

function disableWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<template>
  <section id="calendar" class="panel">
    <h2>日历</h2>
    <div class="calendar-demo">
      <SuCalendar v-model="calendarValue" />
      <SuCalendar
        v-model="limitedCalendarValue"
        min="2026-06-01"
        max="2026-06-30"
        :disabled-date="disableWeekend"
        :show-adjacent-months="false"
      />
      <SuCalendar size="small" model-value="2026-06-15" />
      <SuCalendar size="large" model-value="2026-06-15" readonly />
      <SuCalendar model-value="2026-06-15" :show-today="false" disabled />
    </div>
  </section>
</template>
<style scoped>
.calendar-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(2, max-content);
  gap: 16px;
}

@media (max-width: 640px) {
  .calendar-demo {
    grid-template-columns: 1fr;
  }
}
</style>
