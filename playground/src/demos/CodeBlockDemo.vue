<script setup lang="ts">
const installCode = `pnpm add @susu-ui/vue

import { createApp } from 'vue'
import SusuUI from '@susu-ui/vue'
import '@susu-ui/vue/style.css'

createApp(App).use(SusuUI).mount('#app')`

const responseCode = `{
  "orderNo": "SO-20260628-1048",
  "status": "paid",
  "totalAmount": 26800,
  "currency": "CNY"
}`
</script>

<template>
  <section id="code-block" class="panel">
    <h2>代码块</h2>
    <div class="code-block-demo">
      <SuCodeBlock title="安装和注册" language="ts" :code="installCode" show-line-numbers />

      <SuCodeBlock
        title="订单接口响应"
        language="json"
        theme="dark"
        :code="responseCode"
        :max-height="220"
        wrap
      />
    </div>
  </section>
</template>

<style scoped>
.code-block-demo {
  display: grid;
  max-width: 780px;
  gap: 16px;
}
</style>
