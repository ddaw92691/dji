<template>
  <div class="admin-platform-support-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="Merchant ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch" style="width: 110px">
          <el-option label="Open" value="OPEN" />
          <el-option label="Closed" value="CLOSED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.priority" placeholder="Priority" clearable @change="handleSearch" style="width: 110px">
          <el-option label="High" value="HIGH" />
          <el-option label="Medium" value="MEDIUM" />
          <el-option label="Low" value="LOW" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading" @row-click="openReply">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="merchantName" label="Merchant" width="120" show-overflow-tooltip />
      <el-table-column prop="title" label="Title" min-width="180" show-overflow-tooltip />
      <el-table-column label="Status" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'OPEN' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Priority" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'" size="small">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Message" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">{{ row.lastMessage || '-' }}</template>
      </el-table-column>
      <el-table-column label="Unread" width="70" align="center">
        <template #default="{ row }">
          <el-badge v-if="row.merchantUnread" :value="row.merchantUnread" type="danger" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastMessageAt" label="Last At" width="160" />
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="openReply(row)">Reply</el-button>
          <el-button v-if="row.status === 'OPEN'" link type="danger" @click.stop="handleClose(row)">Close</el-button>
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

    <el-dialog v-model="chatVisible" title="Platform Support Reply" width="700px" @closed="closeChat">
      <div v-if="chatSession" class="chat-panel">
        <div class="chat-header">
          <span class="session-title">{{ chatSession.title }} - {{ chatSession.merchantName }}</span>
          <el-tag :type="chatSession.status === 'OPEN' ? 'success' : 'info'" size="small">{{ chatSession.status }}</el-tag>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="msg in chatMessages" :key="msg.id" class="chat-msg-wrapper" :class="{ 'is-admin': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM' }">
            <div v-if="msg.messageType === 'SYSTEM'" class="system-msg">{{ msg.content }}</div>
            <template v-else>
              <span class="msg-sender">{{ msg.senderDisplayName }} ({{ msg.senderSide }})</span>
              <div class="msg-bubble" :class="{ 'admin-bubble': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM', 'other-bubble': msg.senderSide !== 'ADMIN' && msg.senderSide !== 'PLATFORM' }">
                {{ msg.content }}
              </div>
              <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
            </template>
          </div>
        </div>
        <div class="chat-input-area" v-if="chatSession.status === 'OPEN'">
          <el-select v-model="quickReplySelected" placeholder="Quick Reply" clearable @change="applyQuickReply" style="width: 160px; margin-right: 8px">
            <el-option v-for="qr in quickReplies" :key="qr.id" :label="qr.title" :value="qr.content" />
          </el-select>
          <el-input v-model="chatInput" placeholder="Type a message..." @keyup.enter="sendMessage" class="chat-input" />
          <el-button type="primary" @click="sendMessage" :loading="sending">Send</el-button>
        </div>
        <div v-else class="chat-closed-notice">This session has been closed.</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { platformSupportApi, quickReplyAdminApi, type IAdminSupportSession, type ISupportMessage, type IQuickReply } from '@/api/support'

defineOptions({ name: 'AdminPlatformSupportView' })

const loading = ref(false)
const tableData = ref<IAdminSupportSession[]>([])
const total = ref(0)
const sending = ref(false)
const chatVisible = ref(false)
const chatSession = ref<IAdminSupportSession | null>(null)
const chatMessages = ref<ISupportMessage[]>([])
const chatInput = ref('')
const chatMessagesRef = ref<HTMLElement>()
const quickReplies = ref<IQuickReply[]>([])
const quickReplySelected = ref('')

let chatTimer: any = null

const searchForm = reactive({
  keyword: '',
  merchantId: '',
  status: '',
  priority: '',
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await platformSupportApi.getSessions({
      keyword: searchForm.keyword || undefined,
      merchantId: searchForm.merchantId || undefined,
      status: searchForm.status || undefined,
      priority: searchForm.priority || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch { /* ignore */ } finally { loading.value = false }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

async function openReply(row: IAdminSupportSession) {
  chatSession.value = row
  chatVisible.value = true
  await loadMessages()
  await loadQuickReplies()
  chatTimer = setInterval(loadMessages, 5000)
}

async function loadMessages() {
  if (!chatSession.value) return
  try {
    const { data: res } = await platformSupportApi.getMessages(chatSession.value.id)
    if (res.code === 200) {
      chatMessages.value = res.data || []
      await nextTick()
      scrollToBottom()
    }
  } catch { /* ignore */ }
}

async function loadQuickReplies() {
  try {
    const { data: res } = await quickReplyAdminApi.getList({ page: 1, pageSize: 100, status: 'ENABLE' })
    if (res.code === 200) quickReplies.value = res.data.list || []
  } catch { /* ignore */ }
}

function applyQuickReply(content: string) {
  chatInput.value = content
  quickReplySelected.value = ''
}

async function sendMessage() {
  const text = chatInput.value.trim()
  if (!text || !chatSession.value) return
  sending.value = true
  try {
    const { data: res } = await platformSupportApi.sendMessage(chatSession.value.id, { content: text, messageType: 'TEXT' })
    if (res.code === 200) {
      chatInput.value = ''
      await loadMessages()
    }
  } catch { /* ignore */ } finally { sending.value = false }
}

async function handleClose(row: IAdminSupportSession) {
  try {
    const { data: res } = await platformSupportApi.closeSession(row.id)
    if (res.code === 200) {
      ElMessage.success('Session closed')
      fetchData()
    }
  } catch { ElMessage.error('Close failed') }
}

function closeChat() {
  if (chatTimer) clearInterval(chatTimer)
  chatSession.value = null
  chatMessages.value = []
}

function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

function formatTime(t: string) {
  if (!t) return ''
  return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { fetchData() })
onUnmounted(() => { if (chatTimer) clearInterval(chatTimer) })
</script>

<style scoped>
.admin-platform-support-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.chat-panel { display: flex; flex-direction: column; height: 500px; }
.chat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.session-title { font-size: 13px; color: #909399; }
.chat-messages { flex: 1; overflow-y: auto; padding: 8px; background: #f5f7fa; border-radius: 8px; margin-bottom: 8px; }
.chat-msg-wrapper { margin-bottom: 12px; text-align: left; }
.chat-msg-wrapper.is-admin { text-align: right; }
.msg-sender { font-size: 11px; color: #909399; display: block; margin-bottom: 2px; }
.msg-bubble { display: inline-block; max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; word-break: break-word; }
.other-bubble { background: #e4e7ed; color: #303133; border-bottom-left-radius: 4px; }
.admin-bubble { background: #e6a23c; color: #fff; border-bottom-right-radius: 4px; }
.system-msg { text-align: center; font-size: 12px; color: #c0c4cc; padding: 4px 0; }
.msg-time { font-size: 10px; color: #c0c4cc; display: block; margin-top: 2px; }
.chat-input-area { display: flex; align-items: center; gap: 8px; }
.chat-input { flex: 1; }
.chat-closed-notice { text-align: center; color: #909399; padding: 20px; font-size: 13px; }
</style>
