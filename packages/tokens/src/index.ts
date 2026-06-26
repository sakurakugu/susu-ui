export type ThemeMode = 'light' | 'dark' | 'system'

export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>

export type ThemePreset = {
  name: string
  label: string
  hue: number
}

export const DEFAULT_THEME_MODE: ThemeMode = 'light'

export const DEFAULT_THEME_HUE = 215

export const themePresets = [
  {
    name: 'blue',
    label: '海蓝',
    hue: 215,
  },
  {
    name: 'pink',
    label: '樱粉',
    hue: 355,
  },
  {
    name: 'green',
    label: '青绿',
    hue: 150,
  },
  {
    name: 'purple',
    label: '藤紫',
    hue: 285,
  },
  {
    name: 'orange',
    label: '暖橙',
    hue: 45,
  },
] as const satisfies readonly ThemePreset[]

export type ThemePresetName = (typeof themePresets)[number]['name']
