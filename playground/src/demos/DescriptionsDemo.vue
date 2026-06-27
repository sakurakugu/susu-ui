<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()
</script>

<template>
  <section id="descriptions" class="panel">
    <h2>描述列表</h2>
    <div class="descriptions-demo">
      <SuDescriptions title="用户信息">
        <SuDescriptionsItem label="用户名">苏苏</SuDescriptionsItem>
        <SuDescriptionsItem label="角色">设计师</SuDescriptionsItem>
        <SuDescriptionsItem label="团队">体验组</SuDescriptionsItem>
        <SuDescriptionsItem label="状态">
          <SuTag size="small" type="success">在线</SuTag>
        </SuDescriptionsItem>
        <SuDescriptionsItem label="邮箱" :span="2">
          susu@example.com
        </SuDescriptionsItem>
      </SuDescriptions>

      <SuDescriptions title="项目信息" :column="2" border label-width="88px">
        <template #extra>
          <SuButton size="small" variant="text" @click="showTopMessage">
            编辑
          </SuButton>
        </template>
        <SuDescriptionsItem label="项目">Susu UI</SuDescriptionsItem>
        <SuDescriptionsItem label="版本">0.1.0</SuDescriptionsItem>
        <SuDescriptionsItem label="状态">
          <SuTag size="small" type="primary">开发中</SuTag>
        </SuDescriptionsItem>
        <SuDescriptionsItem label="负责人">青禾</SuDescriptionsItem>
        <SuDescriptionsItem label="备注" :span="2">
          适合展示详情页、用户资料、订单信息和只读表单内容。
        </SuDescriptionsItem>
      </SuDescriptions>

      <SuDescriptions
        size="small"
        layout="vertical"
        :column="3"
        border
        :colon="false"
      >
        <SuDescriptionsItem label="创建时间"> 2026-06-27 </SuDescriptionsItem>
        <SuDescriptionsItem label="更新时间"> 2026-06-27 </SuDescriptionsItem>
        <SuDescriptionsItem label="发布状态">草稿</SuDescriptionsItem>
      </SuDescriptions>
    </div>
  </section>
</template>
<style scoped>
.descriptions-demo {
  display: grid;
  max-width: 920px;
  gap: 18px;
}
</style>
