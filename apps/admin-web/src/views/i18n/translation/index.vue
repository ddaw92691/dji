<template>
  <div class="i18n-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="Keyword" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.countryCode" placeholder="Country" clearable @change="handleSearch">
          <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.languageCode" placeholder="Language" clearable @change="handleSearch">
          <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.namespaceCode" placeholder="Namespace" clearable @change="handleSearch">
          <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
        </el-select>
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
      <el-form-item>
        <el-button type="success" v-permission="'i18n:import'" @click="handleOpenImport">Import JSON</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" v-permission="'i18n:export'" @click="handleOpenExport">Export JSON</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="countryCode" label="Country" width="100" />
      <el-table-column prop="languageCode" label="Language" width="100" />
      <el-table-column prop="namespaceCode" label="Namespace" width="150" show-overflow-tooltip />
      <el-table-column prop="translationKey" label="Key" min-width="180" show-overflow-tooltip />
      <el-table-column label="Text Value" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.textValue?.length > 50 ? row.textValue.slice(0, 50) + '...' : row.textValue }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? 'Enabled' : 'Disabled' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="Updated" width="180" />
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Translation' : 'Create Translation'" width="650px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="Country Code" prop="countryCode">
          <el-select v-model="form.countryCode" placeholder="Select country" filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Language Code" prop="languageCode">
          <el-select v-model="form.languageCode" placeholder="Select language" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Namespace Code" prop="namespaceCode">
          <el-select v-model="form.namespaceCode" placeholder="Select namespace" filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Translation Key" prop="translationKey">
          <el-input v-model="form.translationKey" placeholder="e.g. common.save" />
        </el-form-item>
        <el-form-item label="Text Value" prop="textValue">
          <el-input v-model="form.textValue" type="textarea" :rows="3" placeholder="Translation text" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="Optional description" />
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

    <el-dialog v-model="importDialogVisible" title="Import Translations" width="600px" @close="resetImportForm">
      <el-form ref="importFormRef" :model="importForm" :rules="importRules" label-width="130px">
        <el-form-item label="Country Code" prop="countryCode">
          <el-select v-model="importForm.countryCode" placeholder="Select country" filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Language Code" prop="languageCode">
          <el-select v-model="importForm.languageCode" placeholder="Select language" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Namespace Code" prop="namespaceCode">
          <el-select v-model="importForm.namespaceCode" placeholder="Select namespace" filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="Overwrite">
          <el-switch v-model="importForm.overwrite" />
        </el-form-item>
        <el-form-item label="JSON" prop="jsonText">
          <el-input v-model="importForm.jsonText" type="textarea" :rows="10" placeholder='{"key1": "value1", "key2": "value2"}' />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="importLoading" @click="handleImport">Import</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exportDialogVisible" title="Export Translations" width="600px">
      <el-input v-model="exportJsonText" type="textarea" :rows="15" readonly />
      <template #footer>
        <el-button type="primary" @click="handleCopyExport">Copy</el-button>
        <el-button @click="exportDialogVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { i18nApi, type I18nTranslation, type I18nCountry, type I18nLanguage, type I18nNamespace, type PageData } from '@/api/i18n'

defineOptions({ name: 'I18nTranslationView' })

const { copy } = useClipboard()

const loading = ref(false)
const submitLoading = ref(false)
const importLoading = ref(false)
const tableData = ref<I18nTranslation[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const importFormRef = ref<FormInstance>()

const countryOptions = ref<I18nCountry[]>([])
const languageOptions = ref<I18nLanguage[]>([])
const namespaceOptions = ref<I18nNamespace[]>([])

const searchForm = reactive({
  keyword: '',
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  translationKey: '',
  textValue: '',
  description: '',
  status: 'ENABLE',
})

const rules: FormRules = {
  countryCode: [{ required: true, message: 'Please select country', trigger: 'change' }],
  languageCode: [{ required: true, message: 'Please select language', trigger: 'change' }],
  namespaceCode: [{ required: true, message: 'Please select namespace', trigger: 'change' }],
  translationKey: [{ required: true, message: 'Please enter translation key', trigger: 'blur' }],
  textValue: [{ required: true, message: 'Please enter text value', trigger: 'blur' }],
}

const importDialogVisible = ref(false)
const importForm = reactive({
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  overwrite: false,
  jsonText: '',
})

const importRules: FormRules = {
  countryCode: [{ required: true, message: 'Please select country', trigger: 'change' }],
  languageCode: [{ required: true, message: 'Please select language', trigger: 'change' }],
  namespaceCode: [{ required: true, message: 'Please select namespace', trigger: 'change' }],
  jsonText: [{ required: true, message: 'Please enter JSON', trigger: 'blur' }],
}

const exportDialogVisible = ref(false)
const exportJsonText = ref('')

async function loadCountries() {
  try {
    const { data: res } = await i18nApi.getCountries({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) countryOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function loadLanguages() {
  try {
    const { data: res } = await i18nApi.getLanguages({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) languageOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function loadNamespaces() {
  try {
    const { data: res } = await i18nApi.getNamespaces({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) namespaceOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getTranslations({
      keyword: searchForm.keyword || undefined,
      countryCode: searchForm.countryCode || undefined,
      languageCode: searchForm.languageCode || undefined,
      namespaceCode: searchForm.namespaceCode || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nTranslation>
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
  Object.assign(form, {
    countryCode: '', languageCode: '', namespaceCode: '',
    translationKey: '', textValue: '', description: '', status: 'ENABLE',
  })
  dialogVisible.value = true
}

function handleEdit(row: I18nTranslation) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    countryCode: row.countryCode,
    languageCode: row.languageCode,
    namespaceCode: row.namespaceCode,
    translationKey: row.translationKey,
    textValue: row.textValue,
    description: row.description,
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
    if (isEdit.value && editingId.value) {
      const { data: res } = await i18nApi.updateTranslation(editingId.value, { ...form })
      if (res.code === 200) {
        ElMessage.success('Updated successfully')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || 'Update failed')
      }
    } else {
      const { data: res } = await i18nApi.createTranslation({ ...form })
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

async function handleToggleStatus(row: I18nTranslation) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await i18nApi.updateTranslationStatus(row.id, newStatus)
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

async function handleDelete(row: I18nTranslation) {
  try {
    const { data: res } = await i18nApi.deleteTranslation(row.id)
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

function handleOpenImport() {
  Object.assign(importForm, {
    countryCode: '', languageCode: '', namespaceCode: '',
    overwrite: false, jsonText: '',
  })
  importDialogVisible.value = true
}

async function handleImport() {
  if (!importFormRef.value) return
  const valid = await importFormRef.value.validate().catch(() => false)
  if (!valid) return

  let parsed: Record<string, string>
  try {
    parsed = JSON.parse(importForm.jsonText)
  } catch {
    ElMessage.error('Invalid JSON format')
    return
  }

  importLoading.value = true
  try {
    const { data: res } = await i18nApi.importTranslations({
      countryCode: importForm.countryCode,
      languageCode: importForm.languageCode,
      namespaceCode: importForm.namespaceCode,
      overwrite: importForm.overwrite,
      translations: parsed,
    })
    if (res.code === 200) {
      ElMessage.success('Imported successfully')
      importDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || 'Import failed')
    }
  } catch {
    ElMessage.error('Import failed')
  } finally {
    importLoading.value = false
  }
}

function resetImportForm() {
  importFormRef.value?.resetFields()
}

async function handleOpenExport() {
  try {
    const { data: res } = await i18nApi.exportTranslations({
      countryCode: searchForm.countryCode || undefined,
      languageCode: searchForm.languageCode || undefined,
      namespaceCode: searchForm.namespaceCode || undefined,
    })
    if (res.code === 200) {
      exportJsonText.value = JSON.stringify(res.data, null, 2)
    } else {
      exportJsonText.value = ''
      ElMessage.error(res.message || 'Export failed')
    }
  } catch {
    ElMessage.error('Export failed')
  }
  exportDialogVisible.value = true
}

async function handleCopyExport() {
  try {
    await copy(exportJsonText.value)
    ElMessage.success('Copied to clipboard')
  } catch {
    ElMessage.error('Copy failed')
  }
}

onMounted(async () => {
  await Promise.all([loadCountries(), loadLanguages(), loadNamespaces()])
  fetchData()
})
</script>

<style scoped>
.i18n-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
