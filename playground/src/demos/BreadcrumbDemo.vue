<script setup lang="ts">
const breadcrumbItems = [
  { label: '首页', href: '#' },
  { label: '组件', href: '#' },
  { label: 'Breadcrumb 面包屑' },
]

const disabledBreadcrumbItems = [
  { label: '工作台' },
  { label: '销售中心', disabled: true },
  { label: '客户详情' },
]
</script>

<template>
  <section id="breadcrumb" class="panel">
    <h2>面包屑</h2>
    <div class="breadcrumb-demo">
      <SuBreadcrumb :items="breadcrumbItems" />
      <SuBreadcrumb :items="breadcrumbItems" separator=">">
        <template #item="{ item, isLast }">
          <span :class="{ 'breadcrumb-demo-current': isLast }">
            {{ item.label }}
          </span>
        </template>
      </SuBreadcrumb>
      <SuBreadcrumb :items="disabledBreadcrumbItems">
        <template #separator>
          <span class="breadcrumb-demo-separator">›</span>
        </template>
      </SuBreadcrumb>
    </div>
  </section>
</template>
<style scoped>
.breadcrumb-demo {
  display: grid;
  gap: 14px;
}

.breadcrumb-demo-current {
  color: var(--su-color-primary);
}

.breadcrumb-demo-separator {
  color: var(--su-color-primary);
  font-weight: 600;
}
</style>
