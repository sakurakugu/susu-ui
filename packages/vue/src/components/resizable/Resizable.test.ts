import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Resizable from './Resizable.vue'

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

describe('Resizable', () => {
  it('渲染基础可调整区域', () => {
    const wrapper = mount(Resizable, {
      props: {
        width: 240,
        height: 160,
      },
      slots: {
        default: '客户资料',
      },
    })

    expect(wrapper.classes()).toContain('su-resizable')
    expect(wrapper.classes()).toContain('su-resizable--both')
    expect(wrapper.attributes('style')).toContain('width: 240px')
    expect(wrapper.attributes('style')).toContain('height: 160px')
    expect(wrapper.text()).toContain('客户资料')
    expect(wrapper.find('button').attributes('aria-label')).toBe('调整尺寸')
  })

  it('支持水平尺寸 v-model', async () => {
    const wrapper = mount(Resizable, {
      props: {
        direction: 'horizontal',
        modelValue: 200,
        minWidth: 120,
        maxWidth: 320,
      },
    })
    const handle = wrapper.find('button')

    await handle.trigger('keydown', { key: 'ArrowRight' })
    await handle.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([201])
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([191])
    expect(wrapper.emitted('resize')?.[0]).toEqual([
      201,
      expect.any(KeyboardEvent),
    ])
  })

  it('支持垂直尺寸 v-model', async () => {
    const wrapper = mount(Resizable, {
      props: {
        direction: 'vertical',
        modelValue: 140,
        step: 5,
      },
    })

    await wrapper.find('button').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([145])
  })

  it('支持双轴尺寸对象', async () => {
    const wrapper = mount(Resizable, {
      props: {
        modelValue: {
          width: 200,
          height: 120,
        },
      },
    })

    await wrapper.find('button').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      {
        width: 200,
        height: 121,
      },
    ])
  })

  it('支持拖拽调整并触发开始和结束事件', async () => {
    const onResizeStart = vi.fn()
    const onResizeEnd = vi.fn()
    const wrapper = mount(Resizable, {
      props: {
        modelValue: {
          width: 200,
          height: 120,
        },
        onResizeStart,
        onResizeEnd,
      },
    })
    const handle = wrapper.find('button')
    handle.element.setPointerCapture = vi.fn()
    handle.element.releasePointerCapture = vi.fn()

    await dispatchPointer(handle.element, 'pointerdown', {
      pointerId: 1,
      clientX: 20,
      clientY: 20,
    })
    await dispatchPointer(handle.element, 'pointermove', {
      pointerId: 1,
      clientX: 50,
      clientY: 35,
    })
    await dispatchPointer(handle.element, 'pointerup', {
      pointerId: 1,
      clientX: 50,
      clientY: 35,
    })

    expect(wrapper.classes()).not.toContain('is-dragging')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      {
        width: 230,
        height: 135,
      },
    ])
    expect(onResizeStart).toHaveBeenCalledOnce()
    expect(onResizeEnd).toHaveBeenCalledOnce()
  })

  it('禁用后不响应调整', async () => {
    const wrapper = mount(Resizable, {
      props: {
        modelValue: 200,
        disabled: true,
      },
    })

    await wrapper.find('button').trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
