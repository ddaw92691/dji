<template>
  <div class="support-customer-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch" style="width: 120px">
          <el-option label="Open" value="OPEN" />
          <el-option label="Closed" value="CLOSED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading" @row-click="openChat">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="customerName" label="Customer" width="120" show-overflow-tooltip />
      <el-table-column prop="title" label="Title" min-width="150" show-overflow-tooltip />
      <el-table-column label="Status" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'OPEN' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Priority" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'" size="small">{{ row.priority }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Last Message" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">{{ row.lastMessage || '-' }}</template>
      </el-table-column>
      <el-table-column label="Unread" width="70" align="center">
        <template #default="{ row }">
          <el-badge v-if="row.unreadCount" :value="row.unreadCount" type="danger" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastMessageAt" label="Last At" width="160" />
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="openChat(row)">Chat</el-button>
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

    <el-dialog v-model="chatVisible" :title="chatSession?.customerName || 'Chat'" width="700px" @closed="closeChat">
      <div v-if="chatSession" class="chat-panel">
        <div class="chat-header">
          <span class="session-title">{{ chatSession.title }}</span>
          <el-tag :type="chatSession.status === 'OPEN' ? 'success' : 'info'" size="small">{{ chatSession.status }}</el-tag>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="msg in chatMessages" :key="msg.id" class="chat-msg-wrapper" :class="{ 'is-merchant': msg.senderSide === 'MERCHANT' }">
            <div v-if="msg.messageType === 'SYSTEM'" class="system-msg">{{ msg.content }}</div>
            <template v-else>
              <span class="msg-sender">{{ msg.senderDisplayName }}</span>
              <div v-if="msg.messageType === 'IMAGE'" class="msg-bubble">
                <el-image :src="msg.content" style="max-width:200px;border-radius:8px;cursor:pointer" :preview-src-list="[msg.content]" fit="cover" />
              </div>
              <div v-else class="msg-bubble" :class="{ 'merchant-bubble': msg.senderSide === 'MERCHANT', 'customer-bubble': msg.senderSide === 'CUSTOMER' }">
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
          <el-input
            v-model="chatInput"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
            class="chat-input"
          />
          <input ref="uploadInputRef" type="file" accept="image/*" style="display:none" @change="handleUpload" />
          <el-button @click="() => ($refs.uploadInputRef as HTMLInputElement)?.click()">📷</el-button>
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
import { customerSupportApi, quickReplyApi, type ISupportSession, type ISupportMessage, type IQuickReply } from '@/api/support'

defineOptions({ name: 'CustomerSupportView' })

const loading = ref(false)
const tableData = ref<ISupportSession[]>([])
const total = ref(0)
const sending = ref(false)
const chatVisible = ref(false)
const chatSession = ref<ISupportSession | null>(null)
const chatMessages = ref<ISupportMessage[]>([])
const chatInput = ref('')
const chatMessagesRef = ref<HTMLElement>()
const quickReplies = ref<IQuickReply[]>([])
const quickReplySelected = ref('')

let chatTimer: any = null
let listTimer: any = null

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await customerSupportApi.getSessions({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || 'Failed to fetch')
    }
  } catch { ElMessage.error('Failed to fetch') } finally { loading.value = false }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

async function openChat(row: ISupportSession) {
  chatSession.value = row
  chatVisible.value = true
  await customerSupportApi.markRead(row.id)
  await loadMessages()
  await loadQuickReplies()
  chatTimer = setInterval(loadMessages, 5000)
}

async function loadMessages() {
  if (!chatSession.value) return
  try {
    const { data: res } = await customerSupportApi.getMessages(chatSession.value.id)
    if (res.code === 200) {
      chatMessages.value = res.data || []
      await nextTick()
      scrollToBottom()
    }
  } catch { /* ignore */ }
}

async function loadQuickReplies() {
  try {
    const { data: res } = await quickReplyApi.getList({ status: 'ENABLE', page: 1, pageSize: 100 })
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
    const { data: res } = await customerSupportApi.sendMessage(chatSession.value.id, { content: text, messageType: 'TEXT' })
    if (res.code === 200) {
      chatInput.value = ''
      await loadMessages()
    } else {
      ElMessage.error(res.message || 'Send failed')
    }
  } catch { ElMessage.error('Send failed') } finally { sending.value = false }
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !chatSession.value) return
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bizType', 'support')
  try {
    const baseURL = (window as any).__BASE_URL__ || '/api'
    const uploadRes = await fetch(baseURL + '/upload/image', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
      body: formData,
    }).then(r => r.json())
    if (uploadRes.code === 200 && uploadRes.data) {
      const { data: res } = await customerSupportApi.sendMessage(chatSession.value.id, { content: uploadRes.data, messageType: 'IMAGE' })
      if (res.code === 200) await loadMessages()
    }
  } catch { ElMessage.error('Upload failed') }
  input.value = ''
}

async function handleClose(row: ISupportSession) {
  try {
    const { data: res } = await customerSupportApi.closeSession(row.id)
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
  fetchData()
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

onMounted(() => {
  fetchData()
  listTimer = setInterval(fetchData, 15000)
})

onUnmounted(() => {
  if (listTimer) clearInterval(listTimer)
  if (chatTimer) clearInterval(chatTimer)
})
</script>

<style scoped>
.support-customer-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.chat-panel { display: flex; flex-direction: column; height: 500px; }
.chat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.session-title { font-size: 13px; color: #909399; }
.chat-messages { flex: 1; overflow-y: auto; padding: 8px; background: #f5f7fa; border-radius: 8px; margin-bottom: 8px; }
.chat-msg-wrapper { margin-bottom: 12px; text-align: left; }
.chat-msg-wrapper.is-merchant { text-align: right; }
.msg-sender { font-size: 11px; color: #909399; display: block; margin-bottom: 2px; }
.msg-bubble { display: inline-block; max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; word-break: break-word; }
.customer-bubble { background: #e4e7ed; color: #303133; border-bottom-left-radius: 4px; }
.merchant-bubble { background: #409eff; color: #fff; border-bottom-right-radius: 4px; }
.system-msg { text-align: center; font-size: 12px; color: #c0c4cc; padding: 4px 0; }
.msg-time { font-size: 10px; color: #c0c4cc; display: block; margin-top: 2px; }
.chat-input-area { display: flex; align-items: center; gap: 8px; }
.chat-input { flex: 1; }
.chat-closed-notice { text-align: center; color: #909399; padding: 20px; font-size: 13px; }
</style>
