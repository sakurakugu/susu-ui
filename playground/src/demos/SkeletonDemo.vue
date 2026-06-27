<template>
  <section id="skeleton" class="panel">
    <h2>骨架屏</h2>
    <div class="skeleton-demo">
      <div class="skeleton-demo-card">
        <SuSkeleton variant="rect" height="132px" />
        <SuSkeleton width="68%" />
        <SuSkeleton :rows="3" />
      </div>
      <div class="skeleton-demo-profile">
        <SuSkeleton variant="circle" :width="48" :height="48" />
        <div class="skeleton-demo-lines">
          <SuSkeleton width="40%" />
          <SuSkeleton :rows="2" />
        </div>
      </div>
      <div class="skeleton-demo-card">
        <SuSkeleton variant="rect" height="32px" round />
        <SuSkeleton :rows="4" :animated="false" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.skeleton-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.skeleton-demo-card,
.skeleton-demo-profile {
  min-height: 180px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.skeleton-demo-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skeleton-demo-profile {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.skeleton-demo-lines {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

@media (max-width: 640px) {
  .skeleton-demo {
    grid-template-columns: 1fr;
  }
}
</style>
