import type { App, Plugin } from 'vue'
import { computed } from 'vue'
import {
  configProviderKey,
  mergeConfig,
  SuConfigProvider,
  type SusuConfigProviderProps,
} from './config-provider'
import { SuAffix } from './components/affix'
import { SuAlert } from './components/alert'
import { SuAnchor } from './components/anchor'
import { SuAutocomplete } from './components/autocomplete'
import { SuAvatar } from './components/avatar'
import { SuBackTop } from './components/back-top'
import { SuBadge } from './components/badge'
import { SuBreadcrumb } from './components/breadcrumb'
import { SuButton, SuButtonGroup } from './components/button'
import { SuCalendar } from './components/calendar'
import { SuCard } from './components/card'
import { SuCascader } from './components/cascader'
import { SuCheckbox, SuCheckboxGroup } from './components/checkbox'
import { SuCollapse, SuCollapseItem } from './components/collapse'
import { SuColorPicker } from './components/color-picker'
import { SuCommandPalette } from './components/command-palette'
import { SuDateRangePicker } from './components/date-range-picker'
import { SuDatePicker } from './components/date-picker'
import { SuDescriptions, SuDescriptionsItem } from './components/descriptions'
import { SuDialog } from './components/dialog'
import { SuDivider } from './components/divider'
import { SuDrawer } from './components/drawer'
import { SuDropdown } from './components/dropdown'
import { SuEmpty } from './components/empty'
import { SuForm, SuFormItem } from './components/form'
import { SuGrid, SuGridItem } from './components/grid'
import { SuIcon } from './components/icon'
import { SuImage } from './components/image'
import { SuInput } from './components/input'
import { SuInputNumber } from './components/input-number'
import {
  SuContent,
  SuFooter,
  SuHeader,
  SuLayout,
  SuSider,
} from './components/layout'
import { SuLink } from './components/link'
import { SuList, SuListItem } from './components/list'
import { SuLoading } from './components/loading'
import { SuMenu } from './components/menu'
import { SuMention } from './components/mention'
import { SuMessage } from './components/message'
import { SuNotification } from './components/notification'
import { SuPagination } from './components/pagination'
import { SuPopconfirm } from './components/popconfirm'
import { SuPopover } from './components/popover'
import { SuProgress } from './components/progress'
import { SuQRCode } from './components/qrcode'
import { SuRate } from './components/rate'
import { SuRadioButton, SuRadioGroup } from './components/radio'
import { SuResult } from './components/result'
import { SuResizable } from './components/resizable'
import { SuOption, SuSelect } from './components/select'
import { SuSegmented } from './components/segmented'
import { SuSidebar } from './components/sidebar'
import { SuSkeleton } from './components/skeleton'
import { SuSlider } from './components/slider'
import { SuSpace } from './components/space'
import { SuSplitter } from './components/splitter'
import { SuStatistic } from './components/statistic'
import { SuSteps } from './components/steps'
import { SuSwitch } from './components/switch'
import { SuTabPane, SuTabs } from './components/tabs'
import { SuTable, SuTableColumn } from './components/table'
import { SuTag } from './components/tag'
import { SuText } from './components/text'
import { SuTimeRangePicker } from './components/time-range-picker'
import { SuTimePicker } from './components/time-picker'
import { SuTimeline } from './components/timeline'
import { SuTooltip } from './components/tooltip'
import { SuTour } from './components/tour'
import { SuTransfer } from './components/transfer'
import { SuTree } from './components/tree'
import { SuUpload } from './components/upload'
import { SuVirtualList } from './components/virtual-list'
import { SuWatermark } from './components/watermark'

export * from './config-provider'
export * from './components/affix'
export * from './components/alert'
export * from './components/anchor'
export * from './components/autocomplete'
export * from './components/avatar'
export * from './components/back-top'
export * from './components/badge'
export * from './components/breadcrumb'
export * from './components/button'
export * from './components/calendar'
export * from './components/card'
export * from './components/cascader'
export * from './components/checkbox'
export * from './components/collapse'
export * from './components/color-picker'
export * from './components/command-palette'
export * from './components/date-range-picker'
export * from './components/date-picker'
export * from './components/descriptions'
export * from './components/dialog'
export * from './components/divider'
export * from './components/drawer'
export * from './components/dropdown'
export * from './components/empty'
export * from './components/form'
export * from './components/grid'
export * from './components/icon'
export * from './components/image'
export * from './components/input'
export * from './components/input-number'
export * from './components/layout'
export * from './components/link'
export * from './components/list'
export * from './components/loading'
export * from './components/menu'
export * from './components/mention'
export * from './components/message'
export * from './components/notification'
export * from './components/pagination'
export * from './components/popconfirm'
export * from './components/popover'
export * from './components/progress'
export * from './components/qrcode'
export * from './components/rate'
export * from './components/radio'
export * from './components/result'
export * from './components/resizable'
export * from './components/select'
export * from './components/segmented'
export * from './components/sidebar'
export * from './components/skeleton'
export * from './components/slider'
export * from './components/space'
export * from './components/splitter'
export * from './components/statistic'
export * from './components/steps'
export * from './components/switch'
export * from './components/tabs'
export * from './components/table'
export * from './components/tag'
export * from './components/text'
export * from './components/time-range-picker'
export * from './components/time-picker'
export * from './components/timeline'
export * from './components/tooltip'
export * from './components/tour'
export * from './components/transfer'
export * from './components/tree'
export * from './components/upload'
export * from './components/virtual-list'
export * from './components/watermark'
export * from './locale'

const components = [
  SuConfigProvider,
  SuAffix,
  SuAlert,
  SuAnchor,
  SuAutocomplete,
  SuAvatar,
  SuBackTop,
  SuBadge,
  SuBreadcrumb,
  SuButton,
  SuButtonGroup,
  SuCalendar,
  SuCard,
  SuCascader,
  SuCheckbox,
  SuCheckboxGroup,
  SuCollapse,
  SuCollapseItem,
  SuColorPicker,
  SuCommandPalette,
  SuDateRangePicker,
  SuDatePicker,
  SuDescriptions,
  SuDescriptionsItem,
  SuDialog,
  SuDivider,
  SuDrawer,
  SuDropdown,
  SuEmpty,
  SuForm,
  SuFormItem,
  SuGrid,
  SuGridItem,
  SuIcon,
  SuImage,
  SuInput,
  SuInputNumber,
  SuLayout,
  SuHeader,
  SuSider,
  SuContent,
  SuFooter,
  SuLink,
  SuList,
  SuListItem,
  SuLoading,
  SuMenu,
  SuMention,
  SuMessage,
  SuNotification,
  SuPagination,
  SuPopconfirm,
  SuPopover,
  SuProgress,
  SuQRCode,
  SuRate,
  SuRadioButton,
  SuRadioGroup,
  SuResult,
  SuResizable,
  SuOption,
  SuSelect,
  SuSegmented,
  SuSidebar,
  SuSkeleton,
  SuSlider,
  SuSpace,
  SuSplitter,
  SuStatistic,
  SuSteps,
  SuSwitch,
  SuTabs,
  SuTabPane,
  SuTable,
  SuTableColumn,
  SuTag,
  SuText,
  SuTimeRangePicker,
  SuTimePicker,
  SuTimeline,
  SuTooltip,
  SuTour,
  SuTransfer,
  SuTree,
  SuUpload,
  SuVirtualList,
  SuWatermark,
]

export const SusuUI: Plugin = {
  install(app: App, options?: SusuConfigProviderProps) {
    app.provide(
      configProviderKey,
      computed(() => mergeConfig(options)),
    )

    components.forEach((component) => {
      app.component(component.name ?? 'SuComponent', component)
    })
  },
}

export default SusuUI
