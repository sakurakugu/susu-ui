<script setup lang="ts">
import type { StepsItem } from '@susu-ui/vue'
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const stepsCurrent = ref(1)

const publishSteps: StepsItem[] = [
  { title: '填写信息', description: '录入标题、分类和基础说明' },
  { title: '确认内容', description: '检查附件、权限和发布范围' },
  { title: '提交发布', description: '等待系统完成发布流程' },
]

const reviewSteps: StepsItem[] = [
  { title: '创建草稿', description: '内容已保存为草稿' },
  {
    title: '内容审核',
    description: '字段缺失，需要补充说明',
    status: 'error',
  },
  { title: '重新提交', description: '修正后再次进入审核' },
]

const simpleSteps: StepsItem[] = [
  { title: '草稿', value: 'draft' },
  { title: '审核', value: 'review' },
  { title: '发布', value: 'publish' },
]

function handleStepChange(value: string | number) {
  stepsCurrent.value = Number(value)
  showTopMessage()
}
</script>

<template>
  <section id="steps" class="panel">
    <h2>步骤条</h2>
    <div class="steps-demo">
      <SuSteps :items="publishSteps" :current="stepsCurrent" clickable @change="handleStepChange" />

      <SuSteps :items="reviewSteps" :current="1" direction="vertical" status="error" />

      <SuSteps :items="simpleSteps" current="review" size="small" simple />
    </div>
  </section>
</template>
<style scoped>
.steps-demo {
  display: grid;
  max-width: 820px;
  gap: 24px;
}

.steps-demo :deep(.su-steps--vertical) {
  max-width: 420px;
}
</style>
