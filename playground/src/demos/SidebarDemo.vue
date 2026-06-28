<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
const filterCollapsed = ref(false)

const navItems = ['总览', '客户线索', '商机推进', '合同回款', '团队目标']
const filterGroups = [
  { label: '负责人', value: '华东销售一组' },
  { label: '客户等级', value: '重点客户' },
  { label: '预计成交', value: '本季度' },
]
</script>

<template>
  <section id="sidebar" class="panel">
    <h2>侧栏</h2>
    <div class="sidebar-demo">
      <div class="sidebar-demo__workspace">
        <SuSidebar
          v-model:collapsed="collapsed"
          title="销售工作台"
          collapsible
          :width="240"
          :collapsed-width="72"
        >
          <template #default="{ collapsed: isCollapsed }">
            <nav class="sidebar-demo__nav" aria-label="销售工作台导航">
              <button
                v-for="item in navItems"
                :key="item"
                class="sidebar-demo__nav-item"
                type="button"
              >
                <span class="sidebar-demo__nav-mark">
                  {{ item.slice(0, 1) }}
                </span>
                <span v-if="!isCollapsed">{{ item }}</span>
              </button>
            </nav>
          </template>
          <template #footer="{ collapsed: isCollapsed }">
            <div class="sidebar-demo__account">
              <span class="sidebar-demo__avatar">许</span>
              <span v-if="!isCollapsed">许明 · 销售经理</span>
            </div>
          </template>
          <template #trigger="{ collapsed: isCollapsed }">
            {{ isCollapsed ? '展开' : '收起' }}
          </template>
        </SuSidebar>

        <main class="sidebar-demo__main">
          <div class="sidebar-demo__toolbar">
            <strong>客户推进看板</strong>
            <SuButton size="small" type="primary">新建商机</SuButton>
          </div>
          <div class="sidebar-demo__cards">
            <SuCard title="今日重点" shadow="never">
              <p>跟进 8 个高意向客户，其中 3 个需要更新报价方案。</p>
            </SuCard>
            <SuCard title="风险提醒" shadow="never">
              <p>华南区域有 2 个合同超过计划回款时间，需要本周复盘。</p>
            </SuCard>
          </div>
        </main>
      </div>

      <div class="sidebar-demo__workspace sidebar-demo__workspace--right">
        <main class="sidebar-demo__main">
          <div class="sidebar-demo__toolbar">
            <strong>线索列表</strong>
            <SuTag type="success">已筛选</SuTag>
          </div>
          <ul class="sidebar-demo__leads">
            <li>青禾科技 · 采购系统升级</li>
            <li>锦川物流 · 运输调度平台</li>
            <li>远策咨询 · 数据看板续费</li>
          </ul>
        </main>

        <SuSidebar
          v-model:collapsed="filterCollapsed"
          placement="right"
          title="筛选条件"
          shadow="always"
          sticky
          collapsible
          :width="280"
          :collapsed-width="80"
        >
          <template #default="{ collapsed: isCollapsed }">
            <div class="sidebar-demo__filters">
              <div v-for="group in filterGroups" :key="group.label" class="sidebar-demo__filter">
                <span>{{ isCollapsed ? group.label.slice(0, 2) : group.label }}</span>
                <strong v-if="!isCollapsed">{{ group.value }}</strong>
              </div>
            </div>
          </template>
          <template #footer="{ collapsed: isCollapsed }">
            <SuButton size="small" type="primary">
              {{ isCollapsed ? '查' : '查询' }}
            </SuButton>
            <SuButton v-if="!isCollapsed" size="small">重置</SuButton>
          </template>
        </SuSidebar>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sidebar-demo {
  display: grid;
  gap: var(--su-space-lg);
}

.sidebar-demo__workspace {
  display: flex;
  min-height: 360px;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  background: var(--su-color-bg-soft);
}

.sidebar-demo__workspace--right {
  min-height: 320px;
}

.sidebar-demo__main {
  flex: 1;
  min-width: 0;
  padding: var(--su-space-lg);
}

.sidebar-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  margin-bottom: var(--su-space-lg);
}

.sidebar-demo__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--su-space-md);
}

.sidebar-demo__nav,
.sidebar-demo__filters {
  display: grid;
  gap: var(--su-space-sm);
}

.sidebar-demo__nav-item {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  width: 100%;
  min-height: 36px;
  padding: 0 var(--su-space-sm);
  border: 0;
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.sidebar-demo__nav-item:hover,
.sidebar-demo__nav-item:focus-visible {
  outline: 0;
  background: var(--su-color-bg-soft);
}

.sidebar-demo__nav-mark,
.sidebar-demo__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary) 12%, transparent);
  font-size: var(--su-font-size-sm);
  font-weight: 600;
}

.sidebar-demo__account {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  min-width: 0;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  white-space: nowrap;
}

.sidebar-demo__filters {
  align-content: start;
}

.sidebar-demo__filter {
  display: grid;
  gap: 4px;
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.sidebar-demo__filter span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.sidebar-demo__filter strong {
  color: var(--su-color-text);
  font-weight: 600;
}

.sidebar-demo__leads {
  display: grid;
  gap: var(--su-space-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-demo__leads li {
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.sidebar-demo :deep(.su-card__body p) {
  margin: 0;
  color: var(--su-color-text-muted);
}

@media (max-width: 720px) {
  .sidebar-demo__workspace {
    min-height: 420px;
  }

  .sidebar-demo__cards {
    grid-template-columns: 1fr;
  }
}
</style>
