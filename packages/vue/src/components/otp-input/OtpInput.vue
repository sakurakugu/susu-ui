<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuOtpInput',
})

export type OtpInputSize = FormSize
export type OtpInputStatus = FormItemStatus
export type OtpInputType = 'number' | 'text'

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    length?: number
    type?: OtpInputType
    size?: OtpInputSize
    status?: OtpInputStatus
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    mask?: boolean
    autofocus?: boolean
    name?: string
    id?: string
    autocomplete?: string
    ariaLabel?: string
  }>(),
  {
    length: 6,
    type: 'number',
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    readonly: false,
    clearable: false,
    mask: false,
    autofocus: false,
    name: undefined,
    id: undefined,
    autocomplete: 'one-time-code',
    ariaLabel: '验证码',
  },
)

const emit = defineEmits<{
  input: [value: string, event: Event]
  change: [value: string, event?: Event]
  complete: [value: string]
  focus: [event: FocusEvent, index: number]
  blur: [event: FocusEvent, index: number]
  clear: []
}>()

const form = inject(formKey, undefined)
const inputRefs = ref<HTMLInputElement[]>([])
const focusedIndex = ref(-1)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')
const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)
const normalizedLength = computed(() => Math.max(1, Math.floor(props.length)))
const boxes = computed(() =>
  Array.from({ length: normalizedLength.value }, (_, index) => index),
)
const chars = computed(() =>
  model.value.slice(0, normalizedLength.value).split(''),
)
const isInteractive = computed(() => !mergedDisabled.value && !props.readonly)
const showClear = computed(
  () => props.clearable && isInteractive.value && model.value.length > 0,
)
const inputType = computed(() => (props.mask ? 'password' : 'text'))
const inputMode = computed(() => (props.type === 'number' ? 'numeric' : 'text'))
const pattern = computed(() => (props.type === 'number' ? '\\d*' : undefined))

function setInputRef(element: HTMLInputElement | null, index: number) {
  if (element) {
    inputRefs.value[index] = element
  }
}

function normalizeText(value: string) {
  const normalizedValue =
    props.type === 'number' ? value.replace(/\D/g, '') : value
  return Array.from(normalizedValue).slice(0, normalizedLength.value).join('')
}

function updateValue(value: string, event?: Event, shouldEmitChange = false) {
  const nextValue = normalizeText(value)
  const wasComplete = model.value.length === normalizedLength.value

  model.value = nextValue
  emit('input', nextValue, event ?? new Event('input'))

  if (shouldEmitChange) {
    emit('change', nextValue, event)
  }

  if (!wasComplete && nextValue.length === normalizedLength.value) {
    emit('complete', nextValue)
  }
}

function focusIndex(index: number) {
  const targetIndex = Math.min(Math.max(index, 0), normalizedLength.value - 1)
  void nextTick(() => inputRefs.value[targetIndex]?.focus())
}

function selectIndex(index: number) {
  const targetIndex = Math.min(Math.max(index, 0), normalizedLength.value - 1)
  void nextTick(() => inputRefs.value[targetIndex]?.select())
}

function applyInputValue(inputValue: string, index: number, event: Event) {
  const currentChars = chars.value

  if (!inputValue) {
    currentChars[index] = ''
    updateValue(currentChars.join(''), event)
    return
  }

  const nextChars = [...currentChars]
  inputValue.split('').forEach((char, offset) => {
    const targetIndex = index + offset

    if (targetIndex < normalizedLength.value) {
      nextChars[targetIndex] = char
    }
  })

  const nextValue = nextChars.join('')
  updateValue(nextValue, event)

  if (inputValue.length > 1) {
    focusIndex(Math.min(index + inputValue.length, normalizedLength.value - 1))
    return
  }

  if (index < normalizedLength.value - 1) {
    focusIndex(index + 1)
  }
}

function handleInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  applyInputValue(normalizeText(target.value), index, event)
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace') {
    if (chars.value[index]) {
      return
    }

    event.preventDefault()
    const nextChars = [...chars.value]
    nextChars[index - 1] = ''
    updateValue(nextChars.join(''), event)
    focusIndex(index - 1)
    return
  }

  if (event.key === 'Delete') {
    event.preventDefault()
    const nextChars = [...chars.value]
    nextChars[index] = ''
    updateValue(nextChars.join(''), event)
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    selectIndex(index - 1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    selectIndex(index + 1)
  }
}

function handlePaste(event: ClipboardEvent, index: number) {
  const text = event.clipboardData?.getData('text') ?? ''

  if (!text) {
    return
  }

  event.preventDefault()
  applyInputValue(normalizeText(text), index, event)
}

function handleChange(event: Event) {
  emit('change', model.value, event)
}

function handleFocus(event: FocusEvent, index: number) {
  focusedIndex.value = index
  emit('focus', event, index)
}

function handleBlur(event: FocusEvent, index: number) {
  if (focusedIndex.value === index) {
    focusedIndex.value = -1
  }

  emit('blur', event, index)
}

function clearValue() {
  if (!isInteractive.value) {
    return
  }

  model.value = ''
  emit('clear')
  emit('change', '')
  focusIndex(0)
}

function focus() {
  const nextIndex =
    model.value.length >= normalizedLength.value
      ? normalizedLength.value - 1
      : model.value.length
  focusIndex(nextIndex)
}

function blur() {
  inputRefs.value.forEach((input) => input?.blur())
}

function select(index = focusedIndex.value >= 0 ? focusedIndex.value : 0) {
  selectIndex(index)
}

watch(
  normalizedLength,
  () => {
    if (model.value.length > normalizedLength.value) {
      model.value = model.value.slice(0, normalizedLength.value)
    }
  },
  { immediate: true },
)

watch(
  () => props.autofocus,
  (autofocus) => {
    if (autofocus) {
      focusIndex(0)
    }
  },
  { immediate: true, flush: 'post' },
)

defineExpose({
  refs: inputRefs,
  focus,
  blur,
  select,
  clear: clearValue,
})
</script>

<template>
  <span
    class="su-otp-input"
    :class="[
      `su-otp-input--${mergedSize}`,
      `su-otp-input--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-readonly': readonly,
        'is-clearable': showClear,
      },
    ]"
    role="group"
    :aria-label="ariaLabel"
  >
    <input v-if="name" type="hidden" :name="name" :value="model" />
    <input
      v-for="index in boxes"
      :id="id ? `${id}-${index + 1}` : undefined"
      :key="index"
      :ref="(element) => setInputRef(element as HTMLInputElement | null, index)"
      class="su-otp-input__item"
      :type="inputType"
      :value="chars[index] ?? ''"
      maxlength="1"
      :placeholder="placeholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :autocomplete="index === 0 ? autocomplete : 'off'"
      :inputmode="inputMode"
      :pattern="pattern"
      :aria-label="`${ariaLabel}第 ${index + 1} 位`"
      @input="handleInput($event, index)"
      @keydown="handleKeydown($event, index)"
      @paste="handlePaste($event, index)"
      @change="handleChange"
      @focus="handleFocus($event, index)"
      @blur="handleBlur($event, index)"
    />
    <button
      v-if="showClear"
      class="su-otp-input__clear"
      type="button"
      aria-label="清空验证码"
      @click="clearValue"
    >
      &times;
    </button>
  </span>
</template>

<style>
.su-otp-input {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-sm);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-otp-input__item {
  flex: none;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: inherit;
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  font-weight: 600;
  text-align: center;
  outline: 0;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;
}

.su-otp-input__item:hover:not(:disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-otp-input__item:focus {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-otp-input--success .su-otp-input__item {
  border-color: var(--su-color-success);
}

.su-otp-input--success .su-otp-input__item:focus {
  border-color: var(--su-color-success-active);
}

.su-otp-input--warning .su-otp-input__item {
  border-color: var(--su-color-warning);
}

.su-otp-input--warning .su-otp-input__item:focus {
  border-color: var(--su-color-warning-active);
}

.su-otp-input--error .su-otp-input__item {
  border-color: var(--su-color-error);
}

.su-otp-input--error .su-otp-input__item:focus {
  border-color: var(--su-color-error-active);
}

.su-otp-input--small .su-otp-input__item {
  width: 28px;
  height: 28px;
  font-size: var(--su-font-size-sm);
}

.su-otp-input--medium .su-otp-input__item {
  width: 36px;
  height: 36px;
  font-size: var(--su-font-size-md);
}

.su-otp-input--large .su-otp-input__item {
  width: 44px;
  height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-otp-input__item::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.48;
}

.su-otp-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-otp-input__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-otp-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-otp-input.is-disabled .su-otp-input__item {
  cursor: not-allowed;
}

.su-otp-input.is-readonly .su-otp-input__item {
  cursor: default;
}
</style>
