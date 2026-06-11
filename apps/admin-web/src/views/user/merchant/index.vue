<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="searchFormConfig"
      :table-data="tableData"
      :columns="columns"
      :total="total"
      :table-loading="loading"
      @refresh="fetchData"
    >
      <template #tableOperationLeft>
        <el-button
          type="primary"
          :icon="menuStore.iconComponents.Plus"
          v-permission="['merchant:add']"
          @click="openCreate"
        >
          新增商家
        </el-button>
        <el-tooltip
          :disabled="pendingApplicationCount <= 0"
          :content="applicationButtonTip"
          placement="top"
        >
          <el-badge :value="pendingApplicationCount" :hidden="pendingApplicationCount <= 0">
            <el-button
              type="success"
              v-permission="'admin:merchantApplication:view'"
              @click="goApplications"
            >
              商家申请
            </el-button>
          </el-badge>
        </el-tooltip>
      </template>
      <template #status="{ row }">
        <BaseTag
          :type="getColorByValue(STATUS_OPTIONS, row.status)"
          :text="getLabelByValue(STATUS_OPTIONS, row.status)"
        />
      </template>
      <template #operation="{ row }">
        <el-button type="primary" link v-permission="['merchant:edit']" @click="openEdit(row)"
          >编辑</el-button
        >
        <el-button
          type="warning"
          link
          v-permission="'admin:user:merchant:fund'"
          @click="openFund(row)"
          >资金</el-button
        >
        <el-button
          type="info"
          link
          v-permission="'admin:user:merchant:resetPwd'"
          @click="openPassword(row)"
          >改密码</el-button
        >
        <el-button type="primary" link @click="openAccounts(row)">提款账户</el-button>
        <el-popconfirm
          :title="row.status === 'ENABLE' ? '确定要禁用该商家吗？' : '确定要启用该商家吗？'"
          :placement="POPCONFIRM_CONFIG.placement"
          :width="POPCONFIRM_CONFIG.width"
          @confirm="handleToggleStatus(row)"
        >
          <template #reference>
            <el-button
              link
              :type="row.status === 'ENABLE' ? 'danger' : 'success'"
              v-permission="['merchant:edit']"
            >
              {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </BasePage>

    <BaseDialog
      v-model="dialogVisible"
      :title="editForm.id ? '编辑商家' : '新增商家'"
      width="600"
      @close="dialogVisible = false"
    >
      <el-form ref="formRef" :model="editForm" :rules="formRules" label-width="120px">
        <el-form-item label="邮箱" prop="email"><el-input v-model="editForm.email" /></el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editForm.id">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="店铺名称" prop="name"
          ><el-input v-model="editForm.name"
        /></el-form-item>
        <el-form-item label="手机号" prop="phone"
          ><el-input v-model="editForm.phone"
        /></el-form-item>
        <el-form-item label="国家" prop="country">
          <el-select v-model="editForm.country" filterable clearable placeholder="请选择国家" style="width: 100%">
            <el-option
              v-for="country in countryOptions"
              :key="country.code"
              :label="`${country.name}（${country.code}）`"
              :value="country.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="editForm.language" filterable clearable placeholder="请选择语言" style="width: 100%">
            <el-option
              v-for="language in languageOptions"
              :key="language.code"
              :label="`${language.name || language.nativeName}（${language.code}）`"
              :value="language.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人"><el-input v-model="editForm.contactName" /></el-form-item>
        <el-form-item label="联系电话"><el-input v-model="editForm.contactPhone" /></el-form-item>
      </el-form>

      <template v-if="editForm.id && applicationInfo">
        <el-divider content-position="left">商家申请资料</el-divider>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="姓名">{{ applicationInfo.fullName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ applicationInfo.age ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="申请邮箱">{{ applicationInfo.email || '-' }}</el-descriptions-item>
          <el-descriptions-item label="申请手机号">{{ applicationInfo.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="家庭地址">{{ applicationInfo.homeAddress || '-' }}</el-descriptions-item>
          <el-descriptions-item label="证件正面"><MerchantAppFile :application-id="applicationInfo.id" field="idCardFront" :has="!!applicationInfo.idCardFrontUrl" kind="image" /></el-descriptions-item>
          <el-descriptions-item label="证件背面"><MerchantAppFile :application-id="applicationInfo.id" field="idCardBack" :has="!!applicationInfo.idCardBackUrl" kind="image" /></el-descriptions-item>
          <el-descriptions-item label="护照页"><MerchantAppFile :application-id="applicationInfo.id" field="passport" :has="!!applicationInfo.passportPageUrl" kind="image" /></el-descriptions-item>
          <el-descriptions-item label="驾驶证"><MerchantAppFile :application-id="applicationInfo.id" field="driverLicense" :has="!!applicationInfo.driverLicenseUrl" kind="image" /></el-descriptions-item>
          <el-descriptions-item label="手持证件视频"><MerchantAppFile :application-id="applicationInfo.id" field="handheldVideo" :has="!!applicationInfo.handheldDocumentVideoUrl" kind="video" /></el-descriptions-item>
          <el-descriptions-item label="审核备注">{{ applicationInfo.reviewRemark || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
      </template>
    </BaseDialog>

    <!-- 资金管理 -->
    <BaseDialog v-model="fundVisible" title="商家资金" width="760" @close="fundVisible = false">
      <el-descriptions :column="2" border size="small" style="margin-bottom: 12px">
        <el-descriptions-item label="店铺">{{ fundMerchant.shopName }}</el-descriptions-item>
        <el-descriptions-item label="结算货币">
          {{ fundMerchant.currencyCode || 'USD' }}
          <span v-if="fundMerchant.exchangeRate">（美元 1 : {{ fundMerchant.exchangeRate }} {{ fundMerchant.currencyCode }}）</span>
        </el-descriptions-item>
        <el-descriptions-item label="可用余额">
          {{ fundMerchant.currencySymbol || '' }}{{ fundMerchant.balance ?? 0 }}
        </el-descriptions-item>
        <el-descriptions-item label="冻结余额">
          {{ fundMerchant.currencySymbol || '' }}{{ fundMerchant.frozenBalance ?? 0 }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form :inline="true" :model="fundForm" class="fund-form">
        <el-form-item label="方向">
          <el-select v-model="fundForm.direction" style="width: 120px">
            <el-option label="增加" value="INCREASE" />
            <el-option label="扣减" value="DECREASE" />
            <el-option label="冻结" value="FREEZE" />
            <el-option label="解冻" value="UNFREEZE" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="fundForm.amount" :min="0.01" :precision="2" :step="100" />
          <el-select v-model="fundForm.amountCurrency" style="width: 132px; margin-left: 8px">
            <el-option :label="fundMerchant.currencyCode || '本地货币'" value="LOCAL" />
            <el-option label="美元 USD" value="USD" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="fundForm.amount" label="入账金额">
          <span class="currency-preview">
            {{ fundMerchant.currencySymbol || '' }}{{ convertedFundAmount }}
            {{ fundMerchant.currencyCode || 'USD' }}
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="fundForm.remark" placeholder="必填，请填写资金调整原因" style="width: 260px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="fundSubmitting" @click="handleAdjustFund">提交调整</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="fundLogs" border size="small" v-loading="fundLoading" max-height="320">
        <el-table-column prop="createdAt" label="时间" min-width="160" />
        <el-table-column prop="type" label="类型" width="140" />
        <el-table-column prop="balanceBefore" label="变动前" width="110" />
        <el-table-column prop="amount" label="金额" width="110" />
        <el-table-column prop="balanceAfter" label="变动后余额" width="120" />
        <el-table-column prop="frozenBalanceBefore" label="冻结前" width="110" />
        <el-table-column prop="frozenBalanceAfter" label="冻结后" width="110" />
        <el-table-column prop="remark" label="备注" min-width="140" />
      </el-table>
      <div class="fund-pager">
        <el-pagination
          v-model:current-page="fundPage"
          :page-size="fundPageSize"
          :total="fundTotal"
          layout="total, prev, pager, next"
          @current-change="loadFundLogs"
        />
      </div>
    </BaseDialog>

    <!-- 改密码 -->
    <BaseDialog v-model="pwdVisible" title="修改商家密码" width="480" @close="pwdVisible = false">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="110px">
        <el-form-item label="密码类型" prop="type">
          <el-radio-group v-model="pwdForm.type">
            <el-radio label="LOGIN">登录密码</el-radio>
            <el-radio label="WITHDRAW">提现密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdForm.password" type="password" show-password placeholder="至少6位" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdSubmitting" @click="handleResetPassword">保存</el-button>
      </template>
    </BaseDialog>

    <!-- 提款账户 -->
    <BaseDialog v-model="accountsVisible" title="商家提款账户" width="720" @close="accountsVisible = false">
      <div class="account-toolbar">
        <el-button type="primary" size="small" @click="openAccountCreate">新增提款账户</el-button>
      </div>
      <el-table :data="accounts" border size="small" v-loading="accountsLoading">
        <el-table-column prop="type" label="类型" width="90">
          <template #default="{ row }">{{ row.type === 'CRYPTO' ? '加密货币' : '银行' }}</template>
        </el-table-column>
        <el-table-column label="账户信息" min-width="280">
          <template #default="{ row }">
            <template v-if="row.type === 'CRYPTO'">{{ row.chain }} · {{ row.address }}</template>
            <template v-else>{{ row.bankName }} · {{ row.accountNo }} · {{ row.accountName }}</template>
          </template>
        </el-table-column>
        <el-table-column label="默认" width="70">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault" type="success" size="small">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openAccountEdit(row)">编辑</el-button>
            <el-popconfirm title="确定禁用该提款账户吗？" @confirm="handleDeleteAccount(row)">
              <template #reference>
                <el-button link type="danger">禁用</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!accountsLoading && accounts.length === 0" description="该商家暂未绑定提款账户" />
    </BaseDialog>

    <BaseDialog v-model="accountFormVisible" :title="accountForm.id ? '编辑提款账户' : '新增提款账户'" width="560">
      <el-form :model="accountForm" label-width="110px">
        <el-form-item label="账户类型">
          <el-radio-group v-model="accountForm.type">
            <el-radio label="CRYPTO">加密货币</el-radio>
            <el-radio label="BANK">银行账户</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="accountForm.type === 'CRYPTO'">
          <el-form-item label="链类型" required><el-input v-model="accountForm.chain" /></el-form-item>
          <el-form-item label="钱包地址" required><el-input v-model="accountForm.address" /></el-form-item>
        </template>
        <template v-else>
          <el-form-item label="银行名称" required><el-input v-model="accountForm.bankName" /></el-form-item>
          <el-form-item label="银行卡号" required><el-input v-model="accountForm.accountNo" /></el-form-item>
          <el-form-item label="开户名" required><el-input v-model="accountForm.accountName" /></el-form-item>
          <el-form-item label="国家/地区"><el-input v-model="accountForm.country" /></el-form-item>
        </template>
        <el-form-item label="状态">
          <el-select v-model="accountForm.status" style="width: 100%">
            <el-option label="启用" value="ENABLE" />
            <el-option label="禁用" value="DISABLE" />
          </el-select>
        </el-form-item>
        <el-form-item label="设为默认"><el-switch v-model="accountForm.isDefault" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="accountForm.remark" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="accountFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="accountSubmitting" @click="handleSaveAccount">保存</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { merchantApi } from '@/api/merchant'
import { merchantApplicationApi } from '@/api/merchantApplication'
import { i18nApi, type I18nCountry, type I18nLanguage } from '@/api/i18n'
import { POPCONFIRM_CONFIG } from '@/config/elementConfig'
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict'
import type { IFormConfig } from '@/types/components/page'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'MerchantListView' })

const menuStore = useMenuStore()
const router = useRouter()
const basePageRef = useTemplateRef('basePageRef')
const formRef = useTemplateRef<FormInstance>('formRef')

const tableData = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const submitLoading = ref(false)
const applicationInfo = ref<any>(null)
const pendingApplicationCount = ref(0)
const countryOptions = ref<I18nCountry[]>([])
const languageOptions = ref<I18nLanguage[]>([])
const applicationButtonTip = computed(() =>
  pendingApplicationCount.value > 0 ? `${pendingApplicationCount.value} 条新商家申请` : '有新商家申请',
)

// 资金管理
const fundVisible = ref(false)
const fundMerchant = reactive<{
  id: string | number
  shopName: string
  balance?: number
  frozenBalance?: number
  currencyCode?: string
  currencySymbol?: string
  exchangeRate?: number
}>({
  id: '',
  shopName: '',
})
const fundForm = reactive<{ direction: string; amount?: number; amountCurrency: string; remark: string }>({
  direction: 'INCREASE',
  amount: undefined,
  amountCurrency: 'LOCAL',
  remark: '',
})
const fundSubmitting = ref(false)
const fundLogs = ref<any[]>([])
const fundLoading = ref(false)
const fundPage = ref(1)
const fundPageSize = ref(10)
const fundTotal = ref(0)

const convertedFundAmount = computed(() => {
  const amount = Number(fundForm.amount || 0)
  if (!amount) return '0.00'
  const rate = Number(fundMerchant.exchangeRate || 1)
  const value = fundForm.amountCurrency === 'USD' ? amount * rate : amount
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

// 改密码
const pwdVisible = ref(false)
const pwdFormRef = useTemplateRef<FormInstance>('pwdFormRef')
const pwdForm = reactive<{ id: string | number; type: string; password: string }>({
  id: '',
  type: 'LOGIN',
  password: '',
})
const pwdSubmitting = ref(false)
const pwdRules: FormRules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
}

// 提款账户（只读查看）
const accountsVisible = ref(false)
const accounts = ref<any[]>([])
const accountsLoading = ref(false)
const accountMerchantId = ref<string | number>('')
const accountFormVisible = ref(false)
const accountSubmitting = ref(false)
const emptyAccountForm = () => ({
  id: '',
  type: 'CRYPTO',
  chain: '',
  address: '',
  bankName: '',
  accountNo: '',
  accountName: '',
  country: '',
  status: 'ENABLE',
  remark: '',
  isDefault: false,
})
const accountForm = reactive<any>(emptyAccountForm())

const editForm = reactive({
  id: '' as string | number,
  email: '',
  password: '',
  name: '',
  phone: '',
  country: '',
  language: '',
  contactName: '',
  contactPhone: '',
})

const formRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const searchFormConfig = ref<IFormConfig[]>([
  {
    label: '关键词',
    prop: 'keyword',
    type: 'elInput',
    attrs: { placeholder: '请输入关键词', clearable: true },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'elSelect',
    attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true },
  },
  {
    label: '国家',
    prop: 'country',
    type: 'elInput',
    attrs: { placeholder: '国家', clearable: true },
  },
])

const columns = ref([
  { type: 'index', label: '#', width: 55, fixed: 'left' },
  { prop: 'merchantId', label: '商家ID', minWidth: 100 },
  { prop: 'shopName', label: '店铺名称', minWidth: 150 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'phone', label: '手机号', minWidth: 130 },
  { prop: 'country', label: '国家', width: 90 },
  { prop: 'language', label: '语言', width: 90 },
  { prop: 'productCount', label: '商品数', width: 90 },
  { prop: 'totalSales', label: '总销售额', width: 110 },
  { prop: 'balance', label: '余额', width: 100 },
  { prop: 'frozenBalance', label: '冻结金额', width: 100 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
])

const fetchData = async (queryForm: Record<string, unknown>, page: number, pageSize: number) => {
  loading.value = true
  try {
    const { data: res } = await merchantApi.getMerchants({ ...queryForm, page, pageSize })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } catch {
    /* ignore */
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  editForm.id = ''
  editForm.email = ''
  editForm.password = ''
  editForm.name = ''
  editForm.phone = ''
  editForm.country = ''
  editForm.language = ''
  editForm.contactName = ''
  editForm.contactPhone = ''
  formRef.value?.resetFields()
}

const loadApplication = async (merchantId: string | number) => {
  applicationInfo.value = null
  if (!merchantId) return
  try {
    const { data: res } = await merchantApplicationApi.getByMerchant(merchantId)
    if (res.code === 200 && res.data && res.data.id) {
      applicationInfo.value = res.data
    }
  } catch {
    /* 无关联申请资料时忽略 */
  }
}

const loadPendingApplicationCount = async () => {
  try {
    const { data: res } = await merchantApplicationApi.getPendingCount()
    if (res.code === 200) {
      pendingApplicationCount.value = Number(res.data?.pendingCount || 0)
    }
  } catch {
    pendingApplicationCount.value = 0
  }
}

const loadLocaleOptions = async () => {
  try {
    const [{ data: countryRes }, { data: languageRes }] = await Promise.all([
      i18nApi.getCountries({ status: 'ENABLE', page: 1, pageSize: 500 }),
      i18nApi.getLanguages({ status: 'ENABLE', page: 1, pageSize: 500 }),
    ])
    if (countryRes.code === 200) {
      countryOptions.value = countryRes.data?.list || []
    }
    if (languageRes.code === 200) {
      languageOptions.value = languageRes.data?.list || []
    }
  } catch {
    countryOptions.value = []
    languageOptions.value = []
  }
}

const openCreate = () => {
  resetForm()
  applicationInfo.value = null
  dialogVisible.value = true
}

const goApplications = () => {
  router.push('/user/merchant-application')
}

const openEdit = async (row: any) => {
  try {
    const { data: res } = await merchantApi.getMerchants({
      merchantId: row.merchantId || row.id,
      page: 1,
      pageSize: 1,
    })
    const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row
    Object.assign(editForm, {
      id: d.id || row.id,
      email: d.email || row.email || '',
      name: d.shopName || d.name || row.shopName || '',
      phone: d.phone || row.phone || '',
      country: d.countryCode || d.country || row.countryCode || row.country || '',
      language: d.languageCode || d.language || row.languageCode || row.language || '',
      contactName: d.contactName || row.contactName || '',
      contactPhone: d.contactPhone || row.contactPhone || '',
    })
    loadApplication(d.merchantId || d.id || row.id)
    dialogVisible.value = true
  } catch {
    Object.assign(editForm, {
      id: row.id,
      email: row.email || '',
      name: row.shopName || '',
      phone: row.phone || '',
      country: row.countryCode || row.country || '',
      language: row.languageCode || row.language || '',
    })
    loadApplication(row.merchantId || row.id)
    dialogVisible.value = true
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    const payload = {
      email: editForm.email,
      shopName: editForm.name,
      nickname: editForm.name,
      phone: editForm.phone,
      countryCode: editForm.country,
      languageCode: editForm.language,
      country: editForm.country,
      language: editForm.language,
      contactName: editForm.contactName,
      contactPhone: editForm.contactPhone,
    }
    let res
    if (editForm.id) {
      res = await merchantApi.updateMerchant(editForm.id, payload)
    } else {
      res = await merchantApi.createMerchant({ ...payload, password: editForm.password })
    }
    if (res.data.code === 200) {
      ElMessage.success(editForm.id ? '商家更新成功' : '商家创建成功')
      dialogVisible.value = false
      editForm.id
        ? basePageRef.value?.refreshCurrentPage()
        : basePageRef.value?.refreshToFirstPage()
    } else {
      ElMessage.error(res.data.message || '操作失败')
    }
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const openFund = (row: any) => {
  fundMerchant.id = row.merchantId || row.id
  fundMerchant.shopName = row.shopName || ''
  fundMerchant.balance = row.balance
  fundMerchant.frozenBalance = row.frozenBalance
  fundMerchant.currencyCode = row.currencyCode || 'USD'
  fundMerchant.currencySymbol = row.currencySymbol || ''
  fundMerchant.exchangeRate = row.exchangeRate
  fundForm.direction = 'INCREASE'
  fundForm.amount = undefined
  fundForm.amountCurrency = 'LOCAL'
  fundForm.remark = ''
  fundPage.value = 1
  fundVisible.value = true
  loadFundLogs()
}

const loadFundLogs = async () => {
  if (!fundMerchant.id) return
  fundLoading.value = true
  try {
    const { data: res } = await merchantApi.getFundLogs(fundMerchant.id, {
      page: fundPage.value,
      pageSize: fundPageSize.value,
    })
    if (res.code === 200) {
      fundLogs.value = res.data?.list || []
      fundTotal.value = res.data?.total || 0
      fundMerchant.balance = res.data?.balance
      fundMerchant.frozenBalance = res.data?.frozenBalance
    }
  } catch {
    /* ignore */
  } finally {
    fundLoading.value = false
  }
}

const handleAdjustFund = async () => {
  if (!fundForm.amount || fundForm.amount <= 0) {
    ElMessage.warning('请输入大于0的金额')
    return
  }
  if (!fundForm.remark.trim()) {
    ElMessage.warning('请填写资金调整原因')
    return
  }
  fundSubmitting.value = true
  try {
    const payload = {
      amount: fundForm.amount,
      amountCurrency: fundForm.amountCurrency,
      reason: fundForm.remark,
      remark: fundForm.remark,
      direction: fundForm.direction,
    }
    const actionMap: Record<string, typeof merchantApi.addFund> = {
      INCREASE: merchantApi.addFund,
      DECREASE: merchantApi.subtractFund,
      FREEZE: merchantApi.freezeFund,
      UNFREEZE: merchantApi.unfreezeFund,
    }
    const action = actionMap[fundForm.direction] || merchantApi.adjustFund
    const { data: res } = await action(fundMerchant.id, payload)
    if (res.code === 200) {
      ElMessage.success('资金调整成功')
      fundForm.amount = undefined
      fundForm.remark = ''
      fundPage.value = 1
      loadFundLogs()
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || '调整失败')
    }
  } catch {
    /* 错误已由拦截器提示 */
  } finally {
    fundSubmitting.value = false
  }
}

const openPassword = (row: any) => {
  pwdForm.id = row.merchantId || row.id
  pwdForm.type = 'LOGIN'
  pwdForm.password = ''
  pwdFormRef.value?.resetFields()
  pwdVisible.value = true
}

const handleResetPassword = async () => {
  await pwdFormRef.value?.validate()
  pwdSubmitting.value = true
  try {
    const { data: res } =
      pwdForm.type === 'WITHDRAW'
        ? await merchantApi.resetWithdrawPassword(pwdForm.id, pwdForm.password)
        : await merchantApi.resetLoginPassword(pwdForm.id, pwdForm.password)
    if (res.code === 200) {
      ElMessage.success(pwdForm.type === 'WITHDRAW' ? '提现密码已重置' : '登录密码已重置')
      pwdVisible.value = false
    } else {
      ElMessage.error(res.message || '重置失败')
    }
  } catch {
    /* 校验失败或请求错误 */
  } finally {
    pwdSubmitting.value = false
  }
}

const openAccounts = async (row: any) => {
  accounts.value = []
  accountMerchantId.value = row.merchantId || row.id
  accountsVisible.value = true
  accountsLoading.value = true
  try {
    const { data: res } = await merchantApi.getWithdrawAccounts(accountMerchantId.value)
    if (res.code === 200) {
      accounts.value = res.data || []
    }
  } catch {
    /* ignore */
  } finally {
    accountsLoading.value = false
  }
}

const openAccountCreate = () => {
  Object.assign(accountForm, emptyAccountForm())
  accountFormVisible.value = true
}

const openAccountEdit = (row: any) => {
  Object.assign(accountForm, emptyAccountForm(), row, {
    address: '',
    accountNo: '',
  })
  accountFormVisible.value = true
}

const handleSaveAccount = async () => {
  if (accountForm.type === 'CRYPTO' && (!accountForm.chain || !accountForm.address)) {
    ElMessage.warning('请填写链类型和钱包地址')
    return
  }
  if (accountForm.type === 'BANK' && (!accountForm.bankName || !accountForm.accountNo || !accountForm.accountName)) {
    ElMessage.warning('请填写银行名称、银行卡号和开户名')
    return
  }
  accountSubmitting.value = true
  try {
    const payload = { ...accountForm }
    delete payload.id
    const { data: res } = accountForm.id
      ? await merchantApi.updateWithdrawAccount(accountForm.id, payload)
      : await merchantApi.createWithdrawAccount(accountMerchantId.value, payload)
    if (res.code === 200) {
      ElMessage.success('提款账户已保存')
      accountFormVisible.value = false
      const { data: listRes } = await merchantApi.getWithdrawAccounts(accountMerchantId.value)
      accounts.value = listRes.code === 200 ? listRes.data || [] : accounts.value
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } finally {
    accountSubmitting.value = false
  }
}

const handleDeleteAccount = async (row: any) => {
  const { data: res } = await merchantApi.deleteWithdrawAccount(row.id)
  if (res.code === 200) {
    ElMessage.success('提款账户已禁用')
    const { data: listRes } = await merchantApi.getWithdrawAccounts(accountMerchantId.value)
    accounts.value = listRes.code === 200 ? listRes.data || [] : accounts.value
  } else {
    ElMessage.error(res.message || '禁用失败')
  }
}

const handleToggleStatus = async (row: any) => {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await merchantApi.updateMerchantStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('状态已更新')
      basePageRef.value?.refreshCurrentPage()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch {
    ElMessage.error('状态更新失败')
  }
}

onMounted(() => {
  loadPendingApplicationCount()
  loadLocaleOptions()
})
</script>

<style scoped>
.fund-form {
  margin-bottom: 12px;
}
.fund-pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.currency-hint {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}
.currency-preview {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
