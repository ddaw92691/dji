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
        <el-input v-model="searchForm.categoryId" placeholder="Category ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
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
      <el-table-column prop="auditStatus" label="Audit Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="row.auditStatus === 'APPROVED' ? 'success' : row.auditStatus === 'REJECTED' ? 'danger' : row.auditStatus === 'PENDING' ? 'warning' : 'info'">
            {{ row.auditStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Submitted" width="180" />
      <el-table-column label="Actions" width="130" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'product:audit'" @click="handleOpenAudit(row)">Audit</el-button>
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

    <el-dialog v-model="auditVisible" title="Product Audit" width="800px" @close="resetAuditForm">
      <div v-if="auditItem" class="audit-detail">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-image v-if="auditItem.coverImage" :src="auditItem.coverImage" style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 8px" fit="cover" />
          </el-col>
          <el-col :span="12">
            <p><strong>Title:</strong> {{ auditItem.title }}</p>
            <p><strong>Description:</strong> {{ auditItem.description }}</p>
            <p><strong>Price:</strong> ${{ auditItem.price }}</p>
            <p><strong>Original Price:</strong> ${{ auditItem.originalPrice }}</p>
            <p><strong>Stock:</strong> {{ auditItem.stock }}</p>
            <p><strong>Status:</strong> {{ auditItem.status }}</p>
            <p><strong>Audit Status:</strong> {{ auditItem.auditStatus }}</p>
            <p v-if="auditItem.merchantName"><strong>Merchant:</strong> {{ auditItem.merchantName }}</p>
            <p v-if="auditItem.categoryName"><strong>Category:</strong> {{ auditItem.categoryName }}</p>
          </el-col>
        </el-row>

        <el-divider />

        <h4>Product Images</h4>
        <div class="image-gallery">
          <el-image v-for="img in auditItem.images" :key="img.id" :src="img.imageUrl" style="width: 120px; height: 120px; object-fit: cover; margin: 4px; border-radius: 4px" fit="cover" />
          <span v-if="!auditItem.images?.length">No images</span>
        </div>

        <el-divider />

        <h4>Translations</h4>
        <div v-if="auditItem.translations?.length">
          <el-descriptions v-for="pt in auditItem.translations" :key="pt.id" :title="pt.languageCode" :column="1" border size="small" style="margin-bottom: 8px">
            <el-descriptions-item label="Title">{{ pt.title }}</el-descriptions-item>
            <el-descriptions-item label="Description">{{ pt.description }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <span v-else>No translations</span>

        <el-divider />

        <el-form ref="auditFormRef" :model="auditForm" label-width="130px">
          <el-form-item label="Audit Remark" prop="auditRemark">
            <el-input v-model="auditForm.auditRemark" type="textarea" :rows="3" placeholder="Audit remarks (optional)" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="auditVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="auditLoading" @click="handleReject">Reject</el-button>
        <el-button type="success" :loading="auditLoading" @click="handleApprove">Approve</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { productApi, type ProductItem } from '@/api/product'

defineOptions({ name: 'ProductAuditView' })

const loading = ref(false)
const auditLoading = ref(false)
const tableData = ref<ProductItem[]>([])
const total = ref(0)
const auditVisible = ref(false)
const auditItem = ref<ProductItem | null>(null)
const auditingId = ref<number | null>(null)
const auditFormRef = ref<FormInstance>()

const searchForm = reactive({
  keyword: '',
  merchantId: '',
  categoryId: '',
  page: 1,
  pageSize: 20,
})

const auditForm = reactive({
  auditRemark: '',
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await productApi.getAuditList({
      keyword: searchForm.keyword || undefined,
      merchantId: searchForm.merchantId || undefined,
      categoryId: searchForm.categoryId || undefined,
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

async function handleOpenAudit(row: ProductItem) {
  try {
    const { data: res } = await productApi.getProductDetail(row.id)
    if (res.code === 200) {
      auditItem.value = res.data
      auditingId.value = row.id
      auditForm.auditRemark = ''
      auditVisible.value = true
    } else {
      ElMessage.error(res.message || 'Failed to load detail')
    }
  } catch {
    ElMessage.error('Failed to load detail')
  }
}

async function handleApprove() {
  await doAudit('APPROVED')
}

async function handleReject() {
  await doAudit('REJECTED')
}

async function doAudit(auditStatus: string) {
  if (!auditingId.value) return
  auditLoading.value = true
  try {
    const { data: res } = await productApi.auditProduct(auditingId.value, {
      auditStatus,
      auditRemark: auditForm.auditRemark || undefined,
    })
    if (res.code === 200) {
      ElMessage.success(auditStatus === 'APPROVED' ? 'Approved successfully' : 'Rejected')
      auditVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Audit failed')
    }
  } catch {
    ElMessage.error('Audit failed')
  } finally {
    auditLoading.value = false
  }
}

function resetAuditForm() {
  auditFormRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.audit-detail p { margin: 6px 0; }
.image-gallery { display: flex; flex-wrap: wrap; }
</style>
