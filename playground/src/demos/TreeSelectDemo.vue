<script setup lang="ts">
import { ref } from 'vue'

const ownerTeam = ref<string | number>('frontend')
const approvalScope = ref<string | number>()

const teamData = [
  {
    label: '产品研发中心',
    value: 'product-center',
    children: [
      { label: '前端平台组', value: 'frontend' },
      { label: '设计系统组', value: 'design-system' },
      { label: '质量保障组', value: 'qa' },
    ],
  },
  {
    label: '商业增长中心',
    value: 'growth-center',
    children: [
      { label: '活动运营组', value: 'campaign' },
      { label: '客户成功组', value: 'success' },
      { label: '数据分析组', value: 'analytics', disabled: true },
    ],
  },
]

const permissionData = [
  {
    label: '项目权限',
    value: 'project',
    children: [
      { label: '需求看板', value: 'requirements' },
      { label: '发布配置', value: 'release-config' },
    ],
  },
  {
    label: '财务权限',
    value: 'finance',
    children: [
      { label: '预算审批', value: 'budget' },
      { label: '合同归档', value: 'contract' },
    ],
  },
]
</script>

<template>
  <section id="tree-select" class="panel">
    <h2>树选择</h2>
    <div class="tree-select-demo">
      <SuTreeSelect
        v-model="ownerTeam"
        :data="teamData"
        placeholder="选择负责团队"
        clearable
        default-expand-all
      />

      <SuTreeSelect
        v-model="approvalScope"
        :data="permissionData"
        placeholder="选择审批范围"
        searchable
        clearable
      />

      <SuTreeSelect
        :data="teamData"
        :model-value="'design-system'"
        status="success"
        default-expand-all
      >
        <template #node="{ node }">
          <span class="tree-select-demo-node">
            <span>{{ node.label }}</span>
            <SuTag
              v-if="node.disabled"
              size="small"
              type="info"
              variant="outline"
            >
              暂停
            </SuTag>
          </span>
        </template>
      </SuTreeSelect>

      <SuTreeSelect :data="teamData" placeholder="禁用树选择" disabled />
    </div>
  </section>
</template>

<style scoped>
.tree-select-demo {
  display: grid;
  max-width: 760px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.tree-select-demo-node {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

@media (max-width: 640px) {
  .tree-select-demo {
    grid-template-columns: 1fr;
  }
}
</style>
