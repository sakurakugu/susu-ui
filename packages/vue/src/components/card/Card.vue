<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'SuCard',
})

type CardShadow = 'always' | 'hover' | 'never'
type CardPadding = 'none' | 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    title?: string
    shadow?: CardShadow
    padding?: CardPadding
    bordered?: boolean
    hoverable?: boolean
  }>(),
  {
    title: undefined,
    shadow: 'always',
    padding: 'medium',
    bordered: true,
    hoverable: false,
  },
)

defineSlots<{
  default?: () => unknown
  header?: () => unknown
  extra?: () => unknown
  footer?: () => unknown
}>()

const hasHeader = computed(() => Boolean(props.title))
</script>

<template>
  <section
    class="su-card"
    :class="[
      `su-card--shadow-${shadow}`,
      `su-card--padding-${padding}`,
      {
        'is-bordered': bordered,
        'is-hoverable': hoverable,
        'has-header': hasHeader || $slots.header,
        'has-footer': $slots.footer,
      },
    ]"
  >
    <div v-if="hasHeader || $slots.header" class="su-card__header">
      <div class="su-card__title">
        <slot name="header">
          {{ title }}
        </slot>
      </div>
      <div v-if="$slots.extra" class="su-card__extra">
        <slot name="extra" />
      </div>
    </div>

    <div class="su-card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="su-card__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style>
.su-card {
  overflow: hidden;
  border-radius: var(--su-radius-lg);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.su-card.is-bordered {
  border: 1px solid var(--su-color-border);
}

.su-card--shadow-always {
  box-shadow: var(--su-shadow-sm);
}

.su-card--shadow-hover,
.su-card--shadow-never {
  box-shadow: none;
}

.su-card--shadow-hover:hover,
.su-card.is-hoverable:hover {
  box-shadow: var(--su-shadow-sm);
}

.su-card.is-hoverable:hover {
  border-color: color-mix(in srgb, var(--su-color-primary) 32%, var(--su-color-border));
  transform: translateY(-1px);
}

.su-card__header,
.su-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-width: 0;
  background: var(--su-color-bg-elevated);
}

.su-card__header {
  border-bottom: 1px solid var(--su-color-border);
}

.su-card__footer {
  border-top: 1px solid var(--su-color-border);
}

.su-card__title {
  min-width: 0;
  color: var(--su-color-text);
  font-weight: 600;
}

.su-card__extra {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex: none;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-card__body {
  min-width: 0;
}

.su-card--padding-none .su-card__header,
.su-card--padding-none .su-card__body,
.su-card--padding-none .su-card__footer {
  padding: 0;
}

.su-card--padding-small .su-card__header,
.su-card--padding-small .su-card__body,
.su-card--padding-small .su-card__footer {
  padding: var(--su-space-sm);
}

.su-card--padding-medium .su-card__header,
.su-card--padding-medium .su-card__body,
.su-card--padding-medium .su-card__footer {
  padding: var(--su-space-lg);
}

.su-card--padding-large .su-card__header,
.su-card--padding-large .su-card__body,
.su-card--padding-large .su-card__footer {
  padding: var(--su-space-xl);
}
</style>
