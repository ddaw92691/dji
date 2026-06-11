<template>
  <div class="form-content-inner">
    <h2 class="title">{{ $t('login.title') }}</h2>
    <p class="subtitle">{{ $t('login.subtitle') }}</p>

    <!-- 登录表单 -->
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="top"
      class="login-form"
      @keyup.enter="handleLogin"
    >
      <el-form-item>
        <el-select
          v-model="rolePreset"
          :placeholder="$t('login.loginRolePlaceholder')"
          class="preset-select"
          @change="applyPreset"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" autocomplete="off" :placeholder="$t('login.usernamePlaceholder')" />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          show-password
          autocomplete="new-password"
          :placeholder="$t('login.passwordPlaceholder')"
        />
      </el-form-item>

      <div class="form-options">
        <el-checkbox v-model="loginForm.remember" @change="handleRememberChange">{{
          $t('login.rememberMe')
        }}</el-checkbox>
        <el-link type="primary" :underline="false" @click="emits('goToMode', 'forgot')">{{
          $t('login.forgotPassword')
        }}</el-link>
      </div>

      <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
        {{ $t('button.login') }}
      </el-button>
    </el-form>

    <!-- 其他登录方式 -->
    <div class="divider" v-if="APP_CONFIG.showPhoneLogin || APP_CONFIG.showQrLogin">
      <el-divider>
        <span class="divider-text">{{ $t('login.orUseOtherMethods') }}</span>
      </el-divider>
    </div>

    <div class="social-login">
      <el-button
        class="social-btn"
        @click="emits('goToMode', 'mobile')"
        v-if="APP_CONFIG.showPhoneLogin"
      >
        <template #icon>
          <el-icon>
            <component :is="menuStore.iconComponents['Element:Iphone']" />
          </el-icon>
        </template>
        {{ $t('button.phoneLogin') }}
      </el-button>
      <el-button class="social-btn" @click="emits('goToMode', 'qr')" v-if="APP_CONFIG.showQrLogin">
        <template #icon>
          <el-icon>
            <component :is="menuStore.iconComponents['Element:FullScreen']" />
          </el-icon>
        </template>
        {{ $t('button.scanLogin') }}
      </el-button>
    </div>

    <p class="register-link" v-if="APP_CONFIG.showRegister">
      <span>{{ $t('login.noAccount') }}</span>
      <el-link type="primary" :underline="false" @click="emits('goToMode', 'register')">{{
        $t('login.registerNow')
      }}</el-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { APP_CONFIG } from '@/config/app.config'
import { login } from '@/api/login'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { STORAGE_KEYS, storage } from '@/utils/storage'
import type { FormInstance, FormRules } from 'element-plus'
import type { ILoginMode } from '@/types/login'

interface IEmits {
  (e: 'goToMode', mode: ILoginMode): void
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const router = useRouter()
const menuStore = useMenuStore()
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')
const loading = ref(false)

// 记住我的 localStorage key
const REMEMBER_LOGIN_KEY = 'remember_login_info'

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

type RolePreset = 'merchant' | 'agent' | 'guest'

// 默认角色
const rolePreset = ref<RolePreset | ''>('')
// 角色选项
const roleOptions: Array<{
  label: string
  value: RolePreset
  preset: { username: string; password: string }
}> = [
  {
    label: 'Merchant',
    value: 'merchant',
    preset: { username: '', password: '' },
  },
  { label: 'Agent', value: 'agent', preset: { username: '', password: '' } },
  { label: 'Guest', value: 'guest', preset: { username: '', password: '' } },
]

/**
 * 检查是否为内置用户
 * @param username 用户名
 * @returns 如果是内置用户返回对应的角色，否则返回 null
 */
const getBuiltInRole = (username: string): RolePreset | null => {
  const role = roleOptions.find((item) => item.preset.username === username)
  return role ? role.value : null
}

/**
 * 切换角色预设
 * 自动填充对应角色的用户名和密码
 */
const applyPreset = (value: RolePreset) => {
  if (!roleOptions.some((item) => item.value === value)) return
  loginForm.value.username = ''
  loginForm.value.password = ''
}

/**
 * 从 localStorage 读取记住的登录信息
 * 包括角色选择和用户名
 */
const loadRememberedLoginInfo = () => {
  localStorage.removeItem(REMEMBER_LOGIN_KEY)
  loginForm.value.username = ''
  loginForm.value.password = ''
  loginForm.value.remember = false
  return

  /*
  const rememberedInfo = localStorage.getItem(REMEMBER_LOGIN_KEY)
  if (!rememberedInfo) return

  try {
    const { role, username } = JSON.parse(rememberedInfo)
    
    // 如果记住的是内置用户，恢复角色选择和完整信息
    if (role && getBuiltInRole(username) === role) {
      rolePreset.value = role
      applyPreset(role)
    } else {
      // 如果是自定义账号，只恢复用户名
      loginForm.value.username = username
    }
    
    loginForm.value.remember = true
  } catch (error) {
    console.error('解析记住的登录信息失败:', error)
    localStorage.removeItem(REMEMBER_LOGIN_KEY)
  }
  */
}

/**
 * 保存或清除记住的登录信息
 * @param value 是否记住
 */
const handleRememberChange = (value: boolean | string | number) => {
  const remember = Boolean(value)
  if (!remember) {
    localStorage.removeItem(REMEMBER_LOGIN_KEY)
  }
}

/**
 * 处理登录
 * 登录成功后保存记住的登录信息
 */
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
      // 后端业务异常（账号/密码错误等）以 HTTP 200 + code!=200 返回，
      // 这里显式提示，避免登录失败时界面静默无反馈。
      ElMessage.error(res.message || t('login.loginFailed'))
      return
    }
    const role = res.data.user?.role
    if (role !== 'MERCHANT' && role !== 'AGENT') {
      ElMessage.error('This account does not have permission to access the merchant panel')
      loading.value = false
      return
    }
    if (res.data.user?.countryCode) {
      storage.set(STORAGE_KEYS.COUNTRY_CODE, res.data.user.countryCode)
    }
    if (res.data.user?.languageCode) {
      storage.set(STORAGE_KEYS.LANGUAGE_CODE, res.data.user.languageCode)
    }
    storage.set(STORAGE_KEYS.TOKEN, res.data.token)
    
    // 如果勾选了记住我，保存登录信息
    if (loginForm.value.remember) {
      const builtInRole = getBuiltInRole(loginForm.value.username)
      const loginInfo = {
        role: builtInRole || rolePreset.value, // 内置用户保存角色，自定义账号保存当前选择的角色
        username: loginForm.value.username,
      }
      localStorage.setItem(REMEMBER_LOGIN_KEY, JSON.stringify(loginInfo))
    } else {
      localStorage.removeItem(REMEMBER_LOGIN_KEY)
    }
    
    ElMessage.success(t('login.loginSuccess'))
    router.push('/')
  } finally {
    loading.value = false
  }
}

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: t('login.usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passwordPlaceholder'), trigger: 'blur' }],
})

onMounted(() => {
  loadRememberedLoginInfo()
  // 如果没有记住的信息，应用默认角色
})
</script>

<style scoped lang="scss">
.form-content-inner {
  .title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.95rem;
    color: var(--el-text-color-secondary);
    margin-bottom: 1.7rem;
  }

  .login-form {
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      min-height: 2.75rem;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .submit-btn {
      width: 100%;
      height: 2.75rem;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      letter-spacing: 0.5rem;
    }
  }

  .divider {
    margin-bottom: 2rem;
    .divider-text {
      font-size: 0.75rem;
      color: var(--el-text-color-placeholder);
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    .social-btn {
      flex: 1;
      height: 2.75rem;
      border-radius: 8px;

      .social-icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  .register-link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
    .el-link {
      margin-left: 0.5rem;
      font-weight: 600;
    }
  }
}
</style>
