<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="empty" class="panel">
    <h2>空状态</h2>
    <div class="empty-demo">
      <SuEmpty />
      <SuEmpty description="没有搜索结果">
        <template #footer>
          <SuButton type="primary" @click="showTopMessage('筛选条件已清空')"> 清空筛选 </SuButton>
        </template>
      </SuEmpty>
      <SuEmpty image-size="72px">
        暂未添加成员
        <template #image>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </SuIcon>
        </template>
      </SuEmpty>
    </div>
  </section>
</template>
<style scoped>
.empty-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.empty-demo :deep(.su-empty) {
  min-height: 220px;
  border: 1px dashed var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.empty-demo :deep(.su-icon) {
  width: 72px;
  height: 72px;
  color: var(--su-color-text-muted);
}

.empty-demo :deep(.su-icon svg) {
  width: 100%;
  height: 100%;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  fill: none;
  opacity: 0.72;
}

@media (max-width: 640px) {
  .empty-demo {
    grid-template-columns: 1fr;
  }
}
</style>
