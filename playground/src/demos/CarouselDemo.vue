<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const activeBanner = ref(0)

const bannerItems = [
  {
    key: 'growth',
    title: '增长看板升级',
    description: '新增渠道贡献、线索转化和客户留存三组核心指标。',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 360'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%231677ff'/%3E%3Cstop offset='.54' stop-color='%2314b8a6'/%3E%3Cstop offset='1' stop-color='%2322c55e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='360' fill='url(%23g1)'/%3E%3Ccircle cx='806' cy='86' r='104' fill='white' fill-opacity='.14'/%3E%3Crect x='112' y='86' width='190' height='136' rx='20' fill='white' fill-opacity='.22'/%3E%3Crect x='338' y='86' width='114' height='210' rx='20' fill='white' fill-opacity='.2'/%3E%3Crect x='488' y='136' width='114' height='160' rx='20' fill='white' fill-opacity='.24'/%3E%3Crect x='638' y='106' width='114' height='190' rx='20' fill='white' fill-opacity='.18'/%3E%3Cpath d='M132 254c90-74 158-22 244-70 86-48 132-112 252-78' fill='none' stroke='white' stroke-width='16' stroke-linecap='round' stroke-opacity='.72'/%3E%3C/svg%3E",
  },
  {
    key: 'release',
    title: '六月版本发布',
    description: '统一权限配置入口，支持灰度发布和问题回滚记录。',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 360'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%237c3aed'/%3E%3Cstop offset='.5' stop-color='%23db2777'/%3E%3Cstop offset='1' stop-color='%23f97316'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='360' fill='url(%23g2)'/%3E%3Crect x='126' y='78' width='708' height='204' rx='28' fill='white' fill-opacity='.18'/%3E%3Cpath d='M188 138h210M188 184h330M188 230h154' stroke='white' stroke-width='18' stroke-linecap='round' stroke-opacity='.78'/%3E%3Ccircle cx='674' cy='180' r='72' fill='white' fill-opacity='.18'/%3E%3Cpath d='M640 180l24 24 52-58' fill='none' stroke='white' stroke-width='18' stroke-linecap='round' stroke-linejoin='round' stroke-opacity='.82'/%3E%3C/svg%3E",
  },
  {
    key: 'support',
    title: '客户支持排班',
    description: '按地区自动分配值班团队，节假日 SLA 单独配置。',
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 360'%3E%3Cdefs%3E%3ClinearGradient id='g3' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%230f766e'/%3E%3Cstop offset='.56' stop-color='%232563eb'/%3E%3Cstop offset='1' stop-color='%234f46e5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='360' fill='url(%23g3)'/%3E%3Crect x='134' y='84' width='224' height='196' rx='24' fill='white' fill-opacity='.2'/%3E%3Crect x='396' y='84' width='224' height='196' rx='24' fill='white' fill-opacity='.16'/%3E%3Crect x='658' y='84' width='168' height='196' rx='24' fill='white' fill-opacity='.2'/%3E%3Cpath d='M180 142h130M180 190h92M442 142h130M442 190h74M704 142h72M704 190h50' stroke='white' stroke-width='16' stroke-linecap='round' stroke-opacity='.78'/%3E%3Ccircle cx='246' cy='244' r='20' fill='white' fill-opacity='.74'/%3E%3Ccircle cx='508' cy='244' r='20' fill='white' fill-opacity='.74'/%3E%3Ccircle cx='742' cy='244' r='20' fill='white' fill-opacity='.74'/%3E%3C/svg%3E",
  },
]

const cardItems = [
  {
    key: 'risk',
    title: '风险任务',
    description: '3 个高优先级任务需要今天确认负责人。',
  },
  {
    key: 'meeting',
    title: '客户会议',
    description: '下午 3 点与北区渠道团队同步续约方案。',
  },
]
</script>

<template>
  <section id="carousel" class="panel">
    <h2>走马灯</h2>
    <div class="carousel-demo">
      <SuCarousel
        :items="bannerItems"
        autoplay
        :interval="3600"
        height="260px"
        label="运营活动轮播"
        @change="showTopMessage"
      />

      <div class="carousel-demo-grid">
        <SuCarousel
          v-model="activeBanner"
          :items="bannerItems"
          :loop="false"
          arrow="always"
          indicator-position="outside"
          height="180px"
          label="受控轮播"
        />

        <div class="carousel-demo-actions">
          <span>当前第 {{ activeBanner + 1 }} 张</span>
          <SuButton size="small" @click="activeBanner = 0">第一张</SuButton>
          <SuButton size="small" @click="activeBanner = 2">第三张</SuButton>
        </div>
      </div>

      <SuCarousel
        :items="cardItems"
        arrow="never"
        indicator-position="outside"
        height="168px"
        label="工作提醒轮播"
      >
        <template #default="{ item }">
          <div class="carousel-demo-card">
            <span>工作提醒</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <SuButton type="primary" size="small" @click="showTopMessage">
              查看详情
            </SuButton>
          </div>
        </template>
      </SuCarousel>
    </div>
  </section>
</template>

<style scoped>
.carousel-demo {
  display: grid;
  gap: 18px;
}

.carousel-demo-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 16px;
  align-items: center;
}

.carousel-demo-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.carousel-demo-actions span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.carousel-demo-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 24px;
  background:
    linear-gradient(135deg, rgb(22 119 255 / 12%), rgb(22 163 74 / 12%)),
    var(--su-color-bg-elevated);
}

.carousel-demo-card span {
  color: var(--su-color-primary);
  font-size: var(--su-font-size-sm);
  font-weight: 600;
}

.carousel-demo-card strong {
  color: var(--su-color-text);
  font-size: 22px;
  line-height: 1.3;
}

.carousel-demo-card p {
  max-width: 520px;
  margin: 0;
  color: var(--su-color-text-muted);
}

@media (max-width: 760px) {
  .carousel-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
