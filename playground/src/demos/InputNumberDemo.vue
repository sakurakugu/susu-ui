<script setup lang="ts">
import { ref } from 'vue'

const countValue = ref(3)
const amountValue = ref(12.5)
const percentValue = ref(0.35)
</script>

<template>
  <section id="input-number" class="panel">
    <h2>数字输入框</h2>
    <div class="input-number-demo">
      <SuInputNumber v-model="countValue" placeholder="请输入数量" />
      <SuInputNumber
        v-model="amountValue"
        :min="0"
        :max="100"
        :step="0.5"
        :precision="1"
        clearable
        placeholder="0 到 100，步进 0.5"
      />
      <SuInputNumber size="small" :model-value="2" />
      <SuInputNumber size="large" :model-value="8" />
      <SuInputNumber :model-value="1" disabled />
      <SuInputNumber :model-value="6" readonly />
      <SuInputNumber status="success" :model-value="88" />
      <SuInputNumber status="warning" :model-value="3" />
      <SuInputNumber status="error" :model-value="-1" />
      <SuInputNumber
        v-model="percentValue"
        :step="0.05"
        :precision="2"
        placeholder="百分比"
      >
        <template #suffix>%</template>
      </SuInputNumber>
      <SuInputNumber :model-value="128" :controls="false">
        <template #prefix>¥</template>
        <template #suffix>元</template>
      </SuInputNumber>
      <SuInputNumber
        required
        :min="1"
        :max="10"
        placeholder="原生必填，范围 1 到 10"
      />
    </div>
  </section>
</template>
<style scoped>
.input-number-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .input-number-demo {
    grid-template-columns: 1fr;
  }
}
</style>
