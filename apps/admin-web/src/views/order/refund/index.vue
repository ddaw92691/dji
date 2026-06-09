<template>
  <div class="refund-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.orderNo" placeholder="Order No" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="User ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.refundStatus" placeholder="Refund Status" clearable @change="handleSearch">
          <el-option v-for="o in REFUND_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
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
      <el-table-column prop="orderNo" label="Order No" min-width="160" show-overflow-tooltip />
      <el-table-column prop="userName" label="Customer" min-width="120" show-overflow-tooltip />
      <el-table-column prop="merchantName" label="Merchant" min-width="130" show-overflow-tooltip />
      <el-table-column prop="payAmount" label="Pay Amount" width="110" align="right" />
      <el-table-column label="Refund Status" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(REFUND_STATUS_OPTIONS, row.refundStatus)">
            {{ getLabelByValue(REFUND_STATUS_OPTIONS, row.refundStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="refundReason" label="Reason" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'refund:view'" @click="openDetail(row.orderId)">Detail</el-button>
          <el-button link type="success" v-if="row.refundStatus === 'REQUESTED'" v-permission="'refund:approve'" @click="handleApprove(row)">Approve</el-button>
          <el-button link type="danger" v-if="row.refundStatus === 'REQUESTED'" v-permission="'refund:reject'" @click="openReject(row)">Reject</el-button>
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

    <el-dialog v-model="detailVisible" title="Refund Detail" width="900px">
      <div v-if="detail" class="refund-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="Order No">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="Customer">{{ detail.userName }}</el-descriptions-item>
          <el-descriptions-item label="Merchant">{{ detail.merchantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="User ID">{{ detail.userId }}</el-descriptions-item>
          <el-descriptions-item label="Refund Status">
            <el-tag :type="getColorByValue(REFUND_STATUS_OPTIONS, detail.refundStatus)">
              {{ getLabelByValue(REFUND_STATUS_OPTIONS, detail.refundStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Refund Amount">${{ detail.refundAmount }}</el-descriptions-item>
          <el-descriptions-item label="Pay Amount">${{ detail.payAmount }}</el-descriptions-item>
          <el-descriptions-item label="Refund Reason">{{ detail.refundReason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Reject Reason">{{ detail.rejectReason || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ detail.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="Reviewed At">{{ detail.reviewedAt || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>Order Items</el-divider>
        <el-table :data="detail.items" border size="small">
          <el-table-column label="Image" width="80">
            <template #default="{ row: item }">
              <el-image v-if="item.productImage" :src="item.productImage" style="width:50px;height:50px;border-radius:4px" fit="cover" />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="productTitle" label="Product" min-width="180" show-overflow-tooltip />
          <el-table-column prop="price" label="Price" width="100" />
          <el-table-column prop="quantity" label="Qty" width="60" />
          <el-table-column label="Subtotal" width="100">
            <template #default="{ row: item }">${{ (item.price * item.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>

        <el-divider>Payment Info</el-divider>
        <div v-if="detail.payment" class="info-box">
          <p><strong>Method:</strong> {{ detail.payment.method || '-' }}</p>
          <p><strong>Transaction No:</strong> {{ detail.payment.transactionNo || '-' }}</p>
          <p><strong>Paid At:</strong> {{ detail.payment.paidAt || '-' }}</p>
        </div>
        <span v-else>No payment info</span>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectVisible" title="Reject Refund" width="480px">
      <el-form :model="rejectForm" label-width="110px">
        <el-form-item label="Reject Reason" required>
          <el-input v-model="rejectForm.rejectReason" type="textarea" :rows="4" placeholder="Enter reject reason" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="actionLoading" @click="handleReject">Confirm Reject</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { refundApi, type IAdminRefund } from '@/api/refund'
import { REFUND_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'

defineOptions({ name: 'AdminRefundView' })

const loading = ref(false)
const actionLoading = ref(false)
const tableData = ref<IAdminRefund[]>([])
const total = ref(0)

const detailVisible = ref(false)
const detail = ref<IAdminRefund | null>(null)

const rejectVisible = ref(false)
const rejectingId = ref<number | null>(null)
const rejectForm = reactive({ rejectReason: '' })

const searchForm = reactive({
  orderNo: '',
  userId: '',
  merchantId: '',
  refundStatus: '',
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
    if (searchForm.orderNo) params.orderNo = searchForm.orderNo
    if (searchForm.userId) params.userId = searchForm.userId
    if (searchForm.merchantId) params.merchantId = searchForm.merchantId
    if (searchForm.refundStatus) params.refundStatus = searchForm.refundStatus
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await refundApi.getRefunds(params)
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

async function openDetail(orderId: number) {
  const { data: res } = await refundApi.getRefundDetail(orderId)
  if (res.code !== 200) return
  detail.value = res.data || null
  detailVisible.value = true
}

async function handleApprove(row: IAdminRefund) {
  try {
    await ElMessageBox.confirm(`Approve refund for order "${row.orderNo}"?`, 'Confirm', { type: 'warning' })
  } catch {
    return
  }
  actionLoading.value = true
  try {
    const { data: res } = await refundApi.approveRefund(row.orderId)
    if (res.code !== 200) return
    ElMessage.success('Refund approved')
    fetchData()
  } finally {
    actionLoading.value = false
  }
}

function openReject(row: IAdminRefund) {
  rejectingId.value = row.orderId
  rejectForm.rejectReason = ''
  rejectVisible.value = true
}

async function handleReject() {
  if (!rejectingId.value || !rejectForm.rejectReason.trim()) {
    ElMessage.warning('Please enter a reject reason')
    return
  }
  actionLoading.value = true
  try {
    const { data: res } = await refundApi.rejectRefund(rejectingId.value, rejectForm.rejectReason)
    if (res.code !== 200) return
    ElMessage.success('Refund rejected')
    rejectVisible.value = false
    fetchData()
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.refund-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.refund-detail p { margin: 4px 0; }
.info-box { background: #f5f7fa; padding: 12px; border-radius: 6px; }
</style>
