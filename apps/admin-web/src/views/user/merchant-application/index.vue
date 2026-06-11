<template>
  <div class="merchant-application-page">
    <div class="page-toolbar">
      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item label="关键词">
          <el-input
            v-model="query.keyword"
            placeholder="邮箱 / 手机号 / 姓名"
            clearable
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 160px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="id" label="申请编号" width="180" />
      <el-table-column prop="fullName" label="姓名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="phone" label="手机号" min-width="140" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column label="证件类型" width="120">
        <template #default="{ row }">{{ documentTypeText(row.documentType) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="申请状态" width="110">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="申请时间" min-width="170" />
      <el-table-column prop="reviewedAt" label="审核时间" min-width="170" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">查看</el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="success"
            v-permission="'admin:merchantApplication:approve'"
            @click="openApprove(row)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === 'PENDING'"
            link
            type="danger"
            v-permission="'admin:merchantApplication:reject'"
            @click="openReject(row)"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>

    <el-drawer v-model="detailVisible" title="商家申请详情" size="560px">
      <el-descriptions v-if="detail" :column="1" border>
        <el-descriptions-item label="申请编号">{{ detail.id }}</el-descriptions-item>
        <el-descriptions-item label="申请状态">
          <el-tag :type="statusType(detail.status)">{{ statusText(detail.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detail.phone }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ detail.fullName }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ detail.age }}</el-descriptions-item>
        <el-descriptions-item label="家庭地址">{{ detail.homeAddress }}</el-descriptions-item>
        <el-descriptions-item label="证件类型">{{ documentTypeText(detail.documentType) }}</el-descriptions-item>
        <el-descriptions-item label="身份证正面照">
          <FileAction :file="detail.idCardFrontFile" @open="openFile" />
        </el-descriptions-item>
        <el-descriptions-item label="身份证反面照">
          <FileAction :file="detail.idCardBackFile" @open="openFile" />
        </el-descriptions-item>
        <el-descriptions-item label="护照首页">
          <FileAction :file="detail.passportFile" @open="openFile" />
        </el-descriptions-item>
        <el-descriptions-item label="驾驶证">
          <FileAction :file="detail.driverLicenseFile" @open="openFile" />
        </el-descriptions-item>
        <el-descriptions-item label="手持证件视频">
          <FileAction :file="detail.handheldVideoFile" @open="openFile" />
        </el-descriptions-item>
        <el-descriptions-item label="拒绝原因">{{ detail.reviewRemark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核人">{{ detail.reviewedBy || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ detail.reviewedAt || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="approveVisible" title="通过商家申请" width="520px">
      <el-form :model="approveForm" label-width="100px">
        <el-form-item label="店铺名称">
          <el-input v-model="approveForm.shopName" placeholder="默认使用申请人姓名" />
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="approveForm.reviewRemark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveVisible = false">取消</el-button>
        <el-button type="success" :loading="submitLoading" @click="handleApprove">确认通过</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, h, type PropType } from 'vue'
import { merchantApplicationApi } from '@/api/merchantApplication'

defineOptions({ name: 'MerchantApplicationView' })

type ApplicationFile = {
  accessUrl?: string
  originalName?: string
}

const FileAction = defineComponent({
  props: {
    file: Object as PropType<ApplicationFile | null>,
  },
  emits: ['open'],
  setup(props, { emit }) {
    return () => {
      if (!props.file?.accessUrl) return h('span', '-')
      return h(
        'button',
        {
          class: 'file-action',
          type: 'button',
          onClick: () => emit('open', props.file),
        },
        props.file.originalName || '查看文件',
      )
    }
  },
})

const query = reactive({
  keyword: '',
  status: '',
})
const tableData = ref<any[]>([])
const detail = ref<any>(null)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const detailVisible = ref(false)
const approveVisible = ref(false)
const submitLoading = ref(false)
const currentRow = ref<any>(null)
const approveForm = reactive({
  shopName: '',
  reviewRemark: '',
})

const statusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: '待审核',
    APPROVED: '已通过',
    REJECTED: '已拒绝',
  }
  return map[status] || status || '-'
}

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'
const statusType = (status: string): TagType => {
  const map: Record<string, TagType> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
  }
  return map[status] || 'info'
}

const documentTypeText = (type: string) => {
  const map: Record<string, string> = {
    id_card: '身份证',
    passport: '护照',
    driver_license: '驾驶证',
  }
  return map[type] || '-'
}

const fetchData = async () => {
  loading.value = true
  try {
    const { data: res } = await merchantApplicationApi.getApplications({
      ...query,
      page: page.value,
      pageSize: pageSize.value,
    })
    if (res.code === 200) {
      tableData.value = res.data?.list || []
      total.value = res.data?.total || 0
    }
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.keyword = ''
  query.status = ''
  page.value = 1
  fetchData()
}

const openDetail = async (row: any) => {
  const { data: res } = await merchantApplicationApi.getApplication(row.id)
  if (res.code === 200) {
    detail.value = res.data
    detailVisible.value = true
  }
}

const openFile = async (file: ApplicationFile) => {
  if (!file.accessUrl) return
  const { data } = await merchantApplicationApi.downloadFile(file.accessUrl)
  const blobUrl = URL.createObjectURL(data as Blob)
  window.open(blobUrl, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
}

const openApprove = (row: any) => {
  currentRow.value = row
  approveForm.shopName = row.fullName || ''
  approveForm.reviewRemark = ''
  approveVisible.value = true
}

const handleApprove = async () => {
  if (!currentRow.value) return
  try {
    await ElMessageBox.confirm('确认通过该商家申请吗？通过后会创建商家登录账号。', '审核确认', {
      confirmButtonText: '确认通过',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  submitLoading.value = true
  try {
    const { data: res } = await merchantApplicationApi.approveApplication(currentRow.value.id, {
      shopName: approveForm.shopName,
      reviewRemark: approveForm.reviewRemark,
    })
    if (res.code === 200) {
      ElMessage.success('商家申请已通过')
      approveVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } finally {
    submitLoading.value = false
  }
}

const openReject = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝商家申请', {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '拒绝原因',
      inputValidator: (val) => Boolean(val && val.trim()) || '拒绝原因不能为空',
    })
    await ElMessageBox.confirm('确认拒绝该商家申请吗？', '审核确认', {
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const { data: res } = await merchantApplicationApi.rejectApplication(row.id, {
      reviewRemark: value,
    })
    if (res.code === 200) {
      ElMessage.success('商家申请已拒绝')
      fetchData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch {
    /* canceled */
  }
}

onMounted(fetchData)
</script>

<style scoped>
.merchant-application-page {
  padding: 16px;
}

.page-toolbar {
  margin-bottom: 16px;
}

.query-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.file-action {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--el-color-primary);
  cursor: pointer;
  font: inherit;
}
</style>
