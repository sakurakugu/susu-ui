<script setup lang="ts">
import { enUS, zhCN, type SusuLocale } from '@susu-ui/vue'
import { computed, ref } from 'vue'
import PlaygroundContent from './components/PlaygroundContent.vue'
import PlaygroundSidebar from './components/PlaygroundSidebar.vue'
import PlaygroundToolbar from './components/PlaygroundToolbar.vue'

const localeName = ref<SusuLocale['name']>('zh-cn')
const messageVisible = ref(false)
const messageKey = ref(0)
const notificationVisible = ref(false)
const notificationKey = ref(0)
const notificationPlacement = ref<'top-right' | 'bottom-left'>('top-right')

const currentLocale = computed(() =>
  localeName.value === 'zh-cn' ? zhCN : enUS,
)

function showTopMessage() {
  messageKey.value += 1
  messageVisible.value = true
}

function showNotification(placement: 'top-right' | 'bottom-left') {
  notificationKey.value += 1
  notificationPlacement.value = placement
  notificationVisible.value = true
}
</script>

<template>
  <SuConfigProvider :locale="currentLocale">
    <div class="playground-shell">
      <PlaygroundSidebar />
      <div class="playground-main">
        <PlaygroundToolbar @locale-change="localeName = $event" />
        <main class="playground">
          <SuMessage
            v-if="messageVisible"
            :key="messageKey"
            type="success"
            @close="messageVisible = false"
          >
            消息会在顶部展示，并于 3 秒后消失
          </SuMessage>

          <SuNotification
            v-if="notificationVisible"
            :key="notificationKey"
            type="warning"
            title="构建提醒"
            :placement="notificationPlacement"
            @close="notificationVisible = false"
          >
            当前任务队列还有 3 个检查项需要处理。
          </SuNotification>

          <PlaygroundContent
            @show-message="showTopMessage"
            @show-notification="showNotification"
          />
        </main>
      </div>
    </div>
  </SuConfigProvider>
</template>
