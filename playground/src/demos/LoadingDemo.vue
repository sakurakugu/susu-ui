<template>
  <section id="loading" class="panel">
    <h2>加载</h2>
    <div class="loading-demo">
      <div class="loading-demo-inline">
        <SuLoading size="small" text="加载中" />
        <SuLoading text="正在同步" />
        <SuLoading size="large">提交数据</SuLoading>
      </div>
      <div class="loading-demo-box">
        <p>当前区域正在刷新数据，遮罩会覆盖容器内容。</p>
        <SuLoading overlay blur text="加载内容" />
      </div>
      <div class="loading-demo-box">
        <p>关闭 loading 后不会渲染加载元素。</p>
        <SuLoading :loading="false" text="不会显示" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.loading-demo {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.loading-demo-inline,
.loading-demo-box {
  min-height: 160px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.loading-demo-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.loading-demo-box {
  position: relative;
}

.loading-demo-box p {
  margin-top: 0;
}

@media (max-width: 640px) {
  .loading-demo {
    grid-template-columns: 1fr;
  }
}
</style>
