import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline, { type TimelineItem } from './Timeline.vue'

const items: TimelineItem[] = [
  {
    time: '09:00',
    title: '创建任务',
    description: '记录基础信息',
    type: 'primary',
  },
  {
    time: '10:30',
    title: '完成审核',
    description: '审核通过并进入发布队列',
    type: 'success',
  },
  {
    time: '11:00',
    title: '发布完成',
    description: '内容已经同步到线上',
  },
]

describe('Timeline', () => {
  it('渲染基础时间轴内容和默认属性', () => {
    const wrapper = mount(Timeline, {
      props: {
        items,
      },
    })

    const timelineItems = wrapper.findAll('.su-timeline__item')

    expect(wrapper.classes()).toContain('su-timeline')
    expect(wrapper.classes()).toContain('su-timeline--left')
    expect(wrapper.attributes('aria-label')).toBe('时间轴')
    expect(timelineItems).toHaveLength(3)
    expect(timelineItems[0].classes()).toContain('is-primary')
    expect(timelineItems[1].classes()).toContain('is-success')
    expect(timelineItems[2].classes()).toContain('is-last')
    expect(wrapper.text()).toContain('创建任务')
    expect(wrapper.text()).toContain('审核通过并进入发布队列')
  })

  it('支持反向展示、右侧布局和隐藏连接线', () => {
    const wrapper = mount(Timeline, {
      props: {
        items,
        reverse: true,
        position: 'right',
        size: 'large',
        hideTail: true,
      },
    })

    const timelineItems = wrapper.findAll('.su-timeline__item')

    expect(wrapper.classes()).toContain('su-timeline--right')
    expect(wrapper.classes()).toContain('su-timeline--large')
    expect(timelineItems[0].text()).toContain('发布完成')
    expect(timelineItems[0].classes()).toContain('is-tail-hidden')
  })

  it('支持交替布局、空心点和自定义颜色', () => {
    const wrapper = mount(Timeline, {
      props: {
        items: [
          { title: '开始', color: '#7c3aed', hollow: true },
          { title: '处理', type: 'warning' },
        ],
        position: 'alternate',
      },
    })

    const timelineItems = wrapper.findAll('.su-timeline__item')

    expect(wrapper.classes()).toContain('su-timeline--alternate')
    expect(timelineItems[0].classes()).toContain('is-alternate-right')
    expect(timelineItems[0].classes()).toContain('is-hollow')
    expect(timelineItems[0].attributes('style')).toContain(
      '--su-timeline-dot-color: #7c3aed',
    )
    expect(timelineItems[1].classes()).toContain('is-alternate-left')
    expect(timelineItems[1].classes()).toContain('is-warning')
  })

  it('支持内容插槽和节点插槽', () => {
    const wrapper = mount(Timeline, {
      props: {
        items,
      },
      slots: {
        dot: '<span class="custom-dot">1</span>',
        default:
          '<template #default="{ item, index }"><div class="custom-content">{{ index }}-{{ item.title }}</div></template>',
      },
    })

    expect(wrapper.find('.custom-dot').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('0-创建任务')
    expect(wrapper.find('.su-timeline__time').exists()).toBe(false)
  })
})
