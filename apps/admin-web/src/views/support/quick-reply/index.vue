<template>
  <div class="quick-reply-admin-page">
    <div class="page-header">
      <h3>快捷回复</h3>
      <el-button type="primary" @click="openCreate">新增回复</el-button>
    </div>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
      <el-table-column label="内容" min-width="250" show-overflow-tooltip>
        <template #default="{ row }">{{ row.content?.length > 60 ? row.content.slice(0, 60) + '...' : row.content }}</template>
      </el-table-column>
      <el-table-column prop="languageCode" label="语言" width="90" align="center" />
      <el-table-column prop="merchantId" label="商户" width="80" align="center">
        <template #default="{ row }">{{ row.merchantId || 'Global' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60" align="center" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
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
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <el-dialog v-model="formVisible" :title="editingId ? 'Edit Quick Reply' : 'Add Quick Reply'" width="550px" @closed="resetForm">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="标题" required>
          <el-input v-model="formData.title" placeholder="快捷回复标题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="formData.content" type="textarea" :rows="5" placeholder="回复内容…" />
        </el-form-item>
        <el-form-item label="语言">
          <el-select v-model="formData.languageCode" style="width: 100%">
            <el-option label="英语" value="en" />
            <el-option label="日语" value="ja" />
            <el-option label="韩语" value="ko" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户ID">
          <el-input v-model="formData.merchantId" placeholder="留空表示全局" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="已启用" value="ENABLE" />
            <el-option label="已禁用" value="DISABLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" :max="9999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { quickReplyAdminApi, type IQuickReply } from '@/api/support'

defineOptions({ name: 'AdminQuickReplyView' })

const loading = ref(false)
const tableData = ref<IQuickReply[]>([])
const total = ref(0)
const formVisible = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)

const searchForm = reactive({
  page: 1,
  pageSize: 20,
})

const formData = reactive({
  title: '',
  content: '',
  languageCode: 'en',
  merchantId: '',
  status: 'ENABLE',
  sort: 0,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await quickReplyAdminApi.getList({ page: searchForm.page, pageSize: searchForm.pageSize })
    if (res.code === 200) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取失败')
    }
  } catch { ElMessage.error('获取失败') } finally { loading.value = false }
}

function openCreate() {
  editingId.value = null
  formData.title = ''
  formData.content = ''
  formData.languageCode = 'en'
  formData.merchantId = ''
  formData.status = 'ENABLE'
  formData.sort = 0
  formVisible.value = true
}

function openEdit(row: IQuickReply) {
  editingId.value = row.id
  formData.title = row.title
  formData.content = row.content
  formData.languageCode = row.languageCode
  formData.merchantId = row.merchantId ? String(row.merchantId) : ''
  formData.status = row.status
  formData.sort = row.sort
  formVisible.value = true
}

function resetForm() {
  editingId.value = null
}

async function handleSubmit() {
  if (!formData.title.trim() || !formData.content.trim()) {
    ElMessage.warning('标题和内容为必填项')
    return
  }
  submitting.value = true
  try {
    const payload: any = {
      title: formData.title,
      content: formData.content,
      languageCode: formData.languageCode,
      status: formData.status,
      sort: formData.sort,
    }
    if (formData.merchantId) payload.merchantId = Number(formData.merchantId)
    let res
    if (editingId.value) {
      res = await quickReplyAdminApi.update(editingId.value, payload)
    } else {
      res = await quickReplyAdminApi.create(payload)
    }
    if (res.data.code === 200) {
      ElMessage.success(editingId.value ? 'Updated' : 'Created')
      formVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.data.message || '保存失败')
    }
  } catch { ElMessage.error('保存失败') } finally { submitting.value = false }
}

async function handleDelete(row: IQuickReply) {
  try {
    const { data: res } = await quickReplyAdminApi.delete(row.id)
    if (res.code === 200) {
      ElMessage.success('已删除')
      fetchData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch { ElMessage.error('删除失败') }
}

onMounted(() => { fetchData() })
</script>

<style scoped>
.quick-reply-admin-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-header h3 { margin: 0; font-size: 16px; }
</style>
