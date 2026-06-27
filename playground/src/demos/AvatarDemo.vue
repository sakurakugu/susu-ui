<script setup lang="ts">
const avatarImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231677ff'/%3E%3Ccircle cx='40' cy='30' r='14' fill='white' fill-opacity='.92'/%3E%3Cpath d='M17 70c4-16 15-24 23-24s19 8 23 24' fill='white' fill-opacity='.92'/%3E%3C/svg%3E"
</script>

<template>
  <section id="avatar" class="panel">
    <h2>头像</h2>
    <div class="avatar-demo">
      <SuAvatar :src="avatarImage" alt="苏苏头像" />
      <SuAvatar text="苏" />
      <SuAvatar text="青" shape="square" background="#0f766e" />
      <SuAvatar size="small" text="小" />
      <SuAvatar size="large" text="大" />
      <SuAvatar :size="48" text="满" background="#f97316" />
      <SuAvatar background="#7c3aed">
        <template #icon>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path d="M20 21a8 8 0 0 0-16 0" />
              <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            </svg>
          </SuIcon>
        </template>
      </SuAvatar>
    </div>
  </section>
</template>
<style scoped>
.avatar-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}
</style>
