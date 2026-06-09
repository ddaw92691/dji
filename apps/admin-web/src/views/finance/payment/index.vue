<template>
  <div class="payment-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Payment No / Transaction No" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option v-for="o in PAYMENT_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.method" placeholder="Method" clearable @change="handleSearch">
          <el-option v-for="o in PAYMENT_METHOD_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start"
          end-placeholder="End"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="paymentNo" label="Payment No" min-width="180" show-overflow-tooltip />
      <el-table-column prop="transactionNo" label="Transaction No" min-width="180" show-overflow-tooltip />
      <el-table-column prop="amount" label="Amount" width="120" align="right">
        <template #default="{ row }">${{ (row.amount ?? 0).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="Method" width="120" align="center">
        <template #default="{ row }">
          {{ getLabelByValue(PAYMENT_METHOD_OPTIONS, row.method) }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(PAYMENT_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(PAYMENT_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Paid At" width="180">
        <template #default="{ row }">{{ row.paidAt || '-' }}</template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { financeApi, type IAdminPayment } from '@/api/finance'
import { PAYMENT_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'

defineOptions({ name: 'FinancePaymentView' })

const loading = ref(false)
const tableData = ref<IAdminPayment[]>([])
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  status: '',
  method: '',
  dateRange: null as [string, string] | null,
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    }
    if (searchForm.keyword) params.keyword = searchForm.keyword
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.method) params.method = searchForm.method
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await financeApi.getPayments(params)
    if (res.code !== 200) return
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.payment-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
