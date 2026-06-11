<template>
  <div class="withdrawal-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.role" placeholder="角色" clearable @change="handleSearch">
          <el-option label="商户" value="MERCHANT" />
          <el-option label="代理" value="AGENT" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.type" placeholder="类型" clearable @change="handleSearch">
          <el-option label="银行转账" value="BANK" />
          <el-option label="手动" value="MANUAL" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option v-for="o in WITHDRAWAL_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
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
      <el-table-column prop="userName" label="用户" min-width="120" show-overflow-tooltip />
      <el-table-column label="角色" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role === 'MERCHANT' ? 'primary' : 'success'" size="small">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="90" align="center" />
      <el-table-column prop="amount" label="金额" width="120" align="right">
        <template #default="{ row }">${{ (row.amount ?? 0).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(WITHDRAWAL_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(WITHDRAWAL_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bankName" label="银行" width="120" show-overflow-tooltip />
      <el-table-column prop="bankAccount" label="账户" width="160" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'finance:withdrawal:view'" @click="openDetail(row.id)">详情</el-button>
          <el-button v-if="row.status === 'PENDING'" link type="success" v-permission="'finance:withdrawal:approve'" @click="handleApprove(row)">通过</el-button>
          <el-button v-if="row.status === 'PENDING'" link type="danger" v-permission="'finance:withdrawal:reject'" @click="openRejectDialog(row)">拒绝</el-button>
        </template>
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

    <el-dialog v-model="detailVisible" title="提现详情" width="600px">
      <el-descriptions v-if="detail" :column="2" border size="small">
        <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ detail.userName }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ detail.role }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type }}</el-descriptions-item>
        <el-descriptions-item label="金额">${{ (detail.amount ?? 0).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getColorByValue(WITHDRAWAL_STATUS_OPTIONS, detail.status)">
            {{ getLabelByValue(WITHDRAWAL_STATUS_OPTIONS, detail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="银行名称">{{ detail.bankName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="银行账号">{{ detail.bankAccount || '-' }}</el-descriptions-item>
        <el-descriptions-item label="账户名">{{ detail.accountName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detail.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="拒绝原因" :span="2">{{ detail.rejectReason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ detail.reviewedAt || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectVisible" title="拒绝提现" width="480px">
      <el-form :model="rejectForm">
        <el-form-item label="拒绝原因" required>
          <el-input v-model="rejectForm.rejectReason" type="textarea" :rows="4" placeholder="请输入拒绝原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" :loading="rejectLoading" @click="handleReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { financeApi, type IAdminWithdrawal } from '@/api/finance'
import { WITHDRAWAL_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'

defineOptions({ name: 'FinanceWithdrawalView' })

const loading = ref(false)
const rejectLoading = ref(false)
const tableData = ref<IAdminWithdrawal[]>([])
const total = ref(0)

const detailVisible = ref(false)
const detail = ref<IAdminWithdrawal | null>(null)

const rejectVisible = ref(false)
const rejectingId = ref<number | null>(null)
const rejectForm = reactive({ rejectReason: '' })

const searchForm = reactive({
  keyword: '',
  role: '',
  type: '',
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
    if (searchForm.role) params.role = searchForm.role
    if (searchForm.type) params.type = searchForm.type
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await financeApi.getWithdrawals(params)
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

async function openDetail(id: number) {
  const { data: res } = await financeApi.getWithdrawalDetail(id)
  if (res.code !== 200) return
  detail.value = res.data || null
  detailVisible.value = true
}

async function handleApprove(row: IAdminWithdrawal) {
  try {
    await ElMessageBox.confirm(`Approve withdrawal #${row.id} ($${(row.amount ?? 0).toFixed(2)})?`, 'Confirm', { type: 'warning' })
  } catch { return }
  const { data: res } = await financeApi.approveWithdrawal(row.id)
  if (res.code !== 200) return
  ElMessage.success('提现已通过')
  fetchData()
}

function openRejectDialog(row: IAdminWithdrawal) {
  rejectingId.value = row.id
  rejectForm.rejectReason = ''
  rejectVisible.value = true
}

async function handleReject() {
  if (!rejectingId.value || !rejectForm.rejectReason.trim()) return
  rejectLoading.value = true
  try {
    const { data: res } = await financeApi.rejectWithdrawal(rejectingId.value, rejectForm.rejectReason)
    if (res.code !== 200) return
    ElMessage.success('提现已拒绝')
    rejectVisible.value = false
    fetchData()
  } finally {
    rejectLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.withdrawal-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
