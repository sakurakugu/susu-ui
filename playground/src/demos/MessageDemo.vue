<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="message" class="panel">
    <h2>消息</h2>
    <div class="message-demo">
      <SuButton type="primary" @click="showTopMessage"> 显示顶部消息 </SuButton>
      <span>点击后消息会固定在页面顶部，并于 3 秒后自动消失</span>
    </div>
  </section>
</template>
<style scoped>
.message-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.message-demo span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
}
</style>
