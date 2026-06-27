<script setup lang="ts">
import type { TimelineItem } from '@susu-ui/vue'

const timelineItems: TimelineItem[] = [
  {
    time: '09:00',
    title: '创建发布任务',
    description: '负责人完成标题、摘要和素材录入。',
    type: 'primary',
  },
  {
    time: '10:20',
    title: '内容审核通过',
    description: '审核记录已归档，进入排期阶段。',
    type: 'success',
  },
  {
    time: '11:45',
    title: '等待定时发布',
    description: '系统将在指定时间同步到线上环境。',
    type: 'warning',
    hollow: true,
  },
]

const alternateTimelineItems: TimelineItem[] = [
  {
    time: '周一',
    title: '需求确认',
    description: '确认组件范围和示例内容。',
    type: 'info',
  },
  {
    time: '周三',
    title: '设计走查',
    description: '核对布局、状态和主题变量使用。',
    color: '#7c3aed',
  },
  {
    time: '周五',
    title: '版本发布',
    description: '完成构建检查后发布组件包。',
    type: 'success',
  },
]
</script>

<template>
  <section id="timeline" class="panel">
    <h2>时间轴</h2>
    <div class="timeline-demo">
      <SuTimeline :items="timelineItems" />

      <SuTimeline
        :items="alternateTimelineItems"
        position="alternate"
        size="small"
      >
        <template #dot="{ index }">
          {{ index + 1 }}
        </template>
      </SuTimeline>

      <SuTimeline :items="timelineItems" position="right" reverse hide-tail />
    </div>
  </section>
</template>
<style scoped>
.timeline-demo {
  display: grid;
  max-width: 820px;
  gap: 24px;
}
</style>
