<template>
  <div class="tax-merchant-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input
          v-model="searchForm.merchantId"
          placeholder="商户ID"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option label="待处理" value="PENDING" />
          <el-option label="已逾期" value="OVERDUE" />
          <el-option label="已支付" value="PAID" />
          <el-option label="已提交" value="SUBMITTED" />
          <el-option label="已取消" value="CANCELLED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.taxType" placeholder="税种" clearable @change="handleSearch">
          <el-option label="销售税" value="SALES_TAX" />
          <el-option label="所得税" value="INCOME_TAX" />
          <el-option label="平台费用" value="PLATFORM_FEE" />
          <el-option label="其他" value="OTHER" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-permission="'admin:tax:create'" @click="openCreate"
          >+ 新建通知</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="merchantName" label="商户" min-width="140" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
      <el-table-column prop="taxType" label="类型" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="taxTypeColors[row.taxType] || 'info'" size="small">{{
            row.taxType
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="100" align="right" />
      <el-table-column prop="currency" label="货币" width="80" align="center" />
      <el-table-column prop="status" label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusColors[row.status] || 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标记" width="130" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.forcePopup" type="warning" size="small" effect="dark">弹窗</el-tag>
          <el-tag
            v-if="row.blockUntilPaid"
            type="danger"
            size="small"
            effect="dark"
            style="margin-left: 4px"
            >拉黑</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="dueAt" label="应缴" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'admin:tax:view'" @click="openDetail(row)"
            >详情</el-button
          >
          <el-button
            v-if="row.status === 'PENDING' || row.status === 'OVERDUE'"
            link
            type="warning"
            v-permission="'admin:tax:create'"
            @click="handleCancel(row)"
            >取消</el-button
          >
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

    <el-dialog v-model="createVisible" title="新建税务通知" width="600px" @close="resetCreateForm">
      <el-form ref="createFormRef" :model="createForm" label-width="130px">
        <el-form-item label="商户" required>
          <el-select
            v-model="createForm.merchantId"
            filterable
            remote
            :remote-method="searchMerchants"
            :loading="merchantLoading"
            placeholder="搜索商户"
            style="width: 100%"
          >
            <el-option v-for="m in merchantOptions" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input v-model="createForm.title" placeholder="通知标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="createForm.content" type="textarea" :rows="4" placeholder="通知内容" />
        </el-form-item>
        <el-form-item label="税种">
          <el-select v-model="createForm.taxType" style="width: 100%">
            <el-option label="销售税" value="SALES_TAX" />
            <el-option label="所得税" value="INCOME_TAX" />
            <el-option label="平台费用" value="PLATFORM_FEE" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="金额">
              <el-input-number
                v-model="createForm.amount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货币">
              <el-input v-model="createForm.currency" placeholder="JPY" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="createForm.dueAt"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="强制弹窗">
          <el-checkbox v-model="createForm.forcePopup" />
        </el-form-item>
        <el-form-item label="未支付前锁定">
          <el-checkbox v-model="createForm.blockUntilPaid" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="createLoading" @click="handleCreate">新增</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="税务通知详情" width="650px">
      <div v-if="detailItem">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="ID">{{ detailItem.id }}</el-descriptions-item>
          <el-descriptions-item label="商户">{{ detailItem.merchantName }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ detailItem.title }}</el-descriptions-item>
          <el-descriptions-item label="税种">{{ detailItem.taxType }}</el-descriptions-item>
          <el-descriptions-item label="金额"
            >{{ detailItem.amount }} {{ detailItem.currency }}</el-descriptions-item
          >
          <el-descriptions-item label="状态">{{ detailItem.status }}</el-descriptions-item>
          <el-descriptions-item label="截止日期">{{
            detailItem.dueAt || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{
            detailItem.paidAt || '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="强制弹窗">{{
            detailItem.forcePopup ? 'Yes' : 'No'
          }}</el-descriptions-item>
          <el-descriptions-item label="未支付前锁定">{{
            detailItem.blockUntilPaid ? 'Yes' : 'No'
          }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailItem.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detailItem.updatedAt }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="detailItem.content" style="margin-top: 12px">
          <strong>Content:</strong>
          <p style="white-space: pre-wrap; margin-top: 4px">{{ detailItem.content }}</p>
        </div>
        <div v-if="detailItem.paymentProof" style="margin-top: 12px">
          <strong>Payment Proof:</strong>
          <el-image
            :src="detailItem.paymentProof"
            style="max-width: 100%; max-height: 300px; margin-top: 4px; display: block"
            fit="contain"
          />
          <p v-if="detailItem.proofRemark" style="margin-top: 4px">
            Remark: {{ detailItem.proofRemark }}
          </p>
        </div>
        <div v-if="detailItem.paymentMethod" style="margin-top: 8px">
          <strong>Payment Method:</strong> {{ detailItem.paymentMethod }}
        </div>
        <div v-if="detailItem.rejectReason" style="margin-top: 8px; color: #f56c6c">
          <strong>Reject Reason:</strong> {{ detailItem.rejectReason }}
        </div>

        <div
          v-if="detailItem.status === 'SUBMITTED'"
          style="margin-top: 16px; border-top: 1px solid #ebeef5; padding-top: 12px"
        >
          <strong>Review:</strong>
          <div style="margin-top: 8px; display: flex; gap: 8px">
            <el-button
              type="success"
              v-permission="'admin:tax:review'"
              @click="handleReview(detailItem, true)"
              >通过</el-button
            >
            <el-button
              type="danger"
              v-permission="'admin:tax:review'"
              @click="openRejectReview(detailItem)"
              >拒绝</el-button
            >
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewRejectVisible" title="拒绝原因" width="450px">
      <el-form>
        <el-form-item label="原因">
          <el-input
            v-model="rejectReason"
            type="textarea"
            :rows="3"
            placeholder="请说明凭证被拒绝的原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewRejectVisible = false">取消</el-button>
        <el-button
          type="danger"
          :loading="reviewLoading"
          @click="handleReview(reviewTarget!, false)"
          >拒绝</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { taxApi, type TaxNotice } from '@/api/tax'

defineOptions({ name: 'TaxMerchantView' })

const loading = ref(false)
const tableData = ref<TaxNotice[]>([])
const total = ref(0)

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'

const statusColors: Record<string, TagType> = {
  PENDING: 'warning',
  OVERDUE: 'danger',
  PAID: 'success',
  SUBMITTED: 'primary',
  CANCELLED: 'info',
}
const taxTypeColors: Record<string, TagType> = {
  SALES_TAX: 'primary',
  INCOME_TAX: 'warning',
  PLATFORM_FEE: 'danger',
  OTHER: 'info',
}

const searchForm = reactive({
  merchantId: '',
  status: '',
  taxType: '',
  page: 1,
  pageSize: 20,
})

const createVisible = ref(false)
const createLoading = ref(false)
const merchantLoading = ref(false)
const merchantOptions = ref<any[]>([])
const createFormRef = ref()
const createForm = reactive({
  merchantId: null as number | null,
  title: '',
  content: '',
  taxType: 'OTHER',
  amount: 0,
  currency: 'JPY',
  dueAt: '' as string | Date,
  forcePopup: false,
  blockUntilPaid: false,
})

const detailVisible = ref(false)
const detailItem = ref<TaxNotice | null>(null)

const reviewRejectVisible = ref(false)
const reviewTarget = ref<TaxNotice | null>(null)
const rejectReason = ref('')
const reviewLoading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await taxApi.getTaxNotices({
      merchantId: searchForm.merchantId || undefined,
      status: searchForm.status || undefined,
      taxType: searchForm.taxType || undefined,
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

function openCreate() {
  resetCreateForm()
  createVisible.value = true
}
function resetCreateForm() {
  createForm.merchantId = null
  createForm.title = ''
  createForm.content = ''
  createForm.taxType = 'OTHER'
  createForm.amount = 0
  createForm.currency = 'JPY'
  createForm.dueAt = ''
  createForm.forcePopup = false
  createForm.blockUntilPaid = false
}

async function searchMerchants(query: string) {
  if (!query) return
  merchantLoading.value = true
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.get<{ code: number; data: { list: any[] } }>(
      '/admin/merchants',
      { params: { keyword: query, pageSize: 20 } },
    )
    if (res.code === 200) merchantOptions.value = res.data?.list || []
  } catch {
    /* ignore */
  } finally {
    merchantLoading.value = false
  }
}

async function handleCreate() {
  if (!createForm.merchantId || !createForm.title) {
    ElMessage.warning('商户和标题为必填项')
    return
  }
  createLoading.value = true
  try {
    const { data: res } = await taxApi.createTaxNotice({
      merchantId: createForm.merchantId,
      title: createForm.title,
      content: createForm.content,
      taxType: createForm.taxType,
      amount: createForm.amount,
      currency: createForm.currency,
      dueAt: createForm.dueAt || undefined,
      forcePopup: createForm.forcePopup,
      blockUntilPaid: createForm.blockUntilPaid,
    })
    if (res.code === 200) {
      ElMessage.success('税务通知已创建')
      createVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch {
    ElMessage.error('创建失败')
  } finally {
    createLoading.value = false
  }
}

function openDetail(row: TaxNotice) {
  detailItem.value = row
  detailVisible.value = true
}

async function handleCancel(row: TaxNotice) {
  try {
    const { data: res } = await taxApi.cancelTaxNotice(row.id)
    if (res.code === 200) {
      ElMessage.success('通知已取消')
      fetchData()
    } else {
      ElMessage.error(res.message || '取消失败')
    }
  } catch {
    ElMessage.error('取消失败')
  }
}

function openRejectReview(row: TaxNotice) {
  reviewRejectVisible.value = true
  reviewTarget.value = row
}

async function handleReview(row: TaxNotice, approved: boolean) {
  reviewLoading.value = true
  try {
    const { data: res } = await taxApi.reviewTaxNotice(row.id, {
      approved,
      rejectReason: approved ? undefined : rejectReason.value,
    })
    if (res.code === 200) {
      ElMessage.success(approved ? 'Proof approved' : 'Proof rejected')
      reviewRejectVisible.value = false
      rejectReason.value = ''
      detailVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '审核失败')
    }
  } catch {
    ElMessage.error('审核失败')
  } finally {
    reviewLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.tax-merchant-page {
  padding: 20px;
}
.search-bar {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
