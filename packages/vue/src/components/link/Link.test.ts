import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Link from './Link.vue'

describe('Link', () => {
  it('渲染默认链接内容和样式', () => {
    const wrapper = mount(Link, {
      props: {
        href: '/orders',
      },
      slots: {
        default: '查看订单',
      },
    })

    expect(wrapper.text()).toBe('查看订单')
    expect(wrapper.classes()).toContain('su-link')
    expect(wrapper.classes()).toContain('su-link--primary')
    expect(wrapper.classes()).toContain('su-link--underline-hover')
    expect(wrapper.attributes('href')).toBe('/orders')
  })

  it('根据 type 和 underline 渲染样式', () => {
    const wrapper = mount(Link, {
      props: {
        type: 'error',
        underline: 'always',
      },
    })

    expect(wrapper.classes()).toContain('su-link--error')
    expect(wrapper.classes()).toContain('su-link--underline-always')
  })

  it('新窗口打开时默认补充安全 rel', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        target: '_blank',
      },
    })

    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('优先使用用户传入的 rel', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        target: '_blank',
        rel: 'nofollow',
      },
    })

    expect(wrapper.attributes('rel')).toBe('nofollow')
  })

  it('禁用状态下移除 href 并阻止点击', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Link, {
      props: {
        href: '/billing',
        disabled: true,
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('-1')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('支持前后置插槽', () => {
    const wrapper = mount(Link, {
      slots: {
        prefix: '前',
        default: '链接',
        suffix: '后',
      },
    })

    expect(wrapper.find('.su-link__prefix').text()).toBe('前')
    expect(wrapper.find('.su-link__suffix').text()).toBe('后')
    expect(wrapper.text()).toBe('前链接后')
  })
})
