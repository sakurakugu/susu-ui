<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const controlledVisible = ref(false)
const confirming = ref(false)

function handleArchive() {
  showTopMessage('项目已归档')
}

function handleAsyncConfirm() {
  confirming.value = true

  window.setTimeout(() => {
    confirming.value = false
    controlledVisible.value = false
    showTopMessage('付款审批已提交')
  }, 1200)
}
</script>

<template>
  <section id="popconfirm" class="panel">
    <h2>气泡确认框</h2>
    <div class="popconfirm-demo">
      <SuPopconfirm
        title="确认归档这个项目？"
        description="归档后项目会从当前工作台移除，可在归档列表中恢复。"
        @confirm="handleArchive"
      >
        <SuButton type="primary">归档项目</SuButton>
      </SuPopconfirm>

      <SuPopconfirm
        title="确认删除客户资料？"
        description="删除后将同步移除关联的跟进记录。"
        confirm-text="删除"
        cancel-text="再想想"
        placement="bottom"
      >
        <SuButton variant="outline">删除资料</SuButton>
      </SuPopconfirm>

      <SuPopconfirm
        v-model:visible="controlledVisible"
        title="确认提交审批？"
        description="系统会通知财务负责人处理这笔付款申请。"
        :confirm-loading="confirming"
        :hide-after-confirm="false"
        placement="right"
        @confirm="handleAsyncConfirm"
      >
        <SuButton @click="controlledVisible = true">提交审批</SuButton>
      </SuPopconfirm>

      <SuPopconfirm placement="top-start" width="320px">
        <SuButton variant="text">自定义内容</SuButton>
        <template #icon>?</template>
        <template #title>需要通知项目成员吗？</template>
        <template #description> 启用后，系统会向项目群发送变更说明和新的交付时间。 </template>
        <template #actions>
          <SuButton size="small" variant="text">仅保存</SuButton>
          <SuButton size="small" type="primary" @click="showTopMessage('项目成员已通知')">
            保存并通知
          </SuButton>
        </template>
      </SuPopconfirm>

      <SuPopconfirm title="禁用确认" description="禁用时不会打开浮层" disabled>
        <SuButton disabled>禁用状态</SuButton>
      </SuPopconfirm>
    </div>
  </section>
</template>

<style scoped>
.popconfirm-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
