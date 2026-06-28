<script setup lang="ts">
import { computed } from 'vue'
import SuBreadcrumb, { type BreadcrumbItem } from '../breadcrumb/Breadcrumb.vue'

defineOptions({
  name: 'SuPageHeader',
})

export type PageHeaderBreadcrumbItem = BreadcrumbItem

export type PageHeaderSize = 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    breadcrumb?: PageHeaderBreadcrumbItem[]
    backText?: string
    showBack?: boolean
    size?: PageHeaderSize
    ghost?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    breadcrumb: () => [],
    backText: '返回',
    showBack: false,
    size: 'medium',
    ghost: false,
  },
)

const emit = defineEmits<{
  back: [event: MouseEvent]
  breadcrumbClick: [item: PageHeaderBreadcrumbItem, index: number, event: MouseEvent]
}>()

defineSlots<{
  breadcrumb?: () => unknown
  backIcon?: () => unknown
  title?: () => unknown
  subtitle?: () => unknown
  tags?: () => unknown
  extra?: () => unknown
  footer?: () => unknown
  default?: () => unknown
}>()

const hasBreadcrumb = computed(() => props.breadcrumb.length > 0)

function handleBack(event: MouseEvent) {
  emit('back', event)
}

function handleBreadcrumbClick(item: PageHeaderBreadcrumbItem, index: number, event: MouseEvent) {
  emit('breadcrumbClick', item, index, event)
}
</script>

<template>
  <section
    class="su-page-header"
    :class="[
      `su-page-header--${size}`,
      {
        'su-page-header--ghost': ghost,
      },
    ]"
  >
    <div v-if="$slots.breadcrumb || hasBreadcrumb" class="su-page-header__breadcrumb">
      <slot name="breadcrumb">
        <SuBreadcrumb :items="breadcrumb" @click="handleBreadcrumbClick" />
      </slot>
    </div>

    <div class="su-page-header__main">
      <button
        v-if="showBack"
        class="su-page-header__back"
        type="button"
        :aria-label="backText"
        @click="handleBack"
      >
        <span class="su-page-header__back-icon" aria-hidden="true">
          <slot name="backIcon">‹</slot>
        </span>
        <span v-if="backText" class="su-page-header__back-text">
          {{ backText }}
        </span>
      </button>

      <div class="su-page-header__content">
        <div class="su-page-header__heading">
          <div class="su-page-header__title-wrap">
            <h1 v-if="$slots.title || title" class="su-page-header__title">
              <slot name="title">{{ title }}</slot>
            </h1>
            <div v-if="$slots.tags" class="su-page-header__tags">
              <slot name="tags" />
            </div>
          </div>

          <div v-if="$slots.extra" class="su-page-header__extra">
            <slot name="extra" />
          </div>
        </div>

        <p v-if="$slots.subtitle || subtitle" class="su-page-header__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>

        <div v-if="$slots.default" class="su-page-header__body">
          <slot />
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" class="su-page-header__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style>
.su-page-header {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-md);
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  background: var(--su-color-surface);
  color: var(--su-color-text);
}

.su-page-header--ghost {
  border-color: transparent;
  border-radius: 0;
  background: transparent;
}

.su-page-header--small {
  padding: var(--su-space-md);
}

.su-page-header--medium {
  padding: var(--su-space-lg);
}

.su-page-header--large {
  padding: var(--su-space-xl);
}

.su-page-header__breadcrumb {
  min-width: 0;
}

.su-page-header__main {
  display: flex;
  align-items: flex-start;
  gap: var(--su-space-md);
  min-width: 0;
}

.su-page-header__back {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: var(--su-space-xs);
  min-height: 32px;
  border: 0;
  border-radius: var(--su-radius-md);
  padding: 0 var(--su-space-sm);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-page-header__back:hover,
.su-page-header__back:focus-visible {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
  outline: none;
}

.su-page-header__back-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  font-size: 24px;
  line-height: 1;
}

.su-page-header__back-text {
  font-size: var(--su-font-size-sm);
}

.su-page-header__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--su-space-sm);
  min-width: 0;
}

.su-page-header__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-width: 0;
}

.su-page-header__title-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
  min-width: 0;
}

.su-page-header__title {
  min-width: 0;
  margin: 0;
  color: var(--su-color-text);
  font-size: 24px;
  font-weight: 650;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.su-page-header--small .su-page-header__title {
  font-size: 20px;
}

.su-page-header--large .su-page-header__title {
  font-size: 28px;
}

.su-page-header__tags {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--su-space-xs);
  min-width: 0;
}

.su-page-header__extra {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex: none;
  gap: var(--su-space-sm);
}

.su-page-header__subtitle {
  max-width: 72ch;
  margin: 0;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
  overflow-wrap: anywhere;
}

.su-page-header__body,
.su-page-header__footer {
  min-width: 0;
  color: var(--su-color-text);
}

.su-page-header__footer {
  padding-top: var(--su-space-md);
  border-top: 1px solid var(--su-color-border);
}

@media (max-width: 640px) {
  .su-page-header__main,
  .su-page-header__heading {
    flex-direction: column;
  }

  .su-page-header__extra {
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
