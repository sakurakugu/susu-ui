import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from './Progress.vue'

describe('Progress', () => {
  it('渲染默认线形进度', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 36,
      },
    })

    expect(wrapper.classes()).toContain('su-progress')
    expect(wrapper.classes()).toContain('su-progress--line')
    expect(wrapper.attributes('role')).toBe('progressbar')
    expect(wrapper.attributes('aria-valuenow')).toBe('36')
    expect(wrapper.find('.su-progress__text').text()).toBe('36%')
  })

  it('限制百分比范围', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 120,
      },
    })

    expect(wrapper.attributes('aria-valuenow')).toBe('100')
    expect(wrapper.attributes('style')).toContain('--su-progress-percent: 100%')
  })

  it('支持状态、尺寸和线宽', () => {
    const wrapper = mount(Progress, {
      props: {
        status: 'success',
        size: 'large',
        strokeWidth: 12,
      },
    })

    expect(wrapper.classes()).toContain('su-progress--success')
    expect(wrapper.classes()).toContain('su-progress--large')
    expect(wrapper.attributes('style')).toContain('--su-progress-stroke-width: 12px')
  })

  it('支持内部文字和格式化', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 45,
        textInside: true,
        format: (value: number) => `已完成 ${value}`,
      },
    })

    expect(wrapper.classes()).toContain('is-text-inside')
    expect(wrapper.find('.su-progress__inner-text').text()).toBe('已完成 45')
    expect(wrapper.find('.su-progress__text').exists()).toBe(false)
  })

  it('支持插槽覆盖文字', () => {
    const wrapper = mount(Progress, {
      props: {
        percentage: 80,
      },
      slots: {
        default: '处理中',
      },
    })

    expect(wrapper.find('.su-progress__text').text()).toBe('处理中')
  })

  it('支持环形进度', () => {
    const wrapper = mount(Progress, {
      props: {
        type: 'circle',
        percentage: 75,
        width: 96,
        strokeWidth: 6,
      },
    })

    expect(wrapper.classes()).toContain('su-progress--circle')
    expect(wrapper.find('.su-progress__circle').exists()).toBe(true)
    expect(wrapper.attributes('style')).toContain('--su-progress-circle-size: 96px')
    expect(wrapper.find('.su-progress__text').text()).toBe('75%')
  })

  it('支持隐藏文字和不确定状态', () => {
    const wrapper = mount(Progress, {
      props: {
        showText: false,
        indeterminate: true,
      },
    })

    expect(wrapper.classes()).toContain('is-indeterminate')
    expect(wrapper.find('.su-progress__text').exists()).toBe(false)
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
  })
})
