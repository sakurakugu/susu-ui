<script setup lang="ts">
const logoWatermark =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 52'%3E%3Crect width='160' height='52' rx='12' fill='%231677ff' fill-opacity='.16'/%3E%3Cpath d='M24 34c10 7 24 7 34 0' fill='none' stroke='%231677ff' stroke-width='5' stroke-linecap='round'/%3E%3Ccircle cx='34' cy='22' r='5' fill='%231677ff'/%3E%3Ccircle cx='50' cy='22' r='5' fill='%231677ff'/%3E%3Cpath d='M78 19h48M78 32h34' stroke='%231677ff' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E"
</script>

<template>
  <section id="watermark" class="panel">
    <h2>水印</h2>
    <div class="watermark-demo">
      <SuWatermark content="财务中心" :height="92" :gap-x="28" :gap-y="28">
        <div class="watermark-demo__document">
          <div class="watermark-demo__header">
            <strong>供应商付款申请</strong>
            <span>审批编号 AP-20260628-014</span>
          </div>
          <div class="watermark-demo__grid">
            <span>申请部门</span>
            <strong>华东采购部</strong>
            <span>付款金额</span>
            <strong>¥128,600.00</strong>
            <span>当前状态</span>
            <strong>等待财务复核</strong>
          </div>
        </div>
      </SuWatermark>

      <SuWatermark
        :content="['内部资料', '研发中心']"
        color="rgb(22 119 255)"
        :opacity="0.16"
        :font-size="15"
        :width="150"
        :height="90"
        :gap-x="24"
        :gap-y="22"
        :rotate="-18"
      >
        <div class="watermark-demo__table">
          <div class="watermark-demo__row watermark-demo__row--head">
            <span>项目</span>
            <span>负责人</span>
            <span>风险</span>
          </div>
          <div class="watermark-demo__row">
            <span>订单中台改版</span>
            <span>林晨</span>
            <span>低</span>
          </div>
          <div class="watermark-demo__row">
            <span>账单归档流程</span>
            <span>周婷</span>
            <span>中</span>
          </div>
          <div class="watermark-demo__row">
            <span>权限审计</span>
            <span>陈逸</span>
            <span>低</span>
          </div>
        </div>
      </SuWatermark>

      <SuWatermark
        :image="logoWatermark"
        :width="180"
        :height="100"
        :gap-x="32"
        :gap-y="28"
        :image-width="96"
        :image-height="32"
        :opacity="0.45"
        :rotate="-16"
      >
        <div class="watermark-demo__notice">
          <strong>品牌素材库</strong>
          <span>用于演示图片水印，适合合同封面、设计稿预览等场景。</span>
        </div>
      </SuWatermark>
    </div>
  </section>
</template>

<style scoped>
.watermark-demo {
  display: grid;
  gap: 16px;
}

.watermark-demo__document,
.watermark-demo__table,
.watermark-demo__notice {
  min-height: 180px;
  padding: 20px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.watermark-demo__document {
  display: grid;
  gap: 18px;
}

.watermark-demo__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.watermark-demo__header strong,
.watermark-demo__notice strong {
  font-size: 18px;
}

.watermark-demo__header span,
.watermark-demo__grid span,
.watermark-demo__notice span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.watermark-demo__grid {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 10px 16px;
}

.watermark-demo__table {
  display: grid;
  align-content: start;
  padding: 0;
  overflow: hidden;
}

.watermark-demo__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px 80px;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--su-color-border);
}

.watermark-demo__row:last-child {
  border-bottom: 0;
}

.watermark-demo__row--head {
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-soft);
  font-size: var(--su-font-size-sm);
}

.watermark-demo__notice {
  display: grid;
  align-content: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .watermark-demo__header {
    flex-direction: column;
  }

  .watermark-demo__row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
