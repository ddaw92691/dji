<template>
  <div class="product-page">
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
        <el-button type="primary" v-permission="'category:add'" @click="handleCreate">Add</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="icon" label="Icon" width="80" align="center" />
      <el-table-column prop="name" label="Name" min-width="160" show-overflow-tooltip />
      <el-table-column label="Parent" width="120" align="center">
        <template #default="{ row }">
          {{ row.parentId ? getCategoryName(row.parentId) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? 'Enabled' : 'Disabled' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="Sort" width="70" align="center" />
      <el-table-column prop="createdAt" label="Created" width="180" />
      <el-table-column label="Actions" width="280" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'category:edit'" @click="handleEdit(row)">Edit</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'category:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
          </el-button>
          <el-button link type="info" v-permission="'category:edit'" @click="handleOpenTranslations(row)">Translations</el-button>
          <el-popconfirm title="Confirm delete?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'category:delete'">Delete</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Category' : 'Create Category'" width="650px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" placeholder="Category name" />
        </el-form-item>
        <el-form-item label="Parent" prop="parentId">
          <el-select v-model="form.parentId" placeholder="Parent category (optional)" filterable clearable style="width: 100%">
            <el-option v-for="c in parentOptions" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Icon" prop="icon">
          <div class="upload-wrap">
            <el-input v-model="form.icon" placeholder="Icon emoji or image URL" class="input-with-upload" />
            <el-upload
              :show-file-list="false"
              :http-request="handleIconUpload"
              accept="image/*"
            >
              <el-button type="primary" :loading="uploading">Upload</el-button>
            </el-upload>
          </div>
          <el-image v-if="form.icon && form.icon.startsWith('http')" :src="form.icon" style="width: 60px; height: 60px; margin-top: 8px; border-radius: 4px" fit="cover" />
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" placeholder="Status" style="width: 100%">
            <el-option label="Enabled" value="ENABLE" />
            <el-option label="Disabled" value="DISABLE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">Confirm</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="transDialogVisible" title="Category Translations" width="550px" @close="resetTransForm">
      <el-form ref="transFormRef" :model="transForm" label-width="130px">
        <el-form-item label="Japanese (ja)">
          <el-input v-model="transForm.ja" placeholder="Japanese name" />
        </el-form-item>
        <el-form-item label="Korean (ko)">
          <el-input v-model="transForm.ko" placeholder="Korean name" />
        </el-form-item>
        <el-form-item label="English (en)">
          <el-input v-model="transForm.en" placeholder="English name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transDialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="transLoading" @click="handleSaveTranslations">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { categoryApi, type CategoryItem } from '@/api/category'
import { uploadApi } from '@/api/upload'

defineOptions({ name: 'CategoryView' })

const loading = ref(false)
const submitLoading = ref(false)
const transLoading = ref(false)
const uploading = ref(false)
const tableData = ref<CategoryItem[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const transDialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const transFormRef = ref<FormInstance>()
const transEditingId = ref<number | null>(null)
const parentOptions = ref<CategoryItem[]>([])

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  name: '',
  parentId: null as number | null,
  icon: '',
  sort: 0,
  status: 'ENABLE',
})

const transForm = reactive({
  ja: '',
  ko: '',
  en: '',
})

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
  status: [{ required: true, message: 'Please select status', trigger: 'change' }],
}

function getCategoryName(id: number): string {
  const c = tableData.value.find((i) => i.id === id) || parentOptions.value.find((i) => i.id === id)
  return c ? c.name : ''
}

async function loadParentOptions() {
  try {
    const { data: res } = await categoryApi.getCategories({ page: 1, pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) parentOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await categoryApi.getCategories({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
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

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function handleCreate() {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, { name: '', parentId: null, icon: '', sort: 0, status: 'ENABLE' })
  dialogVisible.value = true
}

function handleEdit(row: CategoryItem) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    parentId: row.parentId,
    icon: row.icon,
    sort: row.sort,
    status: row.status,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = { ...form }
    if (isEdit.value && editingId.value) {
      const { data: res } = await categoryApi.updateCategory(editingId.value, payload)
      if (res.code === 200) {
        ElMessage.success('Updated successfully')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Update failed')
      }
    } else {
      const { data: res } = await categoryApi.createCategory(payload)
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

async function handleToggleStatus(row: CategoryItem) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await categoryApi.updateCategoryStatus(row.id, newStatus)
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

async function handleDelete(row: CategoryItem) {
  try {
    const { data: res } = await categoryApi.deleteCategory(row.id)
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

function handleOpenTranslations(row: CategoryItem) {
  transEditingId.value = row.id
  const jaT = row.translations?.find((t) => t.languageCode === 'ja')
  const koT = row.translations?.find((t) => t.languageCode === 'ko')
  const enT = row.translations?.find((t) => t.languageCode === 'en')
  transForm.ja = jaT?.name || ''
  transForm.ko = koT?.name || ''
  transForm.en = enT?.name || ''
  transDialogVisible.value = true
}

async function handleSaveTranslations() {
  if (!transEditingId.value) return
  transLoading.value = true
  try {
    const payload = [
      { languageCode: 'ja', name: transForm.ja },
      { languageCode: 'ko', name: transForm.ko },
      { languageCode: 'en', name: transForm.en },
    ]
    const { data: res } = await categoryApi.saveTranslations(transEditingId.value, payload)
    if (res.code === 200) {
      ElMessage.success('Translations saved')
      transDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Save failed')
    }
  } catch {
    ElMessage.error('Save failed')
  } finally {
    transLoading.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

function resetTransForm() {
  transFormRef.value?.resetFields()
}

async function handleIconUpload(options: any) {
  uploading.value = true
  try {
    const { data: res } = await uploadApi.postImage(options.file, 'category')
    if (res.code === 200) {
      const url = res.data?.url || res.data
      form.icon = url
      ElMessage.success('Uploaded')
    } else {
      ElMessage.error(res.message || 'Upload failed')
    }
  } catch {
    ElMessage.error('Upload failed')
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  await loadParentOptions()
  fetchData()
})
</script>

<style scoped>
.product-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.upload-wrap { display: flex; gap: 8px; width: 100%; }
.input-with-upload { flex: 1; }
</style>
