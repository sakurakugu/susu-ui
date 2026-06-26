<script setup lang="ts">
import {
  DEFAULT_THEME_HUE,
  setThemeHue,
  setThemeMode,
  setThemePreset,
  themePresets,
  type ThemeMode,
  type ThemePresetName,
} from '@susu-ui/theme'
import { enUS, zhCN, type SusuLocale } from '@susu-ui/vue'
import { computed, ref } from 'vue'

const themeMode = ref<ThemeMode>('light')
const themePreset = ref<ThemePresetName | 'custom'>('blue')
const themeHue = ref(DEFAULT_THEME_HUE)
const localeName = ref<SusuLocale['name']>('zh-cn')
const inputValue = ref('Susu UI')
const passwordValue = ref('susu-ui')
const textareaValue = ref('Susu UI 是一个基于 Vue 3 的组件库。')
const nicknameValue = ref('苏苏')
const priceValue = ref(12800)
const rateValue = ref(3)
const halfRateValue = ref(3.5)
const decimalRateValue = ref(3.7)
const domainValue = ref('susu-ui')
const enterValue = ref('')
const trimValue = ref('')
const digitsValue = ref('123')
const invalidValue = ref('')
const messageVisible = ref(false)
const messageKey = ref(0)

const currentLocale = computed(() =>
  localeName.value === 'zh-cn' ? zhCN : enUS,
)

function toggleThemeMode() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  setThemeMode(themeMode.value)
}

function toggleLocale() {
  localeName.value = localeName.value === 'zh-cn' ? 'en-us' : 'zh-cn'
}

function changeThemePreset(name: ThemePresetName) {
  const preset = themePresets.find((item) => item.name === name)
  if (preset) {
    themeHue.value = preset.hue
  }
  themePreset.value = name
  setThemePreset(name)
}

function changeThemeHue(event: Event) {
  const target = event.target as HTMLInputElement
  const hue = Number.parseInt(target.value, 10)
  themeHue.value = setThemeHue(hue)
  themePreset.value =
    themePresets.find((preset) => preset.hue === themeHue.value)?.name ??
    'custom'
}

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

function showTopMessage() {
  messageKey.value += 1
  messageVisible.value = true
}
</script>

<template>
  <SuConfigProvider :locale="currentLocale">
    <main class="playground">
      <SuMessage
        v-if="messageVisible"
        :key="messageKey"
        type="success"
        @close="messageVisible = false"
      >
        消息会在顶部展示，并于 3 秒后消失
      </SuMessage>

      <section class="toolbar">
        <div>
          <h1>Susu UI</h1>
          <p>基于 Vue 3、CSS 变量和双轴主题的组件库。</p>
        </div>
        <div class="toolbar-actions">
          <div class="theme-toolbar">
            <span class="theme-toolbar-label">主题色</span>
            <SuButtonGroup class="preset-button-group">
              <SuButton
                v-for="preset in themePresets"
                :key="preset.name"
                class="preset-button"
                :class="{ 'is-active': themePreset === preset.name }"
                :style="{ '--preset-hue': preset.hue }"
                @click="changeThemePreset(preset.name)"
              >
                <span class="preset-swatch" />
                {{ preset.label }}
              </SuButton>
            </SuButtonGroup>
            <div class="hue-control toolbar-hue-control">
              <div class="hue-control-header">
                <span>自定义色相</span>
                <strong>{{ themeHue }}°</strong>
              </div>
              <input
                class="hue-slider"
                type="range"
                min="0"
                max="359"
                :value="themeHue"
                aria-label="自定义主题色相"
                @input="changeThemeHue"
              />
            </div>
          </div>
          <SuButton @click="toggleLocale">
            切换到{{ localeName === 'zh-cn' ? '英文' : '中文' }}
          </SuButton>
          <SuButton type="primary" @click="toggleThemeMode">
            切换到{{ themeMode === 'light' ? '深色' : '浅色' }}
          </SuButton>
        </div>
      </section>

      <section class="panel">
        <h2>消息</h2>
        <div class="message-demo">
          <SuButton type="primary" @click="showTopMessage"
            >显示顶部消息</SuButton
          >
          <span>点击后消息会固定在页面顶部，并于 3 秒后自动消失</span>
        </div>
      </section>

      <section class="panel">
        <h2>分割线</h2>
        <div class="divider-demo">
          <p>基础内容区域</p>
          <SuDivider />
          <p>下一段内容区域</p>
          <SuDivider content-position="left">基础信息</SuDivider>
          <SuDivider dashed>虚线分割</SuDivider>
          <div class="inline-divider-demo">
            <span>详情</span>
            <SuDivider direction="vertical" />
            <span>编辑</span>
            <SuDivider direction="vertical" dashed />
            <span>删除</span>
          </div>
        </div>
      </section>

      <section class="panel">
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

      <section class="panel">
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
          <SuInput
            minlength="3"
            maxlength="12"
            placeholder="长度限制：3 到 12"
          />
        </div>
      </section>

      <section class="panel">
        <h2>按钮</h2>
        <div class="row">
          <SuButton>默认按钮</SuButton>
          <SuButton type="primary">主要按钮</SuButton>
          <SuButton disabled>禁用按钮</SuButton>
        </div>
        <div class="row">
          <SuButton variant="outline">描边按钮</SuButton>
          <SuButton variant="ghost">幽灵按钮</SuButton>
          <SuButton variant="text">文本按钮</SuButton>
          <SuButton type="primary" loading>加载中</SuButton>
        </div>
        <div class="row">
          <SuButton size="small">小按钮</SuButton>
          <SuButton>默认尺寸</SuButton>
          <SuButton size="large">大按钮</SuButton>
          <SuButton native-type="submit">
            <template #prefix>
              <SuIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </SuIcon>
            </template>
            新建
          </SuButton>
        </div>
        <div class="row">
          <SuButtonGroup type="primary" variant="outline" size="small">
            <SuButton>左</SuButton>
            <SuButton>中</SuButton>
            <SuButton>右</SuButton>
          </SuButtonGroup>
          <SuButtonGroup>
            <SuButton>日</SuButton>
            <SuButton type="primary">周</SuButton>
            <SuButton>月</SuButton>
          </SuButtonGroup>
          <SuButtonGroup direction="vertical" variant="outline">
            <SuButton>上</SuButton>
            <SuButton type="primary">中</SuButton>
            <SuButton>下</SuButton>
          </SuButtonGroup>
        </div>
      </section>
    </main>
  </SuConfigProvider>
</template>
