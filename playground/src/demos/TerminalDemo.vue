<script setup lang="ts">
const deployLines = [
  { type: 'command' as const, text: 'pnpm check' },
  { type: 'output' as const, text: 'packages/tokens build passed' },
  { type: 'output' as const, text: 'packages/theme build passed' },
  { type: 'output' as const, text: 'packages/vue typecheck passed' },
  { type: 'success' as const, text: '全部检查通过，准备发布预览包。' },
]

const serviceLog = `[20:16:08] queue.worker started
[20:16:12] invoice SO-20260628-1048 synchronized
[20:16:19] payment callback verified
[20:16:22] notification delivered to finance group`
</script>

<template>
  <section id="terminal" class="panel">
    <h2>终端</h2>
    <div class="terminal-demo">
      <SuTerminal title="发布检查" status="success" :lines="deployLines" :max-height="260" />

      <SuTerminal title="实时服务日志" status="running" :content="serviceLog" wrap />
    </div>
  </section>
</template>

<style scoped>
.terminal-demo {
  display: grid;
  max-width: 780px;
  gap: 16px;
}
</style>
