<script setup lang="ts">
import { enUS, SuMessage, zhCN, type SusuLocale } from '@susu-ui/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PlaygroundContent from './components/PlaygroundContent.vue'
import PlaygroundSidebar from './components/PlaygroundSidebar.vue'
import PlaygroundToolbar from './components/PlaygroundToolbar.vue'
import type {
  PlaygroundNotificationOptions,
  PlaygroundNotificationPlacement,
  PlaygroundNotificationType,
} from './demos/demoContext'
import { playgroundNavItems } from './playgroundNav'

const localeName = ref<SusuLocale['name']>('zh-cn')
const initialDemoId = getHashDemoId()
const currentDemoId = ref(
  playgroundNavItems.some((item) => item.id === initialDemoId)
    ? initialDemoId
    : playgroundNavItems[0].id,
)
const notificationVisible = ref(false)
const notificationKey = ref(0)
const notificationType = ref<PlaygroundNotificationType>('warning')
const notificationTitle = ref('构建提醒')
const notificationDescription = ref('当前任务队列还有 3 个检查项需要处理。')
const notificationPlacement = ref<PlaygroundNotificationPlacement>('top-right')
const notificationDuration = ref(4500)
const notificationShowIcon = ref(true)
const notificationClosable = ref(true)
const notificationIconText = ref('')

const currentLocale = computed(() => (localeName.value === 'zh-cn' ? zhCN : enUS))

function getHashDemoId() {
  return typeof window === 'undefined' ? playgroundNavItems[0].id : window.location.hash.slice(1)
}

function syncDemoFromHash() {
  const hashDemoId = getHashDemoId()
  if (playgroundNavItems.some((item) => item.id === hashDemoId)) {
    currentDemoId.value = hashDemoId
  }
}

function showNotification(options: PlaygroundNotificationOptions) {
  notificationKey.value += 1
  notificationType.value = options.type ?? 'warning'
  notificationTitle.value = options.title ?? '构建提醒'
  notificationDescription.value = options.description ?? '当前任务队列还有 3 个检查项需要处理。'
  notificationPlacement.value = options.placement ?? 'top-right'
  notificationDuration.value = options.duration ?? 4500
  notificationShowIcon.value = options.showIcon ?? true
  notificationClosable.value = options.closable ?? true
  notificationIconText.value = options.iconText ?? ''
  notificationVisible.value = true
}

function showPlaygroundMessage(message = '操作已完成') {
  SuMessage.success(message)
}

function selectDemo(id: string) {
  currentDemoId.value = id
  if (typeof window !== 'undefined') {
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  syncDemoFromHash()
  window.addEventListener('popstate', syncDemoFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncDemoFromHash)
})
</script>

<template>
  <SuConfigProvider :locale="currentLocale">
    <div class="playground-shell">
      <PlaygroundSidebar :active-id="currentDemoId" @select-demo="selectDemo" />
      <div class="playground-main">
        <PlaygroundToolbar @locale-change="localeName = $event" />
        <main class="playground">
          <SuNotification
            v-if="notificationVisible"
            :key="notificationKey"
            :type="notificationType"
            :title="notificationTitle"
            :placement="notificationPlacement"
            :duration="notificationDuration"
            :show-icon="notificationShowIcon"
            :closable="notificationClosable"
            @close="notificationVisible = false"
          >
            <template v-if="notificationIconText" #icon>{{ notificationIconText }}</template>
            {{ notificationDescription }}
          </SuNotification>

          <PlaygroundContent
            :active-id="currentDemoId"
            @show-message="showPlaygroundMessage"
            @show-notification="showNotification"
            @select-demo="selectDemo"
          />
        </main>
      </div>
    </div>
  </SuConfigProvider>
</template>
