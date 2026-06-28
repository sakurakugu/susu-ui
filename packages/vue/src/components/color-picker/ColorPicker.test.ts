import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import ColorPicker from './ColorPicker.vue'
import { formKey } from '../form/context'

describe('ColorPicker', () => {
  it('渲染默认颜色选择器', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        placeholder: '选择颜色',
      },
    })

    expect(wrapper.classes()).toContain('su-color-picker')
    expect(wrapper.classes()).toContain('su-color-picker--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('input').attributes('placeholder')).toBe('选择颜色')
  })

  it('支持打开面板并选择预设颜色', async () => {
    const onChange = vi.fn()
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
        presets: ['#ff4d4f'],
        onChange,
      },
    })

    await wrapper.find('.su-color-picker__trigger').trigger('click')
    expect(wrapper.find('.su-color-picker__panel').exists()).toBe(true)

    await wrapper.find('.su-color-picker__preset').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#ff4d4f'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['#ff4d4f', expect.any(MouseEvent)])
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持原生颜色输入', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
      },
    })

    await wrapper.find('.su-color-picker__trigger').trigger('click')
    const input = wrapper.find('.su-color-picker__native-input')
    await input.setValue('#52c41a')
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#52c41a'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['#52c41a', expect.any(Event)])
  })

  it('支持透明度输出 rgba', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
        showAlpha: true,
      },
    })

    await wrapper.find('.su-color-picker__trigger').trigger('click')
    const alpha = wrapper.find('.su-color-picker__alpha-input')
    await alpha.setValue('50')
    await alpha.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['rgba(22, 119, 255, 0.5)'])
  })

  it('支持手动输入颜色', async () => {
    const wrapper = mount(ColorPicker)
    const input = wrapper.find('.su-color-picker__inner')

    await input.setValue('#52c41a')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#52c41a'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['#52c41a', expect.any(Event)])
  })

  it('忽略无效颜色输入', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
      },
    })
    const input = wrapper.find('.su-color-picker__inner')

    await input.setValue('blue')
    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('支持清空颜色', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
        clearable: true,
      },
    })

    await wrapper.find('.su-color-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(ColorPicker, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-color-picker--large')
    expect(wrapper.classes()).toContain('su-color-picker--error')
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(ColorPicker, {
      props: {
        disabled: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    await disabledWrapper.find('.su-color-picker__trigger').trigger('click')
    expect(disabledWrapper.find('.su-color-picker__panel').exists()).toBe(false)

    const readonlyWrapper = mount(ColorPicker, {
      props: {
        readonly: true,
      },
    })

    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(ColorPicker, {
      props: {
        id: 'color',
        name: 'color',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'color-help',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('color')
    expect(input.attributes('name')).toBe('color')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-describedby')).toBe('color-help')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(ColorPicker, {
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

    expect(wrapper.classes()).toContain('su-color-picker--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#1677ff',
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-color-picker__panel').exists()).toBe(true)

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-color-picker__panel').exists()).toBe(false)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
