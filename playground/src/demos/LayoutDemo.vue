<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)

const menuItems = ['工作台', '项目', '团队', '资源', '设置']
const metrics = [
  { label: '本周上线', value: '12' },
  { label: '待处理风险', value: '4' },
  { label: '成员负载', value: '78%' },
]
</script>

<template>
  <section id="layout" class="panel">
    <h2>布局</h2>
    <div class="layout-demo">
      <SuLayout class="layout-demo__basic">
        <SuHeader class="layout-demo__header">
          <strong>产品运营中心</strong>
          <SuTag type="success">在线</SuTag>
        </SuHeader>
        <SuContent class="layout-demo__content">
          <SuSpace direction="vertical" fill>
            <SuCard title="今日概览" shadow="never">
              <div class="layout-demo__metrics">
                <div
                  v-for="metric in metrics"
                  :key="metric.label"
                  class="layout-demo__metric"
                >
                  <span>{{ metric.label }}</span>
                  <strong>{{ metric.value }}</strong>
                </div>
              </div>
            </SuCard>
            <SuAlert
              title="发布窗口将在 18:00 关闭，请优先处理阻塞项。"
              type="warning"
            />
          </SuSpace>
        </SuContent>
        <SuFooter class="layout-demo__footer" height="44px">
          最近同步：10:24
        </SuFooter>
      </SuLayout>

      <SuLayout class="layout-demo__with-sider">
        <SuSider
          v-model:collapsed="collapsed"
          theme="dark"
          collapsible
          :width="220"
          :collapsed-width="76"
        >
          <template #default="{ collapsed: isCollapsed }">
            <div class="layout-demo__brand">
              {{ isCollapsed ? '运' : '运营后台' }}
            </div>
            <nav class="layout-demo__menu" aria-label="后台导航">
              <button
                v-for="item in menuItems"
                :key="item"
                class="layout-demo__menu-item"
                type="button"
              >
                {{ isCollapsed ? item.slice(0, 1) : item }}
              </button>
            </nav>
          </template>
          <template #trigger="{ collapsed: isCollapsed }">
            {{ isCollapsed ? '展开导航' : '收起导航' }}
          </template>
        </SuSider>
        <SuLayout>
          <SuHeader class="layout-demo__header">
            <strong>项目排期</strong>
            <SuButton size="small" type="primary">新建任务</SuButton>
          </SuHeader>
          <SuContent class="layout-demo__content">
            <div class="layout-demo__board">
              <SuCard title="需求评审" shadow="never">
                <p>会员续费链路梳理完成，等待产品确认验收范围。</p>
              </SuCard>
              <SuCard title="视觉走查" shadow="never">
                <p>移动端列表密度调整完成，今晚进入联调。</p>
              </SuCard>
            </div>
          </SuContent>
        </SuLayout>
      </SuLayout>
    </div>
  </section>
</template>

<style scoped>
.layout-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.layout-demo__basic,
.layout-demo__with-sider {
  min-height: 360px;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
}

.layout-demo__with-sider {
  min-height: 420px;
}

.layout-demo__header {
  justify-content: space-between;
  gap: var(--su-space-md);
}

.layout-demo__content {
  background: var(--su-color-bg-soft);
}

.layout-demo__footer {
  justify-content: center;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.layout-demo__metrics,
.layout-demo__board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.layout-demo__board {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.layout-demo__metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.layout-demo__metric span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.layout-demo__metric strong {
  color: var(--su-color-text);
  font-size: 24px;
}

.layout-demo__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: 0 var(--su-space-md);
  border-bottom: 1px solid color-mix(in srgb, #ffffff 16%, transparent);
  font-weight: 700;
  white-space: nowrap;
}

.layout-demo__menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: var(--su-space-md);
}

.layout-demo__menu-item {
  width: 100%;
  min-height: 36px;
  padding: 0 var(--su-space-md);
  border: 0;
  border-radius: var(--su-radius-md);
  color: inherit;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.layout-demo__menu-item:hover,
.layout-demo__menu-item:focus-visible {
  outline: 0;
  background: color-mix(in srgb, #ffffff 12%, transparent);
}

.layout-demo :deep(.su-card__body p) {
  margin: 0;
  color: var(--su-color-text-muted);
}

@media (max-width: 720px) {
  .layout-demo__metrics,
  .layout-demo__board {
    grid-template-columns: 1fr;
  }
}
</style>
