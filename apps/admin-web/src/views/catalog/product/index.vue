<template>
  <div class="catalog-product-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.categoryId" placeholder="Category" clearable @change="handleSearch">
          <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option label="Enabled" value="ENABLE" />
          <el-option label="Disabled" value="DISABLE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-permission="'catalog:create'" @click="openCreate">+ Add Product</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column label="Cover" width="80" align="center">
        <template #default="{ row }">
          <el-image v-if="row.coverImage" :src="row.coverImage" style="width: 56px; height: 56px; object-fit: cover; border-radius: 4px" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="brand" label="Brand" width="80" />
      <el-table-column prop="name" label="Name" min-width="140" show-overflow-tooltip />
      <el-table-column prop="model" label="Model" width="120" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="Category" width="110" show-overflow-tooltip />
      <el-table-column prop="merchantPrice" label="M.Price" width="90" align="right" />
      <el-table-column prop="salePrice" label="Sale Price" width="100" align="right" />
      <el-table-column prop="profitAmount" label="Profit" width="90" align="right" />
      <el-table-column prop="profitRate" label="Profit Rate" width="100" align="center">
        <template #default="{ row }">
          <span>{{ row.profitRate ?? '-' }}{{ row.profitRate != null ? '%' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockMode" label="Stock Mode" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="row.stockMode === 'PLATFORM_GLOBAL' ? 'primary' : 'info'" size="small">{{ row.stockMode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="globalStock" label="Stock" width="80" align="center" />
      <el-table-column prop="status" label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'info'" size="small">
            {{ row.status === 'ENABLE' ? 'Enabled' : 'Disabled' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'catalog:edit'" @click="openEdit(row)">Edit</el-button>
          <el-popconfirm
            :title="`Toggle status to ${row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'}?`"
            placement="top" width="220"
            @confirm="handleToggleStatus(row)"
          >
            <template #reference>
              <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'catalog:edit'">
                {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="Delete this product?" placement="top" width="200" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'catalog:delete'">Delete</el-button>
            </template>
          </el-popconfirm>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="750px" @close="resetForm">
      <el-form ref="formRef" :model="form" label-width="130px">
        <el-form-item label="Brand">
          <el-input v-model="form.brand" placeholder="Default: DJI" />
        </el-form-item>
        <el-form-item label="Name" required>
          <el-input v-model="form.name" placeholder="Product name" />
        </el-form-item>
        <el-form-item label="Model" required>
          <el-input v-model="form.model" placeholder="Product model" />
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="form.categoryId" placeholder="Select category" filterable>
            <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Product description" />
        </el-form-item>
        <el-form-item label="Cover Image">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="onCoverUpload"
            :before-upload="beforeUpload"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button>Select Cover</el-button>
            <template #tip>
              <div v-if="form.coverImage" style="margin-top: 8px">
                <el-image :src="form.coverImage" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px" fit="cover" />
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="M.Price">
              <el-input-number v-model="form.merchantPrice" :min="0" :precision="2" style="width:100%" @change="calcProfit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Sale Price">
              <el-input-number v-model="form.salePrice" :min="0" :precision="2" style="width:100%" @change="calcProfit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Orig. Price">
              <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="Stock Mode">
              <el-select v-model="form.stockMode">
                <el-option label="Global" value="PLATFORM_GLOBAL" />
                <el-option label="Per Merchant" value="MERCHANT_STOCK" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Global Stock">
              <el-input-number v-model="form.globalStock" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Sort">
              <el-input-number v-model="form.sort" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>Translations</el-divider>
        <el-row :gutter="12">
          <el-col :span="8" v-for="lang in ['ja','ko','en']" :key="lang">
            <el-form-item :label="lang.toUpperCase()">
              <el-input v-model="form.translations[lang]" :placeholder="`${lang} name`" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>Images</el-divider>
        <el-upload
          :action="uploadUrl"
          :headers="uploadHeaders"
          :on-success="onImageUpload"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept="image/*"
          multiple
        >
          <el-button>+ Add Image</el-button>
        </el-upload>
        <div v-if="form.images.length" class="images-preview" style="margin-top: 8px">
          <div v-for="(img, idx) in form.images" :key="idx" class="image-item">
            <el-image :src="typeof img === 'string' ? img : img.imageUrl" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px" fit="cover" />
            <el-button circle size="small" type="danger" @click="form.images.splice(idx, 1)">X</el-button>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { catalogApi, type CatalogProduct } from '@/api/catalog'
import { categoryApi, type CategoryItem } from '@/api/category'
import { storage, STORAGE_KEYS } from '@/utils/storage'

defineOptions({ name: 'CatalogProductView' })

const loading = ref(false)
const tableData = ref<CatalogProduct[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('Create Product')
const submitLoading = ref(false)
const isEdit = ref(false)
const editId = ref<number | null>(null)
const formRef = ref()
const categoryOptions = ref<CategoryItem[]>([])

const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/image`
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${storage.get<string>(STORAGE_KEYS.TOKEN)}`,
}))

const searchForm = reactive({
  keyword: '',
  categoryId: null as number | null,
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  brand: 'DJI',
  name: '',
  model: '',
  categoryId: null as number | null,
  description: '',
  coverImage: '',
  merchantPrice: 0,
  salePrice: 0,
  originalPrice: 0,
  stockMode: 'PLATFORM_GLOBAL',
  globalStock: 0,
  sort: 0,
  translations: {} as Record<string, string>,
  images: [] as (string | { imageUrl: string })[],
})

function calcProfit() {
  // handled on server side; just for display
}

function resetForm() {
  form.brand = 'DJI'
  form.name = ''
  form.model = ''
  form.categoryId = null
  form.description = ''
  form.coverImage = ''
  form.merchantPrice = 0
  form.salePrice = 0
  form.originalPrice = 0
  form.stockMode = 'PLATFORM_GLOBAL'
  form.globalStock = 0
  form.sort = 0
  form.translations = {}
  form.images = []
  isEdit.value = false
  editId.value = null
}

async function loadCategories() {
  try {
    const { data: res } = await categoryApi.getCategories({ page: 1, pageSize: 999 })
    if (res.code === 200) categoryOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await catalogApi.getProducts({
      keyword: searchForm.keyword || undefined,
      categoryId: searchForm.categoryId || undefined,
      status: searchForm.status || undefined,
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

function openCreate() {
  resetForm()
  dialogTitle.value = 'Create Product'
  dialogVisible.value = true
}

function openEdit(row: CatalogProduct) {
  isEdit.value = true
  editId.value = row.id
  dialogTitle.value = 'Edit Product'
  form.brand = row.brand || 'DJI'
  form.name = row.name
  form.model = row.model
  form.categoryId = row.categoryId
  form.description = row.description || ''
  form.coverImage = row.coverImage || ''
  form.merchantPrice = row.merchantPrice
  form.salePrice = row.salePrice
  form.originalPrice = row.originalPrice || 0
  form.stockMode = row.stockMode
  form.globalStock = row.globalStock
  form.sort = row.sort || 0
  form.translations = {}
  if (row.translations) {
    row.translations.forEach((t) => { form.translations[t.languageCode] = t.name })
  }
  form.images = (row.images || []).map((img) => ({ imageUrl: img.imageUrl || img.url || '' })).filter((img) => img.imageUrl)
  dialogVisible.value = true
}

async function handleSubmit() {
  submitLoading.value = true
  try {
    const payload = {
      brand: form.brand || 'DJI',
      name: form.name,
      model: form.model,
      categoryId: form.categoryId,
      description: form.description,
      coverImage: form.coverImage,
      merchantPrice: form.merchantPrice,
      salePrice: form.salePrice,
      originalPrice: form.originalPrice,
      stockMode: form.stockMode,
      globalStock: form.globalStock,
      sort: form.sort,
      translations: Object.entries(form.translations).map(([lang, name]) => ({
        languageCode: lang,
        name,
      })),
      images: form.images.map((img) =>
        typeof img === 'string' ? { url: img, sort: 0 } : { url: img.imageUrl, sort: 0 }
      ),
    }
    if (isEdit.value && editId.value) {
      const { data: res } = await catalogApi.updateProduct(editId.value, payload)
      if (res.code === 200) {
        ElMessage.success('Product updated. Price changes will be pushed to merchants via WebSocket.')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Update failed')
      }
    } else {
      const { data: res } = await catalogApi.createProduct(payload)
      if (res.code === 200) {
        ElMessage.success('Product created')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Create failed')
      }
    }
  } catch {
    ElMessage.error('Operation failed')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: CatalogProduct) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await catalogApi.updateProductStatus(row.id, newStatus)
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

async function handleDelete(row: CatalogProduct) {
  try {
    const { data: res } = await catalogApi.deleteProduct(row.id)
    if (res.code === 200) {
      ElMessage.success('Deleted')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Delete failed')
    }
  } catch {
    ElMessage.error('Delete failed')
  }
}

function beforeUpload(file: File) {
  const isValid = file.type.startsWith('image/')
  if (!isValid) ElMessage.error('Only images allowed')
  return isValid
}

function onCoverUpload(res: any) {
  if (res.code === 200 && res.data?.url) {
    form.coverImage = res.data.url
  }
}

function onImageUpload(res: any) {
  if (res.code === 200 && res.data?.url) {
    form.images.push({ imageUrl: res.data.url })
  }
}

onMounted(async () => {
  await loadCategories()
  fetchData()
})
</script>

<style scoped>
.catalog-product-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.images-preview { display: flex; flex-wrap: wrap; gap: 8px; }
.image-item { position: relative; display: inline-block; }
.image-item .el-button { position: absolute; top: -6px; right: -6px; }
</style>
