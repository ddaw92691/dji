<template>
  <span v-if="!hasFile" class="merchant-app-file__empty">-</span>
  <span v-else>
    <el-button v-if="!objectUrl" link type="primary" :loading="loading" @click="load">
      {{ kind === 'video' ? '查看视频' : '查看' }}
    </el-button>
    <template v-else>
      <el-image
        v-if="kind === 'image'"
        :src="objectUrl"
        :preview-src-list="[objectUrl]"
        :preview-teleported="true"
        fit="cover"
        class="merchant-app-file__img"
      />
      <video v-else :src="objectUrl" controls class="merchant-app-file__video" />
    </template>
    <span v-if="error" class="merchant-app-file__error">加载失败</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { merchantApplicationApi } from '@/api/merchantApplication'

defineOptions({ name: 'MerchantAppFile' })

const props = withDefaults(
  defineProps<{
    applicationId?: string | number | null
    field: string
    // 是否存在该文件（由父级根据 url 是否为空传入；缺省视为存在）
    has?: boolean
    kind?: 'image' | 'video'
  }>(),
  { applicationId: null, has: true, kind: 'image' },
)

const objectUrl = ref('')
const loading = ref(false)
const error = ref(false)

const hasFile = computed(() => props.has !== false && !!props.applicationId)

const load = async () => {
  if (objectUrl.value || loading.value || !props.applicationId) return
  loading.value = true
  error.value = false
  try {
    const res = await merchantApplicationApi.getFile(props.applicationId, props.field)
    objectUrl.value = URL.createObjectURL(res.data as unknown as Blob)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
})
</script>

<style scoped>
.merchant-app-file__img {
  width: 120px;
  height: 80px;
  border-radius: 4px;
}
.merchant-app-file__video {
  max-width: 240px;
  max-height: 160px;
  border-radius: 4px;
}
.merchant-app-file__error {
  margin-left: 8px;
  color: var(--el-color-danger);
}
.merchant-app-file__empty {
  color: var(--el-text-color-secondary);
}
</style>
