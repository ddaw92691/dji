<template>
  <main class="merchant-login-page">
    <img class="login-bg" src="/login/banner.jpg" alt="" aria-hidden="true" />
    <div class="login-overlay"></div>

    <section class="login-shell">
      <div class="login-panel">
        <img src="/logo-black.webp" alt="Mall" class="panel-logo" />

        <h1>Log in to Merchant Center</h1>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-position="top" @keyup.enter="handleLogin">
          <el-form-item prop="username" label="email address">
            <el-input v-model="loginForm.username" autocomplete="off" placeholder="Email or phone" />
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input v-model="loginForm.password" type="password" show-password autocomplete="new-password" placeholder="Password" />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" @change="handleRememberChange">Remember me</el-checkbox>
            <el-button link type="primary">Forgot password? Go to reset &gt;</el-button>
          </div>

          <el-button class="submit-btn subtle" :loading="loading" @click="handleLogin">Log In</el-button>
        </el-form>

        <p class="switch-line">
          Need merchant access?
          <button type="button" @click="goToApplication">申请成为经销商</button>
        </p>

        <p class="terms">By continuing, you hereby agree to the Privacy Policy and Terms of Use.</p>
      </div>
    </section>

    <p class="photo-credit">Shot on Mall System<br />Merchant Login</p>
    <p class="footer-copy">2026 (c) Mall Privacy Policy Terms of Use Accessibility Statement FAQ Support Site Map</p>
  </main>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { login } from '@/api/login'
import { STORAGE_KEYS, storage } from '@/utils/storage'

defineOptions({ name: 'LoginView' })

const router = useRouter()
const route = useRoute()
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')
const loading = ref(false)

const REMEMBER_LOGIN_KEY = 'remember_login_info'

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: 'Please enter email or phone', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
})

const goToApplication = () => {
  router.push('/merchant-apply')
}

const handleRememberChange = (value: boolean | string | number) => {
  if (!Boolean(value)) localStorage.removeItem(REMEMBER_LOGIN_KEY)
}

const getRedirectPath = () => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/'
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
    router.push(getRedirectPath())
  } finally {
    loading.value = false
  }
}

const loadRememberedLoginInfo = () => {
  localStorage.removeItem(REMEMBER_LOGIN_KEY)
  loginForm.value.username = ''
  loginForm.value.password = ''
  loginForm.value.remember = false
}

const showApplicationSubmittedDialog = () => {
  ElMessageBox.confirm(
    '您的申请已经成功提交，我们将尽快处理您的申请，如有疑问请联系支持。',
    '申请提交成功',
    {
      confirmButtonText: '支持',
      cancelButtonText: '我知道了',
      type: 'success',
      distinguishCancelAndClose: true,
    },
  )
    .then(() => router.push('/support/platform'))
    .catch(() => undefined)
}

onMounted(() => {
  loadRememberedLoginInfo()
  if (route.query.applicationSubmitted === '1') {
    router.replace({ path: '/login' })
    showApplicationSubmittedDialog()
  }
})
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

:deep(.el-input__wrapper) {
  min-height: 40px;
  border-radius: 0;
  box-shadow: 0 0 0 1px #d8d8d8 inset;
}

:deep(.el-input__wrapper.is-focus) {
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
