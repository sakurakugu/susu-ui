export type ThemeTokens = {
  color: {
    primary: string
    primaryHover: string
    primaryActive: string
    primaryText: string
    bg: string
    bgElevated: string
    text: string
    textMuted: string
    border: string
  }
  radius: {
    sm: string
    md: string
    lg: string
    round: string
  }
  space: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  font: {
    sizeSm: string
    sizeMd: string
    sizeLg: string
    lineHeight: string
  }
  shadow: {
    sm: string
    md: string
  }
}

export const lightTheme: ThemeTokens = {
  color: {
    primary: '#1677ff',
    primaryHover: '#4096ff',
    primaryActive: '#0958d9',
    primaryText: '#ffffff',
    bg: '#ffffff',
    bgElevated: '#ffffff',
    text: '#1f2329',
    textMuted: '#646a73',
    border: '#d9d9d9',
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    round: '999px',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  font: {
    sizeSm: '12px',
    sizeMd: '14px',
    sizeLg: '16px',
    lineHeight: '1.5',
  },
  shadow: {
    sm: '0 1px 2px rgb(0 0 0 / 8%)',
    md: '0 6px 16px rgb(0 0 0 / 12%)',
  },
}

export const darkTheme: ThemeTokens = {
  color: {
    primary: '#4096ff',
    primaryHover: '#69b1ff',
    primaryActive: '#1677ff',
    primaryText: '#ffffff',
    bg: '#141414',
    bgElevated: '#1f1f1f',
    text: '#f0f0f0',
    textMuted: '#a6a6a6',
    border: '#424242',
  },
  radius: lightTheme.radius,
  space: lightTheme.space,
  font: lightTheme.font,
  shadow: {
    sm: '0 1px 2px rgb(0 0 0 / 32%)',
    md: '0 6px 16px rgb(0 0 0 / 36%)',
  },
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}

export type ThemeName = keyof typeof themes

