<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch, type CSSProperties } from 'vue'

defineOptions({
  name: 'SuCommandPalette',
})

export type CommandPaletteValue = string | number

export interface CommandPaletteOption {
  label: string
  value: CommandPaletteValue
  description?: string
  group?: string
  shortcut?: string | string[]
  disabled?: boolean
}

type CommandPaletteCloseReason = 'select' | 'close' | 'mask' | 'esc'

interface CommandPaletteGroup {
  name: string
  options: CommandPaletteOption[]
}

const visible = defineModel<boolean>({
  default: false,
})

const query = defineModel<string>('query', {
  default: '',
})

const props = withDefaults(
  defineProps<{
    options?: CommandPaletteOption[]
    title?: string
    placeholder?: string
    emptyText?: string
    closeOnClickMask?: boolean
    closeOnPressEscape?: boolean
    clearQueryOnClose?: boolean
    width?: string | number
    zIndex?: number
  }>(),
  {
    options: undefined,
    title: '命令面板',
    placeholder: '搜索命令、页面或操作',
    emptyText: '暂无匹配命令',
    closeOnClickMask: true,
    closeOnPressEscape: true,
    clearQueryOnClose: false,
    width: '640px',
    zIndex: undefined,
  },
)

const emit = defineEmits<{
  open: []
  close: [reason: CommandPaletteCloseReason]
  select: [option: CommandPaletteOption]
}>()

defineSlots<{
  default?: () => unknown
  option?: (props: { option: CommandPaletteOption; active: boolean }) => unknown
  empty?: () => unknown
}>()

const dialogRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const activeIndex = ref(-1)
const titleId = `su-command-palette-title-${useId()}`
const listboxId = `su-command-palette-listbox-${useId()}`
let previousBodyOverflow = ''
let bodyScrollLocked = false

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredOptions = computed(() => {
  const options = props.options ?? []

  if (!normalizedQuery.value) {
    return options
  }

  return options.filter((option) =>
    [option.label, option.description, option.group, `${option.value}`].some((item) =>
      item?.toLowerCase().includes(normalizedQuery.value),
    ),
  )
})

const enabledOptions = computed(() => filteredOptions.value.filter((option) => !option.disabled))

const activeOption = computed(() =>
  activeIndex.value >= 0 ? filteredOptions.value[activeIndex.value] : undefined,
)

const groupedOptions = computed<CommandPaletteGroup[]>(() => {
  const groups = new Map<string, CommandPaletteOption[]>()

  filteredOptions.value.forEach((option) => {
    const groupName = option.group ?? '常用命令'
    const groupOptions = groups.get(groupName) ?? []
    groupOptions.push(option)
    groups.set(groupName, groupOptions)
  })

  return Array.from(groups, ([name, options]) => ({ name, options }))
})

const overlayStyle = computed<CSSProperties>(() => ({
  zIndex: props.zIndex,
}))

const paletteStyle = computed<CSSProperties>(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

const activeDescendant = computed(() => {
  const option = activeOption.value

  if (!option) {
    return undefined
  }

  return getOptionId(option)
})

function getOptionId(option: CommandPaletteOption) {
  return `su-command-palette-option-${String(option.value).replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

function getShortcutKeys(shortcut: string | string[] | undefined) {
  return Array.isArray(shortcut) ? shortcut : shortcut ? [shortcut] : []
}

function lockBodyScroll() {
  if (bodyScrollLocked) {
    return
  }

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  bodyScrollLocked = true
}

function unlockBodyScroll() {
  if (!bodyScrollLocked) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  bodyScrollLocked = false
}

function focusInput() {
  inputRef.value?.focus()
}

function resetActiveIndex() {
  activeIndex.value = filteredOptions.value.findIndex((option) => !option.disabled)
}

function moveActive(step: number) {
  if (enabledOptions.value.length === 0) {
    return
  }

  const current = activeOption.value
  const enabledIndex = current ? enabledOptions.value.indexOf(current) : step > 0 ? -1 : 0
  const nextEnabledIndex =
    (enabledIndex + step + enabledOptions.value.length) % enabledOptions.value.length
  activeIndex.value = filteredOptions.value.indexOf(enabledOptions.value[nextEnabledIndex])
}

function requestClose(reason: CommandPaletteCloseReason) {
  if (!visible.value) {
    return
  }

  emit('close', reason)
  visible.value = false
}

function handleMaskClick() {
  if (props.closeOnClickMask) {
    requestClose('mask')
  }
}

function handleCloseClick() {
  requestClose('close')
}

function selectOption(option: CommandPaletteOption) {
  if (option.disabled) {
    return
  }

  emit('select', option)
  requestClose('select')
}

function handleKeydown(event: KeyboardEvent) {
  if (!visible.value) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }

  if (event.key === 'Enter' && activeOption.value) {
    event.preventDefault()
    selectOption(activeOption.value)
    return
  }

  if (event.key === 'Escape' && props.closeOnPressEscape) {
    event.preventDefault()
    requestClose('esc')
  }
}

watch(
  visible,
  async (value) => {
    if (value) {
      emit('open')
      lockBodyScroll()
      resetActiveIndex()
      document.addEventListener('keydown', handleKeydown)
      await nextTick()
      focusInput()
      return
    }

    document.removeEventListener('keydown', handleKeydown)
    unlockBodyScroll()

    if (props.clearQueryOnClose) {
      query.value = ''
    }
  },
  {
    immediate: true,
  },
)

watch(filteredOptions, resetActiveIndex)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  unlockBodyScroll()
})

defineExpose({
  ref: inputRef,
  focus: focusInput,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="su-command-palette">
      <div
        v-if="visible"
        class="su-command-palette-overlay"
        :style="overlayStyle"
        @click.self="handleMaskClick"
      >
        <section
          ref="dialogRef"
          class="su-command-palette"
          :style="paletteStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header class="su-command-palette__header">
            <h2 :id="titleId" class="su-command-palette__title">
              {{ title }}
            </h2>
            <button
              class="su-command-palette__close"
              type="button"
              aria-label="关闭命令面板"
              @click="handleCloseClick"
            >
              &times;
            </button>
          </header>

          <div class="su-command-palette__search">
            <span class="su-command-palette__search-icon" aria-hidden="true" />
            <input
              ref="inputRef"
              v-model="query"
              class="su-command-palette__input"
              type="text"
              :placeholder="placeholder"
              autocomplete="off"
              role="combobox"
              :aria-controls="listboxId"
              aria-expanded="true"
              aria-autocomplete="list"
              :aria-activedescendant="activeDescendant"
            />
          </div>

          <div :id="listboxId" class="su-command-palette__list" role="listbox">
            <template v-if="$slots.default">
              <slot />
            </template>
            <template v-else-if="groupedOptions.length > 0">
              <div
                v-for="group in groupedOptions"
                :key="group.name"
                class="su-command-palette__group"
              >
                <div class="su-command-palette__group-title">
                  {{ group.name }}
                </div>
                <button
                  v-for="option in group.options"
                  :id="getOptionId(option)"
                  :key="`${option.value}`"
                  class="su-command-palette__option"
                  :class="{
                    'is-active': option === activeOption,
                    'is-disabled': option.disabled,
                  }"
                  type="button"
                  role="option"
                  :aria-selected="option === activeOption"
                  :disabled="option.disabled"
                  @mouseenter="activeIndex = filteredOptions.indexOf(option)"
                  @click="selectOption(option)"
                >
                  <slot name="option" :option="option" :active="option === activeOption">
                    <span class="su-command-palette__option-content">
                      <span class="su-command-palette__option-label">
                        {{ option.label }}
                      </span>
                      <span
                        v-if="option.description"
                        class="su-command-palette__option-description"
                      >
                        {{ option.description }}
                      </span>
                    </span>
                    <span
                      v-if="getShortcutKeys(option.shortcut).length"
                      class="su-command-palette__shortcut"
                      aria-hidden="true"
                    >
                      <kbd
                        v-for="key in getShortcutKeys(option.shortcut)"
                        :key="key"
                        class="su-command-palette__shortcut-key"
                      >
                        {{ key }}
                      </kbd>
                    </span>
                  </slot>
                </button>
              </div>
            </template>
            <div v-else class="su-command-palette__empty">
              <slot name="empty">{{ emptyText }}</slot>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.su-command-palette-overlay {
  position: fixed;
  z-index: 2300;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh var(--su-space-lg) var(--su-space-xl);
  background: rgb(15 23 42 / 45%);
  overflow: auto;
}

.su-command-palette {
  max-width: 100%;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-lg);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-md);
  overflow: hidden;
}

.su-command-palette__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 52px;
  padding: var(--su-space-md) var(--su-space-lg);
  border-bottom: 1px solid var(--su-color-border);
}

.su-command-palette__title {
  margin: 0;
  color: var(--su-color-text);
  font-size: var(--su-font-size-lg);
  font-weight: 600;
  line-height: 1.4;
}

.su-command-palette__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  margin-right: calc(var(--su-space-xs) * -1);
  padding: 0;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-command-palette__close:hover {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-command-palette__search {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  padding: var(--su-space-md) var(--su-space-lg);
  border-bottom: 1px solid var(--su-color-border);
}

.su-command-palette__search-icon {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--su-color-text-muted);
}

.su-command-palette__search-icon::before {
  content: '';
  position: absolute;
  inset: 1px 4px 4px 1px;
  border: 1.8px solid currentcolor;
  border-radius: var(--su-radius-round);
}

.su-command-palette__search-icon::after {
  content: '';
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 6px;
  height: 1.8px;
  border-radius: var(--su-radius-round);
  background: currentcolor;
  transform: rotate(45deg);
  transform-origin: center;
}

.su-command-palette__input {
  min-width: 0;
  flex: 1;
  height: 36px;
  border: 0;
  outline: 0;
  color: var(--su-color-text);
  background: transparent;
  font: inherit;
  font-size: var(--su-font-size-lg);
  line-height: var(--su-font-line-height);
}

.su-command-palette__input::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-command-palette__list {
  max-height: 360px;
  padding: var(--su-space-sm);
  overflow: auto;
}

.su-command-palette__group + .su-command-palette__group {
  margin-top: var(--su-space-sm);
}

.su-command-palette__group-title {
  padding: var(--su-space-xs) var(--su-space-sm);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  line-height: var(--su-font-line-height);
}

.su-command-palette__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  width: 100%;
  min-height: 52px;
  padding: var(--su-space-sm) var(--su-space-md);
  border: 0;
  border-radius: var(--su-radius-md);
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-command-palette__option:hover:not(:disabled),
.su-command-palette__option.is-active:not(:disabled) {
  color: var(--su-color-primary);
  background: var(--su-color-bg-soft);
}

.su-command-palette__option:disabled,
.su-command-palette__option.is-disabled {
  color: var(--su-color-text-muted);
  cursor: not-allowed;
  opacity: 0.55;
}

.su-command-palette__option-content {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.su-command-palette__option-label {
  color: inherit;
  font-size: var(--su-font-size-md);
  font-weight: 500;
  line-height: 1.4;
}

.su-command-palette__option-description {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
  line-height: 1.4;
}

.su-command-palette__shortcut {
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 4px;
}

.su-command-palette__shortcut-key {
  min-width: 24px;
  height: 22px;
  padding: 0 var(--su-space-xs);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  color: var(--su-color-text-muted);
  background: var(--su-color-bg-soft);
  font: inherit;
  font-size: var(--su-font-size-sm);
  line-height: 20px;
  text-align: center;
}

.su-command-palette__empty {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--su-space-xl);
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-md);
}

.su-command-palette-enter-active,
.su-command-palette-leave-active {
  transition: opacity 0.18s ease;
}

.su-command-palette-enter-active .su-command-palette,
.su-command-palette-leave-active .su-command-palette {
  transition: transform 0.18s ease;
}

.su-command-palette-enter-from,
.su-command-palette-leave-to {
  opacity: 0;
}

.su-command-palette-enter-from .su-command-palette,
.su-command-palette-leave-to .su-command-palette {
  transform: translateY(-12px) scale(0.98);
}
</style>
