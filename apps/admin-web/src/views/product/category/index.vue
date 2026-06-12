<template>
  <div class="product-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input
          v-model="searchForm.keyword"
          placeholder="关键词"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
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
        <el-button type="primary" v-permission="'product:category:add'" @click="handleCreate"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="icon" label="图标" width="80" align="center" />
      <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
      <el-table-column label="上级" width="120" align="center">
        <template #default="{ row }">
          {{ row.parentId ? getCategoryName(row.parentId) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{
            row.status === 'ENABLE' ? '已启用' : '已禁用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'product:category:edit'" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            link
            :type="row.status === 'ENABLE' ? 'warning' : 'success'"
            v-permission="'product:category:edit'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
          </el-button>
          <el-button
            link
            type="info"
            v-permission="'product:category:edit'"
            @click="handleOpenTranslations(row)"
            >翻译</el-button
          >
          <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'product:category:delete'">删除</el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="650px"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="中文名称" prop="name">
          <el-input v-model="form.name" placeholder="可直接使用中文命名，如 手机配件" />
          <div class="form-tip">这是后台基础名称；商家后台和前台会优先按当前语言显示下方翻译名称，缺失时回退到该名称。</div>
        </el-form-item>
        <el-form-item label="上级" prop="parentId">
          <el-select
            v-model="form.parentId"
            placeholder="上级分类（选填）"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option v-for="c in parentOptions" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <div class="upload-wrap">
            <el-input
              v-model="form.icon"
              placeholder="图标 emoji 或图片地址"
              class="input-with-upload"
            />
            <el-upload :show-file-list="false" :http-request="handleIconUpload" accept="image/*">
              <el-button type="primary" :loading="uploading">上传</el-button>
            </el-upload>
          </div>
          <el-image
            v-if="form.icon && form.icon.startsWith('http')"
            :src="form.icon"
            style="width: 60px; height: 60px; margin-top: 8px; border-radius: 4px"
            fit="cover"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="状态" style="width: 100%">
            <el-option label="已启用" value="ENABLE" />
            <el-option label="已禁用" value="DISABLE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="transDialogVisible" title="分类多语言名称" width="620px" @close="resetTransForm">
      <el-alert
        title="这里会显示语言管理中已启用的所有语言。未填写的语言会在商家后台/前台回退显示分类中文名称。"
        type="info"
        :closable="false"
        style="margin-bottom: 14px"
      />
      <el-form ref="transFormRef" :model="transForm" label-width="170px">
        <el-form-item
          v-for="language in languageOptions"
          :key="language.code"
          :label="`${language.name || language.nativeName}（${language.code}）`"
        >
          <el-input v-model="transForm[language.code]" :placeholder="`请输入${language.name || language.code}名称`" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="transLoading" @click="handleSaveTranslations"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { categoryApi, type CategoryItem } from '@/api/category'
import { i18nApi, type I18nLanguage } from '@/api/i18n'
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
const languageOptions = ref<I18nLanguage[]>([])

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

const transForm = reactive<Record<string, string>>({})

const rules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function getCategoryName(id: number): string {
  const c = tableData.value.find((i) => i.id === id) || parentOptions.value.find((i) => i.id === id)
  return c ? c.name : ''
}

async function loadParentOptions() {
  try {
    const { data: res } = await categoryApi.getCategories({
      page: 1,
      pageSize: 999,
      status: 'ENABLE',
    })
    if (res.code === 200) parentOptions.value = res.data.list || []
  } catch {
    /* ignore */
  }
}

async function loadLanguageOptions() {
  try {
    const { data: res } = await i18nApi.getLanguages({ status: 'ENABLE', page: 1, pageSize: 500 })
    if (res.code === 200) {
      languageOptions.value = res.data?.list || []
      languageOptions.value.forEach((language) => {
        if (!(language.code in transForm)) transForm[language.code] = ''
      })
    }
  } catch {
    languageOptions.value = []
  }
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
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      const { data: res } = await categoryApi.createCategory(payload)
      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: CategoryItem) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await categoryApi.updateCategoryStatus(row.id, newStatus)
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

async function handleDelete(row: CategoryItem) {
  try {
    const { data: res } = await categoryApi.deleteCategory(row.id)
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

function handleOpenTranslations(row: CategoryItem) {
  transEditingId.value = row.id
  languageOptions.value.forEach((language) => {
    const translation = row.translations?.find((t) => t.languageCode === language.code)
    transForm[language.code] = translation?.name || ''
  })
  transDialogVisible.value = true
}

async function handleSaveTranslations() {
  if (!transEditingId.value) return
  transLoading.value = true
  try {
    const payload = languageOptions.value
      .map((language) => ({ languageCode: language.code, name: transForm[language.code] || '' }))
      .filter((item) => item.name.trim())
    const { data: res } = await categoryApi.saveTranslations(transEditingId.value, payload)
    if (res.code === 200) {
      ElMessage.success('翻译已保存')
      transDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '保存失败')
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
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch {
    ElMessage.error('上传失败')
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadParentOptions(), loadLanguageOptions()])
  fetchData()
})
</script>

<style scoped>
.product-page {
  padding: 20px;
}
.search-bar {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.upload-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}
.input-with-upload {
  flex: 1;
}
.form-tip {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
  line-height: 18px;
}
</style>
