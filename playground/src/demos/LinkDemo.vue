<template>
  <section id="link" class="panel">
    <h2>链接</h2>
    <div class="link-demo">
      <SuSpace wrap>
        <SuLink href="/docs">查看项目文档</SuLink>
        <SuLink href="/orders/weekly" type="default">本周订单</SuLink>
        <SuLink href="https://example.com" target="_blank">打开外部系统</SuLink>
      </SuSpace>

      <SuSpace wrap>
        <SuLink href="/status" type="success">同步成功记录</SuLink>
        <SuLink href="/risk" type="warning">查看风险提示</SuLink>
        <SuLink href="/exceptions" type="error">处理异常单据</SuLink>
        <SuLink href="/help" type="info">帮助中心</SuLink>
      </SuSpace>

      <SuSpace wrap>
        <SuLink href="/reports" underline="always">始终显示下划线</SuLink>
        <SuLink href="/reports/monthly" underline="hover">
          悬停显示下划线
        </SuLink>
        <SuLink href="/reports/archive" underline="never">
          不显示下划线
        </SuLink>
      </SuSpace>

      <SuSpace wrap>
        <SuLink href="/files/invoice">
          <template #prefix>↗</template>
          查看发票附件
        </SuLink>
        <SuLink href="/billing" disabled>账单归档中</SuLink>
      </SuSpace>
    </div>
  </section>
</template>

<style scoped>
.link-demo {
  display: grid;
  max-width: 760px;
  gap: 14px;
}
</style>
