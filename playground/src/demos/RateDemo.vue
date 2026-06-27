<script setup lang="ts">
import { ref } from 'vue'

const rateValue = ref(3)
const halfRateValue = ref(3.5)
const decimalRateValue = ref(3.7)
</script>

<template>
  <section id="rate" class="panel">
    <h2>评分</h2>
    <div class="rate-demo">
      <SuRate v-model="rateValue" show-text />
      <SuRate v-model="halfRateValue" allow-half show-text />
      <SuRate v-model="decimalRateValue" :precision="0.1" show-text />
      <SuRate :model-value="4" readonly show-text />
      <SuRate :model-value="2" disabled />
      <SuRate
        :model-value="4"
        size="large"
        show-text
        :texts="['极差', '失望', '一般', '满意', '惊喜']"
      />
      <SuRate :model-value="3.7" readonly>
        <template #icon>
          <svg viewBox="0 0 24 24">
            <path
              d="M12 21s-7-4.35-9.33-8.8C.68 8.4 2.8 4 7.05 4c2.15 0 3.73 1.14 4.95 2.72C13.22 5.14 14.8 4 16.95 4c4.25 0 6.37 4.4 4.38 8.2C19 16.65 12 21 12 21z"
            />
          </svg>
        </template>
      </SuRate>
    </div>
  </section>
</template>
<style scoped>
.rate-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px 24px;
}
</style>
