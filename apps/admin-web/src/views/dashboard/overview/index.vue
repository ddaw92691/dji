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
          <div class="stat-value">{{ summary.total客户 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">商户</div>
          <div class="stat-value">{{ summary.total商家 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">代理</div>
          <div class="stat-value">{{ summary.total代理 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">商品</div>
          <div class="stat-value">{{ summary.total商品数 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <el-card shadow="hover" class="stat-card pending-card">
          <div class="stat-label">待审商品</div>
          <div class="stat-value">{{ summary.pending商品数 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">订单总数</div>
          <div class="stat-value">{{ summary.total订单 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已支付订单</div>
          <div class="stat-value">{{ summary.paid订单 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">已完成订单</div>
          <div class="stat-value">{{ summary.completed订单 }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card warn-card">
          <div class="stat-label">退款申请</div>
          <div class="stat-value">{{ summary.refundRequests }}</div>
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
          <el-table :data="summary.recent订单 || []" border size="small">
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
          <el-table :data="summary.recent退款s || []" border size="small">
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
                    row.refund状态 === 'REQUESTED'
                      ? 'warning'
                      : row.refund状态 === 'APPROVED'
                        ? 'success'
                        : 'danger'
                  "
                >
                  {{ row.refund状态 }}
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

    <el-row :gutter="16" class="charts-row">
      <el-col :span="12">
        <el-card shadow="hover" class="section-card">
          <template #header><span class="section-title">订单状态分布</span></template>
          <div ref="order状态ChartRef" class="chart-box" />
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
import { dashboardApi, type I管理员Dashboard } from '@/api/dashboard'
import * as echarts from 'echarts'

defineOptions({ name: '管理员DashboardOverviewView' })

const loading = ref(false)

const salesChartRef = ref<HTMLElement | null>(null)
const orderChartRef = ref<HTMLElement | null>(null)
const order状态ChartRef = ref<HTMLElement | null>(null)
const userRoleChartRef = ref<HTMLElement | null>(null)

const summary = reactive<I管理员Dashboard>({
  totalUsers: 0,
  total客户: 0,
  total商家: 0,
  total代理: 0,
  total商品数: 0,
  pending商品数: 0,
  total订单: 0,
  paid订单: 0,
  completed订单: 0,
  refundRequests: 0,
  totalSales: 0,
  todaySales: 0,
  totalCommission: 0,
  pendingWithdrawals: 0,
  recent订单: [],
  recent退款s: [],
})

let salesChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null
let order状态Chart: echarts.ECharts | null = null
let userRoleChart: echarts.ECharts | null = null

function formatAmount(val: number) {
  return (val ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function initSalesChart() {
  if (!salesChartRef.value) return
  salesChart = echarts.init(salesChartRef.value)
  const days = getLast7Days()
  salesChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Sales',
        type: 'line',
        smooth: true,
        data: days.map(() => Math.floor(Math.random() * 5000 + 1000)),
        itemStyle: { color: '#409EFF' },
      },
    ],
  })
}

function initOrderChart() {
  if (!orderChartRef.value) return
  orderChart = echarts.init(orderChartRef.value)
  const days = getLast7Days()
  orderChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days },
    yAxis: { type: 'value' },
    series: [
      {
        name: '订单',
        type: 'bar',
        data: days.map(() => Math.floor(Math.random() * 100 + 20)),
        itemStyle: { color: '#67C23A' },
      },
    ],
  })
}

function initOrder状态Chart() {
  if (!order状态ChartRef.value) return
  order状态Chart = echarts.init(order状态ChartRef.value)
  order状态Chart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: summary.paid订单 || 10, name: '已支付' },
          { value: summary.completed订单 || 5, name: '已完成' },
          { value: summary.refundRequests || 2, name: '退款' },
        ],
      },
    ],
  })
}

function initUserRoleChart() {
  if (!userRoleChartRef.value) return
  userRoleChart = echarts.init(userRoleChartRef.value)
  userRoleChart.setOption({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: summary.total客户 || 10, name: '客户' },
          { value: summary.total商家 || 3, name: '商家' },
          { value: summary.total代理 || 2, name: '代理' },
          {
            value:
              summary.totalUsers - summary.total客户 - summary.total商家 - summary.total代理 || 1,
            name: '管理员',
          },
        ],
      },
    ],
  })
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

function initCharts() {
  nextTick(() => {
    initSalesChart()
    initOrderChart()
    initOrder状态Chart()
    initUserRoleChart()
  })
}

window.addEventListener('resize', () => {
  salesChart?.resize()
  orderChart?.resize()
  order状态Chart?.resize()
  userRoleChart?.resize()
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await dashboardApi.getOverview()
    if (res.code !== 200) return
    if (res.data) {
      Object.assign(summary, res.data)
      nextTick(() => {
        initOrder状态Chart()
        initUserRoleChart()
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
  initCharts()
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
