<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../../config-provider'
import type { FormSize } from '../form/context'

defineOptions({
  name: 'SuUpload',
})

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'
export type UploadListType = 'text' | 'picture'
export type UploadSize = FormSize

export interface UploadFile {
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

export interface UploadRequestOptions {
  file: File
  action?: string
  headers?: Record<string, string>
  data?: Record<string, string | Blob>
  name: string
  withCredentials?: boolean
  onProgress: (percentage: number) => void
  onSuccess: (response: unknown) => void
  onError: (error: unknown) => void
}

const model = defineModel<UploadFile[]>({
  default: () => [],
})

const props = withDefaults(
  defineProps<{
    action?: string
    name?: string
    accept?: string
    multiple?: boolean
    disabled?: boolean
    drag?: boolean
    autoUpload?: boolean
    showFileList?: boolean
    listType?: UploadListType
    size?: UploadSize
    limit?: number
    headers?: Record<string, string>
    data?: Record<string, string | Blob>
    withCredentials?: boolean
    beforeUpload?: (file: File, files: File[]) => boolean | Promise<boolean>
    request?: (options: UploadRequestOptions) => void | Promise<void>
  }>(),
  {
    action: undefined,
    name: 'file',
    accept: undefined,
    multiple: false,
    disabled: false,
    drag: false,
    autoUpload: true,
    showFileList: true,
    listType: 'text',
    size: 'medium',
    limit: undefined,
    headers: undefined,
    data: undefined,
    withCredentials: false,
    beforeUpload: undefined,
    request: undefined,
  },
)

const emit = defineEmits<{
  change: [files: UploadFile[]]
  exceed: [files: File[], uploadFiles: UploadFile[]]
  remove: [file: UploadFile, files: UploadFile[]]
  progress: [file: UploadFile, percentage: number]
  success: [file: UploadFile, response: unknown]
  error: [file: UploadFile, error: unknown]
}>()

const inputRef = ref<HTMLInputElement>()
const locale = useLocale()
const isDragging = ref(false)

const canSelectMore = computed(
  () => props.limit === undefined || model.value.length < props.limit,
)
const triggerText = computed(() =>
  props.drag ? locale.value.upload.dragFile : locale.value.upload.selectFile,
)

function createUploadFile(file: File): UploadFile {
  return {
    uid: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'ready',
    percentage: 0,
    raw: file,
    url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
}

function updateFiles(files: UploadFile[]) {
  model.value = files
  emit('change', files)
}

function updateFile(uid: string, patch: Partial<UploadFile>) {
  updateFiles(
    model.value.map((file) =>
      file.uid === uid
        ? {
            ...file,
            ...patch,
          }
        : file,
    ),
  )
}

function revokeFileUrl(file: UploadFile) {
  if (file.raw && file.url) {
    URL.revokeObjectURL(file.url)
  }
}

function openDialog() {
  if (props.disabled || !canSelectMore.value) {
    return
  }

  inputRef.value?.click()
}

async function handleFiles(files: File[]) {
  if (props.disabled || files.length === 0) {
    return
  }

  const restCount =
    props.limit === undefined ? files.length : props.limit - model.value.length

  if (restCount <= 0 || files.length > restCount) {
    emit('exceed', files, model.value)
    return
  }

  const uploadFiles: UploadFile[] = []

  for (const file of files) {
    if (props.beforeUpload) {
      const allowed = await props.beforeUpload(file, files)

      if (!allowed) {
        continue
      }
    }

    uploadFiles.push(createUploadFile(file))
  }

  if (uploadFiles.length === 0) {
    return
  }

  updateFiles([...model.value, ...uploadFiles])

  if (props.autoUpload) {
    uploadFiles.forEach(upload)
  }
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  void handleFiles(Array.from(target.files ?? []))
  target.value = ''
}

function handleDragEnter() {
  if (!props.disabled) {
    isDragging.value = true
  }
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  isDragging.value = false

  if (!props.drag || props.disabled) {
    return
  }

  void handleFiles(Array.from(event.dataTransfer?.files ?? []))
}

function removeFile(file: UploadFile) {
  revokeFileUrl(file)
  const files = model.value.filter((item) => item.uid !== file.uid)
  updateFiles(files)
  emit('remove', file, files)
}

function submit() {
  model.value
    .filter((file) => file.status === 'ready' && file.raw)
    .forEach(upload)
}

function clear() {
  model.value.forEach(revokeFileUrl)
  updateFiles([])
}

async function upload(file: UploadFile) {
  if (!file.raw || file.status === 'uploading') {
    return
  }

  updateFile(file.uid, {
    status: 'uploading',
    percentage: 0,
  })

  const options: UploadRequestOptions = {
    file: file.raw,
    action: props.action,
    headers: props.headers,
    data: props.data,
    name: props.name,
    withCredentials: props.withCredentials,
    onProgress: (percentage) => {
      updateFile(file.uid, { percentage })
      emit('progress', file, percentage)
    },
    onSuccess: (response) => {
      updateFile(file.uid, {
        status: 'success',
        percentage: 100,
        response,
      })
      emit('success', file, response)
    },
    onError: (error) => {
      updateFile(file.uid, {
        status: 'error',
        error,
      })
      emit('error', file, error)
    },
  }

  try {
    if (props.request) {
      await props.request(options)
    } else if (props.action) {
      await defaultRequest(options)
    } else {
      options.onSuccess(undefined)
    }
  } catch (error) {
    options.onError(error)
  }
}

function defaultRequest(options: UploadRequestOptions) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    Object.entries(options.data ?? {}).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append(options.name, options.file)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        options.onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.onSuccess(parseResponse(xhr.responseText))
        resolve()
      } else {
        reject(new Error(locale.value.upload.uploadError(xhr.status)))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error(locale.value.upload.requestError))
    })

    xhr.open('POST', options.action ?? '')
    xhr.withCredentials = options.withCredentials ?? false

    Object.entries(options.headers ?? {}).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })

    xhr.send(formData)
  })
}

function parseResponse(responseText: string) {
  try {
    return JSON.parse(responseText) as unknown
  } catch {
    return responseText
  }
}

defineExpose({
  input: inputRef,
  submit,
  clear,
  open: openDialog,
})
</script>

<template>
  <div
    class="su-upload"
    :class="[
      `su-upload--${size}`,
      `su-upload--${listType}`,
      {
        'is-disabled': disabled,
        'is-drag': drag,
        'is-dragging': isDragging,
        'is-limit': !canSelectMore,
      },
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      ref="inputRef"
      class="su-upload__input"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="handleInputChange"
    />

    <div
      class="su-upload__trigger"
      role="button"
      :tabindex="disabled || !canSelectMore ? -1 : 0"
      :aria-disabled="disabled || !canSelectMore"
      @click="openDialog"
      @keydown.enter.prevent="openDialog"
      @keydown.space.prevent="openDialog"
    >
      <slot>
        <span class="su-upload__icon" aria-hidden="true">+</span>
        <span class="su-upload__text">
          {{ triggerText }}
        </span>
      </slot>
    </div>

    <div v-if="$slots.tip" class="su-upload__tip">
      <slot name="tip" />
    </div>

    <ul v-if="showFileList && model.length" class="su-upload__list">
      <li
        v-for="file in model"
        :key="file.uid"
        class="su-upload__item"
        :class="`is-${file.status}`"
      >
        <img
          v-if="listType === 'picture' && file.url"
          class="su-upload__thumb"
          :src="file.url"
          alt=""
        />
        <div class="su-upload__meta">
          <slot name="file" :file="file">
            <span class="su-upload__name">{{ file.name }}</span>
            <span class="su-upload__status">
              {{
                file.status === 'uploading'
                  ? `${file.percentage}%`
                  : file.status === 'success'
                    ? locale.upload.success
                    : file.status === 'error'
                      ? locale.upload.error
                      : locale.upload.ready
              }}
            </span>
          </slot>
          <div
            v-if="file.status === 'uploading'"
            class="su-upload__progress"
            :style="{ '--su-upload-progress': `${file.percentage}%` }"
          >
            <span class="su-upload__bar" />
          </div>
        </div>
        <button
          class="su-upload__remove"
          type="button"
          :disabled="disabled"
          :aria-label="locale.upload.remove"
          @click="removeFile(file)"
        >
          ×
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.su-upload {
  display: inline-flex;
  flex-direction: column;
  gap: var(--su-space-sm);
  width: 100%;
  color: var(--su-color-text);
  font-size: var(--su-font-size-md);
  line-height: var(--su-font-line-height);
}

.su-upload--small {
  font-size: var(--su-font-size-sm);
}

.su-upload--large {
  font-size: var(--su-font-size-lg);
}

.su-upload__input {
  display: none;
}

.su-upload__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--su-space-sm);
  min-height: 32px;
  width: fit-content;
  max-width: 100%;
  padding: 0 var(--su-space-lg);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  color: var(--su-color-text);
  background: var(--su-color-bg-elevated);
  box-shadow: var(--su-shadow-sm);
  cursor: pointer;
  transition:
    color 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.su-upload--small .su-upload__trigger {
  min-height: 24px;
  padding: 0 var(--su-space-sm);
}

.su-upload--large .su-upload__trigger {
  min-height: 44px;
  padding: 0 var(--su-space-xl);
}

.su-upload__trigger:hover,
.su-upload__trigger:focus-visible {
  border-color: var(--su-color-primary-hover);
  color: var(--su-color-primary-hover);
  outline: 0;
}

.su-upload.is-drag .su-upload__trigger {
  flex-direction: column;
  width: 100%;
  min-height: 144px;
  border-style: dashed;
  background: var(--su-color-bg-soft);
}

.su-upload.is-dragging .su-upload__trigger {
  border-color: var(--su-color-primary);
  color: var(--su-color-primary);
  background: color-mix(
    in srgb,
    var(--su-color-primary) 8%,
    var(--su-color-bg-soft)
  );
}

.su-upload.is-disabled,
.su-upload.is-limit {
  opacity: 0.55;
}

.su-upload.is-disabled .su-upload__trigger,
.su-upload.is-limit .su-upload__trigger {
  cursor: not-allowed;
}

.su-upload__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 1.5em;
  height: 1.5em;
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-soft);
  line-height: 1;
}

.su-upload__text {
  min-width: 0;
  word-break: break-word;
}

.su-upload__tip {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-upload__list {
  display: flex;
  flex-direction: column;
  gap: var(--su-space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.su-upload__item {
  display: flex;
  align-items: center;
  gap: var(--su-space-sm);
  min-width: 0;
  padding: var(--su-space-sm);
  border: 1px solid var(--su-color-border);
  border-radius: var(--su-radius-md);
  background: var(--su-color-bg-elevated);
}

.su-upload__item.is-success {
  border-color: color-mix(in srgb, #16a34a 36%, var(--su-color-border));
}

.su-upload__item.is-error {
  border-color: color-mix(in srgb, #dc2626 52%, var(--su-color-border));
}

.su-upload__thumb {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: var(--su-radius-sm);
  object-fit: cover;
  background: var(--su-color-bg-soft);
}

.su-upload__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: var(--su-space-xs);
}

.su-upload__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.su-upload__status {
  color: var(--su-color-text-muted);
  font-size: var(--su-font-size-sm);
}

.su-upload__progress {
  overflow: hidden;
  width: 100%;
  height: 4px;
  border-radius: var(--su-radius-round);
  background: var(--su-color-bg-soft);
}

.su-upload__bar {
  display: block;
  width: var(--su-upload-progress);
  height: 100%;
  border-radius: inherit;
  background: var(--su-color-primary);
  transition: width 0.16s ease;
}

.su-upload__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: var(--su-radius-round);
  color: var(--su-color-text-muted);
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: pointer;
}

.su-upload__remove:hover:not(:disabled) {
  color: #dc2626;
  background: var(--su-color-bg-soft);
}

.su-upload__remove:disabled {
  cursor: not-allowed;
}
</style>
