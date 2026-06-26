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

  it('支持禁用状态', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
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
