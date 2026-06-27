<script setup lang="ts">
import { ref } from 'vue'

const autoSaveValue = ref(true)
const noticeValue = ref('off')
const loadingSwitchValue = ref(true)
</script>

<template>
  <section id="switch" class="panel">
    <h2>开关</h2>
    <div class="switch-demo">
      <SuSwitch v-model="autoSaveValue" />
      <SuSwitch
        v-model="autoSaveValue"
        active-text="自动保存已开启"
        inactive-text="自动保存已关闭"
      />
      <SuSwitch
        v-model="noticeValue"
        active-value="on"
        inactive-value="off"
        active-text="通知开启"
        inactive-text="通知关闭"
      />
      <SuSwitch size="small" model-value />
      <SuSwitch size="large" model-value active-text="大尺寸" />
      <SuSwitch v-model="loadingSwitchValue" loading active-text="同步中" />
      <SuSwitch disabled inactive-text="禁用状态" />
    </div>
  </section>
</template>
<style scoped>
.switch-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 24px;
}
</style>
