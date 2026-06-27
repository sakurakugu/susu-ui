<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const formName = ref('苏苏')
const formEmail = ref('susu@example.com')
const formNote = ref('这是一个表单示例。')
const cityValue = ref('')
const autoSaveValue = ref(true)
const agreementValue = ref(false)
const inlineKeyword = ref('')
const inlineStatus = ref('')

const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou', disabled: true },
]

function submitDemoForm() {
  showTopMessage()
}

function resetDemoForm() {
  formName.value = ''
  formEmail.value = ''
  formNote.value = ''
}

function searchInlineForm() {
  inlineStatus.value = inlineKeyword.value
    ? `正在搜索：${inlineKeyword.value}`
    : '请输入关键词'
}
</script>

<template>
  <section id="form" class="panel">
    <h2>表单</h2>
    <div class="form-demo">
      <SuForm
        label-width="88px"
        @submit.prevent="submitDemoForm"
        @reset.prevent="resetDemoForm"
      >
        <SuFormItem label="用户名" label-for="demo-name" required>
          <SuInput
            id="demo-name"
            v-model="formName"
            required
            placeholder="请输入用户名"
          />
        </SuFormItem>
        <SuFormItem
          label="邮箱"
          label-for="demo-email"
          required
          help="用于接收通知和找回账号"
        >
          <SuInput
            id="demo-email"
            v-model="formEmail"
            type="email"
            required
            placeholder="请输入邮箱"
          />
        </SuFormItem>
        <SuFormItem
          label="备注"
          label-for="demo-note"
          status="success"
          help="支持多行输入和自适应高度"
        >
          <SuInput
            id="demo-note"
            v-model="formNote"
            type="textarea"
            autosize
            placeholder="请输入备注"
          />
        </SuFormItem>
        <SuFormItem label="城市" label-for="demo-city" required>
          <SuSelect
            id="demo-city"
            v-model="cityValue"
            :options="cityOptions"
            required
            placeholder="请选择城市"
          />
        </SuFormItem>
        <SuFormItem label="自动保存" label-for="demo-auto-save">
          <SuSwitch
            id="demo-auto-save"
            v-model="autoSaveValue"
            active-text="开启"
            inactive-text="关闭"
          />
        </SuFormItem>
        <SuFormItem label="协议" label-for="demo-agreement" required>
          <SuCheckbox id="demo-agreement" v-model="agreementValue" required>
            已阅读并同意服务协议
          </SuCheckbox>
        </SuFormItem>
        <SuFormItem>
          <div class="form-demo-actions">
            <SuButton type="primary" native-type="submit">提交</SuButton>
            <SuButton native-type="reset">重置</SuButton>
          </div>
        </SuFormItem>
      </SuForm>

      <SuForm inline label-position="top" size="small">
        <SuFormItem label="关键词" label-for="inline-keyword">
          <SuInput
            id="inline-keyword"
            v-model="inlineKeyword"
            size="small"
            placeholder="输入关键词"
          />
        </SuFormItem>
        <SuFormItem :help="inlineStatus">
          <SuButton size="small" type="primary" @click="searchInlineForm">
            查询
          </SuButton>
        </SuFormItem>
      </SuForm>

      <SuForm label-position="top" disabled>
        <SuFormItem label="禁用表单">
          <SuInput model-value="整组控件不可编辑" />
        </SuFormItem>
      </SuForm>
    </div>
  </section>
</template>
<style scoped>
.form-demo {
  display: grid;
  max-width: 760px;
  gap: 20px;
}

.form-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
