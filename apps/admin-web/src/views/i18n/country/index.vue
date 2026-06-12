<template>
  <div class="i18n-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="国家名称 / 代码" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
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
        <el-button type="primary" v-permission="'i18n:country:add'" @click="handleCreate">新增国家</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column prop="flagIcon" label="旗帜" width="70" align="center" />
      <el-table-column prop="name" label="名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="code" label="代码" width="90" />
      <el-table-column prop="region" label="区域" width="130" show-overflow-tooltip>
        <template #default="{ row }">{{ regionLabel(row.region) }}</template>
      </el-table-column>
      <el-table-column prop="phoneCode" label="区号" width="90" />
      <el-table-column prop="defaultLanguageCode" label="默认语言" width="130" show-overflow-tooltip>
        <template #default="{ row }">{{ languageLabel(row.defaultLanguageCode) }}</template>
      </el-table-column>
      <el-table-column prop="currencyCode" label="货币" width="80" />
      <el-table-column prop="currencySymbol" label="符号" width="70" />
      <el-table-column prop="timezone" label="时区" width="140" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? '已启用' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'i18n:country:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'i18n:country:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
          </el-button>
          <el-popconfirm title="确定要删除该国家吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:country:delete'">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑国家' : '新增国家'" width="650px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入国家名称" />
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="form.code" placeholder="国家代码（如 US、CN）" />
        </el-form-item>
        <el-form-item label="区域" prop="region">
          <el-select v-model="form.region" placeholder="请选择区域" style="width: 100%">
            <el-option v-for="r in REGION_OPTIONS" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="旗帜图标" prop="flagIcon">
          <el-input v-model="form.flagIcon" placeholder="旗帜 emoji 或图标，如 🇺🇸" />
        </el-form-item>
        <el-form-item label="电话区号" prop="phoneCode">
          <el-input v-model="form.phoneCode" placeholder="+1" />
        </el-form-item>
        <el-form-item label="默认语言" prop="defaultLanguageCode">
          <el-select v-model="form.defaultLanguageCode" filterable clearable placeholder="请选择默认语言" style="width: 100%">
            <el-option
              v-for="language in languageOptions"
              :key="language.code"
              :label="`${language.name || language.nativeName}（${language.code}）`"
              :value="language.code"
            />
          </el-select>
          <div class="form-tip">默认语言来自「语言管理」，国家语言页面已隐藏，不再单独维护重复关系。</div>
        </el-form-item>
        <el-form-item label="货币代码" prop="currencyCode">
          <el-select
            v-model="form.currencyCode"
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入货币代码"
            style="width: 100%"
            @change="handleCurrencyChange"
          >
            <el-option v-for="currency in CURRENCY_OPTIONS" :key="currency.code" :label="`${currency.code} - ${currency.name}`" :value="currency.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="货币符号" prop="currencySymbol">
          <el-input v-model="form.currencySymbol" placeholder="$" />
        </el-form-item>
        <el-form-item label="时区" prop="timezone">
          <el-select
            v-model="form.timezone"
            filterable
            placeholder="请选择时区"
            style="width: 100%"
          >
            <el-option v-for="timezone in TIMEZONE_OPTIONS" :key="timezone" :label="timezone" :value="timezone" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率（USD → 目标货币）" prop="exchangeRate">
          <el-input-number v-model="form.exchangeRate" :precision="6" :min="0.000001" style="width: 100%" />
          <div class="form-tip">
            统一按「USD 1 : 目标货币」填写。例如 CNY 填 7，EUR 填 0.92，后台资金和报表都以此换算。
          </div>
          <div class="exchange-preview">
            当前：USD 1 = {{ form.exchangeRate || 1 }} {{ form.currencyCode || '目标货币' }}
          </div>
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
import { i18nApi, type I18nCountry, type I18nLanguage, type PageData } from '@/api/i18n'
import { REGION_OPTIONS, regionLabel } from '@/constants/i18nRegions'

defineOptions({ name: 'I18nCountryView' })

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<I18nCountry[]>([])
const total = ref(0)
const selectedRows = ref<I18nCountry[]>([])
const languageOptions = ref<I18nLanguage[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const TIMEZONE_OPTIONS = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Bogota',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Asia/Dubai',
  'Australia/Sydney',
]

const CURRENCY_OPTIONS = [
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'JPY', name: '日元', symbol: '¥' },
  { code: 'GBP', name: '英镑', symbol: '£' },
  { code: 'HKD', name: '港币', symbol: 'HK$' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$' },
  { code: 'AUD', name: '澳元', symbol: 'A$' },
  { code: 'CAD', name: '加元', symbol: 'C$' },
  { code: 'BRL', name: '巴西雷亚尔', symbol: 'R$' },
  { code: 'MXN', name: '墨西哥比索', symbol: '$' },
]

const searchForm = reactive({
  keyword: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  name: '',
  code: '',
  region: '',
  flagIcon: '',
  phoneCode: '',
  defaultLanguageCode: '',
  currencyCode: '',
  currencySymbol: '',
  timezone: '',
  exchangeRate: 1,
  status: 'ENABLE',
  sort: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入国家名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入国家代码', trigger: 'blur' }],
  phoneCode: [{ required: true, message: '请输入电话区号', trigger: 'blur' }],
  currencyCode: [{ required: true, message: '请输入货币代码', trigger: 'blur' }],
  timezone: [{ required: true, message: '请选择时区', trigger: 'change' }],
  exchangeRate: [{ required: true, message: '请输入汇率', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function handleSelectionChange(rows: I18nCountry[]) {
  selectedRows.value = rows
}

function languageLabel(code?: string) {
  if (!code) return '-'
  const language = languageOptions.value.find((item) => item.code === code)
  return language ? `${language.name || language.nativeName}（${code}）` : code
}

function handleCurrencyChange(code: string) {
  const normalized = String(code || '').trim().toUpperCase()
  form.currencyCode = normalized
  const currency = CURRENCY_OPTIONS.find((item) => item.code === normalized)
  if (currency) {
    form.currencySymbol = currency.symbol
  }
}

async function loadLanguages() {
  try {
    const { data: res } = await i18nApi.getLanguages({ status: 'ENABLE', page: 1, pageSize: 500 })
    if (res.code === 200) {
      languageOptions.value = (res.data as PageData<I18nLanguage>).list || []
    }
  } catch {
    languageOptions.value = []
  }
}

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getCountries({
      keyword: searchForm.keyword || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nCountry>
      tableData.value = pageData.list
      total.value = pageData.total
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '获取数据失败')
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
  Object.assign(form, {
    name: '',
    code: '',
    region: '',
    flagIcon: '',
    phoneCode: '',
    defaultLanguageCode: '',
    currencyCode: '',
    currencySymbol: '',
    timezone: '',
    exchangeRate: 1,
    status: 'ENABLE',
    sort: 0,
  })
  dialogVisible.value = true
}

function handleEdit(row: I18nCountry) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    code: row.code,
    region: row.region,
    flagIcon: row.flagIcon,
    phoneCode: row.phoneCode,
    defaultLanguageCode: row.defaultLanguageCode,
    currencyCode: row.currencyCode,
    currencySymbol: row.currencySymbol,
    timezone: row.timezone,
    exchangeRate: row.exchangeRate,
    status: row.status,
    sort: row.sort,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  form.code = String(form.code || '').trim().toUpperCase()
  form.currencyCode = String(form.currencyCode || '').trim().toUpperCase()
  submitLoading.value = true
  try {
    if (isEdit.value && editingId.value) {
      const { data: res } = await i18nApi.updateCountry(editingId.value, { ...form })
      if (res.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      const { data: res } = await i18nApi.createCountry({ ...form })
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

async function handleToggleStatus(row: I18nCountry) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await i18nApi.updateCountryStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('状态已更新')
      fetchData()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '状态更新失败')
  }
}

async function handleDelete(row: I18nCountry) {
  try {
    const { data: res } = await i18nApi.deleteCountry(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    ElMessage.error((error as any)?.response?.data?.message || (error as any)?.message || '删除失败')
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

onMounted(async () => {
  await loadLanguages()
  fetchData()
})
</script>

<style scoped>
.i18n-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.form-tip {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
  line-height: 18px;
}
.exchange-preview {
  margin-top: 6px;
  color: #606266;
  font-size: 12px;
  line-height: 18px;
}
</style>
