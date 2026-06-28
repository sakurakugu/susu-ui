export type SusuLocale = {
  name: string
  common: {
    confirm: string
    cancel: string
    close: string
    clear: string
    loading: string
  }
  empty: {
    description: string
  }
  dialog: {
    close: string
  }
  drawer: {
    close: string
  }
  datePicker: {
    placeholder: string
    ariaLabel: string
    clear: string
    openPanel: string
    panel: string
    previousMonth: string
    nextMonth: string
    weekdays: string[]
    monthTitle: (year: number, month: number) => string
  }
  pagination: {
    ariaLabel: string
    prev: string
    next: string
    total: (total: number) => string
    page: (page: number) => string
    more: string
    pageSize: string
    pageSizeOption: (pageSize: number) => string
    jumpTo: string
    jumpPage: string
    pageUnit: string
  }
  list: {
    loading: string
  }
  table: {
    loading: string
  }
  popconfirm: {
    confirm: string
    cancel: string
  }
  upload: {
    selectFile: string
    dragFile: string
    success: string
    error: string
    ready: string
    remove: string
    uploadError: (status: number) => string
    requestError: string
  }
  autocomplete: {
    empty: string
    clear: string
  }
  cascader: {
    placeholder: string
    empty: string
    ariaLabel: string
    clear: string
  }
  tree: {
    empty: string
  }
  virtualList: {
    empty: string
  }
  anchor: {
    empty: string
  }
  menu: {
    empty: string
  }
  select: {
    clear: string
  }
  virtualizedSelect: {
    placeholder: string
    empty: string
    ariaLabel: string
    clear: string
  }
  transfer: {
    titles: [string, string]
    filterPlaceholder: string
    empty: string
    moveLeft: string
    moveRight: string
    filterSource: string
    filterTarget: string
  }
}

export type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends (...args: never[]) => unknown
    ? T[Key]
    : T[Key] extends unknown[]
      ? T[Key]
      : T[Key] extends object
        ? DeepPartial<T[Key]>
        : T[Key]
}
