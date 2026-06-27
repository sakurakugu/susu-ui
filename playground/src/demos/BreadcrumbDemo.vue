<script setup lang="ts">
const breadcrumbItems = [
  { label: '首页', href: '#' },
  { label: '组件', href: '#' },
  { label: 'Breadcrumb 面包屑' },
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
</style>
