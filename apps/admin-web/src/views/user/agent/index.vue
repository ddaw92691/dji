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
          v-permission="['agent:add']"
          @click="openCreate"
        >
          新增代理
        </el-button>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['agent:edit']" @click="openEdit(row)"
          >编辑</el-button
        >
        <el-button type="info" link @click="open客户(row)">客户</el-button>
        <el-button type="warning" link @click="openCommissions(row)">佣金</el-button>
        <el-popconfirm
          :title="row.status === 'ENABLE' ? '确定要禁用该代理吗？' : '确定要启用该代理吗？'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggle状态(row)"
        >
          <template #reference>
            <el-button
              link
              :type="row.status === 'ENABLE' ? 'danger' : 'success'"
              v-permission="['agent:edit']"
            >
              {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog
      v-model="dialogVisible"
      :title="editForm.id ? '编辑代理' : '新增代理'"
      width="600"
      @close="dialogVisible = false"
    >
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="130px">
        <el-form-item label="邮箱" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="佣金比例(%)">
          <el-input-number
            v-model="editForm.commissionRate"
            :min="0"
            :max="100"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="editForm.inviteCode" :disabled="!!editForm.id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </BaseDialog>

    <BaseDialog
      v-model="customersVisible"
      title="代理客户"
      width="700"
      @close="customersVisible = false"
    >
      <el-table :data="customerList" v-loading="customerLoading" border stripe max-height="400">
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="createdAt" label="注册时间" min-width="160" />
      </el-table>
      <el-pagination
        v-if="customerTotal > 0"
        v-model:current-page="customerPage"
        v-model:page-size="customerPageSize"
        :total="customerTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="fetch客户"
        style="margin-top: 12px; justify-content: flex-end"
      />
      <template #footer><el-button @click="customersVisible = false">关闭</el-button></template>
    </BaseDialog>

    <BaseDialog
      v-model="commissionsVisible"
      title="代理佣金"
      width="700"
      @close="commissionsVisible = false"
    >
      <el-table :data="commissionList" v-loading="commissionLoading" border stripe max-height="400">
        <el-table-column prop="orderId" label="订单ID" min-width="120" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="rate" label="比例" width="80" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
      </el-table>
      <el-pagination
        v-if="commissionTotal > 0"
        v-model:current-page="commissionPage"
        v-model:page-size="commissionPageSize"
        :total="commissionTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="fetchCommissions"
        style="margin-top: 12px; justify-content: flex-end"
      />
      <template #footer><el-button @click="commissionsVisible = false">关闭</el-button></template>
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
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: '关键词',
    prop: 'keyword',
    type: 'elInput',
    attrs: { placeholder: '请输入关键词', clearable: true },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'agentId', label: '代理ID', minWidth: 100 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '手机号', minWidth: 130 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'inviteCode', label: '邀请码', minWidth: 120 },
  { prop: 'commissionRate', label: 'Rate(%)', width: 90 },
  { prop: 'customerCount', label: '客户', width: 100 },
  { prop: 'totalCommission', label: 'Commission', width: 120 },
  { prop: 'balance', label: '余额', width: 100 },
  { prop: 'frozen余额', label: '冻结金额', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await agentApi.get代理({ ...queryForm, page, pageSize })
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
  editForm.phone = ''
  editForm.commissionRate = null
  editForm.inviteCode = ''
  formRef.value?.resetFields()
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = async (row: any) => {
  try {
    const { data: res } = await agentApi.get代理({
      agentId: row.agentId || row.id,
      page: 1,
      pageSize: 1,
    })
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
      id: row.id,
      email: row.email || '',
      nickname: row.nickname || '',
      phone: row.phone || '',
      commissionRate: row.commissionRate ?? null,
      inviteCode: row.inviteCode || '',
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
      phone: editForm.phone,
      commissionRate: editForm.commissionRate,
      inviteCode: editForm.inviteCode,
    }
    let res
    if (editForm.id) {
      res = await agentApi.updateAgent(editForm.id, payload)
    } else {
      res = await agentApi.createAgent({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? '代理更新成功' : '代理创建成功')
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
  const new状态 = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await agentApi.updateAgent状态(row.id, new状态)
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

const open客户 = (row: any) => {
  currentAgentId.value = row.id
  customerPage.value = 1
  customersVisible.value = true
  fetch客户()
}

const fetch客户 = async () => {
  customerLoading.value = true
  try {
    const { data: res } = await agentApi.getAgent客户(currentAgentId.value, {
      page: customerPage.value,
      pageSize: customerPageSize.value,
    })
    if (res.code === 200) {
      customerList.value = res.data?.list || []
      customerTotal.value = res.data?.total || 0
    }
  } catch {
    /* ignore */
  } finally {
    customerLoading.value = false
  }
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
    const { data: res } = await agentApi.getAgentCommissions(currentAgentId.value, {
      page: commissionPage.value,
      pageSize: commissionPageSize.value,
    })
    if (res.code === 200) {
      commissionList.value = res.data?.list || []
      commissionTotal.value = res.data?.total || 0
    }
  } catch {
    /* ignore */
  } finally {
    commissionLoading.value = false
  }
}
</script>
