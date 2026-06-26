import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Table from './Table.vue'
import TableColumn from './TableColumn.vue'
import type { TableColumn as TableColumnType } from './context'

const data = [
  { id: 1, name: '苏苏', role: '设计师', status: '在线' },
  { id: 2, name: '小满', role: '工程师', status: '离线' },
]

describe('Table', () => {
  it('通过 columns 渲染基础表格', () => {
    const columns: TableColumnType[] = [
      { prop: 'name', label: '姓名' },
      { prop: 'role', label: '角色' },
    ]
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        rowKey: 'id',
      },
    })

    expect(wrapper.classes()).toContain('su-table')
    expect(wrapper.findAll('th')).toHaveLength(2)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('苏苏')
    expect(wrapper.text()).toContain('工程师')
  })

  it('支持 TableColumn 声明列和自定义单元格', async () => {
    const wrapper = mount(Table, {
      props: {
        data,
      },
      slots: {
        default: [
          h(TableColumn, { prop: 'name', label: '姓名' }),
          h(
            TableColumn,
            { prop: 'status', label: '状态' },
            {
              default: ({ value }: { value: unknown }) =>
                h('strong', `状态：${value}`),
              header: () => h('span', '当前状态'),
            },
          ),
        ],
      },
    })
    await nextTick()

    expect(wrapper.findAll('th')).toHaveLength(2)
    expect(wrapper.findAll('td')).toHaveLength(4)
    expect(wrapper.text()).toContain('当前状态')
    expect(wrapper.text()).toContain('状态：在线')
  })

  it('支持格式化和多级字段', () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ user: { name: '苏苏' }, score: 96 }],
        columns: [
          { prop: 'user.name', label: '姓名' },
          {
            prop: 'score',
            label: '分数',
            formatter: (_row, _column, value) => `${value} 分`,
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('苏苏')
    expect(wrapper.text()).toContain('96 分')
  })

  it('支持空状态和加载状态插槽', () => {
    const wrapper = mount(Table, {
      props: {
        loading: true,
        columns: [{ prop: 'name', label: '姓名' }],
      },
      slots: {
        empty: '没有成员',
        loading: '同步中',
      },
    })

    expect(wrapper.find('.su-table__empty').text()).toBe('没有成员')
    expect(wrapper.find('.su-table__loading').text()).toBe('同步中')
  })

  it('根据尺寸、边框和斑马纹渲染样式', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ prop: 'name', label: '姓名' }],
        size: 'large',
        border: true,
        stripe: true,
        height: 120,
      },
    })

    expect(wrapper.classes()).toContain('su-table--large')
    expect(wrapper.classes()).toContain('su-table--border')
    expect(wrapper.classes()).toContain('su-table--stripe')
    expect(wrapper.classes()).toContain('is-scrollable')
    expect(wrapper.find('.su-table__wrapper').attributes('style')).toContain(
      'height: 120px',
    )
  })

  it('触发行和单元格点击事件', async () => {
    const onRowClick = vi.fn()
    const onCellClick = vi.fn()
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [{ prop: 'name', label: '姓名' }],
        onRowClick,
        onCellClick,
      },
    })

    await wrapper.find('td').trigger('click')

    expect(wrapper.emitted('cellClick')?.[0][0]).toEqual(data[0])
    expect(wrapper.emitted('cellClick')?.[0][2]).toBe(0)
    expect(wrapper.emitted('rowClick')?.[0][0]).toEqual(data[0])
    expect(onCellClick).toHaveBeenCalledOnce()
    expect(onRowClick).toHaveBeenCalledOnce()
  })
})
