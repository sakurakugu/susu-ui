<script setup lang="ts">
import { enUS, zhCN, type SusuLocale } from '@susu-ui/vue'
import { computed, ref } from 'vue'
import PlaygroundContent from './components/PlaygroundContent.vue'
import PlaygroundSidebar from './components/PlaygroundSidebar.vue'
import PlaygroundToolbar from './components/PlaygroundToolbar.vue'

const localeName = ref<SusuLocale['name']>('zh-cn')
const messageVisible = ref(false)
const messageKey = ref(0)

const currentLocale = computed(() =>
  localeName.value === 'zh-cn' ? zhCN : enUS,
)

function showTopMessage() {
  messageKey.value += 1
  messageVisible.value = true
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

          <PlaygroundContent @show-message="showTopMessage" />
        </main>
      </div>
    </div>
  </SuConfigProvider>
</template>
