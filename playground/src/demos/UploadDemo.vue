<script setup lang="ts">
import type { UploadFile, UploadRequestOptions } from '@susu-ui/vue'
import { ref } from 'vue'

const uploadFiles = ref<UploadFile[]>([])
const pictureUploadFiles = ref<UploadFile[]>([])

function mockUploadRequest(options: UploadRequestOptions) {
  let percentage = 0
  const timer = window.setInterval(() => {
    percentage += 25
    options.onProgress(Math.min(percentage, 100))

    if (percentage >= 100) {
      window.clearInterval(timer)
      options.onSuccess({ url: URL.createObjectURL(options.file) })
    }
  }, 180)
}

function limitUploadSize(file: File) {
  return file.size <= 2 * 1024 * 1024
}
</script>

<template>
  <section id="upload" class="panel">
    <h2>上传</h2>
    <div class="upload-demo">
      <SuUpload
        v-model="uploadFiles"
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        :limit="3"
        :request="mockUploadRequest"
        :before-upload="limitUploadSize"
      >
        <SuButton type="primary">选择文件</SuButton>
        <template #tip>支持 PNG、JPG、PDF，单个文件不超过 2MB</template>
      </SuUpload>

      <SuUpload
        v-model="pictureUploadFiles"
        drag
        multiple
        list-type="picture"
        accept="image/*"
        :limit="4"
        :request="mockUploadRequest"
      />

      <SuUpload disabled>
        <SuButton disabled>禁用上传</SuButton>
      </SuUpload>
    </div>
  </section>
</template>
<style scoped>
.upload-demo {
  display: grid;
  max-width: 760px;
  gap: 18px;
}
</style>
