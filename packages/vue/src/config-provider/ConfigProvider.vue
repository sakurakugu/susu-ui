<script setup lang="ts">
import { computed } from 'vue'
import { mergeConfig, provideConfig } from './context'
import type { DeepPartial, SusuLocale } from '../locale'

defineOptions({
  name: 'SuConfigProvider',
})

const props = defineProps<{
  locale?: DeepPartial<SusuLocale>
}>()

const config = computed(() =>
  mergeConfig({
    locale: props.locale,
  }),
)

provideConfig(config)
</script>

<template>
  <slot />
</template>
