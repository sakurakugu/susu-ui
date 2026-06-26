<script setup lang="ts">
import { ref } from 'vue'
import {
  DEFAULT_THEME_HUE,
  setThemeHue,
  setThemeMode,
  setThemePreset,
  themePresets,
  type ThemeMode,
  type ThemePresetName,
} from '@susu-ui/theme'

const themeMode = ref<ThemeMode>('light')
const themePreset = ref<ThemePresetName | 'custom'>('blue')
const themeHue = ref(DEFAULT_THEME_HUE)

function toggleThemeMode() {
  themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
  setThemeMode(themeMode.value)
}

function changeThemePreset(name: ThemePresetName) {
  const preset = themePresets.find((item) => item.name === name)
  if (preset) {
    themeHue.value = preset.hue
  }
  themePreset.value = name
  setThemePreset(name)
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
  <main class="playground">
    <section class="toolbar">
      <div>
        <h1>Susu UI</h1>
        <p>基于 Vue 3、CSS 变量和双轴主题的组件库。</p>
      </div>
      <div class="toolbar-actions">
        <SuButton type="primary" @click="toggleThemeMode">
          切换到{{ themeMode === 'light' ? '深色' : '浅色' }}
        </SuButton>
      </div>
    </section>

    <section class="panel">
      <h2>主题色</h2>
      <div class="preset-row">
        <button
          v-for="preset in themePresets"
          :key="preset.name"
          class="preset-button"
          :class="{ 'is-active': themePreset === preset.name }"
          :style="{ '--preset-hue': preset.hue }"
          type="button"
          @click="changeThemePreset(preset.name)"
        >
          <span class="preset-swatch" />
          {{ preset.label }}
        </button>
      </div>
      <div class="hue-control">
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
    </section>

    <section class="panel">
      <h2>分割线</h2>
      <div class="divider-demo">
        <p>基础内容区域</p>
        <SuDivider />
        <p>下一段内容区域</p>
        <SuDivider content-position="left">基础信息</SuDivider>
        <SuDivider dashed>虚线分割</SuDivider>
        <div class="inline-divider-demo">
          <span>详情</span>
          <SuDivider direction="vertical" />
          <span>编辑</span>
          <SuDivider direction="vertical" dashed />
          <span>删除</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>按钮</h2>
      <div class="row">
        <SuButton>默认按钮</SuButton>
        <SuButton type="primary">主要按钮</SuButton>
        <SuButton disabled>禁用按钮</SuButton>
      </div>
      <div class="row">
        <SuButton variant="outline">描边按钮</SuButton>
        <SuButton variant="ghost">幽灵按钮</SuButton>
        <SuButton variant="text">文本按钮</SuButton>
        <SuButton type="primary" loading>加载中</SuButton>
      </div>
      <div class="row">
        <SuButton size="small">小按钮</SuButton>
        <SuButton>默认尺寸</SuButton>
        <SuButton size="large">大按钮</SuButton>
        <SuButton native-type="submit">
          <template #prefix>
            <SuIcon>
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </SuIcon>
          </template>
          新建
        </SuButton>
      </div>
      <div class="row">
        <SuButtonGroup type="primary" variant="outline" size="small">
          <SuButton>左</SuButton>
          <SuButton>中</SuButton>
          <SuButton>右</SuButton>
        </SuButtonGroup>
        <SuButtonGroup>
          <SuButton>日</SuButton>
          <SuButton type="primary">周</SuButton>
          <SuButton>月</SuButton>
        </SuButtonGroup>
        <SuButtonGroup direction="vertical" variant="outline">
          <SuButton>上</SuButton>
          <SuButton type="primary">中</SuButton>
          <SuButton>下</SuButton>
        </SuButtonGroup>
      </div>
    </section>
  </main>
</template>
