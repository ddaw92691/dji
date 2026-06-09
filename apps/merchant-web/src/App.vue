<template>
  <el-config-provider :locale="langStore.currentElementLang">
    <RouterView />
    <TaxNoticeModal />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useLangStore } from '@/stores/lang'
import { useUserStore } from '@/stores/user'
import { useTaxNoticeStore } from '@/stores/taxNotice'
import { connectWebSocket, disconnectWebSocket } from '@/utils/realtime'
import { storage, STORAGE_KEYS } from '@/utils/storage'
import TaxNoticeModal from '@/components/TaxNoticeModal.vue'

const langStore = useLangStore()
const userStore = useUserStore()
const taxNoticeStore = useTaxNoticeStore()

function onWebSocketEvent(event: any) {
  taxNoticeStore.handleWebSocketEvent(event)
}

watch(() => userStore.userInfo, (user) => {
  if (user) {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN)
    if (token) {
      connectWebSocket(token, onWebSocketEvent)
      taxNoticeStore.fetchBlockingNotices()
    }
  } else {
    disconnectWebSocket()
  }
}, { immediate: true })

onMounted(async () => {
  await langStore.loadMessages()
})
</script>

<style></style>
