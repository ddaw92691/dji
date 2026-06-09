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
        <el-button type="primary" :icon="menuStore.iconComponents.Plus" v-permission="['agent:add']" @click="openCreate">
          Create Agent
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag :type="getColorByValue(STATUS_OPTIONS, row.status)" :text="getLabelByValue(STATUS_OPTIONS, row.status)" />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['agent:edit']" @click="openEdit(row)">Edit</el-button>
        <el-button type="info" link @click="openCustomers(row)">Customers</el-button>
        <el-button type="warning" link @click="openCommissions(row)">Commissions</el-button>
        <el-popconfirm
          :title="row.status === 'ENABLE' ? 'Disable this agent?' : 'Enable this agent?'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 'ENABLE' ? 'danger' : 'success'" v-permission="['agent:edit']">
              {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="dialogVisible" :title="editForm.id ? 'Edit Agent' : 'Create Agent'" width="600" @close="dialogVisible = false">
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="130px">
        <el-form-item label="Email" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="Password" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Nickname"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="Phone"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="Commission Rate (%)">
          <el-input-number v-model="editForm.commissionRate" :min="0" :max="100" :precision="2" style="width:100%" />
        </el-form-item>
        <el-form-item label="Invite Code">
          <el-input v-model="editForm.inviteCode" :disabled="!!editForm.id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Save</el-button>
      </template>
    </BaseDialog>

    <BaseDialog v-model="customersVisible" title="Agent Customers" width="700" @close="customersVisible = false">
      <el-table :data="customerList" v-loading="customerLoading" border stripe max-height="400">
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="phone" label="Phone" min-width="130" />
        <el-table-column prop="nickname" label="Nickname" min-width="120" />
        <el-table-column prop="createdAt" label="Registered" min-width="160" />
      </el-table>
      <el-pagination
        v-if="customerTotal > 0"
        v-model:current-page="customerPage"
        v-model:page-size="customerPageSize"
        :total="customerTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="fetchCustomers"
        style="margin-top:12px;justify-content:flex-end"
      />
      <template #footer><el-button @click="customersVisible = false">Close</el-button></template>
    </BaseDialog>

    <BaseDialog v-model="commissionsVisible" title="Agent Commissions" width="700" @close="commissionsVisible = false">
      <el-table :data="commissionList" v-loading="commissionLoading" border stripe max-height="400">
        <el-table-column prop="orderId" label="Order ID" min-width="120" />
        <el-table-column prop="amount" label="Amount" width="120" />
        <el-table-column prop="rate" label="Rate" width="80" />
        <el-table-column prop="status" label="Status" width="100" />
        <el-table-column prop="createdAt" label="Created" min-width="160" />
      </el-table>
      <el-pagination
        v-if="commissionTotal > 0"
        v-model:current-page="commissionPage"
        v-model:page-size="commissionPageSize"
        :total="commissionTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="fetchCommissions"
        style="margin-top:12px;justify-content:flex-end"
      />
      <template #footer><el-button @click="commissionsVisible = false">Close</el-button></template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { agentApi } from '@/api/agent'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'AgentListView' })

const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)

const customersVisible = ref(false)
const customerList = ref<any[]>([])
const customerTotal = ref(0)
const customerLoading = ref(false)
const customerPage = ref(1)
const customerPageSize = ref(10)
const currentAgentId = ref<string | number>('')

const commissionsVisible = ref(false)
const commissionList = ref<any[]>([])
const commissionTotal = ref(0)
const commissionLoading = ref(false)
const commissionPage = ref(1)
const commissionPageSize = ref(10)

const editForm = reactive({
  id: '' as string | number,
  email: '',
  password: '',
  nickname: '',
  phone: '',
  commissionRate: null as number | null,
  inviteCode: '',
})

const formRules: FormRules = {
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Keyword', prop: 'keyword', type: 'elInput', attrs: { placeholder: 'Search...', clearable: true } },
  { label: 'Status', prop: 'status', type: 'elSelect', attrs: { placeholder: 'Select status', options: STATUS_OPTIONS, clearable: true } },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'agentId', label: 'Agent ID', minWidth: 100 },
  { prop: 'email', label: 'Email', minWidth: 180 },
  { prop: 'phone', label: 'Phone', minWidth: 130 },
  { prop: 'nickname', label: 'Nickname', minWidth: 120 },
  { prop: 'inviteCode', label: 'Invite Code', minWidth: 120 },
  { prop: 'commissionRate', label: 'Rate(%)', width: 90 },
  { prop: 'customerCount', label: 'Customers', width: 100 },
  { prop: 'totalCommission', label: 'Commission', width: 120 },
  { prop: 'balance', label: 'Balance', width: 100 },
  { prop: 'frozenBalance', label: 'Frozen', width: 100 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 300, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await agentApi.getAgents({ ...queryForm, page, pageSize })
    if (res.code === 200) { tableData.value = res.data?.list || []; total.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { loading.value = false }
}

const resetForm = () => {
  editForm.id = ''
  editForm.email = ''
  editForm.password = ''
  editForm.nickname = ''
  editForm.phone = ''
  editForm.commissionRate = null
  editForm.inviteCode = ''
  formRef.value?.resetFields()
}

const openCreate = () => { resetForm(); dialogVisible.value = true }

const openEdit = async (row: any) => {
  try {
    const { data: res } = await agentApi.getAgents({ agentId: row.agentId || row.id, page: 1, pageSize: 1 })
    const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row
    Object.assign(editForm, {
      id: d.id || row.id,
      email: d.email || row.email || '',
      nickname: d.nickname || row.nickname || '',
      phone: d.phone || row.phone || '',
      commissionRate: d.commissionRate ?? row.commissionRate ?? null,
      inviteCode: d.inviteCode || row.inviteCode || '',
    })
    dialogVisible.value = true
  } catch {
    Object.assign(editForm, {
      id: row.id, email: row.email || '', nickname: row.nickname || '',
      phone: row.phone || '', commissionRate: row.commissionRate ?? null, inviteCode: row.inviteCode || '',
    })
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload = {
      email: editForm.email, nickname: editForm.nickname, phone: editForm.phone,
      commissionRate: editForm.commissionRate, inviteCode: editForm.inviteCode,
    }
    let res
    if (editForm.id) {
      res = await agentApi.updateAgent(editForm.id, payload)
    } else {
      res = await agentApi.createAgent({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? 'Agent updated' : 'Agent created')
      dialogVisible.value = false
      editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage()
    } else { ElMessage.error(res.data.message || 'Operation failed') }
  } catch { ElMessage.error('Operation failed') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await agentApi.updateAgentStatus(row.id, newStatus)
    if (res.code === 200) { ElMessage.success('Status updated'); basePageRef.value?.refreshCurrentPage() }
    else { ElMessage.error(res.message || 'Status update failed') }
  } catch { ElMessage.error('Status update failed') }
}

const openCustomers = (row: any) => {
  currentAgentId.value = row.id
  customerPage.value = 1
  customersVisible.value = true
  fetchCustomers()
}

const fetchCustomers = async () => {
  customerLoading.value = true
  try {
    const { data: res } = await agentApi.getAgentCustomers(currentAgentId.value, { page: customerPage.value, pageSize: customerPageSize.value })
    if (res.code === 200) { customerList.value = res.data?.list || []; customerTotal.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { customerLoading.value = false }
}

const openCommissions = (row: any) => {
  currentAgentId.value = row.id
  commissionPage.value = 1
  commissionsVisible.value = true
  fetchCommissions()
}

const fetchCommissions = async () => {
  commissionLoading.value = true
  try {
    const { data: res } = await agentApi.getAgentCommissions(currentAgentId.value, { page: commissionPage.value, pageSize: commissionPageSize.value })
    if (res.code === 200) { commissionList.value = res.data?.list || []; commissionTotal.value = res.data?.total || 0 }
  } catch { /* ignore */ } finally { commissionLoading.value = false }
}
</script>
