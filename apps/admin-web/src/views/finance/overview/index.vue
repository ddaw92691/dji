<template>
  <div class="finance-overview">
    <div class="page-header">
      <h2>财务概览</h2>
      <el-button type="primary" :loading="loading" @click="fetchData">刷新</el-button>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">总销售额</div>
          <div class="stat-value">${{ formatAmount(summary.totalSales) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">今日销售</div>
          <div class="stat-value">${{ formatAmount(summary.todaySales) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已完成订单</div>
          <div class="stat-value">{{ summary.completedOrderCount }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已支付订单</div>
          <div class="stat-value">{{ summary.paidOrderCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card balance-card">
          <div class="stat-label">商户余额</div>
          <div class="stat-value green">${{ formatAmount(summary.totalMerchantBalance) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card balance-card">
          <div class="stat-label">商户冻结</div>
          <div class="stat-value warn">${{ formatAmount(summary.totalMerchantFrozenBalance) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card balance-card">
          <div class="stat-label">代理余额</div>
          <div class="stat-value green">${{ formatAmount(summary.totalAgentBalance) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card balance-card">
          <div class="stat-label">代理冻结</div>
          <div class="stat-value warn">${{ formatAmount(summary.totalAgentFrozenBalance) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">总佣金</div>
          <div class="stat-value">${{ formatAmount(summary.totalCommission) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已提现总额</div>
          <div class="stat-value">${{ formatAmount(summary.totalWithdrawn) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card pending-card">
          <div class="stat-label">待处理提现</div>
          <div class="stat-value">${{ formatAmount(summary.pendingWithdrawalAmount) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card pending-card">
          <div class="stat-label">待处理数量</div>
          <div class="stat-value">{{ summary.pendingWithdrawalCount }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { financeApi, type IAdminFinanceSummary } from '@/api/finance'

defineOptions({ name: 'FinanceOverviewView' })

const loading = ref(false)

const summary = reactive<IAdminFinanceSummary>({
  totalSales: 0, todaySales: 0,
  totalMerchantBalance: 0, totalMerchantFrozenBalance: 0,
  totalAgentBalance: 0, totalAgentFrozenBalance: 0,
  totalCommission: 0, totalWithdrawn: 0,
  pendingWithdrawalAmount: 0, pendingWithdrawalCount: 0,
  paidOrderCount: 0, completedOrderCount: 0,
})

function formatAmount(val: number) {
  return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await financeApi.getOverview()
    if (res.code !== 200) return
    if (res.data) Object.assign(summary, res.data)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.finance-overview { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; }
.stats-row { margin-bottom: 16px; }
.stat-card { text-align: center; padding: 8px 0; }
.stat-label { font-size: 13px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; }
.stat-value.green { color: #67c23a; }
.stat-value.warn { color: #e6a23c; }
.pending-card .stat-value { color: #f56c6c; }
</style>
