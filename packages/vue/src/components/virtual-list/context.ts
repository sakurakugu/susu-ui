export type VirtualListItemKey<T = unknown> =
  string | number | ((item: T, index: number) => string | number)

export interface VirtualListScrollState {
  scrollTop: number
  startIndex: number
  endIndex: number
  visibleCount: number
}
