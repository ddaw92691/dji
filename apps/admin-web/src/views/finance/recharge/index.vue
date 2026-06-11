<template>
  <div class="recharge-page">
    <div class="page-toolbar">
      <el-form :inline="true" :model="query" class="query-form">
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width: 160px">
            <el-option label="待审核" value="PENDING" />
            <el-option label="已入账" value="PAID" />
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
      <el-table-column prop="rechargeNo" label="充值单号" min-width="180" />
      <el-table-column prop="shopName" label="店铺" min-width="140" />
      <el-table-column prop="amount" label="金额" width="120" />
      <el-table-column prop="currency" label="币种" width="80" />
      <el-table-column prop="method" label="方式" width="110" />
      <el-table-column label="凭证" width="90">
        <template #default="{ row }">
          <el-button v-if="row.proofUrl" link type="primary" @click="previewProof(row.proofUrl)">查看</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="140" />
      <el-table-column prop="createdAt" label="提交时间" min-width="170" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <template v-if="row.status === 'PENDING'">
            <el-button
              link
              type="success"
              v-permission="'finance:recharge:approve'"
              @click="handleApprove(row)"
              >通过</el-button
            >
            <el-button
              link
              type="danger"
              v-permission="'finance:recharge:reject'"
              @click="handleReject(row)"
              >拒绝</el-button
            >
          </template>
          <span v-else>-</span>
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

    <el-image-viewer v-if="viewerUrl" :url-list="[viewerUrl]" @close="viewerUrl = ''" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { rechargeApi } from '@/api/recharge'

defineOptions({ name: 'RechargeView' })

const query = reactive({ status: '' })
const tableData = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const viewerUrl = ref('')

const statusText = (status: string) => {
  const map: Record<string, string> = { PENDING: '待审核', PAID: '已入账', REJECTED: '已拒绝' }
  return map[status] || status || '-'
}

type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'
const statusType = (status: string): TagType => {
  const map: Record<string, TagType> = { PENDING: 'warning', PAID: 'success', REJECTED: 'danger' }
  return map[status] || 'info'
}

const previewProof = (url: string) => {
  viewerUrl.value = url
}

const fetchData = async () => {
  loading.value = true
  try {
    const { data: res } = await rechargeApi.getRecharges({
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
  query.status = ''
  page.value = 1
  fetchData()
}

const handleApprove = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确认通过充值单 ${row.rechargeNo}？金额 ${row.amount} 将入账到该商家余额。`,
      '通过充值',
      { confirmButtonText: '确认通过', cancelButtonText: '取消', type: 'warning' },
    )
    const { data: res } = await rechargeApi.approveRecharge(row.id)
    if (res.code === 200) {
      ElMessage.success('充值已入账')
      fetchData()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch {
    /* canceled */
  }
}

const handleReject = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝充值', {
      confirmButtonText: '确认拒绝',
      cancelButtonText: '取消',
      inputType: 'textarea',
      inputPlaceholder: '拒绝原因',
    })
    const { data: res } = await rechargeApi.rejectRecharge(row.id, value)
    if (res.code === 200) {
      ElMessage.success('已拒绝')
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
.recharge-page {
  padding: 16px;
}
.page-toolbar {
  margin-bottom: 16px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
