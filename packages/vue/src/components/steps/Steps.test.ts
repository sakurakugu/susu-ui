import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Steps, { type StepsItem } from './Steps.vue'

const items: StepsItem[] = [
  { title: '填写信息', description: '录入基础资料' },
  { title: '确认内容', description: '检查提交内容' },
  { title: '完成提交', description: '等待系统处理' },
]

describe('Steps', () => {
  it('根据 current 渲染步骤状态', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        current: 1,
      },
    })

    const stepItems = wrapper.findAll('.su-steps__item')

    expect(wrapper.classes()).toContain('su-steps')
    expect(wrapper.attributes('aria-label')).toBe('步骤条')
    expect(stepItems).toHaveLength(3)
    expect(stepItems[0].classes()).toContain('is-finish')
    expect(stepItems[1].classes()).toContain('is-process')
    expect(stepItems[2].classes()).toContain('is-wait')
    expect(wrapper.find('[aria-current="step"]').text()).toContain('确认内容')
  })

  it('支持自定义当前状态和单项状态', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [{ title: '已完成' }, { title: '校验失败', status: 'error' }, { title: '等待中' }],
        current: 1,
        status: 'finish',
      },
    })

    const stepItems = wrapper.findAll('.su-steps__item')

    expect(stepItems[1].classes()).toContain('is-error')
  })

  it('支持 value 作为当前步骤值', () => {
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: '草稿', value: 'draft' },
          { title: '审核', value: 'review' },
          { title: '发布', value: 'publish' },
        ],
        current: 'review',
      },
    })

    expect(wrapper.findAll('.su-steps__item')[1].classes()).toContain('is-process')
  })

  it('可点击时触发 change 事件并忽略禁用项', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Steps, {
      props: {
        items: [
          { title: '草稿', value: 'draft' },
          { title: '审核', value: 'review' },
          { title: '发布', value: 'publish', disabled: true },
        ],
        current: 'draft',
        clickable: true,
        onChange,
      },
    })

    await wrapper.findAll('.su-steps__button')[1].trigger('click')

    expect(wrapper.emitted('change')?.[0]).toEqual([
      'review',
      { title: '审核', value: 'review' },
      1,
    ])
    expect(onChange).toHaveBeenCalledWith('review', { title: '审核', value: 'review' }, 1)
    expect(wrapper.findAll('.su-steps__button')).toHaveLength(2)
  })

  it('支持方向、尺寸、简洁模式和插槽', () => {
    const wrapper = mount(Steps, {
      props: {
        items,
        direction: 'vertical',
        size: 'large',
        simple: true,
      },
      slots: {
        icon: '<span class="custom-icon">图</span>',
        title: '<span class="custom-title">自定义标题</span>',
        description: '<span class="custom-description">自定义描述</span>',
      },
    })

    expect(wrapper.classes()).toContain('su-steps--vertical')
    expect(wrapper.classes()).toContain('su-steps--large')
    expect(wrapper.classes()).toContain('is-simple')
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-description').exists()).toBe(false)
  })
})
