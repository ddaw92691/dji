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
          从商品库上架
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
      <template #productSource="{ row }">
        <el-tag :type="row.platformProductId ? 'success' : 'info'" size="small">
          {{ row.platformProductId ? '平台商品库' : '商家自建' }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="router.push(`/product/edit?id=${row.id}`)" v-permission="['product:edit']">
          编辑
        </el-button>
        <el-popconfirm
          title="确定要删除/下架该商品吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleDelete(row.id)"
        >
          <template #reference>
            <el-button type="danger" link v-permission="['product:delete']">
              删除
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm
          v-if="!row.platformProductId && row.auditStatus !== 'APPROVED'"
          title="确定提交该商品审核吗？"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleSubmitAudit(row.id)"
        >
          <template #reference>
            <el-button type="warning" link v-permission="['product:audit']">
              提交审核
            </el-button>
          </template>
        </el-popconfirm>
        <el-button v-if="!row.platformProductId" type="info" link @click="router.push(`/product/translation?id=${row.id}`)">
          翻译
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
    label: '关键词',
    prop: 'keyword',
    type: 'elInput',
    attrs: { placeholder: '搜索商品名称...' },
  },
  {
    label: '分类',
    prop: 'categoryId',
    type: 'elSelect',
    attrs: {
      placeholder: '选择分类',
      options: [],
      clearable: true,
    },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: {
      placeholder: '选择状态',
      options: PRODUCT_STATUS_OPTIONS,
      clearable: true,
    },
  },
  {
    label: '审核状态',
    prop: 'auditStatus',
    type: 'elSelect',
    attrs: {
      placeholder: '选择审核状态',
      options: AUDIT_STATUS_OPTIONS,
      clearable: true,
    },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'coverImage', label: '封面', width: 80 },
  { prop: 'title', label: '商品名称', minWidth: 150 },
  { prop: 'productSource', label: '来源', width: 110 },
  { prop: 'categoryName', label: '分类', minWidth: 100 },
  { prop: 'price', label: '售价', width: 100 },
  { prop: 'merchantPrice', label: '货款成本', width: 90 },
  { prop: 'profitAmount', label: '利润', width: 90 },
  { prop: 'profitRate', label: '利润率', width: 100 },
  { prop: 'stock', label: '库存', width: 80 },
  { prop: 'salesCount', label: '销量', width: 80 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'auditStatus', label: '审核', width: 110 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 280, fixed: 'right' },
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
  ElMessage.success('操作成功')
  basePageRef.value?.refreshAfterDelete(1)
}

const handleSubmitAudit = async (id: number) => {
  const { data: res } = await productApi.submitAudit(id)
  if (res.code !== 200) return
  ElMessage.success('已提交审核')
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
