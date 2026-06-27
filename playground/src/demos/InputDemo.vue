<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('Susu UI')
const passwordValue = ref('susu-ui')
const textareaValue = ref('Susu UI 是一个基于 Vue 3 的组件库。')
const nicknameValue = ref('苏苏')
const priceValue = ref(12800)
const domainValue = ref('susu-ui')
const enterValue = ref('')
const trimValue = ref('')
const digitsValue = ref('123')
const invalidValue = ref('')

function formatCurrency(value: string | number) {
  return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parseCurrency(value: string) {
  return Number(value.replace(/[^\d.]/g, ''))
}

function markEnterValue() {
  enterValue.value = enterValue.value ? `${enterValue.value} ✓` : '已回车'
}

function onlyDigits(value: string) {
  return /^\d*$/.test(value)
}

function markInvalidValue() {
  invalidValue.value = '校验失败'
}
</script>

<template>
  <section id="input" class="panel">
    <h2>输入框</h2>
    <div class="input-demo">
      <SuInput v-model="inputValue" clearable placeholder="请输入内容" />
      <SuInput size="small" placeholder="小尺寸输入框" />
      <SuInput size="large" placeholder="大尺寸输入框" />
      <SuInput disabled placeholder="禁用输入框" />
      <SuInput readonly model-value="只读内容" />
      <SuInput placeholder="请输入金额">
        <template #prefix>¥</template>
        <template #suffix>元</template>
      </SuInput>
      <SuInput type="password" placeholder="password：密码遮蔽" />
      <SuInput
        v-model="passwordValue"
        type="password"
        show-password
        placeholder="show-password：密码可见切换"
      />
      <SuInput type="email" placeholder="email：邮箱校验" />
      <SuInput type="number" placeholder="number：数字输入" />
      <SuInput type="search" placeholder="search：搜索语义" />
      <SuInput type="tel" placeholder="tel：电话输入" />
      <SuInput type="url" placeholder="url：网址校验" />
      <SuInput type="id-card" placeholder="id-card：身份证号码校验" />
      <SuInput
        v-model="textareaValue"
        type="textarea"
        :rows="4"
        autosize
        resize="vertical"
        placeholder="textarea：多行输入"
      />
      <SuInput
        v-model="nicknameValue"
        :maxlength="12"
        show-word-limit
        placeholder="show-word-limit：字数统计"
      />
      <SuInput status="success" placeholder="success：成功状态" />
      <SuInput status="warning" placeholder="warning：警告状态" />
      <SuInput status="error" placeholder="error：错误状态" />
      <SuInput
        required
        pattern="[a-z]+"
        inputmode="text"
        placeholder="原生校验：请输入小写字母"
      />
      <SuInput v-model="domainValue" placeholder="prepend / append">
        <template #prepend>https://</template>
        <template #append>.com</template>
      </SuInput>
      <SuInput
        v-model="priceValue"
        :formatter="formatCurrency"
        :parser="parseCurrency"
        placeholder="formatter / parser：金额格式化"
      />
      <SuInput
        type="number"
        min="1"
        max="10"
        step="1"
        placeholder="number：范围 1 到 10"
      />
      <SuInput
        v-model="enterValue"
        placeholder="按回车触发 enter 事件"
        @enter="markEnterValue"
      />
      <SuInput
        v-model="inputValue"
        clearable
        clear-focus
        placeholder="clear-focus：清空后自动聚焦"
      />
      <SuInput
        model-value="聚焦后自动选中"
        select-on-focus
        placeholder="select-on-focus：聚焦全选"
      />
      <SuInput
        v-model="trimValue"
        trim
        placeholder="trim：写入前去除首尾空格"
      />
      <SuInput
        v-model="digitsValue"
        :allow-input="onlyDigits"
        placeholder="allow-input：只允许输入数字"
      />
      <SuInput
        v-model="invalidValue"
        required
        placeholder="invalid：留空提交会触发原生校验"
        @invalid="markInvalidValue"
      />
      <SuInput minlength="3" maxlength="12" placeholder="长度限制：3 到 12" />
    </div>
  </section>
</template>
<style scoped>
.input-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .input-demo {
    grid-template-columns: 1fr;
  }
}
</style>
