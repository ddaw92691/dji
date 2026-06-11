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
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['sys:role:add']" @click="openCreate">
          新增角色
        </el-button>
        <el-button type="danger" :icon="menuStore.iconComponents.Delete"
          :disabled="selectedIds.length === 0" v-permission="['sys:role:delete']" @click="batchDelete">
          批量删除
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag :type="getColorByValue(STATUS_OPTIONS, row.status)" :text="getLabelByValue(STATUS_OPTIONS, row.status)" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['sys:role:edit']" @click="openEdit(row)">编辑</el-button>
        <el-button type="info" link v-permission="['sys:role:edit']" @click="openAssignMenus(row)">分配菜单</el-button>
        <el-popconfirm
          :title="row.status === 'ENABLE' ? '确定禁用该角色吗？' : '确定启用该角色吗？'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 'ENABLE' ? 'danger' : 'success'" v-permission="['sys:role:edit']">
              {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
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
            <el-button type="danger" link v-permission="['sys:role:delete']">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? '编辑角色' : '新增角色'" width="500" @close="dialogVisible = false">
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

    <BaseDialog v-model="menuVisible" title="分配菜单权限" width="680" @close="menuVisible = false">
      <el-alert
        title="勾选代表该角色可访问对应功能；未勾选则该角色管理员不会拥有该菜单权限。"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 12px"
      />
      <el-tree
        ref="menuTreeRef"
        :data="menuTreeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        :props="{ children: 'children', label: 'title' }"
        check-strictly
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
  status: 'ENABLE' as string,
})

const formRules: FormRules = {
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: '编码', prop: 'code', type: 'elInput', attrs: { placeholder: '搜索角色编码', clearable: true } },
  { label: '名称', prop: 'name', type: 'elInput', attrs: { placeholder: '搜索角色名称', clearable: true } },
  { label: '状态', prop: 'status', type: 'elSelect', attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { type: 'selection', width: 55 },
  { type: 'index', label: '序号', width: 55, fixed: 'left' },
  { prop: 'code', label: '角色编码', minWidth: 160 },
  { prop: 'name', label: '角色名称', minWidth: 160 },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
])

const onSelectionChange = (rows: Record<string, unknown>[]) => {
  selectedIds.value = rows.map((r) => r.id as string)
}

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number, sortField?: string, sortOrder?: string) => {
  loading.value = true
  try {
    const normalizedSortOrder = sortOrder === 'asc' || sortOrder === 'desc' || sortOrder === '' ? sortOrder : undefined
    const { data: res } = await rolePage({ ...queryForm, page, pageSize, sortOrder: normalizedSortOrder })
    if (res.code === 200) {
      const payload = res.data as any
      const fullList = Array.isArray(payload) ? payload : payload?.list || []
      const code = String(queryForm.code || '').trim().toLowerCase()
      const name = String(queryForm.name || '').trim().toLowerCase()
      const status = String(queryForm.status || '').trim()
      const filtered = fullList.filter((role: any) => {
        if (code && !String(role.code || '').toLowerCase().includes(code)) return false
        if (name && !String(role.name || '').toLowerCase().includes(name)) return false
        if (status && role.status !== status) return false
        return true
      })
      total.value = Array.isArray(payload) ? filtered.length : payload?.total || filtered.length
      tableData.value = Array.isArray(payload) ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered
    }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.code = ''
  editForm.name = ''
  editForm.description = ''
  editForm.sort = 0
  editForm.status = 'ENABLE'
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
      ElMessage.success(editForm.id ? '角色已更新' : '角色已创建')
      dialogVisible.value = false
      editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage()
    } else { ElMessage.error(res.message || '操作失败') }
  } catch { ElMessage.error('操作失败') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const status = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
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
    title: '删除角色',
    content: `确定要删除选中的 ${selectedIds.value.length} 个角色吗？`,
    confirmText: '删除',
    cancelText: '取消',
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
  try {
    const [{ data: menuRes }, { data: roleMenuRes }] = await Promise.all([
      menuPage(),
      roleApi.getRoleMenus(row.id),
    ])
    menuTreeData.value = menuRes.code === 200 ? menuRes.data || [] : []
    checkedMenuIds.value = roleMenuRes.code === 200 ? (roleMenuRes.data || []).map((id: unknown) => String(id)) : []
  } catch {
    menuTreeData.value = []
    checkedMenuIds.value = []
  }
  menuVisible.value = true
}

const handleAssignMenus = async () => {
  const checkedKeys = menuTreeRef.value?.getCheckedKeys(false) as string[] || []
  const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() as string[] || []
  const menuIds = Array.from(new Set([...checkedKeys, ...halfCheckedKeys])).map((id) => Number(id))
  menuSubmitLoading.value = true
  try {
    const { data: res } = await roleApi.assignMenus(currentRoleId.value, menuIds)
    if (res.code === 200) { ElMessage.success('菜单已分配'); menuVisible.value = false }
    else { ElMessage.error(res.message || '分配失败') }
  } catch { ElMessage.error('分配失败') } finally { menuSubmitLoading.value = false }
}
</script>
