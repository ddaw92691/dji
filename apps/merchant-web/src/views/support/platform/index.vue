<template>
  <div class="support-platform-page">
    <div class="page-header">
      <div>
        <h3>平台支持聊天室</h3>
        <p>与平台客服实时沟通，支持文字和图片消息。</p>
      </div>
      <el-button type="primary" @click="openCreate">新建会话</el-button>
    </div>

    <div class="support-workbench" v-loading="loading">
      <aside class="session-list">
        <div class="session-filter">
          <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
            <el-option label="进行中" value="OPEN" />
            <el-option label="已关闭" value="CLOSED" />
          </el-select>
        </div>

        <button
          v-for="session in tableData"
          :key="session.id"
          class="session-item"
          :class="{ active: chatSession?.id === session.id }"
          type="button"
          @click="openChat(session)"
        >
          <span class="session-row">
            <strong>{{ session.title || session.sessionNo }}</strong>
            <el-badge v-if="getSessionUnread(session)" :value="getSessionUnread(session)" type="danger" />
          </span>
          <span class="session-last">{{ session.lastMessage || '暂无消息' }}</span>
          <span class="session-meta">
            <el-tag :type="session.status === 'OPEN' ? 'success' : 'info'" size="small">
              {{ session.status === 'OPEN' ? '进行中' : '已关闭' }}
            </el-tag>
            <el-tag :type="priorityTagType(session.priority)" size="small">{{ priorityLabel(session.priority) }}</el-tag>
            <span>{{ formatTime(session.lastMessageAt || session.createdAt) }}</span>
          </span>
        </button>

        <el-empty v-if="!tableData.length" description="暂无会话" />
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.pageSize"
          :total="total"
          small
          layout="prev, pager, next"
          @change="fetchData"
        />
      </aside>

      <section class="chat-panel">
        <template v-if="chatSession">
          <div class="chat-header">
            <div>
              <strong>{{ chatSession.title || chatSession.sessionNo }}</strong>
              <span class="chat-subtitle">{{ chatSession.sessionNo }}</span>
            </div>
            <div class="chat-actions">
              <el-tag :type="chatSession.status === 'OPEN' ? 'success' : 'info'" size="small">
                {{ chatSession.status === 'OPEN' ? '进行中' : '已关闭' }}
              </el-tag>
              <el-button v-if="chatSession.status === 'OPEN'" link type="danger" @click="handleClose(chatSession)">关闭会话</el-button>
            </div>
          </div>

          <div class="chat-messages" ref="chatMessagesRef">
            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              class="chat-msg-wrapper"
              :class="{ 'is-merchant': msg.senderSide === 'MERCHANT' }"
            >
              <div v-if="msg.messageType === 'SYSTEM'" class="system-msg">{{ msg.content }}</div>
              <template v-else>
                <span class="msg-sender">{{ msg.senderDisplayName || sideLabel(msg.senderSide) }}</span>
                <div
                  class="msg-bubble"
                  :class="{
                    'merchant-bubble': msg.senderSide === 'MERCHANT',
                    'platform-bubble': msg.senderSide !== 'MERCHANT',
                  }"
                >
                  <el-image
                    v-if="msg.messageType === 'IMAGE'"
                    :src="msg.content"
                    style="max-width: 220px; border-radius: 8px; cursor: pointer"
                    :preview-src-list="[msg.content]"
                    fit="cover"
                  />
                  <template v-else>{{ msg.content }}</template>
                </div>
                <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
              </template>
            </div>
          </div>

          <div class="chat-input-area" v-if="chatSession.status === 'OPEN'">
            <el-input v-model="chatInput" placeholder="输入消息" @keyup.enter="sendMessage" class="chat-input" />
            <input ref="uploadInputRef" type="file" accept="image/*" style="display:none" @change="handleUpload" />
            <el-button @click="triggerUpload">图片</el-button>
            <el-button type="primary" @click="sendMessage" :loading="sending">发送</el-button>
          </div>
          <div v-else class="chat-closed-notice">该会话已关闭。</div>
        </template>
        <el-empty v-else description="请选择左侧会话，或新建会话联系平台" />
      </section>
    </div>

    <el-dialog v-model="createVisible" title="新建平台支持会话" width="520px" @closed="resetCreateForm">
      <el-form :model="createForm" label-width="90px">
        <el-form-item label="标题" required>
          <el-input v-model="createForm.title" placeholder="请输入会话标题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="createForm.content" type="textarea" :rows="4" placeholder="请描述你需要平台协助的问题" />
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
        <el-button type="primary" :loading="creating" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { platformSupportApi, type ISupportSession, type ISupportMessage } from '@/api/support'
import { connectWebSocket, addRealtimeListener, removeRealtimeListener } from '@/utils/realtime'
import { storage, STORAGE_KEYS } from '@/utils/storage'

/** 商家平台支持聊天室 */
defineOptions({ name: 'PlatformSupportView' })

const loading = ref(false)
const tableData = ref<ISupportSession[]>([])
const total = ref(0)
const createVisible = ref(false)
const creating = ref(false)
const sending = ref(false)
const chatSession = ref<ISupportSession | null>(null)
const chatMessages = ref<ISupportMessage[]>([])
const chatInput = ref('')
const chatMessagesRef = ref<HTMLElement>()
const uploadInputRef = ref<HTMLInputElement>()

let chatTimer: ReturnType<typeof setInterval> | null = null
let listTimer: ReturnType<typeof setInterval> | null = null

const searchForm = reactive({
  status: '',
  page: 1,
  pageSize: 20,
})

const createForm = reactive({
  title: '',
  content: '',
  priority: 'MEDIUM',
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await platformSupportApi.getSessions({
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
      if (!chatSession.value && tableData.value.length) {
        const firstSession = tableData.value[0]
        if (firstSession) {
          await openChat(firstSession)
        }
      }
    } else {
      ElMessage.error(res.message || '获取会话失败')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '获取会话失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  chatSession.value = null
  chatMessages.value = []
  fetchData()
}

function openCreate() {
  createForm.title = ''
  createForm.content = ''
  createForm.priority = 'MEDIUM'
  createVisible.value = true
}

function resetCreateForm() {
  createForm.title = ''
  createForm.content = ''
  createForm.priority = 'MEDIUM'
}

async function handleCreate() {
  if (!createForm.title.trim() || !createForm.content.trim()) {
    ElMessage.warning('请填写标题和内容')
    return
  }
  creating.value = true
  try {
    const { data: res } = await platformSupportApi.createSession({
      title: createForm.title.trim(),
      firstMessage: createForm.content.trim(),
      priority: createForm.priority,
    })
    if (res.code === 200) {
      ElMessage.success('会话已创建')
      createVisible.value = false
      chatSession.value = res.data
      await fetchData()
      await openChat(res.data)
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '创建失败'))
  } finally {
    creating.value = false
  }
}

async function openChat(row: ISupportSession) {
  chatSession.value = row
  await loadMessages()
  restartPolling()
}

async function loadMessages() {
  if (!chatSession.value) return
  try {
    const { data: res } = await platformSupportApi.getMessages(chatSession.value.id)
    if (res.code === 200) {
      chatMessages.value = res.data || []
      await platformSupportApi.markRead(chatSession.value.id).catch(() => {})
      await nextTick()
      scrollToBottom()
    }
  } catch {
    // 保留当前消息，避免短暂网络错误清空聊天记录
  }
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
      fetchData()
    } else {
      ElMessage.error(res.message || '发送失败')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '发送失败'))
  } finally {
    sending.value = false
  }
}

function triggerUpload() {
  uploadInputRef.value?.click()
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !chatSession.value) return
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bizType', 'support')
  try {
    const baseURL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
    const uploadRes = await fetch(baseURL + '/upload/image', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + (storage.get<string>(STORAGE_KEYS.TOKEN) || '') },
      body: formData,
    }).then((r) => r.json())
    const imageUrl = typeof uploadRes.data === 'string' ? uploadRes.data : uploadRes.data?.url
    if (uploadRes.code === 200 && imageUrl) {
      const { data: res } = await platformSupportApi.sendMessage(chatSession.value.id, { content: imageUrl, messageType: 'IMAGE' })
      if (res.code === 200) {
        await loadMessages()
        fetchData()
      } else {
        ElMessage.error(res.message || '图片发送失败')
      }
    } else {
      ElMessage.error(uploadRes.message || '图片上传失败')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '图片上传失败'))
  }
  input.value = ''
}

async function handleClose(row: ISupportSession) {
  try {
    const { data: res } = await platformSupportApi.closeSession(row.id)
    if (res.code === 200) {
      ElMessage.success('会话已关闭')
      await fetchData()
      if (chatSession.value?.id === row.id) {
        chatSession.value.status = 'CLOSED'
      }
    } else {
      ElMessage.error(res.message || '关闭失败')
    }
  } catch (error) {
    ElMessage.error(getErrorMessage(error, '关闭失败'))
  }
}

function restartPolling() {
  if (chatTimer) clearInterval(chatTimer)
  chatTimer = setInterval(loadMessages, 3000)
}

function handleRealtimeEvent(event: any) {
  if (event?.type !== 'SUPPORT_MESSAGE_CREATED') return
  const sessionId = Number(event?.payload?.sessionId || 0)
  if (!sessionId) return
  if (chatSession.value?.id === sessionId) {
    loadMessages()
  }
  fetchData()
}

function setupRealtime() {
  addRealtimeListener(handleRealtimeEvent)
  const token = storage.get<string>(STORAGE_KEYS.TOKEN)
  if (token) {
    connectWebSocket(token)
  }
}

function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

function getSessionUnread(session: ISupportSession) {
  return session.unreadCount || session.unreadMerchantCount || session.merchantUnread || 0
}

function getErrorMessage(error: unknown, fallback: string) {
  const err = error as any
  return err?.response?.data?.message || err?.message || fallback
}

function formatTime(t: string) {
  if (!t) return ''
  return new Date(t).toLocaleString()
}

function priorityLabel(priority: string) {
  const map: Record<string, string> = { LOW: '低', NORMAL: '普通', MEDIUM: '中', HIGH: '高', URGENT: '紧急' }
  return map[priority] || priority || '普通'
}

function priorityTagType(priority: string) {
  if (priority === 'HIGH' || priority === 'URGENT') return 'danger'
  if (priority === 'MEDIUM') return 'warning'
  return 'info'
}

function sideLabel(side: string) {
  if (side === 'ADMIN' || side === 'PLATFORM') return '平台客服'
  if (side === 'MERCHANT') return '商家'
  return side || '系统'
}

onMounted(() => {
  fetchData()
  setupRealtime()
  listTimer = setInterval(fetchData, 15000)
})

onUnmounted(() => {
  if (listTimer) clearInterval(listTimer)
  if (chatTimer) clearInterval(chatTimer)
  removeRealtimeListener(handleRealtimeEvent)
})
</script>

<style scoped>
.support-platform-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 18px; }
.page-header p { margin: 6px 0 0; color: var(--el-text-color-secondary); font-size: 13px; }
.support-workbench {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
  min-height: 640px;
}
.session-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}
.session-filter { margin-bottom: 4px; }
.session-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: #fff;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}
.session-item.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.session-row,
.session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.session-row strong,
.session-last {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.session-last { display: block; margin-top: 6px; font-size: 12px; color: var(--el-text-color-secondary); }
.session-meta { margin-top: 8px; font-size: 12px; color: var(--el-text-color-secondary); }
.chat-panel {
  display: flex;
  flex-direction: column;
  min-height: 640px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: #fff;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.chat-subtitle { margin-left: 8px; color: var(--el-text-color-secondary); font-size: 13px; }
.chat-actions { display: flex; align-items: center; gap: 8px; }
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f7fa;
}
.chat-msg-wrapper { margin-bottom: 12px; text-align: left; }
.chat-msg-wrapper.is-merchant { text-align: right; }
.msg-sender { font-size: 11px; color: #909399; display: block; margin-bottom: 2px; }
.msg-bubble { display: inline-block; max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; word-break: break-word; }
.platform-bubble { background: #e4e7ed; color: #303133; border-bottom-left-radius: 4px; }
.merchant-bubble { background: #409eff; color: #fff; border-bottom-right-radius: 4px; }
.system-msg { text-align: center; font-size: 12px; color: #c0c4cc; padding: 4px 0; }
.msg-time { font-size: 10px; color: #c0c4cc; display: block; margin-top: 2px; }
.chat-input-area { display: flex; align-items: center; gap: 8px; padding: 12px; border-top: 1px solid var(--el-border-color-lighter); }
.chat-input { flex: 1; }
.chat-closed-notice { text-align: center; color: #909399; padding: 20px; font-size: 13px; border-top: 1px solid var(--el-border-color-lighter); }
@media (max-width: 900px) {
  .support-workbench { grid-template-columns: 1fr; }
  .session-list, .chat-panel { min-height: auto; }
}
</style>
