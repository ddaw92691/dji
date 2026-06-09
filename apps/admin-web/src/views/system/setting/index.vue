<template>
  <div class="setting-page">
    <div class="page-header">
      <h2>System Settings</h2>
      <div class="header-actions">
        <el-button :loading="loading" @click="fetchData">Refresh</el-button>
        <el-button type="primary" :loading="saving" @click="handleSaveAll">Save All</el-button>
      </div>
    </div>

    <el-card v-for="(group, gName) in groupedSettings" :key="gName" class="group-card" shadow="hover">
      <template #header>
        <span class="group-title">{{ gName }}</span>
      </template>

      <el-table :data="group" border stripe size="small">
        <el-table-column prop="settingKey" label="Key" min-width="180" show-overflow-tooltip />
        <el-table-column label="Value" min-width="200">
          <template #default="{ row }">
            <el-input
              v-model="editValues[row.settingKey]"
              size="small"
              placeholder="Enter value"
              @change="(v: string) => handleFieldChange(row.settingKey, v)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Description" min-width="180" show-overflow-tooltip />
        <el-table-column label="Actions" width="100" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleSaveSingle(row)">Save</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { settingApi, type SettingItem } from '@/api/setting'

defineOptions({ name: 'SystemSettingView' })

const loading = ref(false)
const saving = ref(false)
const settings = ref<SettingItem[]>([])
const editValues = reactive<Record<string, string>>({})
const changedKeys = reactive<Set<string>>(new Set())

const GROUPS: Record<string, string> = {
  default_commission_rate: 'Finance',
  min_merchant_withdrawal_amount: 'Finance',
  min_agent_withdrawal_amount: 'Finance',
  upload_max_file_size_mb: 'Upload',
  upload_allowed_image_types: 'Upload',
  platform_name: 'Platform',
  platform_support_email: 'Platform',
  review_auto_visible: 'Review',
  export_max_rows: 'Export',
}

const groupedSettings = computed(() => {
  const groups: Record<string, SettingItem[]> = {}
  for (const setting of settings.value) {
    const group = GROUPS[setting.settingKey] || setting.groupName || 'Other'
    if (!groups[group]) groups[group] = []
    groups[group].push(setting)
  }
  return groups
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await settingApi.getSettings({ page: 1, pageSize: 999 })
    if (res.code === 200) {
      settings.value = res.data.list || []
      settings.value.forEach((s) => {
        editValues[s.settingKey] = s.settingValue
      })
      changedKeys.clear()
    } else {
      ElMessage.error(res.message || 'Failed to fetch settings')
    }
  } catch {
    ElMessage.error('Failed to fetch settings')
  } finally {
    loading.value = false
  }
}

function handleFieldChange(key: string, _value?: string) {
  changedKeys.add(key)
}

async function handleSaveSingle(row: SettingItem) {
  saving.value = true
  try {
    const { data: res } = await settingApi.updateSetting(
      row.settingKey,
      editValues[row.settingKey] ?? '',
      row.description
    )
    if (res.code === 200) {
      ElMessage.success('Saved successfully')
      changedKeys.delete(row.settingKey)
    } else {
      ElMessage.error(res.message || 'Save failed')
    }
  } catch {
    ElMessage.error('Save failed')
  } finally {
    saving.value = false
  }
}

async function handleSaveAll() {
  if (changedKeys.size === 0) {
    ElMessage.info('No changes to save')
    return
  }
  saving.value = true
  try {
    const batchSettings = Array.from(changedKeys).map((key) => ({
      key,
      value: editValues[key] ?? '',
    }))
    const { data: res } = await settingApi.batchUpdateSettings(batchSettings)
    if (res.code === 200) {
      ElMessage.success('All settings saved')
      changedKeys.clear()
    } else {
      ElMessage.error(res.message || 'Save failed')
    }
  } catch {
    ElMessage.error('Save failed')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.setting-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { margin: 0; font-size: 20px; }
.header-actions { display: flex; gap: 8px; }
.group-card { margin-bottom: 16px; }
.group-title { font-weight: 600; font-size: 15px; }
</style>
