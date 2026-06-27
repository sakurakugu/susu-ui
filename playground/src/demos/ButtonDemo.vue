<template>
  <section id="button" class="panel">
    <h2>按钮</h2>
    <div class="row">
      <SuButton>默认按钮</SuButton>
      <SuButton type="primary">主要按钮</SuButton>
      <SuButton disabled>禁用按钮</SuButton>
    </div>
    <div class="row">
      <SuButton variant="outline">描边按钮</SuButton>
      <SuButton variant="ghost">幽灵按钮</SuButton>
      <SuButton variant="text">文本按钮</SuButton>
      <SuButton type="primary" loading>加载中</SuButton>
    </div>
    <div class="row">
      <SuButton size="small">小按钮</SuButton>
      <SuButton>默认尺寸</SuButton>
      <SuButton size="large">大按钮</SuButton>
      <SuButton native-type="submit">
        <template #prefix>
          <SuIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </SuIcon>
        </template>
        新建
      </SuButton>
    </div>
    <div class="row">
      <SuButtonGroup type="primary" variant="outline" size="small">
        <SuButton>左</SuButton>
        <SuButton>中</SuButton>
        <SuButton>右</SuButton>
      </SuButtonGroup>
      <SuButtonGroup>
        <SuButton>日</SuButton>
        <SuButton type="primary">周</SuButton>
        <SuButton>月</SuButton>
      </SuButtonGroup>
      <SuButtonGroup direction="vertical" variant="outline">
        <SuButton>上</SuButton>
        <SuButton type="primary">中</SuButton>
        <SuButton>下</SuButton>
      </SuButtonGroup>
    </div>
  </section>
</template>
<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
