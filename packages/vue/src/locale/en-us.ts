import type { SusuLocale } from './types'

export const enUS: SusuLocale = {
  name: 'en-us',
  common: {
    confirm: 'OK',
    cancel: 'Cancel',
    close: 'Close',
    clear: 'Clear',
    loading: 'Loading',
  },
  empty: {
    description: 'No data',
  },
  dialog: {
    close: 'Close dialog',
  },
  drawer: {
    close: 'Close drawer',
  },
  datePicker: {
    placeholder: 'Select date',
    ariaLabel: 'Date picker',
    clear: 'Clear date',
    openPanel: 'Open date panel',
    panel: 'Date panel',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthTitle: (year, month) => `${year}-${String(month).padStart(2, '0')}`,
  },
  pagination: {
    ariaLabel: 'Pagination',
    prev: 'Previous',
    next: 'Next',
    total: (total) => `${total} items`,
    page: (page) => `Page ${page}`,
    more: 'More pages',
    pageSize: 'Items per page',
    pageSizeOption: (pageSize) => `${pageSize} / page`,
    jumpTo: 'Go to',
    jumpPage: 'Page number',
    pageUnit: 'page',
  },
  list: {
    loading: 'Loading...',
  },
  table: {
    loading: 'Loading',
  },
  popconfirm: {
    confirm: 'OK',
    cancel: 'Cancel',
  },
  upload: {
    selectFile: 'Select file',
    dragFile: 'Click or drag file to this area to upload',
    success: 'Done',
    error: 'Failed',
    ready: 'Ready',
    remove: 'Remove file',
    uploadError: (status) => `Upload failed: ${status}`,
    requestError: 'Upload request failed',
  },
  autocomplete: {
    empty: 'No matching results',
    clear: 'Clear input',
  },
  cascader: {
    placeholder: 'Select',
    empty: 'No data',
    ariaLabel: 'Cascader',
    clear: 'Clear selection',
  },
  tree: {
    empty: 'No data',
  },
  virtualList: {
    empty: 'No data',
  },
  anchor: {
    empty: 'No anchors',
  },
  menu: {
    empty: 'No menu items',
  },
  select: {
    clear: 'Clear selection',
  },
  transfer: {
    titles: ['Source', 'Target'],
    filterPlaceholder: 'Search',
    empty: 'No data',
    moveLeft: 'Move left',
    moveRight: 'Move right',
    filterSource: 'Filter source list',
    filterTarget: 'Filter target list',
  },
}

export default enUS
