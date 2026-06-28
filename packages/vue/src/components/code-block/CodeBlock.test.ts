import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'

describe('CodeBlock', () => {
  it('渲染代码内容、标题和语言标识', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'const orderId = "SO-20260628"',
        title: '订单查询',
        language: 'ts',
      },
    })

    expect(wrapper.classes()).toContain('su-code-block')
    expect(wrapper.classes()).toContain('su-code-block--light')
    expect(wrapper.find('.su-code-block__title').text()).toBe('订单查询')
    expect(wrapper.find('.su-code-block__language').text()).toBe('ts')
    expect(wrapper.find('code').text()).toContain('const orderId')
  })

  it('支持行号、换行和最大高度', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'pnpm install\npnpm check',
        showLineNumbers: true,
        wrap: true,
        maxHeight: 240,
      },
    })

    expect(wrapper.classes()).toContain('has-line-numbers')
    expect(wrapper.classes()).toContain('is-wrap')
    expect(wrapper.attributes('style')).toContain('--su-code-block-max-height: 240px')
    expect(wrapper.findAll('.su-code-block__line')).toHaveLength(2)
  })

  it('支持复制代码并触发事件', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    })

    const wrapper = mount(CodeBlock, {
      props: {
        code: 'pnpm test -- code-block',
      },
    })

    await wrapper.find('button').trigger('click')

    expect(writeText).toHaveBeenCalledWith('pnpm test -- code-block')
    expect(wrapper.emitted('copy')?.[0]).toEqual(['pnpm test -- code-block'])
    expect(wrapper.find('button').text()).toBe('已复制')
  })

  it('关闭头部后只展示代码区域', () => {
    const wrapper = mount(CodeBlock, {
      props: {
        code: 'SELECT * FROM orders;',
        showHeader: false,
      },
    })

    expect(wrapper.find('.su-code-block__header').exists()).toBe(false)
    expect(wrapper.find('code').text()).toContain('SELECT')
  })
})
