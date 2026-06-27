<script setup lang="ts">
import type { TransferOption } from '@susu-ui/vue'
import { ref } from 'vue'

const transferValue = ref<(string | number)[]>(['table', 'tree'])
const filteredTransferValue = ref<(string | number)[]>(['design'])
const customTransferValue = ref<(string | number)[]>(['publish'])

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
</script>

<template>
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
</template>
<style scoped>
.transfer-demo {
  display: grid;
  max-width: 920px;
  gap: 18px;
}

.transfer-demo-option {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.transfer-demo-option span {
  overflow: hidden;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
