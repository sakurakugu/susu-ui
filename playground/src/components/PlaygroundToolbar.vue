<script setup lang="ts">
import {
  DEFAULT_THEME_HUE,
  setThemeHue,
  setThemeMode,
  setThemePreset,
  themePresets,
  withThemeTransition,
  type ThemeMode,
  type ThemePresetName,
} from '@susu-ui/theme'
import type { SusuLocale } from '@susu-ui/vue'
import { ref } from 'vue'

const emit = defineEmits<{
  localeChange: [name: SusuLocale['name']]
}>()

const themeMode = ref<ThemeMode>('light')
const themePreset = ref<ThemePresetName | 'custom'>('blue')
const themeHue = ref(DEFAULT_THEME_HUE)
const localeName = ref<SusuLocale['name']>('zh-cn')

async function toggleThemeMode(event: MouseEvent) {
  const nextMode = themeMode.value === 'light' ? 'dark' : 'light'

  await withThemeTransition(
    () => {
      themeMode.value = nextMode
      setThemeMode(nextMode)
    },
    { event },
  )
}

function toggleLocale() {
  localeName.value = localeName.value === 'zh-cn' ? 'en-us' : 'zh-cn'
  emit('localeChange', localeName.value)
}

async function changeThemePreset(name: ThemePresetName, event: MouseEvent) {
  await withThemeTransition(
    () => {
      const preset = themePresets.find((item) => item.name === name)
      if (preset) {
        themeHue.value = preset.hue
      }
      themePreset.value = name
      setThemePreset(name)
    },
    { event },
  )
}

function changeThemeHue(event: Event) {
  const target = event.target as HTMLInputElement
  const hue = Number.parseInt(target.value, 10)
  themeHue.value = setThemeHue(hue)
  themePreset.value =
    themePresets.find((preset) => preset.hue === themeHue.value)?.name ??
    'custom'
}
</script>

<template>
  <header class="playground-topbar">
    <div class="topbar-title">
      <h1>Susu UI</h1>
      <p>基于 Vue 3、CSS 变量和双轴主题的组件库。</p>
    </div>
    <div class="topbar-actions">
      <div class="theme-toolbar">
        <span class="theme-toolbar-label">主题色</span>
        <SuButtonGroup class="preset-button-group">
          <SuButton
            v-for="preset in themePresets"
            :key="preset.name"
            class="preset-button"
            :class="{ 'is-active': themePreset === preset.name }"
            :style="{ '--preset-hue': preset.hue }"
            @click="changeThemePreset(preset.name, $event)"
          >
            <span class="preset-swatch" />
            {{ preset.label }}
          </SuButton>
        </SuButtonGroup>
        <div class="hue-control toolbar-hue-control">
          <div class="hue-control-header">
            <span>自定义色相</span>
            <strong>{{ themeHue }}°</strong>
          </div>
          <input
            class="hue-slider"
            type="range"
            min="0"
            max="359"
            :value="themeHue"
            aria-label="自定义主题色相"
            @input="changeThemeHue"
          />
        </div>
      </div>
      <SuButton @click="toggleLocale">
        切换到{{ localeName === 'zh-cn' ? '英文' : '中文' }}
      </SuButton>
      <SuButton type="primary" @click="toggleThemeMode">
        切换到{{ themeMode === 'light' ? '深色' : '浅色' }}
      </SuButton>
    </div>
  </header>
</template>
