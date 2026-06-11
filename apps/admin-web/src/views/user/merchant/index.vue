<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="tableData"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="fetchData"
    >
      <template #tableOperationLeft>
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['merchant:add']" @click="openCreate">
          Create Merchant
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['merchant:edit']" @click="openEdit(row)">编辑</el-button>
        <el-popconfirm
          :title="row.status === 'ENABLE' ? 'Disable this merchant?' : 'Enable this merchant?'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 'ENABLE' ? 'danger' : 'success'" v-permission="['merchant:edit']">
              {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? 'Edit Merchant' : 'Create Merchant'" width="600" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="邮箱" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="店铺名称" prop="name"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="国家" prop="country"><el-input v-model="editForm.country" /></el-form-item>
        <el-form-item label="语言" prop="language"><el-input v-model="editForm.language" /></el-form-item>
        <el-form-item label="联系人"><el-input v-model="editForm.contactName" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="editForm.contactPhone" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { merchantApi } from '@/api/merchant'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'MerchantListView' })

const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)

const editForm = reactive({
  id: '' as string | number,
  email: '',
  password: '',
  name: '',
  phone: '',
  country: '',
  language: '',
  contactName: '',
  contactPhone: '',
})

const formRules: FormRules = {
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  name: [{ required: true, message: 'Shop name is required', trigger: 'blur' }],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Keyword', prop: 'keyword', type: 'elInput', attrs: { placeholder: 'Search...', clearable: true } },
  { label: 'Status', prop: 'status', type: 'elSelect', attrs: { placeholder: 'Select status', options: STATUS_OPTIONS, clearable: true } },
  { label: 'Country', prop: 'country', type: 'elInput', attrs: { placeholder: 'Country', clearable: true } },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'merchantId', label: 'Merchant ID', minWidth: 100 },
  { prop: 'shopName', label: 'Shop Name', minWidth: 150 },
  { prop: 'email', label: 'Email', minWidth: 180 },
  { prop: 'phone', label: 'Phone', minWidth: 130 },
  { prop: 'country', label: 'Country', width: 90 },
  { prop: 'language', label: 'Language', width: 90 },
  { prop: 'productCount', label: 'Products', width: 90 },
  { prop: 'totalSales', label: 'Total Sales', width: 110 },
  { prop: 'balance', label: 'Balance', width: 100 },
  { prop: 'frozenBalance', label: 'Frozen', width: 100 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 150, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await merchantApi.getMerchants({ ...queryForm, page, pageSize })
    if (res.code === 200) { tableData.value = res.data?.list || []; total.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.email = ''
  editForm.password = ''
  editForm.name = ''
  editForm.phone = ''
  editForm.country = ''
  editForm.language = ''
  editForm.contactName = ''
  editForm.contactPhone = ''
  formRef.value?.resetFields()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = async (row: any) => {
  try {
    const { data: res } = await merchantApi.getMerchants({ merchantId: row.merchantId || row.id, page: 1, pageSize: 1 })
    const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row
    Object.assign(editForm, {
      id: d.id || row.id,
      email: d.email || row.email || '',
      name: d.shopName || d.name || row.shopName || '',
      phone: d.phone || row.phone || '',
      country: d.country || row.country || '',
      language: d.language || row.language || '',
      contactName: d.contactName || row.contactName || '',
      contactPhone: d.contactPhone || row.contactPhone || '',
    })
    dialogVisible.value = true
  } catch {
    Object.assign(editForm, {
      id: row.id,
      email: row.email || '',
      name: row.shopName || '',
      phone: row.phone || '',
      country: row.country || '',
      language: row.language || '',
    })
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload = {
      email: editForm.email, shopName: editForm.name, nickname: editForm.name, phone: editForm.phone,
      country: editForm.country, language: editForm.language,
      contactName: editForm.contactName, contactPhone: editForm.contactPhone,
    }
    let res
    if (editForm.id) {
      res = await merchantApi.updateMerchant(editForm.id, payload)
    } else {
      res = await merchantApi.createMerchant({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? 'Merchant updated' : 'Merchant created')
      dialogVisible.value = false
      editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage()
    } else {
      ElMessage.error(res.data.message || '操作失败')
    }
  } catch { ElMessage.error('操作失败') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await merchantApi.updateMerchantStatus(row.id, newStatus)
    if (res.code === 200) { ElMessage.success('状态已更新'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || '状态更新失败') }
  } catch { ElMessage.error('状态更新失败') }
}
</script>
