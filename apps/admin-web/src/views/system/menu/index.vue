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
          新增菜单
        </el-button>
      </template>
      <template #type="{ row }">
        <BaseTag v-if="row.type === 'DIRECTORY'" type="info" text="目录" />
        <BaseTag v-else-if="row.type === 'MENU'" type="primary" text="菜单" />
        <BaseTag v-else-if="row.type === 'BUTTON'" type="warning" text="按钮" />
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
        <BaseTag :type="row.visible !== false ? 'success' : 'info'" :text="row.visible !== false ? '显示' : '隐藏'" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['menu:edit']" @click="openEdit(row)">编辑</el-button>
        <el-popconfirm
          title="确定要删除该菜单吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['menu:delete']">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? '编辑菜单' : '新增菜单'" width="600" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="100px">
        <el-form-item label="上级">
          <el-tree-select
            v-model="editForm.parentId"
            :data="parentOptions"
            :props="{ children: 'children', label: 'title', value: 'id' }"
            check-strictly
            clearable
            placeholder="选择上级（留空为顶级）"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <el-select v-model="editForm.appType" style="width:100%">
            <el-option label="ADMIN" value="ADMIN" />
            <el-option label="MERCHANT" value="MERCHANT" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="editForm.type" style="width:100%" @change="onTypeChange">
            <el-option label="目录" value="DIRECTORY" />
            <el-option label="菜单" value="MENU" />
            <el-option label="按钮" value="BUTTON" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title"><el-input v-model="editForm.title" /></el-form-item>
        <el-form-item label="路径" v-if="editForm.type !== 'BUTTON'"><el-input v-model="editForm.path" /></el-form-item>
        <el-form-item label="组件" v-if="editForm.type === 'MENU'"><el-input v-model="editForm.component" placeholder="e.g. user/customer/index" /></el-form-item>
        <el-form-item label="图标" v-if="editForm.type !== 'BUTTON'"><el-input v-model="editForm.icon" placeholder="图标名称" /></el-form-item>
        <el-form-item label="权限"><el-input v-model="editForm.permission" placeholder="e.g. customer:view" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="editForm.sort" :min="0" style="width:100%" /></el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="editForm.visible">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
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
  status: 'ENABLE' as string,
})

const formRules: FormRules = {
  appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: '标题', prop: 'title', type: 'elInput', attrs: { placeholder: '搜索标题', clearable: true } },
  { label: '路径', prop: 'path', type: 'elInput', attrs: { placeholder: '搜索路径', clearable: true } },
  {
    label: '应用类型', prop: 'appType', type: 'elSelect', attrs: {
      placeholder: '请选择',
      options: [{ label: '总后台', value: 'ADMIN' }, { label: '商家后台', value: 'MERCHANT' }],
      clearable: true,
    },
  },
  {
    label: '类型', prop: 'type', type: 'elSelect', attrs: {
      placeholder: '请选择',
      options: [{ label: '目录', value: 'DIRECTORY' }, { label: '菜单', value: 'MENU' }, { label: '按钮', value: 'BUTTON' }],
      clearable: true,
    },
  },
  { label: '状态', prop: 'status', type: 'elSelect', attrs: { placeholder: '请选择', options: STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { prop: 'title', label: '标题', minWidth: 200 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'path', label: '路径', minWidth: 200 },
  { prop: 'icon', label: '图标', width: 80 },
  { prop: 'permission', label: '权限标识', minWidth: 150 },
  { prop: 'visible', label: '显示', width: 80 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'sort', label: '排序', width: 70 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 150, fixed: 'right' },
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
  editForm.status = 'ENABLE'
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
    permission: row.permission || '', sort: row.sort ?? 0, visible: row.visible !== false, status: row.status || 'ENABLE',
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
      ElMessage.success(editForm.id ? '菜单已更新' : '菜单已创建')
      dialogVisible.value = false
      basePageRef.value?.refreshCurrentPage()
    } else { ElMessage.error(res.message || '操作失败') }
  } catch { ElMessage.error('操作失败') } finally { submitLoading.value = false }
}

const handleDelete = async (id: string) => {
  try {
    const { data: res } = await menuApi.deleteMenu(id)
    if (res.code === 200) { ElMessage.success('菜单已删除'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || '删除失败') }
  } catch { ElMessage.error('删除失败') }
}
</script>
