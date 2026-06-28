<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '../../config-provider'
import type { FormSize } from '../form/context'

defineOptions({
  name: 'SuPagination',
})

export type PaginationSize = FormSize
export type PaginationPageItem = number | 'prev-more' | 'next-more'

const currentPage = defineModel<number>({
  default: 1,
})

const pageSize = defineModel<number>('pageSize', {
  default: 10,
})

const props = withDefaults(
  defineProps<{
    total?: number
    pagerCount?: number
    pageSizes?: number[]
    size?: PaginationSize
    disabled?: boolean
    showTotal?: boolean
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    simple?: boolean
    hideOnSinglePage?: boolean
    prevText?: string
    nextText?: string
  }>(),
  {
    total: 0,
    pagerCount: 7,
    pageSizes: () => [10, 20, 50, 100],
    size: 'medium',
    disabled: false,
    showTotal: false,
    showSizeChanger: false,
    showQuickJumper: false,
    simple: false,
    hideOnSinglePage: false,
    prevText: undefined,
    nextText: undefined,
  },
)

const emit = defineEmits<{
  change: [page: number, pageSize: number]
  currentChange: [page: number]
  sizeChange: [pageSize: number]
  prevClick: [page: number]
  nextClick: [page: number]
}>()

const normalizedTotal = computed(() => Math.max(0, Math.floor(props.total)))
const locale = useLocale()
const mergedPrevText = computed(() => props.prevText ?? locale.value.pagination.prev)
const mergedNextText = computed(() => props.nextText ?? locale.value.pagination.next)
const normalizedPageSize = computed(() => Math.max(1, Math.floor(pageSize.value)))
const normalizedPagerCount = computed(() => {
  const count = Math.max(5, Math.floor(props.pagerCount))
  return count % 2 === 0 ? count + 1 : count
})

const pageCount = computed(() =>
  Math.max(1, Math.ceil(normalizedTotal.value / normalizedPageSize.value)),
)

const normalizedCurrentPage = computed(() => clampPage(currentPage.value, pageCount.value))

const shouldRender = computed(() => !props.hideOnSinglePage || pageCount.value > 1)

const isFirstPage = computed(() => normalizedCurrentPage.value <= 1)
const isLastPage = computed(() => normalizedCurrentPage.value >= pageCount.value)

const pageItems = computed<PaginationPageItem[]>(() => {
  const totalPages = pageCount.value
  const pagerCount = normalizedPagerCount.value

  if (totalPages <= pagerCount) {
    return range(1, totalPages)
  }

  const sideCount = (pagerCount - 3) / 2
  const current = normalizedCurrentPage.value
  const showPrevMore = current > sideCount + 2
  const showNextMore = current < totalPages - sideCount - 1

  if (!showPrevMore && showNextMore) {
    return [...range(1, pagerCount - 2), 'next-more', totalPages]
  }

  if (showPrevMore && !showNextMore) {
    return [1, 'prev-more', ...range(totalPages - (pagerCount - 3), totalPages)]
  }

  return [
    1,
    'prev-more',
    ...range(current - sideCount, current + sideCount),
    'next-more',
    totalPages,
  ]
})

function range(start: number, end: number) {
  const result: number[] = []

  for (let index = start; index <= end; index += 1) {
    result.push(index)
  }

  return result
}

function clampPage(page: number, count: number) {
  const nextPage = Number.isFinite(page) ? Math.floor(page) : 1
  return Math.min(Math.max(nextPage, 1), count)
}

function setCurrentPage(page: number) {
  if (props.disabled) {
    return
  }

  const nextPage = clampPage(page, pageCount.value)

  if (nextPage === currentPage.value) {
    return
  }

  currentPage.value = nextPage
  emit('currentChange', nextPage)
  emit('change', nextPage, normalizedPageSize.value)
}

function goPrev() {
  if (isFirstPage.value) {
    return
  }

  const nextPage = normalizedCurrentPage.value - 1
  setCurrentPage(nextPage)
  emit('prevClick', nextPage)
}

function goNext() {
  if (isLastPage.value) {
    return
  }

  const nextPage = normalizedCurrentPage.value + 1
  setCurrentPage(nextPage)
  emit('nextClick', nextPage)
}

function jumpMore(type: PaginationPageItem) {
  if (type === 'prev-more') {
    setCurrentPage(normalizedCurrentPage.value - (normalizedPagerCount.value - 2))
    return
  }

  if (type === 'next-more') {
    setCurrentPage(normalizedCurrentPage.value + (normalizedPagerCount.value - 2))
  }
}

function handlePageSizeChange(event: Event) {
  if (props.disabled) {
    return
  }

  const target = event.target as HTMLSelectElement
  const nextPageSize = Math.max(1, Number(target.value))

  if (nextPageSize === pageSize.value) {
    return
  }

  pageSize.value = nextPageSize
  emit('sizeChange', nextPageSize)

  const nextPage = clampPage(normalizedCurrentPage.value, pageCount.value)
  currentPage.value = nextPage
  emit('change', nextPage, nextPageSize)
}

function handleQuickJump(event: Event) {
  const target = event.target as HTMLInputElement
  setCurrentPage(Number(target.value))
  target.value = `${normalizedCurrentPage.value}`
}

watch(
  () => [currentPage.value, pageCount.value],
  () => {
    const nextPage = normalizedCurrentPage.value

    if (nextPage !== currentPage.value) {
      currentPage.value = nextPage
    }
  },
  { immediate: true },
)
</script>

<template>
  <nav
    v-if="shouldRender"
    class="su-pagination"
    :class="[
      `su-pagination--${size}`,
      {
        'is-disabled': disabled,
        'is-simple': simple,
      },
    ]"
    :aria-label="locale.pagination.ariaLabel"
  >
    <span v-if="showTotal" class="su-pagination__total">
      {{ locale.pagination.total(normalizedTotal) }}
    </span>

    <button
      class="su-pagination__button su-pagination__prev"
      type="button"
      :disabled="disabled || isFirstPage"
      :aria-label="mergedPrevText"
      @click="goPrev"
    >
      {{ mergedPrevText }}
    </button>

    <span v-if="simple" class="su-pagination__simple">
      {{ normalizedCurrentPage }} / {{ pageCount }}
    </span>

    <ul v-else class="su-pagination__pager">
      <li v-for="item in pageItems" :key="item">
        <button
          v-if="typeof item === 'number'"
          class="su-pagination__button su-pagination__page"
          type="button"
          :class="{ 'is-active': item === normalizedCurrentPage }"
          :disabled="disabled"
          :aria-current="item === normalizedCurrentPage ? 'page' : undefined"
          :aria-label="locale.pagination.page(item)"
          @click="setCurrentPage(item)"
        >
          {{ item }}
        </button>
        <button
          v-else
          class="su-pagination__button su-pagination__more"
          type="button"
          :disabled="disabled"
          :aria-label="locale.pagination.more"
          @click="jumpMore(item)"
        >
          ...
        </button>
      </li>
    </ul>

    <button
      class="su-pagination__button su-pagination__next"
      type="button"
      :disabled="disabled || isLastPage"
      :aria-label="mergedNextText"
      @click="goNext"
    >
      {{ mergedNextText }}
    </button>

    <label v-if="showSizeChanger" class="su-pagination__size">
      <select
        class="su-pagination__select"
        :value="normalizedPageSize"
        :disabled="disabled"
        :aria-label="locale.pagination.pageSize"
        @change="handlePageSizeChange"
      >
        <option v-for="item in pageSizes" :key="item" :value="item">
          {{ locale.pagination.pageSizeOption(item) }}
        </option>
      </select>
    </label>

    <label v-if="showQuickJumper" class="su-pagination__jumper">
      {{ locale.pagination.jumpTo }}
      <input
        class="su-pagination__input"
        type="number"
        min="1"
        :max="pageCount"
        :disabled="disabled"
        :value="normalizedCurrentPage"
        :aria-label="locale.pagination.jumpPage"
        @change="handleQuickJump"
      />
      {{ locale.pagination.pageUnit }}
    </label>
  </nav>
</template>

<style>
.su-pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--su-space-sm);
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-pagination__pager {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-pagination__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 var(--su-space-sm);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-pagination__button:hover:not(:disabled):not(.is-active) {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  background: var(--su-color-bg-soft);
}

.su-pagination__button.is-active {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary-text);
  background: var(--su-color-primary);
}

.su-pagination__button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.su-pagination__more {
  color: var(--su-color-text-muted);
}

.su-pagination__total,
.su-pagination__simple,
.su-pagination__jumper {
  color: var(--su-color-text-muted);
}

.su-pagination__size,
.su-pagination__jumper {
  display: inline-flex;
  align-items: center;
  gap: var(--su-space-xs);
}

.su-pagination__select,
.su-pagination__input {
  height: 32px;
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  font: inherit;
  outline: 0;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.su-pagination__select {
  padding: 0 28px 0 var(--su-space-sm);
}

.su-pagination__input {
  width: 64px;
  padding: 0 var(--su-space-sm);
  text-align: center;
}

.su-pagination__select:focus,
.su-pagination__input:focus {
  border-color: var(--su-color-primary);
  box-shadow: var(--su-shadow-sm);
}

.su-pagination--small {
  font-size: var(--su-font-size-sm);
}

.su-pagination--small .su-pagination__button,
.su-pagination--small .su-pagination__select,
.su-pagination--small .su-pagination__input {
  min-width: 24px;
  height: 24px;
}

.su-pagination--large {
  font-size: var(--su-font-size-lg);
}

.su-pagination--large .su-pagination__button,
.su-pagination--large .su-pagination__select,
.su-pagination--large .su-pagination__input {
  min-width: 44px;
  height: 44px;
}

.su-pagination.is-disabled {
  cursor: not-allowed;
}
</style>
