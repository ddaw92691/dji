<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="list"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="fetchList"
    >
      <template #status="{ row }">
        <BaseTag
          :type="getStatusColor(row.status)"
          :text="row.status"
        />
      </template>
      <template #amount="{ row }">
        ${{ (row.amount ?? 0).toFixed(2) }}
      </template>
      <template #rejectReason="{ row }">
        <span v-if="row.rejectReason" class="reject-text">{{ row.rejectReason }}</span>
        <span v-else>-</span>
      </template>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { financeApi, type IWithdrawalRecord } from '@/api/finance'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'FinanceWithdrawalRecordView' })

const basePageRef = useTemplateRef('basePageRef')

const list = ref<IWithdrawalRecord[]>([])
const total = ref(0)
const loading = ref(false)

const WITHDRAWAL_STATUS_OPTIONS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
  }
  return map[status] || 'info'
}

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: 'Status',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: 'Select status',
      options: WITHDRAWAL_STATUS_OPTIONS,
      clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'amount', label: 'Amount', width: 120 },
  { prop: 'status', label: 'Status', width: 110 },
  { prop: 'bankName', label: 'Bank Name', minWidth: 140 },
  { prop: 'bankAccount', label: 'Bank Account', minWidth: 160 },
  { prop: 'accountName', label: 'Account Name', minWidth: 120 },
  { prop: 'rejectReason', label: 'Reject Reason', minWidth: 180 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'reviewedAt', label: 'Reviewed', minWidth: 160 },
])

const fetchList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
) => {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page, pageSize }
    if (queryForm.status) params.status = queryForm.status
    const { data: res } = await financeApi.getWithdrawals(params)
    if (res.code !== 200) return
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  basePageRef.value?.refreshCurrentPage()
})
</script>

<style scoped>
.reject-text {
  color: var(--el-color-danger);
}
</style>
