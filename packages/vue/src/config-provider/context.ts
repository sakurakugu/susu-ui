import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
} from 'vue'
import { zhCN, type DeepPartial, type SusuLocale } from '../locale'

export type SusuConfig = {
  locale: SusuLocale
}

export type SusuConfigProviderProps = {
  locale?: DeepPartial<SusuLocale>
}

export const defaultConfig: SusuConfig = {
  locale: zhCN,
}

export const configProviderKey: InjectionKey<ComputedRef<SusuConfig>> =
  Symbol('configProvider')

export function mergeConfig(config?: SusuConfigProviderProps): SusuConfig {
  return {
    ...defaultConfig,
    ...config,
    locale: mergeLocale(defaultConfig.locale, config?.locale),
  }
}

function mergeLocale(
  defaultLocale: SusuLocale,
  locale?: DeepPartial<SusuLocale>,
): SusuLocale {
  if (!locale) {
    return defaultLocale
  }

  return {
    ...defaultLocale,
    ...locale,
    common: {
      ...defaultLocale.common,
      ...locale.common,
    },
    empty: {
      ...defaultLocale.empty,
      ...locale.empty,
    },
    dialog: {
      ...defaultLocale.dialog,
      ...locale.dialog,
    },
    drawer: {
      ...defaultLocale.drawer,
      ...locale.drawer,
    },
    datePicker: {
      ...defaultLocale.datePicker,
      ...locale.datePicker,
    },
    pagination: {
      ...defaultLocale.pagination,
      ...locale.pagination,
    },
    list: {
      ...defaultLocale.list,
      ...locale.list,
    },
    table: {
      ...defaultLocale.table,
      ...locale.table,
    },
    popconfirm: {
      ...defaultLocale.popconfirm,
      ...locale.popconfirm,
    },
    upload: {
      ...defaultLocale.upload,
      ...locale.upload,
    },
    autocomplete: {
      ...defaultLocale.autocomplete,
      ...locale.autocomplete,
    },
    cascader: {
      ...defaultLocale.cascader,
      ...locale.cascader,
    },
    tree: {
      ...defaultLocale.tree,
      ...locale.tree,
    },
    virtualList: {
      ...defaultLocale.virtualList,
      ...locale.virtualList,
    },
    anchor: {
      ...defaultLocale.anchor,
      ...locale.anchor,
    },
    menu: {
      ...defaultLocale.menu,
      ...locale.menu,
    },
    select: {
      ...defaultLocale.select,
      ...locale.select,
    },
    virtualizedSelect: {
      ...defaultLocale.virtualizedSelect,
      ...locale.virtualizedSelect,
    },
    transfer: {
      ...defaultLocale.transfer,
      ...locale.transfer,
    },
  }
}

export function provideConfig(config: ComputedRef<SusuConfig>): void {
  provide(configProviderKey, config)
}

export function useConfig(): ComputedRef<SusuConfig> {
  return inject(
    configProviderKey,
    computed(() => defaultConfig),
  )
}

export function useLocale(): ComputedRef<SusuLocale> {
  const config = useConfig()

  return computed(() => config.value.locale)
}
