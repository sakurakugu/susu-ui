<template>
  <section id="icon" class="panel">
    <h2>图标</h2>

    <div class="icon-demo">
      <div class="icon-demo__row">
        <SuIcon>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </SuIcon>
        <SuIcon :size="20" color="var(--su-color-primary)">
          <svg viewBox="0 0 24 24">
            <path d="M5 12l4 4L19 6" />
          </svg>
        </SuIcon>
        <SuIcon :size="24" color="var(--su-color-success)">
          <svg viewBox="0 0 24 24">
            <path d="M12 8v4l3 3" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </SuIcon>
      </div>

      <SuButton type="primary">
        <template #prefix>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </SuIcon>
        </template>
        新建项目
      </SuButton>
    </div>
  </section>
</template>

<style scoped>
.icon-demo {
  display: grid;
  gap: 16px;
}

.icon-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--su-color-text);
}

.icon-demo svg {
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
