import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Button from './Button.vue'
import ButtonGroup from './ButtonGroup.vue'

describe('ButtonGroup', () => {
  it('渲染按钮组和默认插槽', () => {
    const wrapper = mount(ButtonGroup, {
      slots: {
        default: '<button>按钮</button>',
      },
    })

    expect(wrapper.classes()).toContain('su-button-group')
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.text()).toBe('按钮')
  })

  it('默认渲染横向按钮组', () => {
    const wrapper = mount(ButtonGroup)

    expect(wrapper.classes()).toContain('su-button-group--horizontal')
  })

  it('支持纵向按钮组', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        direction: 'vertical',
      },
    })

    expect(wrapper.classes()).toContain('su-button-group--vertical')
  })

  it('组内按钮继承 type、variant 和 size', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        type: 'primary',
        variant: 'outline',
        size: 'large',
      },
      slots: {
        default: Button,
      },
    })

    const button = wrapper.findComponent(Button)

    expect(button.classes()).toContain('su-button--primary')
    expect(button.classes()).toContain('su-button--outline')
    expect(button.classes()).toContain('su-button--large')
  })

  it('组内按钮可以覆盖组配置', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        type: 'primary',
        variant: 'outline',
        size: 'large',
      },
      slots: {
        default: () =>
          h(Button, {
            type: 'default',
            variant: 'text',
            size: 'small',
          }),
      },
    })

    const button = wrapper.findComponent(Button)

    expect(button.classes()).toContain('su-button--default')
    expect(button.classes()).toContain('su-button--text')
    expect(button.classes()).toContain('su-button--small')
  })
})
