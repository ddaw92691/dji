<template>
  <div class="product-edit-page">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">{{ isEdit ? (isPlatformListing ? '编辑平台商品库存' : '编辑商家自建商品') : '新增商家自建商品' }}</span>
          <el-button @click="router.push('/product/list')">返回列表</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        label-width="140px"
        label-position="right"
        style="max-width: 800px"
      >
        <el-form-item label="分类" prop="categoryId" required>
          <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%" :disabled="isPlatformListing">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入商品名称" :disabled="isPlatformListing" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            :disabled="isPlatformListing"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-form-item label="封面图" prop="coverImage">
          <div class="upload-wrap">
            <el-input v-model="form.coverImage" placeholder="请输入封面图 URL" style="flex: 1" :disabled="isPlatformListing" />
            <el-upload
              v-if="!isPlatformListing"
              :show-file-list="false"
              :http-request="handleCoverUpload"
              accept="image/*"
            >
              <el-button :loading="uploading">上传</el-button>
            </el-upload>
          </div>
          <el-image
            v-if="form.coverImage"
            :src="form.coverImage"
            style="width: 120px; height: 120px; margin-top: 8px; border-radius: 4px"
            fit="cover"
          />
        </el-form-item>

        <el-form-item label="售价" prop="price" required>
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" :disabled="isPlatformListing" />
        </el-form-item>

        <el-form-item label="原价" prop="originalPrice">
          <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width: 100%" :disabled="isPlatformListing" />
        </el-form-item>

        <el-form-item label="库存" prop="stock" required>
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>

        <template v-if="!isPlatformListing">
        <el-divider>商品图片</el-divider>

        <div v-for="(img, idx) in form.images" :key="idx" class="mb-2">
          <el-form-item :label="`图片 ${idx + 1}`">
            <div class="flex items-center gap-2 w-full">
              <el-input v-model="img.imageUrl" placeholder="请输入图片 URL" class="flex-1" />
              <el-upload
                :show-file-list="false"
                :http-request="(options: any) => handleImageItemUpload(options, idx)"
                accept="image/*"
              >
                <el-button :loading="uploadingIdx === idx" size="small">上传</el-button>
              </el-upload>
              <el-button type="danger" :icon="menuStore.iconComponents.Trash" circle @click="removeImage(idx)" />
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" :icon="menuStore.iconComponents.Plus" @click="addImage">添加图片</el-button>
        </el-form-item>

        </template>

        <template v-if="!isPlatformListing">
        <el-divider>多语言</el-divider>

        <el-tabs v-model="translationTab">
          <el-tab-pane v-for="lang in translationLangs" :key="lang.code" :label="lang.label" :name="lang.code">
            <el-form-item :label="`${lang.label} 商品名称`">
              <el-input v-model="form.translations[lang.code].title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item :label="`${lang.label} 商品描述`">
              <el-input
                v-model="form.translations[lang.code].description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        </template>
      </el-form>

      <el-alert
        v-if="isPlatformListing"
        title="该商品来自平台商品库，商家只能维护库存；名称、价格、图片和翻译由总后台商品库统一维护。"
        type="info"
        show-icon
        :closable="false"
        class="mt-4"
      />

      <div class="flex justify-center mt-6">
        <el-button @click="router.push('/product/list')">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { productApi } from '@/api/product'
import { uploadApi } from '@/api/upload'

defineOptions({ name: 'ProductEditView' })

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const formRef = useTemplateRef('formRef')

const isEdit = computed(() => !!route.query.id)
const productId = computed(() => Number(route.query.id))
const isPlatformListing = computed(() => !!form.value.platformProductId)
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
  platformProductId?: number | null
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
  platformProductId: null,
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
  const { data: res } = await productApi.getProduct(productId.value)
  if (res.code !== 200 || !res.data) return
  const p = res.data

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
    stock: p.merchantStock ?? p.stock,
    platformProductId: p.platformProductId || null,
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
    const payload = isPlatformListing.value
      ? { stock: form.value.stock }
      : {
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
    ElMessage.success(isEdit.value ? '商品已更新' : '商品已创建')
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
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch {
    ElMessage.error('上传失败')
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
      ElMessage.success('上传成功')
    } else {
      ElMessage.error(res.message || '上传失败')
    }
  } catch {
    ElMessage.error('上传失败')
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
