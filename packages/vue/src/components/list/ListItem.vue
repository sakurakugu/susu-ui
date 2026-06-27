<script setup lang="ts">
defineOptions({
  name: 'SuListItem',
})

defineProps<{
  title?: string
  description?: string
}>()

defineSlots<{
  default?: () => unknown
  title?: () => unknown
  description?: () => unknown
  avatar?: () => unknown
  actions?: () => unknown
  extra?: () => unknown
}>()
</script>

<template>
  <div class="su-list__item">
    <div v-if="$slots.avatar" class="su-list__item-avatar">
      <slot name="avatar" />
    </div>

    <div class="su-list__item-main">
      <div v-if="title || $slots.title" class="su-list__item-title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div
        v-if="description || $slots.description"
        class="su-list__item-description"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <div v-if="$slots.default" class="su-list__item-content">
        <slot />
      </div>
      <div v-if="$slots.actions" class="su-list__item-actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.extra" class="su-list__item-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style>
.su-list__item {
  display: flex;
  align-items: flex-start;
  gap: var(--su-space-md);
  min-width: 0;
  padding: var(--su-list-padding-y) var(--su-list-padding-x);
  transition: background-color 0.16s ease;
}

.su-list__item-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.su-list__item-main {
  flex: 1;
  min-width: 0;
}

.su-list__item-title {
  min-width: 0;
  color: var(--su-color-text);
  font-weight: 600;
  word-break: break-word;
}

.su-list__item-description {
  margin-top: 2px;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  word-break: break-word;
}

.su-list__item-content {
  margin-top: var(--su-space-sm);
  min-width: 0;
  color: var(--su-color-text);
  word-break: break-word;
}

.su-list__item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
  margin-top: var(--su-space-sm);
}

.su-list__item-extra {
  flex: none;
  max-width: 40%;
  color: var(--su-color-text-muted);
}

.su-list--vertical .su-list__item {
  flex-direction: column;
}

.su-list--vertical .su-list__item-extra {
  max-width: 100%;
}

@media (width <= 640px) {
  .su-list__item {
    flex-direction: column;
  }

  .su-list__item-extra {
    max-width: 100%;
  }
}
</style>
