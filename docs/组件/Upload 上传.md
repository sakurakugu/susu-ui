# Upload 上传

上传组件用于选择文件、展示文件列表，并把文件提交到服务端。

## 基础用法

未设置 `action` 或 `request` 时，组件只维护本地文件列表并把文件状态标记为完成：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { UploadFile } from '@susu-ui/vue'

const files = ref<UploadFile[]>([])
</script>

<template>
  <SuUpload v-model="files">
    <SuButton type="primary">选择文件</SuButton>
  </SuUpload>
</template>
```

## 自动上传

通过 `action` 配置上传地址，组件会使用 `FormData` 发起 `POST` 请求：

```vue
<template>
  <SuUpload action="/api/upload" name="file" />
</template>
```

## 自定义请求

通过 `request` 接管上传过程，适合对接业务请求库、签名直传或模拟上传：

```vue
<script setup lang="ts">
import type { UploadRequestOptions } from '@susu-ui/vue'

function upload(options: UploadRequestOptions) {
  options.onProgress(50)
  options.onSuccess({ url: 'https://example.com/file.png' })
}
</script>

<template>
  <SuUpload :request="upload" />
</template>
```

## 拖拽上传

通过 `drag` 开启拖拽区域：

```vue
<template>
  <SuUpload drag multiple accept="image/*" />
</template>
```

## 图片列表

通过 `list-type="picture"` 展示图片缩略图：

```vue
<template>
  <SuUpload list-type="picture" accept="image/*" multiple />
</template>
```

## 文件限制

通过 `limit` 限制文件数量，通过 `before-upload` 在加入列表前校验文件：

```vue
<script setup lang="ts">
function beforeUpload(file: File) {
  return file.size <= 2 * 1024 * 1024
}
</script>

<template>
  <SuUpload
    accept=".png,.jpg,.jpeg,.pdf"
    :limit="3"
    :before-upload="beforeUpload"
    @exceed="() => console.log('文件数量超出限制')"
  />
</template>
```

## 手动上传

关闭 `auto-upload` 后，文件会先停留在待上传状态，可通过组件引用调用 `submit`：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const uploadRef = ref()
</script>

<template>
  <SuUpload ref="uploadRef" :auto-upload="false" action="/api/upload" />
  <SuButton type="primary" @click="uploadRef?.submit()">开始上传</SuButton>
</template>
```

## 按需导入

```vue
<script setup lang="ts">
import { SuUpload } from '@susu-ui/vue'
</script>
```

## Props

| 参数               | 说明                     | 类型                                                         | 默认值     |
| ------------------ | ------------------------ | ------------------------------------------------------------ | ---------- |
| `v-model`          | 文件列表                 | `UploadFile[]`                                               | `[]`       |
| `action`           | 上传地址                 | `string`                                                     | -          |
| `name`             | 文件字段名               | `string`                                                     | `'file'`   |
| `accept`           | 接受的文件类型           | `string`                                                     | -          |
| `multiple`         | 是否支持多选             | `boolean`                                                    | `false`    |
| `disabled`         | 是否禁用                 | `boolean`                                                    | `false`    |
| `drag`             | 是否开启拖拽上传         | `boolean`                                                    | `false`    |
| `auto-upload`      | 选择后是否自动上传       | `boolean`                                                    | `true`     |
| `show-file-list`   | 是否展示文件列表         | `boolean`                                                    | `true`     |
| `list-type`        | 文件列表类型             | `'text' \| 'picture'`                                        | `'text'`   |
| `size`             | 组件尺寸                 | `'small' \| 'medium' \| 'large'`                             | `'medium'` |
| `limit`            | 最大文件数量             | `number`                                                     | -          |
| `headers`          | 上传请求头               | `Record<string, string>`                                     | -          |
| `data`             | 附加表单字段             | `Record<string, string \| Blob>`                             | -          |
| `with-credentials` | 是否携带跨域凭证         | `boolean`                                                    | `false`    |
| `before-upload`    | 文件加入列表前的校验函数 | `(file: File, files: File[]) => boolean \| Promise<boolean>` | -          |
| `request`          | 自定义上传请求           | `(options: UploadRequestOptions) => void \| Promise<void>`   | -          |

## 事件

| 名称       | 说明               |
| ---------- | ------------------ |
| `change`   | 文件列表变化时触发 |
| `exceed`   | 文件数量超出时触发 |
| `remove`   | 移除文件时触发     |
| `progress` | 上传进度变化时触发 |
| `success`  | 上传成功时触发     |
| `error`    | 上传失败时触发     |

## 插槽

| 名称      | 说明                 |
| --------- | -------------------- |
| `default` | 上传触发器内容       |
| `tip`     | 上传提示内容         |
| `file`    | 自定义文件列表项内容 |

## 方法

| 名称     | 说明               |
| -------- | ------------------ |
| `open`   | 打开文件选择窗口   |
| `submit` | 上传所有待上传文件 |
| `clear`  | 清空文件列表       |

## 类型

```ts
type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'
type UploadListType = 'text' | 'picture'

interface UploadFile {
  uid: string
  name: string
  size: number
  type: string
  status: UploadStatus
  percentage: number
  raw?: File
  url?: string
  response?: unknown
  error?: unknown
}
```
