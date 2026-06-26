import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  it('渲染默认输入框', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: '请输入内容',
      },
    })

    expect(wrapper.classes()).toContain('su-input')
    expect(wrapper.classes()).toContain('su-input--medium')
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入内容')
  })

  it('支持 v-model 更新', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '初始值',
      },
    })

    await wrapper.find('input').setValue('新内容')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新内容'])
    expect(wrapper.emitted('input')).toHaveLength(1)
  })

  it('根据 size 渲染尺寸样式', () => {
    const wrapper = mount(Input, {
      props: {
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-input--large')
  })

  it('支持禁用和只读状态', () => {
    const disabledWrapper = mount(Input, {
      props: {
        disabled: true,
      },
    })
    const readonlyWrapper = mount(Input, {
      props: {
        readonly: true,
      },
    })

    expect(disabledWrapper.classes()).toContain('is-disabled')
    expect(disabledWrapper.find('input').attributes('disabled')).toBeDefined()
    expect(readonlyWrapper.classes()).toContain('is-readonly')
    expect(readonlyWrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('支持清空内容', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '可清空内容',
        clearable: true,
      },
    })

    await wrapper.find('.su-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('禁用时不显示清空按钮', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '不可清空',
        clearable: true,
        disabled: true,
      },
    })

    expect(wrapper.find('.su-input__clear').exists()).toBe(false)
  })

  it('支持前后置插槽', () => {
    const wrapper = mount(Input, {
      slots: {
        prefix: '前',
        suffix: '后',
      },
    })

    expect(wrapper.classes()).toContain('has-prefix')
    expect(wrapper.classes()).toContain('has-suffix')
    expect(wrapper.find('.su-input__prefix').text()).toBe('前')
    expect(wrapper.find('.su-input__suffix').text()).toBe('后')
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Input, {
      props: {
        id: 'account',
        name: 'account',
        autocomplete: 'username',
        minlength: 3,
        maxlength: 12,
        onFocus,
      },
      attrs: {
        'aria-label': '账号',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')

    expect(input.attributes('id')).toBe('account')
    expect(input.attributes('name')).toBe('account')
    expect(input.attributes('autocomplete')).toBe('username')
    expect(input.attributes('minlength')).toBe('3')
    expect(input.attributes('maxlength')).toBe('12')
    expect(input.attributes('aria-label')).toBe('账号')
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('支持中国居民身份证号码校验', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'id-card',
      },
    })
    const input = wrapper.find('input').element

    expect(wrapper.find('input').attributes('type')).toBe('text')

    await wrapper.find('input').setValue('11010519491231002X')
    expect(input.checkValidity()).toBe(true)

    await wrapper.find('input').setValue('110105194912310021')
    expect(input.checkValidity()).toBe(false)
    expect(input.validationMessage).toBe('请输入有效的中国居民身份证号码')
  })
})
