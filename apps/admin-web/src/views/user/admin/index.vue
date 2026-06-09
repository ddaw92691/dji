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
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['admin:add']" @click="openCreate">
          Create Admin
        </el-button>
      </template>
      <template #role="{ row }">
        <BaseTag :type="row.role === 'SUPER_ADMIN' ? 'danger' : 'warning'" :text="row.role" />
      </template>
      <template #status="{ row }">
        <BaseTag :type="getColorByValue(ADMIN_STATUS_OPTIONS, row.status)" :text="getLabelByValue(ADMIN_STATUS_OPTIONS, row.status)" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['admin:edit']" @click="openEdit(row)">Edit</el-button>
        <el-button type="warning" link v-permission="['admin:password']" @click="openResetPassword(row)">Reset Pwd</el-button>
        <el-popconfirm
          :title="row.status === 1 ? 'Disable this admin?' : 'Enable this admin?'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 1 ? 'danger' : 'success'" v-permission="['admin:edit']">
              {{ row.status === 1 ? 'Disable' : 'Enable' }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          title="Are you sure you want to delete this admin?"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['admin:delete']">Delete</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? 'Edit Admin' : 'Create Admin'" width="550" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="Email" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="Password" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Nickname"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="editForm.role" style="width:100%">
            <el-option label="ADMIN" value="ADMIN" />
            <el-option label="SUPER_ADMIN" value="SUPER_ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="Country"><el-input v-model="editForm.country" /></el-form-item>
        <el-form-item label="Language"><el-input v-model="editForm.language" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Save</el-button>
      </template>
    </BaseDialog>

    <BaseDialog v-model="passwordVisible" title="Reset Password" width="450" @close="passwordVisible = false">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="130px">
        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="passwordSubmitLoading" @click="handleResetPassword">Confirm</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { adminUserApi } from '@/api/adminUser'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { getLabelByValue, getColorByValue, type DictItem } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'AdminUserListView' })

const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')
const passwordFormRef = useTemplateRef<FormInstance>('passwordFormRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const passwordVisible = ref(false)
const passwordSubmitLoading = ref(false)

const editForm = reactive({
  id: '' as string | number,
  email: '',
  password: '',
  nickname: '',
  role: 'ADMIN' as string,
  country: '',
  language: '',
})

const passwordForm = reactive({
  adminId: '' as string | number,
  newPassword: '',
  confirmPassword: '',
})

const formRules: FormRules = {
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
  role: [{ required: true, message: 'Role is required', trigger: 'change' }],
}

const passwordRules: FormRules = {
  newPassword: [{ required: true, message: 'New password is required', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) callback(new Error('Passwords do not match'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

const ADMIN_STATUS_OPTIONS: DictItem<number>[] = [
  { label: 'Enabled', value: 1, color: 'success' },
  { label: 'Disabled', value: 0, color: 'danger' },
]

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Keyword', prop: 'keyword', type: 'elInput', attrs: { placeholder: 'Search email/nickname...', clearable: true } },
  { label: 'Role', prop: 'role', type: 'elSelect', attrs: { placeholder: 'Select role', options: [{ label: 'ADMIN', value: 'ADMIN' }, { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' }], clearable: true } },
  { label: 'Status', prop: 'status', type: 'elSelect', attrs: { placeholder: 'Select status', options: ADMIN_STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'id', label: 'ID', minWidth: 80 },
  { prop: 'email', label: 'Email', minWidth: 180 },
  { prop: 'phone', label: 'Phone', minWidth: 130 },
  { prop: 'nickname', label: 'Nickname', minWidth: 120 },
  { prop: 'role', label: 'Role', width: 120 },
  { prop: 'country', label: 'Country', width: 90 },
  { prop: 'language', label: 'Language', width: 90 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'lastLoginAt', label: 'Last Login', minWidth: 160 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 260, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await adminUserApi.getAdminUsers({ ...queryForm, page, pageSize })
    if (res.code === 200) { tableData.value = res.data?.list || []; total.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.email = ''
  editForm.password = ''
  editForm.nickname = ''
  editForm.role = 'ADMIN'
  editForm.country = ''
  editForm.language = ''
  formRef.value?.resetFields()
}

const openCreate = () => { resetForm(); dialogVisible.value = true }

const openEdit = async (row: any) => {
  try {
    const { data: res } = await adminUserApi.getAdminUsers({ id: row.id, page: 1, pageSize: 1 })
    const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row
    Object.assign(editForm, {
      id: d.id || row.id,
      email: d.email || row.email || '',
      nickname: d.nickname || row.nickname || '',
      role: d.role || row.role || 'ADMIN',
      country: d.country || row.country || '',
      language: d.language || row.language || '',
    })
    dialogVisible.value = true
  } catch {
    Object.assign(editForm, {
      id: row.id, email: row.email || '', nickname: row.nickname || '',
      role: row.role || 'ADMIN', country: row.country || '', language: row.language || '',
    })
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload = { email: editForm.email, nickname: editForm.nickname, role: editForm.role, country: editForm.country, language: editForm.language }
    let res
    if (editForm.id) {
      res = await adminUserApi.updateAdminUser(editForm.id, payload)
    } else {
      res = await adminUserApi.createAdminUser({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? 'Admin updated' : 'Admin created')
      dialogVisible.value = false
      editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage()
    } else { ElMessage.error(res.data.message || 'Operation failed') }
  } catch { ElMessage.error('Operation failed') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    const { data: res } = await adminUserApi.updateAdminUserStatus(row.id, newStatus)
    if (res.code === 200) { ElMessage.success('Status updated'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || 'Status update failed') }
  } catch { ElMessage.error('Status update failed') }
}

const handleDelete = async (id: string | number) => {
  try {
    const { data: res } = await adminUserApi.deleteAdminUser(id)
    if (res.code === 200) { ElMessage.success('Admin deleted'); basePageRef.value?.refreshAfterDelete(1) }
    else { ElMessage.error(res.message || 'Delete failed') }
  } catch { ElMessage.error('Delete failed') }
}

const openResetPassword = (row: any) => {
  passwordForm.adminId = row.id
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.resetFields()
  passwordVisible.value = true
}

const handleResetPassword = async () => {
  await passwordFormRef.value?.validate()
  passwordSubmitLoading.value = true
  try {
    const resp = await adminUserApi.resetAdminUserPassword(passwordForm.adminId, passwordForm.newPassword)
    if (resp.data.code === 200) {
      ElMessage.success('Password reset successfully')
      passwordVisible.value = false
    } else { ElMessage.error(resp.data.message || 'Reset failed') }
  } catch { ElMessage.error('Reset failed') } finally { passwordSubmitLoading.value = false }
}
</script>
