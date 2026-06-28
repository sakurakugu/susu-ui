<script setup lang="ts">
const customers = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `企业客户 ${index + 1}`,
  owner: ['苏苏', '小满', '青禾', '知夏'][index % 4],
  stage: ['初步沟通', '方案确认', '合同审批', '已签约'][index % 4],
  amount: 12000 + index * 128,
}))

const activityItems = Array.from({ length: 300 }, (_, index) => ({
  id: `activity-${index + 1}`,
  title: `工单 ${String(index + 1).padStart(3, '0')}`,
  description: ['客户补充了发票信息', '销售提交了折扣申请', '实施团队更新了交付计划'][index % 3],
  time: `${9 + (index % 8)}:${index % 2 === 0 ? '00' : '30'}`,
}))
</script>

<template>
  <section id="virtual-list" class="panel">
    <h2>虚拟列表</h2>
    <div class="virtual-list-demo">
      <SuVirtualList :items="customers" :height="320" :item-height="56" item-key="id" :buffer="4">
        <template #default="{ item, index }">
          <div class="virtual-list-demo__customer">
            <div>
              <strong>{{ item.name }}</strong>
              <span>负责人：{{ item.owner }}</span>
            </div>
            <div>
              <SuTag size="small" type="primary">{{ item.stage }}</SuTag>
              <span class="virtual-list-demo__amount"> ¥{{ item.amount.toLocaleString() }} </span>
              <span class="virtual-list-demo__index">#{{ index + 1 }}</span>
            </div>
          </div>
        </template>
      </SuVirtualList>

      <SuVirtualList
        :items="activityItems"
        height="260px"
        :item-height="64"
        item-key="id"
        :buffer="3"
      >
        <template #default="{ item }">
          <div class="virtual-list-demo__activity">
            <div>
              <strong>{{ item.title }}</strong>
              <span>{{ item.description }}</span>
            </div>
            <time>{{ item.time }}</time>
          </div>
        </template>
      </SuVirtualList>

      <SuVirtualList :items="[]" :height="160" empty-text="暂无匹配记录">
        <template #empty>当前筛选条件下没有客户记录</template>
      </SuVirtualList>
    </div>
  </section>
</template>

<style scoped>
.virtual-list-demo {
  display: grid;
  max-width: 920px;
  gap: 16px;
}

.virtual-list-demo__customer,
.virtual-list-demo__activity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--su-space-md);
  border-bottom: 1px solid var(--su-color-border);
  gap: var(--su-space-md);
}

.virtual-list-demo__customer > div,
.virtual-list-demo__activity > div {
  display: flex;
  min-width: 0;
  gap: var(--su-space-sm);
}

.virtual-list-demo__customer > div:first-child,
.virtual-list-demo__activity > div {
  flex-direction: column;
  gap: 2px;
}

.virtual-list-demo__customer strong,
.virtual-list-demo__activity strong {
  color: var(--su-color-text);
}

.virtual-list-demo__customer span,
.virtual-list-demo__activity span,
.virtual-list-demo__activity time {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.virtual-list-demo__amount {
  min-width: 88px;
  text-align: right;
}

.virtual-list-demo__index {
  min-width: 44px;
  text-align: right;
}
</style>
