import type { App, Plugin } from 'vue'
import { computed } from 'vue'
import {
  configProviderKey,
  mergeConfig,
  SuConfigProvider,
  type SusuConfigProviderProps,
} from './config-provider'
import { SuAlert } from './components/alert'
import { SuBreadcrumb } from './components/breadcrumb'
import { SuButton, SuButtonGroup } from './components/button'
import { SuCard } from './components/card'
import { SuCheckbox } from './components/checkbox'
import { SuDatePicker } from './components/date-picker'
import { SuDescriptions, SuDescriptionsItem } from './components/descriptions'
import { SuDialog } from './components/dialog'
import { SuDivider } from './components/divider'
import { SuDrawer } from './components/drawer'
import { SuDropdown } from './components/dropdown'
import { SuEmpty } from './components/empty'
import { SuForm, SuFormItem } from './components/form'
import { SuIcon } from './components/icon'
import { SuInput } from './components/input'
import { SuInputNumber } from './components/input-number'
import { SuMenu } from './components/menu'
import { SuMessage } from './components/message'
import { SuPagination } from './components/pagination'
import { SuPopover } from './components/popover'
import { SuProgress } from './components/progress'
import { SuRate } from './components/rate'
import { SuOption, SuSelect } from './components/select'
import { SuSkeleton } from './components/skeleton'
import { SuSlider } from './components/slider'
import { SuSpace } from './components/space'
import { SuSwitch } from './components/switch'
import { SuTabPane, SuTabs } from './components/tabs'
import { SuTable, SuTableColumn } from './components/table'
import { SuTag } from './components/tag'
import { SuText } from './components/text'
import { SuTooltip } from './components/tooltip'
import { SuTree } from './components/tree'

export * from './config-provider'
export * from './components/alert'
export * from './components/breadcrumb'
export * from './components/button'
export * from './components/card'
export * from './components/checkbox'
export * from './components/date-picker'
export * from './components/descriptions'
export * from './components/dialog'
export * from './components/divider'
export * from './components/drawer'
export * from './components/dropdown'
export * from './components/empty'
export * from './components/form'
export * from './components/icon'
export * from './components/input'
export * from './components/input-number'
export * from './components/menu'
export * from './components/message'
export * from './components/pagination'
export * from './components/popover'
export * from './components/progress'
export * from './components/rate'
export * from './components/select'
export * from './components/skeleton'
export * from './components/slider'
export * from './components/space'
export * from './components/switch'
export * from './components/tabs'
export * from './components/table'
export * from './components/tag'
export * from './components/text'
export * from './components/tooltip'
export * from './components/tree'
export * from './locale'

const components = [
  SuConfigProvider,
  SuAlert,
  SuBreadcrumb,
  SuButton,
  SuButtonGroup,
  SuCard,
  SuCheckbox,
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
  SuIcon,
  SuInput,
  SuInputNumber,
  SuMenu,
  SuMessage,
  SuPagination,
  SuPopover,
  SuProgress,
  SuRate,
  SuOption,
  SuSelect,
  SuSkeleton,
  SuSlider,
  SuSpace,
  SuSwitch,
  SuTabs,
  SuTabPane,
  SuTable,
  SuTableColumn,
  SuTag,
  SuText,
  SuTooltip,
  SuTree,
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
