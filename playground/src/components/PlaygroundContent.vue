<script setup lang="ts">
import { playgroundDemos } from '../demos'
import {
  providePlaygroundDemoContext,
  type PlaygroundNotificationPlacement,
} from '../demos/demoContext'

const emit = defineEmits<{
  showMessage: []
  showNotification: [placement: PlaygroundNotificationPlacement]
}>()

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
    <component
      :is="demo.component"
      v-for="demo in playgroundDemos"
      :key="demo.id"
    />
  </div>
</template>
