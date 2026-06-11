<template>
  <div class="audit-log-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="用户ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.action" placeholder="操作" clearable @change="handleSearch">
          <el-option v-for="o in AUDIT_ACTION_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.targetType" placeholder="目标类型" clearable @change="handleSearch">
          <el-option v-for="o in AUDIT_TARGET_TYPE_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="开始"
          end-placeholder="结束"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="userEmail" label="用户" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-tag>{{ getLabelByValue(AUDIT_ACTION_OPTIONS, row.action) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="目标类型" width="120" align="center">
        <template #default="{ row }">
          <el-tag type="info">{{ getLabelByValue(AUDIT_TARGET_TYPE_OPTIONS, row.targetType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="targetId" label="目标ID" width="100" />
      <el-table-column prop="detail" label="详情" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.detail ? row.detail.substring(0, 100) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="140" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'sys:audit:view'" @click="openDetail(row)">详情</el-button>
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

    <el-dialog v-model="detailVisible" title="审计日志详情" width="700px">
      <div v-if="currentLog" class="log-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="ID">{{ currentLog.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentLog.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户邮箱">{{ currentLog.userEmail }}</el-descriptions-item>
          <el-descriptions-item label="操作">
            <el-tag>{{ getLabelByValue(AUDIT_ACTION_OPTIONS, currentLog.action) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="目标类型">
            <el-tag type="info">{{ getLabelByValue(AUDIT_TARGET_TYPE_OPTIONS, currentLog.targetType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="目标ID">{{ currentLog.targetId }}</el-descriptions-item>
          <el-descriptions-item label="IP">{{ currentLog.ip }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentLog.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="详情" :span="2">
            <pre class="detail-text">{{ currentLog.detail || '-' }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { auditLogApi, type IAuditLog } from '@/api/auditLog'
import { AUDIT_ACTION_OPTIONS, AUDIT_TARGET_TYPE_OPTIONS, getLabelByValue } from '@/constants/dict'

defineOptions({ name: 'AdminAuditLogView' })

const loading = ref(false)
const tableData = ref<IAuditLog[]>([])
const total = ref(0)

const detailVisible = ref(false)
const currentLog = ref<IAuditLog | null>(null)

const searchForm = reactive({
  userId: '',
  action: '',
  targetType: '',
  keyword: '',
  dateRange: null as [string, string] | null,
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    }
    if (searchForm.userId) params.userId = searchForm.userId
    if (searchForm.action) params.action = searchForm.action
    if (searchForm.targetType) params.targetType = searchForm.targetType
    if (searchForm.keyword) params.keyword = searchForm.keyword
    if (searchForm.dateRange) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    const { data: res } = await auditLogApi.getLogs(params)
    if (res.code !== 200) return
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function openDetail(row: IAuditLog) {
  currentLog.value = row
  detailVisible.value = true
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.audit-log-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.log-detail { max-height: 60vh; overflow-y: auto; }
.detail-text { white-space: pre-wrap; word-break: break-all; font-size: 13px; line-height: 1.6; margin: 0; }
</style>
