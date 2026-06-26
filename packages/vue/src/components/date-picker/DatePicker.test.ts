import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import DatePicker from './DatePicker.vue'
import { formKey } from '../form/context'

describe('DatePicker', () => {
  it('渲染默认日期选择器', () => {
    const wrapper = mount(DatePicker, {
      props: {
        placeholder: '选择日期',
      },
    })

    expect(wrapper.classes()).toContain('su-date-picker')
    expect(wrapper.classes()).toContain('su-date-picker--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.find('input').attributes('placeholder')).toBe('选择日期')
  })

  it('支持打开面板并选择日期', async () => {
    const onChange = vi.fn()
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
        onChange,
      },
    })

    await wrapper.find('.su-date-picker__trigger').trigger('click')
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(true)

    const selectedCell = wrapper.find('.su-date-picker__cell.is-selected')
    expect(selectedCell.text()).toBe('15')

    await wrapper
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-18')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-18'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-18'])
    expect(onChange).toHaveBeenCalledOnce()
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(false)
  })

  it('支持手动输入有效日期', async () => {
    const wrapper = mount(DatePicker)
    const input = wrapper.find('input')

    await input.setValue('2026-07-09')
    await input.trigger('change')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-07-09'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-07-09'])
  })

  it('忽略无效日期输入', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
      },
    })
    const input = wrapper.find('input')

    await input.setValue('2026-02-31')
    await input.trigger('change')

    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('支持最小和最大日期限制', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
        min: '2026-06-10',
        max: '2026-06-20',
      },
    })

    await wrapper.find('.su-date-picker__trigger').trigger('click')

    const beforeMin = wrapper
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-09')
    const afterMax = wrapper
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(beforeMin?.attributes('disabled')).toBeDefined()
    expect(afterMax?.attributes('disabled')).toBeDefined()
  })

  it('支持 disabledDate 禁用日期', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
        disabledDate: (date: Date) => date.getDay() === 0,
      },
    })

    await wrapper.find('.su-date-picker__trigger').trigger('click')

    const sunday = wrapper
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(sunday?.attributes('disabled')).toBeDefined()
  })

  it('支持清空日期', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
        clearable: true,
      },
    })

    await wrapper.find('.su-date-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(DatePicker, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-date-picker--large')
    expect(wrapper.classes()).toContain('su-date-picker--error')
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(DatePicker, {
      props: {
        disabled: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    await disabledWrapper.find('.su-date-picker__trigger').trigger('click')
    expect(disabledWrapper.find('.su-date-picker__panel').exists()).toBe(false)

    const readonlyWrapper = mount(DatePicker, {
      props: {
        readonly: true,
      },
    })

    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(DatePicker, {
      props: {
        id: 'date',
        name: 'date',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'date-help',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('date')
    expect(input.attributes('name')).toBe('date')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-describedby')).toBe('date-help')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(DatePicker, {
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

    expect(wrapper.classes()).toContain('su-date-picker--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        modelValue: '2026-06-15',
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(true)

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(false)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
