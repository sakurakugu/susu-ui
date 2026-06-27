import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import DateRangePicker from './DateRangePicker.vue'
import { formKey } from '../form/context'

describe('DateRangePicker', () => {
  it('渲染默认日期范围选择器', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        startPlaceholder: '开始',
        endPlaceholder: '结束',
      },
    })

    expect(wrapper.classes()).toContain('su-date-range-picker')
    expect(wrapper.classes()).toContain('su-date-range-picker--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.findAll('input')[0].attributes('placeholder')).toBe('开始')
    expect(wrapper.findAll('input')[1].attributes('placeholder')).toBe('结束')
  })

  it('支持选择开始和结束日期', async () => {
    const onChange = vi.fn()
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
        onChange,
      },
    })

    const pickers = wrapper.findAll('.su-date-picker')
    await pickers[0].find('.su-date-picker__trigger').trigger('click')
    await pickers[0]
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-12')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['2026-06-12', '2026-06-20'],
    ])
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['2026-06-12', '2026-06-20'],
    ])

    await pickers[1].find('.su-date-picker__trigger').trigger('click')
    await pickers[1]
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-22')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([
      ['2026-06-12', '2026-06-22'],
    ])
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('限制开始日期不能晚于结束日期', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
      },
    })

    const startPicker = wrapper.findAll('.su-date-picker')[0]
    await startPicker.find('.su-date-picker__trigger').trigger('click')

    const afterEnd = startPicker
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(afterEnd?.attributes('disabled')).toBeDefined()
  })

  it('限制结束日期不能早于开始日期', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
      },
    })

    const endPicker = wrapper.findAll('.su-date-picker')[1]
    await endPicker.find('.su-date-picker__trigger').trigger('click')

    const beforeStart = endPicker
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-09')

    expect(beforeStart?.attributes('disabled')).toBeDefined()
  })

  it('支持 disabledDate 按位置禁用日期', async () => {
    const disabledDate = vi.fn(
      (date: Date, type: 'start' | 'end') =>
        type === 'end' && date.getDay() === 0,
    )
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
        disabledDate,
      },
    })

    const endPicker = wrapper.findAll('.su-date-picker')[1]
    await endPicker.find('.su-date-picker__trigger').trigger('click')

    const sunday = endPicker
      .findAll('.su-date-picker__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(sunday?.attributes('disabled')).toBeDefined()
    expect(disabledDate).toHaveBeenCalled()
  })

  it('支持清空日期范围', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
        clearable: true,
      },
    })

    await wrapper.find('.su-date-range-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['', '']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-date-range-picker--large')
    expect(wrapper.classes()).toContain('su-date-range-picker--error')
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(DateRangePicker, {
      props: {
        disabled: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(
      disabledWrapper.findAll('input')[0].attributes('disabled'),
    ).toBeDefined()
    await disabledWrapper.find('.su-date-picker__trigger').trigger('click')
    expect(disabledWrapper.find('.su-date-picker__panel').exists()).toBe(false)

    const readonlyWrapper = mount(DateRangePicker, {
      props: {
        readonly: true,
      },
    })

    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(
      readonlyWrapper.findAll('input')[0].attributes('readonly'),
    ).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(DateRangePicker, {
      props: {
        startId: 'start-date',
        endId: 'end-date',
        startName: 'startDate',
        endName: 'endDate',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'date-range-help',
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('focus')
    await inputs[1].trigger('blur')

    expect(inputs[0].attributes('id')).toBe('start-date')
    expect(inputs[1].attributes('id')).toBe('end-date')
    expect(inputs[0].attributes('name')).toBe('startDate')
    expect(inputs[1].attributes('name')).toBe('endDate')
    expect(inputs[0].attributes('required')).toBeDefined()
    expect(inputs[0].attributes('aria-describedby')).toBe('date-range-help')
    expect(wrapper.emitted('focus')?.[0][1]).toBe('start')
    expect(wrapper.emitted('blur')?.[0][1]).toBe('end')
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(DateRangePicker, {
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

    expect(wrapper.classes()).toContain('su-date-range-picker--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.findAll('input')[0].attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: ['2026-06-10', '2026-06-20'],
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.findAll('input')[0].element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(true)

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-date-picker__panel').exists()).toBe(false)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['', '']])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
