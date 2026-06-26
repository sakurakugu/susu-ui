<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs, watch } from 'vue'
import { formKey, type FormSize } from '../form/context'

defineOptions({
  name: 'SuCheckbox',
  inheritAttrs: false,
})

export type CheckboxValue = boolean | string | number

const model = defineModel<CheckboxValue>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    trueValue?: CheckboxValue
    falseValue?: CheckboxValue
    label?: string
    size?: FormSize
    disabled?: boolean
    indeterminate?: boolean
    name?: string
    id?: string
    value?: string | number
    required?: boolean
  }>(),
  {
    trueValue: true,
    falseValue: false,
    label: undefined,
    size: undefined,
    disabled: false,
    indeterminate: false,
    name: undefined,
    id: undefined,
    value: undefined,
    required: false,
  },
)

const emit = defineEmits<{
  change: [value: CheckboxValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const inputRef = ref<HTMLInputElement>()

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const checked = computed(() => model.value === props.trueValue)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.checked ? props.trueValue : props.falseValue
  model.value = value
  emit('change', value, event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function focus() {
  inputRef.value?.focus()
}

function blur() {
  inputRef.value?.blur()
}

function syncIndeterminate() {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
}

watch(() => props.indeterminate, syncIndeterminate, { flush: 'post' })

onMounted(syncIndeterminate)

defineExpose({
  ref: inputRef,
  focus,
  blur,
})
</script>

<template>
  <label
    class="su-checkbox"
    :class="[
      `su-checkbox--${mergedSize}`,
      {
        'is-checked': checked,
        'is-disabled': mergedDisabled,
        'is-indeterminate': indeterminate,
      },
    ]"
  >
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-checkbox__input"
      type="checkbox"
      :checked="checked"
      :disabled="mergedDisabled"
      :name="name"
      :value="value ?? trueValue"
      :required="required"
      :aria-checked="indeterminate ? 'mixed' : checked"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span class="su-checkbox__box" aria-hidden="true">
      <span class="su-checkbox__mark" />
    </span>
    <span v-if="$slots.default || label" class="su-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style>
.su-checkbox {
  --su-checkbox-size: 16px;
  --su-checkbox-mark-width: 5px;
  --su-checkbox-mark-height: 9px;

  display: inline-flex;
  align-items: center;
  gap: var(--su-space-sm);
  max-width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  vertical-align: middle;
  cursor: pointer;
}

.su-checkbox--small {
  --su-checkbox-size: 14px;
  --su-checkbox-mark-width: 4px;
  --su-checkbox-mark-height: 8px;

  font-size: var(--su-font-size-sm);
}

.su-checkbox--large {
  --su-checkbox-size: 18px;
  --su-checkbox-mark-width: 6px;
  --su-checkbox-mark-height: 10px;

  font-size: var(--su-font-size-lg);
}

.su-checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-checkbox__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--su-checkbox-size);
  height: var(--su-checkbox-size);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-elevated);
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-checkbox__mark {
  width: var(--su-checkbox-mark-width);
  height: var(--su-checkbox-mark-height);
  border: 2px solid var(--su-color-primary-text);
  border-top: 0;
  border-left: 0;
  opacity: 0;
  transform: rotate(45deg) scale(0.72);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-checkbox.is-checked .su-checkbox__box,
.su-checkbox.is-indeterminate .su-checkbox__box {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-checkbox.is-checked .su-checkbox__mark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.su-checkbox.is-indeterminate .su-checkbox__mark {
  width: 8px;
  height: 2px;
  border: 0;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary-text);
  opacity: 1;
  transform: none;
}

.su-checkbox__input:focus-visible + .su-checkbox__box {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-checkbox__label {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .su-checkbox__box,
  .su-checkbox__mark {
    transition: none;
  }
}
</style>
