<script setup lang="ts">
import { computed, ref } from 'vue'

const loginCode = ref('')
const paymentCode = ref('839201')
const backupCode = ref('AB12')
const statusCode = ref('')

const loginStatus = computed(() =>
  loginCode.value.length === 6 ? '验证码已填写完整' : '等待输入 6 位验证码',
)

function markComplete(value: string) {
  statusCode.value = `已录入：${value}`
}
</script>

<template>
  <section id="otp-input" class="panel">
    <h2>验证码输入</h2>
    <div class="otp-input-demo">
      <div class="otp-input-demo__row">
        <span class="otp-input-demo__label">短信登录</span>
        <SuOtpInput
          v-model="loginCode"
          clearable
          aria-label="短信登录验证码"
          @complete="markComplete"
        />
        <span class="otp-input-demo__hint">{{ loginStatus }}</span>
      </div>
      <div class="otp-input-demo__row">
        <span class="otp-input-demo__label">支付确认</span>
        <SuOtpInput
          v-model="paymentCode"
          mask
          clearable
          aria-label="支付验证码"
        />
        <span class="otp-input-demo__hint">掩码展示敏感验证码</span>
      </div>
      <div class="otp-input-demo__row">
        <span class="otp-input-demo__label">备用代码</span>
        <SuOtpInput
          v-model="backupCode"
          type="text"
          :length="4"
          placeholder="·"
          aria-label="备用恢复代码"
        />
        <span class="otp-input-demo__hint">支持字母和数字混合</span>
      </div>
      <div class="otp-input-demo__row">
        <span class="otp-input-demo__label">状态</span>
        <div class="otp-input-demo__variants">
          <SuOtpInput
            size="small"
            :length="4"
            status="success"
            model-value="2026"
          />
          <SuOtpInput :length="4" status="warning" model-value="1024" />
          <SuOtpInput
            size="large"
            :length="4"
            status="error"
            model-value="0000"
          />
        </div>
      </div>
      <div class="otp-input-demo__row">
        <span class="otp-input-demo__label">受控状态</span>
        <div class="otp-input-demo__variants">
          <SuOtpInput :length="4" disabled model-value="1357" />
          <SuOtpInput :length="4" readonly model-value="2468" />
        </div>
      </div>
      <p v-if="statusCode" class="otp-input-demo__result">{{ statusCode }}</p>
    </div>
  </section>
</template>

<style scoped>
.otp-input-demo {
  display: grid;
  max-width: 760px;
  gap: 18px;
}

.otp-input-demo__row {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 8px 16px;
}

.otp-input-demo__label {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.otp-input-demo__hint,
.otp-input-demo__result {
  grid-column: 2;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.otp-input-demo__variants {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.otp-input-demo__result {
  margin: 0;
  color: var(--su-color-primary);
}

@media (max-width: 640px) {
  .otp-input-demo__row {
    grid-template-columns: 1fr;
  }

  .otp-input-demo__hint,
  .otp-input-demo__result {
    grid-column: 1;
  }
}
</style>
