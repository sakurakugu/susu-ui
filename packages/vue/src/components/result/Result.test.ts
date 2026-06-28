import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Result from './Result.vue'

describe('Result', () => {
  it('渲染默认结果状态', () => {
    const wrapper = mount(Result, {
      props: {
        title: '提交成功',
        description: '系统已经保存当前配置。',
      },
    })

    const result = wrapper.find('.su-result')

    expect(result.classes()).toContain('su-result--info')
    expect(result.attributes('role')).toBe('status')
    expect(wrapper.find('.su-result__default-icon').text()).toBe('i')
    expect(wrapper.find('.su-result__title').text()).toBe('提交成功')
    expect(wrapper.find('.su-result__description').text()).toBe('系统已经保存当前配置。')
  })

  it('支持不同状态和图标尺寸', () => {
    const wrapper = mount(Result, {
      props: {
        status: 'success',
        iconSize: 96,
      },
    })

    expect(wrapper.find('.su-result').classes()).toContain('su-result--success')
    expect(wrapper.find('.su-result__default-icon').text()).toBe('✓')
    expect(wrapper.find('.su-result__icon').attributes('style')).toContain('width: 96px')
  })

  it('支持字符串图标尺寸', () => {
    const wrapper = mount(Result, {
      props: {
        iconSize: '5rem',
      },
    })

    expect(wrapper.find('.su-result__icon').attributes('style')).toContain('width: 5rem')
  })

  it('支持标题、描述、图标和底部插槽', () => {
    const wrapper = mount(Result, {
      slots: {
        title: '自定义标题',
        default: '自定义描述',
        icon: '<span data-test="icon">?</span>',
        footer: '<button>返回首页</button>',
      },
    })

    expect(wrapper.find('.su-result__title').text()).toBe('自定义标题')
    expect(wrapper.find('.su-result__description').text()).toBe('自定义描述')
    expect(wrapper.find('[data-test="icon"]').exists()).toBe(true)
    expect(wrapper.find('.su-result__footer').text()).toBe('返回首页')
  })
})
