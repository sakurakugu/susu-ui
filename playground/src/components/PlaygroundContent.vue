<script setup lang="ts">
import {
  type StepsItem,
  type TimelineItem,
  type TransferOption,
  type UploadFile,
  type UploadRequestOptions,
} from '@susu-ui/vue'
import { ref } from 'vue'

const inputValue = ref('Susu UI')
const passwordValue = ref('susu-ui')
const textareaValue = ref('Susu UI 是一个基于 Vue 3 的组件库。')
const nicknameValue = ref('苏苏')
const priceValue = ref(12800)
const countValue = ref(3)
const amountValue = ref(12.5)
const percentValue = ref(0.35)
const rateValue = ref(3)
const halfRateValue = ref(3.5)
const decimalRateValue = ref(3.7)
const sliderValue = ref(36)
const volumeValue = ref(60)
const rangeSliderValue = ref<[number, number]>([20, 68])
const temperatureValue = ref(24)
const domainValue = ref('susu-ui')
const enterValue = ref('')
const trimValue = ref('')
const digitsValue = ref('123')
const invalidValue = ref('')
const cityValue = ref('')
const regionValue = ref<(string | number)[]>([])
const categoryValue = ref<(string | number)[]>(['docs', 'components'])
const autocompleteCityValue = ref('')
const searchKeyword = ref('')
const colorValue = ref('#1677ff')
const alphaColorValue = ref('rgba(22, 119, 255, 0.64)')
const calendarValue = ref('2026-06-27')
const limitedCalendarValue = ref('')
const dateValue = ref('2026-06-27')
const limitedDateValue = ref('')
const dateRangeValue = ref<[string, string]>(['2026-06-01', '2026-06-15'])
const limitedDateRangeValue = ref<[string, string]>(['', ''])
const timeValue = ref('09:30:00')
const shortTimeValue = ref('18:00')
const limitedTimeValue = ref('')
const timeRangeValue = ref<[string, string]>(['09:00:00', '18:00:00'])
const shortTimeRangeValue = ref<[string, string]>(['09:30', '17:30'])
const limitedTimeRangeValue = ref<[string, string]>(['', ''])
const statusValue = ref('enabled')
const tabsValue = ref('overview')
const segmentedRangeValue = ref('week')
const segmentedViewValue = ref('list')
const collapseValue = ref<(string | number)[]>(['overview'])
const accordionValue = ref<string | number>('basic')
const monthValue = ref(2)
const planValue = ref('weekly')
const channelValue = ref('email')
const agreementValue = ref(false)
const featureValue = ref('disabled')
const indeterminateValue = ref(false)
const autoSaveValue = ref(true)
const noticeValue = ref('off')
const loadingSwitchValue = ref(true)
const formName = ref('苏苏')
const formEmail = ref('susu@example.com')
const formNote = ref('这是一个表单示例。')
const inlineKeyword = ref('')
const inlineStatus = ref('')
const basicDialogVisible = ref(false)
const customDialogVisible = ref(false)
const asyncDialogVisible = ref(false)
const dialogConfirmLoading = ref(false)
const basicDrawerVisible = ref(false)
const filterDrawerVisible = ref(false)
const asyncDrawerVisible = ref(false)
const drawerConfirmLoading = ref(false)
const paginationPage = ref(3)
const paginationSize = ref(10)
const stepsCurrent = ref(1)
const uploadProgress = ref(45)
const uploadFiles = ref<UploadFile[]>([])
const pictureUploadFiles = ref<UploadFile[]>([])
const selectedTreeKey = ref<string | number>('components')
const expandedTreeKeys = ref<(string | number)[]>(['docs', 'packages'])
const checkedTreeKeys = ref<(string | number)[]>(['button'])
const transferValue = ref<(string | number)[]>(['table', 'tree'])
const filteredTransferValue = ref<(string | number)[]>(['design'])
const customTransferValue = ref<(string | number)[]>(['publish'])
const selectedMenuKey = ref<string | number>('overview')
const openMenuKeys = ref<(string | number)[]>(['components'])
const popoverVisible = ref(false)
const dropdownVisible = ref(false)
const dropdownCommand = ref('尚未选择操作')

const breadcrumbItems = [
  { label: '首页', href: '#' },
  { label: '组件', href: '#' },
  { label: 'Breadcrumb 面包屑' },
]

const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou', disabled: true },
]

const regionOptions = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
        ],
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [{ label: '鄞州区', value: 'yinzhou' }],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [{ label: '玄武区', value: 'xuanwu' }],
      },
      { label: '苏州', value: 'suzhou', disabled: true },
    ],
  },
]

const categoryOptions = [
  {
    label: '文档',
    value: 'docs',
    children: [
      { label: '指南', value: 'guide' },
      { label: '组件', value: 'components' },
    ],
  },
  {
    label: '包',
    value: 'packages',
    children: [
      { label: '@susu-ui/vue', value: 'vue' },
      { label: '@susu-ui/theme', value: 'theme' },
    ],
  },
]

const searchOptions = [
  { label: 'Button 按钮', value: 'button' },
  { label: 'Input 输入框', value: 'input' },
  { label: 'Select 选择器', value: 'select' },
  { label: 'Autocomplete 自动完成', value: 'autocomplete' },
]

const monthOptions = [
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
]

const actionOptions = [
  { label: '编辑资料', value: 'edit' },
  { label: '复制链接', value: 'copy' },
  { label: '导出数据', value: 'export' },
  { label: '删除项目', value: 'delete', divided: true, disabled: true },
]

const segmentedRangeOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

const segmentedViewOptions = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' },
  { label: '看板', value: 'board', disabled: true },
]

const avatarImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231677ff'/%3E%3Ccircle cx='40' cy='30' r='14' fill='white' fill-opacity='.92'/%3E%3Cpath d='M17 70c4-16 15-24 23-24s19 8 23 24' fill='white' fill-opacity='.92'/%3E%3C/svg%3E"
const imageCover =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%231677ff'/%3E%3Cstop offset='.58' stop-color='%2316a34a'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='200' rx='20' fill='url(%23g)'/%3E%3Ccircle cx='72' cy='68' r='34' fill='white' fill-opacity='.86'/%3E%3Cpath d='M0 168l76-62 52 42 45-34 96 74H0z' fill='white' fill-opacity='.76'/%3E%3Cpath d='M202 52h72M202 78h52M202 104h38' stroke='white' stroke-width='12' stroke-linecap='round' stroke-opacity='.86'/%3E%3C/svg%3E"

const tableData = [
  {
    id: 1,
    name: '苏苏',
    role: '设计师',
    status: '在线',
    score: 96,
    team: { name: '体验组' },
  },
  {
    id: 2,
    name: '小满',
    role: '前端工程师',
    status: '忙碌',
    score: 88,
    team: { name: '平台组' },
  },
  {
    id: 3,
    name: '青禾',
    role: '产品经理',
    status: '离线',
    score: 76,
    team: { name: '增长组' },
  },
]

const tableColumns = [
  { prop: 'name', label: '成员', width: 120 },
  { prop: 'team.name', label: '团队', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 140 },
  {
    prop: 'score',
    label: '评分',
    align: 'right' as const,
    formatter: (_row: unknown, _column: unknown, value: unknown) =>
      `${value} 分`,
  },
]

const treeData = [
  {
    key: 'docs',
    label: '文档',
    children: [
      { key: 'guide', label: '指南' },
      { key: 'theme', label: '主题' },
      { key: 'components', label: '组件' },
    ],
  },
  {
    key: 'packages',
    label: '包',
    children: [
      {
        key: 'vue',
        label: '@susu-ui/vue',
        children: [
          { key: 'button', label: 'Button 按钮' },
          { key: 'tree', label: 'Tree 树' },
          { key: 'table', label: 'Table 表格', disabled: true },
        ],
      },
      { key: 'theme-package', label: '@susu-ui/theme' },
    ],
  },
]

const transferData: TransferOption[] = [
  {
    label: 'Button 按钮',
    value: 'button',
    description: '基础操作入口',
    group: '基础',
  },
  {
    label: 'Input 输入框',
    value: 'input',
    description: '文本录入控件',
    group: '表单',
  },
  {
    label: 'Select 选择器',
    value: 'select',
    description: '选项选择控件',
    group: '表单',
  },
  {
    label: 'Table 表格',
    value: 'table',
    description: '结构化数据展示',
    group: '数据',
  },
  {
    label: 'Tree 树',
    value: 'tree',
    description: '层级数据展示',
    group: '数据',
  },
  {
    label: 'Upload 上传',
    value: 'upload',
    description: '文件选择和上传',
    group: '反馈',
    disabled: true,
  },
]

const workflowTransferData: TransferOption[] = [
  {
    label: '需求确认',
    value: 'requirement',
    description: '产品和设计确认范围',
  },
  { label: '视觉走查', value: 'design', description: '校对颜色、间距和状态' },
  { label: '接口联调', value: 'api', description: '确认字段和异常分支' },
  { label: '发布审批', value: 'publish', description: '进入版本发布流程' },
]

const menuItems = [
  { key: 'overview', label: '概览' },
  {
    key: 'components',
    label: '组件',
    children: [
      { key: 'button-menu', label: 'Button 按钮' },
      { key: 'menu-menu', label: 'Menu 菜单' },
      { key: 'table-menu', label: 'Table 表格', disabled: true },
    ],
  },
  {
    key: 'resources',
    label: '资源',
    children: [
      { key: 'guide-menu', label: '指南' },
      { key: 'theme-menu', label: '主题' },
    ],
  },
  { key: 'divider-menu', label: '分割项', divided: true },
]

const publishSteps: StepsItem[] = [
  { title: '填写信息', description: '录入标题、分类和基础说明' },
  { title: '确认内容', description: '检查附件、权限和发布范围' },
  { title: '提交发布', description: '等待系统完成发布流程' },
]

const reviewSteps: StepsItem[] = [
  { title: '创建草稿', description: '内容已保存为草稿' },
  { title: '内容审核', description: '字段缺失，需要补充说明', status: 'error' },
  { title: '重新提交', description: '修正后再次进入审核' },
]

const simpleSteps: StepsItem[] = [
  { title: '草稿', value: 'draft' },
  { title: '审核', value: 'review' },
  { title: '发布', value: 'publish' },
]

const timelineItems: TimelineItem[] = [
  {
    time: '09:00',
    title: '创建发布任务',
    description: '负责人完成标题、摘要和素材录入。',
    type: 'primary',
  },
  {
    time: '10:20',
    title: '内容审核通过',
    description: '审核记录已归档，进入排期阶段。',
    type: 'success',
  },
  {
    time: '11:45',
    title: '等待定时发布',
    description: '系统将在指定时间同步到线上环境。',
    type: 'warning',
    hollow: true,
  },
]

const alternateTimelineItems: TimelineItem[] = [
  {
    time: '周一',
    title: '需求确认',
    description: '确认组件范围和示例内容。',
    type: 'info',
  },
  {
    time: '周三',
    title: '设计走查',
    description: '核对布局、状态和主题变量使用。',
    color: '#7c3aed',
  },
  {
    time: '周五',
    title: '版本发布',
    description: '完成构建检查后发布组件包。',
    type: 'success',
  },
]

function formatCurrency(value: string | number) {
  return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parseCurrency(value: string) {
  return Number(value.replace(/[^\d.]/g, ''))
}

function formatPercent(value: number) {
  return `${value}%`
}

function formatTemperature(value: number) {
  return `${value}°C`
}

function formatUploadProgress(value: number) {
  return `上传 ${value}%`
}

function markEnterValue() {
  enterValue.value = enterValue.value ? `${enterValue.value} ✓` : '已回车'
}

function onlyDigits(value: string) {
  return /^\d*$/.test(value)
}

function fetchComponentSuggestions(query: string) {
  if (!query) {
    return searchOptions
  }

  const normalizedQuery = query.toLowerCase()
  return searchOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(normalizedQuery) ||
      `${option.value}`.includes(normalizedQuery),
  )
}

function markInvalidValue() {
  invalidValue.value = '校验失败'
}

const emit = defineEmits<{
  showMessage: []
  showNotification: [placement: 'top-right' | 'bottom-left']
}>()

function showTopMessage() {
  emit('showMessage')
}

function showNotification(placement: 'top-right' | 'bottom-left') {
  emit('showNotification', placement)
}

function handleDropdownCommand(value: string | number) {
  dropdownCommand.value = `已选择：${value}`
  showTopMessage()
}

function handleStepChange(value: string | number) {
  stepsCurrent.value = Number(value)
  showTopMessage()
}

function handleImagePreview() {
  showTopMessage()
}

function confirmBasicDialog() {
  basicDialogVisible.value = false
  showTopMessage()
}

function confirmCustomDialog() {
  customDialogVisible.value = false
  showTopMessage()
}

function confirmAsyncDialog() {
  dialogConfirmLoading.value = true
  window.setTimeout(() => {
    dialogConfirmLoading.value = false
    asyncDialogVisible.value = false
    showTopMessage()
  }, 900)
}

function confirmBasicDrawer() {
  basicDrawerVisible.value = false
  showTopMessage()
}

function confirmFilterDrawer() {
  filterDrawerVisible.value = false
  showTopMessage()
}

function confirmAsyncDrawer() {
  drawerConfirmLoading.value = true
  window.setTimeout(() => {
    drawerConfirmLoading.value = false
    asyncDrawerVisible.value = false
    showTopMessage()
  }, 900)
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

function disableWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}

function disableRangeWeekend(date: Date) {
  return disableWeekend(date)
}

function disableLunchTime(time: {
  hour: number
  minute: number
  second: number
}) {
  return time.hour === 12
}

function disableRangeLunchTime(time: {
  hour: number
  minute: number
  second: number
}) {
  return time.hour === 12
}

function mockUploadRequest(options: UploadRequestOptions) {
  let percentage = 0
  const timer = window.setInterval(() => {
    percentage += 25
    options.onProgress(Math.min(percentage, 100))

    if (percentage >= 100) {
      window.clearInterval(timer)
      options.onSuccess({ url: URL.createObjectURL(options.file) })
    }
  }, 180)
}

function limitUploadSize(file: File) {
  return file.size <= 2 * 1024 * 1024
}
</script>

<template>
  <div class="playground-content">
    <section id="alert" class="panel">
      <h2>提示</h2>
      <div class="alert-demo">
        <SuAlert title="普通提示">
          这里展示页面内的上下文信息，适合放在表单或内容区顶部。
        </SuAlert>
        <SuAlert type="success" title="保存成功" closable>
          配置已经更新，关闭按钮会触发组件内部隐藏。
        </SuAlert>
        <SuAlert
          type="warning"
          title="需要确认"
          description="当前操作会影响后续发布流程，请确认信息完整。"
        />
        <SuAlert type="error" :show-icon="false">
          这是一条不展示图标的错误提示。
        </SuAlert>
      </div>
    </section>

    <section id="message" class="panel">
      <h2>消息</h2>
      <div class="message-demo">
        <SuButton type="primary" @click="showTopMessage">
          显示顶部消息
        </SuButton>
        <span>点击后消息会固定在页面顶部，并于 3 秒后自动消失</span>
      </div>
    </section>

    <section id="notification" class="panel">
      <h2>通知</h2>
      <div class="notification-demo">
        <SuButton type="primary" @click="showNotification('top-right')">
          右上通知
        </SuButton>
        <SuButton variant="outline" @click="showNotification('bottom-left')">
          左下通知
        </SuButton>
        <span>通知用于承载标题和描述，适合较完整的系统反馈</span>
      </div>
    </section>

    <section id="dialog" class="panel">
      <h2>对话框</h2>
      <div class="dialog-demo">
        <SuButton type="primary" @click="basicDialogVisible = true">
          基础对话框
        </SuButton>
        <SuButton variant="outline" @click="customDialogVisible = true">
          自定义页脚
        </SuButton>
        <SuButton @click="asyncDialogVisible = true">异步确认</SuButton>
      </div>

      <SuDialog
        v-model="basicDialogVisible"
        title="确认发布"
        @confirm="confirmBasicDialog"
      >
        发布后内容会同步到线上环境，请确认当前配置已经完成校验。
      </SuDialog>

      <SuDialog
        v-model="customDialogVisible"
        title="编辑说明"
        width="640px"
        :show-footer="false"
      >
        <p class="dialog-demo-description">
          对话框支持自定义底部区域，适合放置更多业务操作。
        </p>
        <template #footer>
          <SuButton @click="customDialogVisible = false">稍后处理</SuButton>
          <SuButton variant="outline" @click="customDialogVisible = false">
            仅保存草稿
          </SuButton>
          <SuButton type="primary" @click="confirmCustomDialog">
            保存并提交
          </SuButton>
        </template>
      </SuDialog>

      <SuDialog
        v-model="asyncDialogVisible"
        title="删除成员"
        confirm-text="确认删除"
        :confirm-loading="dialogConfirmLoading"
        :close-on-click-mask="false"
        @confirm="confirmAsyncDialog"
      >
        当前操作需要服务端确认，确认过程中会保持弹窗打开并展示加载状态。
      </SuDialog>
    </section>

    <section id="drawer" class="panel">
      <h2>抽屉</h2>
      <div class="drawer-demo">
        <SuButton type="primary" @click="basicDrawerVisible = true">
          基础抽屉
        </SuButton>
        <SuButton variant="outline" @click="filterDrawerVisible = true">
          左侧筛选
        </SuButton>
        <SuButton @click="asyncDrawerVisible = true">异步保存</SuButton>
      </div>

      <SuDrawer
        v-model="basicDrawerVisible"
        title="任务详情"
        @confirm="confirmBasicDrawer"
      >
        <div class="drawer-demo-content">
          <p>抽屉从页面边缘滑出，适合展示详情、配置项或短流程编辑。</p>
          <SuDescriptions :column="1" border size="small">
            <SuDescriptionsItem label="任务">组件文档补充</SuDescriptionsItem>
            <SuDescriptionsItem label="负责人">苏苏</SuDescriptionsItem>
            <SuDescriptionsItem label="状态">
              <SuTag size="small" type="primary">处理中</SuTag>
            </SuDescriptionsItem>
          </SuDescriptions>
        </div>
      </SuDrawer>

      <SuDrawer
        v-model="filterDrawerVisible"
        title="筛选条件"
        placement="left"
        size="360px"
        :show-footer="false"
      >
        <div class="drawer-demo-content">
          <SuForm label-position="top">
            <SuFormItem label="关键词">
              <SuInput placeholder="请输入关键词" />
            </SuFormItem>
            <SuFormItem label="状态">
              <SuSelect placeholder="请选择状态">
                <SuOption value="enabled" label="启用" />
                <SuOption value="disabled" label="停用" />
              </SuSelect>
            </SuFormItem>
          </SuForm>
        </div>
        <template #footer>
          <SuButton @click="filterDrawerVisible = false">重置</SuButton>
          <SuButton type="primary" @click="confirmFilterDrawer">
            应用筛选
          </SuButton>
        </template>
      </SuDrawer>

      <SuDrawer
        v-model="asyncDrawerVisible"
        title="保存配置"
        placement="bottom"
        size="42vh"
        confirm-text="保存"
        :confirm-loading="drawerConfirmLoading"
        :close-on-click-mask="false"
        @confirm="confirmAsyncDrawer"
      >
        保存过程中会保持抽屉打开，并在确认按钮上展示加载状态。
      </SuDrawer>
    </section>

    <section id="text" class="panel">
      <h2>文本</h2>
      <div class="text-demo">
        <SuText tag="p" size="large" weight="semibold">
          组件库里的正文、状态文案和辅助说明可以统一使用 Text。
        </SuText>
        <SuSpace wrap>
          <SuText>默认文本</SuText>
          <SuText type="primary">主要文本</SuText>
          <SuText type="success">成功文本</SuText>
          <SuText type="warning">警告文本</SuText>
          <SuText type="error">错误文本</SuText>
          <SuText type="info">信息文本</SuText>
          <SuText type="muted">辅助文本</SuText>
        </SuSpace>
        <SuSpace wrap>
          <SuText size="small">小号文本</SuText>
          <SuText>默认尺寸</SuText>
          <SuText size="large">大号文本</SuText>
          <SuText weight="bold">加粗文本</SuText>
          <SuText underline>下划线</SuText>
          <SuText delete>删除线</SuText>
          <SuText italic>斜体</SuText>
        </SuSpace>
        <SuText class="text-demo-ellipsis" block ellipsis>
          这是一段很长的单行文本，用于展示超出容器宽度后自动省略的效果。
        </SuText>
        <SuText tag="p" type="muted" block :line-clamp="2">
          多行省略适合用于卡片摘要、列表说明或表格内的长文本展示。组件会限制显示行数，避免内容撑开布局。
        </SuText>
      </div>
    </section>

    <section id="avatar" class="panel">
      <h2>头像</h2>
      <div class="avatar-demo">
        <SuAvatar :src="avatarImage" alt="苏苏头像" />
        <SuAvatar text="苏" />
        <SuAvatar text="青" shape="square" background="#0f766e" />
        <SuAvatar size="small" text="小" />
        <SuAvatar size="large" text="大" />
        <SuAvatar :size="48" text="满" background="#f97316" />
        <SuAvatar background="#7c3aed">
          <template #icon>
            <SuIcon>
              <svg viewBox="0 0 24 24">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              </svg>
            </SuIcon>
          </template>
        </SuAvatar>
      </div>
    </section>

    <section id="image" class="panel">
      <h2>图片</h2>
      <div class="image-demo">
        <SuImage
          :src="imageCover"
          alt="组件封面"
          :width="240"
          :height="150"
          preview
          @preview="handleImagePreview"
        />
        <SuImage
          :src="imageCover"
          alt="等比展示"
          :width="160"
          :height="150"
          fit="contain"
          radius="12px"
        />
        <SuImage
          src="/missing-image.png"
          alt="加载失败示例"
          :width="160"
          :height="150"
          fallback-text="暂无图片"
        />
        <SuImage
          :src="imageCover"
          alt="自定义占位"
          :width="160"
          :height="150"
          loading="lazy"
        >
          <template #placeholder>
            <span class="image-demo-placeholder">加载中</span>
          </template>
        </SuImage>
      </div>
    </section>

    <section id="badge" class="panel">
      <h2>角标</h2>
      <div class="badge-demo">
        <SuBadge :value="8">
          <SuButton>消息</SuButton>
        </SuBadge>
        <SuBadge :value="120" :max="99">
          <SuButton>待办</SuButton>
        </SuBadge>
        <SuBadge dot>
          <SuAvatar text="苏" />
        </SuBadge>
        <SuBadge value="新" type="primary">
          <SuButton variant="outline">版本</SuButton>
        </SuBadge>
        <SuBadge :value="0" show-zero type="info">
          <SuButton>归档</SuButton>
        </SuBadge>
        <SuBadge value="热" type="warning" position="bottom-right">
          <SuTag type="warning" variant="outline">活动</SuTag>
        </SuBadge>
        <SuBadge value="离线" type="info" size="small" />
        <SuBadge dot type="success" />
      </div>
    </section>

    <section id="breadcrumb" class="panel">
      <h2>面包屑</h2>
      <div class="breadcrumb-demo">
        <SuBreadcrumb :items="breadcrumbItems" />
        <SuBreadcrumb :items="breadcrumbItems" separator=">">
          <template #item="{ item, isLast }">
            <span :class="{ 'breadcrumb-demo-current': isLast }">
              {{ item.label }}
            </span>
          </template>
        </SuBreadcrumb>
      </div>
    </section>

    <section id="tag" class="panel">
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

    <section id="tooltip" class="panel">
      <h2>文字提示</h2>
      <div class="tooltip-demo">
        <SuTooltip content="保存当前页面配置">
          <SuButton type="primary">悬停提示</SuButton>
        </SuTooltip>
        <SuTooltip content="提示会显示在下方" placement="bottom">
          <SuButton>下方提示</SuButton>
        </SuTooltip>
        <SuTooltip trigger="click" content="点击页面空白处关闭">
          <SuButton variant="outline">点击提示</SuButton>
        </SuTooltip>
        <SuTooltip placement="right">
          <SuButton variant="text">插槽内容</SuButton>
          <template #content>
            <span>支持通过插槽放入更灵活的说明内容</span>
          </template>
        </SuTooltip>
        <SuTooltip content="禁用时不会展示" disabled>
          <SuButton disabled>禁用提示</SuButton>
        </SuTooltip>
      </div>
    </section>

    <section id="popover" class="panel">
      <h2>气泡卡片</h2>
      <div class="popover-demo">
        <SuPopover title="项目说明" content="这里展示更完整的补充信息。">
          <SuButton type="primary">点击查看</SuButton>
        </SuPopover>
        <SuPopover
          title="悬停触发"
          content="鼠标移入时显示，移出后关闭。"
          trigger="hover"
          placement="top"
        >
          <SuButton variant="outline">悬停查看</SuButton>
        </SuPopover>
        <SuPopover placement="right" width="320px">
          <SuButton variant="text">插槽内容</SuButton>
          <template #title>任务详情</template>
          <template #content>
            <div class="popover-demo-content">
              <p>可以放入说明、状态、按钮或其他组件。</p>
              <SuButton size="small" type="primary" @click="showTopMessage">
                立即处理
              </SuButton>
            </div>
          </template>
        </SuPopover>
        <SuPopover
          v-model:visible="popoverVisible"
          trigger="manual"
          title="受控气泡"
        >
          <SuButton @click="popoverVisible = !popoverVisible">
            受控显示
          </SuButton>
          <template #content> 当前显示状态由外部数据控制。 </template>
        </SuPopover>
        <SuPopover title="禁用气泡" content="禁用时不会展示" disabled>
          <SuButton disabled>禁用状态</SuButton>
        </SuPopover>
      </div>
    </section>

    <section id="dropdown" class="panel">
      <h2>下拉菜单</h2>
      <div class="dropdown-demo">
        <SuDropdown :options="actionOptions" @command="handleDropdownCommand">
          <SuButton type="primary">
            更多操作
            <template #suffix>
              <SuIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </SuIcon>
            </template>
          </SuButton>
        </SuDropdown>
        <SuDropdown
          :options="actionOptions"
          trigger="hover"
          placement="bottom"
          @command="handleDropdownCommand"
        >
          <SuButton variant="outline">悬停展开</SuButton>
        </SuDropdown>
        <SuDropdown>
          <SuButton variant="text">插槽菜单</SuButton>
          <template #menu>
            <button class="su-dropdown__item" type="button">自定义操作</button>
            <button class="su-dropdown__item" type="button">查看详情</button>
          </template>
        </SuDropdown>
        <SuDropdown v-model:visible="dropdownVisible" trigger="manual">
          <SuButton @click="dropdownVisible = !dropdownVisible">
            受控显示
          </SuButton>
          <template #menu>
            <button
              class="su-dropdown__item"
              type="button"
              @click="dropdownVisible = false"
            >
              关闭菜单
            </button>
          </template>
        </SuDropdown>
        <span class="dropdown-demo-status">{{ dropdownCommand }}</span>
      </div>
    </section>

    <section id="card" class="panel">
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

    <section id="collapse" class="panel">
      <h2>折叠面板</h2>
      <div class="collapse-demo">
        <SuCollapse v-model="collapseValue">
          <SuCollapseItem title="项目概览" name="overview">
            <p>当前版本聚焦基础组件、主题能力和文档体验。</p>
          </SuCollapseItem>
          <SuCollapseItem name="task">
            <template #title>任务进度</template>
            <template #extra>
              <SuTag size="small" type="primary">68%</SuTag>
            </template>
            <p>本周目标完成率稳步提升，待处理项集中在组件文档补充。</p>
          </SuCollapseItem>
          <SuCollapseItem title="审计记录" name="audit" disabled>
            <p>禁用面板不会响应点击和键盘切换。</p>
          </SuCollapseItem>
        </SuCollapse>

        <SuCollapse
          v-model="accordionValue"
          accordion
          ghost
          size="small"
          destroy-inactive-panel
        >
          <SuCollapseItem title="基础信息" name="basic">
            <p>手风琴模式同一时间只展开一个面板。</p>
          </SuCollapseItem>
          <SuCollapseItem title="权限配置" name="permission">
            <p>幽灵样式适合放在详情页或配置页的轻量分组中。</p>
          </SuCollapseItem>
        </SuCollapse>
      </div>
    </section>

    <section id="empty" class="panel">
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

    <section id="skeleton" class="panel">
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

    <section id="loading" class="panel">
      <h2>加载</h2>
      <div class="loading-demo">
        <div class="loading-demo-inline">
          <SuLoading size="small" text="加载中" />
          <SuLoading text="正在同步" />
          <SuLoading size="large">提交数据</SuLoading>
        </div>
        <div class="loading-demo-box">
          <p>当前区域正在刷新数据，遮罩会覆盖容器内容。</p>
          <SuLoading overlay blur text="加载内容" />
        </div>
        <div class="loading-demo-box">
          <p>关闭 loading 后不会渲染加载元素。</p>
          <SuLoading :loading="false" text="不会显示" />
        </div>
      </div>
    </section>

    <section id="divider" class="panel">
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

    <section id="space" class="panel">
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

    <section id="slider" class="panel">
      <h2>滑块</h2>
      <div class="slider-demo">
        <SuSlider v-model="sliderValue" />
        <SuSlider
          v-model="volumeValue"
          :step="10"
          show-stops
          :marks="{ 0: '静音', 50: '适中', 100: '最大' }"
          :format-tooltip="formatPercent"
        />
        <SuSlider v-model="rangeSliderValue" range />
        <SuSlider
          v-model="temperatureValue"
          :min="16"
          :max="32"
          :step="0.5"
          size="large"
          :format-tooltip="formatTemperature"
        />
        <SuSlider :model-value="30" size="small" readonly />
        <SuSlider :model-value="42" disabled />
      </div>
    </section>

    <section id="menu" class="panel">
      <h2>菜单</h2>
      <div class="menu-demo">
        <SuMenu
          v-model:selected-key="selectedMenuKey"
          v-model:open-keys="openMenuKeys"
          :items="menuItems"
        />

        <SuMenu :items="menuItems" mode="horizontal" selected-key="overview" />

        <SuMenu :items="menuItems" default-open-all size="small" accordion>
          <template #default="{ item }">
            <span class="menu-demo-node">
              <span>{{ item.label }}</span>
              <SuTag
                v-if="item.disabled"
                size="small"
                type="info"
                variant="outline"
              >
                禁用
              </SuTag>
            </span>
          </template>
        </SuMenu>
      </div>
    </section>

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

    <section id="select" class="panel">
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

    <section id="cascader" class="panel">
      <h2>级联选择</h2>
      <div class="cascader-demo">
        <SuCascader
          v-model="regionValue"
          :options="regionOptions"
          placeholder="请选择地区"
          clearable
        />
        <SuCascader
          v-model="categoryValue"
          :options="categoryOptions"
          change-on-select
          size="small"
        />
        <SuCascader
          :options="regionOptions"
          status="success"
          :model-value="['zhejiang', 'hangzhou', 'xihu']"
        />
        <SuCascader
          :options="regionOptions"
          status="warning"
          placeholder="警告状态"
        />
        <SuCascader disabled placeholder="禁用级联选择" />
      </div>
    </section>

    <section id="autocomplete" class="panel">
      <h2>自动完成</h2>
      <div class="autocomplete-demo">
        <SuAutocomplete
          v-model="autocompleteCityValue"
          :options="cityOptions"
          placeholder="请输入城市"
          clearable
        />
        <SuAutocomplete
          v-model="searchKeyword"
          :fetch-suggestions="fetchComponentSuggestions"
          placeholder="搜索组件"
        />
        <SuAutocomplete
          :options="cityOptions"
          :filterable="false"
          size="small"
          placeholder="聚焦展示全部城市"
        />
        <SuAutocomplete status="warning" placeholder="警告状态" />
        <SuAutocomplete disabled placeholder="禁用自动完成" />
      </div>
    </section>

    <section id="tabs" class="panel">
      <h2>标签页</h2>
      <div class="tabs-demo">
        <SuTabs v-model="tabsValue">
          <SuTabPane label="概览" name="overview">
            <div class="tabs-demo-panel">
              <strong>项目概览</strong>
              <p>当前版本聚焦基础组件、主题能力和文档体验。</p>
            </div>
          </SuTabPane>
          <SuTabPane label="成员" name="members">
            <div class="tabs-demo-panel">
              <strong>成员协作</strong>
              <p>可以把表格、描述列表或表单放入标签页面板中。</p>
            </div>
          </SuTabPane>
          <SuTabPane label="审计" name="audit" disabled>
            禁用标签页不会响应点击和键盘切换。
          </SuTabPane>
          <template #extra>
            <SuButton size="small" variant="text" @click="showTopMessage">
              新增
            </SuButton>
          </template>
        </SuTabs>

        <SuTabs type="card" size="small" placement="left" model-value="basic">
          <SuTabPane label="基础信息" name="basic">
            <div class="tabs-demo-panel">
              <strong>基础信息</strong>
              <p>卡片样式适合配置页、详情页和分组表单。</p>
            </div>
          </SuTabPane>
          <SuTabPane name="permission">
            <template #label>权限</template>
            <div class="tabs-demo-panel">
              <strong>权限配置</strong>
              <p>标签标题支持插槽，便于加入徽标、图标或自定义结构。</p>
            </div>
          </SuTabPane>
        </SuTabs>
      </div>
    </section>

    <section id="segmented" class="panel">
      <h2>分段控制器</h2>
      <div class="segmented-demo">
        <SuSegmented
          v-model="segmentedRangeValue"
          :options="segmentedRangeOptions"
          name="range"
        />
        <SuSegmented
          v-model="segmentedViewValue"
          :options="segmentedViewOptions"
        />
        <SuSegmented
          size="small"
          model-value="day"
          :options="segmentedRangeOptions"
        />
        <SuSegmented
          size="large"
          model-value="month"
          :options="segmentedRangeOptions"
        />
        <SuSegmented
          disabled
          model-value="week"
          :options="segmentedRangeOptions"
        />
        <SuSegmented block model-value="grid" :options="segmentedViewOptions" />
      </div>
    </section>

    <section id="color-picker" class="panel">
      <h2>颜色选择器</h2>
      <div class="color-picker-demo">
        <SuColorPicker
          v-model="colorValue"
          clearable
          placeholder="请选择颜色"
        />
        <SuColorPicker
          v-model="alphaColorValue"
          show-alpha
          format="rgb"
          placeholder="支持透明度"
        />
        <SuColorPicker size="small" model-value="#52c41a" />
        <SuColorPicker size="large" model-value="#faad14" />
        <SuColorPicker status="success" model-value="#52c41a" />
        <SuColorPicker status="warning" placeholder="警告状态" />
        <SuColorPicker status="error" placeholder="错误状态" />
        <SuColorPicker disabled placeholder="禁用颜色选择器" />
        <SuColorPicker readonly model-value="#722ed1" />
      </div>
    </section>

    <section id="calendar" class="panel">
      <h2>日历</h2>
      <div class="calendar-demo">
        <SuCalendar v-model="calendarValue" />
        <SuCalendar
          v-model="limitedCalendarValue"
          min="2026-06-01"
          max="2026-06-30"
          :disabled-date="disableWeekend"
          :show-adjacent-months="false"
        />
        <SuCalendar size="small" model-value="2026-06-15" />
        <SuCalendar size="large" model-value="2026-06-15" readonly />
      </div>
    </section>

    <section id="date-picker" class="panel">
      <h2>日期选择器</h2>
      <div class="date-picker-demo">
        <SuDatePicker v-model="dateValue" clearable placeholder="请选择日期" />
        <SuDatePicker
          v-model="limitedDateValue"
          min="2026-06-01"
          max="2026-06-30"
          placeholder="限制在 2026 年 6 月"
        />
        <SuDatePicker
          :model-value="dateValue"
          :disabled-date="disableWeekend"
          placeholder="禁用周末"
        />
        <SuDatePicker size="small" model-value="2026-06-27" />
        <SuDatePicker size="large" model-value="2026-06-27" />
        <SuDatePicker status="success" model-value="2026-06-27" />
        <SuDatePicker status="warning" placeholder="警告状态" />
        <SuDatePicker status="error" placeholder="错误状态" />
        <SuDatePicker disabled placeholder="禁用日期选择器" />
        <SuDatePicker readonly model-value="2026-06-27" />
      </div>
    </section>

    <section id="date-range-picker" class="panel">
      <h2>日期范围选择器</h2>
      <div class="date-range-picker-demo">
        <SuDateRangePicker
          v-model="dateRangeValue"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <SuDateRangePicker
          v-model="limitedDateRangeValue"
          min="2026-06-01"
          max="2026-06-30"
          start-placeholder="开始"
          end-placeholder="结束"
        />
        <SuDateRangePicker
          :model-value="dateRangeValue"
          :disabled-date="disableRangeWeekend"
          start-placeholder="禁用周末"
          end-placeholder="禁用周末"
        />
        <SuDateRangePicker
          size="small"
          :model-value="['2026-06-01', '2026-06-15']"
        />
        <SuDateRangePicker
          size="large"
          :model-value="['2026-06-01', '2026-06-15']"
        />
        <SuDateRangePicker
          status="success"
          :model-value="['2026-06-01', '2026-06-15']"
        />
        <SuDateRangePicker status="warning" start-placeholder="警告状态" />
        <SuDateRangePicker status="error" start-placeholder="错误状态" />
        <SuDateRangePicker disabled start-placeholder="禁用日期范围" />
        <SuDateRangePicker
          readonly
          :model-value="['2026-06-01', '2026-06-15']"
        />
      </div>
    </section>

    <section id="time-picker" class="panel">
      <h2>时间选择器</h2>
      <div class="time-picker-demo">
        <SuTimePicker v-model="timeValue" clearable placeholder="请选择时间" />
        <SuTimePicker
          v-model="shortTimeValue"
          format="HH:mm"
          :minute-step="15"
          placeholder="选择小时和分钟"
        />
        <SuTimePicker
          v-model="limitedTimeValue"
          min="09:00:00"
          max="18:00:00"
          placeholder="限制在工作时间"
        />
        <SuTimePicker
          :model-value="timeValue"
          :disabled-time="disableLunchTime"
          placeholder="禁用 12 点"
        />
        <SuTimePicker size="small" model-value="09:30:00" />
        <SuTimePicker size="large" model-value="09:30:00" />
        <SuTimePicker status="success" model-value="09:30:00" />
        <SuTimePicker status="warning" placeholder="警告状态" />
        <SuTimePicker status="error" placeholder="错误状态" />
        <SuTimePicker disabled placeholder="禁用时间选择器" />
        <SuTimePicker readonly model-value="09:30:00" />
      </div>
    </section>

    <section id="time-range-picker" class="panel">
      <h2>时间范围选择器</h2>
      <div class="time-range-picker-demo">
        <SuTimeRangePicker
          v-model="timeRangeValue"
          clearable
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
        <SuTimeRangePicker
          v-model="shortTimeRangeValue"
          format="HH:mm"
          :minute-step="30"
          start-placeholder="开始"
          end-placeholder="结束"
        />
        <SuTimeRangePicker
          v-model="limitedTimeRangeValue"
          min="09:00:00"
          max="18:00:00"
          start-placeholder="工作开始"
          end-placeholder="工作结束"
        />
        <SuTimeRangePicker
          :model-value="timeRangeValue"
          :disabled-time="disableRangeLunchTime"
          start-placeholder="禁用 12 点"
          end-placeholder="禁用 12 点"
        />
        <SuTimeRangePicker
          size="small"
          :model-value="['09:00:00', '18:00:00']"
        />
        <SuTimeRangePicker
          size="large"
          :model-value="['09:00:00', '18:00:00']"
        />
        <SuTimeRangePicker
          status="success"
          :model-value="['09:00:00', '18:00:00']"
        />
        <SuTimeRangePicker status="warning" start-placeholder="警告状态" />
        <SuTimeRangePicker status="error" start-placeholder="错误状态" />
        <SuTimeRangePicker disabled start-placeholder="禁用时间范围" />
        <SuTimeRangePicker readonly :model-value="['09:00:00', '18:00:00']" />
      </div>
    </section>

    <section id="table" class="panel">
      <h2>表格</h2>
      <div class="table-demo">
        <SuTable
          :data="tableData"
          :columns="tableColumns"
          row-key="id"
          stripe
          border
        />

        <SuTable :data="tableData" row-key="id" size="small" max-height="180px">
          <SuTableColumn prop="name" label="成员" width="120" />
          <SuTableColumn prop="role" label="角色" min-width="140" />
          <SuTableColumn prop="status" label="状态" align="center">
            <template #default="{ value }">
              <SuTag size="small" :type="value === '在线' ? 'success' : 'info'">
                {{ value }}
              </SuTag>
            </template>
          </SuTableColumn>
          <SuTableColumn prop="score" label="评分" align="right">
            <template #default="{ value }"> {{ value }} 分 </template>
          </SuTableColumn>
        </SuTable>

        <SuTable :columns="tableColumns" empty-text="暂无成员" />
      </div>
    </section>

    <section id="tree" class="panel">
      <h2>树</h2>
      <div class="tree-demo">
        <SuTree
          v-model:selected-key="selectedTreeKey"
          v-model:expanded-keys="expandedTreeKeys"
          :data="treeData"
        />

        <SuTree
          v-model:checked-keys="checkedTreeKeys"
          :data="treeData"
          checkable
          default-expand-all
        />

        <SuTree :data="treeData" default-expand-all size="small">
          <template #default="{ node }">
            <span class="tree-demo-node">
              <span>{{ node.label }}</span>
              <SuTag
                v-if="node.disabled"
                size="small"
                type="info"
                variant="outline"
              >
                禁用
              </SuTag>
            </span>
          </template>
        </SuTree>
      </div>
    </section>

    <section id="transfer" class="panel">
      <h2>穿梭框</h2>
      <div class="transfer-demo">
        <SuTransfer
          v-model="transferValue"
          :data="transferData"
          :titles="['可选组件', '已选组件']"
        />

        <SuTransfer
          v-model="filteredTransferValue"
          :data="workflowTransferData"
          :titles="['待排期', '已排期']"
          filterable
          size="small"
        />

        <SuTransfer
          v-model="customTransferValue"
          :data="workflowTransferData"
          :titles="['全部流程', '当前流程']"
        >
          <template #default="{ option }">
            <span class="transfer-demo-option">
              <strong>{{ option.label }}</strong>
              <span>{{ option.description }}</span>
            </span>
          </template>
        </SuTransfer>
      </div>
    </section>

    <section id="descriptions" class="panel">
      <h2>描述列表</h2>
      <div class="descriptions-demo">
        <SuDescriptions title="用户信息">
          <SuDescriptionsItem label="用户名">苏苏</SuDescriptionsItem>
          <SuDescriptionsItem label="角色">设计师</SuDescriptionsItem>
          <SuDescriptionsItem label="团队">体验组</SuDescriptionsItem>
          <SuDescriptionsItem label="状态">
            <SuTag size="small" type="success">在线</SuTag>
          </SuDescriptionsItem>
          <SuDescriptionsItem label="邮箱" :span="2">
            susu@example.com
          </SuDescriptionsItem>
        </SuDescriptions>

        <SuDescriptions title="项目信息" :column="2" border label-width="88px">
          <template #extra>
            <SuButton size="small" variant="text" @click="showTopMessage">
              编辑
            </SuButton>
          </template>
          <SuDescriptionsItem label="项目">Susu UI</SuDescriptionsItem>
          <SuDescriptionsItem label="版本">0.1.0</SuDescriptionsItem>
          <SuDescriptionsItem label="状态">
            <SuTag size="small" type="primary">开发中</SuTag>
          </SuDescriptionsItem>
          <SuDescriptionsItem label="负责人">青禾</SuDescriptionsItem>
          <SuDescriptionsItem label="备注" :span="2">
            适合展示详情页、用户资料、订单信息和只读表单内容。
          </SuDescriptionsItem>
        </SuDescriptions>

        <SuDescriptions
          size="small"
          layout="vertical"
          :column="3"
          border
          :colon="false"
        >
          <SuDescriptionsItem label="创建时间"> 2026-06-27 </SuDescriptionsItem>
          <SuDescriptionsItem label="更新时间"> 2026-06-27 </SuDescriptionsItem>
          <SuDescriptionsItem label="发布状态">草稿</SuDescriptionsItem>
        </SuDescriptions>
      </div>
    </section>

    <section id="pagination" class="panel">
      <h2>分页</h2>
      <div class="pagination-demo">
        <SuPagination v-model="paginationPage" :total="80" />
        <SuPagination
          v-model="paginationPage"
          v-model:page-size="paginationSize"
          :total="236"
          show-total
          show-size-changer
          show-quick-jumper
        />
        <SuPagination
          v-model="paginationPage"
          :total="236"
          size="small"
          simple
        />
        <SuPagination :total="80" disabled />
      </div>
    </section>

    <section id="progress" class="panel">
      <h2>进度条</h2>
      <div class="progress-demo">
        <SuProgress :percentage="36" />
        <SuProgress :percentage="100" status="success" />
        <SuProgress :percentage="64" status="warning" />
        <SuProgress :percentage="28" status="error" />
        <SuProgress
          :percentage="uploadProgress"
          text-inside
          :stroke-width="18"
          :format="formatUploadProgress"
        />
        <SuProgress indeterminate :show-text="false" />
        <div class="progress-demo-circles">
          <SuProgress type="circle" :percentage="72" />
          <SuProgress type="circle" :percentage="100" status="success" />
          <SuProgress
            type="circle"
            :percentage="42"
            status="error"
            :width="96"
            :stroke-width="6"
          />
        </div>
      </div>
    </section>

    <section id="steps" class="panel">
      <h2>步骤条</h2>
      <div class="steps-demo">
        <SuSteps
          :items="publishSteps"
          :current="stepsCurrent"
          clickable
          @change="handleStepChange"
        />

        <SuSteps
          :items="reviewSteps"
          :current="1"
          direction="vertical"
          status="error"
        />

        <SuSteps :items="simpleSteps" current="review" size="small" simple />
      </div>
    </section>

    <section id="timeline" class="panel">
      <h2>时间轴</h2>
      <div class="timeline-demo">
        <SuTimeline :items="timelineItems" />

        <SuTimeline
          :items="alternateTimelineItems"
          position="alternate"
          size="small"
        >
          <template #dot="{ index }">
            {{ index + 1 }}
          </template>
        </SuTimeline>

        <SuTimeline :items="timelineItems" position="right" reverse hide-tail />
      </div>
    </section>

    <section id="upload" class="panel">
      <h2>上传</h2>
      <div class="upload-demo">
        <SuUpload
          v-model="uploadFiles"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          :limit="3"
          :request="mockUploadRequest"
          :before-upload="limitUploadSize"
        >
          <SuButton type="primary">选择文件</SuButton>
          <template #tip>支持 PNG、JPG、PDF，单个文件不超过 2MB</template>
        </SuUpload>

        <SuUpload
          v-model="pictureUploadFiles"
          drag
          multiple
          list-type="picture"
          accept="image/*"
          :limit="4"
          :request="mockUploadRequest"
        />

        <SuUpload disabled>
          <SuButton disabled>禁用上传</SuButton>
        </SuUpload>
      </div>
    </section>

    <section id="checkbox" class="panel">
      <h2>复选框</h2>
      <div class="checkbox-demo">
        <SuCheckbox v-model="agreementValue">同意服务协议</SuCheckbox>
        <SuCheckbox
          v-model="featureValue"
          true-value="enabled"
          false-value="disabled"
        >
          启用高级功能
        </SuCheckbox>
        <SuCheckbox v-model="indeterminateValue" indeterminate>
          部分选中
        </SuCheckbox>
        <SuCheckbox size="small" model-value>小尺寸</SuCheckbox>
        <SuCheckbox size="large" model-value>大尺寸</SuCheckbox>
        <SuCheckbox disabled>禁用状态</SuCheckbox>
      </div>
    </section>

    <section id="radio" class="panel">
      <h2>单选框</h2>
      <div class="radio-demo">
        <SuRadioGroup v-model="planValue" name="plan">
          <SuRadioButton value="daily">每日</SuRadioButton>
          <SuRadioButton value="weekly">每周</SuRadioButton>
          <SuRadioButton value="monthly">每月</SuRadioButton>
        </SuRadioGroup>
        <SuRadioGroup v-model="channelValue" direction="vertical" size="small">
          <SuRadioButton value="email">邮件通知</SuRadioButton>
          <SuRadioButton value="sms">短信通知</SuRadioButton>
          <SuRadioButton value="webhook" disabled>Webhook</SuRadioButton>
        </SuRadioGroup>
        <SuRadioButton model-value="custom" value="custom" size="large">
          单独使用
        </SuRadioButton>
        <SuRadioGroup model-value="disabled" disabled>
          <SuRadioButton value="enabled">启用</SuRadioButton>
          <SuRadioButton value="disabled">停用</SuRadioButton>
        </SuRadioGroup>
      </div>
    </section>

    <section id="switch" class="panel">
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

    <section id="button" class="panel">
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
  </div>
</template>
