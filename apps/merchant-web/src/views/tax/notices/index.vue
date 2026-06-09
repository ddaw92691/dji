<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="noticeList"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="fetchNotices"
    >
      <template #status="{ row }">
        <el-tag :type="statusColors[row.status] || 'info'" size="small">{{ row.status }}</el-tag>
      </template>
      <template #amount="{ row }">
        <span>{{ row.amount }} {{ row.currency }}</span>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="openDetail(row)">Detail</el-button>
        <el-button
          v-if="row.status === 'PENDING' || row.status === 'OVERDUE'"
          link type="warning"
          @click="openSubmitProof(row)"
        >Submit Proof</el-button>
      </template>
    </BasePage>

    <el-dialog v-model="detailVisible" title="Tax Notice Detail" width="600px">
      <div v-if="detailItem">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="Title">{{ detailItem.title }}</el-descriptions-item>
          <el-descriptions-item label="Type">{{ detailItem.taxType }}</el-descriptions-item>
          <el-descriptions-item label="Amount">{{ detailItem.amount }} {{ detailItem.currency }}</el-descriptions-item>
          <el-descriptions-item label="Status">{{ detailItem.status }}</el-descriptions-item>
          <el-descriptions-item label="Due Date">{{ detailItem.dueAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Paid At">{{ detailItem.paidAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Content">{{ detailItem.content }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="detailItem.paymentProof" style="margin-top: 12px">
          <strong>Payment Proof:</strong>
          <el-image :src="detailItem.paymentProof" style="max-width: 100%; max-height: 300px; display: block; margin-top: 8px" fit="contain" />
        </div>
        <div v-if="detailItem.rejectReason" style="margin-top: 12px; color: #f56c6c">
          <strong>Reject Reason:</strong> {{ detailItem.rejectReason }}
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="proofVisible" title="Submit Payment Proof" width="500px" @close="resetProofForm">
      <el-form ref="proofFormRef" :model="proofForm" label-width="120px">
        <el-form-item label="Payment Method">
          <el-input v-model="proofForm.paymentMethod" placeholder="e.g. Bank Transfer" />
        </el-form-item>
        <el-form-item label="Payment Proof">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="onProofUpload"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button>Upload Proof</el-button>
          </el-upload>
          <el-image v-if="proofForm.paymentProof" :src="proofForm.paymentProof" style="width: 100px; height: 100px; margin-top: 8px; border-radius: 4px" fit="cover" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="proofForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="proofVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="proofLoading" @click="handleSubmitProof">Submit</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import type { IFormConfig } from '@/types/components/page'
import { storage, STORAGE_KEYS } from '@/utils/storage'

defineOptions({ name: 'TaxNoticesView' })

const basePageRef = useTemplateRef('basePageRef')

const noticeList = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'

const statusColors: Record<string, TagType> = {
  PENDING: 'warning', OVERDUE: 'danger', PAID: 'success', SUBMITTED: 'primary', CANCELLED: 'info',
}

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: 'Status', prop: 'status', type: 'elSelect', attrs: {
      placeholder: 'Select status',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Overdue', value: 'OVERDUE' },
        { label: 'Paid', value: 'PAID' },
        { label: 'Submitted', value: 'SUBMITTED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
      clearable: true,
    },
  },
])

const columns = ref([
  { prop: 'title', label: 'Title', minWidth: 160 },
  { prop: 'taxType', label: 'Type', width: 120 },
  { prop: 'amount', label: 'Amount', width: 140 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'dueAt', label: 'Due', width: 160 },
  { prop: 'paidAt', label: 'Paid At', width: 160 },
  { prop: 'operation', label: 'Actions', width: 160, fixed: 'right' },
])

const detailVisible = ref(false)
const detailItem = ref<any>(null)

const proofVisible = ref(false)
const proofFormRef = ref()
const proofLoading = ref(false)
const proofTargetId = ref<number | null>(null)
const proofForm = reactive({
  paymentMethod: '',
  paymentProof: '',
  remark: '',
})

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/image`
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${storage.get<string>(STORAGE_KEYS.TOKEN)}`,
}))

async function fetchNotices(queryForm: Record<string, unknown>, page: number, pageSize: number) {
  loading.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.get<{ code: number; data: { list: any[]; total: number } }>('/merchant/tax/notices', {
      params: { ...queryForm, page, pageSize },
    })
    if (res.code === 200) {
      noticeList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } finally { loading.value = false }
}

function openDetail(row: any) {
  detailItem.value = row
  detailVisible.value = true
}

function openSubmitProof(row: any) {
  proofTargetId.value = row.id
  resetProofForm()
  proofVisible.value = true
}

function resetProofForm() {
  proofForm.paymentMethod = ''
  proofForm.paymentProof = ''
  proofForm.remark = ''
}

function onProofUpload(res: any) {
  if (res.code === 200 && res.data?.url) {
    proofForm.paymentProof = res.data.url
  }
}

async function handleSubmitProof() {
  if (!proofTargetId.value) return
  proofLoading.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.post(`/merchant/tax/notices/${proofTargetId.value}/payment-proof`, {
      method: proofForm.paymentMethod,
      proof: proofForm.paymentProof,
      remark: proofForm.remark,
    })
    if (res.code === 200) {
      ElMessage.success('Proof submitted')
      proofVisible.value = false
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || 'Submit failed')
    }
  } catch {
    ElMessage.error('Submit failed')
  } finally {
    proofLoading.value = false
  }
}

onMounted(() => {
  // first load handled by BasePage
})
</script>
