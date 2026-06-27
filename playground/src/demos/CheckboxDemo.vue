<script setup lang="ts">
import { ref } from 'vue'

const agreementValue = ref(false)
const featureValue = ref('disabled')
const indeterminateValue = ref(false)
</script>

<template>
  <section id="checkbox" class="panel">
    <h2>复选框</h2>
    <div class="checkbox-demo">
      <SuCheckbox v-model="agreementValue">同意服务协议</SuCheckbox>
      <SuCheckbox
        v-model="featureValue"
        true-value="enabled"
        false-value="disabled"
      >
        启用高级功能
      </SuCheckbox>
      <SuCheckbox v-model="indeterminateValue" indeterminate>
        部分选中
      </SuCheckbox>
      <SuCheckbox size="small" model-value>小尺寸</SuCheckbox>
      <SuCheckbox size="large" model-value>大尺寸</SuCheckbox>
      <SuCheckbox disabled>禁用状态</SuCheckbox>
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
</style>
