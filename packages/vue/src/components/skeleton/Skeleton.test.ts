import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('渲染默认骨架屏', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.classes()).toContain('su-skeleton')
    expect(wrapper.classes()).toContain('is-animated')
    expect(wrapper.find('.su-skeleton__item--text').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('支持矩形、圆形和圆角样式', () => {
    const wrapper = mount(Skeleton, {
      props: {
        variant: 'circle',
        width: 48,
        height: 48,
        round: true,
      },
    })

    expect(wrapper.classes()).toContain('is-round')
    expect(wrapper.find('.su-skeleton__item--circle').exists()).toBe(true)
    expect(wrapper.find('.su-skeleton__item').attributes('style')).toContain(
      'width: 48px',
    )
    expect(wrapper.find('.su-skeleton__item').attributes('style')).toContain(
      'height: 48px',
    )
  })

  it('支持字符串尺寸', () => {
    const wrapper = mount(Skeleton, {
      props: {
        variant: 'rect',
        width: '8rem',
        height: '4rem',
      },
    })

    expect(wrapper.find('.su-skeleton__item--rect').exists()).toBe(true)
    expect(wrapper.find('.su-skeleton__item').attributes('style')).toContain(
      'width: 8rem',
    )
    expect(wrapper.find('.su-skeleton__item').attributes('style')).toContain(
      'height: 4rem',
    )
  })

  it('支持多行段落', () => {
    const wrapper = mount(Skeleton, {
      props: {
        rows: 3,
      },
    })

    expect(wrapper.classes()).toContain('is-paragraph')
    expect(wrapper.findAll('.su-skeleton__item')).toHaveLength(3)
    expect(wrapper.findAll('.su-skeleton__item')[2].classes()).toContain(
      'is-last',
    )
  })

  it('关闭动画后移除动画类名', () => {
    const wrapper = mount(Skeleton, {
      props: {
        animated: false,
      },
    })

    expect(wrapper.classes()).not.toContain('is-animated')
  })
})
