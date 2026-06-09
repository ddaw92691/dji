<template>
  <div class="tax-merchant-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option label="Pending" value="PENDING" />
          <el-option label="Overdue" value="OVERDUE" />
          <el-option label="Paid" value="PAID" />
          <el-option label="Submitted" value="SUBMITTED" />
          <el-option label="Cancelled" value="CANCELLED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.taxType" placeholder="Tax Type" clearable @change="handleSearch">
          <el-option label="Sales Tax" value="SALES_TAX" />
          <el-option label="Income Tax" value="INCOME_TAX" />
          <el-option label="Platform Fee" value="PLATFORM_FEE" />
          <el-option label="Other" value="OTHER" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-permission="'tax:create'" @click="openCreate">+ Create Notice</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="merchantName" label="Merchant" min-width="140" show-overflow-tooltip />
      <el-table-column prop="title" label="Title" min-width="160" show-overflow-tooltip />
      <el-table-column prop="taxType" label="Type" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="taxTypeColors[row.taxType] || 'info'" size="small">{{ row.taxType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="Amount" width="100" align="right" />
      <el-table-column prop="currency" label="Currency" width="80" align="center" />
      <el-table-column prop="status" label="Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusColors[row.status] || 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Flags" width="130" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.forcePopup" type="warning" size="small" effect="dark">Popup</el-tag>
          <el-tag v-if="row.blockUntilPaid" type="danger" size="small" effect="dark" style="margin-left: 4px">Block</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dueAt" label="Due" width="160" />
      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'tax:view'" @click="openDetail(row)">Detail</el-button>
          <el-button
            v-if="row.status === 'PENDING' || row.status === 'OVERDUE'"
            link type="warning"
            v-permission="'tax:edit'"
            @click="handleCancel(row)"
          >Cancel</el-button>
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

    <el-dialog v-model="createVisible" title="Create Tax Notice" width="600px" @close="resetCreateForm">
      <el-form ref="createFormRef" :model="createForm" label-width="130px">
        <el-form-item label="Merchant" required>
          <el-select v-model="createForm.merchantId" filterable remote :remote-method="searchMerchants" :loading="merchantLoading" placeholder="Search merchant" style="width:100%">
            <el-option v-for="m in merchantOptions" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Title" required>
          <el-input v-model="createForm.title" placeholder="Notice title" />
        </el-form-item>
        <el-form-item label="Content">
          <el-input v-model="createForm.content" type="textarea" :rows="4" placeholder="Notice content" />
        </el-form-item>
        <el-form-item label="Tax Type">
          <el-select v-model="createForm.taxType" style="width:100%">
            <el-option label="Sales Tax" value="SALES_TAX" />
            <el-option label="Income Tax" value="INCOME_TAX" />
            <el-option label="Platform Fee" value="PLATFORM_FEE" />
            <el-option label="Other" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Amount">
              <el-input-number v-model="createForm.amount" :min="0" :precision="2" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Currency">
              <el-input v-model="createForm.currency" placeholder="JPY" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Due Date">
          <el-date-picker v-model="createForm.dueAt" type="date" placeholder="Select date" style="width:100%" />
        </el-form-item>
        <el-form-item label="Force Popup">
          <el-checkbox v-model="createForm.forcePopup" />
        </el-form-item>
        <el-form-item label="Block Until Paid">
          <el-checkbox v-model="createForm.blockUntilPaid" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="createLoading" @click="handleCreate">Create</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="Tax Notice Detail" width="650px">
      <div v-if="detailItem">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="ID">{{ detailItem.id }}</el-descriptions-item>
          <el-descriptions-item label="Merchant">{{ detailItem.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="Title">{{ detailItem.title }}</el-descriptions-item>
          <el-descriptions-item label="Tax Type">{{ detailItem.taxType }}</el-descriptions-item>
          <el-descriptions-item label="Amount">{{ detailItem.amount }} {{ detailItem.currency }}</el-descriptions-item>
          <el-descriptions-item label="Status">{{ detailItem.status }}</el-descriptions-item>
          <el-descriptions-item label="Due Date">{{ detailItem.dueAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Paid At">{{ detailItem.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Force Popup">{{ detailItem.forcePopup ? 'Yes' : 'No' }}</el-descriptions-item>
          <el-descriptions-item label="Block Until Paid">{{ detailItem.blockUntilPaid ? 'Yes' : 'No' }}</el-descriptions-item>
          <el-descriptions-item label="Created">{{ detailItem.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="Updated">{{ detailItem.updatedAt }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="detailItem.content" style="margin-top: 12px">
          <strong>Content:</strong>
          <p style="white-space: pre-wrap; margin-top: 4px">{{ detailItem.content }}</p>
        </div>
        <div v-if="detailItem.paymentProof" style="margin-top: 12px">
          <strong>Payment Proof:</strong>
          <el-image :src="detailItem.paymentProof" style="max-width: 100%; max-height: 300px; margin-top: 4px; display: block" fit="contain" />
          <p v-if="detailItem.proofRemark" style="margin-top: 4px">Remark: {{ detailItem.proofRemark }}</p>
        </div>
        <div v-if="detailItem.paymentMethod" style="margin-top: 8px">
          <strong>Payment Method:</strong> {{ detailItem.paymentMethod }}
        </div>
        <div v-if="detailItem.rejectReason" style="margin-top: 8px; color: #f56c6c">
          <strong>Reject Reason:</strong> {{ detailItem.rejectReason }}
        </div>

        <div v-if="detailItem.status === 'SUBMITTED'" style="margin-top: 16px; border-top: 1px solid #ebeef5; padding-top: 12px">
          <strong>Review:</strong>
          <div style="margin-top: 8px; display: flex; gap: 8px">
            <el-button type="success" v-permission="'tax:review'" @click="handleReview(detailItem, true)">Approve</el-button>
            <el-button type="danger" v-permission="'tax:review'" @click="reviewRejectVisible = true; reviewTarget = detailItem">Reject</el-button>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewRejectVisible" title="Reject Reason" width="450px">
      <el-form>
        <el-form-item label="Reason">
          <el-input v-model="rejectReason" type="textarea" :rows="3" placeholder="Explain why the proof was rejected" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewRejectVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="reviewLoading" @click="handleReview(reviewTarget!, false)">Reject</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { taxApi, type TaxNotice } from '@/api/tax'

defineOptions({ name: 'TaxMerchantView' })

const loading = ref(false)
const tableData = ref<TaxNotice[]>([])
const total = ref(0)

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'

const statusColors: Record<string, TagType> = {
  PENDING: 'warning', OVERDUE: 'danger', PAID: 'success', SUBMITTED: 'primary', CANCELLED: 'info',
}
const taxTypeColors: Record<string, TagType> = {
  SALES_TAX: 'primary', INCOME_TAX: 'warning', PLATFORM_FEE: 'danger', OTHER: 'info',
}

const searchForm = reactive({
  merchantId: '',
  status: '',
  taxType: '',
  page: 1,
  pageSize: 20,
})

const createVisible = ref(false)
const createLoading = ref(false)
const merchantLoading = ref(false)
const merchantOptions = ref<any[]>([])
const createFormRef = ref()
const createForm = reactive({
  merchantId: null as number | null,
  title: '',
  content: '',
  taxType: 'OTHER',
  amount: 0,
  currency: 'JPY',
  dueAt: '' as string | Date,
  forcePopup: false,
  blockUntilPaid: false,
})

const detailVisible = ref(false)
const detailItem = ref<TaxNotice | null>(null)

const reviewRejectVisible = ref(false)
const reviewTarget = ref<TaxNotice | null>(null)
const rejectReason = ref('')
const reviewLoading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await taxApi.getTaxNotices({
      merchantId: searchForm.merchantId || undefined,
      status: searchForm.status || undefined,
      taxType: searchForm.taxType || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || 'Failed to fetch data')
    }
  } catch {
    ElMessage.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function openCreate() { resetCreateForm(); createVisible.value = true }
function resetCreateForm() {
  createForm.merchantId = null
  createForm.title = ''
  createForm.content = ''
  createForm.taxType = 'OTHER'
  createForm.amount = 0
  createForm.currency = 'JPY'
  createForm.dueAt = ''
  createForm.forcePopup = false
  createForm.blockUntilPaid = false
}

async function searchMerchants(query: string) {
  if (!query) return
  merchantLoading.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.get<{ code: number; data: { list: any[] } }>('/admin/merchants', { params: { keyword: query, pageSize: 20 } })
    if (res.code === 200) merchantOptions.value = res.data?.list || []
  } catch { /* ignore */ } finally { merchantLoading.value = false }
}

async function handleCreate() {
  if (!createForm.merchantId || !createForm.title) {
    ElMessage.warning('Merchant and title are required')
    return
  }
  createLoading.value = true
  try {
    const { data: res } = await taxApi.createTaxNotice({
      merchantId: createForm.merchantId,
      title: createForm.title,
      content: createForm.content,
      taxType: createForm.taxType,
      amount: createForm.amount,
      currency: createForm.currency,
      dueAt: createForm.dueAt || undefined,
      forcePopup: createForm.forcePopup,
      blockUntilPaid: createForm.blockUntilPaid,
    })
    if (res.code === 200) {
      ElMessage.success('Tax notice created')
      createVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Create failed')
    }
  } catch {
    ElMessage.error('Create failed')
  } finally {
    createLoading.value = false
  }
}

function openDetail(row: TaxNotice) {
  detailItem.value = row
  detailVisible.value = true
}

async function handleCancel(row: TaxNotice) {
  try {
    const { data: res } = await taxApi.cancelTaxNotice(row.id)
    if (res.code === 200) {
      ElMessage.success('Notice cancelled')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Cancel failed')
    }
  } catch {
    ElMessage.error('Cancel failed')
  }
}

async function handleReview(row: TaxNotice, approved: boolean) {
  reviewLoading.value = true
  try {
    const { data: res } = await taxApi.reviewTaxNotice(row.id, {
      approved,
      rejectReason: approved ? undefined : rejectReason.value,
    })
    if (res.code === 200) {
      ElMessage.success(approved ? 'Proof approved' : 'Proof rejected')
      reviewRejectVisible.value = false
      rejectReason.value = ''
      detailVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Review failed')
    }
  } catch {
    ElMessage.error('Review failed')
  } finally {
    reviewLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.tax-merchant-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
