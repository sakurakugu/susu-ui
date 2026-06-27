<script setup lang="ts">
import { ref } from 'vue'

const containerRef = ref<HTMLElement>()
const fixed = ref(false)
</script>

<template>
  <section id="affix" class="panel">
    <h2>固钉</h2>
    <div class="affix-demo">
      <div class="affix-demo__main">
        <p class="affix-demo__intro">
          审批流列表向下滚动时，批量操作会吸附在视口顶部，方便持续处理当前筛选结果。
        </p>
        <SuAffix :offset-top="80" @change="fixed = $event">
          <div class="affix-demo__toolbar" :class="{ 'is-fixed': fixed }">
            <div>
              <strong>采购审批</strong>
              <span>已选择 12 条申请</span>
            </div>
            <div class="affix-demo__actions">
              <SuButton variant="outline">退回修改</SuButton>
              <SuButton type="primary">批量通过</SuButton>
            </div>
          </div>
        </SuAffix>
        <div class="affix-demo__list">
          <div v-for="item in 6" :key="item" class="affix-demo__row">
            <strong>办公设备采购单 {{ item }}</strong>
            <span>预算中心已完成初审，等待部门负责人确认。</span>
          </div>
        </div>
      </div>

      <div ref="containerRef" class="affix-demo__scroll">
        <div class="affix-demo__spacer">滚动容器内的内容顶部</div>
        <SuAffix :target="() => containerRef" :offset-top="12">
          <SuButton type="primary">同步库存状态</SuButton>
        </SuAffix>
        <div class="affix-demo__spacer">继续滚动查看容器吸附效果</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.affix-demo {
  display: grid;
  gap: 20px;
}

.affix-demo__main {
  display: grid;
  gap: 14px;
}

.affix-demo__intro {
  margin-top: 0;
}

.affix-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
}

.affix-demo__toolbar.is-fixed {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-md);
}

.affix-demo__toolbar strong,
.affix-demo__toolbar span {
  display: block;
}

.affix-demo__toolbar span {
  margin-top: 2px;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.affix-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.affix-demo__list {
  display: grid;
  gap: 10px;
}

.affix-demo__row {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.affix-demo__row span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.affix-demo__scroll {
  max-height: 220px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
  overflow: auto;
}

.affix-demo__spacer {
  display: flex;
  align-items: center;
  min-height: 180px;
  color: var(--su-color-text-muted);
}

@media (max-width: 640px) {
  .affix-demo__toolbar {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
