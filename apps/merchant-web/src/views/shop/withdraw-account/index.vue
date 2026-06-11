<template>
  <div class="wa-page">
    <BaseCard title="提款账户" title-icon="HOutline:CreditCardIcon">
      <div class="toolbar">
        <el-button type="primary" @click="openCreate">新增账户</el-button>
      </div>

      <el-table :data="accounts" border v-loading="loading">
        <el-table-column label="类型" width="100">
          <template #default="{ row }">{{ row.type === 'CRYPTO' ? '加密货币' : '银行' }}</template>
        </el-table-column>
        <el-table-column label="账户信息" min-width="300">
          <template #default="{ row }">
            <template v-if="row.type === 'CRYPTO'">{{ row.chain }} · {{ maskSensitive(row.address, 6, 4) }}</template>
            <template v-else>{{ row.bankName }} · {{ maskSensitive(row.accountNo, 4, 4) }} · {{ row.accountName }}</template>
          </template>
        </el-table-column>
        <el-table-column label="默认" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="success" size="small">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-if="!row.isDefault" link type="primary" @click="setDefault(row)">设默认</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该账户吗？" @confirm="remove(row)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && accounts.length === 0" description="暂未绑定提款账户" />
    </BaseCard>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑账户' : '新增账户'" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="账户类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="CRYPTO">加密货币</el-radio>
            <el-radio label="BANK">银行账户</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="form.type === 'CRYPTO'">
          <el-form-item label="链类型" prop="chain">
            <el-select v-model="form.chain" placeholder="请选择" style="width: 100%">
              <el-option label="TRC20 (USDT)" value="TRC20" />
              <el-option label="ERC20 (USDT)" value="ERC20" />
              <el-option label="BTC" value="BTC" />
              <el-option label="其他" value="OTHER" />
            </el-select>
          </el-form-item>
          <el-form-item label="钱包地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入钱包地址" />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="银行名称" prop="bankName">
            <el-input v-model="form.bankName" />
          </el-form-item>
          <el-form-item label="银行账号" prop="accountNo">
            <el-input v-model="form.accountNo" />
          </el-form-item>
          <el-form-item label="开户名" prop="accountName">
            <el-input v-model="form.accountName" />
          </el-form-item>
          <el-form-item label="SWIFT" prop="swiftCode">
            <el-input v-model="form.swiftCode" placeholder="选填" />
          </el-form-item>
          <el-form-item label="国家/地区" prop="country">
            <el-input v-model="form.country" placeholder="选填" />
          </el-form-item>
        </template>

        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="选填" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="form.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { withdrawAccountApi, type IWithdrawAccount } from '@/api/withdrawAccount'

defineOptions({ name: 'WithdrawAccountView' })

const loading = ref(false)
const submitting = ref(false)
const accounts = ref<IWithdrawAccount[]>([])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const emptyForm = (): any => ({
  id: 0,
  type: 'CRYPTO',
  chain: '',
  address: '',
  bankName: '',
  accountNo: '',
  accountName: '',
  swiftCode: '',
  country: '',
  remark: '',
  isDefault: false,
})
const form = reactive<any>(emptyForm())

const rules: FormRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  chain: [{ required: true, message: '请选择链类型', trigger: 'change' }],
  address: [{ required: true, message: '请输入钱包地址', trigger: 'blur' }],
  bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
  accountNo: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
  accountName: [{ required: true, message: '请输入开户名', trigger: 'blur' }],
}

const maskSensitive = (value?: string, prefix = 4, suffix = 4) => {
  if (!value) return '-'
  if (value.length <= prefix + suffix) return '****'
  return `${value.slice(0, prefix)}****${value.slice(-suffix)}`
}

const loadData = async () => {
  loading.value = true
  try {
    const { data: res } = await withdrawAccountApi.list()
    if (res.code === 200) accounts.value = res.data || []
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  Object.assign(form, emptyForm())
  formRef.value?.resetFields()
  dialogVisible.value = true
}

const openEdit = (row: IWithdrawAccount) => {
  Object.assign(form, emptyForm(), row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const payload: Partial<IWithdrawAccount> = {
      type: form.type,
      chain: form.chain,
      address: form.address,
      bankName: form.bankName,
      accountNo: form.accountNo,
      accountName: form.accountName,
      swiftCode: form.swiftCode,
      country: form.country,
      remark: form.remark,
      isDefault: form.isDefault,
    }
    const { data: res } = form.id
      ? await withdrawAccountApi.update(form.id, payload)
      : await withdrawAccountApi.create(payload)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } finally {
    submitting.value = false
  }
}

const setDefault = async (row: IWithdrawAccount) => {
  const { data: res } = await withdrawAccountApi.setDefault(row.id)
  if (res.code === 200) {
    ElMessage.success('已设为默认')
    loadData()
  }
}

const remove = async (row: IWithdrawAccount) => {
  const { data: res } = await withdrawAccountApi.remove(row.id)
  if (res.code === 200) {
    ElMessage.success('已删除')
    loadData()
  }
}

onMounted(loadData)
</script>

<style scoped>
.wa-page {
  padding: 16px;
}
.toolbar {
  margin-bottom: 12px;
}
</style>
