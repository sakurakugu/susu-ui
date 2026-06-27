<script setup lang="ts">
import { ref } from 'vue'

const containerRef = ref<HTMLElement>()
const visible = ref(false)
</script>

<template>
  <section id="back-top" class="panel">
    <h2>回到顶部</h2>
    <div class="back-top-demo">
      <p class="back-top-demo__intro">
        长表单或运营配置页滚动较深时，回到顶部按钮会在右下角出现，帮助用户快速返回关键筛选区。
      </p>

      <div ref="containerRef" class="back-top-demo__viewport">
        <div class="back-top-demo__toolbar">
          <strong>商家素材审核</strong>
          <span>共 36 条待处理内容，向下滚动查看容器内返回顶部效果。</span>
        </div>

        <div class="back-top-demo__list">
          <article v-for="item in 12" :key="item" class="back-top-demo__item">
            <div>
              <strong>素材任务 {{ item }}</strong>
              <span>运营同学已补充投放说明，等待品牌负责人复核。</span>
            </div>
            <SuTag :type="item % 3 === 0 ? 'success' : 'default'">
              {{ item % 3 === 0 ? '已确认' : '待复核' }}
            </SuTag>
          </article>
        </div>

        <SuBackTop
          :target="() => containerRef"
          :visibility-height="160"
          :right="24"
          :bottom="24"
          @change="visible = $event"
        />
      </div>

      <div class="back-top-demo__custom">
        <span>当前容器按钮状态：{{ visible ? '已显示' : '未显示' }}</span>
        <SuBackTop :visibility-height="360" :right="32" :bottom="88">
          <span class="back-top-demo__custom-button">顶部</span>
        </SuBackTop>
      </div>
    </div>
  </section>
</template>

<style scoped>
.back-top-demo {
  display: grid;
  gap: 16px;
}

.back-top-demo__intro {
  margin: 0;
  color: var(--su-color-text-muted);
}

.back-top-demo__viewport {
  position: relative;
  max-height: 320px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
  overflow: auto;
}

.back-top-demo__toolbar {
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.back-top-demo__toolbar span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.back-top-demo__list {
  display: grid;
  gap: 10px;
  padding-bottom: 240px;
}

.back-top-demo__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.back-top-demo__item strong,
.back-top-demo__item span {
  display: block;
}

.back-top-demo__item span {
  margin-top: 4px;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.back-top-demo__custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.back-top-demo__custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--su-radius-round);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
  font-size: var(--su-font-size-sm);
  font-weight: 600;
}

@media (max-width: 640px) {
  .back-top-demo__item,
  .back-top-demo__custom {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
