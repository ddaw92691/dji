<template>
  <div class="commission-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="订单号 / 代理" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.agentId" placeholder="代理ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option v-for="o in COMMISSION_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="开始"
          end-placeholder="结束"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="orderNo" label="订单号" min-width="160" show-overflow-tooltip />
      <el-table-column prop="agentName" label="代理" min-width="120" show-overflow-tooltip />
      <el-table-column prop="amount" label="金额" width="120" align="right">
        <template #default="{ row }">${{ (row.amount ?? 0).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="比例" width="80" align="center">
        <template #default="{ row }">{{ ((row.rate ?? 0) * 100).toFixed(0) }}%</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(COMMISSION_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(COMMISSION_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="结算时间" width="180">
        <template #default="{ row }">{{ row.settledAt || '-' }}</template>
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
import { financeApi, type IAdminCommission } from '@/api/finance'
import { COMMISSION_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'

defineOptions({ name: 'FinanceCommissionView' })

const loading = ref(false)
const tableData = ref<IAdminCommission[]>([])
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  agentId: '',
  status: '',
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
    if (searchForm.agentId) params.agentId = searchForm.agentId
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await financeApi.getCommissions(params)
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
.commission-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
