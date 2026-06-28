<script setup lang="ts">
import { ref } from 'vue'

const uploadProgress = ref(45)

function formatUploadProgress(value: number) {
  return `上传 ${value}%`
}
</script>

<template>
  <section id="progress" class="panel">
    <h2>进度条</h2>
    <div class="progress-demo">
      <SuProgress :percentage="36" />
      <SuProgress :percentage="100" status="success" />
      <SuProgress :percentage="64" status="warning" />
      <SuProgress :percentage="28" status="error" />
      <SuProgress
        :percentage="uploadProgress"
        text-inside
        :stroke-width="18"
        :format="formatUploadProgress"
      />
      <SuProgress indeterminate :show-text="false" />
      <div class="progress-demo-circles">
        <SuProgress type="circle" :percentage="72" />
        <SuProgress type="circle" :percentage="100" status="success" />
        <SuProgress type="circle" :percentage="42" status="error" :width="96" :stroke-width="6" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.progress-demo {
  display: grid;
  max-width: 760px;
  gap: 16px;
}

.progress-demo-circles {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
