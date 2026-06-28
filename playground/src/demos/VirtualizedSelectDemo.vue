<script setup lang="ts">
import { ref } from 'vue'

const ownerValue = ref(320)
const cityValue = ref('')
const disabledValue = ref(8)

const owners = Array.from({ length: 1200 }, (_, index) => ({
  label: `客户经理 ${String(index + 1).padStart(4, '0')}`,
  value: index + 1,
  team: ['华东销售组', '华北销售组', '行业大客户组', '续费运营组'][index % 4],
  disabled: index % 97 === 0,
}))

const cities = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou', disabled: true },
]
</script>

<template>
  <section id="virtualized-select" class="panel">
    <h2>虚拟选择器</h2>
    <div class="virtualized-select-demo">
      <SuVirtualizedSelect
        v-model="ownerValue"
        :options="owners"
        placeholder="选择客户负责人"
        clearable
        :height="280"
        :item-height="42"
      >
        <template #option="{ option, index }">
          <span class="virtualized-select-demo__option">
            <span>
              <strong>{{ option.label }}</strong>
              <small>{{ option.team }}</small>
            </span>
            <small>#{{ index + 1 }}</small>
          </span>
        </template>
      </SuVirtualizedSelect>

      <SuVirtualizedSelect
        v-model="cityValue"
        :options="cities"
        placeholder="选择交付城市"
        size="small"
        clearable
      />

      <SuVirtualizedSelect
        :model-value="disabledValue"
        :options="owners.slice(0, 12)"
        disabled
        placeholder="禁用选择器"
      />

      <SuVirtualizedSelect status="warning" :options="[]" empty-text="当前项目没有可分配成员" />
    </div>
  </section>
</template>

<style scoped>
.virtualized-select-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.virtualized-select-demo__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
  gap: var(--su-space-md);
}

.virtualized-select-demo__option > span {
  display: grid;
  min-width: 0;
}

.virtualized-select-demo__option strong,
.virtualized-select-demo__option small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtualized-select-demo__option small {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

@media (max-width: 640px) {
  .virtualized-select-demo {
    grid-template-columns: 1fr;
  }
}
</style>
