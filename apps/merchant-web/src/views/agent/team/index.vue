<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="[]"
      :table-data="tableData"
      :columns="columns"
      :total="total"
      :show-export="false"
      :show-print="false"
      :table-loading="loading"
      @refresh="fetchData"
    >
      <template #tableOperationLeft>
        <h2>My Team</h2>
      </template>
    </BasePage>

    <div v-if="isMerchant" class="empty-notice">
      <el-alert title="Invite features are only available for agent accounts." type="info" show-icon :closable="false" />
    </div>

    <div v-else-if="!loading && tableData.length === 0" class="empty-notice">
      <el-alert title="Multi-level agent is reserved for next phase." type="warning" show-icon :closable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { agentApi } from '@/api/agentInvite'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'AgentTeamView' })

const basePageRef = useTemplateRef('basePageRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const isMerchant = ref(false)

const fetchData = async (_queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await agentApi.getTeam({ page, pageSize })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
      isMerchant.value = false
    }
  } catch {
    tableData.value = []
    total.value = 0
    isMerchant.value = false
  } finally { loading.value = false }
}

const columns = ref([
  { type: 'index', label: '#', width: 55 },
  { prop: 'email', label: 'Email', minWidth: 200 },
  { prop: 'nickname', label: 'Nickname', minWidth: 140 },
  { prop: 'level', label: 'Level', width: 80 },
  { prop: 'commission', label: 'Commission', width: 120 },
  { prop: 'createdAt', label: 'Registered', minWidth: 180 },
])
</script>

<style scoped>
.empty-notice { padding: 20px 0; }
</style>
