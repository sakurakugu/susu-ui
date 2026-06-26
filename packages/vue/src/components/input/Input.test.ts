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

  it('根据 status 渲染状态样式', () => {
    const wrapper = mount(Input, {
      props: {
        status: 'error',
      },
    })

    expect(wrapper.classes()).toContain('su-input--error')
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

  it('支持清空后自动聚焦', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '可清空内容',
        clearable: true,
        clearFocus: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    await wrapper.find('.su-input__clear').trigger('click')

    expect(document.activeElement).toBe(input)

    wrapper.unmount()
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

  it('支持聚焦时选中文本', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '选中文本',
        selectOnFocus: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    await wrapper.find('input').trigger('focus')

    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe('选中文本'.length)

    wrapper.unmount()
  })

  it('支持密码显示切换', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        showPassword: true,
      },
    })

    const input = wrapper.find('input')

    expect(input.attributes('type')).toBe('password')

    await wrapper.find('.su-input__password').trigger('click')

    expect(input.attributes('type')).toBe('text')
    expect(wrapper.find('.su-input__password').attributes('aria-label')).toBe(
      '隐藏密码',
    )
  })

  it('支持多行输入', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'textarea',
        modelValue: '初始内容',
        rows: 4,
        resize: 'vertical',
      },
    })

    const textarea = wrapper.find('textarea')

    expect(wrapper.classes()).toContain('is-textarea')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(textarea.element.value).toBe('初始内容')
    expect(textarea.attributes('rows')).toBe('4')
    expect(textarea.attributes('style')).toContain('resize: vertical')

    await textarea.setValue('新的多行内容')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['新的多行内容'])
  })

  it('支持字数统计', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '内容',
        maxlength: 10,
        showWordLimit: true,
      },
    })

    expect(wrapper.find('.su-input__word-limit').text()).toBe('2/10')
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

  it('支持前后置块插槽', () => {
    const wrapper = mount(Input, {
      slots: {
        prepend: 'https://',
        append: '.com',
      },
    })

    expect(wrapper.classes()).toContain('has-prepend')
    expect(wrapper.classes()).toContain('has-append')
    expect(wrapper.find('.su-input__prepend').text()).toBe('https://')
    expect(wrapper.find('.su-input__append').text()).toBe('.com')
  })

  it('支持格式化展示和解析输入值', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 123456,
        formatter: (value: string | number) => `¥ ${value}`,
        parser: (value: string) => Number(value.replace(/[^\d]/g, '')),
      },
    })

    const input = wrapper.find('input')

    expect(input.element.value).toBe('¥ 123456')

    await input.setValue('¥ 789')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([789])
  })

  it('支持输入值去除首尾空格', async () => {
    const wrapper = mount(Input, {
      props: {
        trim: true,
      },
    })

    await wrapper.find('input').setValue('  内容  ')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['内容'])
  })

  it('支持输入拦截', async () => {
    const allowInput = vi.fn((value: string) => /^\d*$/.test(value))
    const wrapper = mount(Input, {
      props: {
        modelValue: '12',
        allowInput,
      },
    })
    const input = wrapper.find('input')

    await input.setValue('123')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['123'])

    await input.setValue('123a')
    expect(input.element.value).toBe('123')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(allowInput).toHaveBeenLastCalledWith('123a', expect.any(Event))
  })

  it('组合输入结束后再应用解析器', async () => {
    const wrapper = mount(Input, {
      props: {
        parser: (value: string) => value.replace(/\s/g, ''),
      },
    })
    const input = wrapper.find('input')

    await input.trigger('compositionstart')
    await input.setValue('拼 音')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['拼 音'])

    await input.trigger('compositionend')

    expect(wrapper.emitted('compositionstart')).toHaveLength(1)
    expect(wrapper.emitted('compositionend')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['拼音'])
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Input, {
      props: {
        id: 'account',
        name: 'account',
        autocomplete: 'username',
        inputmode: 'text',
        pattern: '[a-z]+',
        required: true,
        minlength: 3,
        maxlength: 12,
        min: 1,
        max: 10,
        step: 2,
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
    expect(input.attributes('inputmode')).toBe('text')
    expect(input.attributes('pattern')).toBe('[a-z]+')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('minlength')).toBe('3')
    expect(input.attributes('maxlength')).toBe('12')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('10')
    expect(input.attributes('step')).toBe('2')
    expect(input.attributes('aria-label')).toBe('账号')
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('支持回车事件', async () => {
    const wrapper = mount(Input)

    await wrapper.find('input').trigger('keydown.enter')

    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('支持原生校验失败事件', async () => {
    const wrapper = mount(Input, {
      props: {
        required: true,
      },
    })

    await wrapper.find('input').trigger('invalid')

    expect(wrapper.emitted('invalid')).toHaveLength(1)
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

  it('暴露输入框控制方法', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '可选择内容',
        clearable: true,
      },
      attachTo: document.body,
    })
    const input = wrapper.find('input').element

    wrapper.vm.focus()
    expect(document.activeElement).toBe(input)

    wrapper.vm.select()
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe('可选择内容'.length)

    wrapper.vm.clear()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])

    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input)

    wrapper.unmount()
  })
})
