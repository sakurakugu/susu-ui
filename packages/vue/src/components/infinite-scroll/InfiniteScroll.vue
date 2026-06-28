<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
} from 'vue'
import { useLocale } from '../../config-provider'

defineOptions({
  name: 'SuInfiniteScroll',
})

export type InfiniteScrollTarget = Window | HTMLElement

export interface InfiniteScrollState {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  remaining: number
}

const props = withDefaults(
  defineProps<{
    target?: () => InfiniteScrollTarget | null | undefined
    distance?: number
    height?: number | string
    loading?: boolean
    finished?: boolean
    disabled?: boolean
    error?: boolean
    immediate?: boolean
    loadingText?: string
    finishedText?: string
    errorText?: string
  }>(),
  {
    target: undefined,
    distance: 80,
    height: undefined,
    loading: false,
    finished: false,
    disabled: false,
    error: false,
    immediate: true,
    loadingText: undefined,
    finishedText: undefined,
    errorText: undefined,
  },
)

const emit = defineEmits<{
  load: [state: InfiniteScrollState]
  scroll: [event: Event, state: InfiniteScrollState]
}>()

defineSlots<{
  default?: () => unknown
  loading?: () => unknown
  finished?: () => unknown
  error?: () => unknown
}>()

const rootRef = ref<HTMLElement>()
const locale = useLocale()
const loadLocked = ref(false)

let activeTarget: InfiniteScrollTarget | undefined
let frame: number | undefined
let resizeObserver: ResizeObserver | undefined

const normalizedDistance = computed(() => Math.max(0, props.distance))
const isSelfScrollable = computed(() => props.height !== undefined)
const rootStyle = computed<CSSProperties>(() =>
  props.height === undefined
    ? {}
    : {
        height: formatSize(props.height),
      },
)
const mergedLoadingText = computed(
  () => props.loadingText ?? locale.value.infiniteScroll.loading,
)
const mergedFinishedText = computed(
  () => props.finishedText ?? locale.value.infiniteScroll.finished,
)
const mergedErrorText = computed(
  () => props.errorText ?? locale.value.infiniteScroll.error,
)

function formatSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function getTarget() {
  if (typeof window === 'undefined') {
    return undefined
  }

  if (props.target) {
    return props.target() ?? undefined
  }

  if (isSelfScrollable.value) {
    return rootRef.value
  }

  return window
}

function getScrollState(target: InfiniteScrollTarget): InfiniteScrollState {
  if (target === window) {
    const documentElement = document.documentElement
    const body = document.body
    const scrollTop =
      window.scrollY || documentElement.scrollTop || body.scrollTop || 0
    const scrollHeight = Math.max(
      documentElement.scrollHeight,
      body.scrollHeight,
    )
    const clientHeight = window.innerHeight || documentElement.clientHeight

    return {
      scrollTop,
      scrollHeight,
      clientHeight,
      remaining: Math.max(0, scrollHeight - scrollTop - clientHeight),
    }
  }

  const element = target as HTMLElement
  const remaining = Math.max(
    0,
    element.scrollHeight - element.scrollTop - element.clientHeight,
  )

  return {
    scrollTop: element.scrollTop,
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
    remaining,
  }
}

function canLoad() {
  return (
    !props.loading &&
    !props.finished &&
    !props.disabled &&
    !props.error &&
    !loadLocked.value
  )
}

function check() {
  const target = getTarget()

  if (!target) {
    return
  }

  const state = getScrollState(target)
  const reachedBottom = state.remaining <= normalizedDistance.value

  if (!reachedBottom) {
    loadLocked.value = false
    return
  }

  if (!canLoad()) {
    return
  }

  loadLocked.value = true
  emit('load', state)
}

function requestCheck() {
  if (typeof window === 'undefined') {
    return
  }

  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  frame = window.requestAnimationFrame(() => {
    frame = undefined
    check()
  })
}

function handleScroll(event: Event) {
  const target = getTarget()

  if (target) {
    emit('scroll', event, getScrollState(target))
  }

  requestCheck()
}

function removeListeners() {
  activeTarget?.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', requestCheck)
  activeTarget = undefined
}

function addListeners() {
  removeListeners()

  const target = getTarget()

  if (!target) {
    return
  }

  activeTarget = target
  activeTarget.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', requestCheck)
}

function observeRoot() {
  resizeObserver?.disconnect()
  resizeObserver = undefined

  if (typeof ResizeObserver === 'undefined' || !rootRef.value) {
    return
  }

  resizeObserver = new ResizeObserver(requestCheck)
  resizeObserver.observe(rootRef.value)
}

watch(
  () => [props.target, props.height],
  async () => {
    await nextTick()
    addListeners()
    observeRoot()
    requestCheck()
  },
)

watch(
  () => props.loading,
  async (loading, previousLoading) => {
    if (!loading && previousLoading) {
      loadLocked.value = false
      await nextTick()
      requestCheck()
    }
  },
)

watch(
  () => [props.finished, props.disabled, props.error, props.distance],
  async () => {
    if (!props.loading) {
      loadLocked.value = false
    }

    await nextTick()
    requestCheck()
  },
)

onMounted(() => {
  addListeners()
  observeRoot()

  if (props.immediate) {
    requestCheck()
  }
})

onBeforeUnmount(() => {
  if (frame !== undefined) {
    window.cancelAnimationFrame(frame)
  }

  removeListeners()
  resizeObserver?.disconnect()
})

defineExpose({
  check,
})
</script>

<template>
  <div
    ref="rootRef"
    class="su-infinite-scroll"
    :class="{ 'is-scrollable': isSelfScrollable }"
    :style="rootStyle"
  >
    <div class="su-infinite-scroll__content">
      <slot />
    </div>

    <div v-if="loading" class="su-infinite-scroll__status" role="status">
      <slot name="loading">
        <span class="su-infinite-scroll__spinner" aria-hidden="true" />
        <span>{{ mergedLoadingText }}</span>
      </slot>
    </div>

    <div v-else-if="error" class="su-infinite-scroll__status is-error">
      <slot name="error">{{ mergedErrorText }}</slot>
    </div>

    <div v-else-if="finished" class="su-infinite-scroll__status is-finished">
      <slot name="finished">{{ mergedFinishedText }}</slot>
    </div>
  </div>
</template>

<style>
.su-infinite-scroll {
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-infinite-scroll.is-scrollable {
  overflow: auto;
}

.su-infinite-scroll__content {
  min-width: 0;
}

.su-infinite-scroll__status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: var(--su-space-md);
  gap: var(--su-space-sm);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-infinite-scroll__status.is-error {
  color: var(--su-color-danger);
}

.su-infinite-scroll__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid color-mix(in srgb, currentcolor 22%, transparent);
  border-top-color: currentcolor;
  border-radius: var(--su-radius-round);
  animation: su-infinite-scroll-spin 0.8s linear infinite;
}

@keyframes su-infinite-scroll-spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-infinite-scroll__spinner {
    animation: none;
  }
}
</style>
