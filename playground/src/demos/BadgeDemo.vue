<template>
  <section id="badge" class="panel">
    <h2>角标</h2>
    <div class="badge-demo">
      <SuBadge :value="8">
        <SuButton>消息</SuButton>
      </SuBadge>
      <SuBadge :value="120" :max="99">
        <SuButton>待办</SuButton>
      </SuBadge>
      <SuBadge dot>
        <SuAvatar text="苏" />
      </SuBadge>
      <SuBadge value="新" type="primary">
        <SuButton variant="outline">版本</SuButton>
      </SuBadge>
      <SuBadge :value="0" show-zero type="info">
        <SuButton>归档</SuButton>
      </SuBadge>
      <SuBadge value="热" type="warning" position="bottom-right">
        <SuTag type="warning" variant="outline">活动</SuTag>
      </SuBadge>
      <SuBadge value="离线" type="info" size="small" />
      <SuBadge dot type="success" />
    </div>
  </section>
</template>
<style scoped>
.badge-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
