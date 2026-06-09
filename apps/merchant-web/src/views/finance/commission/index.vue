<template>
  <div>
    <div v-if="role !== 'AGENT'" class="notice">
      <el-result icon="info" title="Commission Records" sub-title="Commission records are only available for agent accounts" />
    </div>

    <BasePage
      v-else
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
      <template #rate="{ row }">
        {{ (row.rate * 100).toFixed(0) }}%
      </template>
      <template #amount="{ row }">
        ${{ (row.amount ?? 0).toFixed(2) }}
      </template>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { financeApi, type ICommissionRecord } from '@/api/finance'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'FinanceCommissionView' })

const basePageRef = useTemplateRef('basePageRef')
const userStore = useUserStore()
const role = computed(() => userStore.userInfo?.role || '')

const list = ref<ICommissionRecord[]>([])
const total = ref(0)
const loading = ref(false)

const COMMISSION_STATUS_OPTIONS = [
  { label: 'Frozen', value: 'FROZEN' },
  { label: 'Settled', value: 'SETTLED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    FROZEN: 'warning',
    SETTLED: 'success',
    CANCELLED: 'danger',
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
      options: COMMISSION_STATUS_OPTIONS,
      clearable: true,
    },
  },
  {
    label: 'Date Range',
    prop: 'dateRange',
    type: 'elDatePicker',
    attrs: {
      type: 'daterange',
      rangeSeparator: 'To',
      startPlaceholder: 'Start date',
      endPlaceholder: 'End date',
      valueFormat: 'YYYY-MM-DD',
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'orderNo', label: 'Order No', minWidth: 160 },
  { prop: 'amount', label: 'Amount', width: 120 },
  { prop: 'rate', label: 'Rate', width: 80 },
  { prop: 'status', label: 'Status', width: 110 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'settledAt', label: 'Settled', minWidth: 160 },
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
    if (queryForm.dateRange) {
      const range = queryForm.dateRange as string[]
      if (range[0]) params.startDate = range[0]
      if (range[1]) params.endDate = range[1]
    }
    const { data: res } = await financeApi.getCommissions(params)
    if (res.code !== 200) return
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (role.value === 'AGENT') {
    basePageRef.value?.refreshCurrentPage()
  }
})
</script>

<style scoped>
.notice {
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}
</style>
