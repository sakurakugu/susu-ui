<script setup lang="ts">
import { computed } from 'vue'
import { create, type QRCodeErrorCorrectionLevel } from 'qrcode'

defineOptions({
  name: 'SuQRCode',
})

export type QRCodeStatus = 'active' | 'expired' | 'loading'
export type QRCodeLevel = QRCodeErrorCorrectionLevel

const props = withDefaults(
  defineProps<{
    value?: string
    size?: number | string
    margin?: number
    level?: QRCodeLevel
    color?: string
    backgroundColor?: string
    radius?: number | string
    status?: QRCodeStatus
    statusText?: string
    iconSize?: number | string
    ariaLabel?: string
  }>(),
  {
    value: '',
    size: 160,
    margin: 2,
    level: 'M',
    color: 'var(--su-color-text)',
    backgroundColor: 'var(--su-color-bg-elevated)',
    radius: 'var(--su-radius-md)',
    status: 'active',
    statusText: undefined,
    iconSize: 36,
    ariaLabel: '二维码',
  },
)

const emit = defineEmits<{
  refresh: []
}>()

defineSlots<{
  icon?: () => unknown
  status?: () => unknown
}>()

const qrCode = computed(() => {
  if (!props.value) {
    return undefined
  }

  return create(props.value, {
    errorCorrectionLevel: props.level,
  })
})

const moduleCount = computed(() => qrCode.value?.modules.size ?? 0)
const viewBoxSize = computed(() => moduleCount.value + normalizedMargin.value * 2)
const normalizedMargin = computed(() =>
  Math.max(0, Number.isFinite(props.margin) ? Math.floor(props.margin) : 0),
)

const pathData = computed(() => {
  const code = qrCode.value

  if (!code) {
    return ''
  }

  const margin = normalizedMargin.value
  const size = code.modules.size
  const rows: string[] = []

  for (let row = 0; row < size; row += 1) {
    let start = -1

    for (let col = 0; col <= size; col += 1) {
      const filled = col < size && Boolean(code.modules.get(row, col))

      if (filled && start < 0) {
        start = col
      }

      if ((!filled || col === size) && start >= 0) {
        rows.push(`M${start + margin} ${row + margin}h${col - start}v1H${start + margin}z`)
        start = -1
      }
    }
  }

  return rows.join('')
})

const displayStatusText = computed(() => {
  if (props.statusText) {
    return props.statusText
  }

  const textMap: Record<QRCodeStatus, string> = {
    active: '',
    expired: '二维码已失效',
    loading: '生成中',
  }

  return textMap[props.status]
})

const isMasked = computed(() => props.status !== 'active')

const qrCodeStyle = computed(() => ({
  '--su-qrcode-size': normalizeSize(props.size),
  '--su-qrcode-color': props.color,
  '--su-qrcode-bg': props.backgroundColor,
  '--su-qrcode-radius': normalizeSize(props.radius),
  '--su-qrcode-icon-size': normalizeSize(props.iconSize),
}))

function normalizeSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function handleRefresh() {
  emit('refresh')
}
</script>

<template>
  <div
    class="su-qrcode"
    :class="[
      `su-qrcode--${status}`,
      {
        'is-empty': !value,
        'is-masked': isMasked,
        'has-icon': Boolean($slots.icon),
      },
    ]"
    :style="qrCodeStyle"
    role="img"
    :aria-label="ariaLabel"
  >
    <svg
      v-if="qrCode"
      class="su-qrcode__svg"
      :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
      shape-rendering="crispEdges"
      aria-hidden="true"
    >
      <rect class="su-qrcode__background" width="100%" height="100%" rx="0" />
      <path class="su-qrcode__modules" :d="pathData" />
    </svg>

    <div v-else class="su-qrcode__empty">
      <slot name="status">暂无二维码内容</slot>
    </div>

    <div v-if="$slots.icon && qrCode" class="su-qrcode__icon" aria-hidden="true">
      <slot name="icon" />
    </div>

    <div v-if="isMasked" class="su-qrcode__mask">
      <div v-if="status === 'loading'" class="su-qrcode__spinner" aria-hidden="true" />
      <slot name="status">
        <button
          v-if="status === 'expired'"
          class="su-qrcode__refresh"
          type="button"
          @click="handleRefresh"
        >
          {{ displayStatusText }}
        </button>
        <span v-else class="su-qrcode__status-text">
          {{ displayStatusText }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style>
.su-qrcode {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-qrcode-size);
  height: var(--su-qrcode-size);
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-qrcode-radius);
  background: var(--su-qrcode-bg);
  color: var(--su-qrcode-color);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
}

.su-qrcode__svg {
  display: block;
  width: 100%;
  height: 100%;
}

.su-qrcode__background {
  fill: var(--su-qrcode-bg);
}

.su-qrcode__modules {
  fill: var(--su-qrcode-color);
}

.su-qrcode__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--su-qrcode-icon-size);
  height: var(--su-qrcode-icon-size);
  padding: 4px;
  border-radius: var(--su-radius-sm);
  background: var(--su-qrcode-bg);
  color: var(--su-color-text);
  transform: translate(-50%, -50%);
}

.su-qrcode__icon > * {
  max-width: 100%;
  max-height: 100%;
}

.su-qrcode__empty,
.su-qrcode__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--su-space-sm);
  text-align: center;
}

.su-qrcode__empty {
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-soft);
}

.su-qrcode__mask {
  flex-direction: column;
  gap: var(--su-space-xs);
  color: var(--su-color-text);
  background: color-mix(in srgb, var(--su-color-bg-elevated) 82%, transparent);
}

.su-qrcode__refresh {
  padding: 0;
  border: 0;
  color: var(--su-color-primary);
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.su-qrcode__refresh:hover {
  color: var(--su-color-primary-hover);
}

.su-qrcode__refresh:focus-visible {
  outline: 2px solid var(--su-color-primary);
  outline-offset: 2px;
}

.su-qrcode__status-text,
.su-qrcode__refresh {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.su-qrcode__spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--su-color-border);
  border-top-color: var(--su-color-primary);
  border-radius: var(--su-radius-round);
  animation: su-qrcode-spin 0.8s linear infinite;
}

@keyframes su-qrcode-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-qrcode__spinner {
    animation: none;
  }
}
</style>
