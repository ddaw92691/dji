<template>
  <div class="finance-overview">
    <div class="page-header">
      <h2>Finance Overview</h2>
      <el-tag :type="summary?.role === 'AGENT' ? 'warning' : 'primary'" size="large" effect="dark">
        {{ summary?.role || '-' }}
      </el-tag>
    </div>

    <el-row :gutter="20" class="card-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <BaseCard title="Balance" title-icon="HOutline:CurrencyDollarIcon">
          <div class="card-value">${{ (summary?.balance ?? 0).toFixed(2) }}</div>
        </BaseCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <BaseCard title="Frozen Balance" title-icon="HOutline:LockClosedIcon">
          <div class="card-value muted">${{ (summary?.frozenBalance ?? 0).toFixed(2) }}</div>
        </BaseCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <BaseCard
          :title="summary?.role === 'AGENT' ? 'Total Commission' : 'Total Sales'"
          title-icon="HOutline:ChartBarIcon"
        >
          <div class="card-value">
            ${{
              summary?.role === 'AGENT'
                ? (summary?.totalCommission ?? 0).toFixed(2)
                : (summary?.totalSales ?? 0).toFixed(2)
            }}
          </div>
        </BaseCard>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <BaseCard title="Total Withdrawn" title-icon="HOutline:BanknotesIcon">
          <div class="card-value success">${{ (summary?.totalWithdrawn ?? 0).toFixed(2) }}</div>
        </BaseCard>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="card-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <BaseCard title="Pending Withdrawal" title-icon="HOutline:ClockIcon">
          <div class="card-value warning">${{ (summary?.pendingWithdrawalAmount ?? 0).toFixed(2) }}</div>
        </BaseCard>
      </el-col>
      <el-col v-if="summary?.role === 'MERCHANT'" :xs="24" :sm="12" :lg="6">
        <BaseCard title="Completed Orders" title-icon="HOutline:CheckBadgeIcon">
          <div class="card-value">{{ summary?.completedOrders ?? 0 }}</div>
        </BaseCard>
      </el-col>
      <el-col v-if="summary?.role === 'MERCHANT'" :xs="24" :sm="12" :lg="6">
        <BaseCard title="Paid Orders" title-icon="HOutline:CreditCardIcon">
          <div class="card-value">{{ summary?.paidOrders ?? 0 }}</div>
        </BaseCard>
      </el-col>
      <el-col v-if="summary?.role === 'AGENT'" :xs="24" :sm="12" :lg="6">
        <BaseCard title="Settled Commissions" title-icon="HOutline:CheckCircleIcon">
          <div class="card-value success">{{ summary?.settledCommissions ?? 0 }}</div>
        </BaseCard>
      </el-col>
      <el-col v-if="summary?.role === 'AGENT'" :xs="24" :sm="12" :lg="6">
        <BaseCard title="Frozen Commissions" title-icon="HOutline:ExclamationCircleIcon">
          <div class="card-value muted">{{ summary?.frozenCommissions ?? 0 }}</div>
        </BaseCard>
      </el-col>
    </el-row>

    <div class="action-row">
      <el-button type="primary" @click="router.push('/finance/withdrawal')" v-permission="['finance:withdrawal']">
        Apply Withdrawal
      </el-button>
      <el-button @click="router.push('/finance/withdrawal-record')">
        Withdrawal Records
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { financeApi, type IFinanceSummary } from '@/api/finance'

defineOptions({ name: 'FinanceOverviewView' })

const router = useRouter()

const summary = ref<IFinanceSummary | null>(null)
const loading = ref(false)

const fetchSummary = async () => {
  loading.value = true
  try {
    const { data: res } = await financeApi.getSummary()
    if (res.code !== 200) return
    summary.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSummary()
})
</script>

<style scoped>
.finance-overview {
  padding: 0;
}
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.page-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.card-row {
  margin-bottom: 1.25rem;
}
.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
}
.card-value.muted {
  color: var(--el-text-color-secondary);
}
.card-value.success {
  color: var(--el-color-success);
}
.card-value.warning {
  color: var(--el-color-warning);
}
.action-row {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
