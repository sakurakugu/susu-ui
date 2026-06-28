# QRCode 二维码

二维码用于把链接、订单号、登录令牌、付款凭证等短文本编码成可扫码识别的图形，支持尺寸、留白、纠错等级、颜色、状态遮罩和中心图标。

## 基础用法

通过 `value` 传入需要编码的内容：

```vue
<template>
  <SuQRCode value="https://susu-ui.example.com/docs/qrcode" />
</template>
```

## 自定义样式

通过 `size`、`margin`、`color`、`background-color` 和 `radius` 控制二维码外观：

```vue
<template>
  <SuQRCode
    value="INV-20260628-009"
    :size="220"
    :margin="3"
    color="#111827"
    background-color="#ffffff"
    :radius="12"
  />
</template>
```

## 中心图标

需要展示品牌标识时使用 `icon` 插槽，并建议把纠错等级设置为 `H`：

```vue
<template>
  <SuQRCode value="https://susu-ui.example.com/member/lin-chen" level="H">
    <template #icon>
      <img src="/brand-mark.svg" alt="" />
    </template>
  </SuQRCode>
</template>
```

## 状态遮罩

`status` 支持 `active`、`expired` 和 `loading`。过期状态下默认展示刷新按钮，点击触发 `refresh` 事件：

```vue
<template>
  <SuQRCode
    value="PAY-20260628-0930-128600"
    status="expired"
    status-text="刷新付款码"
    @refresh="loadPaymentCode"
  />
</template>
```

## 空内容提示

`value` 为空时会展示空状态，也可以通过 `status` 插槽自定义提示：

```vue
<template>
  <SuQRCode>
    <template #status>请选择门店后生成二维码</template>
  </SuQRCode>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuQRCode } from '@susu-ui/vue'
</script>

<template>
  <SuQRCode value="https://susu-ui.example.com" />
</template>
```

## Props

| 参数              | 说明             | 类型                                 | 默认值                        |
| ----------------- | ---------------- | ------------------------------------ | ----------------------------- |
| `value`           | 需要编码的内容   | `string`                             | `''`                          |
| `size`            | 二维码尺寸       | `number \| string`                   | `160`                         |
| `margin`          | 二维码静区模块数 | `number`                             | `2`                           |
| `level`           | 纠错等级         | `'L' \| 'M' \| 'Q' \| 'H'`           | `'M'`                         |
| `color`           | 深色模块颜色     | `string`                             | `var(--su-color-text)`        |
| `backgroundColor` | 背景颜色         | `string`                             | `var(--su-color-bg-elevated)` |
| `radius`          | 外层圆角         | `number \| string`                   | `var(--su-radius-md)`         |
| `status`          | 当前状态         | `'active' \| 'expired' \| 'loading'` | `'active'`                    |
| `statusText`      | 状态遮罩文案     | `string`                             | `undefined`                   |
| `iconSize`        | 中心图标容器尺寸 | `number \| string`                   | `36`                          |
| `ariaLabel`       | 无障碍标签       | `string`                             | `'二维码'`                    |

## 事件

| 名称      | 说明                       | 参数 |
| --------- | -------------------------- | ---- |
| `refresh` | 点击过期状态刷新按钮时触发 | `()` |

## 插槽

| 名称     | 说明                               |
| -------- | ---------------------------------- |
| `icon`   | 二维码中心图标                     |
| `status` | 空内容、过期或加载状态的自定义内容 |

## 类型

```ts
type QRCodeStatus = 'active' | 'expired' | 'loading'
type QRCodeLevel = 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'
```
