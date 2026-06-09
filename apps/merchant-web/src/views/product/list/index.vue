<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="productList"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="getProductList"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          @click="router.push('/catalog/library')"
          v-permission="['product:add']"
        >
          From Library
        </el-button>
      </template>
      <template #coverImage="{ row }">
        <el-image
          v-if="row.coverImage"
          :src="row.coverImage"
          style="width: 60px; height: 60px; border-radius: 4px"
          fit="cover"
        />
        <span v-else>-</span>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(PRODUCT_STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(PRODUCT_STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #auditStatus="{ row }">
        <BaseTag
          :type="getColorByValue(AUDIT_STATUS_OPTIONS, row.auditStatus)"
          :text="getLabelByValue(AUDIT_STATUS_OPTIONS, row.auditStatus)"
        />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="router.push(`/product/edit?id=${row.id}`)" v-permission="['product:edit']">
          Edit Stock
        </el-button>
        <el-popconfirm
          title="Are you sure you want to delete this product?"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['product:delete']">
              Delete
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          v-if="row.auditStatus !== 'approved'"
          title="Submit this product for audit?"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleSubmitAudit(row.id)"
        >
          <template #reference>
            <el-button type="warning" link v-permission="['product:audit']">
              Submit Audit
            </el-button>
          </template>
        </el-popconfirm>
        <el-button type="info" link @click="router.push(`/product/translation?id=${row.id}`)">
          Translations
        </el-button>
      </template>
    </BasePage>
  </div>
</template>

<script setup lang="ts">
import { productApi, type IProduct } from '@/api/product'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { PRODUCT_STATUS_OPTIONS, AUDIT_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import { connectWebSocket, disconnectWebSocket } from '@/utils/realtime'
import { storage, STORAGE_KEYS } from '@/utils/storage'

defineOptions({ name: 'ProductView' })

const router = useRouter()
const menuStore = useMenuStore()
const basePageRef = useTemplateRef('basePageRef')

const productList = ref<IProduct[]>([])
const total = ref(0)
const loading = ref(false)

let wsConnected = false
function onWebSocketEvent(event: any) {
  if (event.type === 'PRODUCT_PRICE_UPDATED') {
    basePageRef.value?.refreshCurrentPage()
  }
}

onMounted(() => {
  const token = storage.get<string>(STORAGE_KEYS.TOKEN)
  if (token && !wsConnected) {
    wsConnected = true
    connectWebSocket(token, onWebSocketEvent)
  }
})

onUnmounted(() => {
  if (wsConnected) {
    disconnectWebSocket()
    wsConnected = false
  }
})

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: 'Keyword',
    prop: 'keyword',
    type: 'elInput',
    attrs: { placeholder: 'Search by title...' },
  },
  {
    label: 'Category',
    prop: 'categoryId',
    type: 'elSelect',
    attrs: {
      placeholder: 'Select category',
      options: [],
      clearable: true,
    },
  },
  {
    label: 'Status',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: 'Select status',
      options: PRODUCT_STATUS_OPTIONS,
      clearable: true,
    },
  },
  {
    label: 'Audit Status',
    prop: 'auditStatus',
    type: 'elSelect',
    attrs: {
      placeholder: 'Select audit status',
      options: AUDIT_STATUS_OPTIONS,
      clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'coverImage', label: 'Cover', width: 80 },
  { prop: 'title', label: 'Title', minWidth: 150 },
  { prop: 'categoryName', label: 'Category', minWidth: 100 },
  { prop: 'price', label: 'Sale Price', width: 100 },
  { prop: 'merchantPrice', label: 'M.Price', width: 90 },
  { prop: 'profitAmount', label: 'Profit', width: 90 },
  { prop: 'profitRate', label: 'Profit Rate', width: 100 },
  { prop: 'stock', label: 'Stock', width: 80 },
  { prop: 'salesCount', label: 'Sales', width: 80 },
  { prop: 'status', label: 'Status', width: 100 },
  { prop: 'auditStatus', label: 'Audit', width: 110 },
  { prop: 'createdAt', label: 'Created', minWidth: 160 },
  { prop: 'operation', label: 'Actions', width: 280, fixed: 'right' },
])

const getProductList = async (
  queryForm: Record<string, unknown>,
  page: number,
  pageSize: number,
) => {
  loading.value = true
  try {
    const { data: res } = await productApi.getMyProducts({
      ...queryForm,
      page,
      pageSize,
    })
    if (res.code !== 200) return
    productList.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  const { data: res } = await productApi.deleteProduct(id)
  if (res.code !== 200) return
  ElMessage.success('Delete successful')
  basePageRef.value?.refreshAfterDelete(1)
}

const handleSubmitAudit = async (id: number) => {
  const { data: res } = await productApi.submitAudit(id)
  if (res.code !== 200) return
  ElMessage.success('Submitted for audit')
  basePageRef.value?.refreshCurrentPage()
}

const loadCategories = async () => {
  const { data: res } = await productApi.getCategories()
  if (res.code !== 200) return
  const categories = (res.data || []).map((c: any) => ({ label: c.name, value: c.id }))
  const categoryConfig = searchFormConfig.value.find((f) => f.prop === 'categoryId')
  if (categoryConfig?.attrs) {
    (categoryConfig.attrs as Record<string, unknown>).options = categories
  }
}

onMounted(() => {
  loadCategories()
})
</script>
