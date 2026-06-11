<template>
  <div class="dashboard-overview">
    <div class="page-header">
      <h2>控制台</h2>
      <el-button type="primary" :loading="loading" @click="fetchData">刷新</el-button>
    </div>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">用户总数</div>
          <div class="stat-value">{{ summary.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">客户</div>
          <div class="stat-value">{{ summary.totalCustomers }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">商户</div>
          <div class="stat-value">{{ summary.totalMerchants }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">今日订单</div>
          <div class="stat-value">{{ summary.todayOrders }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">商品</div>
          <div class="stat-value">{{ summary.totalProducts }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card pending-card">
          <div class="stat-label">待审商品</div>
          <div class="stat-value">{{ summary.pendingProducts }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">订单总数</div>
          <div class="stat-value">{{ summary.totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已支付订单</div>
          <div class="stat-value">{{ summary.paidOrders }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已完成订单</div>
          <div class="stat-value">{{ summary.completedOrders }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card warn-card">
          <div class="stat-label">退款申请</div>
          <div class="stat-value">{{ summary.refundRequests || summary.pendingRefunds }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">总销售额</div>
          <div class="stat-value green">${{ formatAmount(summary.totalSales) }}</div>
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
          <div class="stat-label">总佣金</div>
          <div class="stat-value">${{ formatAmount(summary.totalCommission) }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card warn-card">
          <div class="stat-label">待处理提现</div>
          <div class="stat-value">{{ summary.pendingWithdrawals }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="tables-row">
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">最近订单</span></template>
          <el-table :data="summary.recentOrders || []" border size="small">
            <el-table-column prop="orderNo" label="订单号" min-width="140" show-overflow-tooltip />
            <el-table-column label="客户" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">{{ row.userName || '-' }}</template>
            </el-table-column>
            <el-table-column prop="payAmount" label="金额" width="90" align="right" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">最近退款</span></template>
          <el-table :data="summary.recentRefunds || []" border size="small">
            <el-table-column prop="orderNo" label="订单号" min-width="140" show-overflow-tooltip />
            <el-table-column label="客户" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">{{ row.userName || '-' }}</template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="金额" width="90" align="right" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag
                  size="small"
                  :type="
                    row.refundStatus === 'REQUESTED'
                      ? 'warning'
                      : row.refundStatus === 'APPROVED'
                        ? 'success'
                        : 'danger'
                  "
                >
                  {{ row.refundStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">近 7 日销售额</span></template>
          <div ref="salesChartRef" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">近 7 日订单数</span></template>
          <div ref="orderChartRef" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">订单状态分布</span></template>
          <div ref="orderStatusChartRef" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">用户角色分布</span></template>
          <div ref="userRoleChartRef" class="chart-box" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { dashboardApi, type IAdminDashboard, type IAdminDashboardCharts } from '@/api/dashboard'
import * as echarts from 'echarts'

defineOptions({ name: 'AdminDashboardOverviewView' })

const loading = ref(false)

const salesChartRef = ref<HTMLElement | null>(null)
const orderChartRef = ref<HTMLElement | null>(null)
const orderStatusChartRef = ref<HTMLElement | null>(null)
const userRoleChartRef = ref<HTMLElement | null>(null)

const summary = reactive<IAdminDashboard>({
  totalUsers: 0,
  totalCustomers: 0,
  totalMerchants: 0,
  totalAgents: 0,
  totalProducts: 0,
  pendingProducts: 0,
  totalOrders: 0,
  paidOrders: 0,
  completedOrders: 0,
  refundRequests: 0,
  pendingRefunds: 0,
  totalSales: 0,
  todayOrders: 0,
  todaySales: 0,
  totalCommission: 0,
  pendingWithdrawals: 0,
  recentOrders: [],
  recentRefunds: [],
})

const chartData = reactive<IAdminDashboardCharts>({
  salesTrend: [],
  orderTrend: [],
  orderStatusDistribution: [],
  userRoleDistribution: [],
})

let salesChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null
let orderStatusChart: echarts.ECharts | null = null
let userRoleChart: echarts.ECharts | null = null

function formatAmount(val: number) {
  return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function initSalesChart() {
  if (!salesChartRef.value) return
  if (!salesChart) salesChart = echarts.init(salesChartRef.value)
  const days = chartData.salesTrend.map((item) => formatChartDate(item.date))
  salesChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: chartData.salesTrend.map((item) => Number(item.amount || 0)),
        itemStyle: { color: '#409EFF' },
      },
    ],
  })
}

function initOrderChart() {
  if (!orderChartRef.value) return
  if (!orderChart) orderChart = echarts.init(orderChartRef.value)
  const days = chartData.orderTrend.map((item) => formatChartDate(item.date))
  orderChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      {
        name: '订单',
        type: 'bar',
        data: chartData.orderTrend.map((item) => Number(item.count || 0)),
        itemStyle: { color: '#67C23A' },
      },
    ],
  })
}

function initOrderStatusChart() {
  if (!orderStatusChartRef.value) return
  if (!orderStatusChart) orderStatusChart = echarts.init(orderStatusChartRef.value)
  orderStatusChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: chartData.orderStatusDistribution.map((item) => ({
          name: translateOrderStatus(item.name),
          value: Number(item.value || 0),
        })),
      },
    ],
  })
}

function initUserRoleChart() {
  if (!userRoleChartRef.value) return
  if (!userRoleChart) userRoleChart = echarts.init(userRoleChartRef.value)
  userRoleChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: chartData.userRoleDistribution
          .filter((item) => item.name !== 'Agent')
          .map((item) => ({
            name: translateUserRole(item.name),
            value: Number(item.value || 0),
          })),
      },
    ],
  })
}

function formatChartDate(date?: string) {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return `${parsed.getMonth() + 1}/${parsed.getDate()}`
}

function translateOrderStatus(status?: string) {
  const map: Record<string, string> = {
    'Pending Payment': '待支付',
    Paid: '已支付',
    Shipped: '已发货',
    Completed: '已完成',
    Cancelled: '已取消',
  }
  return status ? map[status] || status : '-'
}

function translateUserRole(role?: string) {
  const map: Record<string, string> = {
    Customer: '客户',
    Merchant: '商家',
    Admin: '管理员',
  }
  return role ? map[role] || role : '-'
}

function initCharts() {
  nextTick(() => {
    initSalesChart()
    initOrderChart()
    initOrderStatusChart()
    initUserRoleChart()
  })
}

window.addEventListener('resize', () => {
  salesChart?.resize()
  orderChart?.resize()
  orderStatusChart?.resize()
  userRoleChart?.resize()
})

async function fetchData() {
  loading.value = true
  try {
    const [{ data: overviewRes }, { data: chartsRes }] = await Promise.all([
      dashboardApi.getOverview(),
      dashboardApi.getCharts(),
    ])
    if (overviewRes.code === 200 && overviewRes.data) {
      Object.assign(summary, overviewRes.data)
    }
    if (chartsRes.code === 200 && chartsRes.data) {
      Object.assign(chartData, chartsRes.data)
    }
    initCharts()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard-overview {
  padding: 20px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
}
.stats-row {
  margin-bottom: 16px;
}
.stat-card {
  text-align: center;
  padding: 8px 0;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}
.stat-value.green {
  color: #67c23a;
}
.pending-card .stat-value {
  color: #f56c6c;
}
.warn-card .stat-value {
  color: #e6a23c;
}
.tables-row {
  margin-top: 8px;
}
.section-card {
  margin-bottom: 16px;
}
.section-title {
  font-weight: 600;
  font-size: 15px;
}
.charts-row {
  margin-top: 8px;
}
.chart-box {
  width: 100%;
  height: 300px;
}
</style>
