<script setup lang="ts">
import { ref } from 'vue'

const autocompleteCityValue = ref('')
const searchKeyword = ref('')

const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou', disabled: true },
]

const searchOptions = [
  { label: 'Button 按钮', value: 'button' },
  { label: 'Input 输入框', value: 'input' },
  { label: 'Select 选择器', value: 'select' },
  { label: 'Autocomplete 自动完成', value: 'autocomplete' },
]

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
</script>

<template>
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
</template>
<style scoped>
.autocomplete-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .autocomplete-demo {
    grid-template-columns: 1fr;
  }
}
</style>
