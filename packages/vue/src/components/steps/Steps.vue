<script setup lang="ts">
import { computed } from 'vue'
import type { FormSize } from '../form/context'

defineOptions({
  name: 'SuSteps',
})

export type StepsDirection = 'horizontal' | 'vertical'
export type StepsSize = FormSize
export type StepsStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsValue = string | number

export interface StepsItem {
  title: string
  description?: string
  value?: StepsValue
  status?: StepsStatus
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items?: StepsItem[]
    current?: StepsValue
    direction?: StepsDirection
    size?: StepsSize
    status?: Exclude<StepsStatus, 'wait'>
    simple?: boolean
    clickable?: boolean
    ariaLabel?: string
  }>(),
  {
    items: () => [],
    current: 0,
    direction: 'horizontal',
    size: 'medium',
    status: 'process',
    simple: false,
    clickable: false,
    ariaLabel: '步骤条',
  },
)

const emit = defineEmits<{
  change: [value: StepsValue, item: StepsItem, index: number]
}>()

defineSlots<{
  icon?: (props: {
    item: StepsItem
    index: number
    status: StepsStatus
    value: StepsValue
  }) => unknown
  title?: (props: {
    item: StepsItem
    index: number
    status: StepsStatus
    value: StepsValue
  }) => unknown
  description?: (props: {
    item: StepsItem
    index: number
    status: StepsStatus
    value: StepsValue
  }) => unknown
}>()

const resolvedCurrentIndex = computed(() => {
  const matchedIndex = props.items.findIndex(
    (item, index) => getItemValue(item, index) === props.current,
  )

  if (matchedIndex >= 0) {
    return matchedIndex
  }

  const currentIndex = Number(props.current)

  return Number.isFinite(currentIndex) ? currentIndex : 0
})

const steps = computed(() =>
  props.items.map((item, index) => {
    const value = getItemValue(item, index)

    return {
      item,
      index,
      value,
      status: resolveStatus(item, index),
      isClickable: props.clickable && !item.disabled,
    }
  }),
)

function getItemValue(item: StepsItem, index: number) {
  return item.value ?? index
}

function resolveStatus(item: StepsItem, index: number): StepsStatus {
  if (item.status) {
    return item.status
  }

  if (index < resolvedCurrentIndex.value) {
    return 'finish'
  }

  if (index === resolvedCurrentIndex.value) {
    return props.status
  }

  return 'wait'
}

function handleClick(step: (typeof steps.value)[number]) {
  if (!step.isClickable) {
    return
  }

  emit('change', step.value, step.item, step.index)
}

function getStepLabel(item: StepsItem, index: number) {
  return `${index + 1}. ${item.title}`
}
</script>

<template>
  <nav
    class="su-steps"
    :class="[
      `su-steps--${direction}`,
      `su-steps--${size}`,
      {
        'is-simple': simple,
      },
    ]"
    :aria-label="ariaLabel"
  >
    <ol class="su-steps__list">
      <li
        v-for="step in steps"
        :key="String(step.value)"
        class="su-steps__item"
        :class="[
          `is-${step.status}`,
          {
            'is-clickable': step.isClickable,
            'is-disabled': step.item.disabled,
          },
        ]"
      >
        <button
          v-if="step.isClickable"
          class="su-steps__button"
          type="button"
          :aria-current="
            step.index === resolvedCurrentIndex ? 'step' : undefined
          "
          :aria-label="getStepLabel(step.item, step.index)"
          @click="handleClick(step)"
        >
          <span class="su-steps__marker">
            <slot
              name="icon"
              :item="step.item"
              :index="step.index"
              :status="step.status"
              :value="step.value"
            >
              <span class="su-steps__icon" aria-hidden="true">
                <span v-if="step.status === 'finish'">✓</span>
                <span v-else-if="step.status === 'error'">!</span>
                <span v-else>{{ step.index + 1 }}</span>
              </span>
            </slot>
          </span>
          <span class="su-steps__content">
            <span class="su-steps__title">
              <slot
                name="title"
                :item="step.item"
                :index="step.index"
                :status="step.status"
                :value="step.value"
              >
                {{ step.item.title }}
              </slot>
            </span>
            <span
              v-if="!simple && step.item.description"
              class="su-steps__description"
            >
              <slot
                name="description"
                :item="step.item"
                :index="step.index"
                :status="step.status"
                :value="step.value"
              >
                {{ step.item.description }}
              </slot>
            </span>
          </span>
        </button>

        <div
          v-else
          class="su-steps__inner"
          :aria-current="
            step.index === resolvedCurrentIndex ? 'step' : undefined
          "
        >
          <span class="su-steps__marker">
            <slot
              name="icon"
              :item="step.item"
              :index="step.index"
              :status="step.status"
              :value="step.value"
            >
              <span class="su-steps__icon" aria-hidden="true">
                <span v-if="step.status === 'finish'">✓</span>
                <span v-else-if="step.status === 'error'">!</span>
                <span v-else>{{ step.index + 1 }}</span>
              </span>
            </slot>
          </span>
          <span class="su-steps__content">
            <span class="su-steps__title">
              <slot
                name="title"
                :item="step.item"
                :index="step.index"
                :status="step.status"
                :value="step.value"
              >
                {{ step.item.title }}
              </slot>
            </span>
            <span
              v-if="!simple && step.item.description"
              class="su-steps__description"
            >
              <slot
                name="description"
                :item="step.item"
                :index="step.index"
                :status="step.status"
                :value="step.value"
              >
                {{ step.item.description }}
              </slot>
            </span>
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<style>
.su-steps {
  --su-steps-icon-size: 28px;
  --su-steps-gap: var(--su-space-md);
  --su-steps-line-color: var(--su-color-border);
  --su-steps-active-color: var(--su-color-primary);

  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-steps--small {
  --su-steps-icon-size: 24px;
  --su-steps-gap: var(--su-space-sm);

  font-size: var(--su-font-size-sm);
}

.su-steps--large {
  --su-steps-icon-size: 34px;
  --su-steps-gap: var(--su-space-lg);

  font-size: var(--su-font-size-lg);
}

.su-steps__list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-steps--vertical .su-steps__list {
  flex-direction: column;
}

.su-steps__item {
  position: relative;
  flex: 1;
  min-width: 0;
  color: var(--su-color-text-muted);
}

.su-steps__item:not(:last-child)::after {
  position: absolute;
  background: var(--su-steps-line-color);
  content: '';
}

.su-steps--horizontal .su-steps__item:not(:last-child)::after {
  top: calc(var(--su-steps-icon-size) / 2);
  right: var(--su-steps-gap);
  left: calc(var(--su-steps-icon-size) + var(--su-steps-gap));
  height: 1px;
}

.su-steps--vertical .su-steps__item:not(:last-child)::after {
  top: calc(var(--su-steps-icon-size) + var(--su-space-xs));
  bottom: var(--su-space-xs);
  left: calc(var(--su-steps-icon-size) / 2);
  width: 1px;
}

.su-steps__inner,
.su-steps__button {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  gap: var(--su-steps-gap);
  color: inherit;
}

.su-steps--horizontal .su-steps__inner,
.su-steps--horizontal .su-steps__button {
  padding-right: var(--su-steps-gap);
}

.su-steps--vertical .su-steps__inner,
.su-steps--vertical .su-steps__button {
  padding-bottom: var(--su-space-xl);
}

.su-steps__button {
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.su-steps__button:hover .su-steps__title,
.su-steps__button:focus-visible .su-steps__title {
  color: var(--su-color-primary-hover);
}

.su-steps__button:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
  border-radius: var(--su-radius-sm);
}

.su-steps__marker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--su-steps-icon-size);
  height: var(--su-steps-icon-size);
  background: var(--su-color-bg);
}

.su-steps__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-steps-icon-size);
  height: var(--su-steps-icon-size);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-elevated);
  color: var(--su-color-text-muted);
  font-size: 0.86em;
  font-weight: 600;
  line-height: 1;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-steps__content {
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 2px;
  gap: var(--su-space-xs);
}

.su-steps__title {
  color: var(--su-color-text);
  font-weight: 600;
  transition: color 0.16s ease;
}

.su-steps__description {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-steps__item.is-finish {
  --su-steps-line-color: var(--su-color-primary);
}

.su-steps__item.is-finish .su-steps__icon {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary);
  background: color-mix(in srgb, var(--su-color-primary) 10%, transparent);
}

.su-steps__item.is-process .su-steps__icon {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-steps__item.is-error .su-steps__icon {
  border-color: #dc2626;
  color: #fff;
  background: #dc2626;
}

.su-steps__item.is-error .su-steps__title {
  color: #dc2626;
}

.su-steps__item.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-steps.is-simple .su-steps__list {
  gap: var(--su-space-sm);
}

.su-steps.is-simple .su-steps__item {
  flex: none;
}

.su-steps.is-simple .su-steps__item::after {
  display: none;
}

.su-steps.is-simple .su-steps__inner,
.su-steps.is-simple .su-steps__button {
  align-items: center;
  padding: 0;
  gap: var(--su-space-sm);
}

.su-steps.is-simple .su-steps__icon {
  width: 8px;
  height: 8px;
  border-width: 0;
  background: currentcolor;
}

.su-steps.is-simple .su-steps__item.is-finish .su-steps__icon,
.su-steps.is-simple .su-steps__item.is-process .su-steps__icon {
  color: var(--su-color-primary);
}

.su-steps.is-simple .su-steps__item.is-error .su-steps__icon {
  color: #dc2626;
}

.su-steps.is-simple .su-steps__icon > span {
  display: none;
}

.su-steps.is-simple .su-steps__marker {
  width: 8px;
  height: 8px;
}

.su-steps.is-simple .su-steps__content {
  padding-top: 0;
}

@media (max-width: 640px) {
  .su-steps--horizontal:not(.is-simple) .su-steps__list {
    flex-direction: column;
  }

  .su-steps--horizontal:not(.is-simple)
    .su-steps__item:not(:last-child)::after {
    top: calc(var(--su-steps-icon-size) + var(--su-space-xs));
    right: auto;
    bottom: var(--su-space-xs);
    left: calc(var(--su-steps-icon-size) / 2);
    width: 1px;
    height: auto;
  }

  .su-steps--horizontal:not(.is-simple) .su-steps__inner,
  .su-steps--horizontal:not(.is-simple) .su-steps__button {
    padding-right: 0;
    padding-bottom: var(--su-space-xl);
  }
}
</style>
