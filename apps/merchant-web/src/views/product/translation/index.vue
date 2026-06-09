<template>
  <div class="translation-page">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Product Translations</span>
          <el-button @click="router.push('/product/list')">Back to List</el-button>
        </div>
      </template>

      <el-form label-width="120px" style="max-width: 800px">
        <el-form-item label="Select Product">
          <el-select
            v-model="selectedProductId"
            placeholder="Select a product"
            filterable
            style="width: 100%"
            @change="handleProductChange"
          >
            <el-option
              v-for="p in products"
              :key="p.id"
              :label="`${p.title} (ID: ${p.id})`"
              :value="p.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-divider v-if="selectedProductId" />

      <div v-if="selectedProductId">
        <el-tabs v-model="translationTab">
          <el-tab-pane v-for="lang in translationLangs" :key="lang.code" :label="lang.label" :name="lang.code">
            <el-form label-width="140px" style="max-width: 700px">
              <el-form-item :label="`${lang.label} Title`" prop="title">
                <el-input
                  v-model="translations[lang.code].title"
                  placeholder="Enter title"
                />
              </el-form-item>
              <el-form-item :label="`${lang.label} Description`" prop="description">
                <el-input
                  v-model="translations[lang.code].description"
                  type="textarea"
                  :rows="4"
                  placeholder="Enter description"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="flex justify-center mt-6">
          <el-button type="primary" :loading="saving" @click="handleSave">Save Translations</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { productApi, type IProduct } from '@/api/product'

defineOptions({ name: 'ProductTranslationView' })

const router = useRouter()
const route = useRoute()

const products = ref<IProduct[]>([])
const selectedProductId = ref<number | undefined>(undefined)
const translationTab = ref('ja')
const saving = ref(false)

type TranslationCode = 'ja' | 'ko' | 'en'

type TranslationForm = Record<TranslationCode, { title: string; description: string }>

const translationLangs: { code: TranslationCode; label: string }[] = [
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
]

const translations = ref<TranslationForm>({
  ja: { title: '', description: '' },
  ko: { title: '', description: '' },
  en: { title: '', description: '' },
})

const loadProducts = async () => {
  const { data: res } = await productApi.getMyProducts({ page: 1, pageSize: 1000 })
  if (res.code !== 200) return
  products.value = res.data?.list || []

  const idFromQuery = route.query.id
  if (idFromQuery) {
    selectedProductId.value = Number(idFromQuery)
    handleProductChange(selectedProductId.value)
  }
}

const handleProductChange = (id: number | undefined) => {
  if (!id) {
    resetTranslations()
    return
  }
  const product = products.value.find((p) => p.id === id)
  if (!product) {
    resetTranslations()
    return
  }
  translations.value = {
    ja: product.translations?.find((t) => t.languageCode === 'ja') || { title: '', description: '' },
    ko: product.translations?.find((t) => t.languageCode === 'ko') || { title: '', description: '' },
    en: product.translations?.find((t) => t.languageCode === 'en') || { title: '', description: '' },
  }
}

const resetTranslations = () => {
  translations.value = {
    ja: { title: '', description: '' },
    ko: { title: '', description: '' },
    en: { title: '', description: '' },
  }
}

const handleSave = async () => {
  if (!selectedProductId.value) return
  saving.value = true
  try {
    const data = Object.entries(translations.value).map(([code, t]) => ({
      languageCode: code,
      title: t.title,
      description: t.description,
    }))
    const { data: res } = await productApi.saveTranslations(selectedProductId.value, data)
    if (res.code !== 200) return
    ElMessage.success('Translations saved')
    loadProducts()
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.translation-page {
  padding: 16px;
}
</style>
