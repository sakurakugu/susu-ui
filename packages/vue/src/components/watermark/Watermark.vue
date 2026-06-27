<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuWatermark',
})

export type WatermarkContent = string | string[]

export type WatermarkFontWeight =
  'normal' | 'bold' | 'lighter' | 'bolder' | number

const props = withDefaults(
  defineProps<{
    content?: WatermarkContent
    image?: string
    width?: number
    height?: number
    gapX?: number
    gapY?: number
    offsetX?: number
    offsetY?: number
    rotate?: number
    color?: string
    opacity?: number
    fontSize?: number
    fontWeight?: WatermarkFontWeight
    fontFamily?: string
    imageWidth?: number
    imageHeight?: number
    zIndex?: number
    fullscreen?: boolean
    disabled?: boolean
  }>(),
  {
    content: 'Susu UI',
    image: undefined,
    width: 160,
    height: 100,
    gapX: 40,
    gapY: 40,
    offsetX: 0,
    offsetY: 0,
    rotate: -22,
    color: 'rgb(15 23 42)',
    opacity: 0.12,
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    imageWidth: undefined,
    imageHeight: undefined,
    zIndex: 9,
    fullscreen: false,
    disabled: false,
  },
)

defineSlots<{
  default?: () => unknown
}>()

const tileWidth = computed(() => Math.max(1, props.width + props.gapX))
const tileHeight = computed(() => Math.max(1, props.height + props.gapY))

const watermarkStyle = computed<CSSProperties>(() => {
  if (props.disabled) {
    return {}
  }

  return {
    '--su-watermark-image': `url("${createWatermarkSvg()}")`,
    '--su-watermark-size': `${tileWidth.value}px ${tileHeight.value}px`,
    '--su-watermark-position': `${props.offsetX}px ${props.offsetY}px`,
    '--su-watermark-z-index': props.zIndex,
  } as CSSProperties
})

function createWatermarkSvg() {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth.value}" height="${tileHeight.value}" viewBox="0 0 ${tileWidth.value} ${tileHeight.value}">`,
    `<g transform="translate(${tileWidth.value / 2} ${tileHeight.value / 2}) rotate(${props.rotate})" opacity="${clamp(props.opacity, 0, 1)}">`,
    props.image ? createImageNode() : createTextNodes(),
    '</g>',
    '</svg>',
  ].join('')

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function createImageNode() {
  const width = props.imageWidth ?? props.width
  const height = props.imageHeight ?? props.height

  return `<image href="${escapeAttribute(props.image ?? '')}" x="${-width / 2}" y="${-height / 2}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" />`
}

function createTextNodes() {
  const lines = Array.isArray(props.content) ? props.content : [props.content]
  const safeLines = lines.filter((line) => line !== '')
  const lineHeight = props.fontSize * 1.45
  const startY = -((safeLines.length - 1) * lineHeight) / 2

  return safeLines
    .map((line, index) => {
      const y = startY + index * lineHeight

      return `<text x="0" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${escapeAttribute(props.color)}" font-size="${props.fontSize}" font-weight="${props.fontWeight}" font-family="${escapeAttribute(props.fontFamily)}">${escapeText(line)}</text>`
    })
    .join('')
}

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeText(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
</script>

<template>
  <div
    class="su-watermark"
    :class="{
      'is-fullscreen': fullscreen,
      'is-disabled': disabled,
    }"
    :style="watermarkStyle"
  >
    <slot />
    <div v-if="!disabled" class="su-watermark__layer" aria-hidden="true" />
  </div>
</template>

<style>
.su-watermark {
  position: relative;
  display: block;
  min-width: 0;
}

.su-watermark__layer {
  position: absolute;
  inset: 0;
  z-index: var(--su-watermark-z-index);
  pointer-events: none;
  background-image: var(--su-watermark-image);
  background-repeat: repeat;
  background-position: var(--su-watermark-position);
  background-size: var(--su-watermark-size);
}

.su-watermark.is-fullscreen > .su-watermark__layer {
  position: fixed;
}
</style>
