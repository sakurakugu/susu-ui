<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import type { FormSize } from '../form/context'

defineOptions({
  name: 'SuTimeline',
})

export type TimelineType =
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
export type TimelinePosition = 'left' | 'right' | 'alternate'
export type TimelineSize = FormSize

export interface TimelineItem {
  title?: string
  description?: string
  time?: string
  type?: TimelineType
  color?: string
  hollow?: boolean
}

const props = withDefaults(
  defineProps<{
    items?: TimelineItem[]
    position?: TimelinePosition
    size?: TimelineSize
    reverse?: boolean
    hideTail?: boolean
    ariaLabel?: string
  }>(),
  {
    items: () => [],
    position: 'left',
    size: 'medium',
    reverse: false,
    hideTail: false,
    ariaLabel: '时间轴',
  },
)

defineSlots<{
  default?: (props: {
    item: TimelineItem
    index: number
    type: TimelineType
  }) => unknown
  dot?: (props: {
    item: TimelineItem
    index: number
    type: TimelineType
  }) => unknown
  time?: (props: {
    item: TimelineItem
    index: number
    type: TimelineType
  }) => unknown
  title?: (props: {
    item: TimelineItem
    index: number
    type: TimelineType
  }) => unknown
  description?: (props: {
    item: TimelineItem
    index: number
    type: TimelineType
  }) => unknown
}>()

const timelineItems = computed(() => {
  const items = props.items.map((item, index) => ({
    item,
    originalIndex: index,
    type: item.type ?? 'default',
  }))

  return props.reverse ? items.reverse() : items
})

function getItemStyle(item: TimelineItem) {
  if (!item.color) {
    return undefined
  }

  return {
    '--su-timeline-dot-color': item.color,
  } as CSSProperties
}
</script>

<template>
  <section
    class="su-timeline"
    :class="[`su-timeline--${position}`, `su-timeline--${size}`]"
    :aria-label="ariaLabel"
  >
    <ol class="su-timeline__list">
      <li
        v-for="(entry, index) in timelineItems"
        :key="entry.originalIndex"
        class="su-timeline__item"
        :class="[
          `is-${entry.type}`,
          {
            'is-alternate-left': position === 'alternate' && index % 2 === 1,
            'is-alternate-right': position === 'alternate' && index % 2 === 0,
            'is-hollow': entry.item.hollow,
            'has-custom-color': entry.item.color,
            'is-last': index === timelineItems.length - 1,
            'is-tail-hidden': hideTail,
          },
        ]"
        :style="getItemStyle(entry.item)"
      >
        <div class="su-timeline__axis" aria-hidden="true">
          <span class="su-timeline__dot">
            <slot
              name="dot"
              :item="entry.item"
              :index="index"
              :type="entry.type"
            />
          </span>
          <span class="su-timeline__tail" />
        </div>

        <div class="su-timeline__content">
          <slot :item="entry.item" :index="index" :type="entry.type">
            <time
              v-if="$slots.time || entry.item.time"
              class="su-timeline__time"
            >
              <slot
                name="time"
                :item="entry.item"
                :index="index"
                :type="entry.type"
              >
                {{ entry.item.time }}
              </slot>
            </time>

            <div
              v-if="$slots.title || entry.item.title"
              class="su-timeline__title"
            >
              <slot
                name="title"
                :item="entry.item"
                :index="index"
                :type="entry.type"
              >
                {{ entry.item.title }}
              </slot>
            </div>

            <div
              v-if="$slots.description || entry.item.description"
              class="su-timeline__description"
            >
              <slot
                name="description"
                :item="entry.item"
                :index="index"
                :type="entry.type"
              >
                {{ entry.item.description }}
              </slot>
            </div>
          </slot>
        </div>
      </li>
    </ol>
  </section>
</template>

<style>
.su-timeline {
  --su-timeline-dot-size: 12px;
  --su-timeline-axis-size: 28px;
  --su-timeline-dot-color: var(--su-color-border);
  --su-timeline-tail-color: var(--su-color-border);
  --su-timeline-gap: var(--su-space-sm);

  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-timeline--small {
  --su-timeline-dot-size: 10px;
  --su-timeline-axis-size: 24px;
  --su-timeline-gap: var(--su-space-xs);

  font-size: var(--su-font-size-sm);
}

.su-timeline--large {
  --su-timeline-dot-size: 14px;
  --su-timeline-axis-size: 32px;
  --su-timeline-gap: var(--su-space-md);

  font-size: var(--su-font-size-lg);
}

.su-timeline__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-timeline__item {
  position: relative;
  display: grid;
  min-height: 76px;
  grid-template-columns: var(--su-timeline-axis-size) minmax(0, 1fr);
}

.su-timeline--right .su-timeline__item {
  grid-template-columns: minmax(0, 1fr) var(--su-timeline-axis-size);
}

.su-timeline--alternate .su-timeline__item {
  grid-template-columns:
    minmax(0, 1fr) var(--su-timeline-axis-size)
    minmax(0, 1fr);
}

.su-timeline__axis {
  position: relative;
  display: flex;
  justify-content: center;
  grid-column: 1;
  grid-row: 1;
}

.su-timeline--right .su-timeline__axis {
  grid-column: 2;
}

.su-timeline--alternate .su-timeline__axis {
  grid-column: 2;
}

.su-timeline__dot {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-timeline-dot-size);
  height: var(--su-timeline-dot-size);
  margin-top: 0.42em;
  border: 2px solid var(--su-timeline-dot-color);
  border-radius: var(--su-radius-round);
  background: var(--su-timeline-dot-color);
  color: var(--su-color-primary-text);
  font-size: 0.72em;
  line-height: 1;
}

.su-timeline__dot:empty::before {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  content: '';
}

.su-timeline__tail {
  position: absolute;
  top: calc(0.42em + var(--su-timeline-dot-size) + var(--su-space-xs));
  bottom: var(--su-space-xs);
  left: 50%;
  width: 1px;
  background: var(--su-timeline-tail-color);
  transform: translateX(-50%);
}

.su-timeline__content {
  min-width: 0;
  padding-bottom: var(--su-space-xl);
  grid-column: 2;
  grid-row: 1;
}

.su-timeline--right .su-timeline__content {
  padding-right: var(--su-timeline-gap);
  padding-left: 0;
  grid-column: 1;
  text-align: right;
}

.su-timeline--left .su-timeline__content {
  padding-left: var(--su-timeline-gap);
}

.su-timeline--alternate .su-timeline__content {
  padding-left: var(--su-timeline-gap);
  grid-column: 3;
}

.su-timeline--alternate .is-alternate-left .su-timeline__content {
  padding-right: var(--su-timeline-gap);
  padding-left: 0;
  grid-column: 1;
  text-align: right;
}

.su-timeline__time {
  display: block;
  margin-bottom: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-timeline__title {
  color: var(--su-color-text);
  font-weight: 600;
}

.su-timeline__description {
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-timeline__item.is-primary {
  --su-timeline-dot-color: var(--su-color-primary);
  --su-timeline-tail-color: color-mix(
    in srgb,
    var(--su-color-primary) 42%,
    var(--su-color-border)
  );
}

.su-timeline__item.is-success {
  --su-timeline-dot-color: var(--su-color-success);
  --su-timeline-tail-color: var(--su-color-success-border-soft);
}

.su-timeline__item.is-warning {
  --su-timeline-dot-color: var(--su-color-warning);
  --su-timeline-tail-color: var(--su-color-warning-border-soft);
}

.su-timeline__item.is-error {
  --su-timeline-dot-color: var(--su-color-error);
  --su-timeline-tail-color: var(--su-color-error-border-soft);
}

.su-timeline__item.is-info {
  --su-timeline-dot-color: var(--su-color-info);
  --su-timeline-tail-color: var(--su-color-info-border);
}

.su-timeline__item.is-hollow .su-timeline__dot {
  background: var(--su-color-bg-elevated);
  color: var(--su-timeline-dot-color);
}

.su-timeline__item.is-last .su-timeline__tail,
.su-timeline__item.is-tail-hidden .su-timeline__tail {
  display: none;
}

@media (max-width: 640px) {
  .su-timeline--right .su-timeline__item,
  .su-timeline--alternate .su-timeline__item {
    grid-template-columns: var(--su-timeline-axis-size) minmax(0, 1fr);
  }

  .su-timeline--right .su-timeline__axis,
  .su-timeline--alternate .su-timeline__axis {
    grid-column: 1;
  }

  .su-timeline--right .su-timeline__content,
  .su-timeline--alternate .su-timeline__content,
  .su-timeline--alternate .is-alternate-left .su-timeline__content {
    padding-right: 0;
    padding-left: var(--su-timeline-gap);
    grid-column: 2;
    text-align: left;
  }
}
</style>
