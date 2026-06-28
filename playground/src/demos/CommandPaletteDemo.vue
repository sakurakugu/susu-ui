<script setup lang="ts">
import { ref } from 'vue'
import type { CommandPaletteOption } from '@susu-ui/vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const basicVisible = ref(false)
const customVisible = ref(false)
const controlledVisible = ref(false)
const controlledQuery = ref('客户')
const selectedCommand = ref('暂未执行命令')

const commands: CommandPaletteOption[] = [
  {
    label: '打开销售工作台',
    value: 'sales-dashboard',
    description: '查看今日线索、商机和回款提醒',
    group: '导航',
    shortcut: ['G', 'S'],
  },
  {
    label: '进入订单中心',
    value: 'orders',
    description: '处理待发货订单和售后申请',
    group: '导航',
    shortcut: ['G', 'O'],
  },
  {
    label: '新建客户档案',
    value: 'create-customer',
    description: '录入客户公司、联系人和跟进负责人',
    group: '快捷操作',
    shortcut: 'N',
  },
  {
    label: '分配线索',
    value: 'assign-lead',
    description: '将线索分配给可跟进的销售顾问',
    group: '快捷操作',
    shortcut: 'A',
  },
  {
    label: '导出本月报表',
    value: 'export-report',
    description: '下载经营分析需要的 Excel 文件',
    group: '数据',
  },
  {
    label: '删除客户',
    value: 'delete-customer',
    description: '需要管理员权限，当前账号不可用',
    group: '危险操作',
    disabled: true,
  },
]

function handleSelect(option: CommandPaletteOption) {
  selectedCommand.value = `已执行：${option.label}`
  showTopMessage()
}
</script>

<template>
  <section id="command-palette" class="panel">
    <h2>命令面板</h2>

    <div class="command-palette-demo">
      <SuButton type="primary" @click="basicVisible = true"> 打开命令面板 </SuButton>
      <SuButton variant="outline" @click="customVisible = true"> 自定义命令项 </SuButton>
      <SuButton @click="controlledVisible = true">受控搜索词</SuButton>
    </div>

    <p class="command-palette-demo__result">{{ selectedCommand }}</p>

    <SuCommandPalette
      v-model="basicVisible"
      :options="commands"
      title="工作台命令"
      placeholder="搜索页面、客户或操作"
      @select="handleSelect"
    />

    <SuCommandPalette
      v-model="customVisible"
      :options="commands"
      title="运营命令"
      empty-text="没有找到匹配的运营命令"
      @select="handleSelect"
    >
      <template #option="{ option }">
        <span class="command-palette-demo__custom-option">
          <span class="command-palette-demo__custom-main">
            <span class="command-palette-demo__custom-label">
              {{ option.label }}
            </span>
            <span class="command-palette-demo__custom-description">
              {{ option.description }}
            </span>
          </span>
          <span class="command-palette-demo__custom-group">
            {{ option.group }}
          </span>
        </span>
      </template>
    </SuCommandPalette>

    <SuCommandPalette
      v-model="controlledVisible"
      v-model:query="controlledQuery"
      :options="commands"
      title="客户相关命令"
      :clear-query-on-close="false"
      @select="handleSelect"
    />
  </section>
</template>

<style scoped>
.command-palette-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.command-palette-demo__result {
  margin: 12px 0 0;
  color: var(--su-color-text-muted);
}

.command-palette-demo__custom-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.command-palette-demo__custom-main {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.command-palette-demo__custom-label {
  font-weight: 600;
}

.command-palette-demo__custom-description {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.command-palette-demo__custom-group {
  flex: none;
  color: var(--su-color-primary);
  font-size: var(--su-font-size-sm);
}
</style>
