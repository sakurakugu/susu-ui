<script setup lang="ts">
const tableData = [
  {
    id: 1,
    name: '苏苏',
    role: '设计师',
    status: '在线',
    score: 96,
    team: { name: '体验组' },
  },
  {
    id: 2,
    name: '小满',
    role: '前端工程师',
    status: '忙碌',
    score: 88,
    team: { name: '平台组' },
  },
  {
    id: 3,
    name: '青禾',
    role: '产品经理',
    status: '离线',
    score: 76,
    team: { name: '增长组' },
  },
]

const tableColumns = [
  { prop: 'name', label: '成员', width: 120 },
  { prop: 'team.name', label: '团队', minWidth: 120 },
  { prop: 'role', label: '角色', minWidth: 140 },
  {
    prop: 'score',
    label: '评分',
    align: 'right' as const,
    formatter: (_row: unknown, _column: unknown, value: unknown) => `${value} 分`,
  },
]
</script>

<template>
  <section id="table" class="panel">
    <h2>表格</h2>
    <div class="table-demo">
      <SuTable :data="tableData" :columns="tableColumns" row-key="id" stripe border />

      <SuTable :data="tableData" row-key="id" size="small" max-height="180px">
        <SuTableColumn prop="name" label="成员" width="120" />
        <SuTableColumn prop="role" label="角色" min-width="140" />
        <SuTableColumn prop="status" label="状态" align="center">
          <template #default="{ value }">
            <SuTag size="small" :type="value === '在线' ? 'success' : 'info'">
              {{ value }}
            </SuTag>
          </template>
        </SuTableColumn>
        <SuTableColumn prop="score" label="评分" align="right">
          <template #default="{ value }"> {{ value }} 分 </template>
        </SuTableColumn>
      </SuTable>

      <SuTable :columns="tableColumns" empty-text="暂无成员" />
    </div>
  </section>
</template>
<style scoped>
.table-demo {
  display: grid;
  max-width: 920px;
  gap: 16px;
}
</style>
