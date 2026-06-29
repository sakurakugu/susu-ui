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
        <SuIcon :size="28" color="var(--su-color-warning)">
          <svg viewBox="0 0 24 24">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path
              d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </SuIcon>
        <SuIcon :size="32" color="var(--su-color-error)">
          <svg viewBox="0 0 24 24">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </SuIcon>
      </div>

      <SuSpace wrap>
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
        <SuButton variant="outline">
          审核通过
          <template #suffix>
            <SuIcon color="var(--su-color-success)">
              <svg viewBox="0 0 24 24">
                <path d="M5 12l4 4L19 6" />
              </svg>
            </SuIcon>
          </template>
        </SuButton>
      </SuSpace>
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
