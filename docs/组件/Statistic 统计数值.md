# Statistic 统计数值

用于展示关键指标、趋势变化、金额、比例等简短统计信息。

## 基础用法

```vue
<SuStatistic title="总访问量" :value="12800" />
```

## 前缀和后缀

通过 `prefix` 和 `suffix` 添加单位、货币符号或补充文字。

```vue
<SuStatistic title="成交金额" :value="568920.5" prefix="¥" suffix="元" />
```

## 精度和分隔符

通过 `precision` 控制小数位，`group-separator` 和 `decimal-separator` 控制数字分隔符。

```vue
<SuStatistic
  title="成交金额"
  :value="568920.5"
  :precision="2"
  group-separator=","
  decimal-separator="."
/>
```

## 趋势和状态

通过 `trend` 展示上升、下降或稳定趋势，通过 `status` 设置强调色。

```vue
<SuStatistic title="转化率" value="23.6%" trend="up" status="success" />
<SuStatistic title="异常工单" :value="18" suffix="件" trend="down" status="error" />
```

## 格式化

通过 `format` 自定义数值展示内容。

```vue
<SuStatistic
  title="转化率"
  :value="0.236"
  :format="(value) => `${(Number(value) * 100).toFixed(1)}%`"
/>
```

## 加载状态

设置 `loading` 后会展示骨架占位。

```vue
<SuStatistic title="成交金额" loading />
```

## 自定义插槽

可通过插槽自定义标题、数值、前缀、后缀和描述。

```vue
<SuStatistic title="活跃项目" :value="42">
  <template #prefix>约</template>
  <template #value="{ formattedValue }">
    <strong>{{ formattedValue }}</strong>
  </template>
  <template #suffix>个</template>
  <template #description>按当前筛选条件统计</template>
</SuStatistic>
```

## API

### 属性

| 属性                | 说明             | 类型                                                                    | 默认值      |
| ------------------- | ---------------- | ----------------------------------------------------------------------- | ----------- |
| `title`             | 标题             | `string`                                                                | `undefined` |
| `value`             | 数值             | `string \| number`                                                      | `0`         |
| `precision`         | 小数精度         | `number`                                                                | `undefined` |
| `group-separator`   | 千分位分隔符     | `string`                                                                | `','`       |
| `decimal-separator` | 小数分隔符       | `string`                                                                | `'.'`       |
| `prefix`            | 前缀             | `string`                                                                | `undefined` |
| `suffix`            | 后缀             | `string`                                                                | `undefined` |
| `description`       | 描述             | `string`                                                                | `undefined` |
| `status`            | 状态             | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` |
| `trend`             | 趋势             | `'up' \| 'down' \| 'stable'`                                            | `undefined` |
| `size`              | 尺寸             | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  |
| `align`             | 对齐方式         | `'left' \| 'center' \| 'right'`                                         | `'left'`    |
| `loading`           | 是否展示加载状态 | `boolean`                                                               | `false`     |
| `value-style`       | 数值样式         | `StyleValue`                                                            | `undefined` |
| `format`            | 格式化函数       | `(value: string \| number) => string \| number`                         | `undefined` |

### 插槽

| 插槽名        | 说明           | 插槽参数                                      |
| ------------- | -------------- | --------------------------------------------- |
| `title`       | 自定义标题     | -                                             |
| `value`       | 自定义数值     | `{ value: string \| number, formattedValue }` |
| `prefix`      | 自定义前缀     | -                                             |
| `suffix`      | 自定义后缀     | -                                             |
| `description` | 自定义描述内容 | -                                             |
