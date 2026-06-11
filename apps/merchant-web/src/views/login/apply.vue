<template>
  <main class="merchant-apply-page">
    <img class="apply-bg" src="/login/banner.jpg" alt="" aria-hidden="true" />
    <div class="apply-overlay"></div>

    <section class="apply-shell">
      <div class="apply-panel">
        <button class="back-link" type="button" @click="router.push('/login')">返回登录</button>
        <img src="/logo-black.webp" alt="Mall" class="panel-logo" />

        <header class="apply-header">
          <h1>申请成为经销商</h1>
          <p>请填写真实资料并上传证明文件，平台审核通过后即可登录商家后台。</p>
        </header>

        <el-alert
          v-if="applicationStatus && !showForm"
          :type="statusAlertType"
          :title="statusTitle"
          show-icon
          :closable="false"
          class="status-alert"
        >
          <template #default>
            <p v-if="applicationStatus === 'PENDING'">申请已提交，请等待审核。</p>
            <p v-else-if="applicationStatus === 'APPROVED'">申请已通过，请返回登录页面使用申请邮箱和密码登录。</p>
            <p v-else-if="applicationStatus === 'REJECTED'">
              拒绝原因：{{ reviewRemark || '未填写' }}
            </p>
            <el-button v-if="applicationStatus === 'REJECTED'" type="primary" @click="startResubmit">
              重新提交申请
            </el-button>
          </template>
        </el-alert>

        <el-form
          v-if="showForm"
          ref="applicationFormRef"
          :model="applicationForm"
          :rules="applicationRules"
          label-position="top"
        >
          <div class="application-grid">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="applicationForm.email" autocomplete="off" placeholder="your@email.com" />
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
              <el-input v-model="applicationForm.phone" autocomplete="off" placeholder="+1 555 000 0000" />
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
              <el-input
                v-model="applicationForm.password"
                type="password"
                show-password
                autocomplete="new-password"
                placeholder="至少 8 位，包含字母和数字"
              />
            </el-form-item>
            <el-form-item prop="fullName" label="姓名">
              <el-input v-model="applicationForm.fullName" autocomplete="off" placeholder="真实姓名" />
            </el-form-item>
            <el-form-item prop="age" label="年龄">
              <el-input-number v-model="applicationForm.age" :min="18" :max="100" controls-position="right" />
            </el-form-item>
            <el-form-item prop="documentType" label="证件类型">
              <el-select v-model="applicationForm.documentType" placeholder="请选择证件类型" @change="clearDocumentFiles">
                <el-option label="身份证" value="id_card" />
                <el-option label="护照" value="passport" />
                <el-option label="驾驶证" value="driver_license" />
              </el-select>
            </el-form-item>
            <el-form-item prop="homeAddress" label="家庭地址" class="wide">
              <el-input v-model="applicationForm.homeAddress" type="textarea" :rows="3" placeholder="家庭地址" />
            </el-form-item>
          </div>

          <div class="upload-group">
            <template v-if="applicationForm.documentType === 'id_card'">
              <FilePicker label="身份证正面照" required :file="files.idCardFront" @change="onFileChange('idCardFront', $event)" />
              <FilePicker label="身份证反面照" required :file="files.idCardBack" @change="onFileChange('idCardBack', $event)" />
            </template>
            <FilePicker
              v-else-if="applicationForm.documentType === 'passport'"
              label="护照首页"
              required
              :file="files.passportPage"
              @change="onFileChange('passportPage', $event)"
            />
            <FilePicker
              v-else-if="applicationForm.documentType === 'driver_license'"
              label="驾驶证照片"
              required
              :file="files.driverLicense"
              @change="onFileChange('driverLicense', $event)"
            />
            <FilePicker
              class="wide"
              label="手持证件视频"
              required
              video
              :file="files.handheldVideo"
              @change="onFileChange('handheldVideo', $event)"
            />
          </div>

          <el-form-item prop="privacyAccepted" class="privacy-item">
            <el-checkbox v-model="applicationForm.privacyAccepted">
              我确认提交的资料真实有效，并同意平台用于商家资质审核。
            </el-checkbox>
          </el-form-item>

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
import { defineComponent, h, type PropType } from 'vue'
import {
  getMerchantApplicationStatus,
  submitMerchantApplication,
  uploadMerchantApplicationFile,
  type MerchantApplicationPayload,
} from '@/api/login'

defineOptions({ name: 'MerchantApplyView' })

const APPLICATION_ID_KEY = 'merchant_application_id'
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

type FileKey = 'idCardFront' | 'idCardBack' | 'passportPage' | 'driverLicense' | 'handheldVideo'

const FilePicker = defineComponent({
  props: {
    label: { type: String, required: true },
    file: Object as PropType<File | undefined>,
    required: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    return () =>
      h('label', { ...attrs, class: ['file-picker', props.video ? 'video-picker' : '', attrs.class] }, [
        h('span', [props.label, props.required ? h('b', '*') : null]),
        h('input', {
          type: 'file',
          accept: props.video ? '.mp4,.mov,.webm,video/mp4,video/quicktime,video/webm' : '.jpg,.jpeg,.png,.webp,image/*',
          onChange: (event: Event) => emit('change', event),
        }),
        h('em', props.file?.name || '请选择文件'),
      ])
  },
})

const router = useRouter()
const applicationFormRef = useTemplateRef<FormInstance>('applicationFormRef')
const applicationLoading = ref(false)
const applicationError = ref('')
const applicationStatus = ref('')
const reviewRemark = ref('')
const showForm = ref(true)

const applicationForm = reactive({
  email: '',
  phone: '',
  password: '',
  fullName: '',
  age: 18,
  homeAddress: '',
  documentType: 'id_card' as MerchantApplicationPayload['documentType'],
  privacyAccepted: false,
})

const files = reactive<Partial<Record<FileKey, File>>>({})

const statusTitle = computed(() => {
  if (applicationStatus.value === 'PENDING') return '待审核'
  if (applicationStatus.value === 'APPROVED') return '已通过'
  if (applicationStatus.value === 'REJECTED') return '已拒绝'
  return ''
})

const statusAlertType = computed(() => {
  if (applicationStatus.value === 'APPROVED') return 'success'
  if (applicationStatus.value === 'REJECTED') return 'error'
  return 'warning'
})

const validatePassword = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) return callback(new Error('请输入登录密码'))
  if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return callback(new Error('密码至少 8 位，并包含字母和数字'))
  }
  callback()
}

const applicationRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^\+?[0-9\s-]{6,20}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  fullName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [
    { required: true, type: 'number', min: 18, max: 100, message: '年龄必须在 18 到 100 之间', trigger: 'change' },
  ],
  homeAddress: [{ required: true, message: '请输入家庭地址', trigger: 'blur' }],
  documentType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  privacyAccepted: [
    {
      validator: (_rule, value, callback) => {
        value ? callback() : callback(new Error('请确认隐私授权'))
      },
      trigger: 'change',
    },
  ],
})

const fileExtension = (file: File) => file.name.split('.').pop()?.toLowerCase() || ''

const onFileChange = (key: FileKey, event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const isVideo = key === 'handheldVideo'
  const allowed = isVideo ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
  const extension = fileExtension(file)

  if (!allowed.includes(extension)) {
    ElMessage.error(isVideo ? '视频仅支持 mp4、mov、webm 格式' : '图片仅支持 jpg、jpeg、png、webp 格式')
    input.value = ''
    return
  }
  if (file.size > maxSize) {
    ElMessage.error(isVideo ? '视频大小不能超过 50MB' : '图片大小不能超过 5MB')
    input.value = ''
    return
  }
  files[key] = file
}

const clearDocumentFiles = () => {
  files.idCardFront = undefined
  files.idCardBack = undefined
  files.passportPage = undefined
  files.driverLicense = undefined
}

const ensureRequiredFiles = () => {
  if (applicationForm.documentType === 'id_card' && (!files.idCardFront || !files.idCardBack)) {
    applicationError.value = '请上传身份证正面照和反面照'
    return false
  }
  if (applicationForm.documentType === 'passport' && !files.passportPage) {
    applicationError.value = '请上传护照首页'
    return false
  }
  if (applicationForm.documentType === 'driver_license' && !files.driverLicense) {
    applicationError.value = '请上传驾驶证照片'
    return false
  }
  if (!files.handheldVideo) {
    applicationError.value = '请上传手持证件视频'
    return false
  }
  return true
}

const uploadOptionalFile = async (file?: File) => {
  if (!file) return undefined
  const { data: res } = await uploadMerchantApplicationFile(file)
  if (res.code !== 200 || !res.data?.url) {
    throw new Error(res.message || '文件上传失败')
  }
  return res.data.url as string
}

const handleApplicationSubmit = async () => {
  applicationError.value = ''
  await applicationFormRef.value?.validate()
  if (!ensureRequiredFiles()) return

  applicationLoading.value = true
  try {
    const payload: MerchantApplicationPayload = {
      email: applicationForm.email,
      phone: applicationForm.phone,
      password: applicationForm.password,
      fullName: applicationForm.fullName,
      age: applicationForm.age,
      homeAddress: applicationForm.homeAddress,
      documentType: applicationForm.documentType,
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
    localStorage.setItem(APPLICATION_ID_KEY, String(res.data.id))
    applicationStatus.value = res.data.status
    reviewRemark.value = ''
    showForm.value = false
    ElMessage.success('申请已提交，请等待审核')
  } catch (error: any) {
    applicationError.value = error?.response?.data?.message || error?.message || '提交失败，请稍后重试'
  } finally {
    applicationLoading.value = false
  }
}

const loadStoredStatus = async () => {
  const id = localStorage.getItem(APPLICATION_ID_KEY)
  if (!id) return
  try {
    const { data: res } = await getMerchantApplicationStatus(id)
    if (res.code === 200 && res.data?.status) {
      applicationStatus.value = res.data.status
      reviewRemark.value = res.data.reviewRemark || ''
      showForm.value = false
    }
  } catch {
    localStorage.removeItem(APPLICATION_ID_KEY)
  }
}

const startResubmit = () => {
  showForm.value = true
  applicationStatus.value = ''
  reviewRemark.value = ''
  localStorage.removeItem(APPLICATION_ID_KEY)
}

onMounted(loadStoredStatus)
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

.status-alert {
  margin-bottom: 18px;
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
    margin-left: 2px;
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

.privacy-item {
  margin-top: 14px;
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
