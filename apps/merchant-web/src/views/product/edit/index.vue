<template>
  <div class="product-edit-page">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">{{ isEdit ? 'Edit Product' : 'Add Product' }}</span>
          <el-button @click="router.push('/product/list')">Back to List</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        label-width="140px"
        label-position="right"
        style="max-width: 800px"
      >
        <el-form-item label="Category" prop="categoryId" required>
          <el-select v-model="form.categoryId" placeholder="Select category" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Title" prop="title" required>
          <el-input v-model="form.title" placeholder="Enter product title" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="Enter product description"
          />
        </el-form-item>

        <el-form-item label="Cover Image" prop="coverImage">
          <div class="upload-wrap">
            <el-input v-model="form.coverImage" placeholder="Enter cover image URL" style="flex: 1" />
            <el-upload
              :show-file-list="false"
              :http-request="handleCoverUpload"
              accept="image/*"
            >
              <el-button :loading="uploading">Upload</el-button>
            </el-upload>
          </div>
          <el-image
            v-if="form.coverImage"
            :src="form.coverImage"
            style="width: 120px; height: 120px; margin-top: 8px; border-radius: 4px"
            fit="cover"
          />
        </el-form-item>

        <el-form-item label="Price" prop="price" required>
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Original Price" prop="originalPrice">
          <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>

        <el-form-item label="Stock" prop="stock" required>
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>

        <el-divider>Product Images</el-divider>

        <div v-for="(img, idx) in form.images" :key="idx" class="mb-2">
          <el-form-item :label="`Image ${idx + 1}`">
            <div class="flex items-center gap-2 w-full">
              <el-input v-model="img.imageUrl" placeholder="Enter image URL" class="flex-1" />
              <el-upload
                :show-file-list="false"
                :http-request="(options: any) => handleImageItemUpload(options, idx)"
                accept="image/*"
              >
                <el-button :loading="uploadingIdx === idx" size="small">Upload</el-button>
              </el-upload>
              <el-button type="danger" :icon="menuStore.iconComponents.Trash" circle @click="removeImage(idx)" />
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" :icon="menuStore.iconComponents.Plus" @click="addImage">Add Image</el-button>
        </el-form-item>

        <el-divider>Translations</el-divider>

        <el-tabs v-model="translationTab">
          <el-tab-pane v-for="lang in translationLangs" :key="lang.code" :label="lang.label" :name="lang.code">
            <el-form-item :label="`${lang.label} Title`">
              <el-input v-model="form.translations[lang.code].title" placeholder="Enter title" />
            </el-form-item>
            <el-form-item :label="`${lang.label} Description`">
              <el-input
                v-model="form.translations[lang.code].description"
                type="textarea"
                :rows="3"
                placeholder="Enter description"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <div class="flex justify-center mt-6">
        <el-button @click="router.push('/product/list')">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { productApi, type IProduct } from '@/api/product'
import { uploadApi } from '@/api/upload'

defineOptions({ name: 'ProductEditView' })

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const formRef = useTemplateRef('formRef')

const isEdit = computed(() => !!route.query.id)
const productId = computed(() => Number(route.query.id))
const saving = ref(false)
const uploading = ref(false)
const uploadingIdx = ref(-1)
const translationTab = ref('ja')
const categories = ref<{ id: number; name: string }[]>([])

type TranslationCode = 'ja' | 'ko' | 'en'

const translationLangs: { code: TranslationCode; label: string }[] = [
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
]

interface ImageItem {
  imageUrl: string
  sort: number
}

interface TranslationItem {
  title: string
  description: string
}

const form = ref<{
  categoryId: number | undefined
  title: string
  description: string
  coverImage: string
  price: number
  originalPrice: number
  stock: number
  images: ImageItem[]
  translations: Record<TranslationCode, TranslationItem>
}>({
  categoryId: undefined,
  title: '',
  description: '',
  coverImage: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  images: [],
  translations: {
    ja: { title: '', description: '' },
    ko: { title: '', description: '' },
    en: { title: '', description: '' },
  },
})

const addImage = () => {
  form.value.images.push({ imageUrl: '', sort: form.value.images.length + 1 })
}

const removeImage = (idx: number) => {
  form.value.images.splice(idx, 1)
}

const loadCategories = async () => {
  const { data: res } = await productApi.getCategories()
  if (res.code !== 200) return
  categories.value = res.data || []
}

const loadProduct = async () => {
  if (!isEdit.value) return
  const { data: res } = await productApi.getMyProducts({ id: productId.value, page: 1, pageSize: 1 })
  if (res.code !== 200 || !res.data?.list?.length) return
  const p = res.data.list[0]
  if (!p) return

  const getTranslation = (code: TranslationCode): TranslationItem => {
    const translation = p.translations?.find((t) => t.languageCode === code)
    return {
      title: translation?.title || '',
      description: translation?.description || '',
    }
  }

  form.value = {
    categoryId: p.categoryId,
    title: p.title,
    description: p.description,
    coverImage: p.coverImage,
    price: p.price,
    originalPrice: p.originalPrice,
    stock: p.stock,
    images: p.images?.map((img) => ({ imageUrl: img.imageUrl, sort: img.sort })) || [],
    translations: {
      ja: getTranslation('ja'),
      ko: getTranslation('ko'),
      en: getTranslation('en'),
    },
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      images: form.value.images.map((img, idx) => ({ imageUrl: img.imageUrl, sort: idx + 1 })),
      translations: Object.entries(form.value.translations).map(([code, t]) => ({
        languageCode: code,
        title: t.title,
        description: t.description,
      })),
    }
    const { data: res } = isEdit.value
      ? await productApi.updateProduct(productId.value, payload)
      : await productApi.createProduct(payload)
    if (res.code !== 200) return
    ElMessage.success(isEdit.value ? 'Product updated' : 'Product created')
    router.push('/product/list')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await loadProduct()
})

async function handleCoverUpload(options: any) {
  uploading.value = true
  try {
    const { data: res } = await uploadApi.postImage(options.file, 'product')
    if (res.code === 200) {
      form.value.coverImage = res.data?.url || res.data
      ElMessage.success('Uploaded')
    } else {
      ElMessage.error(res.message || 'Upload failed')
    }
  } catch {
    ElMessage.error('Upload failed')
  } finally {
    uploading.value = false
  }
}

async function handleImageItemUpload(options: any, idx: number) {
  uploadingIdx.value = idx
  try {
    const { data: res } = await uploadApi.postImage(options.file, 'product')
    if (res.code === 200) {
      const image = form.value.images[idx]
      if (!image) return
      image.imageUrl = res.data?.url || res.data
      ElMessage.success('Uploaded')
    } else {
      ElMessage.error(res.message || 'Upload failed')
    }
  } catch {
    ElMessage.error('Upload failed')
  } finally {
    uploadingIdx.value = -1
  }
}
</script>

<style scoped>
.product-edit-page {
  padding: 16px;
}
.upload-wrap { display: flex; gap: 8px; width: 100%; }
</style>
