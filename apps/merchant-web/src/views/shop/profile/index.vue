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
        <h2>Shop Profile</h2>
      </template>
    </BasePage>

    <div v-if="isAgent" class="empty-notice">
      <el-alert title="Agent accounts do not have shop profiles." type="info" show-icon :closable="false" />
    </div>

    <BaseCard v-else class="profile-card" :loading="loading">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" v-loading="loading">
        <el-form-item label="Shop Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter shop name" />
        </el-form-item>
        <el-form-item label="Logo">
          <div class="upload-wrap">
            <el-input v-model="form.logo" placeholder="https://example.com/logo.png" style="flex: 1" />
            <el-upload
              :show-file-list="false"
              :http-request="handleLogoUpload"
              accept="image/*"
            >
              <el-button :loading="uploading">Upload</el-button>
            </el-upload>
          </div>
          <el-image v-if="form.logo" :src="form.logo" style="width:80px;height:80px;margin-top:8px;border-radius:4px" fit="cover" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="4" placeholder="Describe your shop..." />
        </el-form-item>
        <el-form-item label="Contact Name">
          <el-input v-model="form.contactName" placeholder="Contact person name" />
        </el-form-item>
        <el-form-item label="Contact Phone">
          <el-input v-model="form.contactPhone" placeholder="Contact phone number" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saveLoading" @click="handleSave">Save</el-button>
        </el-form-item>
      </el-form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { shopApi } from '@/api/shop'
import { uploadApi } from '@/api/upload'
import type { FormInstance, FormRules } from 'element-plus'

defineOptions({ name: 'ShopProfileView' })

const formRef = useTemplateRef<FormInstance>('formRef')

const loading = ref(true)
const saveLoading = ref(false)
const uploading = ref(false)
const isAgent = ref(false)

const form = reactive({
  name: '',
  logo: '',
  description: '',
  contactName: '',
  contactPhone: '',
})

const formRules: FormRules = {
  name: [{ required: true, message: 'Shop name is required', trigger: 'blur' }],
}

const fetchProfile = async () => {
  loading.value = true
  try {
    const { data: res } = await shopApi.getProfile()
    if (res.code === 200) {
      const d = res.data
      if (d.userType === 'AGENT' || d.role === 'AGENT') {
        isAgent.value = true
      } else {
        isAgent.value = false
        form.name = d.name || d.shopName || ''
        form.logo = d.logo || d.logoUrl || ''
        form.description = d.description || ''
        form.contactName = d.contactName || ''
        form.contactPhone = d.contactPhone || ''
      }
    }
  } catch {
    isAgent.value = false
  } finally { loading.value = false }
}

const handleSave = async () => {
  await formRef.value?.validate()
  saveLoading.value = true
  try {
    const { data: res } = await shopApi.updateProfile({
      name: form.name, logo: form.logo, description: form.description,
      contactName: form.contactName, contactPhone: form.contactPhone,
    })
    if (res.code === 200) { ElMessage.success('Profile updated') }
    else { ElMessage.error(res.message || 'Update failed') }
  } catch { ElMessage.error('Update failed') } finally { saveLoading.value = false }
}

onMounted(() => { fetchProfile() })

async function handleLogoUpload(options: any) {
  uploading.value = true
  try {
    const { data: res } = await uploadApi.postImage(options.file, 'shop')
    if (res.code === 200) {
      form.logo = res.data?.url || res.data
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
</script>

<style scoped>
.profile-card { max-width: 700px; margin: 16px 0; }
.empty-notice { padding: 20px 0; }
.upload-wrap { display: flex; gap: 8px; width: 100%; }
</style>
