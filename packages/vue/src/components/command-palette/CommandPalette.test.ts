import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import CommandPalette, { type CommandPaletteOption } from './CommandPalette.vue'

const options: CommandPaletteOption[] = [
  {
    label: '打开订单中心',
    value: 'orders',
    description: '查看订单、售后和发货进度',
    group: '导航',
    shortcut: ['G', 'O'],
  },
  {
    label: '新建客户',
    value: 'customer-create',
    description: '录入客户基础资料',
    group: '操作',
    shortcut: 'N',
  },
  {
    label: '删除项目',
    value: 'project-delete',
    group: '危险操作',
    disabled: true,
  },
]

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

describe('CommandPalette', () => {
  it('渲染标题、搜索框和命令列表', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        title: '工作台命令',
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    expect(document.body.querySelector('.su-command-palette')).toBeTruthy()
    expect(
      document.body.querySelector('.su-command-palette__title')?.textContent,
    ).toBe('工作台命令')
    expect(
      document.body.querySelector<HTMLInputElement>(
        '.su-command-palette__input',
      )?.placeholder,
    ).toBe('搜索命令、页面或操作')
    expect(
      document.body.querySelectorAll('.su-command-palette__option'),
    ).toHaveLength(3)
    expect(
      document.body.querySelectorAll('.su-command-palette__group-title')[0]
        ?.textContent,
    ).toBe('导航')

    wrapper.unmount()
  })

  it('打开时聚焦输入框并锁定页面滚动', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    expect(document.activeElement).toBe(
      document.body.querySelector('.su-command-palette__input'),
    )
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('输入时更新查询词并过滤命令', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const input = document.body.querySelector<HTMLInputElement>(
      '.su-command-palette__input',
    )

    input!.value = '客户'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:query')?.[0]).toEqual(['客户'])
    expect(
      document.body.querySelectorAll('.su-command-palette__option'),
    ).toHaveLength(1)
    expect(
      document.body.querySelector('.su-command-palette__option')?.textContent,
    ).toContain('新建客户')

    wrapper.unmount()
  })

  it('支持键盘选择并跳过禁用命令', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
    expect(wrapper.emitted('close')?.[0]).toEqual(['select'])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('支持点击命令和自定义命令插槽', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        options,
        onSelect,
      },
      slots: {
        option: ({ option }: { option: CommandPaletteOption }) =>
          h('span', { class: 'custom-command' }, option.label),
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    expect(document.body.querySelector('.custom-command')?.textContent).toBe(
      '打开订单中心',
    )

    document.body
      .querySelectorAll<HTMLButtonElement>('.su-command-palette__option')[1]
      ?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('select')?.[0]).toEqual([options[1]])
    expect(onSelect).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('支持关闭按钮、遮罩和 ESC 关闭', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body
      .querySelector<HTMLButtonElement>('.su-command-palette__close')
      ?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')?.[0]).toEqual(['close'])

    await wrapper.setProps({ modelValue: false })
    await wrapper.setProps({ modelValue: true })
    document.body
      .querySelector<HTMLElement>('.su-command-palette-overlay')
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
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        closeOnClickMask: false,
        closeOnPressEscape: false,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.body
      .querySelector<HTMLElement>('.su-command-palette-overlay')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  it('支持空状态、宽度、层级和关闭时清空查询', async () => {
    const wrapper = mount(CommandPalette, {
      props: {
        modelValue: true,
        query: '无结果',
        options,
        emptyText: '没有找到可用命令',
        width: 720,
        zIndex: 3600,
        clearQueryOnClose: true,
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()

    expect(
      document.body.querySelector('.su-command-palette__empty')?.textContent,
    ).toBe('没有找到可用命令')
    expect(
      document.body.querySelector<HTMLElement>('.su-command-palette')?.style
        .width,
    ).toBe('720px')
    expect(
      document.body.querySelector<HTMLElement>('.su-command-palette-overlay')
        ?.style.zIndex,
    ).toBe('3600')

    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('update:query')?.[0]).toEqual([''])

    wrapper.unmount()
  })
})
