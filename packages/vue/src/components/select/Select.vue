<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue'
import { formKey, type FormItemStatus, type FormSize } from '../form/context'

defineOptions({
  name: 'SuSelect',
  inheritAttrs: false,
})

export type SelectValue = string | number

export interface SelectOption {
  label: string
  value: SelectValue
  disabled?: boolean
}

const model = defineModel<SelectValue>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    options?: SelectOption[]
    size?: FormSize
    status?: FormItemStatus
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    name?: string
    id?: string
    required?: boolean
  }>(),
  {
    options: undefined,
    size: undefined,
    status: 'default',
    placeholder: undefined,
    disabled: false,
    clearable: false,
    name: undefined,
    id: undefined,
    required: false,
  },
)

const emit = defineEmits<{
  change: [value: SelectValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const selectRef = ref<HTMLSelectElement>()

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const showPlaceholder = computed(() => Boolean(props.placeholder))

const showClear = computed(
  () => props.clearable && !mergedDisabled.value && model.value !== '',
)

const hasOptions = computed(() => Boolean(props.options?.length))

function getOptionValue(value: string) {
  const option = props.options?.find((item) => `${item.value}` === value)
  return option ? option.value : value
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = getOptionValue(target.value)
  model.value = value
  emit('change', value, event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function clearValue() {
  model.value = ''
  emit('clear')
}

function focus() {
  selectRef.value?.focus()
}

function blur() {
  selectRef.value?.blur()
}

defineExpose({
  ref: selectRef,
  focus,
  blur,
  clear: clearValue,
})
</script>

<template>
  <span
    class="su-select"
    :class="[
      `su-select--${mergedSize}`,
      `su-select--${status}`,
      {
        'is-disabled': mergedDisabled,
        'is-empty': model === '',
        'is-clearable': showClear,
      },
    ]"
  >
    <select
      v-bind="attrs"
      :id="id"
      ref="selectRef"
      class="su-select__inner"
      :value="model"
      :disabled="mergedDisabled"
      :name="name"
      :required="required"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <option v-if="showPlaceholder" value="" disabled>
        {{ placeholder }}
      </option>
      <template v-if="hasOptions">
        <option
          v-for="option in options"
          :key="`${option.value}`"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </template>
      <slot v-else />
    </select>
    <button
      v-if="showClear"
      class="su-select__clear"
      type="button"
      aria-label="清空选择"
      @click="clearValue"
    >
      &times;
    </button>
    <span class="su-select__arrow" aria-hidden="true" />
  </span>
</template>

<style>
.su-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;
}

.su-select:hover:not(.is-disabled) {
  border-color: color-mix(
    in srgb,
    var(--su-color-primary) 48%,
    var(--su-color-border)
  );
}

.su-select:focus-within {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-select--success {
  border-color: #16a34a;
}

.su-select--success:focus-within {
  border-color: #15803d;
}

.su-select--warning {
  border-color: #d97706;
}

.su-select--warning:focus-within {
  border-color: #b45309;
}

.su-select--error {
  border-color: #dc2626;
}

.su-select--error:focus-within {
  border-color: #b91c1c;
}

.su-select--small {
  min-height: 24px;
  font-size: var(--su-font-size-sm);
}

.su-select--medium {
  min-height: 32px;
  font-size: var(--su-font-size-md);
}

.su-select--large {
  min-height: 44px;
  font-size: var(--su-font-size-lg);
}

.su-select__inner {
  min-width: 0;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
  appearance: none;
}

.su-select--small .su-select__inner {
  padding: 0 30px 0 var(--su-space-sm);
}

.su-select--medium .su-select__inner {
  padding: 0 34px 0 var(--su-space-md);
}

.su-select--large .su-select__inner {
  padding: 0 40px 0 var(--su-space-lg);
}

.su-select.is-clearable .su-select__inner {
  padding-right: 58px;
}

.su-select.is-empty .su-select__inner {
  color: color-mix(
    in srgb,
    var(--su-color-text-muted) 72%,
    var(--su-color-text)
  );
}

.su-select__clear {
  position: absolute;
  top: 50%;
  right: 30px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
}

.su-select__clear:hover {
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-select__arrow {
  position: absolute;
  top: 50%;
  right: var(--su-space-md);
  width: 8px;
  height: 8px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  color: var(--su-color-text-muted);
  pointer-events: none;
  transform: translateY(-65%) rotate(45deg);
}

.su-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-select.is-disabled .su-select__inner {
  cursor: not-allowed;
}
</style>
