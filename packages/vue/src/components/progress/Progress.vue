<script setup lang="ts">
import { computed } from 'vue'
import type { FormSize } from '../form/context'

defineOptions({
  name: 'SuProgress',
})

export type ProgressType = 'line' | 'circle'
export type ProgressStatus = 'normal' | 'success' | 'warning' | 'error'
export type ProgressSize = FormSize

const props = withDefaults(
  defineProps<{
    percentage?: number
    type?: ProgressType
    status?: ProgressStatus
    size?: ProgressSize
    strokeWidth?: number
    width?: number
    showText?: boolean
    textInside?: boolean
    format?: (percentage: number) => string
    indeterminate?: boolean
    ariaLabel?: string
  }>(),
  {
    percentage: 0,
    type: 'line',
    status: 'normal',
    size: 'medium',
    strokeWidth: undefined,
    width: 120,
    showText: true,
    textInside: false,
    format: undefined,
    indeterminate: false,
    ariaLabel: '进度',
  },
)

const normalizedPercentage = computed(() =>
  Math.min(
    100,
    Math.max(0, Number.isFinite(props.percentage) ? props.percentage : 0),
  ),
)

const displayText = computed(() =>
  props.format
    ? props.format(normalizedPercentage.value)
    : `${Math.round(normalizedPercentage.value)}%`,
)

const lineStrokeWidth = computed(() => props.strokeWidth ?? 8)
const circleStrokeWidth = computed(() => props.strokeWidth ?? 8)
const radius = computed(() => (props.width - circleStrokeWidth.value) / 2)
const perimeter = computed(() => 2 * Math.PI * radius.value)
const circleOffset = computed(() => 1 - normalizedPercentage.value / 100)

const progressStyle = computed(() => ({
  '--su-progress-percent': `${normalizedPercentage.value}%`,
  '--su-progress-stroke-width': `${lineStrokeWidth.value}px`,
  '--su-progress-circle-size': `${props.width}px`,
  '--su-progress-circle-stroke-width': `${circleStrokeWidth.value}px`,
  '--su-progress-circle-offset': circleOffset.value,
  '--su-progress-circle-perimeter': perimeter.value,
}))

const roleAttributes = computed(() =>
  props.indeterminate
    ? {}
    : {
        'aria-valuenow': normalizedPercentage.value,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
      },
)
</script>

<template>
  <div
    class="su-progress"
    :class="[
      `su-progress--${type}`,
      `su-progress--${status}`,
      `su-progress--${size}`,
      {
        'is-text-inside': textInside,
        'is-indeterminate': indeterminate,
        'has-text': showText,
      },
    ]"
    :style="progressStyle"
    role="progressbar"
    :aria-label="ariaLabel"
    v-bind="roleAttributes"
  >
    <template v-if="type === 'circle'">
      <svg class="su-progress__circle" :viewBox="`0 0 ${width} ${width}`">
        <circle
          class="su-progress__circle-track"
          :cx="width / 2"
          :cy="width / 2"
          :r="radius"
          fill="none"
        />
        <circle
          class="su-progress__circle-bar"
          :cx="width / 2"
          :cy="width / 2"
          :r="radius"
          fill="none"
          pathLength="1"
        />
      </svg>
      <span v-if="showText" class="su-progress__text">
        <slot>{{ displayText }}</slot>
      </span>
    </template>

    <template v-else>
      <div class="su-progress__line">
        <div class="su-progress__track">
          <div class="su-progress__bar">
            <span v-if="showText && textInside" class="su-progress__inner-text">
              <slot>{{ displayText }}</slot>
            </span>
          </div>
        </div>
      </div>
      <span v-if="showText && !textInside" class="su-progress__text">
        <slot>{{ displayText }}</slot>
      </span>
    </template>
  </div>
</template>

<style>
.su-progress {
  --su-progress-color: var(--su-color-primary);
  --su-progress-track-bg: color-mix(
    in srgb,
    var(--su-color-border) 70%,
    var(--su-color-bg-soft)
  );

  display: inline-flex;
  align-items: center;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-progress--success {
  --su-progress-color: #16a34a;
}

.su-progress--warning {
  --su-progress-color: #d97706;
}

.su-progress--error {
  --su-progress-color: #dc2626;
}

.su-progress--small {
  font-size: var(--su-font-size-sm);
}

.su-progress--large {
  font-size: var(--su-font-size-lg);
}

.su-progress__line {
  flex: 1;
  min-width: 0;
}

.su-progress__track {
  overflow: hidden;
  width: 100%;
  height: var(--su-progress-stroke-width);
  border-radius: var(--su-radius-round);
  background: var(--su-progress-track-bg);
}

.su-progress__bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: var(--su-progress-percent);
  min-width: 0;
  height: 100%;
  border-radius: inherit;
  background: var(--su-progress-color);
  transition:
    width 0.24s ease,
    background-color 0.16s ease;
}

.su-progress.is-indeterminate .su-progress__bar {
  width: 38%;
  animation: su-progress-indeterminate 1.2s ease-in-out infinite;
}

.su-progress__inner-text {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--su-space-xs);
  color: var(--su-color-primary-text);
  font-size: var(--su-font-size-sm);
  line-height: 1;
  white-space: nowrap;
}

.su-progress__text {
  flex: none;
  margin-left: var(--su-space-sm);
  color: var(--su-color-text-muted);
  white-space: nowrap;
}

.su-progress--circle {
  position: relative;
  justify-content: center;
  width: var(--su-progress-circle-size);
  height: var(--su-progress-circle-size);
}

.su-progress__circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.su-progress__circle-track,
.su-progress__circle-bar {
  stroke-width: var(--su-progress-circle-stroke-width);
}

.su-progress__circle-track {
  stroke: var(--su-progress-track-bg);
}

.su-progress__circle-bar {
  stroke: var(--su-progress-color);
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: var(--su-progress-circle-offset);
  transition:
    stroke-dashoffset 0.24s ease,
    stroke 0.16s ease;
}

.su-progress--circle .su-progress__text {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: 0;
  color: var(--su-color-text);
  transform: translate(-50%, -50%);
}

@keyframes su-progress-indeterminate {
  0% {
    margin-left: -38%;
  }

  100% {
    margin-left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-progress__bar,
  .su-progress__circle-bar {
    transition: none;
  }

  .su-progress.is-indeterminate .su-progress__bar {
    animation: none;
  }
}
</style>
