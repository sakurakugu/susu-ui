import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'

describe('Alert', () => {
  it('渲染基础提示内容和默认样式', () => {
    const wrapper = mount(Alert, {
      slots: {
        default: '这是一条提示',
      },
    })

    const alert = wrapper.find('.su-alert')

    expect(wrapper.text()).toContain('这是一条提示')
    expect(alert.classes()).toContain('su-alert')
    expect(alert.classes()).toContain('su-alert--info')
    expect(alert.attributes('role')).toBe('alert')
  })

  it('支持标题、描述和类型', () => {
    const wrapper = mount(Alert, {
      props: {
        type: 'success',
        title: '保存成功',
        description: '配置已经同步到当前项目。',
      },
    })

    expect(wrapper.find('.su-alert').classes()).toContain('su-alert--success')
    expect(wrapper.find('.su-alert').classes()).toContain('has-title')
    expect(wrapper.find('.su-alert__title').text()).toBe('保存成功')
    expect(wrapper.find('.su-alert__description').text()).toBe('配置已经同步到当前项目。')
  })

  it('支持内容居中', () => {
    const wrapper = mount(Alert, {
      props: {
        center: true,
      },
      slots: {
        default: '系统将在 10 分钟后自动提交审核结果。',
      },
    })

    expect(wrapper.find('.su-alert').classes()).toContain('is-center')
  })

  it('支持隐藏图标和自定义图标', () => {
    const wrapper = mount(Alert, {
      props: {
        showIcon: false,
      },
      slots: {
        default: '无图标提示',
      },
    })

    expect(wrapper.find('.su-alert__icon').exists()).toBe(false)

    const customWrapper = mount(Alert, {
      slots: {
        icon: '<span data-test="icon">?</span>',
        default: '自定义图标提示',
      },
    })

    expect(customWrapper.find('[data-test="icon"]').exists()).toBe(true)
  })

  it('支持关闭并触发 close 事件', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
      },
      slots: {
        default: '可关闭提示',
      },
    })

    await wrapper.find('.su-alert__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('.su-alert').exists()).toBe(false)
  })
})
