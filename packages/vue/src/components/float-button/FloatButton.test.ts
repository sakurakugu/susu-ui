import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatButton from './FloatButton.vue'
import FloatButtonGroup from './FloatButtonGroup.vue'

describe('FloatButton', () => {
  it('渲染默认浮动按钮并应用固定位置', () => {
    const wrapper = mount(FloatButton, {
      props: {
        description: '新建',
        right: 24,
        bottom: '32px',
        ariaLabel: '新建任务',
      },
    })

    const button = wrapper.find('.su-float-button')

    expect(button.element.tagName).toBe('BUTTON')
    expect(button.text()).toBe('新建')
    expect(button.attributes('aria-label')).toBe('新建任务')
    expect(button.attributes('style')).toContain('right: 24px')
    expect(button.attributes('style')).toContain('bottom: 32px')
  })

  it('支持链接模式和安全 rel 默认值', () => {
    const wrapper = mount(FloatButton, {
      props: {
        href: 'https://example.com',
        target: '_blank',
        description: '帮助',
      },
    })

    const link = wrapper.find('a.su-float-button')

    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('支持角标数字、上限和点击事件', async () => {
    const wrapper = mount(FloatButton, {
      props: {
        badge: 18,
        badgeMax: 9,
      },
    })

    expect(wrapper.find('.su-float-button__badge').text()).toBe('9+')

    await wrapper.find('.su-float-button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})

describe('FloatButtonGroup', () => {
  it('默认直接展示组内按钮并取消子按钮固定定位', () => {
    const wrapper = mount(FloatButtonGroup, {
      slots: {
        default: '<SuFloatButton description="审批" />',
      },
      global: {
        components: {
          SuFloatButton: FloatButton,
        },
      },
    })

    const button = wrapper.find('.su-float-button')

    expect(wrapper.find('.su-float-button-group__list').exists()).toBe(true)
    expect(button.classes()).toContain('is-in-group')
    expect(button.attributes('style')).toBeUndefined()
  })

  it('点击触发器时展开菜单并触发状态事件', async () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        trigger: 'click',
      },
      slots: {
        default: '<SuFloatButton description="评论" />',
      },
      global: {
        components: {
          SuFloatButton: FloatButton,
        },
      },
    })

    expect(wrapper.find('.su-float-button-group__list').exists()).toBe(false)

    await wrapper.find('.su-float-button-group__trigger').trigger('click')

    expect(wrapper.find('.su-float-button-group__list').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])
  })

  it('支持受控展开状态', async () => {
    const wrapper = mount(FloatButtonGroup, {
      props: {
        trigger: 'click',
        open: true,
      },
      slots: {
        default: '<SuFloatButton description="反馈" />',
      },
      global: {
        components: {
          SuFloatButton: FloatButton,
        },
      },
    })

    expect(wrapper.find('.su-float-button-group__list').exists()).toBe(true)

    await wrapper.find('.su-float-button-group__trigger').trigger('click')

    expect(wrapper.find('.su-float-button-group__list').exists()).toBe(true)
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
  })
})
