<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const basicDrawerVisible = ref(false)
const filterDrawerVisible = ref(false)
const asyncDrawerVisible = ref(false)
const drawerConfirmLoading = ref(false)

function confirmBasicDrawer() {
  basicDrawerVisible.value = false
  showTopMessage('任务详情已确认')
}

function confirmFilterDrawer() {
  filterDrawerVisible.value = false
  showTopMessage('筛选条件已应用')
}

function confirmAsyncDrawer() {
  drawerConfirmLoading.value = true
  window.setTimeout(() => {
    drawerConfirmLoading.value = false
    asyncDrawerVisible.value = false
    showTopMessage('配置已保存')
  }, 900)
}
</script>

<template>
  <section id="drawer" class="panel">
    <h2>抽屉</h2>
    <div class="drawer-demo">
      <SuButton type="primary" @click="basicDrawerVisible = true"> 基础抽屉 </SuButton>
      <SuButton variant="outline" @click="filterDrawerVisible = true"> 左侧筛选 </SuButton>
      <SuButton @click="asyncDrawerVisible = true">异步保存</SuButton>
    </div>

    <SuDrawer v-model="basicDrawerVisible" title="任务详情" @confirm="confirmBasicDrawer">
      <div class="drawer-demo-content">
        <p>抽屉从页面边缘滑出，适合展示详情、配置项或短流程编辑。</p>
        <SuDescriptions :column="1" border size="small">
          <SuDescriptionsItem label="任务">组件文档补充</SuDescriptionsItem>
          <SuDescriptionsItem label="负责人">苏苏</SuDescriptionsItem>
          <SuDescriptionsItem label="状态">
            <SuTag size="small" type="primary">处理中</SuTag>
          </SuDescriptionsItem>
        </SuDescriptions>
      </div>
    </SuDrawer>

    <SuDrawer
      v-model="filterDrawerVisible"
      title="筛选条件"
      placement="left"
      size="360px"
      :show-footer="false"
    >
      <div class="drawer-demo-content">
        <SuForm label-position="top">
          <SuFormItem label="关键词">
            <SuInput placeholder="请输入关键词" />
          </SuFormItem>
          <SuFormItem label="状态">
            <SuSelect placeholder="请选择状态">
              <SuOption value="enabled" label="启用" />
              <SuOption value="disabled" label="停用" />
            </SuSelect>
          </SuFormItem>
        </SuForm>
      </div>
      <template #footer>
        <SuButton @click="filterDrawerVisible = false">重置</SuButton>
        <SuButton type="primary" @click="confirmFilterDrawer"> 应用筛选 </SuButton>
      </template>
    </SuDrawer>

    <SuDrawer
      v-model="asyncDrawerVisible"
      title="保存配置"
      placement="bottom"
      size="42vh"
      confirm-text="保存"
      :confirm-loading="drawerConfirmLoading"
      :close-on-click-mask="false"
      @confirm="confirmAsyncDrawer"
    >
      保存过程中会保持抽屉打开，并在确认按钮上展示加载状态。
    </SuDrawer>
  </section>
</template>
<style scoped>
.drawer-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.drawer-demo-content {
  display: grid;
  gap: 16px;
}

.drawer-demo-content p {
  margin-top: 0;
}
</style>
