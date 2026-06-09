<template>
  <div class="product-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.categoryId" placeholder="Category" clearable @change="handleSearch">
          <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option label="On Sale" value="ON_SALE" />
          <el-option label="Off Sale" value="OFF_SALE" />
          <el-option label="Draft" value="DRAFT" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.auditStatus" placeholder="Audit Status" clearable @change="handleSearch">
          <el-option label="Draft" value="DRAFT" />
          <el-option label="Pending" value="PENDING" />
          <el-option label="Approved" value="APPROVED" />
          <el-option label="Rejected" value="REJECTED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column label="Cover" width="90" align="center">
        <template #default="{ row }">
          <el-image v-if="row.coverImage" :src="row.coverImage" style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="Title" min-width="180" show-overflow-tooltip />
      <el-table-column prop="merchantName" label="Merchant" width="130" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="Category" width="120" show-overflow-tooltip />
      <el-table-column prop="price" label="Price" width="100" align="right" />
      <el-table-column prop="stock" label="Stock" width="80" align="center" />
      <el-table-column prop="salesCount" label="Sales" width="80" align="center" />
      <el-table-column prop="status" label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ON_SALE' ? 'success' : row.status === 'OFF_SALE' ? 'warning' : 'info'">
            {{ row.status === 'ON_SALE' ? 'On Sale' : row.status === 'OFF_SALE' ? 'Off Sale' : row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="Audit" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'">
            {{ row.auditStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'product:view'" @click="handleViewDetail(row)">Detail</el-button>
          <el-button link :type="row.status === 'ON_SALE' ? 'warning' : 'success'" v-permission="'product:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ON_SALE' ? 'Off Sale' : 'On Sale' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <el-dialog v-model="detailVisible" title="Product Detail" width="750px">
      <div v-if="detailItem" class="product-detail">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-image v-if="detailItem.coverImage" :src="detailItem.coverImage" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px" fit="cover" />
          </el-col>
          <el-col :span="12">
            <p><strong>Title:</strong> {{ detailItem.title }}</p>
            <p><strong>Description:</strong> {{ detailItem.description }}</p>
            <p><strong>Price:</strong> ${{ detailItem.price }}</p>
            <p><strong>Original Price:</strong> ${{ detailItem.originalPrice }}</p>
            <p><strong>Stock:</strong> {{ detailItem.stock }}</p>
            <p><strong>Sales:</strong> {{ detailItem.salesCount }}</p>
            <p><strong>Status:</strong> {{ detailItem.status }}</p>
            <p><strong>Audit:</strong> {{ detailItem.auditStatus }}</p>
            <p v-if="detailItem.merchantName"><strong>Merchant:</strong> {{ detailItem.merchantName }}</p>
            <p v-if="detailItem.categoryName"><strong>Category:</strong> {{ detailItem.categoryName }}</p>
          </el-col>
        </el-row>
        <el-divider />
        <h4>Images</h4>
        <div class="image-gallery">
          <el-image v-for="img in detailItem.images" :key="img.id" :src="img.imageUrl" style="width: 120px; height: 120px; object-fit: cover; margin: 4px; border-radius: 4px" fit="cover" />
        </div>
        <el-divider />
        <h4>Translations</h4>
        <div v-if="detailItem.translations?.length">
          <el-descriptions v-for="pt in detailItem.translations" :key="pt.id" :title="pt.languageCode" :column="1" border size="small" style="margin-bottom: 8px">
            <el-descriptions-item label="Title">{{ pt.title }}</el-descriptions-item>
            <el-descriptions-item label="Description">{{ pt.description }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <span v-else>No translations</span>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { productApi, type ProductItem } from '@/api/product'
import { categoryApi, type CategoryItem } from '@/api/category'

defineOptions({ name: 'ProductListView' })

const loading = ref(false)
const tableData = ref<ProductItem[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailItem = ref<ProductItem | null>(null)
const categoryOptions = ref<CategoryItem[]>([])

const searchForm = reactive({
  keyword: '',
  merchantId: '',
  categoryId: null as number | null,
  status: '',
  auditStatus: '',
  page: 1,
  pageSize: 20,
})

async function loadCategories() {
  try {
    const { data: res } = await categoryApi.getCategories({ page: 1, pageSize: 999 })
    if (res.code === 200) categoryOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await productApi.getProducts({
      keyword: searchForm.keyword || undefined,
      merchantId: searchForm.merchantId || undefined,
      categoryId: searchForm.categoryId || undefined,
      status: searchForm.status || undefined,
      auditStatus: searchForm.auditStatus || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || 'Failed to fetch data')
    }
  } catch {
    ElMessage.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

async function handleViewDetail(row: ProductItem) {
  try {
    const { data: res } = await productApi.getProductDetail(row.id)
    if (res.code === 200) {
      detailItem.value = res.data
      detailVisible.value = true
    } else {
      ElMessage.error(res.message || 'Failed to load detail')
    }
  } catch {
    ElMessage.error('Failed to load detail')
  }
}

async function handleToggleStatus(row: ProductItem) {
  const newStatus = row.status === 'ON_SALE' ? 'OFF_SALE' : 'ON_SALE'
  try {
    const { data: res } = await productApi.updateProductStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('Status updated')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Status update failed')
    }
  } catch {
    ElMessage.error('Status update failed')
  }
}

onMounted(async () => {
  await loadCategories()
  fetchData()
})
</script>

<style scoped>
.product-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.product-detail p { margin: 6px 0; }
.image-gallery { display: flex; flex-wrap: wrap; }
</style>
