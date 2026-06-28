<script setup lang="ts">
import { ref } from 'vue'

const cityValue = ref('')
const statusValue = ref('enabled')
const monthValue = ref(2)

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
</script>

<template>
  <section id="select" class="panel">
    <h2>选择器</h2>
    <div class="select-demo">
      <SuSelect v-model="cityValue" :options="cityOptions" placeholder="请选择城市" clearable />
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
</template>
<style scoped>
.select-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .select-demo {
    grid-template-columns: 1fr;
  }
}
</style>
