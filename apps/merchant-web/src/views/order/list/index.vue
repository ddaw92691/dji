<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="orderList"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="getOrderList"
    >
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDetail(row.id)">
          View Detail
        </el-button>
        <el-button
          v-if="row.payStatus === 'paid' && row.status === 'paid'"
          type="success"
          link
          @click="openShip(row)"
        >
          Ship
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(ORDER_STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(ORDER_STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #payStatus="{ row }">
        <BaseTag
          :type="getColorByValue(PAY_STATUS_OPTIONS, row.payStatus)"
          :text="getLabelByValue(PAY_STATUS_OPTIONS, row.payStatus)"
        />
      </template>
      <template #items="{ row }">
        <span v-if="row.items?.length">
          {{ row.items[0].productTitle }}
          <el-tag v-if="row.items.length > 1" size="small" type="info" style="margin-left:4px">
            +{{ row.items.length - 1 }}
          </el-tag>
        </span>
        <span v-else>-</span>
      </template>
      <template #logistics="{ row }">
        <span v-if="row.logisticsCompany">
          {{ row.logisticsCompany }} / {{ row.trackingNo }}
        </span>
        <span v-else>-</span>
      </template>
    </BasePage>

    <el-dialog v-model="detailVisible" title="Order Detail" width="800px">
      <div v-if="detail" class="order-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="Order No">{{ detail.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="Customer">{{ detail.userName }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <BaseTag
              :type="getColorByValue(ORDER_STATUS_OPTIONS, detail.status)"
              :text="getLabelByValue(ORDER_STATUS_OPTIONS, detail.status)"
            />
          </el-descriptions-item>
          <el-descriptions-item label="Pay Status">
            <BaseTag
              :type="getColorByValue(PAY_STATUS_OPTIONS, detail.payStatus)"
              :text="getLabelByValue(PAY_STATUS_OPTIONS, detail.payStatus)"
            />
          </el-descriptions-item>
          <el-descriptions-item label="Total Amount">${{ detail.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="Pay Amount">${{ detail.payAmount }}</el-descriptions-item>
          <el-descriptions-item label="Paid At">{{ detail.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ detail.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="Logistics">{{ detail.logisticsCompany ? detail.logisticsCompany + ' / ' + detail.trackingNo : '-' }}</el-descriptions-item>
          <el-descriptions-item label="Shipped At">{{ detail.shippedAt || '-' }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.remark" label="Remark" :span="2">{{ detail.remark }}</el-descriptions-item>
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
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="shipVisible" title="Ship Order" width="480px" @closed="resetShipForm">
      <el-form ref="shipFormRef" :model="shipForm" label-width="140px">
        <el-form-item label="Logistics Company" prop="logisticsCompany" required>
          <el-input v-model="shipForm.logisticsCompany" placeholder="e.g. FedEx, DHL" />
        </el-form-item>
        <el-form-item label="Tracking No" prop="trackingNo" required>
          <el-input v-model="shipForm.trackingNo" placeholder="Tracking number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="shipLoading" @click="handleShip">Confirm Ship</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { orderApi, type IMerchantOrder } from '@/api/order'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { ORDER_STATUS_OPTIONS, PAY_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance } from 'element-plus'

defineOptions({ name: 'OrderView' })

const basePageRef = useTemplateRef('basePageRef')
const shipFormRef = ref<FormInstance>()

const orderList = ref<IMerchantOrder[]>([])
const total = ref(0)
const loading = ref(false)

const detailVisible = ref(false)
const detail = ref<IMerchantOrder | null>(null)

const shipVisible = ref(false)
const shipLoading = ref(false)
const shippingId = ref<number | null>(null)
const shipForm = reactive({ logisticsCompany: '', trackingNo: '' })

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: 'Order No',
    prop: 'orderNo',
    type: 'elInput',
    attrs: { placeholder: 'Search by order no...' },
  },
  {
    label: 'Status',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: 'Select status',
      options: ORDER_STATUS_OPTIONS,
      clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'orderNo', label: 'Order No', minWidth: 160 },
  { prop: 'userName', label: 'Customer', minWidth: 120 },
  { prop: 'items', label: 'Items', minWidth: 200 },
  { prop: 'payAmount', label: 'Amount', width: 100 },
  { prop: 'status', label: 'Status', width: 110 },
  { prop: 'payStatus', label: 'Payment', width: 110 },
  { prop: 'logistics', label: 'Logistics', minWidth: 180 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 160, fixed: 'right' },
])

const getOrderList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
) => {
  loading.value = true
  try {
    const { data: res } = await orderApi.getOrders({
      ...queryForm,
      page,
      pageSize,
    })
    if (res.code !== 200) return
    orderList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

const openDetail = async (id: number) => {
  const { data: res } = await orderApi.getOrderDetail(id)
  if (res.code !== 200) return
  detail.value = res.data || null
  detailVisible.value = true
}

const openShip = (row: IMerchantOrder) => {
  shippingId.value = row.id
  shipForm.logisticsCompany = ''
  shipForm.trackingNo = ''
  shipVisible.value = true
}

const handleShip = async () => {
  if (!shippingId.value) return
  shipLoading.value = true
  try {
    const { data: res } = await orderApi.shipOrder(shippingId.value, {
      logisticsCompany: shipForm.logisticsCompany,
      trackingNo: shipForm.trackingNo,
    })
    if (res.code !== 200) return
    ElMessage.success('Order shipped successfully')
    shipVisible.value = false
    basePageRef.value?.refreshCurrentPage()
  } finally {
    shipLoading.value = false
  }
}

const resetShipForm = () => {
  shipFormRef.value?.resetFields()
}

onMounted(() => {
  getOrderList({}, 1, 10)
})
</script>

<style scoped>
.order-detail p { margin: 4px 0; }
.address-info { background: #f5f7fa; padding: 12px; border-radius: 6px; }
</style>
