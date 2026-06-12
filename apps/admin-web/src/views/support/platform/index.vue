<template>
  <div class="admin-platform-support-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索商家 / 标题 / 消息"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.merchantId" placeholder="商家ID" clearable @clear="handleSearch" style="width: 120px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch" style="width: 120px">
          <el-option label="进行中" value="OPEN" />
          <el-option label="已关闭" value="CLOSED" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <div class="support-workbench" v-loading="loading">
      <aside class="session-list">
        <button
          v-for="session in tableData"
          :key="session.id"
          class="session-item"
          :class="{ active: chatSession?.id === session.id }"
          type="button"
          @click="openReply(session)"
        >
          <span class="session-row">
            <strong>{{ session.merchantName || '未知商家' }}</strong>
            <el-badge v-if="session.merchantUnread" :value="session.merchantUnread" type="danger" />
          </span>
          <span class="session-title">{{ session.title || session.sessionNo }}</span>
          <span class="session-last">{{ session.lastMessage || '暂无消息' }}</span>
          <span class="session-meta">
            <el-tag :type="session.status === 'OPEN' ? 'success' : 'info'" size="small">
              {{ session.status === 'OPEN' ? '进行中' : '已关闭' }}
            </el-tag>
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
              <strong>{{ chatSession.merchantName || '未知商家' }}</strong>
              <span class="chat-subtitle">{{ chatSession.title || chatSession.sessionNo }}</span>
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
              :class="{ 'is-admin': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM' }"
            >
              <div v-if="msg.messageType === 'SYSTEM'" class="system-msg">{{ msg.content }}</div>
              <template v-else>
                <span class="msg-sender">{{ msg.senderDisplayName || msg.senderSide }}</span>
                <div
                  class="msg-bubble"
                  :class="{
                    'admin-bubble': msg.senderSide === 'ADMIN' || msg.senderSide === 'PLATFORM',
                    'other-bubble': msg.senderSide !== 'ADMIN' && msg.senderSide !== 'PLATFORM',
                  }"
                >
                  {{ msg.content }}
                </div>
                <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
              </template>
            </div>
          </div>

          <div class="chat-input-area" v-if="chatSession.status === 'OPEN'">
            <el-input v-model="chatInput" placeholder="输入消息" @keyup.enter="sendMessage" class="chat-input" />
            <el-button type="primary" @click="sendMessage" :loading="sending">发送</el-button>
          </div>
          <div v-else class="chat-closed-notice">该会话已关闭。</div>
        </template>
        <el-empty v-else description="请选择左侧商家会话" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { platformSupportApi, type IAdminSupportSession, type ISupportMessage } from '@/api/support'

defineOptions({ name: 'AdminPlatformSupportView' })

const loading = ref(false)
const tableData = ref<IAdminSupportSession[]>([])
const total = ref(0)
const sending = ref(false)
const chatSession = ref<IAdminSupportSession | null>(null)
const chatMessages = ref<ISupportMessage[]>([])
const chatInput = ref('')
const chatMessagesRef = ref<HTMLElement>()

let chatTimer: ReturnType<typeof setInterval> | null = null

const searchForm = reactive({
  keyword: '',
  merchantId: '',
  status: '',
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
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
      if (!chatSession.value && tableData.value.length) {
        const firstSession = tableData.value[0]
        if (firstSession) {
          await openReply(firstSession)
        }
      }
    }
  } catch {
    ElMessage.error('获取会话失败')
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

async function openReply(row: IAdminSupportSession) {
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
      await nextTick()
      scrollToBottom()
    }
  } catch {
    /* keep current messages */
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
  } catch {
    ElMessage.error('发送失败')
  } finally {
    sending.value = false
  }
}

async function handleClose(row: IAdminSupportSession) {
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
  } catch {
    ElMessage.error('关闭失败')
  }
}

function restartPolling() {
  if (chatTimer) clearInterval(chatTimer)
  chatTimer = setInterval(loadMessages, 5000)
}

function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

function formatTime(t: string) {
  if (!t) return ''
  return new Date(t).toLocaleString()
}

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (chatTimer) clearInterval(chatTimer)
})
</script>

<style scoped>
.admin-platform-support-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.support-workbench {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 16px;
  min-height: 620px;
}
.session-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}
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
.session-row, .session-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.session-title, .session-last {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.session-title { margin-top: 6px; font-size: 13px; color: var(--el-text-color-regular); }
.session-last { margin-top: 4px; font-size: 12px; color: var(--el-text-color-secondary); }
.session-meta { margin-top: 8px; font-size: 12px; color: var(--el-text-color-secondary); }
.chat-panel {
  display: flex;
  flex-direction: column;
  min-height: 620px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
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
.chat-msg-wrapper.is-admin { text-align: right; }
.msg-sender { font-size: 11px; color: #909399; display: block; margin-bottom: 2px; }
.msg-bubble { display: inline-block; max-width: 75%; padding: 8px 12px; border-radius: 12px; font-size: 13px; word-break: break-word; }
.other-bubble { background: #e4e7ed; color: #303133; border-bottom-left-radius: 4px; }
.admin-bubble { background: #409eff; color: #fff; border-bottom-right-radius: 4px; }
.system-msg { text-align: center; font-size: 12px; color: #c0c4cc; padding: 4px 0; }
.msg-time { font-size: 10px; color: #c0c4cc; display: block; margin-top: 2px; }
.chat-input-area { display: flex; align-items: center; gap: 8px; padding: 12px; border-top: 1px solid var(--el-border-color-lighter); }
.chat-input { flex: 1; }
.chat-closed-notice { text-align: center; color: #909399; padding: 20px; font-size: 13px; border-top: 1px solid var(--el-border-color-lighter); }
</style>
