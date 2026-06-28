import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Statistic from './Statistic.vue'

describe('Statistic', () => {
  it('渲染标题和默认数值', () => {
    const wrapper = mount(Statistic, {
      props: {
        title: '总访问量',
        value: 12800,
      },
    })

    expect(wrapper.classes()).toContain('su-statistic')
    expect(wrapper.find('.su-statistic__title').text()).toBe('总访问量')
    expect(wrapper.find('.su-statistic__number').text()).toBe('12,800')
  })

  it('支持精度、小数分隔符和千分位分隔符', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 12800.356,
        precision: 2,
        groupSeparator: ' ',
        decimalSeparator: ',',
      },
    })

    expect(wrapper.find('.su-statistic__number').text()).toBe('12 800,36')
  })

  it('支持前缀、后缀、状态、趋势和尺寸', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 18.6,
        prefix: '¥',
        suffix: '万',
        status: 'success',
        trend: 'up',
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-statistic--success')
    expect(wrapper.classes()).toContain('su-statistic--trend-up')
    expect(wrapper.classes()).toContain('su-statistic--large')
    expect(wrapper.find('.su-statistic__prefix').text()).toBe('¥')
    expect(wrapper.find('.su-statistic__trend').text()).toBe('▲')
    expect(wrapper.find('.su-statistic__suffix').text()).toBe('万')
  })

  it('支持格式化函数和描述', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 0.678,
        description: '较上周增长',
        format: (value) => `${(Number(value) * 100).toFixed(1)}%`,
      },
    })

    expect(wrapper.find('.su-statistic__number').text()).toBe('67.8%')
    expect(wrapper.find('.su-statistic__description').text()).toBe('较上周增长')
  })

  it('支持插槽覆盖内容', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 42,
      },
      slots: {
        title: '活跃项目',
        prefix: '约',
        value: '<strong>42 个</strong>',
        suffix: '进行中',
        description: '按当前筛选条件统计',
      },
    })

    expect(wrapper.find('.su-statistic__title').text()).toBe('活跃项目')
    expect(wrapper.find('.su-statistic__prefix').text()).toBe('约')
    expect(wrapper.find('.su-statistic__number').text()).toBe('42 个')
    expect(wrapper.find('.su-statistic__suffix').text()).toBe('进行中')
    expect(wrapper.find('.su-statistic__description').text()).toBe('按当前筛选条件统计')
  })

  it('支持加载状态', () => {
    const wrapper = mount(Statistic, {
      props: {
        title: '成交额',
        value: 1200,
        loading: true,
      },
    })

    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.su-statistic__skeleton').exists()).toBe(true)
    expect(wrapper.find('.su-statistic__number').exists()).toBe(false)
  })
})
