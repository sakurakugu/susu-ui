# Susu UI

Susu UI 是一个开发早期的个人前端组件库，当前优先支持 Vue 3。项目使用 monorepo 管理，把设计令牌、Web 主题能力和 Vue 组件实现拆成独立包。

## 当前状态

项目还在起步阶段，当前已具备：

- Vue 3 组件包 `@susu-ui/vue`
- Web 主题包 `@susu-ui/theme`
- 共享设计令牌包 `@susu-ui/tokens`
- 明暗模式切换
- 多主题色预设和动态色相调整
- 本地 playground
- 初始文档

## 包结构

```txt
susu-ui/
  packages/
    tokens/       设计令牌和主题基础配置。
    theme/        Web CSS 变量和运行时主题 API。
    vue/          Vue 3 组件库。
  playground/     本地调试示例。
  docs/           使用文档和技术设计文档。
```

## 开发

安装依赖：

```bash
pnpm install
```

启动 playground：

```bash
pnpm dev
```

类型检查和构建检查：

```bash
pnpm typecheck
```

构建组件库：

```bash
pnpm build
```

## 使用文档

- [文档入口](./docs/README.md)
- [快速开始](./docs/指南/快速开始.md)
- [主题](./docs/指南/主题.md)
- [Affix 固钉](./docs/组件/Affix%20固钉.md)
- [Alert 提示](./docs/组件/Alert%20提示.md)
- [Anchor 锚点](./docs/组件/Anchor%20锚点.md)
- [Autocomplete 自动完成](./docs/组件/Autocomplete%20自动完成.md)
- [Avatar 头像](./docs/组件/Avatar%20头像.md)
- [BackTop 回到顶部](./docs/组件/BackTop%20回到顶部.md)
- [Badge 角标](./docs/组件/Badge%20角标.md)
- [Breadcrumb 面包屑](./docs/组件/Breadcrumb%20面包屑.md)
- [Button 按钮](./docs/组件/Button%20按钮.md)
- [Calendar 日历](./docs/组件/Calendar%20日历.md)
- [Card 卡片](./docs/组件/Card%20卡片.md)
- [Cascader 级联选择](./docs/组件/Cascader%20级联选择.md)
- [Checkbox 复选框](./docs/组件/Checkbox%20复选框.md)
- [ColorPicker 颜色选择器](./docs/组件/ColorPicker%20颜色选择器.md)
- [DateRangePicker 日期范围选择器](./docs/组件/DateRangePicker%20日期范围选择器.md)
- [DatePicker 日期选择器](./docs/组件/DatePicker%20日期选择器.md)
- [Descriptions 描述列表](./docs/组件/Descriptions%20描述列表.md)
- [Dialog 对话框](./docs/组件/Dialog%20对话框.md)
- [Divider 分割线](./docs/组件/Divider%20分割线.md)
- [Drawer 抽屉](./docs/组件/Drawer%20抽屉.md)
- [Dropdown 下拉菜单](./docs/组件/Dropdown%20下拉菜单.md)
- [Empty 空状态](./docs/组件/Empty%20空状态.md)
- [Form 表单](./docs/组件/Form%20表单.md)
- [Icon 图标](./docs/组件/Icon%20图标.md)
- [Image 图片](./docs/组件/Image%20图片.md)
- [Input 输入框](./docs/组件/Input%20输入框.md)
- [InputNumber 数字输入框](./docs/组件/InputNumber%20数字输入框.md)
- [Menu 菜单](./docs/组件/Menu%20菜单.md)
- [Mention 提及](./docs/组件/Mention%20提及.md)
- [Message 消息](./docs/组件/Message%20消息.md)
- [Notification 通知](./docs/组件/Notification%20通知.md)
- [Pagination 分页](./docs/组件/Pagination%20分页.md)
- [Popover 气泡卡片](./docs/组件/Popover%20气泡卡片.md)
- [Progress 进度条](./docs/组件/Progress%20进度条.md)
- [QRCode 二维码](./docs/组件/QRCode%20二维码.md)
- [Radio 单选框](./docs/组件/Radio%20单选框.md)
- [Rate 评分](./docs/组件/Rate%20评分.md)
- [Result 结果](./docs/组件/Result%20结果.md)
- [Select 选择器](./docs/组件/Select%20选择器.md)
- [Segmented 分段控制器](./docs/组件/Segmented%20分段控制器.md)
- [Skeleton 骨架屏](./docs/组件/Skeleton%20骨架屏.md)
- [Slider 滑块](./docs/组件/Slider%20滑块.md)
- [Space 间距](./docs/组件/Space%20间距.md)
- [Statistic 统计数值](./docs/组件/Statistic%20统计数值.md)
- [Switch 开关](./docs/组件/Switch%20开关.md)
- [Tabs 标签页](./docs/组件/Tabs%20标签页.md)
- [Table 表格](./docs/组件/Table%20表格.md)
- [Tag 标签](./docs/组件/Tag%20标签.md)
- [Text 文本](./docs/组件/Text%20文本.md)
- [TimeRangePicker 时间范围选择器](./docs/组件/TimeRangePicker%20时间范围选择器.md)
- [Tooltip 文字提示](./docs/组件/Tooltip%20文字提示.md)
- [Tour 漫游式引导](./docs/组件/Tour%20漫游式引导.md)
- [Tree 树](./docs/组件/Tree%20树.md)
- [VirtualList 虚拟列表](./docs/组件/VirtualList%20虚拟列表.md)
- [Watermark 水印](./docs/组件/Watermark%20水印.md)

## 技术设计

内部架构、主题模型和后续规划见 [技术文档](./docs/技术文档.md)。
