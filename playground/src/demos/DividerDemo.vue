<template>
  <section id="divider" class="panel">
    <h2>分割线</h2>
    <div class="divider-demo">
      <p>基础内容区域</p>
      <SuDivider />
      <p>下一段内容区域</p>
      <SuDivider content-position="left">基础信息</SuDivider>
      <SuDivider dashed>虚线分割</SuDivider>
      <div class="inline-divider-demo">
        <span>详情</span>
        <SuDivider direction="vertical" />
        <span>编辑</span>
        <SuDivider direction="vertical" dashed />
        <span>删除</span>
      </div>
    </div>
  </section>
</template>
<style scoped>
.divider-demo {
  display: flex;
  flex-direction: column;
}

.inline-divider-demo {
  display: flex;
  align-items: center;
  color: var(--su-color-text-muted);
}
</style>
