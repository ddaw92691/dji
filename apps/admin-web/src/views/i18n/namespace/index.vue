<template>
  <div class="i18n-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="Status" clearable @change="handleSearch">
          <el-option label="Enabled" value="ENABLE" />
          <el-option label="Disabled" value="DISABLE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="'i18n:add'" @click="handleCreate">Add</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="name" label="Name" min-width="140" show-overflow-tooltip />
      <el-table-column prop="code" label="Code" width="160" show-overflow-tooltip />
      <el-table-column prop="description" label="Description" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? 'Enabled' : 'Disabled' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="Sort" width="70" align="center" />
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'i18n:edit'" @click="handleEdit(row)">Edit</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'i18n:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
          </el-button>
          <el-popconfirm title="Confirm delete?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:delete'">Delete</el-button>
            </template>
          </el-popconfirm>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Namespace' : 'Create Namespace'" width="550px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Namespace name" />
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input v-model="form.code" placeholder="Namespace code" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="Description" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" placeholder="Status" style="width: 100%">
            <el-option label="Enabled" value="ENABLE" />
            <el-option label="Disabled" value="DISABLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Confirm</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { i18nApi, type I18nNamespace, type PageData } from '@/api/i18n'

defineOptions({ name: 'I18nNamespaceView' })

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<I18nNamespace[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  name: '',
  code: '',
  description: '',
  status: 'ENABLE',
  sort: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
  code: [{ required: true, message: 'Please enter code', trigger: 'blur' }],
  status: [{ required: true, message: 'Please select status', trigger: 'change' }],
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getNamespaces({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nNamespace>
      tableData.value = pageData.list
      total.value = pageData.total
    } else {
      ElMessage.error(res.message || 'Failed to fetch data')
    }
  } catch {
    ElMessage.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function handleCreate() {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, { name: '', code: '', description: '', status: 'ENABLE', sort: 0 })
  dialogVisible.value = true
}

function handleEdit(row: I18nNamespace) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code,
    description: row.description,
    status: row.status,
    sort: row.sort,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value && editingId.value) {
      const { data: res } = await i18nApi.updateNamespace(editingId.value, { ...form })
      if (res.code === 200) {
        ElMessage.success('Updated successfully')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Update failed')
      }
    } else {
      const { data: res } = await i18nApi.createNamespace({ ...form })
      if (res.code === 200) {
        ElMessage.success('Created successfully')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Create failed')
      }
    }
  } catch {
    ElMessage.error('Operation failed')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: I18nNamespace) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await i18nApi.updateNamespaceStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('Status updated')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Status update failed')
    }
  } catch {
    ElMessage.error('Status update failed')
  }
}

async function handleDelete(row: I18nNamespace) {
  try {
    const { data: res } = await i18nApi.deleteNamespace(row.id)
    if (res.code === 200) {
      ElMessage.success('Deleted successfully')
      fetchData()
    } else {
      ElMessage.error(res.message || 'Delete failed')
    }
  } catch {
    ElMessage.error('Delete failed')
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.i18n-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
