<template>
  <div class="review-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.productId" placeholder="Product ID" clearable @clear="handleSearch" style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="User ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.rating" placeholder="Rating" clearable @change="handleSearch" style="width: 100px">
          <el-option label="★5" :value="5" />
          <el-option label="★4" :value="4" />
          <el-option label="★3" :value="3" />
          <el-option label="★2" :value="2" />
          <el-option label="★1" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch" style="width: 120px">
          <el-option label="Visible" value="VISIBLE" />
          <el-option label="Hidden" value="HIDDEN" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column label="Product" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.productTitle || '-' }}</template>
      </el-table-column>
      <el-table-column label="Customer" width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.userName || `ID:${row.userId}` }}</template>
      </el-table-column>
      <el-table-column label="Merchant" width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.merchantName || `ID:${row.merchantId}` }}</template>
      </el-table-column>
      <el-table-column label="Rating" width="120" align="center">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled show-score size="small" />
        </template>
      </el-table-column>
      <el-table-column label="Content" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.content?.length > 50 ? row.content.slice(0, 50) + '...' : row.content }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'VISIBLE' ? 'success' : 'info'" size="small">
            {{ row.status === 'VISIBLE' ? 'Visible' : 'Hidden' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="160" />
      <el-table-column label="Actions" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">Detail</el-button>
          <el-button link :type="row.status === 'VISIBLE' ? 'warning' : 'success'" @click="handleToggleStatus(row)">
            {{ row.status === 'VISIBLE' ? 'Hide' : 'Show' }}
          </el-button>
          <el-popconfirm title="Confirm delete?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger">Delete</el-button>
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

    <el-dialog v-model="detailVisible" title="Review Detail" width="600px">
      <div v-if="detailRow" class="review-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="Product">{{ detailRow.productTitle || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Customer">{{ detailRow.userName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Merchant">{{ detailRow.merchantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="detailRow.status === 'VISIBLE' ? 'success' : 'info'" size="small">{{ detailRow.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Rating">
            <el-rate v-model="detailRow.rating" disabled show-score size="small" />
          </el-descriptions-item>
          <el-descriptions-item label="Created">{{ detailRow.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="Content" :span="2">{{ detailRow.content }}</el-descriptions-item>
          <el-descriptions-item v-if="detailRow.replyContent" label="Reply" :span="2">
            <div class="reply-box">
              <p>{{ detailRow.replyContent }}</p>
              <span v-if="detailRow.replyAt" class="reply-time">{{ detailRow.replyAt }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="detailRow.images?.length" class="review-images">
          <h4>Images</h4>
          <div class="image-list">
            <el-image
              v-for="(img, idx) in detailRow.images"
              :key="idx"
              :src="img"
              style="width: 100px; height: 100px; margin-right: 8px; border-radius: 4px"
              fit="cover"
              :preview-src-list="detailRow.images"
              :initial-index="idx"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reviewApi, type ReviewItem } from '@/api/review'

defineOptions({ name: 'ReviewListView' })

const loading = ref(false)
const tableData = ref<ReviewItem[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailRow = ref<ReviewItem | null>(null)

const searchForm = reactive({
  keyword: '',
  productId: '',
  userId: '',
  merchantId: '',
  rating: null as number | null,
  status: '',
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await reviewApi.getReviews({
      keyword: searchForm.keyword || undefined,
      productId: searchForm.productId || undefined,
      userId: searchForm.userId || undefined,
      merchantId: searchForm.merchantId || undefined,
      rating: searchForm.rating || undefined,
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

function handleDetail(row: ReviewItem) {
  detailRow.value = row
  detailVisible.value = true
}

async function handleToggleStatus(row: ReviewItem) {
  const newStatus = row.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE'
  try {
    const { data: res } = await reviewApi.updateReviewStatus(row.id, newStatus)
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

async function handleDelete(row: ReviewItem) {
  try {
    const { data: res } = await reviewApi.deleteReview(row.id)
    if (res.code === 200) {
      ElMessage.success('Deleted successfully')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Delete failed')
    }
  } catch {
    ElMessage.error('Delete failed')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.review-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.review-detail { }
.review-images { margin-top: 16px; }
.review-images h4 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.image-list { display: flex; flex-wrap: wrap; }
.reply-box { background: #f5f7fa; padding: 12px; border-radius: 6px; }
.reply-time { font-size: 12px; color: #909399; margin-top: 4px; display: block; }
</style>
