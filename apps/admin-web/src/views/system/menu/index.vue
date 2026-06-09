<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="tableData"
      :columns="columns"
      :show-pagination="false"
      :show-export="false"
      :show-print="false"
      :table-loading="loading"
      :tableAttrs="{ rowKey: 'id', defaultExpandAll: true, treeProps: { children: 'children', hasChildren: 'hasChildren' } }"
      @refresh="fetchData"
    >
      <template #tableOperationLeft>
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['menu:add']" @click="openCreate">
          Add Menu
        </el-button>
      </template>
      <template #type="{ row }">
        <BaseTag v-if="row.type === 'DIRECTORY'" type="info" text="Directory" />
        <BaseTag v-else-if="row.type === 'MENU'" type="primary" text="Menu" />
        <BaseTag v-else-if="row.type === 'BUTTON'" type="warning" text="Button" />
        <span v-else>{{ row.type }}</span>
      </template>
      <template #icon="{ row }">
        <el-icon v-if="row.icon && menuStore.iconComponents[row.icon]">
          <component :is="menuStore.iconComponents[row.icon]" />
        </el-icon>
      </template>
      <template #status="{ row }">
        <BaseTag :type="getColorByValue(STATUS_OPTIONS, row.status)" :text="getLabelByValue(STATUS_OPTIONS, row.status)" />
      </template>
      <template #visible="{ row }">
        <BaseTag :type="row.visible !== false ? 'success' : 'info'" :text="row.visible !== false ? 'Yes' : 'No'" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['menu:edit']" @click="openEdit(row)">Edit</el-button>
        <el-popconfirm
          title="Delete this menu?"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['menu:delete']">Delete</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? 'Edit Menu' : 'Create Menu'" width="600" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="100px">
        <el-form-item label="Parent">
          <el-tree-select
            v-model="editForm.parentId"
            :data="parentOptions"
            :props="{ children: 'children', label: 'title', value: 'id' }"
            check-strictly
            clearable
            placeholder="Select parent (empty for top level)"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="App Type" prop="appType">
          <el-select v-model="editForm.appType" style="width:100%">
            <el-option label="ADMIN" value="ADMIN" />
            <el-option label="MERCHANT" value="MERCHANT" />
          </el-select>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="editForm.type" style="width:100%" @change="onTypeChange">
            <el-option label="Directory" value="DIRECTORY" />
            <el-option label="Menu" value="MENU" />
            <el-option label="Button" value="BUTTON" />
          </el-select>
        </el-form-item>
        <el-form-item label="Title" prop="title"><el-input v-model="editForm.title" /></el-form-item>
        <el-form-item label="Path" v-if="editForm.type !== 'BUTTON'"><el-input v-model="editForm.path" /></el-form-item>
        <el-form-item label="Component" v-if="editForm.type === 'MENU'"><el-input v-model="editForm.component" placeholder="e.g. user/customer/index" /></el-form-item>
        <el-form-item label="Icon" v-if="editForm.type !== 'BUTTON'"><el-input v-model="editForm.icon" placeholder="Icon name" /></el-form-item>
        <el-form-item label="Permission"><el-input v-model="editForm.permission" placeholder="e.g. customer:view" /></el-form-item>
        <el-form-item label="Sort"><el-input-number v-model="editForm.sort" :min="0" style="width:100%" /></el-form-item>
        <el-form-item label="Visible">
          <el-radio-group v-model="editForm.visible">
            <el-radio :value="true">Yes</el-radio>
            <el-radio :value="false">No</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="editForm.status">
            <el-radio v-for="item in STATUS_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Save</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { menuApi, menuPage } from '@/api/menu'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'MenuTreeView' })

const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')

const tableData = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const parentOptions = ref<any[]>([])

const editForm = reactive({
  id: '' as string,
  parentId: null as string | null,
  appType: 'ADMIN' as string,
  type: 'MENU' as string,
  title: '',
  path: '',
  component: '',
  icon: '',
  permission: '',
  sort: 0,
  visible: true,
  status: 'active' as string,
})

const formRules: FormRules = {
  appType: [{ required: true, message: 'App type is required', trigger: 'change' }],
  type: [{ required: true, message: 'Type is required', trigger: 'change' }],
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Title', prop: 'title', type: 'elInput', attrs: { placeholder: 'Search...', clearable: true } },
  { label: 'Path', prop: 'path', type: 'elInput', attrs: { placeholder: 'Path', clearable: true } },
  {
    label: 'App Type', prop: 'appType', type: 'elSelect', attrs: {
      placeholder: 'Select',
      options: [{ label: 'ADMIN', value: 'ADMIN' }, { label: 'MERCHANT', value: 'MERCHANT' }],
      clearable: true,
    },
  },
  {
    label: 'Type', prop: 'type', type: 'elSelect', attrs: {
      placeholder: 'Select',
      options: [{ label: 'Directory', value: 'DIRECTORY' }, { label: 'Menu', value: 'MENU' }, { label: 'Button', value: 'BUTTON' }],
      clearable: true,
    },
  },
  { label: 'Status', prop: 'status', type: 'elSelect', attrs: { placeholder: 'Select', options: STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { prop: 'title', label: 'Title', minWidth: 200 },
  { prop: 'type', label: 'Type', width: 100 },
  { prop: 'path', label: 'Path', minWidth: 200 },
  { prop: 'icon', label: 'Icon', width: 80 },
  { prop: 'permission', label: 'Permission', minWidth: 150 },
  { prop: 'visible', label: 'Visible', width: 80 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'sort', label: 'Sort', width: 70 },
  { prop: 'createTime', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 150, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>) => {
  loading.value = true
  try {
    const { data: res } = await menuPage(queryForm)
    if (res.code === 200) { tableData.value = res.data || []; parentOptions.value = res.data || [] }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.parentId = null
  editForm.appType = 'ADMIN'
  editForm.type = 'MENU'
  editForm.title = ''
  editForm.path = ''
  editForm.component = ''
  editForm.icon = ''
  editForm.permission = ''
  editForm.sort = 0
  editForm.visible = true
  editForm.status = 'active'
  formRef.value?.resetFields()
}

const onTypeChange = (val: string) => {
  if (val === 'BUTTON') { editForm.path = ''; editForm.component = ''; editForm.icon = '' }
}

const openCreate = () => { resetForm(); dialogVisible.value = true }

const openEdit = (row: any) => {
  Object.assign(editForm, {
    id: row.id, parentId: row.parentId ?? null, appType: row.appType || 'ADMIN', type: row.type || 'MENU',
    title: row.title, path: row.path || '', component: row.component || '', icon: row.icon || '',
    permission: row.permission || '', sort: row.sort ?? 0, visible: row.visible !== false, status: row.status || 'active',
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload: Record<string, unknown> = {
      parentId: editForm.parentId, appType: editForm.appType, type: editForm.type,
      title: editForm.title, path: editForm.path || undefined, component: editForm.component || undefined,
      icon: editForm.icon || undefined, permission: editForm.permission || undefined,
      sort: editForm.sort, visible: editForm.visible, status: editForm.status,
    }
    const { data: res } = editForm.id
      ? await menuApi.updateMenu(editForm.id, payload)
      : await menuApi.createMenu(payload)
    if (res.code === 200) {
      ElMessage.success(editForm.id ? 'Menu updated' : 'Menu created')
      dialogVisible.value = false
      basePageRef.value?.refreshCurrentPage()
    } else { ElMessage.error(res.message || 'Operation failed') }
  } catch { ElMessage.error('Operation failed') } finally { submitLoading.value = false }
}

const handleDelete = async (id: string) => {
  try {
    const { data: res } = await menuApi.deleteMenu(id)
    if (res.code === 200) { ElMessage.success('Menu deleted'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || 'Delete failed') }
  } catch { ElMessage.error('Delete failed') }
}
</script>
