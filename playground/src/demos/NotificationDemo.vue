<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showNotification } = usePlaygroundDemoContext()
</script>

<template>
  <section id="notification" class="panel">
    <h2>通知</h2>
    <div class="notification-demo">
      <SuButton type="primary" @click="showNotification('top-right')">
        右上通知
      </SuButton>
      <SuButton variant="outline" @click="showNotification('bottom-left')">
        左下通知
      </SuButton>
      <span>通知用于承载标题和描述，适合较完整的系统反馈</span>
    </div>
  </section>
</template>
<style scoped>
.notification-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.notification-demo span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
}
</style>
