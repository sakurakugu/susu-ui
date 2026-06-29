import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Tour, { type TourStep } from './Tour.vue'

function mockRect(element: Element, rect: Partial<DOMRect>) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width: 120,
    height: 40,
    top: 80,
    right: 220,
    bottom: 120,
    left: 100,
    x: 100,
    y: 80,
    toJSON: () => '',
    ...rect,
  } as DOMRect)
}

function createTarget(id: string, rect: Partial<DOMRect>) {
  const target = document.createElement('button')
  target.id = id
  target.textContent = id
  target.scrollIntoView = vi.fn()
  document.body.appendChild(target)
  mockRect(target, rect)
  return target
}

describe('Tour', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    vi.restoreAllMocks()
  })

  it('根据当前步骤渲染标题、描述和计数', async () => {
    document.body.style.overflow = 'scroll'
    document.body.style.paddingRight = '3px'
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1183)
    createTarget('publish', {
      top: 100,
      bottom: 132,
      left: 160,
      right: 280,
      width: 120,
      height: 32,
    })

    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [
          {
            title: '发布入口',
            description: '检查完成后从这里发布到线上环境。',
            target: '#publish',
          },
        ],
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const tour = document.body.querySelector<HTMLElement>('.su-tour')
    expect(tour?.getAttribute('role')).toBe('dialog')
    expect(tour?.textContent).toContain('发布入口')
    expect(tour?.textContent).toContain('检查完成后从这里发布到线上环境。')
    expect(tour?.textContent).toContain('1 / 1')
    expect(document.body.querySelector('.su-tour__highlight')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('20px')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.body.style.paddingRight).toBe('3px')
  })

  it('支持前进、后退和完成事件', async () => {
    const first = createTarget('filter', {
      top: 80,
      bottom: 112,
      left: 120,
      right: 240,
    })
    const second = createTarget('export', {
      top: 180,
      bottom: 212,
      left: 260,
      right: 380,
    })
    const steps: TourStep[] = [
      { title: '筛选条件', target: first },
      { title: '导出报表', target: second },
    ]
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body.querySelector<HTMLButtonElement>('.su-tour__button--primary')?.click()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:current')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, steps[1]])
    expect(document.body.querySelector('.su-tour')?.textContent).toContain('导出报表')

    document.body.querySelector<HTMLButtonElement>('.su-tour__button')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:current')?.[1]).toEqual([0])

    await wrapper.setProps({ current: 1 })
    document.body.querySelector<HTMLButtonElement>('.su-tour__button--primary')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('finish')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0]).toEqual(['finish'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('支持关闭按钮、遮罩和 ESC 关闭', async () => {
    createTarget('settings', {
      top: 64,
      bottom: 104,
      left: 80,
      right: 200,
    })
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: '配置入口', target: '#settings' }],
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body.querySelector<HTMLButtonElement>('.su-tour__close')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    document.body
      .querySelector<HTMLButtonElement>('.su-tour__mask')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[1]).toEqual(['mask'])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[2]).toEqual(['esc'])

    wrapper.unmount()
  })

  it('支持自定义插槽、位置、宽度和无遮罩模式', async () => {
    const target = createTarget('approval', {
      top: 140,
      bottom: 180,
      left: 220,
      right: 360,
    })
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        width: 360,
        showMask: false,
        steps: [
          {
            title: '审批信息',
            description: '补齐负责人后再提交。',
            target,
            placement: 'right-start',
          },
        ],
      },
      slots: {
        title: '<strong class="custom-title">自定义标题</strong>',
        description: '<span class="custom-description">自定义描述</span>',
        footer: '<button class="custom-footer">我知道了</button>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const tour = document.body.querySelector<HTMLElement>('.su-tour')
    expect(tour?.classList.contains('su-tour--right')).toBe(true)
    expect(tour?.style.width).toBe('360px')
    expect(document.body.querySelector('.su-tour__mask')).toBeNull()
    expect(document.body.querySelector('.custom-title')?.textContent).toBe('自定义标题')
    expect(document.body.querySelector('.custom-description')?.textContent).toBe('自定义描述')
    expect(document.body.querySelector('.custom-footer')?.textContent).toBe('我知道了')

    wrapper.unmount()
  })

  it('目标不存在时仍展示在视口中部', async () => {
    const wrapper = mount(Tour, {
      props: {
        modelValue: true,
        steps: [{ title: '全局介绍', target: '#missing' }],
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-tour')?.textContent).toContain('全局介绍')
    expect(document.body.querySelector<HTMLElement>('.su-tour')?.style.top).not.toBe('')

    wrapper.unmount()
  })
})
