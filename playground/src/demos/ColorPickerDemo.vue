<script setup lang="ts">
import { ref } from 'vue'

const colorValue = ref('#1677ff')
const alphaColorValue = ref('rgba(22, 119, 255, 0.64)')
</script>

<template>
  <section id="color-picker" class="panel">
    <h2>颜色选择器</h2>
    <div class="color-picker-demo">
      <SuColorPicker v-model="colorValue" clearable placeholder="请选择颜色" />
      <SuColorPicker
        v-model="alphaColorValue"
        show-alpha
        format="rgb"
        placeholder="支持透明度"
      />
      <SuColorPicker size="small" model-value="#52c41a" />
      <SuColorPicker size="large" model-value="#faad14" />
      <SuColorPicker status="success" model-value="#52c41a" />
      <SuColorPicker status="warning" placeholder="警告状态" />
      <SuColorPicker status="error" placeholder="错误状态" />
      <SuColorPicker disabled placeholder="禁用颜色选择器" />
      <SuColorPicker readonly model-value="#722ed1" />
    </div>
  </section>
</template>
<style scoped>
.color-picker-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .color-picker-demo {
    grid-template-columns: 1fr;
  }
}
</style>
