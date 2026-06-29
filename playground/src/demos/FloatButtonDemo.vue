<script setup lang="ts">
import { ref } from 'vue'

const menuOpen = ref(false)
const lastAction = ref('暂未触发操作')

function recordAction(action: string) {
  lastAction.value = action
}
</script>

<template>
  <section id="float-button" class="panel">
    <h2>浮动按钮</h2>
    <div class="float-button-demo">
      <p class="float-button-demo__intro">
        浮动按钮适合承载跨页面的高频操作，例如新建工单、联系支持或展开一组快捷入口。
      </p>

      <div class="float-button-demo__preview">
        <div class="float-button-demo__header">
          <strong>客户成功工作台</strong>
          <span>右下角展示固定入口，底部工具条展示可展开的快捷操作组。</span>
        </div>

        <div class="float-button-demo__content">
          <article v-for="item in 4" :key="item" class="float-button-demo__card">
            <strong>待跟进客户 {{ item }}</strong>
            <span>客户已提交续费意向，需要在今日完成方案确认和风险备注。</span>
          </article>
        </div>

        <div class="float-button-demo__state">
          <span>最近操作：{{ lastAction }}</span>
          <span>菜单状态：{{ menuOpen ? '已展开' : '已收起' }}</span>
        </div>

        <SuFloatButton
          description="新建"
          type="primary"
          :right="24"
          :bottom="24"
          aria-label="新建客户任务"
          @click="recordAction('新建客户任务')"
        >
          <template #icon>
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </template>
        </SuFloatButton>
      </div>

      <div class="float-button-demo__dock">
        <SuFloatButtonGroup
          v-model:open="menuOpen"
          trigger="click"
          shape="square"
          placement="top"
          :right="24"
          :bottom="24"
          aria-label="展开客户快捷操作"
        >
          <SuFloatButton description="电话" @click="recordAction('拨打客户电话')">
            <template #icon>
              <svg viewBox="0 0 24 24">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.63 2.65a2 2 0 0 1-.45 2.11L8.09 9.67a16 16 0 0 0 6.24 6.24l1.19-1.19a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.65.63A2 2 0 0 1 22 16.92Z"
                />
              </svg>
            </template>
          </SuFloatButton>
          <SuFloatButton description="备注" badge-dot @click="recordAction('补充客户备注')">
            <template #icon>
              <svg viewBox="0 0 24 24">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </template>
          </SuFloatButton>
          <SuFloatButton href="https://example.com" target="_blank" description="帮助" badge="3" />
        </SuFloatButtonGroup>
      </div>
    </div>
  </section>
</template>

<style scoped>
.float-button-demo {
  display: grid;
  gap: 16px;
}

.float-button-demo__intro {
  margin: 0;
  color: var(--su-color-text-muted);
}

.float-button-demo__preview,
.float-button-demo__dock {
  position: relative;
  min-height: 340px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
  overflow: hidden;
}

.float-button-demo__dock {
  min-height: 260px;
}

.float-button-demo__header {
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.float-button-demo__header span,
.float-button-demo__card span,
.float-button-demo__state {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.float-button-demo__content {
  display: grid;
  gap: 10px;
  max-width: 680px;
}

.float-button-demo__card {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.float-button-demo__state {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.float-button-demo__preview :deep(.su-float-button),
.float-button-demo__dock :deep(.su-float-button-group) {
  position: absolute;
}

@media (max-width: 640px) {
  .float-button-demo__preview,
  .float-button-demo__dock {
    min-height: 360px;
  }
}
</style>
