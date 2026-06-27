<script setup lang="ts">
import type { TourStep } from '@susu-ui/vue'
import { ref } from 'vue'

const basicVisible = ref(false)
const basicCurrent = ref(0)
const customVisible = ref(false)

const basicSteps: TourStep[] = [
  {
    title: '查看核心指标',
    description: '这里汇总本周新增客户、续费金额和待跟进商机。',
    target: '#tour-metric',
    placement: 'bottom-start',
  },
  {
    title: '筛选重点客户',
    description: '按负责人、阶段和预计成交时间过滤，快速定位需要处理的客户。',
    target: '#tour-filter',
    placement: 'right',
  },
  {
    title: '导出经营报表',
    description: '完成筛选后可以导出当前视图，发给业务负责人复盘。',
    target: '#tour-export',
    placement: 'top-end',
    finishText: '开始使用',
  },
]

const customSteps: TourStep[] = [
  {
    title: '批量处理提醒',
    description: '当前列表存在 6 条即将超时的审批，可先批量分配给值班同事。',
    target: '#tour-batch',
    placement: 'left',
  },
]

function openBasicTour() {
  basicCurrent.value = 0
  basicVisible.value = true
}
</script>

<template>
  <section id="tour" class="panel">
    <h2>漫游式引导</h2>
    <div class="tour-demo">
      <div class="tour-demo__toolbar">
        <SuButton type="primary" @click="openBasicTour">开启引导</SuButton>
        <SuButton variant="outline" @click="customVisible = true">
          自定义底部
        </SuButton>
      </div>

      <div class="tour-demo__workspace">
        <div id="tour-metric" class="tour-demo__metric">
          <span>本周新增客户</span>
          <strong>128</strong>
          <small>较上周增长 18%</small>
        </div>
        <div class="tour-demo__operations">
          <SuButton id="tour-filter" variant="outline">筛选客户</SuButton>
          <SuButton id="tour-batch">批量分配</SuButton>
          <SuButton id="tour-export" type="primary">导出报表</SuButton>
        </div>
      </div>

      <SuTour
        v-model="basicVisible"
        v-model:current="basicCurrent"
        :steps="basicSteps"
      />

      <SuTour v-model="customVisible" :steps="customSteps" :width="360">
        <template #title="{ step }">
          <span class="tour-demo__custom-title">{{ step.title }}</span>
        </template>
        <template #description="{ step }">
          <p class="tour-demo__custom-description">
            {{ step.description }}
          </p>
        </template>
        <template #footer="{ close }">
          <div class="tour-demo__custom-footer">
            <span>仅提醒一次</span>
            <SuButton size="small" type="primary" @click="close">
              我知道了
            </SuButton>
          </div>
        </template>
      </SuTour>
    </div>
  </section>
</template>

<style scoped>
.tour-demo {
  display: grid;
  max-width: 760px;
  gap: 18px;
}

.tour-demo__toolbar,
.tour-demo__operations {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tour-demo__workspace {
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  background: var(--su-color-bg-soft);
}

.tour-demo__metric {
  display: grid;
  max-width: 260px;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.tour-demo__metric span,
.tour-demo__metric small {
  color: var(--su-color-text-muted);
}

.tour-demo__metric strong {
  color: var(--su-color-text);
  font-size: 28px;
  line-height: 1.2;
}

.tour-demo__custom-title {
  color: var(--su-color-primary);
}

.tour-demo__custom-description {
  margin: 0;
}

.tour-demo__custom-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  color: var(--su-color-text-muted);
}
</style>
