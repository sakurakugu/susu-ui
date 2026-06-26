import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
} from 'vue'
import { zhCN, type SusuLocale } from '../locale'

export type SusuConfig = {
  locale: SusuLocale
}

export type SusuConfigProviderProps = Partial<SusuConfig>

export const defaultConfig: SusuConfig = {
  locale: zhCN,
}

export const configProviderKey: InjectionKey<ComputedRef<SusuConfig>> =
  Symbol('configProvider')

export function mergeConfig(config?: SusuConfigProviderProps): SusuConfig {
  return {
    ...defaultConfig,
    ...config,
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
