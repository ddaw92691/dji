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
          <el-tag v-if="row.is虚拟" type="info" size="small" effect="plain">虚拟</el-tag>
        </div>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="openDetail(row)">详情</el-button>
        <el-button type="warning" link v-permission="['customer:edit']" @click="openEdit(row)"
          >编辑</el-button
        >
        <el-popconfirm
          :title="row.status === 1 ? '确定要禁用该客户吗？' : '确定要启用该客户吗？'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggle状态(row)"
        >
          <template #reference>
            <el-button
              link
              :type="row.status === 1 ? 'danger' : 'success'"
              v-permission="['customer:edit']"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog v-model="detailVisible" title="客户详情" width="650" @close="detailVisible = false">
      <el-descriptions v-if="detailItem" :column="2" border size="small">
        <el-descriptions-item label="ID">{{ detailItem.id }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailItem.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailItem.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ detailItem.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="国家">{{ detailItem.country || '-' }}</el-descriptions-item>
        <el-descriptions-item label="语言">{{ detailItem.language || '-' }}</el-descriptions-item>
        <el-descriptions-item label="订单">{{ detailItem.orderCount ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="消费总额">{{
          detailItem.totalSpent ?? '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailItem.status }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          detailItem.createdAt || '-'
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </BaseDialog>

    <BaseDialog v-model="editVisible" title="编辑客户" width="550" @close="editVisible = false">
      <el-form ref="editFormRef" :model="editForm" label-width="100px" v-if="editForm.id">
        <el-form-item label="邮箱"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="editForm.phone" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="国家"><el-input v-model="editForm.country" /></el-form-item>
        <el-form-item label="语言"><el-input v-model="editForm.language" /></el-form-item>
        <el-divider />
        <el-form-item label="虚拟客户">
          <el-checkbox v-model="editForm.is虚拟" />
        </el-form-item>
        <el-form-item label="虚拟备注" v-if="editForm.is虚拟">
          <el-input
            v-model="editForm.virtualRemark"
            type="textarea"
            :rows="2"
            placeholder="虚拟客户备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSave">保存</el-button>
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
  is虚拟: false,
  virtualRemark: '',
})

const CUSTOMER_STATUS_OPTIONS: DictItem<number>[] = [
  { label: '启用d', value: 1, color: 'success' },
  { label: '禁用d', value: 0, color: 'danger' },
]

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
    attrs: {
      placeholder: '请选择状态',
      options: CUSTOMER_STATUS_OPTIONS,
      clearable: true,
    },
  },
  {
    label: '国家',
    prop: 'country',
    type: 'elInput',
    attrs: { placeholder: '国家代码', clearable: true },
  },
  {
    label: '虚拟',
    prop: 'is虚拟',
    type: 'elSelect',
    attrs: {
      placeholder: '筛选',
      options: [
        { label: '虚拟 Only', value: 'true' },
        { label: '仅真实', value: 'false' },
      ],
      clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'id', label: 'ID', minWidth: 80 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '手机号', minWidth: 130 },
  { prop: 'nickname', label: '昵称', minWidth: 120 },
  { prop: 'is虚拟', label: '虚拟', width: 80 },
  { prop: 'country', label: '国家', width: 100 },
  { prop: 'language', label: '语言', width: 100 },
  { prop: 'orderCount', label: '订单', width: 90 },
  { prop: 'totalSpent', label: '消费总额', width: 110 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await customerApi.get客户管理({ ...queryForm, page, pageSize })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch {
    /* handled by interceptor */
  } finally {
    loading.value = false
  }
}

const openDetail = async (row: any) => {
  try {
    const { data: res } = await customerApi.getCustomerDetail(row.id)
    if (res.code === 200) {
      detailItem.value = res.data
      detailVisible.value = true
    }
  } catch {
    /* ignore */
  }
}

const openEdit = async (row: any) => {
  try {
    const { data: res } = await customerApi.getCustomerDetail(row.id)
    if (res.code === 200) {
      const d = res.data
      Object.assign(editForm, {
        id: d.id,
        email: d.email || '',
        phone: d.phone || '',
        nickname: d.nickname || '',
        country: d.country || '',
        language: d.language || '',
        is虚拟: !!d.is虚拟,
        virtualRemark: d.virtualRemark || '',
      })
      editVisible.value = true
    }
  } catch {
    /* ignore */
  }
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
      is虚拟: editForm.is虚拟,
      virtualRemark: editForm.virtualRemark,
    })
    if (res.code === 200) {
      ElMessage.success('客户已更新')
      editVisible.value = false
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch {
    ElMessage.error('更新失败')
  } finally {
    submitLoading.value = false
  }
}

const handleToggle状态 = async (row: any) => {
  const new状态 = row.status === 1 ? 0 : 1
  try {
    const { data: res } = await customerApi.updateCustomer状态(row.id, new状态)
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
</script>
