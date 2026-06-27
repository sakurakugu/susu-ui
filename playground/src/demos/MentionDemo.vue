<script setup lang="ts">
import { computed, ref } from 'vue'

const reviewerText = ref('')
const commentText = ref('请 @李明 在今天下班前确认排期。')
const topicText = ref('关联 #客户反馈')
const ownerText = ref('')

const memberOptions = [
  {
    label: '张晨',
    value: 'zhangchen',
    description: '产品经理',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    label: '李明',
    value: 'liming',
    description: '前端工程师',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    label: '王雪',
    value: 'wangxue',
    description: '设计负责人',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  },
  {
    label: '赵一鸣',
    value: 'zhaoyiming',
    description: '已离开项目',
    disabled: true,
  },
]

const topicOptions = [
  { label: '客户反馈', value: 'customer-feedback', description: '本周重点' },
  { label: '预算审批', value: 'budget-review', description: '财务流程' },
  { label: '发布计划', value: 'release-plan', description: '研发协作' },
]

const selectedOwner = computed(() => ownerText.value || '暂未指定')

function fetchMembers(query: string) {
  if (!query) {
    return memberOptions
  }

  const normalizedQuery = query.toLowerCase()
  return memberOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(normalizedQuery) ||
      option.value.toLowerCase().includes(normalizedQuery),
  )
}
</script>

<template>
  <section id="mention" class="panel">
    <h2>提及</h2>
    <div class="mention-demo">
      <div class="mention-demo__group">
        <p class="mention-demo__label">任务协作</p>
        <SuMention
          v-model="reviewerText"
          :options="memberOptions"
          placeholder="输入 @ 分配评审人"
          clearable
        />
      </div>

      <div class="mention-demo__group mention-demo__wide">
        <p class="mention-demo__label">评论内容</p>
        <SuMention
          v-model="commentText"
          :fetch-suggestions="fetchMembers"
          type="textarea"
          placeholder="输入评论，使用 @ 提及同事"
        >
          <template #option="{ option }">
            <span v-if="option.avatar" class="mention-demo__avatar">
              <img :src="option.avatar" :alt="option.label" />
            </span>
            <span class="mention-demo__option">
              <strong>{{ option.label }}</strong>
              <small>{{ option.description }}</small>
            </span>
          </template>
        </SuMention>
      </div>

      <div class="mention-demo__group">
        <p class="mention-demo__label">主题关联</p>
        <SuMention
          v-model="topicText"
          :options="topicOptions"
          prefix="#"
          placeholder="输入 # 关联主题"
          status="warning"
        />
      </div>

      <div class="mention-demo__group">
        <p class="mention-demo__label">只读结果</p>
        <SuMention v-model="ownerText" placeholder="处理人" readonly />
        <span class="mention-demo__hint">当前处理人：{{ selectedOwner }}</span>
      </div>

      <div class="mention-demo__group">
        <p class="mention-demo__label">禁用状态</p>
        <SuMention disabled placeholder="当前流程不可编辑" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.mention-demo {
  display: grid;
  max-width: 860px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.mention-demo__wide {
  grid-column: 1 / -1;
}

.mention-demo__group {
  display: grid;
  gap: 8px;
}

.mention-demo__label {
  margin: 0;
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.mention-demo__hint {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.mention-demo__avatar {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: var(--su-radius-round);
  overflow: hidden;
}

.mention-demo__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mention-demo__option {
  display: grid;
  min-width: 0;
}

.mention-demo__option small {
  color: var(--su-color-text-muted);
}

@media (max-width: 640px) {
  .mention-demo {
    grid-template-columns: 1fr;
  }
}
</style>
