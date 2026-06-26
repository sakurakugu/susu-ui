<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue'
import { formKey, type FormSize } from '../form/context'

defineOptions({
  name: 'SuSwitch',
  inheritAttrs: false,
})

export type SwitchValue = boolean | string | number

const model = defineModel<SwitchValue>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    activeValue?: SwitchValue
    inactiveValue?: SwitchValue
    activeText?: string
    inactiveText?: string
    size?: FormSize
    disabled?: boolean
    loading?: boolean
    name?: string
    id?: string
  }>(),
  {
    activeValue: true,
    inactiveValue: false,
    activeText: undefined,
    inactiveText: undefined,
    size: undefined,
    disabled: false,
    loading: false,
    name: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{
  change: [value: SwitchValue, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()
const form = inject(formKey, undefined)
const inputRef = ref<HTMLInputElement>()

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || props.loading || Boolean(form?.disabled.value),
)

const checked = computed(() => model.value === props.activeValue)

const labelText = computed(() =>
  checked.value ? props.activeText : props.inactiveText,
)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.checked ? props.activeValue : props.inactiveValue
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

defineExpose({
  ref: inputRef,
  focus,
  blur,
})
</script>

<template>
  <label
    class="su-switch"
    :class="[
      `su-switch--${mergedSize}`,
      {
        'is-checked': checked,
        'is-disabled': mergedDisabled,
        'is-loading': loading,
        'has-text': activeText || inactiveText,
      },
    ]"
  >
    <input
      v-bind="attrs"
      :id="id"
      ref="inputRef"
      class="su-switch__input"
      type="checkbox"
      role="switch"
      :checked="checked"
      :disabled="mergedDisabled"
      :name="name"
      :value="activeValue"
      :aria-checked="checked"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span class="su-switch__track" aria-hidden="true">
      <span class="su-switch__thumb" />
    </span>
    <span v-if="labelText" class="su-switch__text">
      {{ labelText }}
    </span>
  </label>
</template>

<style>
.su-switch {
  --su-switch-width: 44px;
  --su-switch-height: 24px;
  --su-switch-thumb-size: 18px;
  --su-switch-offset: 3px;

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

.su-switch--small {
  --su-switch-width: 36px;
  --su-switch-height: 20px;
  --su-switch-thumb-size: 14px;

  font-size: var(--su-font-size-sm);
}

.su-switch--large {
  --su-switch-width: 52px;
  --su-switch-height: 28px;
  --su-switch-thumb-size: 22px;

  font-size: var(--su-font-size-lg);
}

.su-switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-switch__track {
  position: relative;
  display: inline-flex;
  flex: none;
  width: var(--su-switch-width);
  height: var(--su-switch-height);
  border: 1px solid color-mix(in srgb, var(--su-color-border) 72%, transparent);
  border-radius: var(--su-radius-round);
  background: color-mix(
    in srgb,
    var(--su-color-text-muted) 28%,
    var(--su-color-bg-soft)
  );
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-switch__thumb {
  position: absolute;
  top: 50%;
  left: var(--su-switch-offset);
  width: var(--su-switch-thumb-size);
  height: var(--su-switch-thumb-size);
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  transition:
    background-color 0.16s ease,
    transform 0.16s ease;
  transform: translateY(-50%);
}

.su-switch.is-checked .su-switch__track {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-switch.is-checked .su-switch__thumb {
  transform: translate(
    calc(var(--su-switch-width) - var(--su-switch-thumb-size) - 7px),
    -50%
  );
}

.su-switch__input:focus-visible + .su-switch__track {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-switch__text {
  overflow: hidden;
  min-width: 0;
  color: var(--su-color-text);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-switch.is-loading .su-switch__thumb::after {
  position: absolute;
  inset: 4px;
  border: 1.5px solid
    color-mix(in srgb, var(--su-color-primary) 56%, transparent);
  border-top-color: transparent;
  border-radius: var(--su-radius-round);
  animation: su-switch-loading 0.8s linear infinite;
  content: '';
}

.su-switch.is-checked.is-loading .su-switch__thumb::after {
  border-color: color-mix(in srgb, var(--su-color-primary) 68%, transparent);
  border-top-color: transparent;
}

.su-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@keyframes su-switch-loading {
  100% {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-switch__track,
  .su-switch__thumb {
    transition: none;
  }

  .su-switch.is-loading .su-switch__thumb::after {
    animation: none;
  }
}
</style>
