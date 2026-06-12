<template>
  <div class="reconciliation-page">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="账本校验" name="ledger">
        <div class="toolbar">
          <el-form :inline="true" :model="ledgerQuery">
            <el-form-item label="对账日期">
              <el-date-picker
                v-model="ledgerQuery.date"
                type="date"
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 160px"
              />
            </el-form-item>
            <el-form-item label="商家ID">
              <el-input v-model="ledgerQuery.merchantId" placeholder="商家ID" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="ledgerQuery.status" placeholder="全部" clearable style="width: 140px">
                <el-option label="正常" value="OK" />
                <el-option label="异常" value="MISMATCH" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLedgerSearch">查询</el-button>
              <el-button :loading="running" @click="runReconciliation">重跑对账</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <span>对账商家</span>
            <strong>{{ summary.total }}</strong>
          </div>
          <div class="summary-item ok">
            <span>正常</span>
            <strong>{{ summary.ok }}</strong>
          </div>
          <div class="summary-item danger">
            <span>异常</span>
            <strong>{{ summary.mismatch }}</strong>
          </div>
        </div>

        <el-table v-loading="ledgerLoading" :data="ledgerRows" border stripe>
          <el-table-column prop="reconcileDate" label="日期" width="110" />
          <el-table-column prop="merchantId" label="商家ID" width="110" />
          <el-table-column prop="shopName" label="店铺" min-width="150" show-overflow-tooltip />
          <el-table-column label="合计账本" min-width="260">
            <template #default="{ row }">
              <div class="formula">
                {{ money(row.openingTotalBalance) }} + {{ money(row.totalInflowAmount) }} -
                {{ money(row.totalOutflowAmount) }} = {{ money(row.expectedClosingTotal) }}
              </div>
              <div class="subtle">流水期末 {{ money(row.ledgerClosingTotal) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="当前余额" min-width="180">
            <template #default="{ row }">
              <div>{{ money(row.actualTotalBalance) }}</div>
              <div class="subtle">可用 {{ money(row.actualBalance) }} / 冻结 {{ money(row.actualFrozenBalance) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="差异" width="130" align="right">
            <template #default="{ row }">
              <span :class="{ dangerText: Number(row.totalDifference) !== 0 }">
                {{ money(row.totalDifference) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="流水数" prop="logCount" width="90" align="center" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'OK' ? 'success' : 'danger'">
                {{ row.status === 'OK' ? '正常' : '异常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="问题" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">{{ row.issueSummary || '-' }}</template>
          </el-table-column>
          <el-table-column prop="checkedAt" label="检查时间" width="170" />
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            v-model:current-page="ledgerPage"
            v-model:page-size="ledgerPageSize"
            :total="ledgerTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchLedger"
            @current-change="fetchLedger"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="流水明细" name="logs">
        <div class="toolbar">
          <el-form :inline="true" :model="logQuery">
            <el-form-item label="商家ID">
              <el-input v-model="logQuery.merchantId" placeholder="商家ID" clearable style="width: 140px" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="logQuery.type" placeholder="全部" clearable style="width: 180px">
                <el-option v-for="(label, val) in TYPE_LABELS" :key="val" :label="label" :value="val" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="logQuery.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table v-loading="logLoading" :data="logRows" border stripe>
          <el-table-column prop="createdAt" label="时间" min-width="170" />
          <el-table-column prop="merchantId" label="商家ID" width="100" />
          <el-table-column prop="shopName" label="店铺" min-width="140" />
          <el-table-column label="类型" width="140">
            <template #default="{ row }">
              <el-tag>{{ typeText(row.type) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="130" align="right">
            <template #default="{ row }">{{ money(row.amount) }}</template>
          </el-table-column>
          <el-table-column prop="balanceBefore" label="可用变动前" width="120" align="right" />
          <el-table-column prop="balanceAfter" label="可用变动后" width="120" align="right" />
          <el-table-column label="关联" min-width="140">
            <template #default="{ row }">
              <span v-if="row.refType">{{ row.refType }}<span v-if="row.refId"> #{{ row.refId }}</span></span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            v-model:current-page="logPage"
            v-model:page-size="logPageSize"
            :total="logTotal"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchLogs"
            @current-change="fetchLogs"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { financeApi, type IMerchantFundReconciliation, type IReconciliationSummary } from '@/api/finance'

defineOptions({ name: 'ReconciliationView' })

const TYPE_LABELS: Record<string, string> = {
  merchant_recharge: '充值入账',
  withdraw_freeze: '提现冻结',
  withdraw: '提现出账',
  withdraw_reject: '提现退回',
  purchase_payment: '商家垫付',
  order_settlement: '订单结算',
  ADJUST_INCREASE: '后台增加',
  ADJUST_DECREASE: '后台扣减',
  RECHARGE: '充值入账',
  ORDER_PAY: '支付货款',
  SETTLE: '货款结算',
  WITHDRAW: '提现',
}

const yesterday = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

const activeTab = ref('ledger')
const running = ref(false)
const ledgerLoading = ref(false)
const logLoading = ref(false)

const ledgerQuery = reactive({ date: yesterday(), merchantId: '', status: '' })
const logQuery = reactive<{ merchantId: string; type: string; dateRange: [string, string] | null }>({
  merchantId: '',
  type: '',
  dateRange: null,
})

const summary = reactive<IReconciliationSummary>({ total: 0, ok: 0, mismatch: 0 })
const ledgerRows = ref<IMerchantFundReconciliation[]>([])
const ledgerPage = ref(1)
const ledgerPageSize = ref(20)
const ledgerTotal = ref(0)

const logRows = ref<any[]>([])
const logPage = ref(1)
const logPageSize = ref(20)
const logTotal = ref(0)

const money = (value: unknown) =>
  Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const typeText = (type: string) => TYPE_LABELS[type] || type || '-'

const ledgerParams = () => {
  const params: Record<string, unknown> = {
    date: ledgerQuery.date,
    page: ledgerPage.value,
    pageSize: ledgerPageSize.value,
  }
  if (ledgerQuery.merchantId) params.merchantId = ledgerQuery.merchantId
  if (ledgerQuery.status) params.status = ledgerQuery.status
  return params
}

const fetchSummary = async () => {
  const { data: res } = await financeApi.getReconciliationSummary({ date: ledgerQuery.date })
  if (res.code === 200 && res.data) Object.assign(summary, res.data)
}

const fetchLedger = async () => {
  ledgerLoading.value = true
  try {
    const { data: res } = await financeApi.getReconciliations(ledgerParams())
    if (res.code === 200) {
      ledgerRows.value = res.data?.list || []
      ledgerTotal.value = res.data?.total || 0
    }
    await fetchSummary()
  } finally {
    ledgerLoading.value = false
  }
}

const fetchLogs = async () => {
  logLoading.value = true
  try {
    const params: Record<string, unknown> = { page: logPage.value, pageSize: logPageSize.value }
    if (logQuery.merchantId) params.merchantId = logQuery.merchantId
    if (logQuery.type) params.type = logQuery.type
    if (logQuery.dateRange) {
      params.startDate = logQuery.dateRange[0]
      params.endDate = logQuery.dateRange[1]
    }
    const { data: res } = await financeApi.getFundLogs(params)
    if (res.code === 200) {
      logRows.value = res.data?.list || []
      logTotal.value = res.data?.total || 0
    }
  } finally {
    logLoading.value = false
  }
}

const handleLedgerSearch = () => {
  ledgerPage.value = 1
  fetchLedger()
}

const handleLogSearch = () => {
  logPage.value = 1
  fetchLogs()
}

const runReconciliation = async () => {
  running.value = true
  try {
    const { data: res } = await financeApi.runReconciliation({ date: ledgerQuery.date })
    if (res.code === 200) {
      ElMessage.success(`对账完成：异常 ${res.data?.mismatch ?? 0} 个`)
      await fetchLedger()
    }
  } finally {
    running.value = false
  }
}

const handleTabChange = () => {
  if (activeTab.value === 'ledger') fetchLedger()
  if (activeTab.value === 'logs' && logRows.value.length === 0) fetchLogs()
}

onMounted(fetchLedger)
</script>

<style scoped>
.reconciliation-page {
  padding: 20px;
}
.toolbar {
  margin-bottom: 16px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.summary-item {
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  padding: 12px 14px;
  background: var(--el-bg-color);
}
.summary-item span {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
.summary-item strong {
  display: block;
  margin-top: 6px;
  font-size: 24px;
  color: var(--el-text-color-primary);
}
.summary-item.ok strong {
  color: var(--el-color-success);
}
.summary-item.danger strong,
.dangerText {
  color: var(--el-color-danger);
}
.formula {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
}
.subtle {
  margin-top: 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
@media (max-width: 720px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
