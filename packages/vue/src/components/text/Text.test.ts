import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from './Text.vue'

describe('Text', () => {
  it('渲染默认文本内容和样式', () => {
    const wrapper = mount(Text, {
      slots: {
        default: '正文内容',
      },
    })

    expect(wrapper.text()).toBe('正文内容')
    expect(wrapper.classes()).toContain('su-text')
    expect(wrapper.classes()).toContain('su-text--default')
    expect(wrapper.classes()).toContain('su-text--medium')
    expect(wrapper.classes()).toContain('su-text--weight-regular')
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('支持语义标签、类型、尺寸和字重', () => {
    const wrapper = mount(Text, {
      props: {
        tag: 'p',
        type: 'primary',
        size: 'large',
        weight: 'semibold',
      },
      slots: {
        default: '段落',
      },
    })

    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.classes()).toContain('su-text--primary')
    expect(wrapper.classes()).toContain('su-text--large')
    expect(wrapper.classes()).toContain('su-text--weight-semibold')
  })

  it('支持块级、单行省略和多行省略', () => {
    const wrapper = mount(Text, {
      props: {
        block: true,
        ellipsis: true,
        lineClamp: 2,
      },
    })

    expect(wrapper.classes()).toContain('is-block')
    expect(wrapper.classes()).toContain('is-ellipsis')
    expect(wrapper.classes()).toContain('is-line-clamp')
    expect(wrapper.attributes('style')).toContain('--su-text-line-clamp: 2')
  })

  it('支持文本修饰状态', () => {
    const wrapper = mount(Text, {
      props: {
        underline: true,
        delete: true,
        italic: true,
      },
    })

    expect(wrapper.classes()).toContain('is-underline')
    expect(wrapper.classes()).toContain('is-delete')
    expect(wrapper.classes()).toContain('is-italic')
  })
})
