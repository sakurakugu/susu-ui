<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const basicDialogVisible = ref(false)
const customDialogVisible = ref(false)
const asyncDialogVisible = ref(false)
const dialogConfirmLoading = ref(false)

function confirmBasicDialog() {
  basicDialogVisible.value = false
  showTopMessage()
}

function confirmCustomDialog() {
  customDialogVisible.value = false
  showTopMessage()
}

function confirmAsyncDialog() {
  dialogConfirmLoading.value = true
  window.setTimeout(() => {
    dialogConfirmLoading.value = false
    asyncDialogVisible.value = false
    showTopMessage()
  }, 900)
}
</script>

<template>
  <section id="dialog" class="panel">
    <h2>对话框</h2>
    <div class="dialog-demo">
      <SuButton type="primary" @click="basicDialogVisible = true">
        基础对话框
      </SuButton>
      <SuButton variant="outline" @click="customDialogVisible = true">
        自定义页脚
      </SuButton>
      <SuButton @click="asyncDialogVisible = true">异步确认</SuButton>
    </div>

    <SuDialog
      v-model="basicDialogVisible"
      title="确认发布"
      @confirm="confirmBasicDialog"
    >
      发布后内容会同步到线上环境，请确认当前配置已经完成校验。
    </SuDialog>

    <SuDialog
      v-model="customDialogVisible"
      title="编辑说明"
      width="640px"
      :show-footer="false"
    >
      <p class="dialog-demo-description">
        对话框支持自定义底部区域，适合放置更多业务操作。
      </p>
      <template #footer>
        <SuButton @click="customDialogVisible = false">稍后处理</SuButton>
        <SuButton variant="outline" @click="customDialogVisible = false">
          仅保存草稿
        </SuButton>
        <SuButton type="primary" @click="confirmCustomDialog">
          保存并提交
        </SuButton>
      </template>
    </SuDialog>

    <SuDialog
      v-model="asyncDialogVisible"
      title="删除成员"
      confirm-text="确认删除"
      :confirm-loading="dialogConfirmLoading"
      :close-on-click-mask="false"
      @confirm="confirmAsyncDialog"
    >
      当前操作需要服务端确认，确认过程中会保持弹窗打开并展示加载状态。
    </SuDialog>
  </section>
</template>
<style scoped>
.dialog-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.dialog-demo-description {
  margin-top: 0;
}
</style>
