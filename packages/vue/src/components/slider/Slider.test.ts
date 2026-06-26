import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import Slider from './Slider.vue'
import { formKey } from '../form/context'

describe('Slider', () => {
  it('渲染默认滑块', () => {
    const wrapper = mount(Slider)
    const input = wrapper.find('input')

    expect(wrapper.classes()).toContain('su-slider')
    expect(wrapper.classes()).toContain('su-slider--medium')
    expect(input.attributes('type')).toBe('range')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('100')
    expect(input.attributes('step')).toBe('1')
    expect(input.attributes('aria-label')).toBe('滑块')
  })

  it('支持 v-model 更新', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 20,
      },
    })
    const input = wrapper.find('input')

    input.element.value = '36'
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([36])
    expect(wrapper.emitted('input')?.[0]).toEqual([36, expect.any(Event)])
  })

  it('支持 change 事件', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Slider, {
      props: {
        modelValue: 20,
        onChange,
      },
    })
    const input = wrapper.find('input')

    input.element.value = '40'
    await input.trigger('change')

    expect(wrapper.emitted('change')?.[0]).toEqual([40, expect.any(Event)])
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持最小值、最大值和步进归一化', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 0,
        min: 10,
        max: 20,
        step: 2,
      },
    })
    const input = wrapper.find('input')

    input.element.value = '17'
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([18])
  })

  it('支持范围选择', async () => {
    const wrapper = mount(Slider, {
      props: {
        range: true,
        modelValue: [20, 60],
      },
    })
    const inputs = wrapper.findAll('input')

    inputs[0].element.value = '70'
    await inputs[0].trigger('input')
    await wrapper.setProps({ modelValue: [60, 60] })
    inputs[1].element.value = '80'
    await inputs[1].trigger('input')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[60, 60]])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[60, 80]])
  })

  it('支持刻度点点击', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 0,
        marks: {
          0: '低',
          50: '中',
          100: '高',
        },
      },
    })

    await wrapper.findAll('.su-slider__mark')[1].trigger('click')

    expect(wrapper.findAll('.su-slider__mark-label')[1].text()).toBe('中')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50])
    expect(wrapper.emitted('change')?.[0]).toEqual([50, expect.any(Event)])
  })

  it('支持尺寸、禁用和只读状态', () => {
    const wrapper = mount(Slider, {
      props: {
        size: 'large',
        disabled: true,
        readonly: true,
      },
    })

    expect(wrapper.classes()).toContain('su-slider--large')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.classes()).toContain('is-readonly')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('支持格式化提示和原生属性', () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 30,
        id: 'volume',
        name: 'volume',
        formatTooltip: (value: number) => `${value}%`,
      },
      attrs: {
        'data-test': 'volume-slider',
      },
    })
    const input = wrapper.find('input')

    expect(input.attributes('id')).toBe('volume')
    expect(input.attributes('name')).toBe('volume')
    expect(input.attributes('data-test')).toBe('volume-slider')
    expect(input.attributes('aria-valuetext')).toBe('30%')
    expect(wrapper.find('.su-slider__tooltip').text()).toBe('30%')
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Slider, {
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

    expect(wrapper.classes()).toContain('su-slider--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露聚焦控制方法', () => {
    const wrapper = mount(Slider, {
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
