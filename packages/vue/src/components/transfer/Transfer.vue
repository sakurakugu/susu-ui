<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { formKey, type FormSize } from '../form/context'

defineOptions({
  name: 'SuTransfer',
})

export type TransferValue = string | number

export interface TransferOption {
  label: string
  value: TransferValue
  disabled?: boolean
  description?: string
  [key: string]: unknown
}

type TransferDirection = 'left' | 'right'
type TransferMoveDirection = 'left' | 'right'

const model = defineModel<TransferValue[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    data?: TransferOption[]
    titles?: [string, string]
    size?: FormSize
    disabled?: boolean
    filterable?: boolean
    filterPlaceholder?: string
    emptyText?: string
    leftButtonText?: string
    rightButtonText?: string
    filterMethod?: (query: string, option: TransferOption) => boolean
  }>(),
  {
    data: () => [],
    titles: () => ['源列表', '目标列表'],
    size: undefined,
    disabled: false,
    filterable: false,
    filterPlaceholder: '请输入搜索内容',
    emptyText: '暂无数据',
    leftButtonText: '移到左侧',
    rightButtonText: '移到右侧',
    filterMethod: undefined,
  },
)

const emit = defineEmits<{
  change: [
    value: TransferValue[],
    direction: TransferMoveDirection,
    movedKeys: TransferValue[],
  ]
  leftCheckChange: [checkedKeys: TransferValue[]]
  rightCheckChange: [checkedKeys: TransferValue[]]
}>()

defineSlots<{
  default?: (props: {
    option: TransferOption
    direction: TransferDirection
  }) => unknown
  'left-title'?: () => unknown
  'right-title'?: () => unknown
  empty?: (props: { direction: TransferDirection }) => unknown
}>()

const form = inject(formKey, undefined)
const leftChecked = ref<TransferValue[]>([])
const rightChecked = ref<TransferValue[]>([])
const leftQuery = ref('')
const rightQuery = ref('')

const mergedSize = computed(() => props.size ?? form?.size.value ?? 'medium')

const mergedDisabled = computed(
  () => props.disabled || Boolean(form?.disabled.value),
)

const targetValueSet = computed(() => new Set(model.value))

const leftOptions = computed(() =>
  props.data.filter((option) => !targetValueSet.value.has(option.value)),
)

const rightOptions = computed(() =>
  props.data.filter((option) => targetValueSet.value.has(option.value)),
)

const filteredLeftOptions = computed(() =>
  filterOptions(leftOptions.value, leftQuery.value),
)

const filteredRightOptions = computed(() =>
  filterOptions(rightOptions.value, rightQuery.value),
)

const leftEnabledValues = computed(() =>
  getEnabledValues(filteredLeftOptions.value),
)

const rightEnabledValues = computed(() =>
  getEnabledValues(filteredRightOptions.value),
)

const leftCheckedEnabledValues = computed(() =>
  leftChecked.value.filter((value) => leftEnabledValues.value.includes(value)),
)

const rightCheckedEnabledValues = computed(() =>
  rightChecked.value.filter((value) =>
    rightEnabledValues.value.includes(value),
  ),
)

const leftAllChecked = computed(() =>
  isAllChecked(leftEnabledValues.value, leftChecked.value),
)

const rightAllChecked = computed(() =>
  isAllChecked(rightEnabledValues.value, rightChecked.value),
)

const leftIndeterminate = computed(() =>
  isIndeterminate(leftEnabledValues.value, leftChecked.value),
)

const rightIndeterminate = computed(() =>
  isIndeterminate(rightEnabledValues.value, rightChecked.value),
)

const canMoveRight = computed(
  () => !mergedDisabled.value && leftCheckedEnabledValues.value.length > 0,
)

const canMoveLeft = computed(
  () => !mergedDisabled.value && rightCheckedEnabledValues.value.length > 0,
)

watch(
  () => [props.data, model.value],
  () => {
    leftChecked.value = pruneCheckedValues(leftChecked.value, leftOptions.value)
    rightChecked.value = pruneCheckedValues(
      rightChecked.value,
      rightOptions.value,
    )
  },
  { deep: true },
)

function filterOptions(options: TransferOption[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return options
  }

  return options.filter((option) => {
    if (props.filterMethod) {
      return props.filterMethod(normalizedQuery, option)
    }

    return (
      option.label.toLowerCase().includes(normalizedQuery) ||
      `${option.value}`.toLowerCase().includes(normalizedQuery)
    )
  })
}

function getEnabledValues(options: TransferOption[]) {
  return options
    .filter((option) => !isOptionDisabled(option))
    .map((option) => option.value)
}

function isOptionDisabled(option: TransferOption) {
  return mergedDisabled.value || Boolean(option.disabled)
}

function isAllChecked(
  enabledValues: TransferValue[],
  checkedValues: TransferValue[],
) {
  return (
    enabledValues.length > 0 &&
    enabledValues.every((value) => checkedValues.includes(value))
  )
}

function isIndeterminate(
  enabledValues: TransferValue[],
  checkedValues: TransferValue[],
) {
  const checkedCount = enabledValues.filter((value) =>
    checkedValues.includes(value),
  ).length

  return checkedCount > 0 && checkedCount < enabledValues.length
}

function pruneCheckedValues(
  checkedValues: TransferValue[],
  options: TransferOption[],
) {
  const valueSet = new Set(options.map((option) => option.value))

  return checkedValues.filter((value) => valueSet.has(value))
}

function updateChecked(
  direction: TransferDirection,
  checkedValues: TransferValue[],
) {
  if (direction === 'left') {
    leftChecked.value = checkedValues
    emit('leftCheckChange', checkedValues)
    return
  }

  rightChecked.value = checkedValues
  emit('rightCheckChange', checkedValues)
}

function handleOptionChange(
  direction: TransferDirection,
  option: TransferOption,
  event: Event,
) {
  if (isOptionDisabled(option)) {
    return
  }

  const target = event.target as HTMLInputElement
  const checkedValues =
    direction === 'left' ? [...leftChecked.value] : [...rightChecked.value]
  const index = checkedValues.indexOf(option.value)

  if (target.checked && index === -1) {
    checkedValues.push(option.value)
  }

  if (!target.checked && index > -1) {
    checkedValues.splice(index, 1)
  }

  updateChecked(direction, checkedValues)
}

function toggleAll(direction: TransferDirection) {
  if (mergedDisabled.value) {
    return
  }

  const enabledValues =
    direction === 'left' ? leftEnabledValues.value : rightEnabledValues.value
  const currentChecked =
    direction === 'left' ? leftChecked.value : rightChecked.value
  const shouldClear = isAllChecked(enabledValues, currentChecked)
  const nextChecked = shouldClear
    ? currentChecked.filter((value) => !enabledValues.includes(value))
    : Array.from(new Set([...currentChecked, ...enabledValues]))

  updateChecked(direction, nextChecked)
}

function moveRight() {
  if (!canMoveRight.value) {
    return
  }

  const movedKeys = leftOptions.value
    .filter(
      (option) =>
        leftCheckedEnabledValues.value.includes(option.value) &&
        !option.disabled,
    )
    .map((option) => option.value)

  model.value = Array.from(new Set([...model.value, ...movedKeys]))
  leftChecked.value = []
  emit('leftCheckChange', [])
  emit('change', model.value, 'right', movedKeys)
}

function moveLeft() {
  if (!canMoveLeft.value) {
    return
  }

  const movedKeys = rightOptions.value
    .filter(
      (option) =>
        rightCheckedEnabledValues.value.includes(option.value) &&
        !option.disabled,
    )
    .map((option) => option.value)
  const movedKeySet = new Set(movedKeys)

  model.value = model.value.filter((value) => !movedKeySet.has(value))
  rightChecked.value = []
  emit('rightCheckChange', [])
  emit('change', model.value, 'left', movedKeys)
}
</script>

<template>
  <div
    class="su-transfer"
    :class="[
      `su-transfer--${mergedSize}`,
      {
        'is-disabled': mergedDisabled,
      },
    ]"
  >
    <div class="su-transfer__panel">
      <div class="su-transfer__header">
        <label
          class="su-transfer__check"
          :class="{
            'is-checked': leftAllChecked,
            'is-indeterminate': leftIndeterminate,
            'is-disabled': mergedDisabled || leftEnabledValues.length === 0,
          }"
        >
          <input
            class="su-transfer__checkbox-input"
            type="checkbox"
            :checked="leftAllChecked"
            :disabled="mergedDisabled || leftEnabledValues.length === 0"
            :aria-checked="leftIndeterminate ? 'mixed' : leftAllChecked"
            @change="toggleAll('left')"
          />
          <span class="su-transfer__checkbox-box" aria-hidden="true">
            <span class="su-transfer__checkbox-mark" />
          </span>
          <span class="su-transfer__title">
            <slot name="left-title">{{ titles[0] }}</slot>
          </span>
        </label>
        <span class="su-transfer__count">
          {{ leftChecked.length }}/{{ leftOptions.length }}
        </span>
      </div>

      <div v-if="filterable" class="su-transfer__filter">
        <input
          v-model="leftQuery"
          class="su-transfer__filter-input"
          type="search"
          :disabled="mergedDisabled"
          :placeholder="filterPlaceholder"
          aria-label="筛选源列表"
        />
      </div>

      <div class="su-transfer__body">
        <ul
          v-if="filteredLeftOptions.length"
          class="su-transfer__list"
          role="listbox"
          aria-multiselectable="true"
        >
          <li
            v-for="option in filteredLeftOptions"
            :key="`${option.value}`"
            class="su-transfer__list-item"
          >
            <label
              class="su-transfer__item"
              :class="{
                'is-checked': leftChecked.includes(option.value),
                'is-disabled': isOptionDisabled(option),
              }"
            >
              <input
                class="su-transfer__checkbox-input"
                type="checkbox"
                :checked="leftChecked.includes(option.value)"
                :disabled="isOptionDisabled(option)"
                :value="option.value"
                @change="handleOptionChange('left', option, $event)"
              />
              <span class="su-transfer__checkbox-box" aria-hidden="true">
                <span class="su-transfer__checkbox-mark" />
              </span>
              <span class="su-transfer__item-content">
                <slot :option="option" direction="left">
                  <span class="su-transfer__item-label">
                    {{ option.label }}
                  </span>
                  <span
                    v-if="option.description"
                    class="su-transfer__item-description"
                  >
                    {{ option.description }}
                  </span>
                </slot>
              </span>
            </label>
          </li>
        </ul>

        <div v-else class="su-transfer__empty">
          <slot name="empty" direction="left">{{ emptyText }}</slot>
        </div>
      </div>
    </div>

    <div class="su-transfer__actions">
      <button
        class="su-transfer__button"
        type="button"
        :disabled="!canMoveRight"
        :aria-label="rightButtonText"
        @click="moveRight"
      >
        <span class="su-transfer__arrow su-transfer__arrow--right" />
      </button>
      <button
        class="su-transfer__button"
        type="button"
        :disabled="!canMoveLeft"
        :aria-label="leftButtonText"
        @click="moveLeft"
      >
        <span class="su-transfer__arrow su-transfer__arrow--left" />
      </button>
    </div>

    <div class="su-transfer__panel">
      <div class="su-transfer__header">
        <label
          class="su-transfer__check"
          :class="{
            'is-checked': rightAllChecked,
            'is-indeterminate': rightIndeterminate,
            'is-disabled': mergedDisabled || rightEnabledValues.length === 0,
          }"
        >
          <input
            class="su-transfer__checkbox-input"
            type="checkbox"
            :checked="rightAllChecked"
            :disabled="mergedDisabled || rightEnabledValues.length === 0"
            :aria-checked="rightIndeterminate ? 'mixed' : rightAllChecked"
            @change="toggleAll('right')"
          />
          <span class="su-transfer__checkbox-box" aria-hidden="true">
            <span class="su-transfer__checkbox-mark" />
          </span>
          <span class="su-transfer__title">
            <slot name="right-title">{{ titles[1] }}</slot>
          </span>
        </label>
        <span class="su-transfer__count">
          {{ rightChecked.length }}/{{ rightOptions.length }}
        </span>
      </div>

      <div v-if="filterable" class="su-transfer__filter">
        <input
          v-model="rightQuery"
          class="su-transfer__filter-input"
          type="search"
          :disabled="mergedDisabled"
          :placeholder="filterPlaceholder"
          aria-label="筛选目标列表"
        />
      </div>

      <div class="su-transfer__body">
        <ul
          v-if="filteredRightOptions.length"
          class="su-transfer__list"
          role="listbox"
          aria-multiselectable="true"
        >
          <li
            v-for="option in filteredRightOptions"
            :key="`${option.value}`"
            class="su-transfer__list-item"
          >
            <label
              class="su-transfer__item"
              :class="{
                'is-checked': rightChecked.includes(option.value),
                'is-disabled': isOptionDisabled(option),
              }"
            >
              <input
                class="su-transfer__checkbox-input"
                type="checkbox"
                :checked="rightChecked.includes(option.value)"
                :disabled="isOptionDisabled(option)"
                :value="option.value"
                @change="handleOptionChange('right', option, $event)"
              />
              <span class="su-transfer__checkbox-box" aria-hidden="true">
                <span class="su-transfer__checkbox-mark" />
              </span>
              <span class="su-transfer__item-content">
                <slot :option="option" direction="right">
                  <span class="su-transfer__item-label">
                    {{ option.label }}
                  </span>
                  <span
                    v-if="option.description"
                    class="su-transfer__item-description"
                  >
                    {{ option.description }}
                  </span>
                </slot>
              </span>
            </label>
          </li>
        </ul>

        <div v-else class="su-transfer__empty">
          <slot name="empty" direction="right">{{ emptyText }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.su-transfer {
  --su-transfer-panel-height: 300px;
  --su-transfer-panel-width: 260px;
  --su-transfer-checkbox-size: 16px;

  display: inline-grid;
  align-items: center;
  width: 100%;
  max-width: 720px;
  grid-template-columns: minmax(0, var(--su-transfer-panel-width)) auto minmax(
      0,
      var(--su-transfer-panel-width)
    );
  gap: var(--su-space-md);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-transfer--small {
  --su-transfer-panel-height: 260px;
  --su-transfer-checkbox-size: 14px;

  font-size: var(--su-font-size-sm);
}

.su-transfer--large {
  --su-transfer-panel-height: 340px;
  --su-transfer-checkbox-size: 18px;

  font-size: var(--su-font-size-lg);
}

.su-transfer__panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: var(--su-transfer-panel-height);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
}

.su-transfer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--su-space-md);
  min-height: 42px;
  padding: 0 var(--su-space-md);
  border-bottom: 1px solid var(--su-color-border);
  background: var(--su-color-bg-soft);
}

.su-transfer--small .su-transfer__header {
  min-height: 36px;
}

.su-transfer--large .su-transfer__header {
  min-height: 48px;
}

.su-transfer__check,
.su-transfer__item {
  display: flex;
  align-items: center;
  min-width: 0;
  cursor: pointer;
}

.su-transfer__check {
  gap: var(--su-space-sm);
  font-weight: 600;
}

.su-transfer__count {
  flex: none;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-transfer__filter {
  padding: var(--su-space-sm);
  border-bottom: 1px solid var(--su-color-border);
}

.su-transfer__filter-input {
  width: 100%;
  height: 30px;
  padding: 0 var(--su-space-sm);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  outline: 0;
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  font: inherit;
}

.su-transfer__filter-input:focus {
  border-color: var(--su-color-primary);
}

.su-transfer__filter-input::placeholder {
  color: var(--su-color-text-muted);
  opacity: 0.72;
}

.su-transfer__body {
  min-height: 0;
  flex: 1;
}

.su-transfer__list {
  height: 100%;
  margin: 0;
  padding: var(--su-space-xs) 0;
  overflow: auto;
  list-style: none;
}

.su-transfer__list-item {
  min-width: 0;
}

.su-transfer__item {
  gap: var(--su-space-sm);
  min-height: 34px;
  padding: var(--su-space-xs) var(--su-space-md);
  transition:
    color 0.16s ease,
    background-color 0.16s ease;
}

.su-transfer--small .su-transfer__item {
  min-height: 30px;
}

.su-transfer--large .su-transfer__item {
  min-height: 40px;
}

.su-transfer__item:hover:not(.is-disabled) {
  background: color-mix(in srgb, var(--su-color-primary-soft) 36%, transparent);
}

.su-transfer__item.is-checked {
  color: var(--su-color-primary);
}

.su-transfer__checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.su-transfer__checkbox-box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--su-transfer-checkbox-size);
  height: var(--su-transfer-checkbox-size);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-sm);
  background: var(--su-color-bg-elevated);
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-transfer__checkbox-mark {
  width: 5px;
  height: 9px;
  border: 2px solid var(--su-color-primary-text);
  border-top: 0;
  border-left: 0;
  opacity: 0;
  transform: rotate(45deg) scale(0.72);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.su-transfer__check.is-checked .su-transfer__checkbox-box,
.su-transfer__check.is-indeterminate .su-transfer__checkbox-box,
.su-transfer__item.is-checked .su-transfer__checkbox-box {
  border-color: var(--su-color-primary);
  background: var(--su-color-primary);
}

.su-transfer__check.is-checked .su-transfer__checkbox-mark,
.su-transfer__item.is-checked .su-transfer__checkbox-mark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.su-transfer__check.is-indeterminate .su-transfer__checkbox-mark {
  width: 8px;
  height: 2px;
  border: 0;
  border-radius: var(--su-radius-round);
  background: var(--su-color-primary-text);
  opacity: 1;
  transform: none;
}

.su-transfer__checkbox-input:focus-visible + .su-transfer__checkbox-box {
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--su-color-primary) 22%, transparent);
}

.su-transfer__title,
.su-transfer__item-content {
  min-width: 0;
}

.su-transfer__title,
.su-transfer__item-label,
.su-transfer__item-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-transfer__item-content {
  display: flex;
  flex-direction: column;
}

.su-transfer__item-description {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-transfer__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--su-space-lg);
  color: var(--su-color-text-muted);
  text-align: center;
}

.su-transfer__actions {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-sm);
}

.su-transfer__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 32px;
  border: 1px solid var(--su-color-primary);
  border-radius: var(--su-radius-md);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    opacity 0.16s ease;
}

.su-transfer__button:hover:not(:disabled) {
  border-color: var(--su-color-primary-hover);
  background: var(--su-color-primary-hover);
}

.su-transfer__button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.su-transfer__arrow {
  width: 8px;
  height: 8px;
  border-top: 1.5px solid currentcolor;
  border-right: 1.5px solid currentcolor;
}

.su-transfer__arrow--right {
  transform: rotate(45deg);
}

.su-transfer__arrow--left {
  transform: rotate(-135deg);
}

.su-transfer.is-disabled {
  opacity: 0.72;
}

.su-transfer .is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 640px) {
  .su-transfer {
    display: grid;
    grid-template-columns: 1fr;
  }

  .su-transfer__actions {
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .su-transfer__item,
  .su-transfer__checkbox-box,
  .su-transfer__checkbox-mark,
  .su-transfer__button {
    transition: none;
  }
}
</style>
