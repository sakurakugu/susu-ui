/* eslint-disable vue/one-component-per-file */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, ref } from 'vue'
import Checkbox from './Checkbox.vue'
import CheckboxGroup from './CheckboxGroup.vue'
import { formKey } from '../form/context'

const CheckboxGroupModelDemo = defineComponent({
  name: 'CheckboxGroupModelDemo',
  components: { Checkbox, CheckboxGroup },
  props: {
    onChange: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const value = ref(['email'])
    return { value }
  },
  template: `
    <CheckboxGroup v-model="value" name="notice" @change="onChange">
      <Checkbox value="email">邮件通知</Checkbox>
      <Checkbox value="sms">短信通知</Checkbox>
    </CheckboxGroup>
  `,
})

const CheckboxGroupDisabledDemo = defineComponent({
  name: 'CheckboxGroupDisabledDemo',
  components: { Checkbox, CheckboxGroup },
  template: `
    <CheckboxGroup :model-value="['email']" direction="vertical" size="large" disabled>
      <Checkbox value="email">邮件通知</Checkbox>
    </CheckboxGroup>
  `,
})

const CheckboxGroupMaxDemo = defineComponent({
  name: 'CheckboxGroupMaxDemo',
  components: { Checkbox, CheckboxGroup },
  setup() {
    const value = ref(['email'])
    return { value }
  },
  template: `
    <CheckboxGroup v-model="value" :max="1">
      <Checkbox value="email">邮件通知</Checkbox>
      <Checkbox value="sms">短信通知</Checkbox>
    </CheckboxGroup>
  `,
})

const CheckboxGroupFormDemo = defineComponent({
  name: 'CheckboxGroupFormDemo',
  components: { Checkbox, CheckboxGroup },
  template: `
    <CheckboxGroup :model-value="['email']">
      <Checkbox value="email">邮件通知</Checkbox>
    </CheckboxGroup>
  `,
})

describe('Checkbox', () => {
  it('渲染默认复选框', () => {
    const wrapper = mount(Checkbox)

    expect(wrapper.classes()).toContain('su-checkbox')
    expect(wrapper.classes()).toContain('su-checkbox--medium')
    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.find('input').attributes('type')).toBe('checkbox')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('false')
  })

  it('支持标签属性和默认插槽', () => {
    const labelWrapper = mount(Checkbox, {
      props: {
        label: '同意协议',
      },
    })
    const slotWrapper = mount(Checkbox, {
      slots: {
        default: '接收通知',
      },
    })

    expect(labelWrapper.find('.su-checkbox__label').text()).toBe('同意协议')
    expect(slotWrapper.find('.su-checkbox__label').text()).toBe('接收通知')
  })

  it('支持 v-model 更新', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        onChange,
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0][0]).toBe(true)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('支持自定义真假值', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: 'no',
        trueValue: 'yes',
        falseValue: 'no',
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yes'])
  })

  it('根据选中和半选状态渲染类名', () => {
    const checkedWrapper = mount(Checkbox, {
      props: {
        modelValue: true,
      },
    })
    const indeterminateWrapper = mount(Checkbox, {
      props: {
        indeterminate: true,
      },
    })

    expect(checkedWrapper.classes()).toContain('is-checked')
    expect(checkedWrapper.find('input').attributes('aria-checked')).toBe('true')
    expect(indeterminateWrapper.classes()).toContain('is-indeterminate')
    expect(indeterminateWrapper.find('input').element.indeterminate).toBe(true)
    expect(indeterminateWrapper.find('input').attributes('aria-checked')).toBe('mixed')
  })

  it('根据 size 渲染尺寸样式', () => {
    const wrapper = mount(Checkbox, {
      props: {
        size: 'large',
      },
    })

    expect(wrapper.classes()).toContain('su-checkbox--large')
  })

  it('支持禁用状态', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(Checkbox, {
      props: {
        id: 'agreement',
        name: 'agreement',
        value: 'agree',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-label': '同意协议',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('agreement')
    expect(input.attributes('name')).toBe('agreement')
    expect(input.attributes('value')).toBe('agree')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-label')).toBe('同意协议')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(Checkbox, {
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

    expect(wrapper.classes()).toContain('su-checkbox--small')
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('暴露聚焦控制方法', () => {
    const wrapper = mount(Checkbox, {
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

describe('CheckboxGroup', () => {
  it('渲染分组并同步选中值', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckboxGroupModelDemo, {
      props: {
        onChange,
      },
    })

    const group = wrapper.findComponent(CheckboxGroup)
    const checkboxes = wrapper.findAllComponents(Checkbox)

    expect(group.classes()).toContain('su-checkbox-group')
    expect(group.classes()).toContain('su-checkbox-group--horizontal')
    expect(checkboxes[0].classes()).toContain('is-checked')
    expect(checkboxes[0].find('input').attributes('name')).toBe('notice')

    await checkboxes[1].find('input').setValue(true)

    expect(wrapper.vm.value).toEqual(['email', 'sms'])
    expect(onChange).toHaveBeenCalledOnce()
    expect(checkboxes[1].classes()).toContain('is-checked')

    await checkboxes[0].find('input').setValue(false)

    expect(wrapper.vm.value).toEqual(['sms'])
  })

  it('支持方向、尺寸和禁用状态', () => {
    const wrapper = mount(CheckboxGroupDisabledDemo)

    expect(wrapper.findComponent(CheckboxGroup).classes()).toContain('su-checkbox-group--vertical')
    expect(wrapper.findComponent(Checkbox).classes()).toContain('su-checkbox--large')
    expect(wrapper.findComponent(Checkbox).classes()).toContain('is-disabled')
    expect(wrapper.findComponent(Checkbox).find('input').attributes('disabled')).toBeDefined()
  })

  it('支持限制最多可选数量', () => {
    const wrapper = mount(CheckboxGroupMaxDemo)
    const checkboxes = wrapper.findAllComponents(Checkbox)

    expect(checkboxes[0].classes()).toContain('is-checked')
    expect(checkboxes[0].find('input').attributes('disabled')).toBeUndefined()
    expect(checkboxes[1].classes()).toContain('is-disabled')
    expect(checkboxes[1].find('input').attributes('disabled')).toBeDefined()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(CheckboxGroupFormDemo, {
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

    expect(wrapper.findComponent(CheckboxGroup).classes()).toContain('su-checkbox-group--small')
    expect(wrapper.findComponent(CheckboxGroup).classes()).toContain('is-disabled')
    expect(wrapper.findComponent(Checkbox).classes()).toContain('su-checkbox--small')
    expect(wrapper.findComponent(Checkbox).classes()).toContain('is-disabled')
  })
})
