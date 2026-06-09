<template>
  <div class="notification-page">
    <div class="page-header">
      <h2>Notifications</h2>
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="unread-badge">
        <el-button type="primary" :loading="markingAll" @click="handleMarkAllAsRead">
          Mark All as Read
        </el-button>
      </el-badge>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading" @row-click="handleRowClick" style="cursor: pointer">
      <el-table-column prop="title" label="Title" min-width="160" show-overflow-tooltip />
      <el-table-column prop="content" label="Content" min-width="240" show-overflow-tooltip />
      <el-table-column label="Type" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Read" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isRead ? 'success' : 'danger'" size="small">
            {{ row.isRead ? 'Read' : 'Unread' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created" width="160" />
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { notificationApi, type NotificationItem } from '@/api/notification'

defineOptions({ name: 'MerchantNotificationListView' })

const loading = ref(false)
const markingAll = ref(false)
const tableData = ref<NotificationItem[]>([])
const total = ref(0)
const unreadCount = ref(0)

const searchForm = reactive({
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await notificationApi.getNotifications({
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

async function fetchUnreadCount() {
  try {
    const { data: res } = await notificationApi.getUnreadCount()
    if (res.code === 200) unreadCount.value = res.data || 0
  } catch { /* ignore */ }
}

async function handleRowClick(row: NotificationItem) {
  if (row.isRead) return
  try {
    await notificationApi.markAsRead(row.id)
    row.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  } catch {
    // ignore
  }
}

async function handleMarkAllAsRead() {
  markingAll.value = true
  try {
    const { data: res } = await notificationApi.markAllAsRead()
    if (res.code === 200) {
      tableData.value.forEach((n) => (n.isRead = true))
      unreadCount.value = 0
      ElMessage.success('All marked as read')
    } else {
      ElMessage.error(res.message || 'Failed')
    }
  } catch {
    ElMessage.error('Failed')
  } finally {
    markingAll.value = false
  }
}

onMounted(() => {
  fetchData()
  fetchUnreadCount()
})
</script>

<style scoped>
.notification-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; }
</style>
