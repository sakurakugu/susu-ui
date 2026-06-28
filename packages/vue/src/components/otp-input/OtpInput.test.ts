import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import OtpInput from './OtpInput.vue'

describe('OtpInput', () => {
  it('渲染默认验证码输入框', () => {
    const wrapper = mount(OtpInput)
    const inputs = wrapper.findAll('.su-otp-input__item')

    expect(wrapper.classes()).toContain('su-otp-input')
    expect(wrapper.classes()).toContain('su-otp-input--medium')
    expect(inputs).toHaveLength(6)
    expect(inputs[0].attributes('autocomplete')).toBe('one-time-code')
    expect(inputs[0].attributes('inputmode')).toBe('numeric')
  })

  it('支持 v-model 单字符输入和自动跳格', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        length: 4,
      },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll<HTMLInputElement>('.su-otp-input__item')

    await inputs[0].setValue('1')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
    expect(wrapper.emitted('input')?.[0]).toEqual(['1', expect.any(Event)])
    expect(document.activeElement).toBe(inputs[1].element)

    wrapper.unmount()
  })

  it('数字模式会过滤非数字内容', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        length: 4,
      },
    })

    await wrapper.findAll('.su-otp-input__item')[0].setValue('a1b2')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12'])
  })

  it('文本模式允许输入字母', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        length: 4,
        type: 'text',
      },
    })

    await wrapper.findAll('.su-otp-input__item')[0].setValue('AB')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['AB'])
    expect(wrapper.find('.su-otp-input__item').attributes('inputmode')).toBe('text')
    expect(wrapper.find('.su-otp-input__item').attributes('pattern')).toBeUndefined()
  })

  it('支持粘贴整串验证码并触发完成事件', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        length: 4,
      },
    })

    await wrapper.findAll('.su-otp-input__item')[0].trigger('paste', {
      clipboardData: {
        getData: () => '123456',
      },
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1234'])
    expect(wrapper.emitted('complete')?.[0]).toEqual(['1234'])
  })

  it('支持退格删除上一位', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        modelValue: '12',
        length: 4,
      },
    })
    const inputs = wrapper.findAll('.su-otp-input__item')

    await inputs[2].trigger('keydown', { key: 'Backspace' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
  })

  it('支持清空内容', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        modelValue: '1234',
        clearable: true,
      },
    })

    await wrapper.find('.su-otp-input__clear').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('支持尺寸、状态、禁用和只读状态', () => {
    const wrapper = mount(OtpInput, {
      props: {
        size: 'large',
        status: 'error',
        disabled: true,
        readonly: true,
      },
    })

    expect(wrapper.classes()).toContain('su-otp-input--large')
    expect(wrapper.classes()).toContain('su-otp-input--error')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.classes()).toContain('is-readonly')
    expect(wrapper.find('.su-otp-input__item').attributes('disabled')).toBeDefined()
    expect(wrapper.find('.su-otp-input__item').attributes('readonly')).toBeDefined()
  })

  it('支持掩码显示、隐藏 name 和可访问标签', () => {
    const wrapper = mount(OtpInput, {
      props: {
        modelValue: '1234',
        mask: true,
        name: 'smsCode',
        id: 'sms-code',
        ariaLabel: '短信验证码',
      },
    })

    expect(wrapper.find('input[type="hidden"]').attributes('name')).toBe('smsCode')
    expect(wrapper.find('input[type="hidden"]').attributes('value')).toBe('1234')
    expect(wrapper.find('.su-otp-input__item').attributes('type')).toBe('password')
    expect(wrapper.find('.su-otp-input__item').attributes('id')).toBe('sms-code-1')
    expect(wrapper.attributes('aria-label')).toBe('短信验证码')
  })

  it('暴露输入框控制方法', async () => {
    const wrapper = mount(OtpInput, {
      props: {
        modelValue: '12',
        clearable: true,
      },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll<HTMLInputElement>('.su-otp-input__item')

    wrapper.vm.focus()
    await wrapper.vm.$nextTick()
    expect(document.activeElement).toBe(inputs[2].element)

    wrapper.vm.select(0)
    await wrapper.vm.$nextTick()
    expect(inputs[0].element.selectionStart).toBe(0)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(inputs[2].element)

    wrapper.unmount()
  })
})
