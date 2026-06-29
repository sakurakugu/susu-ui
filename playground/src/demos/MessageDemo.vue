<script setup lang="ts">
import { SuMessage, type MessagePlacement } from '@susu-ui/vue'

const placements: Array<{ label: string; value: MessagePlacement }> = [
  { label: '左上', value: 'top-left' },
  { label: '顶部', value: 'top' },
  { label: '右上', value: 'top-right' },
  { label: '左下', value: 'bottom-left' },
  { label: '底部', value: 'bottom' },
  { label: '右下', value: 'bottom-right' },
]

function showBasicMessage() {
  SuMessage('客户资料已更新')
}

function showSuccessMessage() {
  SuMessage.success('保存成功，审批流已同步')
}

function showPlacementMessage(placement: MessagePlacement) {
  SuMessage.success({
    content: `消息展示在${placements.find((item) => item.value === placement)?.label}`,
    placement,
  })
}

function showWithoutClose() {
  SuMessage.warning({
    content: '库存低于安全线，请及时补货',
    closable: false,
  })
}

function showRepeatedMessage() {
  SuMessage.error('接口请求失败，请稍后重试')
}

function showUnmergedMessage() {
  SuMessage.info({
    content: '这条消息不会合并',
    merge: false,
  })
}
</script>

<template>
  <section id="message" class="panel">
    <h2>消息</h2>

    <div class="message-demo">
      <div class="message-demo__group">
        <h3>命令式调用</h3>
        <div class="message-demo__actions">
          <SuButton type="primary" @click="showBasicMessage">基础消息</SuButton>
          <SuButton type="success" @click="showSuccessMessage">成功消息</SuButton>
          <SuButton type="warning" @click="showWithoutClose">无关闭按钮</SuButton>
        </div>
      </div>

      <div class="message-demo__group">
        <h3>展示位置</h3>
        <div class="message-demo__actions">
          <SuButton
            v-for="placement in placements"
            :key="placement.value"
            variant="outline"
            @click="showPlacementMessage(placement.value)"
          >
            {{ placement.label }}
          </SuButton>
        </div>
      </div>

      <div class="message-demo__group">
        <h3>合并相同内容</h3>
        <div class="message-demo__actions">
          <SuButton type="error" @click="showRepeatedMessage">重复错误消息</SuButton>
          <SuButton variant="outline" @click="showUnmergedMessage">不合并消息</SuButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.message-demo {
  display: grid;
  gap: 20px;
}

.message-demo__group {
  display: grid;
  gap: 12px;
}

.message-demo__group h3 {
  margin: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  font-weight: 600;
}

.message-demo__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
