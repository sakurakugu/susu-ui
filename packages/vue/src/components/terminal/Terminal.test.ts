import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Terminal from './Terminal.vue'

describe('Terminal', () => {
  it('渲染终端标题、状态和内容', () => {
    const wrapper = mount(Terminal, {
      props: {
        title: '部署任务',
        status: 'running',
        content: 'pnpm build\n正在生成产物...',
      },
    })

    expect(wrapper.classes()).toContain('su-terminal')
    expect(wrapper.classes()).toContain('su-terminal--running')
    expect(wrapper.find('.su-terminal__title').text()).toBe('部署任务')
    expect(wrapper.find('.su-terminal__status').text()).toBe('运行中')
    expect(wrapper.find('.su-code-block').exists()).toBe(true)
    expect(wrapper.text()).toContain('正在生成产物')
  })

  it('支持结构化命令行并自动添加提示符', () => {
    const wrapper = mount(Terminal, {
      props: {
        lines: [
          { type: 'command', text: 'pnpm check' },
          { type: 'output', text: 'packages/vue typecheck passed' },
          { type: 'success', text: '检查通过' },
        ],
      },
    })

    expect(wrapper.find('code').text()).toContain('$ pnpm check')
    expect(wrapper.find('code').text()).toContain('检查通过')
  })

  it('支持关闭头部和透传复制事件', async () => {
    const wrapper = mount(Terminal, {
      props: {
        showHeader: false,
        content: 'tail -f service.log',
      },
    })

    expect(wrapper.find('.su-terminal__header').exists()).toBe(false)

    await wrapper.findComponent({ name: 'SuCodeBlock' }).vm.$emit('copy', 'tail -f service.log')

    expect(wrapper.emitted('copy')?.[0]).toEqual(['tail -f service.log'])
  })
})
