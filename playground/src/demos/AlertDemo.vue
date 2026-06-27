<template>
  <section id="alert" class="panel">
    <h2>提示</h2>
    <div class="alert-demo">
      <SuAlert title="普通提示">
        这里展示页面内的上下文信息，适合放在表单或内容区顶部。
      </SuAlert>
      <SuAlert type="success" title="保存成功" closable>
        配置已经更新，关闭按钮会触发组件内部隐藏。
      </SuAlert>
      <SuAlert
        type="warning"
        title="需要确认"
        description="当前操作会影响后续发布流程，请确认信息完整。"
      />
      <SuAlert type="error" :show-icon="false">
        这是一条不展示图标的错误提示。
      </SuAlert>
    </div>
  </section>
</template>
<style scoped>
.alert-demo {
  display: grid;
  max-width: 760px;
  gap: 12px;
}
</style>
