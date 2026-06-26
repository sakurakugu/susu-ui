import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  it('渲染默认卡片', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '卡片内容',
      },
    })

    expect(wrapper.classes()).toContain('su-card')
    expect(wrapper.classes()).toContain('su-card--shadow-always')
    expect(wrapper.classes()).toContain('su-card--padding-medium')
    expect(wrapper.classes()).toContain('is-bordered')
    expect(wrapper.find('.su-card__body').text()).toBe('卡片内容')
  })

  it('支持标题和额外内容', () => {
    const wrapper = mount(Card, {
      props: {
        title: '基础信息',
      },
      slots: {
        extra: '<button>编辑</button>',
        default: '内容',
      },
    })

    expect(wrapper.classes()).toContain('has-header')
    expect(wrapper.find('.su-card__title').text()).toBe('基础信息')
    expect(wrapper.find('.su-card__extra').text()).toBe('编辑')
  })

  it('支持自定义头部和底部', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '<span class="custom-header">自定义头部</span>',
        default: '内容',
        footer: '<span class="custom-footer">底部操作</span>',
      },
    })

    expect(wrapper.classes()).toContain('has-header')
    expect(wrapper.classes()).toContain('has-footer')
    expect(wrapper.find('.custom-header').text()).toBe('自定义头部')
    expect(wrapper.find('.custom-footer').text()).toBe('底部操作')
  })

  it('支持阴影、内边距和边框配置', () => {
    const wrapper = mount(Card, {
      props: {
        shadow: 'hover',
        padding: 'large',
        bordered: false,
        hoverable: true,
      },
    })

    expect(wrapper.classes()).toContain('su-card--shadow-hover')
    expect(wrapper.classes()).toContain('su-card--padding-large')
    expect(wrapper.classes()).not.toContain('is-bordered')
    expect(wrapper.classes()).toContain('is-hoverable')
  })
})
