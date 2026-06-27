<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const popoverVisible = ref(false)
</script>

<template>
  <section id="popover" class="panel">
    <h2>气泡卡片</h2>
    <div class="popover-demo">
      <SuPopover title="项目说明" content="这里展示更完整的补充信息。">
        <SuButton type="primary">点击查看</SuButton>
      </SuPopover>
      <SuPopover
        title="悬停触发"
        content="鼠标移入时显示，移出后关闭。"
        trigger="hover"
        placement="top"
      >
        <SuButton variant="outline">悬停查看</SuButton>
      </SuPopover>
      <SuPopover placement="right" width="320px">
        <SuButton variant="text">插槽内容</SuButton>
        <template #title>任务详情</template>
        <template #content>
          <div class="popover-demo-content">
            <p>可以放入说明、状态、按钮或其他组件。</p>
            <SuButton size="small" type="primary" @click="showTopMessage">
              立即处理
            </SuButton>
          </div>
        </template>
      </SuPopover>
      <SuPopover
        v-model:visible="popoverVisible"
        trigger="manual"
        title="受控气泡"
      >
        <SuButton @click="popoverVisible = !popoverVisible">
          受控显示
        </SuButton>
        <template #content> 当前显示状态由外部数据控制。 </template>
      </SuPopover>
      <SuPopover title="禁用气泡" content="禁用时不会展示" disabled>
        <SuButton disabled>禁用状态</SuButton>
      </SuPopover>
    </div>
  </section>
</template>
<style scoped>
.popover-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.popover-demo-content {
  display: grid;
  gap: 12px;
}

.popover-demo-content p {
  margin-top: 0;
}
</style>
