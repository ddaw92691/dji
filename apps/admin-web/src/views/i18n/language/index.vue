<template>
  <div class="i18n-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="语言名称 / 代码" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option label="已启用" value="ENABLE" />
          <el-option label="已禁用" value="DISABLE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="'i18n:language:add'" @click="handleCreate">新增语言</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="name" label="语言名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="nativeName" label="本地名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="code" label="语言代码" width="120" />
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? '已启用' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'i18n:language:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'i18n:language:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
          </el-button>
          <el-popconfirm title="确定要删除该语言吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:language:delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑语言' : '新增语言'" width="550px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="语言名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入语言名称，如 English" />
        </el-form-item>
        <el-form-item label="本地名称" prop="nativeName">
          <el-input v-model="form.nativeName" placeholder="请输入本地名称，如 简体中文" />
        </el-form-item>
        <el-form-item label="语言代码" prop="code">
          <el-input v-model="form.code" placeholder="如 en、zh-Hans、zh-Hant、es" />
          <div class="form-tip">语言代码会按 BCP47 风格保存，例如 zh-Hans 不会被强制改成 zh-hans，避免前台语言包匹配失败。</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="已启用" value="ENABLE" />
            <el-option label="已禁用" value="DISABLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { i18nApi, type I18nLanguage, type PageData } from '@/api/i18n'

defineOptions({ name: 'I18nLanguageView' })

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<I18nLanguage[]>([])
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
  nativeName: '',
  code: '',
  status: 'ENABLE',
  sort: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入语言名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入语言代码', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getLanguages({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nLanguage>
      tableData.value = pageData.list
      total.value = pageData.total
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function handleReset() {
  searchForm.keyword = ''
  searchForm.status = ''
  handleSearch()
}

function handleCreate() {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, { name: '', nativeName: '', code: '', status: 'ENABLE', sort: 0 })
  dialogVisible.value = true
}

function handleEdit(row: I18nLanguage) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    nativeName: row.nativeName,
    code: row.code,
    status: row.status,
    sort: row.sort,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  form.code = normalizeLanguageCode(form.code)
  submitLoading.value = true
  try {
    if (isEdit.value && editingId.value) {
      const { data: res } = await i18nApi.updateLanguage(editingId.value, { ...form })
      if (res.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      const { data: res } = await i18nApi.createLanguage({ ...form })
      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '新增失败')
      }
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: I18nLanguage) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await i18nApi.updateLanguageStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('状态已更新')
      fetchData()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch {
    ElMessage.error('状态更新失败')
  }
}

async function handleDelete(row: I18nLanguage) {
  try {
    const { data: res } = await i18nApi.deleteLanguage(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
  }
}

function normalizeLanguageCode(code: string) {
  return String(code || '')
    .trim()
    .replace(/_/g, '-')
    .split('-')
    .map((part, index) => {
      if (index === 0) return part.toLowerCase()
      if (part.length === 2) return part.toUpperCase()
      if (part.length === 4) return `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`
      return part
    })
    .join('-')
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
.form-tip { margin-top: 6px; color: #909399; font-size: 12px; line-height: 18px; }
</style>
