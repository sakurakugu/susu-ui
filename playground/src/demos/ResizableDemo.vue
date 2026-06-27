<script setup lang="ts">
import { ref } from 'vue'

const chartSize = ref({
  width: 420,
  height: 240,
})
const sidebarWidth = ref(260)
const noteHeight = ref(180)
</script>

<template>
  <section id="resizable" class="panel">
    <h2>可调整尺寸</h2>
    <div class="resizable-demo">
      <SuResizable
        v-model="chartSize"
        :min-width="280"
        :min-height="180"
        :max-width="680"
        :max-height="360"
        :step="8"
      >
        <div class="report-card">
          <div>
            <strong>销售看板</strong>
            <span>本周成交 128 单，客单价保持稳定。</span>
          </div>
          <div class="chart-bars" aria-hidden="true">
            <span style="height: 42%" />
            <span style="height: 68%" />
            <span style="height: 54%" />
            <span style="height: 82%" />
            <span style="height: 61%" />
          </div>
        </div>
      </SuResizable>

      <SuResizable
        v-model="sidebarWidth"
        direction="horizontal"
        :min-width="180"
        :max-width="420"
        :height="190"
      >
        <div class="workspace-panel">
          <strong>客户分组</strong>
          <span>高意向客户</span>
          <span>待复访客户</span>
          <span>合同审批中</span>
        </div>
      </SuResizable>

      <SuResizable
        v-model="noteHeight"
        direction="vertical"
        :width="420"
        :min-height="120"
        :max-height="280"
      >
        <div class="workspace-panel">
          <strong>会议纪要</strong>
          <p>确认新版报价策略，法务在周三前完成合同模板复核。</p>
        </div>
      </SuResizable>

      <SuResizable :width="280" :height="140" disabled>
        <div class="workspace-panel">
          <strong>归档卡片</strong>
          <span>禁用状态不响应拖拽和键盘调整。</span>
        </div>
      </SuResizable>
    </div>
  </section>
</template>

<style scoped>
.resizable-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, max-content));
  align-items: start;
  gap: var(--su-space-lg);
}

.report-card,
.workspace-panel {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: var(--su-space-lg);
}

.report-card {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--su-space-lg);
}

.report-card strong,
.workspace-panel strong {
  display: block;
  margin-bottom: var(--su-space-sm);
  color: var(--su-color-text);
}

.report-card span,
.workspace-panel span,
.workspace-panel p {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: var(--su-space-sm);
  min-height: 100px;
  padding: var(--su-space-md);
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-soft);
}

.chart-bars span {
  flex: 1;
  min-width: 18px;
  border-radius: var(--su-radius-sm) var(--su-radius-sm) 0 0;
  background: var(--su-color-primary);
}

.workspace-panel {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-sm);
}
</style>
