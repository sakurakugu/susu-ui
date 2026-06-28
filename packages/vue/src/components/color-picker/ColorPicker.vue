<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  watch,
} from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuColorPicker',
  inheritAttrs: false,
})

export type ColorPickerFormat = 'hex' | 'rgb'
export type ColorPickerValue = string

interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

const model = defineModel<ColorPickerValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    showAlpha?: boolean
    format?: ColorPickerFormat
    presets?: string[]
    name?: string
    id?: string
    required?: boolean
    ariaLabel?: string
  }>(),
  {
    size: undefined,
    status: 'default',
    placeholder: '请选择颜色',
    disabled: false,
    readonly: false,
    clearable: false,
    showAlpha: false,
    format: 'hex',
    presets: () => [
      '#1677ff',
      '#52c41a',
      '#faad14',
      '#ff4d4f',
      '#722ed1',
      '#13c2c2',
      '#111827',
      '#ffffff',
    ],
    name: undefined,
    id: undefined,
    required: false,
    ariaLabel: '颜色选择',
  },
)

const emit = defineEmits<{
  input: [value: ColorPickerValue, event: Event]
  change: [value: ColorPickerValue, event?: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  open: []
  close: []
  invalid: [event: Event]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const rootRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const colorInputRef = ref<HTMLInputElement>()
const isOpen = ref(false)
const currentColor = ref<RgbaColor>({ r: 22, g: 119, b: 255, a: 1 })

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const parsedModel = computed(() => parseColor(model.value))
const displayValue = computed(() => model.value || '')
const hexValue = computed(() => toHex(currentColor.value))
const alphaPercent = computed(() => Math.round(currentColor.value.a * 100))
const showClear = computed(
  () => props.clearable && isInteractive.value && model.value.length > 0,
)
const swatchStyle = computed(() => ({
  background: toRgba(currentColor.value),
}))

const normalizedPresets = computed(() =>
  props.presets
    .map((preset) => {
      const color = parseColor(preset)

      return color
        ? {
            value: formatColor(color),
            style: { background: toRgba(color) },
          }
        : undefined
    })
    .filter((item): item is { value: string; style: { background: string } } =>
      Boolean(item),
    ),
)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function toHexPart(value: number) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')
}

function toHex(color: RgbaColor) {
  return `#${toHexPart(color.r)}${toHexPart(color.g)}${toHexPart(color.b)}`
}

function toRgba(color: RgbaColor) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}

function formatColor(color: RgbaColor) {
  const alpha = props.showAlpha ? color.a : 1

  if (props.format === 'rgb' || alpha < 1) {
    return alpha < 1
      ? `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
      : `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  return toHex(color)
}

function parseColor(value?: string): RgbaColor | undefined {
  const sourceValue = value?.trim()

  if (!sourceValue) {
    return undefined
  }

  const hexMatched = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(sourceValue)
  if (hexMatched) {
    const hex = hexMatched[1]
    const normalizedHex =
      hex.length === 3
        ? hex
            .split('')
            .map((item) => `${item}${item}`)
            .join('')
        : hex

    return {
      r: Number.parseInt(normalizedHex.slice(0, 2), 16),
      g: Number.parseInt(normalizedHex.slice(2, 4), 16),
      b: Number.parseInt(normalizedHex.slice(4, 6), 16),
      a: 1,
    }
  }

  const rgbMatched =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.exec(
      sourceValue,
    )

  if (!rgbMatched) {
    return undefined
  }

  return {
    r: clamp(Number(rgbMatched[1]), 0, 255),
    g: clamp(Number(rgbMatched[2]), 0, 255),
    b: clamp(Number(rgbMatched[3]), 0, 255),
    a: clamp(Number(rgbMatched[4] ?? 1), 0, 1),
  }
}

function syncCurrentColor() {
  const parsedColor = parsedModel.value

  if (parsedColor) {
    currentColor.value = {
      ...parsedColor,
      a: props.showAlpha ? parsedColor.a : 1,
    }
  }
}

function updateValue(color: RgbaColor, event?: Event, emitInput = false) {
  if (!isInteractive.value) {
    syncCurrentColor()
    return
  }

  currentColor.value = {
    ...color,
    a: props.showAlpha ? color.a : 1,
  }

  const nextValue = formatColor(currentColor.value)
  model.value = nextValue

  if (emitInput && event) {
    emit('input', nextValue, event)
  }

  emit('change', nextValue, event)
}

function openPanel() {
  if (!isInteractive.value || isOpen.value) {
    return
  }

  isOpen.value = true
  emit('open')
  document.addEventListener('pointerdown', handleDocumentPointerdown)
}

function closePanel() {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('close')
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
}

function togglePanel() {
  if (isOpen.value) {
    closePanel()
    return
  }

  openPanel()
}

function clearValue() {
  if (!isInteractive.value) {
    return
  }

  model.value = ''
  emit('clear')
  closePanel()
  nextTick(() => inputRef.value?.focus())
}

function handleNativeColorInput(event: Event) {
  const target = event.target as HTMLInputElement
  const color = parseColor(target.value)

  if (color) {
    updateValue({ ...color, a: currentColor.value.a }, event, true)
  }
}

function handleAlphaInput(event: Event) {
  const target = event.target as HTMLInputElement
  updateValue(
    {
      ...currentColor.value,
      a: Number(target.value) / 100,
    },
    event,
    true,
  )
}

function selectPreset(value: string, event: Event) {
  const color = parseColor(value)

  if (color) {
    updateValue(color, event)
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const color = parseColor(target.value)
  model.value = target.value

  if (color) {
    currentColor.value = color
    emit('input', target.value, event)
  }
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const color = parseColor(target.value)

  if (!target.value) {
    model.value = ''
    emit('change', '')
    return
  }

  if (!color) {
    target.value = displayValue.value
    return
  }

  updateValue(color, event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleInvalid(event: Event) {
  emit('invalid', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPanel()
    return
  }

  if (event.key === 'Escape') {
    closePanel()
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    inputRef.value?.focus()
  }
}

function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node

  if (!rootRef.value?.contains(target)) {
    closePanel()
  }
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

watch(() => [model.value, props.showAlpha], syncCurrentColor, {
  immediate: true,
})

watch(
  () => isInteractive.value,
  (nextValue) => {
    if (!nextValue) {
      closePanel()
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown)
})

defineExpose({
  ref: inputRef,
  colorRef: colorInputRef,
  focus,
  blur,
  open: openPanel,
  close: closePanel,
  clear: clearValue,
})
</script>

<template>
  <span
    ref="rootRef"
    class="su-color-picker"
    :class="[
      `su-color-picker--${mergedSize}`,
      `su-color-picker--${status}`,
      {
        'is-open': isOpen,
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-empty': !model,
        'is-clearable': showClear,
      },
    ]"
  >
    <span class="su-color-picker__control">
      <span class="su-color-picker__swatch-wrap" aria-hidden="true">
        <span class="su-color-picker__swatch" :style="swatchStyle" />
      </span>
      <input
        v-bind="attrs"
        :id="id"
        ref="inputRef"
        class="su-color-picker__inner"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="mergedDisabled"
        :readonly="readonly"
        :name="name"
        :required="required"
        :aria-label="ariaLabel"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @invalid="handleInvalid"
        @keydown="handleKeydown"
      />
      <button
        v-if="showClear"
        class="su-color-picker__clear"
        type="button"
        aria-label="清空颜色"
        @click="clearValue"
      >
        &times;
      </button>
      <button
        class="su-color-picker__trigger"
        type="button"
        aria-label="打开颜色面板"
        :disabled="!isInteractive"
        @click="togglePanel"
      >
        <span class="su-color-picker__arrow" aria-hidden="true" />
      </button>
    </span>

    <div
      v-if="isOpen"
      class="su-color-picker__panel"
      role="dialog"
      aria-label="颜色面板"
      @keydown="handlePanelKeydown"
    >
      <label class="su-color-picker__native">
        <span>颜色</span>
        <input
          ref="colorInputRef"
          class="su-color-picker__native-input"
          type="color"
          :value="hexValue"
          :disabled="!isInteractive"
          aria-label="选择颜色"
          @input="handleNativeColorInput"
          @change="handleNativeColorInput"
        />
      </label>

      <label v-if="showAlpha" class="su-color-picker__alpha">
        <span>透明度</span>
        <strong>{{ alphaPercent }}%</strong>
        <input
          class="su-color-picker__alpha-input"
          type="range"
          min="0"
          max="100"
          :value="alphaPercent"
          :disabled="!isInteractive"
          aria-label="调整透明度"
          @input="handleAlphaInput"
          @change="handleAlphaInput"
        />
      </label>

      <div v-if="normalizedPresets.length > 0" class="su-color-picker__presets">
        <button
          v-for="preset in normalizedPresets"
          :key="preset.value"
          class="su-color-picker__preset"
          type="button"
          :style="preset.style"
          :aria-label="`选择颜色 ${preset.value}`"
          :disabled="!isInteractive"
          @click="selectPreset(preset.value, $event)"
        />
      </div>
    </div>
  </span>
</template>

<style>
.su-color-picker {
  position: relative;
  display: inline-flex;
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-color-picker__control {
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-color-picker:hover:not(.is-disabled) .su-color-picker__control {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-color-picker:focus-within .su-color-picker__control,
.su-color-picker.is-open .su-color-picker__control {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-color-picker--success .su-color-picker__control {
  border-color: var(--su-color-success);
}

.su-color-picker--success:focus-within .su-color-picker__control {
  border-color: var(--su-color-success-active);
}

.su-color-picker--warning .su-color-picker__control {
  border-color: var(--su-color-warning);
}

.su-color-picker--warning:focus-within .su-color-picker__control {
  border-color: var(--su-color-warning-active);
}

.su-color-picker--error .su-color-picker__control {
  border-color: var(--su-color-error);
}

.su-color-picker--error:focus-within .su-color-picker__control {
  border-color: var(--su-color-error-active);
}

.su-color-picker--small {
  font-size: var(--su-font-size-sm);
}

.su-color-picker--small .su-color-picker__control {
  min-height: 24px;
}

.su-color-picker--medium .su-color-picker__control {
  min-height: 32px;
}

.su-color-picker--large {
  font-size: var(--su-font-size-lg);
}

.su-color-picker--large .su-color-picker__control {
  min-height: 44px;
}

.su-color-picker__swatch-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 34px;
  align-self: stretch;
}

.su-color-picker__swatch,
.su-color-picker__preset {
  background-image:
    linear-gradient(45deg, #d1d5db 25%, transparent 25%),
    linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d1d5db 75%),
    linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
  background-position:
    0 0,
    0 4px,
    4px -4px,
    -4px 0;
  background-size: 8px 8px;
}

.su-color-picker__swatch {
  width: 18px;
  height: 18px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 36%);
}

.su-color-picker__inner {
  min-width: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
}

.su-color-picker--small .su-color-picker__inner {
  padding: 0 var(--su-space-sm) 0 0;
}

.su-color-picker--medium .su-color-picker__inner {
  padding: 0 var(--su-space-md) 0 0;
}

.su-color-picker--large .su-color-picker__inner {
  padding: 0 var(--su-space-lg) 0 0;
}

.su-color-picker__inner::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-color-picker__clear,
.su-color-picker__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.su-color-picker__clear {
  width: 20px;
  height: 20px;
  margin-right: var(--su-space-xs);
  padding: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  line-height: 1;
}

.su-color-picker__trigger {
  align-self: stretch;
  width: 30px;
  padding: 0;
  color: var(--su-color-text-muted);
}

.su-color-picker__clear:hover,
.su-color-picker__trigger:hover:not(:disabled) {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-color-picker__trigger:disabled {
  cursor: not-allowed;
}

.su-color-picker__arrow {
  width: 7px;
  height: 7px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: translateY(-2px) rotate(45deg);
}

.su-color-picker__panel {
  position: absolute;
  top: calc(100% + var(--su-space-xs));
  left: 0;
  z-index: 20;
  display: grid;
  width: 240px;
  gap: var(--su-space-md);
  padding: var(--su-space-md);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
}

.su-color-picker__native,
.su-color-picker__alpha {
  display: grid;
  gap: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-color-picker__native {
  grid-template-columns: 1fr 48px;
  align-items: center;
}

.su-color-picker__native-input {
  width: 48px;
  height: 32px;
  padding: 2px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-elevated);
  cursor: pointer;
}

.su-color-picker__alpha {
  grid-template-columns: 1fr auto;
}

.su-color-picker__alpha-input {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0;
  accent-color: var(--su-color-primary);
}

.su-color-picker__presets {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: var(--su-space-xs);
}

.su-color-picker__preset {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 36%);
  cursor: pointer;
}

.su-color-picker__preset:hover:not(:disabled) {
  border-color: var(--su-color-primary);
  box-shadow: 0 0 0 2px
    color-mix(in srgb, var(--su-color-primary) 18%, transparent);
}

.su-color-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-color-picker.is-disabled .su-color-picker__inner {
  cursor: not-allowed;
}

.su-color-picker.is-readonly .su-color-picker__inner {
  cursor: default;
}
</style>
