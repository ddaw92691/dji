<template>
  <main class="merchant-login-page">
    <img class="login-bg" src="/login/banner.jpg" alt="" aria-hidden="true" />
    <div class="login-overlay"></div>

    <section class="login-shell">
      <div class="login-panel">
        <img src="/logo-black.webp" alt="Mall" class="panel-logo" />

        <template v-if="mode === 'login'">
          <h1>Log in to Merchant Center</h1>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top" @keyup.enter="handleLogin">
            <el-form-item prop="username" label="email address">
              <el-input v-model="loginForm.username" placeholder="Email or phone" />
            </el-form-item>
            <el-form-item prop="password" label="Password">
              <el-input v-model="loginForm.password" type="password" show-password placeholder="Password" />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="loginForm.remember" @change="handleRememberChange">Remember me</el-checkbox>
              <el-button link type="primary">Forgot password? Go to reset &gt;</el-button>
            </div>

            <el-button class="submit-btn subtle" :loading="loading" @click="handleLogin">Log In</el-button>
          </el-form>

          <p class="switch-line">
            Need merchant access?
            <button type="button" @click="switchMode('apply')">申请成为经销商</button>
          </p>
        </template>

        <template v-else>
          <h1>申请成为经销商</h1>
          <el-form ref="applicationFormRef" :model="applicationForm" :rules="applicationRules" label-position="top">
            <div class="application-grid">
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="applicationForm.email" placeholder="your@email.com" />
              </el-form-item>
              <el-form-item prop="phone" label="手机号">
                <el-input v-model="applicationForm.phone" placeholder="+81 90 0000 0000" />
              </el-form-item>
              <el-form-item prop="password" label="登陆密码">
                <el-input v-model="applicationForm.password" type="password" show-password placeholder="Min 6 characters" />
              </el-form-item>
              <el-form-item prop="fullName" label="姓名">
                <el-input v-model="applicationForm.fullName" placeholder="Full name" />
              </el-form-item>
              <el-form-item prop="age" label="年龄">
                <el-input-number v-model="applicationForm.age" :min="18" :max="100" controls-position="right" />
              </el-form-item>
              <el-form-item prop="homeAddress" label="家庭地址" class="wide">
                <el-input v-model="applicationForm.homeAddress" type="textarea" :rows="2" placeholder="Home address" />
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
              <label class="file-picker">
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

          <p class="switch-line">
            Already approved?
            <button type="button" @click="switchMode('login')">Back to login</button>
          </p>
        </template>

        <p class="terms">By continuing, you hereby agree to the Privacy Policy and Terms of Use.</p>
      </div>
    </section>

    <p class="photo-credit">Shot on Mall System<br />Merchant Login</p>
    <p class="footer-copy">2026 (c) Mall Privacy Policy Terms of Use Accessibility Statement FAQ Support Site Map</p>
  </main>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  login,
  submitMerchantApplication,
  uploadMerchantApplicationFile,
  type MerchantApplicationPayload,
} from '@/api/login'
import { STORAGE_KEYS, storage } from '@/utils/storage'

defineOptions({ name: 'LoginView' })

type Mode = 'login' | 'apply'

const router = useRouter()
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')
const applicationFormRef = useTemplateRef<FormInstance>('applicationFormRef')
const mode = ref<Mode>('login')
const loading = ref(false)
const applicationLoading = ref(false)
const applicationError = ref('')

const REMEMBER_LOGIN_KEY = 'remember_login_info'

const loginForm = ref({
  username: 'merchant@example.com',
  password: 'merchant123456',
  remember: false,
})

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

const onFileChange = (key: FileKey, event: Event) => {
  const input = event.target as HTMLInputElement
  files[key] = input.files?.[0]
}

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: 'Please enter email or phone', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
})

const applicationRules = reactive<FormRules>({
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, min: 6, message: '请输入至少 6 位密码', trigger: 'blur' }],
  fullName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, type: 'number', min: 18, message: '年龄必须大于等于 18', trigger: 'change' }],
  homeAddress: [{ required: true, message: '请输入家庭地址', trigger: 'blur' }],
})

const switchMode = (nextMode: Mode) => {
  applicationError.value = ''
  mode.value = nextMode
}

const handleRememberChange = (value: boolean | string | number) => {
  if (!Boolean(value)) localStorage.removeItem(REMEMBER_LOGIN_KEY)
}

const handleLogin = async () => {
  await loginFormRef.value?.validate()
  loading.value = true
  try {
    const { data: res } = await login({
      account: loginForm.value.username,
      password: loginForm.value.password,
      loginType: 'password',
    })
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Login failed')
      return
    }
    const role = res.data.user?.role
    if (role !== 'MERCHANT' && role !== 'AGENT') {
      ElMessage.error('This account does not have permission to access the merchant panel')
      return
    }
    if (res.data.user?.countryCode) storage.set(STORAGE_KEYS.COUNTRY_CODE, res.data.user.countryCode)
    if (res.data.user?.languageCode) storage.set(STORAGE_KEYS.LANGUAGE_CODE, res.data.user.languageCode)
    storage.set(STORAGE_KEYS.TOKEN, res.data.token)
    if (loginForm.value.remember) {
      localStorage.setItem(REMEMBER_LOGIN_KEY, JSON.stringify({ username: loginForm.value.username }))
    }
    ElMessage.success('Login successful')
    router.push('/')
  } finally {
    loading.value = false
  }
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
    ElMessage.success('申请已提交，请等待平台审核')
    switchMode('login')
  } finally {
    applicationLoading.value = false
  }
}

const loadRememberedLoginInfo = () => {
  const rememberedInfo = localStorage.getItem(REMEMBER_LOGIN_KEY)
  if (!rememberedInfo) return
  try {
    const { username } = JSON.parse(rememberedInfo)
    if (username) {
      loginForm.value.username = username
      loginForm.value.remember = true
    }
  } catch {
    localStorage.removeItem(REMEMBER_LOGIN_KEY)
  }
}

onMounted(loadRememberedLoginInfo)
</script>

<style scoped lang="scss">
.merchant-login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #1f1f1f;
  color: #1f1f1f;
}

.login-bg,
.login-overlay {
  position: absolute;
  inset: 0;
}

.login-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-overlay {
  background: rgb(0 0 0 / 10%);
}

.login-shell {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 24px 5vw;

  @media (min-width: 1024px) {
    justify-content: flex-end;
    padding-right: 12vw;
  }
}

.login-panel {
  width: min(464px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #fff;
  padding: 32px 48px;
  box-shadow: 0 18px 60px rgb(0 0 0 / 18%);

  @media (min-width: 1024px) and (max-height: 800px) {
    transform: scale(0.84);
    transform-origin: right center;
  }

  @media (max-width: 520px) {
    padding: 28px;
  }
}

.panel-logo {
  display: block;
  width: 56px;
  margin-bottom: 24px;
}

h1 {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
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

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 2px 0 20px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 0;
  font-weight: 500;
}

.submit-btn.subtle {
  border-color: #d8d8d8;
  background: #f7f7f7;
  color: #999;
}

.submit-btn.primary {
  margin-top: 18px;
  border-color: #1f1f1f;
  background: #1f1f1f;
  color: #fff;
}

.switch-line {
  margin: 16px 0 0;
  text-align: center;
  color: #333;
  font-size: 13px;

  button {
    margin-left: 4px;
    border: 0;
    background: transparent;
    color: #0066cc;
    cursor: pointer;
  }
}

.terms {
  max-width: 310px;
  margin: 18px auto 0;
  color: #777;
  text-align: center;
  font-size: 12px;
  line-height: 1.6;
}

.application-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 12px;

  .wide {
    grid-column: 1 / -1;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.upload-group {
  display: grid;
  gap: 10px;
  margin-top: 4px;
}

:deep(.file-picker) {
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

.photo-credit,
.footer-copy {
  position: absolute;
  z-index: 3;
  color: rgb(255 255 255 / 90%);
  font-size: 11px;
  line-height: 1.45;
}

.photo-credit {
  bottom: 16px;
  left: 16px;
}

.footer-copy {
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
}
</style>
