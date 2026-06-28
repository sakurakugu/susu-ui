<script setup lang="ts">
import { computed } from 'vue'
import type { StyleValue } from 'vue'

defineOptions({
  name: 'SuStatistic',
})

export type StatisticValue = string | number
export type StatisticSize = 'small' | 'medium' | 'large'
export type StatisticStatus = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
export type StatisticTrend = 'up' | 'down' | 'stable'
export type StatisticAlign = 'left' | 'center' | 'right'

const props = withDefaults(
  defineProps<{
    title?: string
    value?: StatisticValue
    precision?: number
    groupSeparator?: string
    decimalSeparator?: string
    prefix?: string
    suffix?: string
    description?: string
    status?: StatisticStatus
    trend?: StatisticTrend
    size?: StatisticSize
    align?: StatisticAlign
    loading?: boolean
    valueStyle?: StyleValue
    format?: (value: StatisticValue) => StatisticValue
  }>(),
  {
    title: undefined,
    value: 0,
    precision: undefined,
    groupSeparator: ',',
    decimalSeparator: '.',
    prefix: undefined,
    suffix: undefined,
    description: undefined,
    status: 'default',
    trend: undefined,
    size: 'medium',
    align: 'left',
    loading: false,
    valueStyle: undefined,
    format: undefined,
  },
)

defineSlots<{
  title?: () => unknown
  value?: (props: { value: StatisticValue; formattedValue: string }) => unknown
  prefix?: () => unknown
  suffix?: () => unknown
  description?: () => unknown
}>()

const normalizedPrecision = computed(() => {
  if (props.precision === undefined) {
    return undefined
  }

  return Math.max(0, Math.floor(props.precision))
})

const formattedValue = computed(() => {
  const formatResult = props.format ? props.format(props.value) : props.value

  if (typeof formatResult !== 'number') {
    return String(formatResult)
  }

  const fixedValue =
    normalizedPrecision.value === undefined
      ? String(formatResult)
      : formatResult.toFixed(normalizedPrecision.value)
  const [integerPart = '0', decimalPart] = fixedValue.split('.')
  const sign = integerPart.startsWith('-') ? '-' : ''
  const unsignedInteger = sign ? integerPart.slice(1) : integerPart
  const groupedInteger = unsignedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator)

  return decimalPart === undefined
    ? `${sign}${groupedInteger}`
    : `${sign}${groupedInteger}${props.decimalSeparator}${decimalPart}`
})
</script>

<template>
  <section
    class="su-statistic"
    :class="[
      `su-statistic--${status}`,
      `su-statistic--${size}`,
      `su-statistic--align-${align}`,
      {
        [`su-statistic--trend-${trend}`]: trend,
        'is-loading': loading,
      },
    ]"
  >
    <div v-if="title || $slots.title" class="su-statistic__title">
      <slot name="title">
        {{ title }}
      </slot>
    </div>

    <div v-if="loading" class="su-statistic__skeleton" aria-hidden="true">
      <span class="su-statistic__skeleton-line" />
      <span class="su-statistic__skeleton-text" />
    </div>

    <template v-else>
      <div class="su-statistic__value" :style="valueStyle">
        <span v-if="prefix || $slots.prefix" class="su-statistic__prefix">
          <slot name="prefix">
            {{ prefix }}
          </slot>
        </span>
        <span v-if="trend" class="su-statistic__trend" aria-hidden="true">
          <template v-if="trend === 'up'">▲</template>
          <template v-else-if="trend === 'down'">▼</template>
          <template v-else>-</template>
        </span>
        <span class="su-statistic__number">
          <slot name="value" :value="value" :formatted-value="formattedValue">
            {{ formattedValue }}
          </slot>
        </span>
        <span v-if="suffix || $slots.suffix" class="su-statistic__suffix">
          <slot name="suffix">
            {{ suffix }}
          </slot>
        </span>
      </div>

      <div v-if="description || $slots.description" class="su-statistic__description">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
    </template>
  </section>
</template>

<style>
.su-statistic {
  --su-statistic-color: var(--su-color-text);

  display: inline-flex;
  align-items: flex-start;
  flex-direction: column;
  min-width: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: top;
}

.su-statistic--align-center {
  align-items: center;
  text-align: center;
}

.su-statistic--align-right {
  align-items: flex-end;
  text-align: right;
}

.su-statistic--primary {
  --su-statistic-color: var(--su-color-primary);
}

.su-statistic--success,
.su-statistic--trend-up {
  --su-statistic-color: var(--su-color-success-text);
}

.su-statistic--warning {
  --su-statistic-color: var(--su-color-warning-text);
}

.su-statistic--error,
.su-statistic--trend-down {
  --su-statistic-color: var(--su-color-error-text);
}

.su-statistic--info {
  --su-statistic-color: var(--su-color-info);
}

.su-statistic--trend-stable {
  --su-statistic-color: var(--su-color-text-muted);
}

.su-statistic__title {
  overflow: hidden;
  max-width: 100%;
  margin-bottom: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-statistic__value {
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  color: var(--su-statistic-color);
  font-size: 28px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  line-height: 1.18;
}

.su-statistic--small .su-statistic__value {
  font-size: 22px;
}

.su-statistic--large .su-statistic__value {
  font-size: 36px;
}

.su-statistic__prefix,
.su-statistic__suffix,
.su-statistic__trend {
  display: inline-flex;
  align-items: center;
  flex: none;
  color: currentcolor;
  font-size: 0.58em;
  font-weight: 500;
  line-height: 1;
}

.su-statistic__prefix,
.su-statistic__trend {
  margin-right: var(--su-space-xs);
}

.su-statistic__suffix {
  margin-left: var(--su-space-xs);
}

.su-statistic__number {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-statistic__description {
  overflow: hidden;
  max-width: 100%;
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-statistic__skeleton {
  display: grid;
  width: 132px;
  gap: var(--su-space-sm);
}

.su-statistic__skeleton-line,
.su-statistic__skeleton-text {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: var(--su-radius-sm);
  background: color-mix(in srgb, var(--su-color-text-muted) 14%, var(--su-color-bg-soft));
}

.su-statistic__skeleton-line {
  width: 100%;
  height: 32px;
}

.su-statistic__skeleton-text {
  width: 64%;
  height: 14px;
}

.su-statistic.is-loading .su-statistic__skeleton-line::after,
.su-statistic.is-loading .su-statistic__skeleton-text::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--su-color-bg-elevated) 72%, transparent),
    transparent
  );
  animation: su-statistic-wave 1.4s ease-in-out infinite;
  content: '';
  transform: translateX(-100%);
}

@keyframes su-statistic-wave {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-statistic.is-loading .su-statistic__skeleton-line::after,
  .su-statistic.is-loading .su-statistic__skeleton-text::after {
    animation: none;
  }
}
</style>
