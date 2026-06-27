<script setup lang="ts">
import { ref } from 'vue'

const selectedMenuKey = ref<string | number>('overview')
const openMenuKeys = ref<(string | number)[]>(['components'])

const menuItems = [
  { key: 'overview', label: '概览' },
  {
    key: 'components',
    label: '组件',
    children: [
      { key: 'button-menu', label: 'Button 按钮' },
      { key: 'menu-menu', label: 'Menu 菜单' },
      { key: 'table-menu', label: 'Table 表格', disabled: true },
    ],
  },
  {
    key: 'resources',
    label: '资源',
    children: [
      { key: 'guide-menu', label: '指南' },
      { key: 'theme-menu', label: '主题' },
    ],
  },
  { key: 'divider-menu', label: '分割项', divided: true },
]
</script>

<template>
  <section id="menu" class="panel">
    <h2>菜单</h2>
    <div class="menu-demo">
      <SuMenu
        v-model:selected-key="selectedMenuKey"
        v-model:open-keys="openMenuKeys"
        :items="menuItems"
      />

      <SuMenu :items="menuItems" mode="horizontal" selected-key="overview" />

      <SuMenu :items="menuItems" default-open-all size="small" accordion>
        <template #default="{ item }">
          <span class="menu-demo-node">
            <span>{{ item.label }}</span>
            <SuTag
              v-if="item.disabled"
              size="small"
              type="info"
              variant="outline"
            >
              禁用
            </SuTag>
          </span>
        </template>
      </SuMenu>
    </div>
  </section>
</template>
<style scoped>
.menu-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.menu-demo :deep(.su-menu) {
  min-height: 260px;
  padding: 12px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.menu-demo :deep(.su-menu--horizontal) {
  min-height: auto;
  grid-column: span 2;
}

.menu-demo-node {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
}

@media (max-width: 640px) {
  .menu-demo {
    grid-template-columns: 1fr;
  }

  .menu-demo :deep(.su-menu--horizontal) {
    grid-column: auto;
  }
}
</style>
