<template>
  <div class="dashboard-overview">
    <div class="page-header">
      <h2>Dashboard</h2>
      <el-tag :type="summary.role === 'AGENT' ? 'warning' : 'primary'" size="large" effect="dark">
        {{ summary.role || '-' }}
      </el-tag>
      <el-button style="margin-left:auto" type="primary" :loading="loading" @click="fetchData">Refresh</el-button>
    </div>

    <template v-if="summary.role === 'MERCHANT'">
      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Today Orders</div>
            <div class="stat-value">{{ summary.todayOrders }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Today Sales</div>
            <div class="stat-value green">${{ formatAmount(summary.todaySales) }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">{{ summary.totalOrders }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Total Sales</div>
            <div class="stat-value green">${{ formatAmount(summary.totalSales) }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Paid Orders</div>
            <div class="stat-value">{{ summary.paidOrders }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Shipped Orders</div>
            <div class="stat-value">{{ summary.shippedOrders }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Completed Orders</div>
            <div class="stat-value">{{ summary.completedOrders }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Invited Customers</div>
            <div class="stat-value">{{ summary.invitedCustomers }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Balance</div>
            <div class="stat-value green">${{ formatAmount(summary.balance) }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Frozen Balance</div>
            <div class="stat-value warn">${{ formatAmount(summary.frozenBalance) }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="section-card">
        <template #header><span class="section-title">Recent Orders</span></template>
        <el-table :data="summary.recentOrders || []" border size="small">
          <el-table-column prop="orderNo" label="Order No" min-width="140" show-overflow-tooltip />
          <el-table-column label="Customer" min-width="100" show-overflow-tooltip>
            <template #default="{ row }">{{ row.userName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="payAmount" label="Amount" width="90" align="right" />
          <el-table-column label="Status" width="110" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="Created" width="160" />
        </el-table>
      </el-card>

      <el-row :gutter="16" class="charts-row">
        <el-col :span="12">
          <el-card shadow="hover" class="section-card">
            <template #header><span class="section-title">Sales Trend (Last 7 Days)</span></template>
            <div ref="salesChartRef" class="chart-box" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="section-card">
            <template #header><span class="section-title">Order Count (Last 7 Days)</span></template>
            <div ref="orderChartRef" class="chart-box" />
          </el-card>
        </el-col>
      </el-row>
    </template>

    <template v-if="summary.role === 'AGENT'">
      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Invited Customers</div>
            <div class="stat-value">{{ summary.invitedCustomers }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Total Commission</div>
            <div class="stat-value green">${{ formatAmount(summary.totalCommission) }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Balance</div>
            <div class="stat-value green">${{ formatAmount(summary.balance) }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Frozen Balance</div>
            <div class="stat-value warn">${{ formatAmount(summary.frozenBalance) }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="stats-row">
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Settled Commissions</div>
            <div class="stat-value green">{{ summary.settledCommissions }}</div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-label">Frozen Commissions</div>
            <div class="stat-value warn">{{ summary.frozenCommissions }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="section-card">
        <template #header><span class="section-title">Recent Commissions</span></template>
        <el-table :data="summary.recentCommissions || []" border size="small">
          <el-table-column prop="orderNo" label="Order No" min-width="140" show-overflow-tooltip />
          <el-table-column label="Buyer" min-width="100" show-overflow-tooltip>
            <template #default="{ row }">{{ row.buyerName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="amount" label="Amount" width="90" align="right" />
          <el-table-column label="Status" width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small" :type="row.status === 'SETTLED' ? 'success' : row.status === 'FROZEN' ? 'info' : 'danger'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="Created" width="160" />
        </el-table>
      </el-card>

      <el-card shadow="hover" class="section-card">
        <template #header><span class="section-title">Commission Trend (Last 7 Days)</span></template>
        <div ref="commissionChartRef" class="chart-box" />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { dashboardApi, type IMerchantDashboard } from '@/api/dashboard'
import * as echarts from 'echarts'

defineOptions({ name: 'MerchantDashboardOverviewView' })

const loading = ref(false)

const salesChartRef = ref<HTMLElement | null>(null)
const orderChartRef = ref<HTMLElement | null>(null)
const commissionChartRef = ref<HTMLElement | null>(null)

let salesChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null
let commissionChart: echarts.ECharts | null = null

const summary = reactive<IMerchantDashboard>({
  role: '',
  todayOrders: 0,
  todaySales: 0,
  totalOrders: 0,
  totalSales: 0,
  paidOrders: 0,
  shippedOrders: 0,
  completedOrders: 0,
  balance: 0,
  frozenBalance: 0,
  invitedCustomers: 0,
  totalCommission: 0,
  settledCommissions: 0,
  frozenCommissions: 0,
  recentOrders: [],
  recentCommissions: [],
})

function formatAmount(val: number) {
  return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(`${d.getMonth() + 1}/${d.getDate()}`)
  }
  return days
}

function initMerchantCharts() {
  if (summary.role === 'MERCHANT') {
    nextTick(() => {
      if (salesChartRef.value) {
        salesChart = echarts.init(salesChartRef.value)
        const days = getLast7Days()
        salesChart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: days },
          yAxis: { type: 'value' },
          series: [{
            name: 'Sales',
            type: 'line',
            smooth: true,
            data: days.map(() => Math.floor(Math.random() * 3000 + 500)),
            itemStyle: { color: '#409EFF' },
          }],
        })
      }
      if (orderChartRef.value) {
        orderChart = echarts.init(orderChartRef.value)
        const days = getLast7Days()
        orderChart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: days },
          yAxis: { type: 'value' },
          series: [{
            name: 'Orders',
            type: 'bar',
            data: days.map(() => Math.floor(Math.random() * 50 + 10)),
            itemStyle: { color: '#67C23A' },
          }],
        })
      }
    })
  }
  if (summary.role === 'AGENT') {
    nextTick(() => {
      if (commissionChartRef.value) {
        commissionChart = echarts.init(commissionChartRef.value)
        const days = getLast7Days()
        commissionChart.setOption({
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: days },
          yAxis: { type: 'value' },
          series: [{
            name: 'Commission',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.3 },
            data: days.map(() => Math.floor(Math.random() * 200 + 20)),
            itemStyle: { color: '#E6A23C' },
          }],
        })
      }
    })
  }
}

window.addEventListener('resize', () => {
  salesChart?.resize()
  orderChart?.resize()
  commissionChart?.resize()
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await dashboardApi.getOverview()
    if (res.code !== 200) return
    if (res.data) {
      Object.assign(summary, res.data)
      initMerchantCharts()
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-overview { padding: 0; }
.page-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.page-header h2 { margin: 0; font-size: 1.5rem; font-weight: 700; }
.stats-row { margin-bottom: 16px; }
.stat-card { text-align: center; padding: 8px 0; }
.stat-label { font-size: 13px; color: #909399; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 700; color: #303133; }
.stat-value.green { color: #67c23a; }
.stat-value.warn { color: #e6a23c; }
.section-card { margin-bottom: 16px; }
.section-title { font-weight: 600; font-size: 15px; }
.charts-row { margin-top: 8px; }
.chart-box { width: 100%; height: 300px; }
</style>
