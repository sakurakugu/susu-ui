import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import TimePicker from './TimePicker.vue'
import { formKey } from '../form/context'

describe('TimePicker', () => {
  it('渲染默认时间选择器', () => {
    const wrapper = mount(TimePicker, {
      props: {
        placeholder: '选择时间',
      },
    })

    expect(wrapper.classes()).toContain('su-time-picker')
    expect(wrapper.classes()).toContain('su-time-picker--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('input').attributes('placeholder')).toBe('选择时间')
  })

  it('支持打开面板并选择时间', async () => {
    const onChange = vi.fn()
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:15',
        onChange,
      },
    })

    await wrapper.find('.su-time-picker__trigger').trigger('click')
    expect(wrapper.find('.su-time-picker__panel').exists()).toBe(true)

    const selectedOptions = wrapper.findAll('.su-time-picker__option.is-selected')
    expect(selectedOptions.map((item) => item.text())).toEqual(['09', '30', '15'])

    await wrapper
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '10')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['10:30:15'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['10:30:15'])
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持手动输入有效时间', async () => {
    const wrapper = mount(TimePicker)
    const input = wrapper.find('input')

    await input.setValue('12:08:09')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12:08:09'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('12:08:09')
  })

  it('忽略无效时间输入', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:15',
      },
    })
    const input = wrapper.find('input')

    await input.setValue('25:00:00')
    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('支持分钟格式', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30',
        format: 'HH:mm',
      },
    })

    await wrapper.find('.su-time-picker__trigger').trigger('click')
    expect(wrapper.findAll('.su-time-picker__column')).toHaveLength(2)

    await wrapper
      .findAll('.su-time-picker__column')
      .at(1)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '45')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:45'])
  })

  it('支持步进和时间范围限制', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:00',
        minuteStep: 15,
        secondStep: 30,
        min: '09:30:00',
        max: '10:30:00',
      },
    })

    await wrapper.find('.su-time-picker__trigger').trigger('click')

    const minuteOptions = wrapper
      .findAll('.su-time-picker__column')
      .at(1)
      ?.findAll('.su-time-picker__option')
    const secondOptions = wrapper
      .findAll('.su-time-picker__column')
      .at(2)
      ?.findAll('.su-time-picker__option')

    expect(minuteOptions?.map((item) => item.text())).toEqual(['00', '15', '30', '45'])
    expect(secondOptions?.map((item) => item.text())).toEqual(['00', '30'])

    const disabledHour = wrapper
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '08')

    expect(disabledHour?.attributes('disabled')).toBeDefined()
  })

  it('支持 disabledTime 禁用时间', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:00',
        disabledTime: (time) => time.hour === 10,
      },
    })

    await wrapper.find('.su-time-picker__trigger').trigger('click')

    const disabledHour = wrapper
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '10')

    expect(disabledHour?.attributes('disabled')).toBeDefined()
  })

  it('支持清空时间', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:15',
        clearable: true,
      },
    })

    await wrapper.find('.su-time-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(TimePicker, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-time-picker--large')
    expect(wrapper.classes()).toContain('su-time-picker--error')
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(TimePicker, {
      props: {
        disabled: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    await disabledWrapper.find('.su-time-picker__trigger').trigger('click')
    expect(disabledWrapper.find('.su-time-picker__panel').exists()).toBe(false)

    const readonlyWrapper = mount(TimePicker, {
      props: {
        readonly: true,
      },
    })

    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(TimePicker, {
      props: {
        id: 'time',
        name: 'time',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'time-help',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('time')
    expect(input.attributes('name')).toBe('time')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-describedby')).toBe('time-help')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(TimePicker, {
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

    expect(wrapper.classes()).toContain('su-time-picker--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '09:30:15',
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-time-picker__panel').exists()).toBe(true)

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-time-picker__panel').exists()).toBe(false)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
