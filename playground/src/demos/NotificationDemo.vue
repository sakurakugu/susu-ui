<script setup lang="ts">
import { usePlaygroundDemoContext } from './demoContext'

const { showNotification } = usePlaygroundDemoContext()

const inlineNotifications = [
  {
    type: 'info',
    title: '线索已同步',
    description: '系统已从企业微信同步 12 条新线索。',
    placement: 'top-right',
  },
  {
    type: 'success',
    title: '导出任务完成',
    description: '本周销售明细已生成，可以前往下载中心查看。',
    placement: 'top-left',
  },
  {
    type: 'warning',
    title: '库存即将不足',
    description: '华东仓可用库存低于安全线，请安排补货。',
    placement: 'bottom-right',
  },
  {
    type: 'error',
    title: '回调发送失败',
    description: '第三方接口连续失败 3 次，请检查密钥和白名单。',
    placement: 'bottom-left',
  },
] as const
</script>

<template>
  <section id="notification" class="panel">
    <h2>通知</h2>
    <div class="notification-demo">
      <div class="notification-demo__actions">
        <SuButton
          type="primary"
          @click="
            showNotification({
              type: 'success',
              title: '保存成功',
              description: '客户分层规则已更新，将在下一次计算中生效。',
              placement: 'top-right',
            })
          "
        >
          右上成功通知
        </SuButton>
        <SuButton
          variant="outline"
          @click="
            showNotification({
              type: 'warning',
              title: '审批即将超时',
              description: '财务审批还剩 2 小时，请提醒负责人处理。',
              placement: 'top-left',
            })
          "
        >
          左上警告通知
        </SuButton>
        <SuButton
          variant="outline"
          @click="
            showNotification({
              type: 'error',
              title: '同步失败',
              description: '部分客户资料未能写入 CRM，请稍后重试。',
              placement: 'bottom-right',
            })
          "
        >
          右下错误通知
        </SuButton>
        <SuButton
          @click="
            showNotification({
              type: 'info',
              title: '任务已加入队列',
              description: '系统会在后台继续处理并推送结果。',
              placement: 'bottom-left',
            })
          "
        >
          左下信息通知
        </SuButton>
      </div>

      <div class="notification-demo__grid">
        <button
          v-for="item in inlineNotifications"
          :key="item.type"
          class="notification-demo-card"
          type="button"
          @click="
            showNotification({
              type: item.type,
              title: item.title,
              description: item.description,
              placement: item.placement,
              duration: 0,
            })
          "
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
        </button>
        <button
          class="notification-demo-card"
          type="button"
          @click="
            showNotification({
              title: '静默通知',
              description: '隐藏默认图标，适合弱提醒或辅助状态说明。',
              showIcon: false,
              duration: 0,
            })
          "
        >
          <strong>隐藏图标</strong>
          <span>无默认状态图标，保留关闭入口。</span>
        </button>
        <button
          class="notification-demo-card"
          type="button"
          @click="
            showNotification({
              title: '排班提醒',
              description: '明天 09:30 有一场门店复盘会议，请提前准备经营数据。',
              iconText: '排',
              closable: false,
              duration: 0,
            })
          "
        >
          <strong>自定义图标</strong>
          <span>使用 icon 插槽表达更具体的业务状态。</span>
        </button>
      </div>
    </div>
  </section>
</template>
<style scoped>
.notification-demo {
  display: grid;
  gap: 16px;
}

.notification-demo__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.notification-demo__grid {
  display: grid;
  max-width: 920px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.notification-demo-card {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.notification-demo-card:hover {
  border-color: var(--su-color-primary);
}

.notification-demo-card span {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

@media (max-width: 720px) {
  .notification-demo__grid {
    grid-template-columns: 1fr;
  }
}
</style>
