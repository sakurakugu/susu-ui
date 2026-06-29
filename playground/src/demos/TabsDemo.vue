<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const tabsValue = ref('overview')
</script>

<template>
  <section id="tabs" class="panel">
    <h2>标签页</h2>
    <div class="tabs-demo">
      <SuTabs v-model="tabsValue">
        <SuTabPane label="概览" name="overview">
          <div class="tabs-demo-panel">
            <strong>项目概览</strong>
            <p>当前版本聚焦基础组件、主题能力和文档体验。</p>
          </div>
        </SuTabPane>
        <SuTabPane label="成员" name="members">
          <div class="tabs-demo-panel">
            <strong>成员协作</strong>
            <p>可以把表格、描述列表或表单放入标签页面板中。</p>
          </div>
        </SuTabPane>
        <SuTabPane label="审计" name="audit" disabled>
          禁用标签页不会响应点击和键盘切换。
        </SuTabPane>
        <template #extra>
          <SuButton size="small" variant="text" @click="showTopMessage('成员新增入口已打开')">
            新增
          </SuButton>
        </template>
      </SuTabs>

      <SuTabs type="card" size="small" placement="left" model-value="basic">
        <SuTabPane label="基础信息" name="basic">
          <div class="tabs-demo-panel">
            <strong>基础信息</strong>
            <p>卡片样式适合配置页、详情页和分组表单。</p>
          </div>
        </SuTabPane>
        <SuTabPane name="permission">
          <template #label>权限</template>
          <div class="tabs-demo-panel">
            <strong>权限配置</strong>
            <p>标签标题支持插槽，便于加入徽标、图标或自定义结构。</p>
          </div>
        </SuTabPane>
      </SuTabs>
    </div>
  </section>
</template>
<style scoped>
.tabs-demo {
  display: grid;
  max-width: 760px;
  gap: 18px;
}

.tabs-demo-panel {
  padding: 12px 0;
}

.tabs-demo-panel strong {
  display: block;
  margin-bottom: 6px;
}

.tabs-demo-panel p {
  margin-top: 0;
}
</style>
