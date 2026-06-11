<template>
  <div class="i18n-page">
    <el-form :inline="true" class="search-bar">
      <el-form-item label="国家">
        <el-select v-model="selectedCountryId" placeholder="请选择国家" filterable @change="fetchData" style="width: 220px">
          <el-option v-for="c in countryOptions" :key="c.id" :label="`${c.name} (${c.code})`" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="'i18n:add'" @click="handleAddLanguage">绑定语言</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="code" label="语言代码" width="140" />
      <el-table-column prop="name" label="语言名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="nativeName" label="本地名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="isDefault" label="默认语言" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isDefault ? 'success' : 'info'">{{ row.isDefault ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button
            link
            type="warning"
            v-permission="'i18n:edit'"
            :disabled="row.isDefault"
            @click="handleSetDefault(row)"
          >
            设为默认
          </el-button>
          <el-popconfirm title="确定要删除该语言绑定吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <el-dialog v-model="dialogVisible" title="绑定语言" width="500px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="国家" prop="countryId">
          <el-select v-model="form.countryId" placeholder="请选择国家" filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.id" :label="`${c.name} (${c.code})`" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="languageId">
          <el-select v-model="form.languageId" placeholder="请选择语言" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.id" :label="`${l.name} (${l.code})`" :value="l.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认语言">
          <el-checkbox v-model="form.isDefault">设为该国家默认语言</el-checkbox>
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
import { i18nApi, type I18nCountry, type I18nLanguage, type I18nCountryLanguage } from '@/api/i18n'

defineOptions({ name: 'I18nCountryLanguageView' })

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<{ id: number; languageId: number; code: string; name: string; nativeName: string; isDefault: boolean }[]>([])
const selectedCountryId = ref<number | ''>('')
const countryOptions = ref<I18nCountry[]>([])
const languageOptions = ref<I18nLanguage[]>([])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  countryId: null as number | null,
  languageId: null as number | null,
  isDefault: false,
})

const rules: FormRules = {
  countryId: [{ required: true, message: '请选择国家', trigger: 'change' }],
  languageId: [{ required: true, message: '请选择语言', trigger: 'change' }],
}

async function loadCountries() {
  try {
    const { data: res } = await i18nApi.getCountries({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) {
      countryOptions.value = res.data.list || []
    }
  } catch {
    ElMessage.error('加载国家列表失败')
  }
}

async function loadLanguages() {
  try {
    const { data: res } = await i18nApi.getLanguages({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) {
      languageOptions.value = res.data.list || []
    }
  } catch {
    ElMessage.error('加载语言列表失败')
  }
}

async function fetchData() {
  if (!selectedCountryId.value) {
    tableData.value = []
    return
  }
  loading.value = true
  try {
    const selectedCode = countryOptions.value.find((c) => c.id === selectedCountryId.value)?.code
    const { data: res } = await i18nApi.getCountryLanguages({ countryCode: selectedCode })
    if (res.code === 200) {
      const item = res.data.find((it) => it.countryId === selectedCountryId.value) || res.data[0]
      tableData.value = (item as I18nCountryLanguage | undefined)?.languages || []
    } else {
      tableData.value = []
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleAddLanguage() {
  form.countryId = selectedCountryId.value ? selectedCountryId.value as number : null
  form.languageId = null
  form.isDefault = false
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const { data: res } = await i18nApi.bindCountryLanguage({
      countryId: form.countryId,
      languageId: form.languageId,
      isDefault: form.isDefault,
    })
    if (res.code === 200) {
      ElMessage.success('语言绑定成功')
      dialogVisible.value = false
      if (form.countryId) {
        selectedCountryId.value = form.countryId
      }
      fetchData()
    } else {
      ElMessage.error(res.message || '绑定失败')
    }
  } catch {
    ElMessage.error('绑定失败')
  } finally {
    submitLoading.value = false
  }
}

async function handleSetDefault(row: { id: number }) {
  try {
    const { data: res } = await i18nApi.setDefaultCountryLanguage(row.id)
    if (res.code === 200) {
      ElMessage.success('已设为默认语言')
      fetchData()
    } else {
      ElMessage.error(res.message || '设置默认失败')
    }
  } catch {
    ElMessage.error('设置默认失败')
  }
}

async function handleDelete(row: { id: number }) {
  try {
    const { data: res } = await i18nApi.deleteCountryLanguage(row.id)
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

function resetForm() {
  formRef.value?.resetFields()
}

onMounted(async () => {
  await Promise.all([loadCountries(), loadLanguages()])
  const firstCountry = countryOptions.value[0]
  if (firstCountry) {
    selectedCountryId.value = firstCountry.id
    fetchData()
  }
})
</script>

<style scoped>
.i18n-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
