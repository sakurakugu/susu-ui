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

const failedLines = [
  { type: 'command' as const, text: 'pnpm --filter playground build' },
  { type: 'output' as const, text: 'vite v5.4.11 building for production...' },
  { type: 'error' as const, text: 'src/demos/OrderDemo.vue: 找不到导出的组件 SuOrderCard。' },
  { type: 'info' as const, text: '修复导入后重新执行构建。' },
]
</script>

<template>
  <section id="terminal" class="panel">
    <h2>终端</h2>
    <div class="terminal-demo">
      <SuTerminal title="发布检查" status="success" :lines="deployLines" :max-height="260" />

      <SuTerminal title="实时服务日志" status="running" :content="serviceLog" wrap />

      <SuTerminal title="构建失败" status="error" :lines="failedLines" :copyable="false">
        <template #actions>
          <SuTag size="small" type="error">阻塞发布</SuTag>
        </template>
      </SuTerminal>

      <SuTerminal
        title="空闲终端"
        status="idle"
        content="等待执行下一条命令..."
        :show-header="false"
      />
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
