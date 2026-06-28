import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import TimeRangePicker from './TimeRangePicker.vue'
import { formKey } from '../form/context'

describe('TimeRangePicker', () => {
  it('渲染默认时间范围选择器', () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        startPlaceholder: '开始',
        endPlaceholder: '结束',
      },
    })

    expect(wrapper.classes()).toContain('su-time-range-picker')
    expect(wrapper.classes()).toContain('su-time-range-picker--medium')
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.findAll('input')[0].attributes('placeholder')).toBe('开始')
    expect(wrapper.findAll('input')[1].attributes('placeholder')).toBe('结束')
  })

  it('支持选择开始和结束时间', async () => {
    const onChange = vi.fn()
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
        onChange,
      },
    })

    const pickers = wrapper.findAll('.su-time-picker')
    await pickers[0].find('.su-time-picker__trigger').trigger('click')
    await pickers[0]
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '10')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['10:00:00', '18:00:00']])
    expect(wrapper.emitted('change')?.[0]?.[0]).toEqual(['10:00:00', '18:00:00'])

    await pickers[1].find('.su-time-picker__trigger').trigger('click')
    await pickers[1]
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '19')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([['10:00:00', '19:00:00']])
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('支持分钟格式和步进', async () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00', '18:00'],
        format: 'HH:mm',
        minuteStep: 30,
      },
    })

    const startPicker = wrapper.findAll('.su-time-picker')[0]
    await startPicker.find('.su-time-picker__trigger').trigger('click')

    expect(startPicker.findAll('.su-time-picker__column')).toHaveLength(2)
    expect(
      startPicker
        .findAll('.su-time-picker__column')
        .at(1)
        ?.findAll('.su-time-picker__option')
        .map((item) => item.text()),
    ).toEqual(['00', '30'])
  })

  it('限制开始时间不能晚于结束时间', async () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
      },
    })

    const startPicker = wrapper.findAll('.su-time-picker')[0]
    await startPicker.find('.su-time-picker__trigger').trigger('click')

    const afterEnd = startPicker
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '19')

    expect(afterEnd?.attributes('disabled')).toBeDefined()
  })

  it('限制结束时间不能早于开始时间', async () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
      },
    })

    const endPicker = wrapper.findAll('.su-time-picker')[1]
    await endPicker.find('.su-time-picker__trigger').trigger('click')

    const beforeStart = endPicker
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '08')

    expect(beforeStart?.attributes('disabled')).toBeDefined()
  })

  it('支持 disabledTime 按位置禁用时间', async () => {
    const disabledTime = vi.fn(
      (time: { hour: number; minute: number; second: number }, type: string) =>
        type === 'end' && time.hour === 12,
    )
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
        disabledTime,
      },
    })

    const endPicker = wrapper.findAll('.su-time-picker')[1]
    await endPicker.find('.su-time-picker__trigger').trigger('click')

    const lunch = endPicker
      .findAll('.su-time-picker__column')
      .at(0)
      ?.findAll('.su-time-picker__option')
      .find((item) => item.text() === '12')

    expect(lunch?.attributes('disabled')).toBeDefined()
    expect(disabledTime).toHaveBeenCalled()
  })

  it('支持清空时间范围', async () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
        clearable: true,
      },
    })

    await wrapper.find('.su-time-range-picker__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['', '']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('根据 size 和 status 渲染样式', () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        size: 'large',
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-time-range-picker--large')
    expect(wrapper.classes()).toContain('su-time-range-picker--error')
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(TimeRangePicker, {
      props: {
        disabled: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.findAll('input')[0].attributes('disabled')).toBeDefined()
    await disabledWrapper.find('.su-time-picker__trigger').trigger('click')
    expect(disabledWrapper.find('.su-time-picker__panel').exists()).toBe(false)

    const readonlyWrapper = mount(TimeRangePicker, {
      props: {
        readonly: true,
      },
    })

    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.findAll('input')[0].attributes('readonly')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(TimeRangePicker, {
      props: {
        startId: 'start-time',
        endId: 'end-time',
        startName: 'startTime',
        endName: 'endTime',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-describedby': 'time-range-help',
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('focus')
    await inputs[1].trigger('blur')

    expect(inputs[0].attributes('id')).toBe('start-time')
    expect(inputs[1].attributes('id')).toBe('end-time')
    expect(inputs[0].attributes('name')).toBe('startTime')
    expect(inputs[1].attributes('name')).toBe('endTime')
    expect(inputs[0].attributes('required')).toBeDefined()
    expect(inputs[0].attributes('aria-describedby')).toBe('time-range-help')
    expect(wrapper.emitted('focus')?.[0][1]).toBe('start')
    expect(wrapper.emitted('blur')?.[0][1]).toBe('end')
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(TimeRangePicker, {
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

    expect(wrapper.classes()).toContain('su-time-range-picker--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.findAll('input')[0].attributes('disabled')).toBeDefined()
  })

  it('暴露控制方法', async () => {
    const wrapper = mount(TimeRangePicker, {
      props: {
        modelValue: ['09:00:00', '18:00:00'],
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.findAll('input')[0].element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-time-picker__panel').exists()).toBe(true)

    wrapper.vm.close()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-time-picker__panel').exists()).toBe(false)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['', '']])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
