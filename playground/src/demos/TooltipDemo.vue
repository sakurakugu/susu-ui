<template>
  <section id="tooltip" class="panel">
    <h2>文字提示</h2>
    <div class="tooltip-demo">
      <SuTooltip content="保存当前页面配置">
        <SuButton type="primary">悬停提示</SuButton>
      </SuTooltip>
      <SuTooltip content="提示会显示在下方" placement="bottom">
        <SuButton>下方提示</SuButton>
      </SuTooltip>
      <SuTooltip trigger="click" content="点击页面空白处关闭">
        <SuButton variant="outline">点击提示</SuButton>
      </SuTooltip>
      <SuTooltip placement="right">
        <SuButton variant="text">插槽内容</SuButton>
        <template #content>
          <span>支持通过插槽放入更灵活的说明内容</span>
        </template>
      </SuTooltip>
      <SuTooltip content="禁用时不会展示" disabled>
        <SuButton disabled>禁用提示</SuButton>
      </SuTooltip>
    </div>
  </section>
</template>
<style scoped>
.tooltip-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
