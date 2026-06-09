<template>
  <div class="review-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.productId" placeholder="Product ID" clearable @clear="handleSearch" style="width: 140px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.rating" placeholder="Rating" clearable @change="handleSearch" style="width: 120px">
          <el-option label="★5" :value="5" />
          <el-option label="★4" :value="4" />
          <el-option label="★3" :value="3" />
          <el-option label="★2" :value="2" />
          <el-option label="★1" :value="1" />
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
      <el-table-column label="Rating" width="130" align="center">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled show-score size="small" />
        </template>
      </el-table-column>
      <el-table-column label="Content" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.content?.length > 60 ? row.content.slice(0, 60) + '...' : row.content }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'VISIBLE' ? 'success' : 'info'" size="small">
            {{ row.status === 'VISIBLE' ? 'Visible' : 'Hidden' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Reply" width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="row.replyContent" class="reply-badge">Replied</span>
          <span v-else class="no-reply">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="160" />
      <el-table-column label="Actions" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleReply(row)">Reply</el-button>
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

    <el-dialog v-model="replyVisible" title="Reply to Review" width="550px">
      <div v-if="replyRow" class="reply-detail">
        <el-descriptions :column="1" border size="small" class="mb-4">
          <el-descriptions-item label="Product">{{ replyRow.productTitle || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Customer">{{ replyRow.userName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Rating">
            <el-rate v-model="replyRow.rating" disabled show-score size="small" />
          </el-descriptions-item>
          <el-descriptions-item label="Content">{{ replyRow.content }}</el-descriptions-item>
          <el-descriptions-item v-if="replyRow.replyContent" label="Your Reply">
            <div class="existing-reply">
              <p>{{ replyRow.replyContent }}</p>
              <span v-if="replyRow.replyAt" class="reply-time">{{ replyRow.replyAt }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-form label-width="100px">
        <el-form-item label="Reply Content">
          <el-input
            v-model="replyContent"
            type="textarea"
            :rows="4"
            placeholder="Write your reply..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="replySubmitting" @click="handleSubmitReply">Submit</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reviewApi, type ReviewItem } from '@/api/review'

defineOptions({ name: 'MerchantReviewListView' })

const loading = ref(false)
const replySubmitting = ref(false)
const tableData = ref<ReviewItem[]>([])
const total = ref(0)
const replyVisible = ref(false)
const replyRow = ref<ReviewItem | null>(null)
const replyContent = ref('')

const searchForm = reactive({
  productId: '',
  rating: null as number | null,
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await reviewApi.getReviews({
      productId: searchForm.productId || undefined,
      rating: searchForm.rating || undefined,
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

function handleReply(row: ReviewItem) {
  replyRow.value = { ...row }
  replyContent.value = row.replyContent || ''
  replyVisible.value = true
}

async function handleSubmitReply() {
  if (!replyRow.value || !replyContent.value.trim()) {
    ElMessage.warning('Please enter reply content')
    return
  }
  replySubmitting.value = true
  try {
    const { data: res } = await reviewApi.replyReview(replyRow.value.id, replyContent.value.trim())
    if (res.code === 200) {
      ElMessage.success('Reply submitted')
      replyVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Reply failed')
    }
  } catch {
    ElMessage.error('Reply failed')
  } finally {
    replySubmitting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.review-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.reply-badge { color: #67c23a; font-size: 12px; font-weight: 500; }
.no-reply { color: #c0c4cc; }
.existing-reply { background: #f5f7fa; padding: 10px; border-radius: 6px; }
.reply-time { font-size: 12px; color: #909399; margin-top: 4px; display: block; }
.mb-4 { margin-bottom: 16px; }
</style>
