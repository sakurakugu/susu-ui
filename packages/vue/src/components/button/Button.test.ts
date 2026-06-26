import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('渲染默认按钮内容和样式', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '按钮',
      },
    })

    expect(wrapper.text()).toBe('按钮')
    expect(wrapper.classes()).toContain('su-button')
    expect(wrapper.classes()).toContain('su-button--default')
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('根据 type 渲染 primary 样式', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
    })

    expect(wrapper.classes()).toContain('su-button--primary')
  })

  it('根据 variant 和 size 渲染样式', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'outline',
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-button--outline')
    expect(wrapper.classes()).toContain('su-button--large')
  })

  it('支持原生按钮类型', () => {
    const wrapper = mount(Button, {
      props: {
        nativeType: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('支持禁用状态', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('支持加载状态', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        loading: true,
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.su-button__loading').exists()).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('支持前后置插槽', () => {
    const wrapper = mount(Button, {
      slots: {
        prefix: '前',
        default: '按钮',
        suffix: '后',
      },
    })

    expect(wrapper.find('.su-button__prefix').text()).toBe('前')
    expect(wrapper.find('.su-button__suffix').text()).toBe('后')
    expect(wrapper.text()).toBe('前按钮后')
  })

  it('禁用状态下不会触发原生点击', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        disabled: true,
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(onClick).not.toHaveBeenCalled()
  })
})
