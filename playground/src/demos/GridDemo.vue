<template>
  <section id="grid" class="panel">
    <h2>网格</h2>

    <div class="grid-demo">
      <SuGrid :columns="12" :gap="[16, 16]">
        <SuGridItem :span="6">
          <div class="grid-demo__block grid-demo__block--primary">
            本月成交额
            <strong>128.6 万</strong>
          </div>
        </SuGridItem>
        <SuGridItem :span="3">
          <div class="grid-demo__block">
            新增客户
            <strong>46</strong>
          </div>
        </SuGridItem>
        <SuGridItem :span="3">
          <div class="grid-demo__block">
            待跟进
            <strong>18</strong>
          </div>
        </SuGridItem>
        <SuGridItem :span="4">
          <div class="grid-demo__block">重点商机</div>
        </SuGridItem>
        <SuGridItem :span="4">
          <div class="grid-demo__block">合同审核</div>
        </SuGridItem>
        <SuGridItem :span="4">
          <div class="grid-demo__block">回款计划</div>
        </SuGridItem>
      </SuGrid>

      <SuGrid :gap="12" min-item-width="180px" dense>
        <div v-for="item in products" :key="item" class="grid-demo__card">
          {{ item }}
        </div>
      </SuGrid>
    </div>
  </section>
</template>

<script setup lang="ts">
const products = [
  '企业版套餐',
  '增值服务',
  '私有化部署',
  '培训工作坊',
  '数据迁移',
]
</script>

<style scoped>
.grid-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-demo__block,
.grid-demo__card {
  min-height: 72px;
  padding: 14px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.grid-demo__block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  color: var(--su-color-text-muted);
}

.grid-demo__block strong {
  color: var(--su-color-text);
  font-size: 20px;
}

.grid-demo__block--primary {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 34%,
    var(--su-color-border)
  );
  background: color-mix(
    in srgb,
    var(--su-color-primary) 8%,
    var(--su-color-bg-elevated)
  );
}

.grid-demo__card {
  display: flex;
  align-items: center;
  color: var(--su-color-text);
}
</style>
