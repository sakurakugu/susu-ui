import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Splitter from './Splitter.vue'

async function dispatchPointer(
  element: Element,
  type: string,
  options: { pointerId: number; clientX: number; clientY: number },
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: options.clientX,
    clientY: options.clientY,
  })

  Object.defineProperty(event, 'pointerId', {
    value: options.pointerId,
  })

  element.dispatchEvent(event)
  await nextTick()
}

describe('Splitter', () => {
  it('渲染水平分割面板', () => {
    const wrapper = mount(Splitter, {
      props: {
        defaultSize: 220,
      },
      slots: {
        first: '订单列表',
        second: '订单详情',
      },
    })
    const bar = wrapper.find('.su-splitter__bar')

    expect(wrapper.classes()).toContain('su-splitter')
    expect(wrapper.classes()).toContain('su-splitter--horizontal')
    expect(wrapper.find('.su-splitter__pane--first').attributes('style')).toContain(
      'flex-basis: 220px',
    )
    expect(bar.attributes('role')).toBe('separator')
    expect(bar.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.text()).toContain('订单列表')
    expect(wrapper.text()).toContain('订单详情')
  })

  it('支持键盘调整面板尺寸', async () => {
    const wrapper = mount(Splitter, {
      props: {
        modelValue: 180,
        step: 5,
      },
    })
    const bar = wrapper.find('.su-splitter__bar')

    await bar.trigger('keydown', { key: 'ArrowRight' })
    await bar.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([185])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([135])
    expect(wrapper.emitted('resize')?.[0]).toEqual([185, expect.any(KeyboardEvent)])
  })

  it('支持垂直分割和方向样式', () => {
    const wrapper = mount(Splitter, {
      props: {
        direction: 'vertical',
        modelValue: 160,
      },
    })

    expect(wrapper.classes()).toContain('su-splitter--vertical')
    expect(wrapper.find('.su-splitter__bar').attributes('aria-orientation')).toBe('vertical')
  })

  it('支持拖拽调整并触发事件', async () => {
    const onResizeStart = vi.fn()
    const onResizeEnd = vi.fn()
    const wrapper = mount(Splitter, {
      props: {
        modelValue: 200,
        onResizeStart,
        onResizeEnd,
      },
    })
    const bar = wrapper.find('.su-splitter__bar')
    bar.element.setPointerCapture = vi.fn()
    bar.element.releasePointerCapture = vi.fn()

    await dispatchPointer(bar.element, 'pointerdown', {
      pointerId: 1,
      clientX: 10,
      clientY: 0,
    })
    await dispatchPointer(bar.element, 'pointermove', {
      pointerId: 1,
      clientX: 60,
      clientY: 0,
    })
    await dispatchPointer(bar.element, 'pointerup', {
      pointerId: 1,
      clientX: 60,
      clientY: 0,
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([250])
    expect(onResizeStart).toHaveBeenCalledOnce()
    expect(onResizeEnd).toHaveBeenCalledOnce()
  })

  it('按最小值和最大值限制尺寸', async () => {
    const wrapper = mount(Splitter, {
      props: {
        modelValue: 180,
        min: 120,
        max: 200,
        step: 10,
      },
    })
    const bar = wrapper.find('.su-splitter__bar')

    await bar.trigger('keydown', { key: 'ArrowRight', shiftKey: true })
    await bar.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    await bar.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([200])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([120])
  })

  it('禁用后不响应调整', async () => {
    const wrapper = mount(Splitter, {
      props: {
        modelValue: 180,
        disabled: true,
      },
    })

    await wrapper.find('.su-splitter__bar').trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('.su-splitter__bar').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
