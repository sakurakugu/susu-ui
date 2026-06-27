import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from './Calendar.vue'

describe('Calendar', () => {
  it('渲染默认日历', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
      },
    })

    expect(wrapper.classes()).toContain('su-calendar')
    expect(wrapper.classes()).toContain('su-calendar--medium')
    expect(wrapper.find('.su-calendar__title').text()).toBe('2026 年 6 月')
    expect(wrapper.findAll('.su-calendar__cell')).toHaveLength(42)
  })

  it('支持选择日期', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        onChange,
      },
    })

    await wrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-18')
      ?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-06-18'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-06-18'])
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持切换月份和年份', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
      },
    })

    await wrapper.find('[aria-label="下一月"]').trigger('click')
    expect(wrapper.find('.su-calendar__title').text()).toBe('2026 年 7 月')
    expect(wrapper.emitted('panelChange')?.[0]).toEqual([2026, 7])

    await wrapper.find('[aria-label="上一年"]').trigger('click')
    expect(wrapper.find('.su-calendar__title').text()).toBe('2025 年 7 月')
    expect(wrapper.emitted('panelChange')?.[1]).toEqual([2025, 7])
  })

  it('支持最小和最大日期限制', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        min: '2026-06-10',
        max: '2026-06-20',
      },
    })

    const beforeMin = wrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-09')
    const afterMax = wrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(beforeMin?.attributes('disabled')).toBeDefined()
    expect(afterMax?.attributes('disabled')).toBeDefined()
  })

  it('支持 disabledDate 禁用日期', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        disabledDate: (date: Date) => date.getDay() === 0,
      },
    })

    const sunday = wrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-21')

    expect(sunday?.attributes('disabled')).toBeDefined()
  })

  it('支持隐藏相邻月份日期', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        showAdjacentMonths: false,
      },
    })

    expect(wrapper.find('.su-calendar__cell.is-hidden').exists()).toBe(true)
  })

  it('支持禁用和只读状态', async () => {
    const disabledWrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        disabled: true,
      },
    })
    const readonlyWrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
        readonly: true,
      },
    })

    await disabledWrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-18')
      ?.trigger('click')
    await readonlyWrapper
      .findAll('.su-calendar__cell')
      .find((item) => item.attributes('aria-label') === '2026-06-18')
      ?.trigger('click')

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(disabledWrapper.emitted('update:modelValue')).toBeUndefined()
    expect(readonlyWrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('暴露面板控制方法', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: '2026-06-15',
      },
    })

    wrapper.vm.nextMonth()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-calendar__title').text()).toBe('2026 年 7 月')

    wrapper.vm.previousYear()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-calendar__title').text()).toBe('2025 年 7 月')

    wrapper.vm.focusDate(new Date(2026, 5, 1))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.su-calendar__title').text()).toBe('2026 年 6 月')
  })
})
