import type { ThemeName } from '@susu-ui/tokens'

export type { ThemeName }

export function setTheme(theme: ThemeName) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}

export function getTheme(): ThemeName | undefined {
  if (typeof document === 'undefined') return undefined
  return document.documentElement.dataset.theme as ThemeName | undefined
}

