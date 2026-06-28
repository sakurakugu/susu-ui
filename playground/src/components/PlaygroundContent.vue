<script setup lang="ts">
import { computed } from 'vue'
import { playgroundDemos } from '../demos'
import {
  providePlaygroundDemoContext,
  type PlaygroundNotificationPlacement,
} from '../demos/demoContext'
import { playgroundGroups, playgroundNavItems } from '../playgroundNav'

const props = defineProps<{
  activeId: string
}>()

const emit = defineEmits<{
  showMessage: []
  showNotification: [placement: PlaygroundNotificationPlacement]
  selectDemo: [id: string]
}>()

const activeIndex = computed(() =>
  playgroundNavItems.findIndex((item) => item.id === props.activeId),
)
const activeNavItem = computed(
  () => playgroundNavItems[activeIndex.value] ?? playgroundNavItems[0],
)
const activeDemo = computed(
  () =>
    playgroundDemos.find((demo) => demo.id === activeNavItem.value.id) ??
    playgroundDemos[0],
)
const activeGroup = computed(() =>
  playgroundGroups.find((group) => group.id === activeNavItem.value.group),
)
const previousNavItem = computed(() =>
  activeIndex.value > 0 ? playgroundNavItems[activeIndex.value - 1] : null,
)
const nextNavItem = computed(() =>
  activeIndex.value < playgroundNavItems.length - 1
    ? playgroundNavItems[activeIndex.value + 1]
    : null,
)

providePlaygroundDemoContext({
  showMessage() {
    emit('showMessage')
  },
  showNotification(placement) {
    emit('showNotification', placement)
  },
})
</script>

<template>
  <div class="playground-content">
    <section class="component-page">
      <header class="component-page-header">
        <div class="component-page-kicker">
          {{ activeGroup?.label ?? '组件' }}
        </div>
        <div class="component-page-title-row">
          <div>
            <h1>{{ activeNavItem.label }}</h1>
            <p>{{ activeNavItem.description }}</p>
          </div>
          <span class="component-page-count">
            {{ activeIndex + 1 }} / {{ playgroundNavItems.length }}
          </span>
        </div>
        <div class="component-page-scenarios">
          <span
            v-for="scenario in activeNavItem.scenarios"
            :key="scenario"
            class="component-page-scenario"
          >
            {{ scenario }}
          </span>
        </div>
      </header>

      <div class="component-page-demo">
        <component :is="activeDemo.component" :key="activeDemo.id" />
      </div>

      <footer class="component-page-footer">
        <button
          class="component-page-turn"
          :disabled="!previousNavItem"
          type="button"
          @click="previousNavItem && emit('selectDemo', previousNavItem.id)"
        >
          <span>上一个</span>
          <strong>{{ previousNavItem?.label ?? '没有了' }}</strong>
        </button>
        <button
          class="component-page-turn is-next"
          :disabled="!nextNavItem"
          type="button"
          @click="nextNavItem && emit('selectDemo', nextNavItem.id)"
        >
          <span>下一个</span>
          <strong>{{ nextNavItem?.label ?? '没有了' }}</strong>
        </button>
      </footer>
    </section>
  </div>
</template>
