<template>
  <section id="masonry" class="panel">
    <h2>瀑布流</h2>

    <div class="masonry-demo">
      <SuMasonry
        :items="reports"
        item-key="id"
        item-tag="article"
        min-column-width="220px"
        :gap="[16, 16]"
      >
        <template #item="{ item }">
          <div class="masonry-demo__card" :class="`masonry-demo__card--${reportByItem(item).tone}`">
            <div class="masonry-demo__meta">
              {{ reportByItem(item).category }}
            </div>
            <h3>{{ reportByItem(item).title }}</h3>
            <p>{{ reportByItem(item).summary }}</p>
            <div class="masonry-demo__footer">
              <span>{{ reportByItem(item).owner }}</span>
              <strong>{{ reportByItem(item).progress }}%</strong>
            </div>
          </div>
        </template>
      </SuMasonry>

      <SuMasonry :columns="3" :gap="[14, 14]">
        <article
          v-for="note in notes"
          :key="note.title"
          class="masonry-demo__note"
          :style="{ minHeight: `${note.height}px` }"
        >
          <span>{{ note.type }}</span>
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
        </article>
      </SuMasonry>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Report {
  id: string
  category: string
  title: string
  summary: string
  owner: string
  progress: number
  tone: 'blue' | 'green' | 'amber' | 'rose'
}

const reports: Report[] = [
  {
    id: 'insight',
    category: '数据洞察',
    title: '华东渠道周报',
    summary: '区域成交额连续三周增长，餐饮客户的复购周期明显缩短，建议提高重点门店拜访频次。',
    owner: '增长组',
    progress: 84,
    tone: 'blue',
  },
  {
    id: 'launch',
    category: '上线计划',
    title: '会员运营专题页',
    summary: '视觉验收已完成，剩余埋点校验和发布前回归。',
    owner: '体验组',
    progress: 68,
    tone: 'green',
  },
  {
    id: 'risk',
    category: '风险跟进',
    title: '续费预警客户',
    summary:
      '本周新增 8 个高风险账号，主要集中在合同权限和数据迁移进度，需要客户成功团队同步处理。',
    owner: '客户成功',
    progress: 42,
    tone: 'amber',
  },
  {
    id: 'review',
    category: '复盘',
    title: '活动线索质量',
    summary: '线上沙龙线索转化低于预期，下一期需要前置行业筛选问题。',
    owner: '市场组',
    progress: 57,
    tone: 'rose',
  },
  {
    id: 'content',
    category: '内容生产',
    title: '行业白皮书素材库',
    summary: '已收集 26 份客户访谈和 14 组图表素材，等待法务确认可公开引用范围。',
    owner: '内容组',
    progress: 73,
    tone: 'blue',
  },
]

const notes = [
  {
    type: '素材',
    title: '客户门店照片',
    content: '用于补充案例页视觉内容，待筛选横版首图。',
    height: 136,
  },
  {
    type: '任务',
    title: '整理竞品表格',
    content: '按定价、权限、实施周期三个维度统一口径。',
    height: 180,
  },
  {
    type: '提醒',
    title: '回访重点客户',
    content: '周四前完成上一批试点客户的使用反馈记录。',
    height: 152,
  },
  {
    type: '记录',
    title: '发布窗口',
    content: '下周二上午适合发布小版本，避开财务结账时段。',
    height: 210,
  },
  {
    type: '想法',
    title: '新版看板筛选',
    content: '把负责人和阶段筛选固定到首行，降低销售主管查看成本。',
    height: 166,
  },
]

function reportByItem(item: unknown) {
  return item as Report
}
</script>

<style scoped>
.masonry-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.masonry-demo__card,
.masonry-demo__note {
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
}

.masonry-demo__card {
  padding: 16px;
}

.masonry-demo__card--blue {
  border-top: 3px solid var(--su-color-primary);
}

.masonry-demo__card--green {
  border-top: 3px solid var(--su-color-success);
}

.masonry-demo__card--amber {
  border-top: 3px solid var(--su-color-warning);
}

.masonry-demo__card--rose {
  border-top: 3px solid var(--su-color-danger);
}

.masonry-demo__meta {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.masonry-demo__card h3,
.masonry-demo__note h3 {
  margin: 8px 0;
  color: var(--su-color-text);
  font-size: 16px;
}

.masonry-demo__card p,
.masonry-demo__note p {
  margin: 0;
  color: var(--su-color-text-muted);
  line-height: 1.7;
}

.masonry-demo__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: var(--su-color-text-muted);
}

.masonry-demo__footer strong {
  color: var(--su-color-text);
}

.masonry-demo__note {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px;
}

.masonry-demo__note span {
  color: var(--su-color-primary);
  font-size: var(--su-font-size-sm);
}
</style>
