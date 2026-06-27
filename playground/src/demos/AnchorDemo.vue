<script setup lang="ts">
import { ref } from 'vue'
import type { AnchorItem } from '@susu-ui/vue'

const containerRef = ref<HTMLElement>()
const activeKey = ref<string>()
const containerActiveKey = ref<string>()

const pageItems: AnchorItem[] = [
  { key: 'anchor-overview', href: '#anchor-overview', title: '项目概览' },
  {
    key: 'anchor-process',
    href: '#anchor-process',
    title: '上线流程',
    children: [
      {
        key: 'anchor-check',
        href: '#anchor-check',
        title: '检查清单',
      },
      {
        key: 'anchor-risk',
        href: '#anchor-risk',
        title: '风险确认',
      },
    ],
  },
  { key: 'anchor-report', href: '#anchor-report', title: '复盘报告' },
]

const containerItems: AnchorItem[] = [
  { key: 'asset-brief', href: '#asset-brief', title: '投放目标' },
  { key: 'asset-material', href: '#asset-material', title: '素材规范' },
  { key: 'asset-review', href: '#asset-review', title: '审核记录' },
]
</script>

<template>
  <section id="anchor" class="panel">
    <h2>锚点</h2>
    <div class="anchor-demo">
      <div class="anchor-demo__layout">
        <aside class="anchor-demo__aside">
          <SuAnchor
            v-model:active-key="activeKey"
            :items="pageItems"
            :offset-top="96"
          />
        </aside>

        <div class="anchor-demo__content">
          <article id="anchor-overview" class="anchor-demo__section">
            <h3>项目概览</h3>
            <p>
              会员运营页会把关键指标、活动设置和复盘信息集中在同一个长页面中，锚点帮助团队快速定位当前段落。
            </p>
          </article>

          <article id="anchor-process" class="anchor-demo__section">
            <h3>上线流程</h3>
            <p>
              活动上线前需要确认预算、权益库存、推送人群和灰度节奏，每个步骤都可以沉淀为独立目录项。
            </p>
          </article>

          <article id="anchor-check" class="anchor-demo__section">
            <h3>检查清单</h3>
            <p>
              运营负责人在发布前逐项核对文案、链接、库存和客服预案，避免上线后反复回滚配置。
            </p>
          </article>

          <article id="anchor-risk" class="anchor-demo__section">
            <h3>风险确认</h3>
            <p>
              对高峰流量、权益超发和异常退款设置处理预案，保证活动上线后能够快速响应。
            </p>
          </article>

          <article id="anchor-report" class="anchor-demo__section">
            <h3>复盘报告</h3>
            <p>
              活动结束后复盘报名转化、核心渠道和留存表现，为下一次运营节奏提供参考。
            </p>
          </article>
        </div>
      </div>

      <div class="anchor-demo__status">
        当前页面段落：{{ activeKey ?? '等待滚动定位' }}
      </div>

      <div class="anchor-demo__scroll-layout">
        <div ref="containerRef" class="anchor-demo__viewport">
          <article id="asset-brief" class="anchor-demo__section">
            <h3>投放目标</h3>
            <p>
              本次素材计划面向新客首购转化，重点观察优惠券领取率和首单完成率。
            </p>
          </article>
          <article id="asset-material" class="anchor-demo__section">
            <h3>素材规范</h3>
            <p>
              主视觉需要保留品牌标识和活动期限，按钮文案统一使用明确的业务动作。
            </p>
          </article>
          <article id="asset-review" class="anchor-demo__section">
            <h3>审核记录</h3>
            <p>
              市场、法务和客服团队已完成复核，剩余问题会在上线前同步给活动负责人。
            </p>
          </article>
        </div>

        <SuAnchor
          v-model:active-key="containerActiveKey"
          class="anchor-demo__container-nav"
          :items="containerItems"
          :target="() => containerRef"
          :offset-top="12"
          :bounds="12"
        >
          <template #default="{ item, active }">
            <span
              class="anchor-demo__custom-link"
              :class="{ 'is-active': active }"
            >
              {{ item.title }}
            </span>
          </template>
        </SuAnchor>
      </div>
    </div>
  </section>
</template>

<style scoped>
.anchor-demo {
  display: grid;
  gap: 16px;
}

.anchor-demo__layout,
.anchor-demo__scroll-layout {
  display: grid;
  grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.anchor-demo__aside {
  position: sticky;
  top: 16px;
}

.anchor-demo__content,
.anchor-demo__viewport {
  display: grid;
  gap: 12px;
}

.anchor-demo__section {
  min-height: 148px;
  padding: 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.anchor-demo__section h3 {
  margin: 0 0 8px;
}

.anchor-demo__section p {
  margin: 0;
  color: var(--su-color-text-muted);
}

.anchor-demo__status {
  padding: 10px 12px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text-secondary);
  background: var(--su-color-bg-soft);
}

.anchor-demo__viewport {
  max-height: 300px;
  padding: 12px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-soft);
  overflow: auto;
}

.anchor-demo__viewport .anchor-demo__section {
  min-height: 180px;
}

.anchor-demo__container-nav {
  padding-top: 4px;
}

.anchor-demo__custom-link {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.anchor-demo__custom-link.is-active::after {
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary);
  content: '';
}

@media (max-width: 720px) {
  .anchor-demo__layout,
  .anchor-demo__scroll-layout {
    grid-template-columns: 1fr;
  }

  .anchor-demo__aside {
    position: static;
  }
}
</style>
