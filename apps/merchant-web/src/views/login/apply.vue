<template>
  <main class="merchant-apply-page">
    <img class="apply-bg" src="/login/banner.jpg" alt="" aria-hidden="true" />
    <div class="apply-overlay"></div>

    <section class="apply-shell">
      <div class="apply-panel">
        <button class="back-link" type="button" @click="router.push('/login')">Back to login</button>
        <img src="/logo-black.webp" alt="Mall" class="panel-logo" />

        <header class="apply-header">
          <h1>申请成为经销商</h1>
          <p>请填写真实资料并上传证明文件，平台审核通过后即可登录商家后台。</p>
        </header>

        <el-form ref="applicationFormRef" :model="applicationForm" :rules="applicationRules" label-position="top">
          <div class="application-grid">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="applicationForm.email" autocomplete="off" placeholder="your@email.com" />
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
              <el-input v-model="applicationForm.phone" autocomplete="off" placeholder="+81 90 0000 0000" />
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
              <el-input
                v-model="applicationForm.password"
                type="password"
                show-password
                autocomplete="new-password"
                placeholder="Min 6 characters"
              />
            </el-form-item>
            <el-form-item prop="fullName" label="姓名">
              <el-input v-model="applicationForm.fullName" autocomplete="off" placeholder="Full name" />
            </el-form-item>
            <el-form-item prop="age" label="年龄">
              <el-input-number v-model="applicationForm.age" :min="18" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item prop="homeAddress" label="家庭地址" class="wide">
              <el-input v-model="applicationForm.homeAddress" type="textarea" :rows="3" placeholder="Home address" />
            </el-form-item>
          </div>

          <div class="upload-group">
            <label class="file-picker">
              <span>身份证正面照</span>
              <input type="file" accept="image/*" @change="onFileChange('idCardFront', $event)" />
              <em>{{ files.idCardFront?.name || 'Choose file' }}</em>
            </label>
            <label class="file-picker">
              <span>身份证反面照</span>
              <input type="file" accept="image/*" @change="onFileChange('idCardBack', $event)" />
              <em>{{ files.idCardBack?.name || 'Choose file' }}</em>
            </label>
            <label class="file-picker">
              <span>护照首页</span>
              <input type="file" accept="image/*" @change="onFileChange('passportPage', $event)" />
              <em>{{ files.passportPage?.name || 'Choose file' }}</em>
            </label>
            <label class="file-picker">
              <span>驾驶证</span>
              <input type="file" accept="image/*" @change="onFileChange('driverLicense', $event)" />
              <em>{{ files.driverLicense?.name || 'Choose file' }}</em>
            </label>
            <label class="file-picker wide">
              <span>手持证件视频<b>*</b></span>
              <input type="file" accept="video/*" @change="onFileChange('handheldVideo', $event)" />
              <em>{{ files.handheldVideo?.name || 'Choose file' }}</em>
            </label>
          </div>

          <p v-if="applicationError" class="error-text">{{ applicationError }}</p>

          <el-button class="submit-btn primary" :loading="applicationLoading" @click="handleApplicationSubmit">
            提交申请
          </el-button>
        </el-form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  submitMerchantApplication,
  uploadMerchantApplicationFile,
  type MerchantApplicationPayload,
} from '@/api/login'

defineOptions({ name: 'MerchantApplyView' })

const router = useRouter()
const applicationFormRef = useTemplateRef<FormInstance>('applicationFormRef')
const applicationLoading = ref(false)
const applicationError = ref('')

const applicationForm = ref({
  email: '',
  phone: '',
  password: '',
  fullName: '',
  age: 18,
  homeAddress: '',
})

const files = reactive<{
  idCardFront?: File
  idCardBack?: File
  passportPage?: File
  driverLicense?: File
  handheldVideo?: File
}>({})

type FileKey = 'idCardFront' | 'idCardBack' | 'passportPage' | 'driverLicense' | 'handheldVideo'

const applicationRules = reactive<FormRules>({
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '请输入至少 6 位密码', trigger: 'blur' }],
  fullName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, type: 'number', min: 18, message: '年龄必须大于等于 18', trigger: 'change' }],
  homeAddress: [{ required: true, message: '请输入家庭地址', trigger: 'blur' }],
})

const onFileChange = (key: FileKey, event: Event) => {
  const input = event.target as HTMLInputElement
  files[key] = input.files?.[0]
}

const uploadOptionalFile = async (file?: File) => {
  if (!file) return undefined
  const { data: res } = await uploadMerchantApplicationFile(file)
  return (res.data as any)?.url as string | undefined
}

const handleApplicationSubmit = async () => {
  applicationError.value = ''
  await applicationFormRef.value?.validate()

  const hasIdCard = Boolean(files.idCardFront && files.idCardBack)
  const hasPassport = Boolean(files.passportPage)
  const hasDriverLicense = Boolean(files.driverLicense)
  if (!hasIdCard && !hasPassport && !hasDriverLicense) {
    applicationError.value = '请上传身份证正反面、护照首页或驾驶证中的至少一种材料。'
    return
  }
  if (!files.handheldVideo) {
    applicationError.value = '请上传手持证件视频。'
    return
  }

  applicationLoading.value = true
  try {
    const payload: MerchantApplicationPayload = {
      email: applicationForm.value.email,
      phone: applicationForm.value.phone,
      password: applicationForm.value.password,
      fullName: applicationForm.value.fullName,
      age: applicationForm.value.age,
      homeAddress: applicationForm.value.homeAddress,
      idCardFrontUrl: await uploadOptionalFile(files.idCardFront),
      idCardBackUrl: await uploadOptionalFile(files.idCardBack),
      passportPageUrl: await uploadOptionalFile(files.passportPage),
      driverLicenseUrl: await uploadOptionalFile(files.driverLicense),
      handheldDocumentVideoUrl: (await uploadOptionalFile(files.handheldVideo)) || '',
    }
    const { data: res } = await submitMerchantApplication(payload)
    if (res.code !== 200) {
      applicationError.value = res.message || '提交失败'
      return
    }
    ElMessage.success('申请已提交')
    router.push({ path: '/login', query: { applicationSubmitted: '1' } })
  } finally {
    applicationLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.merchant-apply-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #202020;
  color: #1f1f1f;
}

.apply-bg,
.apply-overlay {
  position: absolute;
  inset: 0;
}

.apply-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.apply-overlay {
  background: rgb(0 0 0 / 22%);
}

.apply-shell {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 32px 5vw;
}

.apply-panel {
  width: min(880px, 100%);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  background: #fff;
  padding: 34px 48px 40px;
  box-shadow: 0 18px 60px rgb(0 0 0 / 20%);

  @media (max-width: 680px) {
    max-height: none;
    padding: 28px;
  }
}

.back-link {
  margin: 0 0 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0066cc;
  cursor: pointer;
  font-size: 13px;
}

.panel-logo {
  display: block;
  width: 56px;
  margin-bottom: 20px;
}

.apply-header {
  margin-bottom: 24px;

  h1 {
    margin: 0 0 10px;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.2;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  }
}

.application-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;

  .wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  color: #111;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  min-height: 40px;
  border-radius: 0;
  box-shadow: 0 0 0 1px #d8d8d8 inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #111 inset;
}

.upload-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
  margin-top: 4px;

  .wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
}

.file-picker {
  display: grid;
  gap: 6px;
  color: #111;
  font-size: 13px;

  b {
    color: #d93025;
  }

  input {
    width: 100%;
    color: #555;
    font-size: 12px;
  }

  em {
    color: #777;
    font-style: normal;
    word-break: break-all;
  }
}

.error-text {
  margin: 12px 0 0;
  color: #d93025;
  font-size: 13px;
  line-height: 1.5;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 18px;
  border-radius: 0;
  font-weight: 500;
}

.submit-btn.primary {
  border-color: #1f1f1f;
  background: #1f1f1f;
  color: #fff;
}
</style>
