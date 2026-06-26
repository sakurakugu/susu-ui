import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Form from './Form.vue'
import FormItem from './FormItem.vue'

describe('Form', () => {
  it('渲染默认表单布局', () => {
    const wrapper = mount(Form, {
      slots: {
        default: '<div>内容</div>',
      },
    })

    expect(wrapper.classes()).toContain('su-form')
    expect(wrapper.classes()).toContain('su-form--medium')
    expect(wrapper.classes()).toContain('su-form--label-right')
    expect(wrapper.find('.su-form__fieldset').text()).toBe('内容')
  })

  it('支持布局属性和禁用状态', () => {
    const wrapper = mount(Form, {
      props: {
        labelWidth: 120,
        labelPosition: 'left',
        size: 'large',
        inline: true,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('su-form--large')
    expect(wrapper.classes()).toContain('su-form--label-left')
    expect(wrapper.classes()).toContain('is-inline')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('style')).toContain(
      '--su-form-label-width: 120px',
    )
    expect(wrapper.find('fieldset').attributes('disabled')).toBeDefined()
  })

  it('转发表单提交和重置事件', async () => {
    const wrapper = mount(Form)

    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('reset')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('校验失败时不触发提交事件', async () => {
    const wrapper = mount(Form, {
      slots: {
        default: '<input required />',
      },
      attachTo: document.body,
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()

    wrapper.unmount()
  })

  it('关闭提交校验时添加 novalidate 并触发提交', async () => {
    const wrapper = mount(Form, {
      props: {
        validateOnSubmit: false,
      },
      slots: {
        default: '<input required />',
      },
    })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('form').attributes('novalidate')).toBeDefined()
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('暴露原生表单方法', () => {
    const wrapper = mount(Form, {
      slots: {
        default: '<input required />',
      },
      attachTo: document.body,
    })
    const submit = vi.spyOn(wrapper.find('form').element, 'requestSubmit')
    const reset = vi.spyOn(wrapper.find('form').element, 'reset')

    expect(wrapper.vm.checkValidity()).toBe(false)
    expect(wrapper.vm.reportValidity()).toBe(false)

    wrapper.vm.submit()
    wrapper.vm.reset()

    expect(submit).toHaveBeenCalledOnce()
    expect(reset).toHaveBeenCalledOnce()

    wrapper.unmount()
  })
})

describe('FormItem', () => {
  it('渲染标签、控件和帮助文案', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '用户名',
        labelFor: 'username',
        help: '请输入 2 到 12 个字符',
        required: true,
      },
      slots: {
        default: '<input id="username" />',
      },
    })

    expect(wrapper.classes()).toContain('su-form-item')
    expect(wrapper.classes()).toContain('is-required')
    expect(wrapper.find('label').attributes('for')).toBe('username')
    expect(wrapper.find('.su-form-item__label').text()).toBe('用户名')
    expect(wrapper.find('.su-form-item__message').text()).toBe(
      '请输入 2 到 12 个字符',
    )
  })

  it('错误文案优先于帮助文案并切换状态', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '邮箱',
        help: '请输入常用邮箱',
        error: '邮箱格式不正确',
      },
    })

    expect(wrapper.classes()).toContain('su-form-item--error')
    expect(wrapper.find('.su-form-item__message').text()).toBe('邮箱格式不正确')
  })

  it('继承 Form 的布局上下文', () => {
    const wrapper = mount(Form, {
      props: {
        labelWidth: '8em',
        labelPosition: 'top',
        size: 'small',
        disabled: true,
      },
      slots: {
        default: FormItem,
      },
      global: {
        stubs: {
          FormItem,
        },
      },
    })
    const item = wrapper.findComponent(FormItem)

    expect(item.classes()).toContain('su-form-item--small')
    expect(item.classes()).toContain('su-form-item--label-top')
    expect(item.classes()).toContain('is-disabled')
  })

  it('支持局部覆盖标签宽度、位置和尺寸', () => {
    const wrapper = mount(FormItem, {
      props: {
        label: '字段',
        labelWidth: 140,
        labelPosition: 'left',
        size: 'large',
        status: 'success',
      },
    })

    expect(wrapper.classes()).toContain('su-form-item--large')
    expect(wrapper.classes()).toContain('su-form-item--label-left')
    expect(wrapper.classes()).toContain('su-form-item--success')
    expect(wrapper.find('.su-form-item__label').attributes('style')).toContain(
      'width: 140px',
    )
  })

  it('支持自定义标签和帮助插槽', () => {
    const wrapper = mount(FormItem, {
      slots: {
        label: '自定义标签',
        default: '<input />',
        help: '自定义说明',
      },
    })

    expect(wrapper.find('.su-form-item__label').text()).toBe('自定义标签')
    expect(wrapper.find('.su-form-item__message').text()).toBe('自定义说明')
  })
})
