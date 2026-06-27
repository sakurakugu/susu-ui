<template>
  <section id="list" class="panel">
    <h2>列表</h2>

    <div class="list-demo">
      <SuList title="客户跟进" hoverable>
        <SuListItem
          v-for="customer in customers"
          :key="customer.name"
          :title="customer.name"
          :description="customer.description"
        >
          <template #avatar>
            <SuAvatar :name="customer.name" />
          </template>
          <template #actions>
            <SuButton size="small" type="primary">记录结果</SuButton>
            <SuButton size="small" variant="outline">查看详情</SuButton>
          </template>
          <template #extra>
            <SuTag :type="customer.type">{{ customer.status }}</SuTag>
          </template>
        </SuListItem>
      </SuList>

      <SuGrid min-item-width="220px" :gap="16">
        <SuList title="同步任务" size="small" loading />
        <SuList title="审批记录" size="small" empty-text="暂无审批记录" />
      </SuGrid>
    </div>
  </section>
</template>

<script setup lang="ts">
const customers = [
  {
    name: '星河制造',
    description: '本周确认二期扩容方案，负责人：青禾',
    status: '高意向',
    type: 'success' as const,
  },
  {
    name: '云启科技',
    description: '等待采购部门反馈合同条款，负责人：小满',
    status: '跟进中',
    type: 'primary' as const,
  },
  {
    name: '北辰零售',
    description: '需要补充门店数据迁移评估，负责人：苏苏',
    status: '待确认',
    type: 'warning' as const,
  },
]
</script>

<style scoped>
.list-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
