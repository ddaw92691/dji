<template>
  <div class="cm-support-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.customerUserId" placeholder="Customer ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch" style="width: 110px">
          <el-option label="Open" value="OPEN" />
          <el-option label="Closed" value="CLOSED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.sessionType" placeholder="Type" clearable @change="handleSearch" style="width: 130px">
          <el-option label="Normal" value="NORMAL" />
          <el-option label="Inspection" value="INSPECTION" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="to" start-placeholder="Start" end-placeholder="End" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleSearch" style="width: 240px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading" @row-click="openDetail">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="sessionNo" label="Session No" width="150" show-overflow-tooltip />
      <el-table-column prop="customerName" label="Customer" width="100" show-overflow-tooltip />
      <el-table-column prop="merchantName" label="Merchant" width="100" show-overflow-tooltip />
      <el-table-column label="Type" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.sessionType === 'INSPECTION' ? 'warning' : 'info'" size="small">{{ row.sessionType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'OPEN' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Priority" width="70" align="center">
        <template #default="{ row }">
          <el-tag :type="row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'" size="small">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Response" width="90" align="center">
        <template #default="{ row }">
          <span v-if="row.firstResponseSeconds">{{ row.firstResponseSeconds }}s</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Msg" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">{{ row.lastMessage || '-' }}</template>
      </el-table-column>
      <el-table-column label="Unread" width="80" align="center">
        <template #default="{ row }">
          <span>C:{{ row.customerUnread || 0 }} / M:{{ row.merchantUnread || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Inspect" width="80" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.inspectionId" type="warning" size="small">#{{ row.inspectionId }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastMessageAt" label="Last At" width="160" />
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="openDetail(row)">Detail</el-button>
          <el-button v-if="row.status === 'OPEN'" link type="danger" @click.stop="handleClose(row)">Close</el-button>
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

    <el-dialog v-model="detailVisible" :title="'Session: ' + (detailSession?.sessionNo || '')" width="750px">
      <div v-if="detailSession" class="detail-panel">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="Customer">{{ detailSession.customerName || `ID:${detailSession.customerUserId}` }}</el-descriptions-item>
          <el-descriptions-item label="Merchant">{{ detailSession.merchantName || `ID:${detailSession.merchantId}` }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="detailSession.status === 'OPEN' ? 'success' : 'info'" size="small">{{ detailSession.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Type">{{ detailSession.sessionType }}</el-descriptions-item>
          <el-descriptions-item label="Priority">{{ detailSession.priority }}</el-descriptions-item>
          <el-descriptions-item v-if="detailSession.operatorName" label="Operator">{{ detailSession.operatorName }}</el-descriptions-item>
        </el-descriptions>
        <el-divider>Messages</el-divider>
        <div class="msg-list" ref="detailMsgRef">
          <div v-for="msg in detailMessages" :key="msg.id" class="msg-item">
            <span class="msg-side" :class="msg.senderSide === 'CUSTOMER' ? 'side-customer' : msg.senderSide === 'MERCHANT' ? 'side-merchant' : 'side-admin'">
              [{{ msg.senderSide }}]
            </span>
            <span class="msg-name">{{ msg.senderDisplayName }}:</span>
            <span v-if="msg.messageType === 'IMAGE'" class="msg-img">
              <el-image :src="msg.content" style="max-width:120px;max-height:120px;border-radius:4px;cursor:pointer;vertical-align:middle" :preview-src-list="[msg.content]" fit="cover" />
            </span>
            <span v-else class="msg-content">{{ msg.content }}</span>
            <span class="msg-time">{{ msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '' }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { customerMerchantApi, type IAdminSupportSession, type ISupportMessage } from '@/api/support'

defineOptions({ name: 'AdminCustomerMerchantSupportView' })

const loading = ref(false)
const tableData = ref<IAdminSupportSession[]>([])
const total = ref(0)
const detailVisible = ref(false)
const detailSession = ref<IAdminSupportSession | null>(null)
const detailMessages = ref<ISupportMessage[]>([])
const detailMsgRef = ref<HTMLElement>()

const searchForm = reactive({
  keyword: '',
  merchantId: '',
  customerUserId: '',
  status: '',
  sessionType: '',
  dateRange: null as any,
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const [startDate, endDate] = searchForm.dateRange || []
    const { data: res } = await customerMerchantApi.getSessions({
      keyword: searchForm.keyword || undefined,
      merchantId: searchForm.merchantId || undefined,
      customerUserId: searchForm.customerUserId || undefined,
      status: searchForm.status || undefined,
      sessionType: searchForm.sessionType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else { ElMessage.error(res.message || 'Failed') }
  } catch { ElMessage.error('Failed to fetch') } finally { loading.value = false }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

async function openDetail(row: IAdminSupportSession) {
  detailSession.value = row
  detailVisible.value = true
  await customerMerchantApi.markRead(row.id)
  try {
    const { data: res } = await customerMerchantApi.getMessages(row.id)
    if (res.code === 200) {
      detailMessages.value = res.data || []
      await nextTick()
      if (detailMsgRef.value) detailMsgRef.value.scrollTop = detailMsgRef.value.scrollHeight
    }
  } catch { /* ignore */ }
}

async function handleClose(row: IAdminSupportSession) {
  try {
    const { data: res } = await customerMerchantApi.closeSession(row.id)
    if (res.code === 200) {
      ElMessage.success('Session closed')
      fetchData()
    }
  } catch { ElMessage.error('Close failed') }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.cm-support-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.detail-panel { }
.msg-list { max-height: 400px; overflow-y: auto; padding: 8px; background: #f5f7fa; border-radius: 8px; }
.msg-item { padding: 6px 0; border-bottom: 1px solid #ebeef5; font-size: 13px; line-height: 1.6; }
.msg-item:last-child { border-bottom: none; }
.msg-side { font-weight: 600; margin-right: 4px; font-size: 11px; }
.side-customer { color: #409eff; }
.side-merchant { color: #67c23a; }
.side-admin { color: #e6a23c; }
.msg-name { color: #909399; margin-right: 8px; }
.msg-content { color: #303133; word-break: break-word; }
.msg-time { color: #c0c4cc; margin-left: 12px; font-size: 11px; }
.msg-img { display: inline-block; vertical-align: middle; }
</style>
