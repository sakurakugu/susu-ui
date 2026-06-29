<script setup lang="ts">
import { ref } from 'vue'

const paginationPage = ref(3)
const paginationSize = ref(10)
</script>

<template>
  <section id="pagination" class="panel">
    <h2>分页</h2>
    <div class="pagination-demo">
      <SuPagination v-model="paginationPage" :total="80" />
      <SuPagination
        v-model="paginationPage"
        v-model:page-size="paginationSize"
        :total="236"
        show-total
        show-size-changer
        show-quick-jumper
      />
      <SuPagination v-model="paginationPage" :total="236" size="small" simple />
      <SuPagination
        v-model="paginationPage"
        :total="236"
        size="large"
        prev-text="上一批"
        next-text="下一批"
      />
      <SuPagination v-model="paginationPage" :total="236" :pager-count="5" />
      <SuPagination :total="6" hide-on-single-page />
      <SuPagination :total="80" disabled />
    </div>
  </section>
</template>
<style scoped>
.pagination-demo {
  display: grid;
  max-width: 920px;
  gap: 16px;
}
</style>
