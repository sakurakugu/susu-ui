<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const imageCover =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%231677ff'/%3E%3Cstop offset='.58' stop-color='%2316a34a'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='200' rx='20' fill='url(%23g)'/%3E%3Ccircle cx='72' cy='68' r='34' fill='white' fill-opacity='.86'/%3E%3Cpath d='M0 168l76-62 52 42 45-34 96 74H0z' fill='white' fill-opacity='.76'/%3E%3Cpath d='M202 52h72M202 78h52M202 104h38' stroke='white' stroke-width='12' stroke-linecap='round' stroke-opacity='.86'/%3E%3C/svg%3E"

function handleImagePreview() {
  showTopMessage('已打开图片预览')
}
</script>

<template>
  <section id="image" class="panel">
    <h2>图片</h2>
    <div class="image-demo">
      <SuImage
        :src="imageCover"
        alt="组件封面"
        :width="240"
        :height="150"
        preview
        @preview="handleImagePreview"
      />
      <SuImage
        :src="imageCover"
        alt="等比展示"
        :width="160"
        :height="150"
        fit="contain"
        radius="12px"
      />
      <SuImage
        src="/missing-image.png"
        alt="加载失败示例"
        :width="160"
        :height="150"
        fallback-text="暂无图片"
      />
      <SuImage :src="imageCover" alt="自定义占位" :width="160" :height="150" loading="lazy">
        <template #placeholder>
          <span class="image-demo-placeholder">加载中</span>
        </template>
      </SuImage>
    </div>
  </section>
</template>
<style scoped>
.image-demo {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
}

.image-demo-placeholder {
  color: var(--su-color-text-muted);
}
</style>
