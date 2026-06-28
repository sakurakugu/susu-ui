<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
const activeTab = ref('overview')

const breadcrumbItems = [
  { label: '工作台', href: '#' },
  { label: '销售项目', href: '#' },
  { label: '客户增长计划' },
]

const compactBreadcrumbItems = [{ label: '订单中心', href: '#' }, { label: '售后详情' }]
</script>

<template>
  <section id="page-header" class="panel">
    <h2>页头</h2>
    <div class="page-header-demo">
      <SuPageHeader
        title="客户增长计划"
        subtitle="统一查看线索来源、跟进节奏和本周转化目标，帮助销售团队对齐优先级。"
        :breadcrumb="breadcrumbItems"
      >
        <template #tags>
          <SuTag type="success">进行中</SuTag>
          <SuTag type="primary" variant="outline">重点项目</SuTag>
        </template>

        <template #extra>
          <SuButton variant="outline" @click="showTopMessage">导出</SuButton>
          <SuButton type="primary" @click="showTopMessage">新建跟进</SuButton>
        </template>

        <div class="page-header-demo__metrics">
          <span>
            <strong>128</strong>
            本月新增线索
          </span>
          <span>
            <strong>42%</strong>
            商机转化率
          </span>
          <span>
            <strong>18</strong>
            待处理任务
          </span>
        </div>

        <template #footer>
          <SuTabs v-model="activeTab" size="small">
            <SuTabPane label="概览" name="overview" />
            <SuTabPane label="跟进记录" name="records" />
            <SuTabPane label="协作成员" name="members" />
          </SuTabs>
        </template>
      </SuPageHeader>

      <SuPageHeader
        title="售后工单 #A2481"
        subtitle="客户反馈设备离线，需要确认最近一次维护记录。"
        :breadcrumb="compactBreadcrumbItems"
        show-back
        size="small"
        ghost
        @back="showTopMessage"
      >
        <template #extra>
          <SuButton size="small" variant="outline" @click="showTopMessage"> 转交 </SuButton>
          <SuButton size="small" type="primary" @click="showTopMessage"> 完成处理 </SuButton>
        </template>
      </SuPageHeader>
    </div>
  </section>
</template>

<style scoped>
.page-header-demo {
  display: grid;
  gap: 16px;
}

.page-header-demo__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.page-header-demo__metrics span {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  padding: 12px;
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-soft);
}

.page-header-demo__metrics strong {
  color: var(--su-color-text);
  font-size: 22px;
  line-height: 1.2;
}

@media (max-width: 640px) {
  .page-header-demo__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
