import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Switch from './Switch.vue'
import { formKey } from '../form/context'

describe('Switch', () => {
  it('渲染默认开关', () => {
    const wrapper = mount(Switch)

    expect(wrapper.classes()).toContain('su-switch')
    expect(wrapper.classes()).toContain('su-switch--medium')
    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.find('input').attributes('role')).toBe('switch')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('false')
  })

  it('支持 v-model 更新', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        onChange,
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0][0]).toBe(true)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持自定义真假值', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: 'off',
        activeValue: 'on',
        inactiveValue: 'off',
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['on'])
  })

  it('根据选中状态渲染类名和文本', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true,
        activeText: '已开启',
        inactiveText: '已关闭',
      },
    })

    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.classes()).toContain('has-text')
    expect(wrapper.find('.su-switch__text').text()).toBe('已开启')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('true')
  })

  it('根据 size 渲染尺寸样式', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-switch--large')
  })

  it('支持禁用和加载状态', () => {
    const disabledWrapper = mount(Switch, {
      props: {
        disabled: true,
      },
    })
    const loadingWrapper = mount(Switch, {
      props: {
        loading: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    expect(loadingWrapper.classes()).toContain('is-loading')
    expect(loadingWrapper.classes()).toContain('is-disabled')
    expect(loadingWrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        id: 'notice',
        name: 'notice',
        onFocus,
      },
      attrs: {
        'aria-label': '通知开关',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('notice')
    expect(input.attributes('name')).toBe('notice')
    expect(input.attributes('value')).toBe('true')
    expect(input.attributes('aria-label')).toBe('通知开关')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Switch, {
      global: {
        provide: {
          [formKey as symbol]: {
            labelWidth: computed(() => undefined),
            labelPosition: computed(() => 'right'),
            size: computed(() => 'small'),
            disabled: computed(() => true),
          },
        },
      },
    })

    expect(wrapper.classes()).toContain('su-switch--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露聚焦控制方法', () => {
    const wrapper = mount(Switch, {
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
