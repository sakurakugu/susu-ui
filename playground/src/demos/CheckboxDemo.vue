<script setup lang="ts">
import { ref } from 'vue'

const agreementValue = ref(false)
const featureValue = ref('disabled')
const indeterminateValue = ref(false)
const notificationChannels = ref(['email', 'sms'])
const permissionScopes = ref(['read'])
const reportMetrics = ref(['sales'])
</script>

<template>
  <section id="checkbox" class="panel">
    <h2>复选框</h2>
    <div class="checkbox-demo">
      <SuCheckbox v-model="agreementValue">同意服务协议</SuCheckbox>
      <SuCheckbox v-model="featureValue" true-value="enabled" false-value="disabled">
        启用高级功能
      </SuCheckbox>
      <SuCheckbox v-model="indeterminateValue" indeterminate> 部分选中 </SuCheckbox>
      <SuCheckbox size="small" model-value>小尺寸</SuCheckbox>
      <SuCheckbox size="large" model-value>大尺寸</SuCheckbox>
      <SuCheckbox disabled>禁用状态</SuCheckbox>
    </div>

    <div class="checkbox-demo__groups">
      <SuCheckboxGroup v-model="notificationChannels" name="notice">
        <SuCheckbox value="email">邮件通知</SuCheckbox>
        <SuCheckbox value="sms">短信提醒</SuCheckbox>
        <SuCheckbox value="webhook">Webhook 推送</SuCheckbox>
      </SuCheckboxGroup>

      <SuCheckboxGroup v-model="permissionScopes" direction="vertical" size="small">
        <SuCheckbox value="read">查看客户资料</SuCheckbox>
        <SuCheckbox value="export">导出报表</SuCheckbox>
        <SuCheckbox value="approve" disabled>审批退款</SuCheckbox>
      </SuCheckboxGroup>

      <SuCheckboxGroup v-model="reportMetrics" :max="2">
        <SuCheckbox value="sales">销售额</SuCheckbox>
        <SuCheckbox value="conversion">转化率</SuCheckbox>
        <SuCheckbox value="retention">留存率</SuCheckbox>
      </SuCheckboxGroup>
    </div>
  </section>
</template>
<style scoped>
.checkbox-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 24px;
}

.checkbox-demo__groups {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px 32px;
  margin-top: 20px;
}
</style>
