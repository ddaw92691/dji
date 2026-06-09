<template>
  <div class="withdrawal-page">
    <BaseCard title="Withdrawal Application" title-icon="HOutline:BanknotesIcon">
      <div class="balance-info">
        <span class="label">Available Balance:</span>
        <span class="value">${{ (balance ?? 0).toFixed(2) }}</span>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        class="withdrawal-form"
      >
        <el-form-item label="Amount" prop="amount">
          <el-input-number
            v-model="form.amount"
            :min="0"
            :max="balance ?? 0"
            :precision="2"
            :controls="false"
            placeholder="Enter withdrawal amount"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Bank Name" prop="bankName">
          <el-input v-model="form.bankName" placeholder="Enter bank name" />
        </el-form-item>

        <el-form-item label="Bank Account" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="Enter bank account number" />
        </el-form-item>

        <el-form-item label="Account Name" prop="accountName">
          <el-input v-model="form.accountName" placeholder="Enter account holder name" />
        </el-form-item>

        <el-form-item label="Remark" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="Optional remarks"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            Submit Withdrawal
          </el-button>
          <el-button @click="router.push('/finance/withdrawal-record')">
            View Records
          </el-button>
        </el-form-item>
      </el-form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { financeApi } from '@/api/finance'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'FinanceWithdrawalView' })

const router = useRouter()
const formRef = ref<FormInstance>()

const balance = ref<number>(0)
const submitting = ref(false)

const form = reactive({
  amount: null as number | null,
  bankName: '',
  bankAccount: '',
  accountName: '',
  remark: '',
})

const MIN_WITHDRAWAL = 1

const validateAmount = (_rule: any, value: any, callback: any) => {
  if (value == null || value <= 0) {
    callback(new Error(`Amount must be greater than 0`))
  } else if (value < MIN_WITHDRAWAL) {
    callback(new Error(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}`))
  } else if (balance.value !== null && value > balance.value) {
    callback(new Error(`Amount exceeds available balance`))
  } else {
    callback()
  }
}

const rules: FormRules = {
  amount: [
    { required: true, message: 'Please enter withdrawal amount', trigger: 'blur' },
    { validator: validateAmount, trigger: 'blur' },
  ],
  bankName: [{ required: true, message: 'Please enter bank name', trigger: 'blur' }],
  bankAccount: [{ required: true, message: 'Please enter bank account', trigger: 'blur' }],
  accountName: [{ required: true, message: 'Please enter account name', trigger: 'blur' }],
}

const fetchBalance = async () => {
  try {
    const { data: res } = await financeApi.getSummary()
    if (res.code !== 200) return
    balance.value = res.data?.balance ?? 0
  } catch {
    // handled by request interceptor
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const { data: res } = await financeApi.applyWithdrawal({
      ...form,
    })
    if (res.code !== 200) return
    ElMessage.success('Withdrawal application submitted successfully')
    router.push('/finance/withdrawal-record')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchBalance()
})
</script>

<style scoped>
.withdrawal-page {
  max-width: 640px;
}
.balance-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
}
.balance-info .label {
  font-size: 0.95rem;
  color: var(--el-text-color-secondary);
}
.balance-info .value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--el-color-primary);
}
.withdrawal-form {
  margin-top: 0.5rem;
}
</style>
