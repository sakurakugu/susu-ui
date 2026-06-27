<script setup lang="ts">
import { ref } from 'vue'

const regionValue = ref<(string | number)[]>([])
const categoryValue = ref<(string | number)[]>(['docs', 'components'])

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
</script>

<template>
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
</template>
<style scoped>
.cascader-demo {
  display: grid;
  max-width: 720px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 640px) {
  .cascader-demo {
    grid-template-columns: 1fr;
  }
}
</style>
