import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Drawer from './Drawer.vue'

describe('Drawer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('渲染标题、内容和默认页脚', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
        title: '任务详情',
      },
      slots: {
        default: '这里展示任务的详细信息。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const drawer = document.body.querySelector('.su-drawer')
    expect(drawer?.getAttribute('role')).toBe('dialog')
    expect(drawer?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.querySelector('.su-drawer__title')?.textContent).toBe(
      '任务详情',
    )
    expect(document.body.querySelector('.su-drawer__body')?.textContent).toBe(
      '这里展示任务的详细信息。',
    )
    expect(document.body.querySelectorAll('.su-drawer__button')).toHaveLength(2)

    wrapper.unmount()
  })

  it('支持不同方向和尺寸', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
        placement: 'left',
        size: 360,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const drawer = document.body.querySelector<HTMLElement>('.su-drawer')
    expect(drawer?.classList.contains('su-drawer--left')).toBe(true)
    expect(drawer?.style.width).toBe('360px')

    await wrapper.setProps({ placement: 'bottom', size: '48vh' })
    expect(drawer?.classList.contains('su-drawer--bottom')).toBe(true)
    expect(drawer?.style.height).toBe('48vh')

    wrapper.unmount()
  })

  it('支持关闭按钮、遮罩和 ESC 关闭', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body.querySelector<HTMLButtonElement>('.su-drawer__close')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    document.body
      .querySelector<HTMLElement>('.su-drawer-overlay')
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

  it('可禁用遮罩和 ESC 关闭', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
        closeOnClickMask: false,
        closeOnPressEscape: false,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body
      .querySelector<HTMLElement>('.su-drawer-overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('支持取消和确认事件', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const buttons =
      document.body.querySelectorAll<HTMLButtonElement>('.su-drawer__button')

    buttons[0]?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0]).toEqual(['cancel'])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    document.body
      .querySelectorAll<HTMLButtonElement>('.su-drawer__button')[1]
      ?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  it('支持自定义头部、底部和层级', async () => {
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
        zIndex: 3000,
        showFooter: false,
      },
      slots: {
        header: '<strong class="custom-header">自定义头部</strong>',
        footer: '<button class="custom-footer">保存</button>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const overlay =
      document.body.querySelector<HTMLElement>('.su-drawer-overlay')

    expect(overlay?.style.zIndex).toBe('3000')
    expect(document.body.querySelector('.custom-header')?.textContent).toBe(
      '自定义头部',
    )
    expect(document.body.querySelector('.custom-footer')?.textContent).toBe(
      '保存',
    )

    wrapper.unmount()
  })

  it('打开时锁定页面滚动，卸载后恢复', async () => {
    const originalOverflow = document.body.style.overflow
    const wrapper = mount(Drawer, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ modelValue: false })
    expect(document.body.style.overflow).toBe(originalOverflow)

    await wrapper.setProps({ modelValue: true })
    wrapper.unmount()
    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('支持生命周期事件', async () => {
    const onOpen = vi.fn()
    const wrapper = mount(Drawer, {
      props: {
        modelValue: false,
        onOpen,
      },
      attachTo: document.body,
    })

    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    expect(onOpen).toHaveBeenCalledOnce()

    await wrapper.setProps({ modelValue: false })
    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.su-drawer')).toBeNull()

    wrapper.unmount()
  })
})
