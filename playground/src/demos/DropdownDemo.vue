<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const dropdownVisible = ref(false)
const dropdownCommand = ref('尚未选择操作')

const actionOptions = [
  { label: '编辑资料', value: 'edit' },
  { label: '复制链接', value: 'copy' },
  { label: '导出数据', value: 'export' },
  { label: '删除项目', value: 'delete', divided: true, disabled: true },
]

function handleDropdownCommand(value: string | number) {
  dropdownCommand.value = `已选择：${value}`
  showTopMessage()
}
</script>

<template>
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
        <SuButton @click="dropdownVisible = !dropdownVisible"> 受控显示 </SuButton>
        <template #menu>
          <button class="su-dropdown__item" type="button" @click="dropdownVisible = false">
            关闭菜单
          </button>
        </template>
      </SuDropdown>
      <span class="dropdown-demo-status">{{ dropdownCommand }}</span>
    </div>
  </section>
</template>
<style scoped>
.dropdown-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.dropdown-demo-status {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
}
</style>
