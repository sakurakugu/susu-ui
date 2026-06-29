<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="tag" class="panel">
    <h2>标签</h2>
    <div class="tag-demo">
      <SuTag>默认标签</SuTag>
      <SuTag type="primary">主要标签</SuTag>
      <SuTag type="success">成功</SuTag>
      <SuTag type="warning">警告</SuTag>
      <SuTag type="error">错误</SuTag>
      <SuTag type="info">信息</SuTag>
      <SuTag type="primary" variant="outline">描边标签</SuTag>
      <SuTag type="success" variant="solid">实心标签</SuTag>
      <SuTag size="small">小标签</SuTag>
      <SuTag size="large" round>大圆角标签</SuTag>
      <SuTag closable @close="showTopMessage('标签已关闭')">可关闭</SuTag>
      <SuTag closable disabled>禁用关闭</SuTag>
      <SuTag type="primary">
        <template #prefix>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path
                d="M12 3l2.7 5.47 6.03.88-4.37 4.26 1.03 6.01L12 16.78l-5.39 2.84 1.03-6.01-4.37-4.26 6.03-.88L12 3z"
              />
            </svg>
          </SuIcon>
        </template>
        带图标
      </SuTag>
    </div>
  </section>
</template>
<style scoped>
.tag-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
