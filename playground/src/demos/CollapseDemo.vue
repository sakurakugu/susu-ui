<script setup lang="ts">
import { ref } from 'vue'

const collapseValue = ref<(string | number)[]>(['overview'])
const accordionValue = ref<string | number>('basic')
</script>

<template>
  <section id="collapse" class="panel">
    <h2>折叠面板</h2>
    <div class="collapse-demo">
      <SuCollapse v-model="collapseValue">
        <SuCollapseItem title="项目概览" name="overview">
          <p>当前版本聚焦基础组件、主题能力和文档体验。</p>
        </SuCollapseItem>
        <SuCollapseItem name="task">
          <template #title>任务进度</template>
          <template #extra>
            <SuTag size="small" type="primary">68%</SuTag>
          </template>
          <p>本周目标完成率稳步提升，待处理项集中在组件文档补充。</p>
        </SuCollapseItem>
        <SuCollapseItem title="审计记录" name="audit" disabled>
          <p>禁用面板不会响应点击和键盘切换。</p>
        </SuCollapseItem>
      </SuCollapse>

      <SuCollapse
        v-model="accordionValue"
        accordion
        ghost
        size="small"
        destroy-inactive-panel
      >
        <SuCollapseItem title="基础信息" name="basic">
          <p>手风琴模式同一时间只展开一个面板。</p>
        </SuCollapseItem>
        <SuCollapseItem title="权限配置" name="permission">
          <p>幽灵样式适合放在详情页或配置页的轻量分组中。</p>
        </SuCollapseItem>
      </SuCollapse>
    </div>
  </section>
</template>
<style scoped>
.collapse-demo {
  display: grid;
  max-width: 760px;
  gap: 16px;
}

.collapse-demo p {
  margin-top: 0;
}
</style>
