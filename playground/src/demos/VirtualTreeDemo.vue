<script setup lang="ts">
import { ref } from 'vue'

const selectedKey = ref<string | number>('dept-2-team-3-user-8')
const expandedKeys = ref<(string | number)[]>(['company', 'dept-2', 'dept-2-team-3'])
const checkedKeys = ref<(string | number)[]>([
  'permission-project-read',
  'permission-project-export',
])

const organizationData = [
  {
    key: 'company',
    label: '星河科技集团',
    children: Array.from({ length: 24 }, (_, deptIndex) => ({
      key: `dept-${deptIndex + 1}`,
      label: `业务部门 ${deptIndex + 1}`,
      children: Array.from({ length: 8 }, (_, teamIndex) => ({
        key: `dept-${deptIndex + 1}-team-${teamIndex + 1}`,
        label: `项目小组 ${teamIndex + 1}`,
        children: Array.from({ length: 16 }, (_, userIndex) => ({
          key: `dept-${deptIndex + 1}-team-${teamIndex + 1}-user-${userIndex + 1}`,
          label: `成员 ${deptIndex + 1}-${teamIndex + 1}-${userIndex + 1}`,
          disabled: userIndex === 13,
        })),
      })),
    })),
  },
]

const permissionData = [
  {
    key: 'permission-project',
    label: '项目管理',
    children: [
      { key: 'permission-project-read', label: '查看项目' },
      { key: 'permission-project-edit', label: '编辑项目' },
      { key: 'permission-project-export', label: '导出项目报表' },
    ],
  },
  {
    key: 'permission-finance',
    label: '财务数据',
    children: [
      { key: 'permission-finance-read', label: '查看回款' },
      { key: 'permission-finance-approve', label: '审批折扣', disabled: true },
      { key: 'permission-finance-export', label: '导出对账单' },
    ],
  },
]
</script>

<template>
  <section id="virtual-tree" class="panel">
    <h2>虚拟树</h2>
    <div class="virtual-tree-demo">
      <SuVirtualTree
        v-model:selected-key="selectedKey"
        v-model:expanded-keys="expandedKeys"
        :data="organizationData"
        :height="360"
        :item-height="34"
        :buffer="6"
      >
        <template #default="{ node }">
          <span class="virtual-tree-demo__node">
            <span>{{ node.label }}</span>
            <SuTag v-if="node.level === 2" size="small" type="primary" variant="outline">
              部门
            </SuTag>
            <SuTag v-if="node.disabled" size="small" type="info">停用</SuTag>
          </span>
        </template>
      </SuVirtualTree>

      <div class="virtual-tree-demo__side">
        <SuVirtualTree
          v-model:checked-keys="checkedKeys"
          :data="permissionData"
          :height="220"
          :item-height="34"
          checkable
          default-expand-all
        />

        <SuVirtualTree :data="[]" :height="120" empty-text="暂无目录">
          <template #empty>当前项目还没有同步组织目录</template>
        </SuVirtualTree>
      </div>
    </div>
  </section>
</template>

<style scoped>
.virtual-tree-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 16px;
}

.virtual-tree-demo__side {
  display: grid;
  align-content: start;
  gap: 16px;
}

.virtual-tree-demo__node {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

.virtual-tree-demo__node > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .virtual-tree-demo {
    grid-template-columns: 1fr;
  }
}
</style>
