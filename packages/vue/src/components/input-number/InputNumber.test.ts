import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from './InputNumber.vue'

describe('InputNumber', () => {
  it('渲染默认数字输入框', () => {
    const wrapper = mount(InputNumber, {
      props: {
        placeholder: '请输入数量',
      },
    })

    expect(wrapper.classes()).toContain('su-input-number')
    expect(wrapper.classes()).toContain('su-input-number--medium')
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入数量')
    expect(wrapper.find('input').attributes('role')).toBe('spinbutton')
  })

  it('支持 v-model 更新', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1,
      },
    })

    await wrapper.find('input').setValue('12')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12])
    expect(wrapper.emitted('input')?.[0]).toEqual([12, expect.any(Event)])
  })

  it('支持清空为 null', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 8,
        clearable: true,
      },
    })

    await wrapper.find('.su-input-number__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('支持加减按钮和 step', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
        step: 2,
      },
    })
    const controls = wrapper.findAll('.su-input-number__control')

    await controls[0].trigger('click')
    await wrapper.setProps({ modelValue: 4 })
    await controls[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([4, expect.any(Event)])
  })

  it('支持最小值和最大值限制', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        min: 0,
        max: 10,
        step: 10,
      },
    })
    const controls = wrapper.findAll('.su-input-number__control')

    await controls[0].trigger('click')
    await wrapper.setProps({ modelValue: 10 })
    await controls[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([0])
  })

  it('支持精度格式化', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 1,
        step: 0.1,
        precision: 2,
      },
    })
    const input = wrapper.find('input')

    expect(input.element.value).toBe('1.00')

    await input.setValue('1.239')
    await input.trigger('blur')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1.24])
    expect(input.element.value).toBe('1.24')
  })

  it('忽略非法输入并在失焦时恢复', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 3,
      },
    })
    const input = wrapper.find('input')

    await input.setValue('abc')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('blur')
    expect(input.element.value).toBe('3')
  })

  it('支持键盘上下键调整数值', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 3,
      },
    })
    const input = wrapper.find('input')

    await input.trigger('keydown', { key: 'ArrowUp' })
    await wrapper.setProps({ modelValue: 4 })
    await input.trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([3])
  })

  it('支持尺寸、状态、禁用和只读状态', () => {
    const wrapper = mount(InputNumber, {
      props: {
        size: 'large',
        status: 'error',
        disabled: true,
        readonly: true,
      },
    })

    expect(wrapper.classes()).toContain('su-input-number--large')
    expect(wrapper.classes()).toContain('su-input-number--error')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.classes()).toContain('is-readonly')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('支持前后置插槽', () => {
    const wrapper = mount(InputNumber, {
      slots: {
        prefix: '¥',
        suffix: '元',
      },
    })

    expect(wrapper.classes()).toContain('has-prefix')
    expect(wrapper.classes()).toContain('has-suffix')
    expect(wrapper.find('.su-input-number__prefix').text()).toBe('¥')
    expect(wrapper.find('.su-input-number__suffix').text()).toBe('元')
  })

  it('转发原生属性和事件', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        id: 'count',
        name: 'count',
        required: true,
        autocomplete: 'off',
        ariaLabel: '数量',
      },
      attrs: {
        'data-test': 'count-input',
      },
    })

    await wrapper.find('input').trigger('invalid')

    expect(wrapper.find('input').attributes('id')).toBe('count')
    expect(wrapper.find('input').attributes('name')).toBe('count')
    expect(wrapper.find('input').attributes('required')).toBeDefined()
    expect(wrapper.find('input').attributes('autocomplete')).toBe('off')
    expect(wrapper.find('input').attributes('aria-label')).toBe('数量')
    expect(wrapper.find('input').attributes('data-test')).toBe('count-input')
    expect(wrapper.emitted('invalid')).toHaveLength(1)
  })

  it('暴露输入框控制方法', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 2,
      },
    })

    wrapper.vm.increase()
    await wrapper.setProps({ modelValue: 3 })
    wrapper.vm.decrease()
    await wrapper.setProps({ modelValue: 2 })
    wrapper.vm.clear()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([2])
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([null])
  })
})
