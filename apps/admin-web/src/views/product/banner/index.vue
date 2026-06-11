<template>
  <div class="product-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
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
        <el-button type="primary" v-permission="'banner:add'" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column label="图片" width="120" align="center">
        <template #default="{ row }">
          <el-image v-if="row.imageUrl" :src="row.imageUrl" style="width: 100px; height: 50px; object-fit: cover; border-radius: 4px" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
      <el-table-column label="副标题" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.subtitle?.length > 40 ? row.subtitle.slice(0, 40) + '...' : row.subtitle }}
        </template>
      </el-table-column>
      <el-table-column label="链接地址" width="150" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.linkUrl?.length > 25 ? row.linkUrl.slice(0, 25) + '...' : row.linkUrl }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? 'Enabled' : 'Disabled' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'banner:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'banner:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? 'Disable' : 'Enable' }}
          </el-button>
          <el-button link type="info" v-permission="'banner:edit'" @click="handleOpenTranslations(row)">翻译</el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'banner:delete'">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Banner' : 'Create Banner'" width="650px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="横幅标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="横幅副标题" />
        </el-form-item>
        <el-form-item label="图片地址" prop="imageUrl">
          <div class="upload-wrap">
            <el-input v-model="form.imageUrl" placeholder="https://..." class="input-with-upload" />
            <el-upload
              :show-file-list="false"
              :http-request="handleImageUpload"
              accept="image/*"
            >
              <el-button type="primary" :loading="uploading">上传</el-button>
            </el-upload>
          </div>
          <el-image v-if="form.imageUrl" :src="form.imageUrl" style="width: 200px; height: 100px; margin-top: 8px; border-radius: 4px" fit="cover" />
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="/products?category=1" />
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

    <el-dialog v-model="transDialogVisible" title="横幅翻译" width="550px" @close="resetTransForm">
      <el-form ref="transFormRef" :model="transForm" label-width="130px">
        <el-divider content-position="left">Japanese (ja)</el-divider>
        <el-form-item label="标题">
          <el-input v-model="transForm.jaTitle" placeholder="日文标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="transForm.jaSubtitle" placeholder="日文副标题" />
        </el-form-item>
        <el-divider content-position="left">Korean (ko)</el-divider>
        <el-form-item label="标题">
          <el-input v-model="transForm.koTitle" placeholder="韩文标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="transForm.koSubtitle" placeholder="韩文副标题" />
        </el-form-item>
        <el-divider content-position="left">English (en)</el-divider>
        <el-form-item label="标题">
          <el-input v-model="transForm.enTitle" placeholder="英文标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="transForm.enSubtitle" placeholder="英文副标题" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="transDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="transLoading" @click="handleSaveTranslations">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { bannerApi, type BannerItem } from '@/api/banner'
import { uploadApi } from '@/api/upload'

defineOptions({ name: 'BannerView' })

const loading = ref(false)
const submitLoading = ref(false)
const transLoading = ref(false)
const uploading = ref(false)
const tableData = ref<BannerItem[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const transDialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const transFormRef = ref<FormInstance>()
const transEditingId = ref<number | null>(null)

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sort: 0,
  status: 'ENABLE',
})

const transForm = reactive({
  jaTitle: '',
  jaSubtitle: '',
  koTitle: '',
  koSubtitle: '',
  enTitle: '',
  enSubtitle: '',
})

const rules: FormRules = {
  title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
  imageUrl: [{ required: true, message: 'Please enter image URL', trigger: 'blur' }],
  linkUrl: [{ required: true, message: 'Please enter link URL', trigger: 'blur' }],
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await bannerApi.getBanners({
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
  Object.assign(form, { title: '', subtitle: '', imageUrl: '', linkUrl: '', sort: 0, status: 'ENABLE' })
  dialogVisible.value = true
}

function handleEdit(row: BannerItem) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl,
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
      const { data: res } = await bannerApi.updateBanner(editingId.value, payload)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      const { data: res } = await bannerApi.createBanner(payload)
      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '创建失败')
      }
    }
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: BannerItem) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await bannerApi.updateBannerStatus(row.id, newStatus)
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

async function handleDelete(row: BannerItem) {
  try {
    const { data: res } = await bannerApi.deleteBanner(row.id)
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

function handleOpenTranslations(row: BannerItem) {
  transEditingId.value = row.id
  const jaT = row.translations?.find((t) => t.languageCode === 'ja')
  const koT = row.translations?.find((t) => t.languageCode === 'ko')
  const enT = row.translations?.find((t) => t.languageCode === 'en')
  transForm.jaTitle = jaT?.title || ''
  transForm.jaSubtitle = jaT?.subtitle || ''
  transForm.koTitle = koT?.title || ''
  transForm.koSubtitle = koT?.subtitle || ''
  transForm.enTitle = enT?.title || ''
  transForm.enSubtitle = enT?.subtitle || ''
  transDialogVisible.value = true
}

async function handleSaveTranslations() {
  if (!transEditingId.value) return
  transLoading.value = true
  try {
    const payload = [
      { languageCode: 'ja', title: transForm.jaTitle, subtitle: transForm.jaSubtitle },
      { languageCode: 'ko', title: transForm.koTitle, subtitle: transForm.koSubtitle },
      { languageCode: 'en', title: transForm.enTitle, subtitle: transForm.enSubtitle },
    ]
    const { data: res } = await bannerApi.saveTranslations(transEditingId.value, payload)
    if (res.code === 200) {
      ElMessage.success('翻译已保存')
      transDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch {
    ElMessage.error('保存失败')
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

async function handleImageUpload(options: any) {
  uploading.value = true
  try {
    const { data: res } = await uploadApi.postImage(options.file, 'banner')
    if (res.code === 200) {
      const url = res.data?.url || res.data
      form.imageUrl = url
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

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.upload-wrap { display: flex; gap: 8px; width: 100%; }
.input-with-upload { flex: 1; }
</style>
