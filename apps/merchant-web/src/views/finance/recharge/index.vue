<template>
  <div class="recharge-page">
    <BaseCard title="账户充值" title-icon="HOutline:WalletIcon">
      <div class="balance-info">
        <span class="label">可用余额：</span>
        <span class="value">{{ (balance ?? 0).toFixed(2) }}</span>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="recharge-form">
        <el-form-item label="充值金额" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            :controls="false"
            placeholder="请输入充值金额"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="充值方式" prop="method">
          <el-select v-model="form.method" placeholder="请选择" style="width: 100%">
            <el-option label="加密货币" value="CRYPTO" />
            <el-option label="银行转账" value="BANK" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付凭证" prop="proofUrl">
          <el-upload
            :show-file-list="false"
            :http-request="handleUpload"
            accept="image/*"
          >
            <el-button type="primary" plain :loading="uploading">上传凭证</el-button>
          </el-upload>
          <el-image
            v-if="form.proofUrl"
            :src="form.proofUrl"
            :preview-src-list="[form.proofUrl]"
            class="proof-img"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交充值申请</el-button>
        </el-form-item>
      </el-form>
    </BaseCard>

    <BaseCard title="充值记录" title-icon="HOutline:ClockIcon" class="record-card">
      <el-table :data="records" border v-loading="loading">
        <el-table-column prop="rechargeNo" label="充值单号" min-width="180" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="method" label="方式" width="110" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rejectReason" label="拒绝原因" min-width="140" />
        <el-table-column prop="createdAt" label="提交时间" min-width="170" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="loadRecords"
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus'
import { financeApi } from '@/api/finance'
import { rechargeApi } from '@/api/recharge'
import { uploadApi } from '@/api/upload'

defineOptions({ name: 'RechargeView' })

const formRef = ref<FormInstance>()
const balance = ref(0)
const submitting = ref(false)
const uploading = ref(false)
const loading = ref(false)
const records = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive<{ amount?: number; method: string; proofUrl: string; remark: string }>({
  amount: undefined,
  method: 'CRYPTO',
  proofUrl: '',
  remark: '',
})

const rules: FormRules = {
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value || Number(value) <= 0) callback(new Error('充值金额必须大于0'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
  method: [{ required: true, message: '请选择充值方式', trigger: 'change' }],
  proofUrl: [{ required: true, message: '请上传支付凭证', trigger: 'change' }],
}

const statusText = (status: string) => {
  const map: Record<string, string> = { PENDING: '待审核', PAID: '已入账', REJECTED: '已拒绝' }
  return map[status] || status || '-'
}

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'
const statusType = (status: string): TagType => {
  const map: Record<string, TagType> = { PENDING: 'warning', PAID: 'success', REJECTED: 'danger' }
  return map[status] || 'info'
}

const handleUpload = async (options: UploadRequestOptions) => {
  uploading.value = true
  try {
    const { data: res } = await uploadApi.postImage(options.file as File, 'recharge_proof')
    if (res.code === 200) {
      form.proofUrl = res.data?.url || res.data?.fileUrl || ''
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
  }
}

const loadBalance = async () => {
  const { data: res } = await financeApi.getSummary()
  if (res.code === 200) balance.value = res.data?.balance ?? 0
}

const loadRecords = async () => {
  loading.value = true
  try {
    const { data: res } = await rechargeApi.getRecharges({ page: page.value, pageSize: pageSize.value })
    if (res.code === 200) {
      records.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const { data: res } = await rechargeApi.submitRecharge({
      amount: form.amount,
      method: form.method,
      proofUrl: form.proofUrl,
      remark: form.remark,
    })
    if (res.code === 200) {
      ElMessage.success('充值申请已提交，等待审核')
      form.amount = undefined
      form.proofUrl = ''
      form.remark = ''
      page.value = 1
      loadRecords()
    } else {
      ElMessage.error(res.message || '提交失败')
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadBalance()
  loadRecords()
})
</script>

<style scoped>
.recharge-page {
  padding: 16px;
}
.balance-info {
  margin-bottom: 16px;
  font-size: 15px;
}
.balance-info .value {
  font-weight: 600;
  color: var(--el-color-primary);
}
.recharge-form {
  max-width: 520px;
}
.proof-img {
  width: 120px;
  height: 80px;
  margin-left: 12px;
  border-radius: 4px;
}
.record-card {
  margin-top: 16px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
