<template>
  <div class="fund-log-page">
    <BaseCard title="资金流水" title-icon="HOutline:ListBulletIcon">
      <div class="balance-bar">
        <span class="label">可用余额：</span>
        <span class="value">{{ (balance ?? 0).toFixed(2) }}</span>
        <span class="label" style="margin-left: 24px">冻结余额：</span>
        <span class="value">{{ (frozenBalance ?? 0).toFixed(2) }}</span>
      </div>

      <el-table :data="records" border v-loading="loading">
        <el-table-column prop="createdAt" label="时间" min-width="170" />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="typeTag(row.type)">{{ typeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130">
          <template #default="{ row }">
            <span :style="{ color: isIncrease(row.type) ? 'var(--el-color-success)' : 'var(--el-color-danger)' }">
              {{ isIncrease(row.type) ? '+' : '-' }}{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balanceAfter" label="变动后余额" width="130" />
        <el-table-column prop="remark" label="备注" min-width="180" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="loadData"
        />
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { financeApi } from '@/api/finance'

defineOptions({ name: 'FundLogView' })

const loading = ref(false)
const records = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const balance = ref(0)
const frozenBalance = ref(0)

const TYPE_LABELS: Record<string, string> = {
  ADJUST_INCREASE: '后台增加',
  ADJUST_DECREASE: '后台扣减',
  RECHARGE: '充值入账',
  ORDER_PAY: '支付货款',
  SETTLE: '货款结算',
  WITHDRAW: '提现',
}
const INCREASE_TYPES = ['ADJUST_INCREASE', 'RECHARGE', 'SETTLE']

const typeText = (t: string) => TYPE_LABELS[t] || t || '-'
const isIncrease = (t: string) => INCREASE_TYPES.includes(t)
type TagType = 'success' | 'primary' | 'warning' | 'info' | 'danger'
const typeTag = (t: string): TagType => (isIncrease(t) ? 'success' : 'warning')

const loadData = async () => {
  loading.value = true
  try {
    const { data: res } = await financeApi.getFundLogs({ page: page.value, pageSize: pageSize.value })
    if (res.code === 200) {
      records.value = res.data?.list || []
      total.value = res.data?.total || 0
      balance.value = res.data?.balance ?? 0
      frozenBalance.value = res.data?.frozenBalance ?? 0
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.fund-log-page {
  padding: 16px;
}
.balance-bar {
  margin-bottom: 16px;
  font-size: 15px;
}
.balance-bar .value {
  font-weight: 600;
  color: var(--el-color-primary);
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
