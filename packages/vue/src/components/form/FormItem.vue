<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  formKey,
  type FormItemStatus,
  type FormLabelPosition,
  type FormSize,
} from './context'

defineOptions({
  name: 'SuFormItem',
})

const props = withDefaults(
  defineProps<{
    label?: string
    labelFor?: string
    labelWidth?: number | string
    labelPosition?: FormLabelPosition
    size?: FormSize
    required?: boolean
    status?: FormItemStatus
    help?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    labelFor: undefined,
    labelWidth: undefined,
    labelPosition: undefined,
    size: undefined,
    required: false,
    status: 'default',
    help: undefined,
    error: undefined,
    disabled: false,
  },
)

const form = inject(formKey, undefined)

const slots = defineSlots<{
  default?: () => unknown
  label?: () => unknown
  help?: () => unknown
}>()

const mergedLabelPosition = computed(
  () => props.labelPosition ?? form?.labelPosition.value ?? 'right',
)

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const mergedStatus = computed(() => (props.error ? 'error' : props.status))

const messageText = computed(() => props.error ?? props.help)

const hasLabel = computed(() => Boolean(props.label) || Boolean(slots.label))

const labelStyle = computed(() => {
  const labelWidth = props.labelWidth ?? form?.labelWidth.value

  if (labelWidth === undefined || mergedLabelPosition.value === 'top') {
    return undefined
  }

  const width = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth

  return {
    width,
  }
})
</script>

<template>
  <div
    class="su-form-item"
    :class="[
      `su-form-item--${mergedSize}`,
      `su-form-item--label-${mergedLabelPosition}`,
      `su-form-item--${mergedStatus}`,
      {
        'is-required': required,
        'is-disabled': mergedDisabled,
        'has-label': hasLabel,
        'has-message': messageText || $slots.help,
      },
    ]"
  >
    <component
      :is="labelFor ? 'label' : 'div'"
      v-if="hasLabel"
      class="su-form-item__label"
      :for="labelFor"
      :style="labelStyle"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </component>
    <div class="su-form-item__main">
      <div class="su-form-item__control">
        <slot />
      </div>
      <div v-if="messageText || $slots.help" class="su-form-item__message">
        <slot name="help">
          {{ messageText }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
.su-form-item {
  display: flex;
  align-items: flex-start;
  gap: var(--su-space-md);
  min-width: 0;
  color: var(--su-color-text);
}

.su-form-item--small {
  gap: var(--su-space-sm);
  font-size: var(--su-font-size-sm);
}

.su-form-item--medium {
  gap: var(--su-space-md);
  font-size: var(--su-font-size-md);
}

.su-form-item--large {
  gap: var(--su-space-lg);
  font-size: var(--su-font-size-lg);
}

.su-form-item--label-top {
  flex-direction: column;
  gap: var(--su-space-xs);
}

.su-form-item__label {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex: none;
  width: var(--su-form-label-width);
  min-height: 32px;
  color: var(--su-color-text);
  font-weight: 500;
  line-height: var(--su-font-line-height);
}

.su-form-item--small .su-form-item__label {
  min-height: 24px;
}

.su-form-item--large .su-form-item__label {
  min-height: 44px;
}

.su-form-item--label-left .su-form-item__label {
  justify-content: flex-start;
}

.su-form-item--label-top .su-form-item__label {
  justify-content: flex-start;
  width: auto;
  min-height: 0;
}

.su-form-item.is-required .su-form-item__label::before {
  margin-right: 4px;
  color: var(--su-color-error);
  content: '*';
}

.su-form-item__main {
  min-width: 0;
  flex: 1;
}

.su-form-item__control {
  min-width: 0;
}

.su-form-item__message {
  margin-top: var(--su-space-xs);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  line-height: 1.45;
}

.su-form-item--success .su-form-item__message {
  color: var(--su-color-success-text);
}

.su-form-item--warning .su-form-item__message {
  color: var(--su-color-warning-text);
}

.su-form-item--error .su-form-item__message {
  color: var(--su-color-error-text);
}

.su-form-item.is-disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.su-form-item.is-disabled .su-form-item__control {
  pointer-events: none;
}
</style>
