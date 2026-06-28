<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'SuCarousel',
})

export type CarouselArrow = 'always' | 'hover' | 'never'
export type CarouselIndicatorPosition = 'inside' | 'outside' | 'none'

export interface CarouselItem {
  key?: string | number
  title?: string
  description?: string
  image?: string
  alt?: string
}

const model = defineModel<number>()

const props = withDefaults(
  defineProps<{
    items?: CarouselItem[]
    height?: number | string
    autoplay?: boolean
    interval?: number
    loop?: boolean
    pauseOnHover?: boolean
    arrow?: CarouselArrow
    indicatorPosition?: CarouselIndicatorPosition
    label?: string
    emptyText?: string
  }>(),
  {
    items: () => [],
    height: 240,
    autoplay: false,
    interval: 3000,
    loop: true,
    pauseOnHover: true,
    arrow: 'hover',
    indicatorPosition: 'inside',
    label: '轮播图',
    emptyText: '暂无轮播内容',
  },
)

const emit = defineEmits<{
  change: [index: number, previousIndex: number]
}>()

defineSlots<{
  default?: (props: { item: CarouselItem; index: number; active: boolean }) => unknown
}>()

const isPaused = ref(false)
let autoplayTimer: ReturnType<typeof window.setInterval> | undefined

const slideCount = computed(() => props.items.length)
const hasSlides = computed(() => slideCount.value > 0)
const canSwitch = computed(() => slideCount.value > 1)

const currentIndex = computed(() => {
  if (!hasSlides.value) {
    return 0
  }

  return clampIndex(model.value ?? 0)
})

const carouselStyle = computed(() => ({
  '--su-carousel-height': normalizeSize(props.height),
}))

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
}))

const showArrows = computed(() => props.arrow !== 'never' && canSwitch.value)
const showIndicators = computed(() => props.indicatorPosition !== 'none' && canSwitch.value)

const previousDisabled = computed(() => !props.loop && currentIndex.value <= 0)
const nextDisabled = computed(() => !props.loop && currentIndex.value >= slideCount.value - 1)

watch(
  slideCount,
  () => {
    if (!hasSlides.value) {
      model.value = 0
      stopAutoplay()
      return
    }

    const normalizedIndex = clampIndex(model.value ?? 0)

    if (model.value !== normalizedIndex) {
      model.value = normalizedIndex
    }

    restartAutoplay()
  },
  { immediate: true },
)

watch(
  () => [props.autoplay, props.interval, props.pauseOnHover, isPaused.value],
  () => {
    restartAutoplay()
  },
)

onMounted(() => {
  restartAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function clampIndex(index: number) {
  if (!hasSlides.value) {
    return 0
  }

  return Math.min(Math.max(index, 0), slideCount.value - 1)
}

function normalizeLoopIndex(index: number) {
  if (!hasSlides.value) {
    return 0
  }

  if (props.loop) {
    return (index + slideCount.value) % slideCount.value
  }

  return clampIndex(index)
}

function setActive(index: number) {
  const previousIndex = currentIndex.value
  const nextIndex = normalizeLoopIndex(index)

  if (nextIndex === previousIndex) {
    return
  }

  model.value = nextIndex
  emit('change', nextIndex, previousIndex)
  restartAutoplay()
}

function next() {
  setActive(currentIndex.value + 1)
}

function previous() {
  setActive(currentIndex.value - 1)
}

function handleIndicatorClick(index: number) {
  setActive(index)
}

function handleKeydown(event: KeyboardEvent) {
  if (!canSwitch.value) {
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    previous()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  } else if (event.key === 'Home') {
    event.preventDefault()
    setActive(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    setActive(slideCount.value - 1)
  }
}

function pauseAutoplay() {
  if (props.pauseOnHover) {
    isPaused.value = true
  }
}

function resumeAutoplay() {
  isPaused.value = false
}

function restartAutoplay() {
  stopAutoplay()

  if (typeof window === 'undefined' || !props.autoplay || isPaused.value || !canSwitch.value) {
    return
  }

  autoplayTimer = window.setInterval(
    () => {
      next()
    },
    Math.max(props.interval, 1000),
  )
}

function stopAutoplay() {
  if (autoplayTimer === undefined) {
    return
  }

  window.clearInterval(autoplayTimer)
  autoplayTimer = undefined
}

defineExpose({
  next,
  previous,
  setActive,
})
</script>

<template>
  <section
    class="su-carousel"
    :class="[
      `su-carousel--arrow-${arrow}`,
      `su-carousel--indicator-${indicatorPosition}`,
      {
        'is-empty': !hasSlides,
        'is-paused': isPaused,
      },
    ]"
    :style="carouselStyle"
    role="region"
    aria-roledescription="轮播图"
    :aria-label="label"
    tabindex="0"
    @keydown="handleKeydown"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    @focusin="pauseAutoplay"
    @focusout="resumeAutoplay"
  >
    <div class="su-carousel__viewport">
      <div v-if="hasSlides" class="su-carousel__track" :style="trackStyle">
        <article
          v-for="(item, index) in items"
          :key="item.key ?? index"
          class="su-carousel__slide"
          role="group"
          aria-roledescription="幻灯片"
          :aria-label="`${index + 1} / ${slideCount}`"
          :aria-hidden="index !== currentIndex"
        >
          <slot :item="item" :index="index" :active="index === currentIndex">
            <img
              v-if="item.image"
              class="su-carousel__image"
              :src="item.image"
              :alt="item.alt ?? item.title ?? ''"
            />
            <div class="su-carousel__content">
              <strong v-if="item.title" class="su-carousel__title">
                {{ item.title }}
              </strong>
              <span v-if="item.description" class="su-carousel__description">
                {{ item.description }}
              </span>
            </div>
          </slot>
        </article>
      </div>

      <div v-else class="su-carousel__empty">
        {{ emptyText }}
      </div>

      <button
        v-if="showArrows"
        class="su-carousel__arrow su-carousel__arrow--previous"
        type="button"
        aria-label="上一张"
        :disabled="previousDisabled"
        @click="previous"
      >
        <span aria-hidden="true" />
      </button>
      <button
        v-if="showArrows"
        class="su-carousel__arrow su-carousel__arrow--next"
        type="button"
        aria-label="下一张"
        :disabled="nextDisabled"
        @click="next"
      >
        <span aria-hidden="true" />
      </button>
    </div>

    <div v-if="showIndicators" class="su-carousel__indicators">
      <button
        v-for="(_, index) in items"
        :key="index"
        class="su-carousel__indicator"
        :class="{ 'is-active': index === currentIndex }"
        type="button"
        :aria-label="`切换到第 ${index + 1} 张`"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="handleIndicatorClick(index)"
      />
    </div>
  </section>
</template>

<style>
.su-carousel {
  --su-carousel-height: 240px;
  --su-carousel-arrow-size: 34px;

  position: relative;
  display: block;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-carousel:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-carousel__viewport {
  position: relative;
  height: var(--su-carousel-height);
  overflow: hidden;
  border-radius: var(--su-radius-lg);
  background: var(--su-color-bg-soft);
}

.su-carousel__track {
  display: flex;
  height: 100%;
  transition: transform 0.32s ease;
  will-change: transform;
}

.su-carousel__slide {
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgb(22 119 255 / 16%), rgb(22 163 74 / 14%)), var(--su-color-bg-soft);
}

.su-carousel__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.su-carousel__content {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--su-space-xs);
  padding: var(--su-space-xl);
  background: linear-gradient(to top, rgb(0 0 0 / 58%), transparent);
  color: white;
}

.su-carousel__title {
  max-width: min(560px, 100%);
  overflow-wrap: anywhere;
  font-size: var(--su-font-size-xl);
  line-height: 1.3;
}

.su-carousel__description {
  max-width: min(620px, 100%);
  overflow-wrap: anywhere;
  color: rgb(255 255 255 / 82%);
}

.su-carousel__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--su-color-text-muted);
}

.su-carousel__arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-carousel-arrow-size);
  height: var(--su-carousel-arrow-size);
  padding: 0;
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: var(--su-radius-round);
  background: rgb(15 23 42 / 52%);
  color: white;
  cursor: pointer;
  opacity: 1;
  transform: translateY(-50%);
  transition:
    background-color 0.16s ease,
    opacity 0.16s ease;
}

.su-carousel__arrow:hover:not(:disabled) {
  background: rgb(15 23 42 / 72%);
}

.su-carousel__arrow:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.su-carousel__arrow:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-carousel--arrow-hover .su-carousel__arrow {
  opacity: 0;
}

.su-carousel--arrow-hover:hover .su-carousel__arrow,
.su-carousel--arrow-hover:focus-within .su-carousel__arrow {
  opacity: 1;
}

.su-carousel__arrow--previous {
  left: var(--su-space-md);
}

.su-carousel__arrow--next {
  right: var(--su-space-md);
}

.su-carousel__arrow span {
  width: 10px;
  height: 10px;
  border-top: 2px solid currentColor;
  border-left: 2px solid currentColor;
}

.su-carousel__arrow--previous span {
  transform: translateX(2px) rotate(-45deg);
}

.su-carousel__arrow--next span {
  transform: translateX(-2px) rotate(135deg);
}

.su-carousel__indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-xs);
}

.su-carousel--indicator-inside .su-carousel__indicators {
  position: absolute;
  right: var(--su-space-md);
  bottom: var(--su-space-md);
  left: var(--su-space-md);
}

.su-carousel--indicator-outside .su-carousel__indicators {
  margin-top: var(--su-space-sm);
}

.su-carousel__indicator {
  width: 20px;
  height: 4px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  background: rgb(255 255 255 / 52%);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    width 0.16s ease;
}

.su-carousel--indicator-outside .su-carousel__indicator {
  background: var(--su-color-border-strong);
}

.su-carousel__indicator.is-active {
  width: 28px;
  background: var(--su-color-primary);
}

.su-carousel__indicator:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}
</style>
