import {
  DEFAULT_THEME_HUE,
  DEFAULT_THEME_MODE,
  themePresets,
  type ThemeMode,
  type ThemePresetName,
} from '@susu-ui/tokens'

export { DEFAULT_THEME_HUE, DEFAULT_THEME_MODE, themePresets }
export type { ResolvedThemeMode, ThemeMode, ThemePreset, ThemePresetName } from '@susu-ui/tokens'
export { withThemeTransition, type ThemeTransitionOptions } from './transition'

function 获取根元素(root?: HTMLElement) {
  if (root) return root
  if (typeof document === 'undefined') return undefined
  return document.documentElement
}

function 标准化色相(value: number) {
  return ((Math.round(value) % 360) + 360) % 360
}

function 解析色相(value: string | undefined, fallback = DEFAULT_THEME_HUE) {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN
  return Number.isNaN(parsed) ? fallback : 标准化色相(parsed)
}

function 是否主题模式(value: string | undefined): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function setThemeMode(mode: ThemeMode, root?: HTMLElement) {
  const target = 获取根元素(root)
  if (!target) return
  target.dataset.suTheme = mode
}

export function getThemeMode(root?: HTMLElement): ThemeMode | undefined {
  const target = 获取根元素(root)
  if (!target) return undefined
  const mode = target.dataset.suTheme
  return 是否主题模式(mode) ? mode : undefined
}

export function setThemeHue(hue: number, root?: HTMLElement) {
  const target = 获取根元素(root)
  if (!target) return DEFAULT_THEME_HUE
  const normalizedHue = 标准化色相(hue)
  target.style.setProperty('--su-theme-hue', String(normalizedHue))
  return normalizedHue
}

export function getThemeHue(root?: HTMLElement) {
  const target = 获取根元素(root)
  if (!target) return undefined
  return 解析色相(target.style.getPropertyValue('--su-theme-hue').trim())
}

export function setThemePreset(name: ThemePresetName, root?: HTMLElement) {
  const preset = themePresets.find((item) => item.name === name)
  if (!preset) return DEFAULT_THEME_HUE
  return setThemeHue(preset.hue, root)
}

export function initTheme(
  options: {
    mode?: ThemeMode
    hue?: number
    root?: HTMLElement
  } = {},
) {
  setThemeMode(options.mode ?? DEFAULT_THEME_MODE, options.root)
  setThemeHue(options.hue ?? DEFAULT_THEME_HUE, options.root)
}
