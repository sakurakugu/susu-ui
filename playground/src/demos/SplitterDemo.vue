<script setup lang="ts">
import { ref } from 'vue'

const mailPaneSize = ref(280)
const editorPaneSize = ref(180)
</script>

<template>
  <section id="splitter" class="panel">
    <h2>分割面板</h2>
    <div class="splitter-demo">
      <SuSplitter v-model="mailPaneSize" :min="200" :max="460" :step="8" class="mail-splitter">
        <template #first>
          <div class="mail-list">
            <strong>收件箱</strong>
            <button class="mail-item" type="button">
              <span>合同确认</span>
              <small>客户已确认付款节点</small>
            </button>
            <button class="mail-item" type="button">
              <span>排期更新</span>
              <small>研发同步本周发布窗口</small>
            </button>
            <button class="mail-item" type="button">
              <span>费用审批</span>
              <small>市场活动预算待复核</small>
            </button>
          </div>
        </template>
        <template #second>
          <article class="mail-detail">
            <h3>合同确认</h3>
            <p>客户已确认第三季度采购合同，当前需要补充交付验收附件。</p>
            <p>建议今天下班前同步法务和财务，避免影响下周一盖章。</p>
          </article>
        </template>
      </SuSplitter>

      <SuSplitter
        v-model="editorPaneSize"
        direction="vertical"
        :min="120"
        :max="260"
        class="editor-splitter"
      >
        <template #first>
          <div class="code-pane">
            <strong>查询条件</strong>
            <code>status = "待处理" AND owner = "华东团队"</code>
          </div>
        </template>
        <template #second>
          <div class="code-pane">
            <strong>结果预览</strong>
            <span>共匹配 42 条商机，预计金额 186 万。</span>
          </div>
        </template>
      </SuSplitter>
    </div>
  </section>
</template>

<style scoped>
.splitter-demo {
  display: grid;
  gap: var(--su-space-lg);
}

.mail-splitter {
  height: 360px;
}

.editor-splitter {
  height: 360px;
}

.mail-list,
.mail-detail,
.code-pane {
  box-sizing: border-box;
  height: 100%;
  padding: var(--su-space-lg);
}

.mail-list {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-sm);
  background: var(--su-color-bg-soft);
}

.mail-list strong,
.code-pane strong {
  margin-bottom: var(--su-space-sm);
}

.mail-item {
  display: grid;
  gap: 4px;
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font: inherit;
  text-align: left;
}

.mail-item small,
.mail-detail p,
.code-pane span {
  color: var(--su-color-text-muted);
}

.mail-detail h3 {
  margin: 0 0 var(--su-space-md);
}

.mail-detail p {
  max-width: 56ch;
}

.code-pane {
  display: grid;
  align-content: start;
  gap: var(--su-space-md);
}

.code-pane code {
  display: block;
  padding: var(--su-space-md);
  overflow: auto;
  border-radius: var(--su-radius-sm);
  color: var(--su-color-text);
  background: var(--su-color-bg-soft);
}
</style>
