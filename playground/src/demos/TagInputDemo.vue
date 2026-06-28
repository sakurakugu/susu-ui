<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundDemoContext } from './demoContext'

const { showTopMessage } = usePlaygroundDemoContext()

const customerTags = ref(['重点客户', '续费意向'])
const taskTags = ref(['待回访'])
const keywordTags = ref(['供应链', '季度复盘'])
const readonlyTags = ref(['系统同步', '不可编辑'])

function validateKeyword(tag: string) {
  return tag.length >= 2
}

function handleInvalid() {
  showTopMessage()
}
</script>

<template>
  <section id="tag-input" class="panel">
    <h2>标签输入</h2>
    <div class="tag-input-demo">
      <div class="tag-input-demo__item">
        <h3>客户画像</h3>
        <SuTagInput v-model="customerTags" placeholder="输入客户标签后按回车" clearable />
        <p>当前标签：{{ customerTags.join('、') }}</p>
      </div>

      <div class="tag-input-demo__item">
        <h3>任务标记</h3>
        <SuTagInput
          v-model="taskTags"
          size="small"
          :max="3"
          placeholder="最多添加 3 个标记"
          @invalid="handleInvalid"
        />
      </div>

      <div class="tag-input-demo__item">
        <h3>内容关键词</h3>
        <SuTagInput
          v-model="keywordTags"
          status="success"
          :validate-tag="validateKeyword"
          placeholder="关键词至少 2 个字"
          @invalid="handleInvalid"
        >
          <template #prefix>
            <SuIcon>
              <svg viewBox="0 0 24 24">
                <path
                  d="M10 4a6 6 0 014.47 9.99l4.27 4.27-1.48 1.48-4.27-4.27A6 6 0 1110 4zm0 2a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            </SuIcon>
          </template>
        </SuTagInput>
      </div>

      <div class="tag-input-demo__item">
        <h3>只读状态</h3>
        <SuTagInput v-model="readonlyTags" readonly />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tag-input-demo {
  display: grid;
  gap: 16px;
}

.tag-input-demo__item {
  display: grid;
  gap: 8px;
  max-width: 560px;
}

.tag-input-demo__item h3,
.tag-input-demo__item p {
  margin: 0;
}

.tag-input-demo__item h3 {
  font-size: 15px;
}

.tag-input-demo__item p {
  color: var(--su-color-text-muted);
  font-size: 13px;
}
</style>
