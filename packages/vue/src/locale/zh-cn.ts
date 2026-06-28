import type { SusuLocale } from './types'

export const zhCN: SusuLocale = {
  name: 'zh-cn',
  common: {
    confirm: '确定',
    cancel: '取消',
    close: '关闭',
    clear: '清空',
    loading: '加载中',
  },
  empty: {
    description: '暂无数据',
  },
  dialog: {
    close: '关闭弹窗',
  },
  drawer: {
    close: '关闭抽屉',
  },
  datePicker: {
    placeholder: '请选择日期',
    ariaLabel: '日期选择',
    clear: '清空日期',
    openPanel: '打开日期面板',
    panel: '日期面板',
    previousMonth: '上一月',
    nextMonth: '下一月',
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    monthTitle: (year, month) => `${year} 年 ${month} 月`,
  },
  pagination: {
    ariaLabel: '分页',
    prev: '上一页',
    next: '下一页',
    total: (total) => `共 ${total} 条`,
    page: (page) => `第 ${page} 页`,
    more: '更多页码',
    pageSize: '每页条数',
    pageSizeOption: (pageSize) => `${pageSize} 条/页`,
    jumpTo: '跳至',
    jumpPage: '跳转页码',
    pageUnit: '页',
  },
  list: {
    loading: '加载中...',
  },
  table: {
    loading: '加载中',
  },
  popconfirm: {
    confirm: '确定',
    cancel: '取消',
  },
  upload: {
    selectFile: '选择文件',
    dragFile: '点击或拖拽文件到此处上传',
    success: '完成',
    error: '失败',
    ready: '待上传',
    remove: '移除文件',
    uploadError: (status) => `上传失败：${status}`,
    requestError: '上传请求失败',
  },
  autocomplete: {
    empty: '暂无匹配结果',
    clear: '清空输入',
  },
  cascader: {
    placeholder: '请选择',
    empty: '暂无数据',
    ariaLabel: '级联选择',
    clear: '清空选择',
  },
  tree: {
    empty: '暂无数据',
  },
  treeSelect: {
    placeholder: '请选择',
    empty: '暂无数据',
    filterPlaceholder: '请输入搜索内容',
    ariaLabel: '树选择',
    clear: '清空选择',
  },
  virtualList: {
    empty: '暂无数据',
  },
  anchor: {
    empty: '暂无锚点',
  },
  menu: {
    empty: '暂无菜单',
  },
  select: {
    clear: '清空选择',
  },
  virtualizedSelect: {
    placeholder: '请选择',
    empty: '暂无数据',
    ariaLabel: '虚拟选择器',
    clear: '清空选择',
  },
  transfer: {
    titles: ['源列表', '目标列表'],
    filterPlaceholder: '请输入搜索内容',
    empty: '暂无数据',
    moveLeft: '移到左侧',
    moveRight: '移到右侧',
    filterSource: '筛选源列表',
    filterTarget: '筛选目标列表',
  },
}

export default zhCN
