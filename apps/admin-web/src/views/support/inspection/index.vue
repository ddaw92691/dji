<template>
  <div class="inspection-page">
    <div class="page-header">
      <h3>质检管理</h3>
      <el-button type="primary" @click="openCreate">新建质检</el-button>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="merchantName" label="商户" width="120" show-overflow-tooltip />
      <el-table-column prop="fakeCustomerName" label="虚拟客户" width="120" show-overflow-tooltip />
      <el-table-column label="问题" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">{{ row.question?.length > 50 ? row.question.slice(0, 50) + '...' : row.question }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'OPEN' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'" size="small">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="回复" width="100" align="center">
        <template #default="{ row }">
          <span v-if="row.firstResponseSeconds">{{ row.firstResponseSeconds }}s</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="100" align="center">
        <template #default="{ row }">
          <el-rate v-if="row.qualityScore" v-model="row.qualityScore" disabled size="small" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">消息</el-button>
          <el-button link type="warning" @click="openScore(row)">评分</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <el-dialog v-model="createVisible" title="新建质检" width="550px" @closed="resetCreateForm">
      <el-form :model="createForm" label-width="140px">
        <el-form-item label="商户" required>
          <el-select v-model="createForm.merchantId" filterable placeholder="请选择商户" style="width: 100%">
            <el-option v-for="m in merchantOptions" :key="m.id" :label="m.name" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟客户名称" required>
          <el-input v-model="createForm.fakeCustomerName" placeholder="e.g. Mystery Shopper" />
        </el-form-item>
        <el-form-item label="客户用户ID">
          <el-input v-model="createForm.customerUserId" placeholder="选填" />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="createForm.productId" placeholder="选填" />
        </el-form-item>
        <el-form-item label="标题" required>
          <el-input v-model="createForm.title" placeholder="质检标题" />
        </el-form-item>
        <el-form-item label="问题" required>
          <el-input v-model="createForm.question" type="textarea" :rows="4" placeholder="向商户提出的问题…" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="createForm.priority" style="width: 100%">
            <el-option label="低" value="LOW" />
            <el-option label="中" value="MEDIUM" />
            <el-option label="高" value="HIGH" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreate">新增</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="质检消息" width="700px">
      <div v-if="detailMessages.length" class="msg-list" ref="detailMsgRef">
        <div v-for="msg in detailMessages" :key="msg.id" class="msg-item">
          <span class="msg-side" :class="msg.senderSide === 'CUSTOMER' ? 'side-customer' : 'side-merchant'">
            [{{ msg.senderSide }}]
          </span>
          <span class="msg-name">{{ msg.senderDisplayName }}:</span>
          <span class="msg-content">{{ msg.content }}</span>
          <span class="msg-time">{{ msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '' }}</span>
        </div>
      </div>
      <div v-else class="msg-empty">暂无消息</div>
    </el-dialog>

    <el-dialog v-model="scoreVisible" title="质量评分" width="450px" @closed="resetScoreForm">
      <el-form :model="scoreForm" label-width="120px">
        <el-form-item label="评分">
          <el-rate v-model="scoreForm.qualityScore" :max="5" show-score />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="scoreForm.qualityRemark" type="textarea" :rows="3" placeholder="备注（选填）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scoreVisible = false">取消</el-button>
        <el-button type="primary" :loading="scoring" @click="handleScore">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { inspectionApi, type IInspectionSession, type ISupportMessage } from '@/api/support'

defineOptions({ name: 'InspectionManagementView' })

const loading = ref(false)
const tableData = ref<IInspectionSession[]>([])
const total = ref(0)
const createVisible = ref(false)
const creating = ref(false)
const detailVisible = ref(false)
const scoreVisible = ref(false)
const scoring = ref(false)
const detailMessages = ref<ISupportMessage[]>([])
const detailMsgRef = ref<HTMLElement>()
const scoringId = ref<number | null>(null)
const merchantOptions = ref<{id:number;name:string}[]>([])

const searchForm = reactive({
  page: 1,
  pageSize: 20,
})

const createForm = reactive({
  merchantId: null as number | null,
  fakeCustomerName: '',
  customerUserId: '',
  productId: '',
  title: '',
  question: '',
  priority: 'MEDIUM',
})

const scoreForm = reactive({
  qualityScore: 0,
  qualityRemark: '',
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await inspectionApi.getList({ page: searchForm.page, pageSize: searchForm.pageSize })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch { /* ignore */ } finally { loading.value = false }
}

function openCreate() {
  createForm.merchantId = null
  createForm.fakeCustomerName = ''
  createForm.customerUserId = ''
  createForm.productId = ''
  createForm.title = ''
  createForm.question = ''
  createForm.priority = 'MEDIUM'
  createVisible.value = true
  loadMerchants()
}

async function loadMerchants() {
  try {
    const { default: request } = await import('@/utils/request')
    const { data: res } = await request.get('/admin/merchants', { params: { page: 1, pageSize: 200 } })
    if (res.code === 200) {
      merchantOptions.value = (res.data.list || []).map((m: any) => ({ id: m.id, name: m.nickname || m.shopName || `ID:${m.id}` }))
    }
  } catch { /* ignore */ }
}

function resetCreateForm() {}

async function handleCreate() {
  if (!createForm.merchantId || !createForm.fakeCustomerName.trim() || !createForm.title.trim() || !createForm.question.trim()) {
    ElMessage.warning('请填写必填项')
    return
  }
  creating.value = true
  try {
    const { data: res } = await inspectionApi.create({
      merchantId: createForm.merchantId,
      fakeCustomerName: createForm.fakeCustomerName,
      inspectionCustomerUserId: createForm.customerUserId ? Number(createForm.customerUserId) : undefined,
      relatedProductId: createForm.productId ? Number(createForm.productId) : undefined,
      title: createForm.title,
      question: createForm.question,
      priority: createForm.priority,
    })
    if (res.code === 200) {
      ElMessage.success('质检已创建')
      createVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch { ElMessage.error('创建失败') } finally { creating.value = false }
}

async function openDetail(row: IInspectionSession) {
  detailVisible.value = true
  try {
    const { data: res } = await inspectionApi.getMessages(row.sessionId)
    if (res.code === 200) {
      detailMessages.value = res.data || []
    }
  } catch { /* ignore */ }
}

function openScore(row: IInspectionSession) {
  scoringId.value = row.id
  scoreForm.qualityScore = row.qualityScore || 0
  scoreForm.qualityRemark = row.qualityRemark || ''
  scoreVisible.value = true
}

function resetScoreForm() {
  scoringId.value = null
}

async function handleScore() {
  if (!scoringId.value) return
  scoring.value = true
  try {
    const { data: res } = await inspectionApi.score(scoringId.value, {
      qualityScore: scoreForm.qualityScore,
      qualityRemark: scoreForm.qualityRemark,
    })
    if (res.code === 200) {
      ElMessage.success('评分已保存')
      scoreVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '评分失败')
    }
  } catch { ElMessage.error('评分失败') } finally { scoring.value = false }
}

onMounted(() => { fetchData() })
</script>

<style scoped>
.inspection-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 16px; }
.msg-list { max-height: 400px; overflow-y: auto; padding: 8px; background: #f5f7fa; border-radius: 8px; }
.msg-item { padding: 6px 0; border-bottom: 1px solid #ebeef5; font-size: 13px; line-height: 1.6; }
.msg-item:last-child { border-bottom: none; }
.msg-side { font-weight: 600; margin-right: 4px; font-size: 11px; }
.side-customer { color: #409eff; }
.side-merchant { color: #67c23a; }
.msg-name { color: #909399; margin-right: 8px; }
.msg-content { color: #303133; word-break: break-word; }
.msg-time { color: #c0c4cc; margin-left: 12px; font-size: 11px; }
.msg-empty { text-align: center; color: #909399; padding: 40px; }
</style>
