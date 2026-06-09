<template>
  <div>
    <BasePage
      ref="basePageRef"
      :formConfig="[]"
      :table-data="[]"
      :columns="[]"
      :show-pagination="false"
      :show-export="false"
      :show-print="false"
      :show-search-toggle="false"
      :show-refresh="false"
    >
      <template #tableOperationLeft>
        <h2>Agent Invite</h2>
      </template>
    </BasePage>

    <div v-if="isMerchant" class="empty-notice">
      <el-alert title="Invite features are only available for agent accounts." type="info" show-icon :closable="false" />
    </div>

    <BaseCard v-else class="invite-card" :loading="loading">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="invite-code-section">
            <p class="label">Your Invite Code</p>
            <div class="code-display">
              <span class="code-text">{{ inviteData.inviteCode || '-' }}</span>
              <el-button type="primary" size="small" @click="copyCode" v-if="inviteData.inviteCode">
                Copy
              </el-button>
            </div>
          </div>
          <div class="invite-link-section" v-if="inviteData.inviteLink">
            <p class="label">Invite Link</p>
            <div class="link-display">
              <span class="link-text">{{ inviteData.inviteLink }}</span>
              <el-button type="primary" size="small" @click="copyLink">Copy</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-statistic title="Invited Customers" :value="inviteData.invitedCustomerCount ?? 0" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="Total Commission" :value="inviteData.totalCommission ?? 0" prefix="$" />
            </el-col>
            <el-col :span="12" style="margin-top:16px">
              <el-statistic title="Balance" :value="inviteData.balance ?? 0" prefix="$" />
            </el-col>
            <el-col :span="12" style="margin-top:16px">
              <el-statistic title="Frozen Balance" :value="inviteData.frozenBalance ?? 0" prefix="$" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { agentApi } from '@/api/agentInvite'

defineOptions({ name: 'AgentInviteView' })

const loading = ref(true)
const isMerchant = ref(false)

const inviteData = reactive({
  inviteCode: '',
  inviteLink: '',
  invitedCustomerCount: 0,
  totalCommission: 0,
  balance: 0,
  frozenBalance: 0,
})

const fetchData = async () => {
  loading.value = true
  try {
    const { data: res } = await agentApi.getInvite()
    if (res.code === 200) {
      const d = res.data
      if (d.userType === 'MERCHANT' || d.role === 'MERCHANT') {
        isMerchant.value = true
      } else {
        isMerchant.value = false
        inviteData.inviteCode = d.inviteCode || ''
        inviteData.inviteLink = d.inviteLink || ''
        inviteData.invitedCustomerCount = d.invitedCustomerCount ?? 0
        inviteData.totalCommission = d.totalCommission ?? 0
        inviteData.balance = d.balance ?? 0
        inviteData.frozenBalance = d.frozenBalance ?? 0
      }
    }
  } catch {
    isMerchant.value = false
  } finally { loading.value = false }
}

const copyCode = () => {
  if (inviteData.inviteCode) {
    navigator.clipboard.writeText(inviteData.inviteCode)
    ElMessage.success('Invite code copied')
  }
}

const copyLink = () => {
  if (inviteData.inviteLink) {
    navigator.clipboard.writeText(inviteData.inviteLink)
    ElMessage.success('Invite link copied')
  }
}

onMounted(() => { fetchData() })
</script>

<style scoped>
.invite-card { max-width: 800px; margin: 16px 0; }
.empty-notice { padding: 20px 0; }
.label { font-size: 14px; color: #909399; margin-bottom: 8px; }
.code-display, .link-display { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.code-text { font-size: 28px; font-weight: 700; letter-spacing: 4px; font-family: monospace; }
.link-text { font-size: 14px; color: #409eff; word-break: break-all; flex: 1; }
</style>
