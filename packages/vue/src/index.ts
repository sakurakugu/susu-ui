import type { App, Plugin } from 'vue'
import { computed } from 'vue'
import {
  configProviderKey,
  mergeConfig,
  SuConfigProvider,
  type SusuConfigProviderProps,
} from './config-provider'
import { SuAlert } from './components/alert'
import { SuButton, SuButtonGroup } from './components/button'
import { SuCard } from './components/card'
import { SuCheckbox } from './components/checkbox'
import { SuDivider } from './components/divider'
import { SuEmpty } from './components/empty'
import { SuForm, SuFormItem } from './components/form'
import { SuIcon } from './components/icon'
import { SuInput } from './components/input'
import { SuInputNumber } from './components/input-number'
import { SuMessage } from './components/message'
import { SuPagination } from './components/pagination'
import { SuRate } from './components/rate'
import { SuOption, SuSelect } from './components/select'
import { SuSkeleton } from './components/skeleton'
import { SuSlider } from './components/slider'
import { SuSpace } from './components/space'
import { SuSwitch } from './components/switch'
import { SuTable, SuTableColumn } from './components/table'
import { SuTag } from './components/tag'
import { SuText } from './components/text'
import { SuTooltip } from './components/tooltip'

export * from './config-provider'
export * from './components/alert'
export * from './components/button'
export * from './components/card'
export * from './components/checkbox'
export * from './components/divider'
export * from './components/empty'
export * from './components/form'
export * from './components/icon'
export * from './components/input'
export * from './components/input-number'
export * from './components/message'
export * from './components/pagination'
export * from './components/rate'
export * from './components/select'
export * from './components/skeleton'
export * from './components/slider'
export * from './components/space'
export * from './components/switch'
export * from './components/table'
export * from './components/tag'
export * from './components/text'
export * from './components/tooltip'
export * from './locale'

const components = [
  SuConfigProvider,
  SuAlert,
  SuButton,
  SuButtonGroup,
  SuCard,
  SuCheckbox,
  SuDivider,
  SuEmpty,
  SuForm,
  SuFormItem,
  SuIcon,
  SuInput,
  SuInputNumber,
  SuMessage,
  SuPagination,
  SuRate,
  SuOption,
  SuSelect,
  SuSkeleton,
  SuSlider,
  SuSpace,
  SuSwitch,
  SuTable,
  SuTableColumn,
  SuTag,
  SuText,
  SuTooltip,
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
