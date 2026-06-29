<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="result" class="panel">
    <h2>结果</h2>
    <div class="result-demo">
      <SuResult
        status="success"
        title="发布成功"
        description="内容已经同步到线上环境，可以继续查看详情或返回列表。"
      >
        <template #footer>
          <SuButton type="primary" @click="showTopMessage('发布详情已打开')"> 查看详情 </SuButton>
          <SuButton @click="showTopMessage('已返回发布列表')">返回列表</SuButton>
        </template>
      </SuResult>

      <SuResult
        status="warning"
        title="需要补充信息"
        description="发布前请确认权限范围、附件内容和审批人信息。"
      />

      <SuResult status="error" icon-size="64px">
        <template #icon>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 3 2 21h20L12 3Z" />
              <path d="M12 9v5M12 17h.01" />
            </svg>
          </SuIcon>
        </template>
        <template #title>提交失败</template>
        服务暂时不可用，请稍后重试或联系管理员处理。
      </SuResult>
    </div>
  </section>
</template>
<style scoped>
.result-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.result-demo :deep(.su-result) {
  min-height: 280px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
}

.result-demo :deep(.su-icon) {
  width: 64px;
  height: 64px;
}

.result-demo :deep(.su-icon svg) {
  width: 100%;
  height: 100%;
  stroke: currentcolor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  fill: none;
}

@media (max-width: 640px) {
  .result-demo {
    grid-template-columns: 1fr;
  }
}
</style>
