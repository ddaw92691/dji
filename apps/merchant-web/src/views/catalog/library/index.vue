<template>
  <div class="catalog-library-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Search products" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.categoryId" placeholder="Category" clearable @change="handleSearch">
          <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <div class="product-grid">
      <div v-for="product in tableData" :key="product.id" class="product-card">
        <div class="card-cover">
          <el-image v-if="product.coverImage" :src="product.coverImage" style="width: 100%; height: 180px; object-fit: cover" fit="cover" />
          <div v-else class="no-cover">无图片</div>
          <el-tag v-if="product.already已上架" type="success" size="small" class="listed-badge">
            {{ product.listing状态 === 'ON_SALE' ? '在售' : '已上架' }}
          </el-tag>
        </div>
        <div class="card-body">
          <h4 class="card-name">{{ product.name }}</h4>
          <p class="card-model">{{ product.model }}</p>
          <div class="card-prices">
            <span>成本：{{ product.merchantPrice }}</span>
            <span>售价：{{ product.salePrice }}</span>
          </div>
          <div class="card-meta">
            <span>利润：{{ product.profitAmount }}</span>
            <span class="profit-rate">({{ product.profitRate ?? '-' }}%)</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button
            v-if="!product.already已上架"
            type="primary"
            size="small"
            @click="open上架Dialog(product)"
          >上架</el-button>
          <el-tag v-else type="info" size="small">Already 已上架</el-tag>
        </div>
      </div>
    </div>

    <div v-if="!tableData.length && !loading" style="text-align: center; padding: 40px; color: #909399">
      暂无商品
    </div>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[12, 24, 48]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <el-dialog v-model="listDialogVisible" title="上架商品" width="450px">
      <div v-if="listTarget">
        <p><strong>商品：</strong> {{ listTarget.name }} ({{ listTarget.model }})</p>
        <el-form label-width="120px" style="margin-top: 16px">
          <el-form-item label="库存">
            <el-input-number v-model="listForm.merchant库存" :min="0" style="width:100%" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="listForm.status">
              <el-radio value="ON_SALE">在售</el-radio>
              <el-radio value="OFF_SALE">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="listDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="listLoading" @click="handle上架">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { catalogApi, type PlatformProduct } from '@/api/catalog'
import { connectWebSocket, disconnectWebSocket } from '@/utils/realtime'
import { storage, STORAGE_KEYS } from '@/utils/storage'

defineOptions({ name: 'CatalogLibraryView' })

const loading = ref(false)
const tableData = ref<(PlatformProduct & { already已上架?: boolean; listing状态?: string })[]>([])
const total = ref(0)
const categoryOptions = ref<any[]>([])

const searchForm = reactive({
  keyword: '',
  categoryId: null as number | null,
  page: 1,
  pageSize: 24,
})

const listDialogVisible = ref(false)
const listTarget = ref<PlatformProduct | null>(null)
const listLoading = ref(false)
const listForm = reactive({ merchant库存: 0, status: 'ON_SALE' })

async function loadCategories() {
  try {
    // Get categories via separate call (reuse merchant existing category loading)
    const { default: request } = await import('@/utils/request')
    const { data: cRes } = await request.get('/customer/categories')
    if (cRes.code === 200) categoryOptions.value = cRes.data || []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await catalogApi.getPlatformProducts({
      keyword: searchForm.keyword || undefined,
      categoryId: searchForm.categoryId || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取失败')
    }
  } catch {
    ElMessage.error('获取失败 data')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function open上架Dialog(product: PlatformProduct) {
  listTarget.value = product
  listForm.merchant库存 = 0
  listForm.status = 'ON_SALE'
  listDialogVisible.value = true
}

async function handle上架() {
  if (!listTarget.value) return
  listLoading.value = true
  try {
    const { data: res } = await catalogApi.listProduct(listTarget.value.id, {
      merchant库存: listForm.merchant库存,
      status: listForm.status,
    })
    if (res.code === 200) {
      ElMessage.success('商品已上架')
      listDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '上架失败')
    }
  } catch {
    ElMessage.error('上架失败')
  } finally {
    listLoading.value = false
  }
}

function onWsEvent(event: any) {
  if (event.type === 'PRODUCT_CATALOG_UPDATED') {
    fetchData()
  }
}

onMounted(async () => {
  await loadCategories()
  fetchData()
  const token = storage.get<string>(STORAGE_KEYS.TOKEN)
  if (token) connectWebSocket(token, onWsEvent)
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style scoped>
.catalog-library-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px; }
.product-card { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; background: #fff; }
.card-cover { position: relative; background: #f5f7fa; }
.no-cover { width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; color: #909399; }
.listed-badge { position: absolute; top: 8px; right: 8px; }
.card-body { padding: 12px; }
.card-name { margin: 0 0 4px; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-model { margin: 0 0 8px; font-size: 12px; color: #909399; }
.card-prices { display: flex; gap: 12px; font-size: 13px; color: #606266; margin-bottom: 4px; }
.card-meta { font-size: 12px; color: #67c23a; }
.profit-rate { color: #909399; }
.card-footer { padding: 8px 12px 12px; text-align: center; }
</style>
