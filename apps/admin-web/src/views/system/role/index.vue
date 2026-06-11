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
      @selection-change="onSelectionChange"
    >
      <template #tableOperationLeft>
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['role:add']" @click="openCreate">
          Add Role
        </el-button>
        <el-button type="danger" :icon="menuStore.iconComponents.Delete"
          :disabled="selectedIds.length === 0" v-permission="['role:delete']" @click="batchDelete">
          Batch Delete
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag :type="getColorByValue(STATUS_OPTIONS, row.status)" :text="getLabelByValue(STATUS_OPTIONS, row.status)" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['role:edit']" @click="openEdit(row)">编辑</el-button>
        <el-button type="info" link v-permission="['role:assign']" @click="openAssignMenus(row)">分配菜单</el-button>
        <el-popconfirm
          :title="row.status === 'active' ? 'Disable this role?' : 'Enable this role?'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 'active' ? 'danger' : 'success'" v-permission="['role:edit']">
              {{ row.status === 'active' ? 'Disable' : 'Enable' }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          title="确定要删除该角色吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['role:delete']">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? 'Edit Role' : 'Create Role'" width="500" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="100px">
        <el-form-item label="代码" prop="code"><el-input v-model="editForm.code" :disabled="!!editForm.id" /></el-form-item>
        <el-form-item label="名称" prop="name"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="editForm.sort" :min="0" style="width:100%" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio v-for="item in STATUS_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </BaseDialog>

    <BaseDialog v-model="menuVisible" title="分配菜单" width="500" @close="menuVisible = false">
      <el-tree
        ref="menuTreeRef"
        :data="menuTreeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        :props="{ children: 'children', label: 'title' }"
        default-expand-all
      />
      <template #footer>
        <el-button @click="menuVisible = false">取消</el-button>
        <el-button type="primary" :loading="menuSubmitLoading" @click="handleAssignMenus">保存</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { roleApi, rolePage } from '@/api/role'
import { menuPage } from '@/api/menu'
import { Dialog } from '@/utils/dialog'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'

defineOptions({ name: 'RoleListView' })

const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')
const menuTreeRef = useTemplateRef<InstanceType<typeof ElTree>>('menuTreeRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<string[]>([])
const dialogVisible = ref(false)
const submitLoading = ref(false)
const menuVisible = ref(false)
const menuSubmitLoading = ref(false)
const menuTreeData = ref<any[]>([])
const checkedMenuIds = ref<string[]>([])
const currentRoleId = ref<string>('')

const editForm = reactive({
  id: '' as string,
  code: '',
  name: '',
  description: '',
  sort: 0,
  status: 'active' as string,
})

const formRules: FormRules = {
  code: [{ required: true, message: 'Role code is required', trigger: 'blur' }],
  name: [{ required: true, message: 'Role name is required', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Code', prop: 'code', type: 'elInput', attrs: { placeholder: 'Search code...', clearable: true } },
  { label: 'Name', prop: 'name', type: 'elInput', attrs: { placeholder: 'Search name...', clearable: true } },
  { label: 'Status', prop: 'status', type: 'elSelect', attrs: { placeholder: 'Select', options: STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'code', label: 'Code', minWidth: 160 },
  { prop: 'name', label: 'Name', minWidth: 160 },
  { prop: 'sort', label: 'Sort', width: 80 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'createTime', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 300, fixed: 'right' },
])

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedIds.value = rows.map((r) => r.id as string)
}

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number, sortField?: string, sortOrder?: string) => {
  loading.value = true
  try {
    const normalizedSortOrder = sortOrder === 'asc' || sortOrder === 'desc' || sortOrder === '' ? sortOrder : undefined
    const { data: res } = await rolePage({ ...queryForm, page, pageSize, sortOrder: normalizedSortOrder })
    if (res.code === 200) { tableData.value = res.data?.list || []; total.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.code = ''
  editForm.name = ''
  editForm.description = ''
  editForm.sort = 0
  editForm.status = 'active'
  formRef.value?.resetFields()
}

const openCreate = () => { resetForm(); dialogVisible.value = true }

const openEdit = async (row: any) => {
  try {
    const { data: res } = await roleApi.getRoleDetail(row.id)
    if (res.code === 200) {
      const d = res.data || row
      editForm.id = d.id || row.id
      editForm.code = d.code || row.code
      editForm.name = d.name || row.name
      editForm.description = d.description || row.description || ''
      editForm.sort = d.sort ?? row.sort ?? 0
      editForm.status = d.status || row.status
      dialogVisible.value = true
    }
  } catch {
    Object.assign(editForm, { id: row.id, code: row.code, name: row.name, description: row.description || '', sort: row.sort ?? 0, status: row.status })
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload = { code: editForm.code, name: editForm.name, description: editForm.description, sort: editForm.sort, status: editForm.status }
    const { data: res } = editForm.id ? await roleApi.updateRole(editForm.id, payload) : await roleApi.createRole(payload)
    if (res.code === 200) {
      ElMessage.success(editForm.id ? 'Role updated' : 'Role created')
      dialogVisible.value = false
      editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage()
    } else { ElMessage.error(res.message || '操作失败') }
  } catch { ElMessage.error('操作失败') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const status = row.status === 'active' ? 'inactive' : 'active'
  try {
    const { data: res } = await roleApi.updateRoleStatus(row.id, status)
    if (res.code === 200) { ElMessage.success('状态已更新'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || '状态更新失败') }
  } catch { ElMessage.error('状态更新失败') }
}

const handleDelete = async (id: string) => {
  try {
    const { data: res } = await roleApi.deleteRole(id)
    if (res.code === 200) { ElMessage.success('角色已删除'); basePageRef.value?.refreshAfterDelete(1) }
    else { ElMessage.error(res.message || '删除失败') }
  } catch { ElMessage.error('删除失败') }
}

const batchDelete = () => {
  Dialog.confirm({
    title: 'Delete Roles',
    content: `Are you sure you want to delete ${selectedIds.value.length} role(s)?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async () => {
      const responses = await Promise.all(selectedIds.value.map((id) => roleApi.deleteRole(id)))
      const failed = responses.find(({ data }) => data.code !== 200)
      if (!failed) { ElMessage.success('角色已删除'); basePageRef.value?.refreshAfterDelete(selectedIds.value.length) }
      else { ElMessage.error(failed.data.message || '删除失败') }
    },
  })
}

const openAssignMenus = async (row: any) => {
  currentRoleId.value = row.id
  checkedMenuIds.value = row.menuIds || []
  try {
    const { data: res } = await menuPage()
    if (res.code === 200) menuTreeData.value = res.data || []
  } catch { menuTreeData.value = [] }
  menuVisible.value = true
}

const handleAssignMenus = async () => {
  const checkedKeys = menuTreeRef.value?.getCheckedKeys(false) as string[] || []
  const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() as string[] || []
  menuSubmitLoading.value = true
  try {
    const { data: res } = await roleApi.assignMenus(currentRoleId.value, [...checkedKeys, ...halfCheckedKeys])
    if (res.code === 200) { ElMessage.success('菜单已分配'); menuVisible.value = false }
    else { ElMessage.error(res.message || '分配失败') }
  } catch { ElMessage.error('分配失败') } finally { menuSubmitLoading.value = false }
}
</script>
