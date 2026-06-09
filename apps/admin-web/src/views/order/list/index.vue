<template>
  <div class="order-page">
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
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option v-for="o in ORDER_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.payStatus" placeholder="Pay Status" clearable @change="handleSearch">
          <el-option v-for="o in PAY_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
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
      <el-table-column label="Items" min-width="200">
        <template #default="{ row }">
          <span v-if="row.items?.length">
            {{ row.items[0].productTitle }}
            <el-tag v-if="row.items.length > 1" size="small" type="info" style="margin-left:4px">
              +{{ row.items.length - 1 }}
            </el-tag>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="payAmount" label="Amount" width="100" align="right" />
      <el-table-column label="Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(ORDER_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(ORDER_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Payment" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(PAY_STATUS_OPTIONS, row.payStatus)">
            {{ getLabelByValue(PAY_STATUS_OPTIONS, row.payStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'order:view'" @click="openDetail(row.id)">Detail</el-button>
          <el-button link type="warning" v-permission="'order:edit'" @click="openStatusEdit(row)">Update</el-button>
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

    <el-dialog v-model="detailVisible" title="Order Detail" width="900px">
      <div v-if="detail" class="order-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="Order No">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="Customer">{{ detail.userName }}</el-descriptions-item>
          <el-descriptions-item label="Merchant">{{ detail.merchantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="User ID">{{ detail.userId }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="getColorByValue(ORDER_STATUS_OPTIONS, detail.status)">
              {{ getLabelByValue(ORDER_STATUS_OPTIONS, detail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Pay Status">
            <el-tag :type="getColorByValue(PAY_STATUS_OPTIONS, detail.payStatus)">
              {{ getLabelByValue(PAY_STATUS_OPTIONS, detail.payStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Total Amount">${{ detail.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="Pay Amount">${{ detail.payAmount }}</el-descriptions-item>
          <el-descriptions-item label="Paid At">{{ detail.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Shipped At">{{ detail.shippedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Completed At">{{ detail.completedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ detail.createdAt }}</el-descriptions-item>
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

        <el-divider>Address</el-divider>
        <div v-if="detail.addressSnapshot" class="address-info">
          <p><strong>Receiver:</strong> {{ detail.addressSnapshot.receiverName || '-' }}</p>
          <p><strong>Phone:</strong> {{ detail.addressSnapshot.receiverPhone || '-' }}</p>
          <p><strong>Address:</strong> {{ detail.addressSnapshot.detailAddress || '-' }}</p>
        </div>
        <span v-else>No address info</span>

        <el-divider>Payment Info</el-divider>
        <div v-if="detail.payment" class="address-info">
          <p><strong>Method:</strong> {{ detail.payment.method || '-' }}</p>
          <p><strong>Transaction No:</strong> {{ detail.payment.transactionNo || '-' }}</p>
          <p><strong>Paid At:</strong> {{ detail.payment.paidAt || '-' }}</p>
        </div>
        <span v-else>No payment info</span>

        <el-divider>Logistics</el-divider>
        <div class="address-info">
          <p><strong>Company:</strong> {{ detail.logisticsCompany || '-' }}</p>
          <p><strong>Tracking No:</strong> {{ detail.trackingNo || '-' }}</p>
        </div>

        <el-divider>Status Timeline</el-divider>
        <el-steps :active="statusStep" align-center style="margin-top:8px">
          <el-step title="Created" :description="detail.createdAt" />
          <el-step title="Paid" :description="detail.paidAt || '-'" />
          <el-step title="Shipped" :description="detail.shippedAt || '-'" />
          <el-step title="Completed" :description="detail.completedAt || '-'" />
        </el-steps>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statusVisible" title="Update Order Status" width="480px" @closed="resetStatusForm">
      <el-form ref="statusFormRef" :model="statusForm" label-width="120px">
        <el-form-item label="Status" prop="status" required>
          <el-select v-model="statusForm.status" placeholder="Select status" style="width:100%">
            <el-option v-for="o in EDITABLE_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="statusForm.remark" type="textarea" :rows="3" placeholder="Remark (optional)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="statusLoading" @click="handleStatusUpdate">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { orderApi, type IAdminOrder } from '@/api/order'
import { ORDER_STATUS_OPTIONS, PAY_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'AdminOrderView' })

const loading = ref(false)
const statusLoading = ref(false)
const tableData = ref<IAdminOrder[]>([])
const total = ref(0)

const detailVisible = ref(false)
const detail = ref<IAdminOrder | null>(null)

const statusVisible = ref(false)
const statusFormRef = ref<FormInstance>()
const editingOrderId = ref<number | null>(null)

const EDITABLE_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.filter(
  (o) => o.value !== 'pendingPayment'
)

const statusStep = computed(() => {
  if (!detail.value) return 0
  if (detail.value.completedAt) return 3
  if (detail.value.shippedAt) return 2
  if (detail.value.paidAt) return 1
  return 0
})

const searchForm = reactive({
  orderNo: '',
  userId: '',
  merchantId: '',
  status: '',
  payStatus: '',
  dateRange: null as [string, string] | null,
  page: 1,
  pageSize: 20,
})

const statusForm = reactive({
  status: '',
  remark: '',
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
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.payStatus) params.payStatus = searchForm.payStatus
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await orderApi.getOrders(params)
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
  const { data: res } = await orderApi.getOrderDetail(id)
  if (res.code !== 200) return
  detail.value = res.data || null
  detailVisible.value = true
}

function openStatusEdit(row: IAdminOrder) {
  editingOrderId.value = row.id
  statusForm.status = ''
  statusForm.remark = ''
  statusVisible.value = true
}

async function handleStatusUpdate() {
  if (!editingOrderId.value || !statusForm.status) return
  statusLoading.value = true
  try {
    const { data: res } = await orderApi.updateOrderStatus(editingOrderId.value, {
      status: statusForm.status,
      remark: statusForm.remark,
    })
    if (res.code !== 200) return
    ElMessage.success('Order status updated')
    statusVisible.value = false
    fetchData()
  } finally {
    statusLoading.value = false
  }
}

function resetStatusForm() {
  statusFormRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.order-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.order-detail p { margin: 4px 0; }
.address-info { background: #f5f7fa; padding: 12px; border-radius: 6px; }
</style>
