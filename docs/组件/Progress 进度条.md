# Progress 进度条

用于展示任务、上传、表单步骤等操作的完成进度。

## 基础用法

```vue
<SuProgress :percentage="36" />
```

## 状态

通过 `status` 展示成功、警告或错误状态。

```vue
<SuProgress :percentage="100" status="success" />
<SuProgress :percentage="64" status="warning" />
<SuProgress :percentage="28" status="error" />
```

## 文字位置

设置 `text-inside` 后，文字会显示在线形进度条内部。

```vue
<SuProgress :percentage="52" text-inside :stroke-width="18" />
```

## 环形进度

设置 `type="circle"` 展示环形进度。

```vue
<SuProgress type="circle" :percentage="72" />
```

## 格式化

通过 `format` 自定义展示文本，也可以使用默认插槽覆盖文字。

```vue
<SuProgress :percentage="45" :format="(value) => `已完成 ${value}%`" />
<SuProgress :percentage="80">处理中</SuProgress>
```

## 不确定进度

设置 `indeterminate` 展示无法确认具体百分比的加载进度。

```vue
<SuProgress indeterminate :show-text="false" />
```

## API

### 属性

| 属性            | 说明               | 类型                                            | 默认值      |
| --------------- | ------------------ | ----------------------------------------------- | ----------- |
| `percentage`    | 当前百分比         | `number`                                        | `0`         |
| `type`          | 进度条类型         | `'line' \| 'circle'`                            | `'line'`    |
| `status`        | 状态               | `'normal' \| 'success' \| 'warning' \| 'error'` | `'normal'`  |
| `size`          | 尺寸               | `'small' \| 'medium' \| 'large'`                | `'medium'`  |
| `stroke-width`  | 进度条线宽         | `number`                                        | `8`         |
| `width`         | 环形进度宽高       | `number`                                        | `120`       |
| `show-text`     | 是否显示文字       | `boolean`                                       | `true`      |
| `text-inside`   | 文字是否显示在线内 | `boolean`                                       | `false`     |
| `format`        | 格式化文字         | `(percentage: number) => string`                | `undefined` |
| `indeterminate` | 是否展示不确定进度 | `boolean`                                       | `false`     |
| `aria-label`    | 无障碍标签         | `string`                                        | `'进度'`    |

### 插槽

| 插槽名    | 说明               |
| --------- | ------------------ |
| `default` | 自定义进度文字内容 |
