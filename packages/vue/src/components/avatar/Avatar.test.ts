import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('渲染默认头像文本和样式', () => {
    const wrapper = mount(Avatar, {
      props: {
        text: '苏',
      },
    })

    expect(wrapper.classes()).toContain('su-avatar')
    expect(wrapper.classes()).toContain('su-avatar--circle')
    expect(wrapper.classes()).toContain('su-avatar--medium')
    expect(wrapper.find('.su-avatar__text').text()).toBe('苏')
  })

  it('支持图片头像', () => {
    const wrapper = mount(Avatar, {
      props: {
        src: '/avatar.png',
        alt: '用户头像',
        fit: 'contain',
      },
    })

    const image = wrapper.find('.su-avatar__image')

    expect(wrapper.classes()).toContain('is-image')
    expect(image.attributes('src')).toBe('/avatar.png')
    expect(image.attributes('alt')).toBe('用户头像')
    expect(image.attributes('style')).toContain('object-fit: contain')
  })

  it('支持尺寸、形状和自定义颜色', () => {
    const wrapper = mount(Avatar, {
      props: {
        size: 48,
        shape: 'square',
        text: '青',
        color: '#111827',
        background: '#facc15',
      },
    })

    expect(wrapper.classes()).toContain('su-avatar--square')
    expect(wrapper.classes()).toContain('su-avatar--custom')
    expect(wrapper.attributes('style')).toContain('--su-avatar-size: 48px')
    expect(wrapper.attributes('style')).toContain('--su-avatar-color: #111827')
    expect(wrapper.attributes('style')).toContain('--su-avatar-bg: #facc15')
  })

  it('支持字符串尺寸', () => {
    const wrapper = mount(Avatar, {
      props: {
        size: '3rem',
        text: '满',
      },
    })

    expect(wrapper.classes()).toContain('su-avatar--custom')
    expect(wrapper.attributes('style')).toContain('--su-avatar-size: 3rem')
  })

  it('支持图标插槽', () => {
    const wrapper = mount(Avatar, {
      slots: {
        icon: '<svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg>',
      },
    })

    expect(wrapper.find('.su-avatar__icon').exists()).toBe(true)
    expect(wrapper.find('.su-avatar__icon svg').exists()).toBe(true)
  })

  it('图片加载失败后回退到文本并触发事件', async () => {
    const onError = vi.fn()
    const wrapper = mount(Avatar, {
      props: {
        src: '/missing.png',
        text: '退',
        onError,
      },
    })

    await wrapper.find('.su-avatar__image').trigger('error')

    expect(wrapper.find('.su-avatar__image').exists()).toBe(false)
    expect(wrapper.find('.su-avatar__text').text()).toBe('退')
    expect(wrapper.emitted('error')).toHaveLength(1)
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
