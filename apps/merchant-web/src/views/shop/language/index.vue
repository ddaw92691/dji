<template>
  <div>
    <BasePage
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
        <h2>Shop Language</h2>
      </template>
    </BasePage>

    <BaseCard class="language-card">
      <el-form :model="form" label-width="140px">
        <el-form-item label="Country">
          <el-select v-model="form.countryCode" placeholder="Select country">
            <el-option
              v-for="country in countryOptions"
              :key="country.code"
              :label="country.label"
              :value="country.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Language">
          <el-select v-model="form.languageCode" placeholder="Select language">
            <el-option
              v-for="language in languageOptions"
              :key="language.code"
              :label="language.label"
              :value="language.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">Save</el-button>
        </el-form-item>
      </el-form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { STORAGE_KEYS, storage } from '@/utils/storage'

defineOptions({ name: 'ShopLanguageView' })

const countryOptions = [
  { code: 'JP', label: 'Japan', defaultLanguage: 'ja' },
  { code: 'KR', label: 'South Korea', defaultLanguage: 'ko' },
  { code: 'US', label: 'United States', defaultLanguage: 'en' },
]

const languagesByCountry: Record<string, Array<{ code: string; label: string }>> = {
  JP: [
    { code: 'ja', label: 'Japanese' },
    { code: 'en', label: 'English' },
  ],
  KR: [
    { code: 'ko', label: 'Korean' },
    { code: 'en', label: 'English' },
  ],
  US: [
    { code: 'en', label: 'English' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
  ],
}

const form = reactive({
  countryCode: storage.get<string>(STORAGE_KEYS.COUNTRY_CODE) || 'JP',
  languageCode: storage.get<string>(STORAGE_KEYS.LANGUAGE_CODE) || 'ja',
})

const getLanguageOptions = (countryCode: string) => languagesByCountry[countryCode] ?? languagesByCountry.JP ?? []

const languageOptions = computed(() => getLanguageOptions(form.countryCode))

watch(
  () => form.countryCode,
  (countryCode) => {
    if (!getLanguageOptions(countryCode).some((item) => item.code === form.languageCode)) {
      form.languageCode = countryOptions.find((item) => item.code === countryCode)?.defaultLanguage || 'en'
    }
  },
)

const handleSave = () => {
  storage.set(STORAGE_KEYS.COUNTRY_CODE, form.countryCode)
  storage.set(STORAGE_KEYS.LANGUAGE_CODE, form.languageCode)
  ElMessage.success('Language settings saved')
}
</script>

<style scoped>
.language-card {
  max-width: 560px;
  margin: 16px 0;
}
</style>
