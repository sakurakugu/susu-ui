<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="space" class="panel">
    <h2>间距</h2>
    <div class="space-demo">
      <SuSpace>
        <SuButton>取消</SuButton>
        <SuButton type="primary">保存</SuButton>
        <SuButton variant="outline">更多</SuButton>
      </SuSpace>

      <SuSpace :size="[16, 8]" wrap>
        <SuTag>需求</SuTag>
        <SuTag type="primary">设计</SuTag>
        <SuTag type="success">开发</SuTag>
        <SuTag type="warning">联调</SuTag>
        <SuTag type="info">发布</SuTag>
      </SuSpace>

      <SuSpace separator="/" inline>
        <span>首页</span>
        <span>组件</span>
        <span>Space 间距</span>
      </SuSpace>

      <SuSpace direction="vertical" size="small" fill>
        <SuCard title="纵向间距" padding="small" shadow="never">
          <p>用于表单项、列表块或说明内容之间的稳定间隔。</p>
        </SuCard>
        <SuSpace align="center" justify="between" fill>
          <span>当前状态：已发布</span>
          <SuButton size="small" type="primary" @click="showTopMessage"> 更新 </SuButton>
        </SuSpace>
      </SuSpace>
    </div>
  </section>
</template>
<style scoped>
.space-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.space-demo :deep(.su-card__body p) {
  margin-top: 0;
}
</style>
