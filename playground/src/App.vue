<script setup lang="ts">
import { ref } from 'vue'
import { setTheme, type ThemeName } from '@susu-ui/theme'

const theme = ref<ThemeName>('light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  setTheme(theme.value)
}
</script>

<template>
  <main class="playground">
    <section class="toolbar">
      <div>
        <h1>Susu UI</h1>
        <p>基于 Vue 3 和 CSS 变量的组件库。</p>
      </div>
      <SuButton type="primary" @click="toggleTheme">
        切换到{{ theme === 'light' ? '深色' : '浅色' }}
      </SuButton>
    </section>

    <section class="panel">
      <h2>按钮</h2>
      <div class="row">
        <SuButton>默认按钮</SuButton>
        <SuButton type="primary">主要按钮</SuButton>
        <SuButton disabled>禁用按钮</SuButton>
      </div>
    </section>
  </main>
</template>
