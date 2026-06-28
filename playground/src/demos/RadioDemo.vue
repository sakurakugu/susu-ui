<script setup lang="ts">
import { ref } from 'vue'

const planValue = ref('weekly')
const channelValue = ref('email')
</script>

<template>
  <section id="radio" class="panel">
    <h2>单选框</h2>
    <div class="radio-demo">
      <SuRadioGroup v-model="planValue" name="plan">
        <SuRadioButton value="daily">每日</SuRadioButton>
        <SuRadioButton value="weekly">每周</SuRadioButton>
        <SuRadioButton value="monthly">每月</SuRadioButton>
      </SuRadioGroup>
      <SuRadioGroup v-model="channelValue" direction="vertical" size="small">
        <SuRadioButton value="email">邮件通知</SuRadioButton>
        <SuRadioButton value="sms">短信通知</SuRadioButton>
        <SuRadioButton value="webhook" disabled>Webhook</SuRadioButton>
      </SuRadioGroup>
      <SuRadioButton model-value="custom" value="custom" size="large"> 单独使用 </SuRadioButton>
      <SuRadioGroup model-value="disabled" disabled>
        <SuRadioButton value="enabled">启用</SuRadioButton>
        <SuRadioButton value="disabled">停用</SuRadioButton>
      </SuRadioGroup>
    </div>
  </section>
</template>
<style scoped>
.radio-demo {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px 32px;
}
</style>
