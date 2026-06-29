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

const envCode = `VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ENABLED=true
VITE_RELEASE_CHANNEL=internal-preview
VITE_LONG_CALLBACK_URL=https://callback.example.com/orders/synchronization/retry-with-a-very-long-path-for-wrap-preview`

const slotCode = `pnpm --filter @susu-ui/vue test -- Button`

function handleCopy(code: string) {
  console.log('已复制代码片段', code.slice(0, 24))
}
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

      <SuCodeBlock
        title="环境变量"
        language="dotenv"
        :code="envCode"
        :max-height="120"
        wrap
        @copy="handleCopy"
      >
        <template #actions>
          <SuTag size="small" type="success">预览环境</SuTag>
        </template>
      </SuCodeBlock>

      <SuCodeBlock language="bash" :copyable="false" :show-header="false">
        {{ slotCode }}
      </SuCodeBlock>
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
