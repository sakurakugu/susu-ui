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
const cityValue = ref('')
const statusValue = ref('enabled')
const monthValue = ref(2)
const autoSaveValue = ref(true)
const noticeValue = ref('off')
const loadingSwitchValue = ref(true)
const formName = ref('苏苏')
const formEmail = ref('susu@example.com')
const formNote = ref('这是一个表单示例。')
const inlineKeyword = ref('')
const inlineStatus = ref('')
const messageVisible = ref(false)
const messageKey = ref(0)

const currentLocale = computed(() =>
  localeName.value === 'zh-cn' ? zhCN : enUS,
)

const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou', disabled: true },
]

const monthOptions = [
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
]

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
          <SuButton type="primary" @click="showTopMessage">
            显示顶部消息
          </SuButton>
          <span>点击后消息会固定在页面顶部，并于 3 秒后自动消失</span>
        </div>
      </section>

      <section class="panel">
        <h2>标签</h2>
        <div class="tag-demo">
          <SuTag>默认标签</SuTag>
          <SuTag type="primary">主要标签</SuTag>
          <SuTag type="success">成功</SuTag>
          <SuTag type="warning">警告</SuTag>
          <SuTag type="error">错误</SuTag>
          <SuTag type="info">信息</SuTag>
          <SuTag type="primary" variant="outline">描边标签</SuTag>
          <SuTag type="success" variant="solid">实心标签</SuTag>
          <SuTag size="small">小标签</SuTag>
          <SuTag size="large" round>大圆角标签</SuTag>
          <SuTag closable @close="showTopMessage">可关闭</SuTag>
          <SuTag closable disabled>禁用关闭</SuTag>
          <SuTag type="primary">
            <template #prefix>
              <SuIcon>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 3l2.7 5.47 6.03.88-4.37 4.26 1.03 6.01L12 16.78l-5.39 2.84 1.03-6.01-4.37-4.26 6.03-.88L12 3z"
                  />
                </svg>
              </SuIcon>
            </template>
            带图标
          </SuTag>
        </div>
      </section>

      <section class="panel">
        <h2>卡片</h2>
        <div class="card-demo">
          <SuCard title="项目概览">
            <template #extra>
              <SuButton variant="text" @click="showTopMessage">详情</SuButton>
            </template>
            <p>今日访问量较昨日提升 12%，核心流程保持稳定。</p>
          </SuCard>
          <SuCard shadow="hover" hoverable>
            <template #header>
              <span>任务进度</span>
            </template>
            <div class="card-demo-metric">
              <strong>68%</strong>
              <span>本周目标完成率</span>
            </div>
            <template #footer>
              <SuButton type="primary" size="small" @click="showTopMessage">
                继续处理
              </SuButton>
            </template>
          </SuCard>
          <SuCard padding="small" shadow="never">
            <p>轻量卡片适合承载简短信息或列表项。</p>
          </SuCard>
        </div>
      </section>

      <section class="panel">
        <h2>空状态</h2>
        <div class="empty-demo">
          <SuEmpty />
          <SuEmpty description="没有搜索结果">
            <template #footer>
              <SuButton type="primary" @click="showTopMessage">
                清空筛选
              </SuButton>
            </template>
          </SuEmpty>
          <SuEmpty image-size="72px">
            暂未添加成员
            <template #image>
              <SuIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              </SuIcon>
            </template>
          </SuEmpty>
        </div>
      </section>

      <section class="panel">
        <h2>骨架屏</h2>
        <div class="skeleton-demo">
          <div class="skeleton-demo-card">
            <SuSkeleton variant="rect" height="132px" />
            <SuSkeleton width="68%" />
            <SuSkeleton :rows="3" />
          </div>
          <div class="skeleton-demo-profile">
            <SuSkeleton variant="circle" :width="48" :height="48" />
            <div class="skeleton-demo-lines">
              <SuSkeleton width="40%" />
              <SuSkeleton :rows="2" />
            </div>
          </div>
          <div class="skeleton-demo-card">
            <SuSkeleton variant="rect" height="32px" round />
            <SuSkeleton :rows="4" :animated="false" />
          </div>
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
        <h2>间距</h2>
        <div class="space-demo">
          <SuSpace>
            <SuButton>取消</SuButton>
            <SuButton type="primary">保存</SuButton>
            <SuButton variant="outline">更多</SuButton>
          </SuSpace>

          <SuSpace :size="[16, 8]" wrap>
            <SuTag>需求</SuTag>
            <SuTag type="primary">设计</SuTag>
            <SuTag type="success">开发</SuTag>
            <SuTag type="warning">联调</SuTag>
            <SuTag type="info">发布</SuTag>
          </SuSpace>

          <SuSpace separator="/" inline>
            <span>首页</span>
            <span>组件</span>
            <span>Space 间距</span>
          </SuSpace>

          <SuSpace direction="vertical" size="small" fill>
            <SuCard title="纵向间距" padding="small" shadow="never">
              <p>用于表单项、列表块或说明内容之间的稳定间隔。</p>
            </SuCard>
            <SuSpace align="center" justify="between" fill>
              <span>当前状态：已发布</span>
              <SuButton size="small" type="primary" @click="showTopMessage">
                更新
              </SuButton>
            </SuSpace>
          </SuSpace>
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
        <h2>选择器</h2>
        <div class="select-demo">
          <SuSelect
            v-model="cityValue"
            :options="cityOptions"
            placeholder="请选择城市"
            clearable
          />
          <SuSelect v-model="statusValue">
            <SuOption value="enabled" label="启用" />
            <SuOption value="disabled">停用</SuOption>
            <SuOption value="archived" disabled>归档</SuOption>
          </SuSelect>
          <SuSelect v-model="monthValue" :options="monthOptions" size="small" />
          <SuSelect status="success" model-value="done">
            <option value="done">已完成</option>
            <option value="pending">待处理</option>
          </SuSelect>
          <SuSelect status="warning" placeholder="警告状态" />
          <SuSelect disabled placeholder="禁用选择器" />
        </div>
      </section>

      <section class="panel">
        <h2>开关</h2>
        <div class="switch-demo">
          <SuSwitch v-model="autoSaveValue" />
          <SuSwitch
            v-model="autoSaveValue"
            active-text="自动保存已开启"
            inactive-text="自动保存已关闭"
          />
          <SuSwitch
            v-model="noticeValue"
            active-value="on"
            inactive-value="off"
            active-text="通知开启"
            inactive-text="通知关闭"
          />
          <SuSwitch size="small" model-value />
          <SuSwitch size="large" model-value active-text="大尺寸" />
          <SuSwitch v-model="loadingSwitchValue" loading active-text="同步中" />
          <SuSwitch disabled inactive-text="禁用状态" />
        </div>
      </section>

      <section class="panel">
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
