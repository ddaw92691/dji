<template>
  <div class="reconciliation-page">
    <div class="page-toolbar">
      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item label="商家ID">
          <el-input v-model="query.merchantId" placeholder="商家ID" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="query.type" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="(label, val) in TYPE_LABELS" :key="val" :label="label" :value="val" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="createdAt" label="时间" min-width="170" />
      <el-table-column prop="merchantId" label="商家ID" width="100" />
      <el-table-column prop="shopName" label="店铺" min-width="140" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="typeTag(row.type)">{{ typeText(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="130">
        <template #default="{ row }">
          <span :style="{ color: isIncrease(row.type) ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
            {{ isIncrease(row.type) ? '+' : '-' }}{{ row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="balanceBefore" label="变动前" width="110" />
      <el-table-column prop="balanceAfter" label="变动后" width="110" />
      <el-table-column label="关联" min-width="140">
        <template #default="{ row }">
          <span v-if="row.refType">{{ row.refType }}<span v-if="row.refId"> #{{ row.refId }}</span></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160" />
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { financeApi } from '@/api/finance'

defineOptions({ name: 'ReconciliationView' })

const TYPE_LABELS: Record<string, string> = {
  ADJUST_INCREASE: '后台增加',
  ADJUST_DECREASE: '后台扣减',
  RECHARGE: '充值入账',
  ORDER_PAY: '支付货款',
  SETTLE: '货款结算',
  WITHDRAW: '提现',
}
const INCREASE_TYPES = ['ADJUST_INCREASE', 'RECHARGE', 'SETTLE']

const typeText = (t: string) => TYPE_LABELS[t] || t || '-'
const isIncrease = (t: string) => INCREASE_TYPES.includes(t)
type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'
const typeTag = (t: string): TagType => (isIncrease(t) ? 'success' : 'warning')

const query = reactive<{ merchantId: string; type: string; dateRange: [string, string] | null }>({
  merchantId: '',
  type: '',
  dateRange: null,
})
const tableData = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, pageSize: pageSize.value }
    if (query.merchantId) params.merchantId = query.merchantId
    if (query.type) params.type = query.type
    if (query.dateRange) {
      params.startDate = query.dateRange[0]
      params.endDate = query.dateRange[1]
    }
    const { data: res } = await financeApi.getFundLogs(params)
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  page.value = 1
  fetchData()
}

const resetQuery = () => {
  query.merchantId = ''
  query.type = ''
  query.dateRange = null
  page.value = 1
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.reconciliation-page {
  padding: 16px;
}
.page-toolbar {
  margin-bottom: 16px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
