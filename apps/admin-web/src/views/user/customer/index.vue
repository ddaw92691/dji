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
      <template #status="{ row }">
        <div style="display: flex; gap: 4px; align-items: center">
          <BaseTag
            :type="getColorByValue(CUSTOMER_STATUS_OPTIONS, row.status)"
            :text="getLabelByValue(CUSTOMER_STATUS_OPTIONS, row.status)"
          />
          <el-tag v-if="row.isVirtual" type="info" size="small" effect="plain">Virtual</el-tag>
        </div>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDetail(row)">Detail</el-button>
        <el-button type="warning" link v-permission="['customer:edit']" @click="openEdit(row)">Edit</el-button>
        <el-popconfirm
          :title="row.status === 1 ? 'Disable this customer?' : 'Enable this customer?'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button link :type="row.status === 1 ? 'danger' : 'success'" v-permission="['customer:edit']">
              {{ row.status === 1 ? 'Disable' : 'Enable' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="detailVisible" title="Customer Detail" width="650" @close="detailVisible = false">
      <el-descriptions v-if="detailItem" :column="2" border size="small">
        <el-descriptions-item label="ID">{{ detailItem.id }}</el-descriptions-item>
        <el-descriptions-item label="Email">{{ detailItem.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Phone">{{ detailItem.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Nickname">{{ detailItem.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Country">{{ detailItem.country || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Language">{{ detailItem.language || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Orders">{{ detailItem.orderCount ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="Total Spent">{{ detailItem.totalSpent ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="Status">{{ detailItem.status }}</el-descriptions-item>
        <el-descriptions-item label="Created">{{ detailItem.createdAt || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </BaseDialog>

    <BaseDialog v-model="editVisible" title="Edit Customer" width="550" @close="editVisible = false">
      <el-form ref="editFormRef" :model="editForm" label-width="100px" v-if="editForm.id">
        <el-form-item label="Email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="Phone"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="Nickname"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="Country"><el-input v-model="editForm.country" /></el-form-item>
        <el-form-item label="Language"><el-input v-model="editForm.language" /></el-form-item>
        <el-divider />
        <el-form-item label="Virtual Customer">
          <el-checkbox v-model="editForm.isVirtual" />
        </el-form-item>
        <el-form-item label="Virtual Remark" v-if="editForm.isVirtual">
          <el-input v-model="editForm.virtualRemark" type="textarea" :rows="2" placeholder="Remark for virtual customer" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSave">Save</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { customerApi } from '@/api/customer'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { getLabelByValue, getColorByValue, type DictItem } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'

defineOptions({ name: 'CustomerListView' })

const basePageRef = useTemplateRef('basePageRef')
const editFormRef = useTemplateRef('editFormRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const detailVisible = ref(false)
const detailItem = ref<any>(null)
const editVisible = ref(false)
const submitLoading = ref(false)

const editForm = reactive({
  id: '' as string | number,
  email: '',
  phone: '',
  nickname: '',
  country: '',
  language: '',
  isVirtual: false,
  virtualRemark: '',
})

const CUSTOMER_STATUS_OPTIONS: DictItem<number>[] = [
  { label: 'Enabled', value: 1, color: 'success' },
  { label: 'Disabled', value: 0, color: 'danger' },
]

const searchFormConfig = ref<IFormConfig[]>([
  { label: 'Keyword', prop: 'keyword', type: 'elInput', attrs: { placeholder: 'Search...', clearable: true } },
  {
    label: 'Status', prop: 'status', type: 'elSelect', attrs: {
      placeholder: 'Select status', options: CUSTOMER_STATUS_OPTIONS, clearable: true,
    },
  },
  { label: 'Country', prop: 'country', type: 'elInput', attrs: { placeholder: 'Country code', clearable: true } },
  {
    label: 'Virtual', prop: 'isVirtual', type: 'elSelect', attrs: {
      placeholder: 'Filter', options: [
        { label: 'Virtual Only', value: 'true' },
        { label: 'Real Only', value: 'false' },
      ], clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'id', label: 'ID', minWidth: 80 },
  { prop: 'email', label: 'Email', minWidth: 180 },
  { prop: 'phone', label: 'Phone', minWidth: 130 },
  { prop: 'nickname', label: 'Nickname', minWidth: 120 },
  { prop: 'isVirtual', label: 'Virtual', width: 80 },
  { prop: 'country', label: 'Country', width: 100 },
  { prop: 'language', label: 'Language', width: 100 },
  { prop: 'orderCount', label: 'Orders', width: 90 },
  { prop: 'totalSpent', label: 'Total Spent', width: 110 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 200, fixed: 'right' },
])

const fetchData = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
) => {
  loading.value = true
  try {
    const { data: res } = await customerApi.getCustomers({ ...queryForm, page, pageSize })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch { /* handled by interceptor */ } finally { loading.value = false }
}

const openDetail = async (row: any) => {
  try {
    const { data: res } = await customerApi.getCustomerDetail(row.id)
    if (res.code === 200) { detailItem.value = res.data; detailVisible.value = true }
  } catch { /* ignore */ }
}

const openEdit = async (row: any) => {
  try {
    const { data: res } = await customerApi.getCustomerDetail(row.id)
    if (res.code === 200) {
      const d = res.data
      Object.assign(editForm, { id: d.id, email: d.email || '', phone: d.phone || '', nickname: d.nickname || '', country: d.country || '', language: d.language || '', isVirtual: !!d.isVirtual, virtualRemark: d.virtualRemark || '' })
      editVisible.value = true
    }
  } catch { /* ignore */ }
}

const handleSave = async () => {
  submitLoading.value = true
  try {
    const { data: res } = await customerApi.updateCustomer(editForm.id, {
      email: editForm.email,
      phone: editForm.phone,
      nickname: editForm.nickname,
      countryCode: editForm.country,
      languageCode: editForm.language,
      isVirtual: editForm.isVirtual,
      virtualRemark: editForm.virtualRemark,
    })
    if (res.code === 200) {
      ElMessage.success('Customer updated')
      editVisible.value = false
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || 'Update failed')
    }
  } catch { ElMessage.error('Update failed') } finally { submitLoading.value = false }
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    const { data: res } = await customerApi.updateCustomerStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('Status updated')
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || 'Status update failed')
    }
  } catch { ElMessage.error('Status update failed') }
}
</script>
