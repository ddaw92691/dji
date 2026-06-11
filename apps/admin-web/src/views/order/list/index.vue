<template>
  <div class="order-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.orderNo" placeholder="订单号" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="用户ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="商户ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option v-for="o in ORDER_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.payStatus" placeholder="支付状态" clearable @change="handleSearch">
          <el-option v-for="o in PAY_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
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
      <el-table-column prop="userName" label="客户" min-width="120" show-overflow-tooltip />
      <el-table-column prop="merchantName" label="商户" min-width="130" show-overflow-tooltip />
      <el-table-column label="明细" min-width="200">
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
      <el-table-column prop="payAmount" label="金额" width="100" align="right" />
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(ORDER_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(ORDER_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(PAY_STATUS_OPTIONS, row.payStatus)">
            {{ getLabelByValue(PAY_STATUS_OPTIONS, row.payStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'order:view'" @click="openDetail(row.id)">详情</el-button>
          <el-button link type="warning" v-permission="'order:edit'" @click="openStatusEdit(row)">更新</el-button>
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

    <el-dialog v-model="detailVisible" title="订单详情" width="900px">
      <div v-if="detail" class="order-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="订单号">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ detail.userName }}</el-descriptions-item>
          <el-descriptions-item label="商户">{{ detail.merchantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ detail.userId }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getColorByValue(ORDER_STATUS_OPTIONS, detail.status)">
              {{ getLabelByValue(ORDER_STATUS_OPTIONS, detail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag :type="getColorByValue(PAY_STATUS_OPTIONS, detail.payStatus)">
              {{ getLabelByValue(PAY_STATUS_OPTIONS, detail.payStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总金额">${{ detail.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="支付金额">${{ detail.payAmount }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ detail.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ detail.shippedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ detail.completedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detail.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>订单商品</el-divider>
        <el-table :data="detail.items" border size="small">
          <el-table-column label="图片" width="80">
            <template #default="{ row: item }">
              <el-image v-if="item.productImage" :src="item.productImage" style="width:50px;height:50px;border-radius:4px" fit="cover" />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="productTitle" label="商品" min-width="180" show-overflow-tooltip />
          <el-table-column prop="price" label="价格" width="100" />
          <el-table-column prop="quantity" label="数量" width="60" />
          <el-table-column label="小计" width="100">
            <template #default="{ row: item }">${{ (item.price * item.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>

        <el-divider>地址</el-divider>
        <div v-if="detail.addressSnapshot" class="address-info">
          <p><strong>Receiver:</strong> {{ detail.addressSnapshot.receiverName || '-' }}</p>
          <p><strong>Phone:</strong> {{ detail.addressSnapshot.receiverPhone || '-' }}</p>
          <p><strong>Address:</strong> {{ detail.addressSnapshot.detailAddress || '-' }}</p>
        </div>
        <span v-else>暂无地址信息</span>

        <el-divider>支付信息</el-divider>
        <div v-if="detail.payment" class="address-info">
          <p><strong>Method:</strong> {{ detail.payment.method || '-' }}</p>
          <p><strong>Transaction No:</strong> {{ detail.payment.transactionNo || '-' }}</p>
          <p><strong>Paid At:</strong> {{ detail.payment.paidAt || '-' }}</p>
        </div>
        <span v-else>暂无支付信息</span>

        <el-divider>物流</el-divider>
        <div class="address-info">
          <p><strong>Company:</strong> {{ detail.logisticsCompany || '-' }}</p>
          <p><strong>Tracking No:</strong> {{ detail.trackingNo || '-' }}</p>
        </div>

        <el-divider>状态时间线</el-divider>
        <el-steps :active="statusStep" align-center style="margin-top:8px">
          <el-step title="已创建" :description="detail.createdAt" />
          <el-step title="已支付" :description="detail.paidAt || '-'" />
          <el-step title="已发货" :description="detail.shippedAt || '-'" />
          <el-step title="已完成" :description="detail.completedAt || '-'" />
        </el-steps>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statusVisible" title="更新订单状态" width="480px" @closed="resetStatusForm">
      <el-form ref="statusFormRef" :model="statusForm" label-width="120px">
        <el-form-item label="状态" prop="status" required>
          <el-select v-model="statusForm.status" placeholder="请选择状态" style="width:100%">
            <el-option v-for="o in EDITABLE_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="statusForm.remark" type="textarea" :rows="3" placeholder="备注（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusVisible = false">取消</el-button>
        <el-button type="primary" :loading="statusLoading" @click="handleStatusUpdate">确认</el-button>
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
    ElMessage.success('订单状态已更新')
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
