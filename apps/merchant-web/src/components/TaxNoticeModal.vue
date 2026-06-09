<template>
  <el-dialog
    :model-value="visible"
    :close-on-click-modal="!currentNotice?.blockUntilPaid"
    :close-on-press-escape="!currentNotice?.blockUntilPaid"
    :show-close="!currentNotice?.blockUntilPaid"
    width="520px"
    @close="handleClose"
  >
    <template #header>
      <span class="tax-modal-title">
        <el-icon v-if="currentNotice?.blockUntilPaid" style="color: #f56c6c; margin-right: 6px"><WarningFilled /></el-icon>
        {{ currentNotice?.title || 'Tax Notice' }}
      </span>
    </template>

    <div v-if="currentNotice" class="tax-notice-body">
      <el-alert
        v-if="currentNotice.blockUntilPaid"
        title="Action Required"
        type="error"
        description="This tax must be paid before you can continue using platform services."
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />

      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="Amount">
          <strong style="color: #f56c6c; font-size: 18px">{{ currentNotice.amount }} {{ currentNotice.currency }}</strong>
        </el-descriptions-item>
        <el-descriptions-item label="Type">{{ currentNotice.taxType }}</el-descriptions-item>
        <el-descriptions-item label="Status">
          <el-tag :type="currentNotice.status === 'OVERDUE' ? 'danger' : 'warning'" size="small">
            {{ currentNotice.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Due Date">{{ currentNotice.dueAt || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Content">{{ currentNotice.content }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="currentNotice.rejectReason" style="margin-top: 12px; color: #f56c6c">
        <strong>Previous submission rejected:</strong> {{ currentNotice.rejectReason }}
        <p style="margin-top: 4px">Please resubmit.</p>
      </div>

      <el-divider />

      <el-form label-width="110px" style="margin-top: 16px">
        <el-form-item label="Payment Method">
          <el-input v-model="submitForm.paymentMethod" placeholder="Bank Transfer, etc." />
        </el-form-item>
        <el-form-item label="Proof">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="onProofUpload"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button>Upload Proof</el-button>
          </el-upload>
          <el-image v-if="submitForm.paymentProof" :src="submitForm.paymentProof" style="width: 100px; height: 100px; margin-top: 8px; border-radius: 4px" fit="cover" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="submitForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>

      <div style="margin-top: 16px; display: flex; gap: 12px">
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          Submit Payment Proof
        </el-button>
        <el-button @click="handleContactSupport">
          Contact Platform Support
        </el-button>
      </div>
    </div>

    <template #footer v-if="!currentNotice?.blockUntilPaid">
      <el-button @click="handleClose">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaxNoticeStore } from '@/stores/taxNotice'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useTaxNoticeStore()

const visible = computed(() => store.showModal)
const currentNotice = computed(() => store.blockingNotices[0] || null)

const submitting = ref(false)
const submitForm = reactive({
  paymentMethod: '',
  paymentProof: '',
  remark: '',
})

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/image`
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${storage.get<string>(STORAGE_KEYS.TOKEN)}`,
}))

function onProofUpload(res: any) {
  if (res.code === 200 && res.data?.url) {
    submitForm.paymentProof = res.data.url
  }
}

async function handleSubmit() {
  if (!currentNotice.value) return
  submitting.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.post(`/merchant/tax/notices/${currentNotice.value.id}/payment-proof`, {
      method: submitForm.paymentMethod,
      proof: submitForm.paymentProof,
      remark: submitForm.remark,
    })
    if (res.code === 200) {
      ElMessage.success('Proof submitted')
      submitForm.paymentMethod = ''
      submitForm.paymentProof = ''
      submitForm.remark = ''
      store.fetchBlockingNotices()
    } else {
      ElMessage.error(res.message || 'Submit failed')
    }
  } catch {
    ElMessage.error('Submit failed')
  } finally {
    submitting.value = false
  }
}

function handleContactSupport() {
  router.push('/support/platform')
}

function handleClose() {
  // Only closable if not blocking
}
</script>

<style scoped>
.tax-modal-title { display: flex; align-items: center; font-size: 16px; font-weight: 600; }
.tax-notice-body { max-height: 70vh; overflow-y: auto; }
</style>
