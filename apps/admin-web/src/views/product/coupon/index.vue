<template>
  <div class="coupon-page">
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
        <el-select v-model="searchForm.type" placeholder="类型" clearable @change="handleSearch">
          <el-option
            v-for="o in COUPON_TYPE_OPTIONS"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option
            v-for="o in COUPON_STATUS_OPTIONS"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-permission="'coupon:add'" @click="openCreate"
          >新建优惠券</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="code" label="代码" width="130" show-overflow-tooltip />
      <el-table-column label="类型" width="110" align="center">
        <template #default="{ row }">
          <el-tag>{{ getLabelByValue(COUPON_TYPE_OPTIONS, row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="90" align="right" />
      <el-table-column prop="discountRate" label="比例" width="70" align="center">
        <template #default="{ row }">{{
          row.discountRate ? row.discountRate + '%' : '-'
        }}</template>
      </el-table-column>
      <el-table-column prop="minSpend" label="最低消费" width="100" align="right" />
      <el-table-column prop="totalQuantity" label="合计" width="70" align="center" />
      <el-table-column prop="receivedQuantity" label="已收" width="70" align="center" />
      <el-table-column prop="usedQuantity" label="已使用" width="70" align="center" />
      <el-table-column prop="startAt" label="开始" width="160" />
      <el-table-column prop="endAt" label="结束" width="160" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getColorByValue(COUPON_STATUS_OPTIONS, row.status)">
            {{ getLabelByValue(COUPON_STATUS_OPTIONS, row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'coupon:edit'" @click="openEdit(row)"
            >编辑</el-button
          >
          <el-button
            link
            :type="row.status === 'ENABLE' ? 'warning' : 'success'"
            v-permission="'coupon:edit'"
            @click="toggleStatus(row)"
          >
            {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="info" v-permission="'coupon:view'" @click="openRecords(row)"
            >记录</el-button
          >
          <el-button link type="danger" v-permission="'coupon:delete'" @click="handleDelete(row)"
            >删除</el-button
          >
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
      v-model="formVisible"
      :title="editingId ? '编辑优惠券' : '新建优惠券'"
      width="700px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" label-width="130px" :rules="formRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="优惠券名称" />
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="form.code" placeholder="优惠券码" :disabled="!!editingId" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option
              v-for="o in COUPON_TYPE_OPTIONS"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 'FIXED_AMOUNT'" label="金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item v-if="form.type === 'PERCENTAGE'" label="折扣率" prop="discountRate">
          <el-input-number
            v-model="form.discountRate"
            :min="0"
            :max="100"
            :precision="1"
            style="width: 100%"
          />
          <span style="margin-left: 4px">%</span>
        </el-form-item>
        <el-form-item label="最低消费" prop="minSpend">
          <el-input-number v-model="form.minSpend" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="总数量" prop="totalQuantity">
          <el-input-number v-model="form.totalQuantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="每用户限制" prop="perUserLimit">
          <el-input-number v-model="form.perUserLimit" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startAt">
          <el-date-picker
            v-model="form.startAt"
            type="datetime"
            placeholder="开始日期"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endAt">
          <el-date-picker
            v-model="form.endAt"
            type="datetime"
            placeholder="结束日期"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option
              v-for="o in COUPON_STATUS_OPTIONS"
              :key="o.value"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
        </el-form-item>
        <el-divider>翻译</el-divider>
        <el-form-item label="日文名称">
          <el-input v-model="form.translations.ja.name" placeholder="日文名称" />
        </el-form-item>
        <el-form-item label="日文描述">
          <el-input
            v-model="form.translations.ja.description"
            type="textarea"
            :rows="2"
            placeholder="日文描述"
          />
        </el-form-item>
        <el-form-item label="韩文名称">
          <el-input v-model="form.translations.ko.name" placeholder="韩文名称" />
        </el-form-item>
        <el-form-item label="韩文描述">
          <el-input
            v-model="form.translations.ko.description"
            type="textarea"
            :rows="2"
            placeholder="韩文描述"
          />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="form.translations.en.name" placeholder="英文名称" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input
            v-model="form.translations.en.description"
            type="textarea"
            :rows="2"
            placeholder="英文描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="recordsVisible" title="优惠券记录" width="900px">
      <el-table :data="recordsData" border stripe v-loading="recordsLoading">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="userName" label="用户" min-width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="
                row.status === 'USED' ? 'success' : row.status === 'RECEIVED' ? 'primary' : 'info'
              "
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usedOrderNo" label="订单号" width="160" show-overflow-tooltip />
        <el-table-column prop="receivedAt" label="已收" width="160" />
        <el-table-column prop="usedAt" label="已使用" width="160" />
      </el-table>
      <el-pagination
        v-model:current-page="recordsPage"
        v-model:page-size="recordsPageSize"
        :total="recordsTotal"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @change="fetchRecords"
      />
      <template #footer>
        <el-button @click="recordsVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { couponApi, type IAdminCoupon, type ICouponRecord } from '@/api/coupon'
import {
  COUPON_STATUS_OPTIONS,
  COUPON_TYPE_OPTIONS,
  getLabelByValue,
  getColorByValue,
} from '@/constants/dict'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'AdminCouponView' })

const loading = ref(false)
const tableData = ref<IAdminCoupon[]>([])
const total = ref(0)

const formVisible = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<number | null>(null)
const submitLoading = ref(false)

const recordsVisible = ref(false)
const recordsLoading = ref(false)
const viewingCouponId = ref<number | null>(null)
const recordsData = ref<ICouponRecord[]>([])
const recordsTotal = ref(0)
const recordsPage = ref(1)
const recordsPageSize = ref(10)

const searchForm = reactive({
  keyword: '',
  type: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const defaultForm = () => ({
  name: '',
  code: '',
  type: 'FIXED_AMOUNT',
  amount: 0,
  discountRate: 0,
  minSpend: 0,
  totalQuantity: 100,
  perUserLimit: 1,
  startAt: '',
  endAt: '',
  status: 'ENABLE',
  translations: {
    ja: { name: '', description: '' },
    ko: { name: '', description: '' },
    en: { name: '', description: '' },
  },
})

const form = reactive(defaultForm())

const formRules: FormRules = {
  name: [{ required: true, message: 'Required', trigger: 'blur' }],
  code: [{ required: true, message: 'Required', trigger: 'blur' }],
  type: [{ required: true, message: 'Required', trigger: 'change' }],
  totalQuantity: [{ required: true, message: 'Required', trigger: 'blur' }],
  perUserLimit: [{ required: true, message: 'Required', trigger: 'blur' }],
  startAt: [{ required: true, message: 'Required', trigger: 'change' }],
  endAt: [{ required: true, message: 'Required', trigger: 'change' }],
}

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, unknown> = {
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    }
    if (searchForm.keyword) params.keyword = searchForm.keyword
    if (searchForm.type) params.type = searchForm.type
    if (searchForm.status) params.status = searchForm.status
    const { data: res } = await couponApi.getCoupons(params)
    if (res.code !== 200) return
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
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
  searchForm.type = ''
  searchForm.status = ''
  handleSearch()
}

function openCreate() {
  editingId.value = null
  Object.assign(form, defaultForm())
  formVisible.value = true
}

function openEdit(row: IAdminCoupon) {
  editingId.value = row.id
  const trans: any = {
    ja: { name: '', description: '' },
    ko: { name: '', description: '' },
    en: { name: '', description: '' },
  }
  if (row.translations) {
    for (const t of row.translations) {
      if (trans[t.languageCode]) {
        trans[t.languageCode] = { name: t.name, description: t.description }
      }
    }
  }
  Object.assign(form, {
    name: row.name,
    code: row.code,
    type: row.type,
    amount: row.amount,
    discountRate: row.discountRate,
    minSpend: row.minSpend,
    totalQuantity: row.totalQuantity,
    perUserLimit: row.perUserLimit,
    startAt: row.startAt,
    endAt: row.endAt,
    status: row.status,
    translations: trans,
  })
  formVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    const data = { ...form }
    if (data.type === 'FIXED_AMOUNT') data.discountRate = 0
    if (data.type === 'PERCENTAGE') data.amount = 0
    const res = editingId.value
      ? await couponApi.updateCoupon(editingId.value, data)
      : await couponApi.createCoupon(data)
    if (res.data.code !== 200) return
    ElMessage.success(editingId.value ? 'Coupon updated' : 'Coupon created')
    formVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

async function toggleStatus(row: IAdminCoupon) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  const { data: res } = await couponApi.updateCouponStatus(row.id, newStatus)
  if (res.code !== 200) return
  ElMessage.success('状态已更新')
  fetchData()
}

async function handleDelete(row: IAdminCoupon) {
  try {
    await ElMessageBox.confirm(`确定要删除优惠券“${row.name}”吗？`, '确认', { type: 'warning' })
  } catch {
    return
  }
  const { data: res } = await couponApi.deleteCoupon(row.id)
  if (res.code !== 200) return
  ElMessage.success('已删除')
  fetchData()
}

function openRecords(row: IAdminCoupon) {
  viewingCouponId.value = row.id
  recordsPage.value = 1
  recordsVisible.value = true
  fetchRecords()
}

async function fetchRecords() {
  if (!viewingCouponId.value) return
  recordsLoading.value = true
  try {
    const { data: res } = await couponApi.getRecords(viewingCouponId.value, {
      page: recordsPage.value,
      pageSize: recordsPageSize.value,
    })
    if (res.code !== 200) return
    recordsData.value = res.data?.list || []
    recordsTotal.value = res.data?.total || 0
  } finally {
    recordsLoading.value = false
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
.coupon-page {
  padding: 20px;
}
.search-bar {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
