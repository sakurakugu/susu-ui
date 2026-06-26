/* eslint-disable vue/one-component-per-file */
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, defineComponent, ref } from 'vue'
import RadioButton from './RadioButton.vue'
import RadioGroup from './RadioGroup.vue'
import { formKey } from '../form/context'

const RadioGroupModelDemo = defineComponent({
  name: 'RadioGroupModelDemo',
  components: { RadioGroup, RadioButton },
  props: {
    onChange: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const value = ref('daily')
    return { value }
  },
  template: `
    <RadioGroup v-model="value" name="plan" @change="onChange">
      <RadioButton value="daily">每日</RadioButton>
      <RadioButton value="weekly">每周</RadioButton>
    </RadioGroup>
  `,
})

const RadioGroupDisabledDemo = defineComponent({
  name: 'RadioGroupDisabledDemo',
  components: { RadioGroup, RadioButton },
  template: `
    <RadioGroup model-value="daily" direction="vertical" size="large" disabled>
      <RadioButton value="daily">每日</RadioButton>
    </RadioGroup>
  `,
})

const RadioGroupFormDemo = defineComponent({
  name: 'RadioGroupFormDemo',
  components: { RadioGroup, RadioButton },
  template: `
    <RadioGroup model-value="daily">
      <RadioButton value="daily">每日</RadioButton>
    </RadioGroup>
  `,
})

describe('RadioButton', () => {
  it('渲染默认单选按钮', () => {
    const wrapper = mount(RadioButton, {
      props: {
        value: 'daily',
      },
    })

    expect(wrapper.classes()).toContain('su-radio-button')
    expect(wrapper.classes()).toContain('su-radio-button--medium')
    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.find('input').attributes('type')).toBe('radio')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('false')
  })

  it('支持标签属性和默认插槽', () => {
    const labelWrapper = mount(RadioButton, {
      props: {
        value: 'daily',
        label: '每日',
      },
    })
    const slotWrapper = mount(RadioButton, {
      props: {
        value: 'weekly',
      },
      slots: {
        default: '每周',
      },
    })

    expect(labelWrapper.find('.su-radio-button__label').text()).toBe('每日')
    expect(slotWrapper.find('.su-radio-button__label').text()).toBe('每周')
  })

  it('支持单独使用 v-model 更新', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'weekly',
        value: 'daily',
        onChange,
      },
    })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['daily'])
    expect(wrapper.emitted('change')?.[0][0]).toBe('daily')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('根据选中状态渲染类名', () => {
    const wrapper = mount(RadioButton, {
      props: {
        modelValue: 'daily',
        value: 'daily',
      },
    })

    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.find('input').attributes('aria-checked')).toBe('true')
  })

  it('转发原生属性和事件', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(RadioButton, {
      props: {
        id: 'plan-daily',
        name: 'plan',
        value: 'daily',
        required: true,
        onFocus,
      },
      attrs: {
        'aria-label': '每日计划',
      },
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('blur')

    expect(input.attributes('id')).toBe('plan-daily')
    expect(input.attributes('name')).toBe('plan')
    expect(input.attributes('value')).toBe('daily')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('aria-label')).toBe('每日计划')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it('暴露聚焦控制方法', () => {
    const wrapper = mount(RadioButton, {
      props: {
        value: 'daily',
      },
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

describe('RadioGroup', () => {
  it('渲染分组并同步选中值', async () => {
    const onChange = vi.fn()
    const wrapper = mount(RadioGroupModelDemo, {
      props: {
        onChange,
      },
    })

    const group = wrapper.findComponent(RadioGroup)
    const buttons = wrapper.findAllComponents(RadioButton)

    expect(group.classes()).toContain('su-radio-group')
    expect(group.classes()).toContain('su-radio-group--horizontal')
    expect(buttons[0].classes()).toContain('is-checked')
    expect(buttons[0].find('input').attributes('name')).toBe('plan')

    await buttons[1].find('input').setValue(true)

    expect(wrapper.vm.value).toBe('weekly')
    expect(onChange).toHaveBeenCalledOnce()
    expect(buttons[1].classes()).toContain('is-checked')
  })

  it('支持方向、尺寸和禁用状态', () => {
    const wrapper = mount(RadioGroupDisabledDemo)

    expect(wrapper.findComponent(RadioGroup).classes()).toContain(
      'su-radio-group--vertical',
    )
    expect(wrapper.findComponent(RadioButton).classes()).toContain(
      'su-radio-button--large',
    )
    expect(wrapper.findComponent(RadioButton).classes()).toContain(
      'is-disabled',
    )
    expect(
      wrapper.findComponent(RadioButton).find('input').attributes('disabled'),
    ).toBeDefined()
  })

  it('跟随表单尺寸和禁用状态', () => {
    const wrapper = mount(RadioGroupFormDemo, {
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

    expect(wrapper.findComponent(RadioGroup).classes()).toContain(
      'su-radio-group--small',
    )
    expect(wrapper.findComponent(RadioGroup).classes()).toContain('is-disabled')
    expect(wrapper.findComponent(RadioButton).classes()).toContain(
      'su-radio-button--small',
    )
    expect(wrapper.findComponent(RadioButton).classes()).toContain(
      'is-disabled',
    )
  })
})
