<script setup lang="ts">
import { ref } from 'vue'

const selectedTreeKey = ref<string | number>('components')
const expandedTreeKeys = ref<(string | number)[]>(['docs', 'packages'])
const checkedTreeKeys = ref<(string | number)[]>(['button'])

const treeData = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'guide', label: '指南' },
      { key: 'theme', label: '主题' },
      { key: 'components', label: '组件' },
    ],
  },
  {
    key: 'packages',
    label: '包',
    children: [
      {
        key: 'vue',
        label: '@susu-ui/vue',
        children: [
          { key: 'button', label: 'Button 按钮' },
          { key: 'tree', label: 'Tree 树' },
          { key: 'table', label: 'Table 表格', disabled: true },
        ],
      },
      { key: 'theme-package', label: '@susu-ui/theme' },
    ],
  },
]
</script>

<template>
  <section id="tree" class="panel">
    <h2>树</h2>
    <div class="tree-demo">
      <SuTree
        v-model:selected-key="selectedTreeKey"
        v-model:expanded-keys="expandedTreeKeys"
        :data="treeData"
      />

      <SuTree
        v-model:checked-keys="checkedTreeKeys"
        :data="treeData"
        checkable
        default-expand-all
      />

      <SuTree :data="treeData" default-expand-all size="small">
        <template #default="{ node }">
          <span class="tree-demo-node">
            <span>{{ node.label }}</span>
            <SuTag v-if="node.disabled" size="small" type="info" variant="outline"> 禁用 </SuTag>
          </span>
        </template>
      </SuTree>
    </div>
  </section>
</template>
<style scoped>
.tree-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.tree-demo :deep(.su-tree) {
  min-height: 260px;
  padding: 12px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.tree-demo-node {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

@media (max-width: 640px) {
  .tree-demo {
    grid-template-columns: 1fr;
  }
}
</style>
