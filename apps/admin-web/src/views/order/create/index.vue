<template>
  <div class="order-create-page">
    <h2 style="margin-bottom: 20px">为商户创建订单</h2>

    <el-form ref="orderFormRef" :model="orderForm" label-width="130px" style="max-width: 800px">
      <el-divider content-position="left">客户</el-divider>
      <el-form-item label="客户">
        <el-select
          v-model="orderForm.customerId"
          filterable
          remote
          :remote-method="searchClients"
          :loading="customerLoading"
          placeholder="按昵称/邮箱搜索客户"
          style="width: 100%"
        >
          <el-option
            v-for="c in customerOptions"
            :key="c.id"
            :label="`${c.nickname || c.email || '#' + c.id}${c.isVirtual ? '（虚拟客户）' : ''}`"
            :value="c.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="virtualDialogVisible = true"
          >+ 新建虚拟客户</el-button
        >
      </el-form-item>

      <el-divider content-position="left">商户</el-divider>
      <el-form-item label="商户" required>
        <div class="merchant-picker">
          <el-select
            v-model="orderForm.merchantId"
            filterable
            remote
            :remote-method="searchMerchants"
            :loading="merchantLoading"
            placeholder="请选择商户"
            style="flex: 1"
            @focus="searchMerchants('')"
            @change="onMerchantChange"
          >
            <el-option v-for="m in merchantOptions" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
          <el-button @click="openMerchantDialog">选择商家</el-button>
        </div>
      </el-form-item>

      <el-divider content-position="left">商品</el-divider>
      <div v-if="orderForm.merchantId && listingOptions.length > 0">
        <div v-for="(item, idx) in orderForm.items" :key="idx" class="order-item-row">
          <el-select
            v-model="item.platformProductId"
            placeholder="商品"
            filterable
            style="flex: 1"
            @change="onProductChange(idx)"
          >
            <el-option
              v-for="l in listingOptions"
              :key="l.id"
              :label="l.platformProductName"
              :value="l.id"
            />
          </el-select>
          <el-input-number
            v-model="item.quantity"
            :min="1"
            placeholder="数量"
            style="width: 100px; margin-left: 8px"
            @change="calcTotal"
          />
          <span style="margin-left: 8px; min-width: 80px">¥{{ item.price * item.quantity }}</span>
          <el-button type="danger" circle size="small" @click="removeItem(idx)">X</el-button>
        </div>
        <el-button type="primary" plain @click="addItem" style="margin-top: 8px">+ 添加商品</el-button>
      </div>
      <div v-else-if="orderForm.merchantId">
        <p style="color: #909399">该商户暂无可售商品</p>
      </div>
      <div v-else>
        <p style="color: #909399">请先选择商户</p>
      </div>

      <el-divider content-position="left">收货地址</el-divider>
      <el-form-item label="地址">
        <el-input
          v-model="orderForm.addressSnapshot"
          type="textarea"
          :rows="3"
          placeholder="客户地址快照"
        />
      </el-form-item>

      <el-divider content-position="left">其他</el-divider>
      <el-form-item label="备注">
        <el-input v-model="orderForm.remark" type="textarea" :rows="2" placeholder="订单备注" />
      </el-form-item>
      <el-form-item label="标记为已支付">
        <el-checkbox v-model="orderForm.markAsPaid" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          创建订单
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      v-model="virtualDialogVisible"
      title="新建虚拟客户"
      width="500px"
      @close="resetVirtualForm"
    >
      <el-form ref="virtualFormRef" :model="virtualForm" label-width="100px">
        <el-form-item label="昵称" required>
          <el-input v-model="virtualForm.nickname" placeholder="虚拟客户名称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="virtualForm.email" placeholder="选填" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="virtualForm.remark"
            type="textarea"
            :rows="2"
            placeholder="虚拟客户备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="virtualDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="virtualLoading" @click="createVirtualCustomer"
          >新增</el-button
        >
      </template>
    </el-dialog>

    <el-dialog v-model="merchantDialogVisible" title="选择商家" width="760px" @open="loadMerchantDialog">
      <div class="dialog-search">
        <el-input
          v-model="merchantSearchKeyword"
          placeholder="搜索商家账号 / 店铺 / 邮箱 / 手机号"
          clearable
          @keyup.enter="loadMerchantDialog"
          @clear="loadMerchantDialog"
        />
        <el-button type="primary" :loading="merchantDialogLoading" @click="loadMerchantDialog">搜索</el-button>
      </div>
      <el-table :data="merchantDialogRows" border stripe v-loading="merchantDialogLoading" max-height="420">
        <el-table-column prop="shopName" label="店铺" min-width="140" show-overflow-tooltip />
        <el-table-column prop="email" label="账号/邮箱" min-width="170" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" min-width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'" size="small">
              {{ row.status === 'ENABLE' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="chooseMerchant(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="resultVisible" title="订单已创建" width="500px">
      <div v-if="orderResult">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="订单号">{{ orderResult.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="合计">{{ orderResult.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ orderResult.status }}</el-descriptions-item>
        </el-descriptions>
        <p style="margin-top: 10px; color: #67c23a">已通过 WebSocket 通知商户</p>
      </div>
      <template #footer>
        <el-button @click="resultVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { customerApi } from '@/api/customer'
import { merchantApi } from '@/api/merchant'

defineOptions({ name: 'OrderCreateView' })

const orderFormRef = ref()

const submitLoading = ref(false)
const customerLoading = ref(false)
const merchantLoading = ref(false)
const customerOptions = ref<any[]>([])
const merchantOptions = ref<any[]>([])
const listingOptions = ref<any[]>([])
const merchantDialogVisible = ref(false)
const merchantDialogLoading = ref(false)
const merchantSearchKeyword = ref('')
const merchantDialogRows = ref<any[]>([])

const orderForm = reactive({
  customerId: null as number | null,
  merchantId: null as number | null,
  items: [] as { platformProductId: number | null; price: number; quantity: number }[],
  addressSnapshot: '',
  remark: '',
  markAsPaid: false,
})

const virtualDialogVisible = ref(false)
const virtualLoading = ref(false)
const virtualFormRef = ref()
const virtualForm = reactive({
  nickname: '',
  email: '',
  remark: '',
})

const resultVisible = ref(false)
const orderResult = ref<any>(null)

async function searchClients(query: string) {
  if (!query) return
  customerLoading.value = true
  try {
    const { data: res } = await customerApi.getCustomers({ keyword: query, pageSize: 20 })
    if (res.code === 200) {
      customerOptions.value = res.data?.list || []
    }
  } catch {
    /* ignore */
  } finally {
    customerLoading.value = false
  }
}

async function searchMerchants(query: string) {
  merchantLoading.value = true
  try {
    const { data: res } = await merchantApi.getMerchants({ keyword: query || undefined, pageSize: 20 })
    if (res.code === 200) {
      merchantOptions.value = (res.data?.list || []).map((m: any) => ({
        ...m,
        name: m.shopName || m.name || m.email || `ID:${m.id}`,
      }))
    }
  } catch {
    /* ignore */
  } finally {
    merchantLoading.value = false
  }
}

function openMerchantDialog() {
  merchantDialogVisible.value = true
}

async function loadMerchantDialog() {
  merchantDialogLoading.value = true
  try {
    const { data: res } = await merchantApi.getMerchants({
      keyword: merchantSearchKeyword.value || undefined,
      pageSize: 50,
    })
    if (res.code === 200) {
      merchantDialogRows.value = (res.data?.list || []).map((m: any) => ({
        ...m,
        name: m.shopName || m.nickname || m.email || `ID:${m.id}`,
      }))
    } else {
      ElMessage.error(res.message || '获取商家失败')
    }
  } catch {
    ElMessage.error('获取商家失败')
  } finally {
    merchantDialogLoading.value = false
  }
}

function chooseMerchant(row: any) {
  const merchant = {
    ...row,
    name: row.shopName || row.nickname || row.email || `ID:${row.id}`,
  }
  const exists = merchantOptions.value.some((item) => item.id === merchant.id)
  if (!exists) merchantOptions.value.unshift(merchant)
  orderForm.merchantId = merchant.id
  merchantDialogVisible.value = false
  onMerchantChange(merchant.id)
}

async function onMerchantChange(merchantId: number | null) {
  orderForm.items = []
  if (!merchantId) {
    listingOptions.value = []
    return
  }
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.get<{
      code: number
      message?: string
      data?: { list: any[] }
    }>('/admin/catalog/listings', {
      params: { merchantId, status: 'ON_SALE', pageSize: 999 },
    })
    if (res.code === 200) {
      listingOptions.value = res.data?.list || []
    }
  } catch {
    listingOptions.value = []
  }
}

function addItem() {
  orderForm.items.push({ platformProductId: null, price: 0, quantity: 1 })
}

function removeItem(idx: number) {
  orderForm.items.splice(idx, 1)
}

function onProductChange(idx: number) {
  const item = orderForm.items[idx]
  if (!item) return
  const listing = listingOptions.value.find((l) => l.id === item.platformProductId)
  if (listing) {
    item.price = listing.salePrice
    calcTotal()
  }
}

function calcTotal() {
  // reactive auto-updates
}

async function handleSubmit() {
  if (!orderForm.merchantId) {
    ElMessage.warning('请选择商户')
    return
  }
  if (!orderForm.customerId) {
    ElMessage.warning('请选择客户')
    return
  }
  if (!orderForm.items.length) {
    ElMessage.warning('请至少添加一个商品')
    return
  }
  submitLoading.value = true
  try {
    const payload = {
      customerId: orderForm.customerId,
      merchantId: orderForm.merchantId,
      items: orderForm.items.map((it) => ({
        platformProductId: it.platformProductId,
        quantity: it.quantity,
      })),
      addressSnapshot: orderForm.addressSnapshot,
      remark: orderForm.remark,
      markAsPaid: orderForm.markAsPaid,
    }
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.post<{ code: number; message?: string; data: any }>(
      '/admin/orders/create-for-merchant',
      payload,
    )
    if (res.code === 200) {
      orderResult.value = res.data
      resultVisible.value = true
      ElMessage.success('订单已创建，已通过 WebSocket 通知商户')
    } else {
      ElMessage.error(res.message || '创建订单失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || error?.message || '创建订单失败')
  } finally {
    submitLoading.value = false
  }
}

async function createVirtualCustomer() {
  if (!virtualForm.nickname) {
    ElMessage.warning('昵称为必填项')
    return
  }
  virtualLoading.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.post<{ code: number; message?: string; data: any }>(
      '/admin/customers/virtual',
      {
        nickname: virtualForm.nickname,
        email: virtualForm.email || undefined,
        virtualRemark: virtualForm.remark || undefined,
      },
    )
    if (res.code === 200) {
      ElMessage.success('虚拟客户已创建')
      virtualDialogVisible.value = false
      customerOptions.value.unshift(res.data)
      orderForm.customerId = res.data.id
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || error?.message || '创建虚拟客户失败')
  } finally {
    virtualLoading.value = false
  }
}

function resetVirtualForm() {
  virtualForm.nickname = ''
  virtualForm.email = ''
  virtualForm.remark = ''
}
</script>

<style scoped>
.order-create-page {
  padding: 20px;
}
.order-item-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}
.merchant-picker {
  display: flex;
  width: 100%;
  gap: 8px;
}
.dialog-search {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
