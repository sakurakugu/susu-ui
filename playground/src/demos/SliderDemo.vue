<script setup lang="ts">
import { ref } from 'vue'

const sliderValue = ref(36)
const volumeValue = ref(60)
const rangeSliderValue = ref<[number, number]>([20, 68])
const temperatureValue = ref(24)

function formatPercent(value: number) {
  return `${value}%`
}

function formatTemperature(value: number) {
  return `${value}°C`
}
</script>

<template>
  <section id="slider" class="panel">
    <h2>滑块</h2>
    <div class="slider-demo">
      <SuSlider v-model="sliderValue" />
      <SuSlider
        v-model="volumeValue"
        :step="10"
        show-stops
        :marks="{ 0: '静音', 50: '适中', 100: '最大' }"
        :format-tooltip="formatPercent"
      />
      <SuSlider v-model="rangeSliderValue" range />
      <SuSlider
        v-model="temperatureValue"
        :min="16"
        :max="32"
        :step="0.5"
        size="large"
        :format-tooltip="formatTemperature"
      />
      <SuSlider :model-value="30" size="small" readonly />
      <SuSlider :model-value="42" disabled />
    </div>
  </section>
</template>
<style scoped>
.slider-demo {
  display: grid;
  max-width: 760px;
  gap: 22px;
}
</style>
