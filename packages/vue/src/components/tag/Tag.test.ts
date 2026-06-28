import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tag from './Tag.vue'

describe('Tag', () => {
  it('渲染默认标签内容和样式', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: '标签',
      },
    })

    expect(wrapper.text()).toBe('标签')
    expect(wrapper.classes()).toContain('su-tag')
    expect(wrapper.classes()).toContain('su-tag--default')
    expect(wrapper.classes()).toContain('su-tag--light')
    expect(wrapper.classes()).toContain('su-tag--medium')
  })

  it('根据 type、variant 和 size 渲染样式', () => {
    const wrapper = mount(Tag, {
      props: {
        type: 'success',
        variant: 'outline',
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-tag--success')
    expect(wrapper.classes()).toContain('su-tag--outline')
    expect(wrapper.classes()).toContain('su-tag--large')
  })

  it('支持圆角标签', () => {
    const wrapper = mount(Tag, {
      props: {
        round: true,
      },
    })

    expect(wrapper.classes()).toContain('is-round')
  })

  it('支持前置插槽', () => {
    const wrapper = mount(Tag, {
      slots: {
        prefix: '图标',
        default: '标签',
      },
    })

    expect(wrapper.classes()).toContain('has-prefix')
    expect(wrapper.find('.su-tag__prefix').text()).toBe('图标')
    expect(wrapper.find('.su-tag__content').text()).toBe('标签')
  })

  it('支持关闭事件', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: {
        closable: true,
        onClose,
      },
    })

    await wrapper.find('.su-tag__close').trigger('click')

    expect(wrapper.find('.su-tag__close').attributes('aria-label')).toBe('关闭标签')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('禁用关闭按钮后不会触发关闭事件', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: {
        closable: true,
        disabled: true,
        onClose,
      },
    })

    await wrapper.find('.su-tag__close').trigger('click')

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-tag__close').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(onClose).not.toHaveBeenCalled()
  })
})
