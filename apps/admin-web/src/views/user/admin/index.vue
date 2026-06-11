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
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          v-permission="['admin:add']"
          @click="openCreate"
        >
          新增管理员
        </el-button>
      </template>
      <template #role="{ row }">
        <BaseTag :type="row.role === 'SUPER_ADMIN' ? 'danger' : 'warning'" :text="row.role" />
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(ADMIN_STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(ADMIN_STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['admin:edit']" @click="openEdit(row)"
          >编辑</el-button
        >
        <el-button
          type="warning"
          link
          v-permission="['admin:password']"
          @click="openResetPassword(row)"
          >重置密码</el-button
        >
        <el-popconfirm
          :title="row.status === 1 ? '确定要禁用该管理员吗？' : '确定要启用该管理员吗？'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggle状态(row)"
        >
          <template #reference>
            <el-button
              link
              :type="row.status === 1 ? 'danger' : 'success'"
              v-permission="['admin:edit']"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          title="确定要删除该管理员吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['admin:delete']">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog
      v-model="dialogVisible"
      :title="editForm.id ? '编辑管理员' : '新增管理员'"
      width="550"
      @close="dialogVisible = false"
    >
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="邮箱" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="editForm.role" style="width: 100%">
            <el-option label="ADMIN" value="ADMIN" />
            <el-option label="SUPER_ADMIN" value="SUPER_ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="国家"><el-input v-model="editForm.country" /></el-form-item>
        <el-form-item label="语言"><el-input v-model="editForm.language" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </BaseDialog>

    <BaseDialog
      v-model="passwordVisible"
      title="重置密码"
      width="450"
      @close="passwordVisible = false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="130px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordVisible = false">取消</el-button>
        <el-button type="primary" :loading="passwordSubmitLoading" @click="handleResetPassword"
          >确认</el-button
        >
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
  email: [{ required: true, message: '邮箱 is required', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const passwordRules: FormRules = {
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

const ADMIN_STATUS_OPTIONS: DictItem<number>[] = [
  { label: '启用d', value: 1, color: 'success' },
  { label: '禁用d', value: 0, color: 'danger' },
]

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: '关键词',
    prop: 'keyword',
    type: 'elInput',
    attrs: { placeholder: '搜索邮箱/昵称', clearable: true },
  },
  {
    label: '角色',
    prop: 'role',
    type: 'elSelect',
    attrs: {
      placeholder: '请选择角色',
      options: [
        { label: 'ADMIN', value: 'ADMIN' },
        { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
      ],
      clearable: true,
    },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: { placeholder: '请选择状态', options: ADMIN_STATUS_OPTIONS, clearable: true },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'id', label: 'ID', minWidth: 80 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '手机号', minWidth: 130 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'role', label: '角色', width: 120 },
  { prop: 'country', label: '国家', width: 90 },
  { prop: 'language', label: '语言', width: 90 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'lastLoginAt', label: '最后登录', minWidth: 160 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 260, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await adminUserApi.getAdminUsers({ ...queryForm, page, pageSize })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch {
    /* ignore */
  } finally {
    loading.value = false
  }
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

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

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
      id: row.id,
      email: row.email || '',
      nickname: row.nickname || '',
      role: row.role || 'ADMIN',
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
      email: editForm.email,
      nickname: editForm.nickname,
      role: editForm.role,
      country: editForm.country,
      language: editForm.language,
    }
    let res
    if (editForm.id) {
      res = await adminUserApi.updateAdminUser(editForm.id, payload)
    } else {
      res = await adminUserApi.createAdminUser({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? 'Admin updated' : 'Admin created')
      dialogVisible.value = false
      editForm.id
        ? basePageRef.value?.refreshCurrentPage()
        : basePageRef.value?.refreshToFirstPage()
    } else {
      ElMessage.error(res.data.message || '操作失败')
    }
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleToggle状态 = async (row: any) => {
  const new状态 = row.status === 1 ? 0 : 1
  try {
    const { data: res } = await adminUserApi.updateAdminUser状态(row.id, new状态)
    if (res.code === 200) {
      ElMessage.success('状态已更新')
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch {
    ElMessage.error('状态更新失败')
  }
}

const handleDelete = async (id: string | number) => {
  try {
    const { data: res } = await adminUserApi.deleteAdminUser(id)
    if (res.code === 200) {
      ElMessage.success('管理员已删除')
      basePageRef.value?.refreshAfterDelete(1)
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
  }
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
    const resp = await adminUserApi.resetAdminUserPassword(
      passwordForm.adminId,
      passwordForm.newPassword,
    )
    if (resp.data.code === 200) {
      ElMessage.success('密码重置成功')
      passwordVisible.value = false
    } else {
      ElMessage.error(resp.data.message || '重置失败')
    }
  } catch {
    ElMessage.error('重置失败')
  } finally {
    passwordSubmitLoading.value = false
  }
}
</script>
