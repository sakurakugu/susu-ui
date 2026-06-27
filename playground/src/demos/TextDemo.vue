<template>
  <section id="text" class="panel">
    <h2>文本</h2>
    <div class="text-demo">
      <SuText tag="p" size="large" weight="semibold">
        组件库里的正文、状态文案和辅助说明可以统一使用 Text。
      </SuText>
      <SuSpace wrap>
        <SuText>默认文本</SuText>
        <SuText type="primary">主要文本</SuText>
        <SuText type="success">成功文本</SuText>
        <SuText type="warning">警告文本</SuText>
        <SuText type="error">错误文本</SuText>
        <SuText type="info">信息文本</SuText>
        <SuText type="muted">辅助文本</SuText>
      </SuSpace>
      <SuSpace wrap>
        <SuText size="small">小号文本</SuText>
        <SuText>默认尺寸</SuText>
        <SuText size="large">大号文本</SuText>
        <SuText weight="bold">加粗文本</SuText>
        <SuText underline>下划线</SuText>
        <SuText delete>删除线</SuText>
        <SuText italic>斜体</SuText>
      </SuSpace>
      <SuText class="text-demo-ellipsis" block ellipsis>
        这是一段很长的单行文本，用于展示超出容器宽度后自动省略的效果。
      </SuText>
      <SuText tag="p" type="muted" block :line-clamp="2">
        多行省略适合用于卡片摘要、列表说明或表格内的长文本展示。组件会限制显示行数，避免内容撑开布局。
      </SuText>
    </div>
  </section>
</template>
<style scoped>
.text-demo {
  display: grid;
  max-width: 720px;
  gap: 14px;
}

.text-demo-ellipsis {
  max-width: 360px;
}
</style>
