import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Dialog from './Dialog.vue'

describe('Dialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('渲染标题、内容和默认页脚', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        title: '确认发布',
      },
      slots: {
        default: '发布后将同步到线上环境。',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    const dialog = document.body.querySelector('.su-dialog')
    expect(dialog?.getAttribute('role')).toBe('dialog')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(document.body.querySelector('.su-dialog__title')?.textContent).toBe(
      '确认发布',
    )
    expect(document.body.querySelector('.su-dialog__body')?.textContent).toBe(
      '发布后将同步到线上环境。',
    )
    expect(document.body.querySelectorAll('.su-dialog__button')).toHaveLength(2)

    wrapper.unmount()
  })

  it('支持关闭按钮、遮罩和 ESC 关闭', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body.querySelector<HTMLButtonElement>('.su-dialog__close')?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    document.body
      .querySelector<HTMLElement>('.su-dialog-overlay')
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
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        closeOnClickMask: false,
        closeOnPressEscape: false,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body
      .querySelector<HTMLElement>('.su-dialog-overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('支持取消和确认事件', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const buttons =
      document.body.querySelectorAll<HTMLButtonElement>('.su-dialog__button')

    buttons[0]?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')?.[0]).toEqual(['cancel'])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()
    document.body
      .querySelectorAll<HTMLButtonElement>('.su-dialog__button')[1]
      ?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  it('支持自定义头部、底部、宽度和层级', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        width: 640,
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
      document.body.querySelector<HTMLElement>('.su-dialog-overlay')
    const dialog = document.body.querySelector<HTMLElement>('.su-dialog')

    expect(overlay?.style.zIndex).toBe('3000')
    expect(dialog?.style.width).toBe('640px')
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
    const wrapper = mount(Dialog, {
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
    const wrapper = mount(Dialog, {
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
    expect(document.body.querySelector('.su-dialog')).toBeNull()

    wrapper.unmount()
  })
})
