<template>
  <div class="review-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.productId" placeholder="商品ID" clearable @clear="handleSearch" style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="用户ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="商户ID" clearable @clear="handleSearch" style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.rating" placeholder="评分" clearable @change="handleSearch" style="width: 100px">
          <el-option label="★5" :value="5" />
          <el-option label="★4" :value="4" />
          <el-option label="★3" :value="3" />
          <el-option label="★2" :value="2" />
          <el-option label="★1" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch" style="width: 120px">
          <el-option label="显示" value="VISIBLE" />
          <el-option label="隐藏" value="HIDDEN" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column label="商品" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.productTitle || '-' }}</template>
      </el-table-column>
      <el-table-column label="客户" width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.userName || `ID:${row.userId}` }}</template>
      </el-table-column>
      <el-table-column label="商户" width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.merchantName || `ID:${row.merchantId}` }}</template>
      </el-table-column>
      <el-table-column label="评分" width="120" align="center">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled show-score size="small" />
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.content?.length > 50 ? row.content.slice(0, 50) + '...' : row.content }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'VISIBLE' ? 'success' : 'info'" size="small">
            {{ row.status === 'VISIBLE' ? 'Visible' : 'Hidden' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)">详情</el-button>
          <el-button link :type="row.status === 'VISIBLE' ? 'warning' : 'success'" @click="handleToggleStatus(row)">
            {{ row.status === 'VISIBLE' ? 'Hide' : 'Show' }}
          </el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
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

    <el-dialog v-model="detailVisible" title="评价详情" width="600px">
      <div v-if="detailRow" class="review-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="商品">{{ detailRow.productTitle || '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ detailRow.userName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="商户">{{ detailRow.merchantName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="detailRow.status === 'VISIBLE' ? 'success' : 'info'" size="small">{{ detailRow.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="评分">
            <el-rate v-model="detailRow.rating" disabled show-score size="small" />
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailRow.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">{{ detailRow.content }}</el-descriptions-item>
          <el-descriptions-item v-if="detailRow.replyContent" label="回复" :span="2">
            <div class="reply-box">
              <p>{{ detailRow.replyContent }}</p>
              <span v-if="detailRow.replyAt" class="reply-time">{{ detailRow.replyAt }}</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="detailRow.images?.length" class="review-images">
          <h4>图片</h4>
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
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
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
      ElMessage.success('状态已更新')
      fetchData()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch {
    ElMessage.error('状态更新失败')
  }
}

async function handleDelete(row: ReviewItem) {
  try {
    const { data: res } = await reviewApi.deleteReview(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
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
