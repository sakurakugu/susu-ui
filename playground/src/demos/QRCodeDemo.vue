<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const paymentCode = ref('PAY-20260628-0930-128600')

function handleRefresh() {
  paymentCode.value = `PAY-${Date.now()}`
  showTopMessage('付款码已刷新')
}
</script>

<template>
  <section id="qrcode" class="panel">
    <h2>二维码</h2>
    <div class="qrcode-demo">
      <div class="qrcode-demo__item">
        <SuQRCode value="https://susu-ui.example.com/docs/qrcode" />
        <div class="qrcode-demo__meta">
          <strong>文档访问码</strong>
          <span>扫码打开组件文档，适合帮助中心和运营物料。</span>
        </div>
      </div>

      <div class="qrcode-demo__item">
        <SuQRCode
          value="https://susu-ui.example.com/member/lin-chen"
          :size="180"
          :margin="3"
          level="H"
          color="#111827"
          background-color="#ffffff"
        >
          <template #icon>
            <span class="qrcode-demo__brand">Su</span>
          </template>
        </SuQRCode>
        <div class="qrcode-demo__meta">
          <strong>会员名片</strong>
          <span>高纠错等级适合中间放置品牌标识。</span>
        </div>
      </div>

      <div class="qrcode-demo__item">
        <SuQRCode
          :value="paymentCode"
          status="expired"
          status-text="刷新付款码"
          @refresh="handleRefresh"
        />
        <div class="qrcode-demo__meta">
          <strong>付款码</strong>
          <span>过期后展示刷新入口，点击后生成新的业务令牌。</span>
        </div>
      </div>

      <div class="qrcode-demo__item">
        <SuQRCode value="LOGIN-SESSION-20260628" status="loading" status-text="正在生成登录码" />
        <div class="qrcode-demo__meta">
          <strong>登录确认</strong>
          <span>加载态用于等待后端签发一次性扫码凭证。</span>
        </div>
      </div>

      <div class="qrcode-demo__item">
        <SuQRCode>
          <template #status>请选择门店后生成二维码</template>
        </SuQRCode>
        <div class="qrcode-demo__meta">
          <strong>门店导购码</strong>
          <span>没有内容时可用状态插槽提供业务提示。</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.qrcode-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.qrcode-demo__item {
  display: grid;
  justify-items: start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.qrcode-demo__meta {
  display: grid;
  gap: 4px;
}

.qrcode-demo__meta span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.qrcode-demo__brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--su-radius-xs);
  background: var(--su-color-primary);
  color: var(--su-color-primary-text);
  font-size: 13px;
  font-weight: 700;
}
</style>
