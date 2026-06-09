import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/utils/request'

export const useTaxNoticeStore = defineStore('taxNotice', () => {
  const blockingNotices = ref<any[]>([])
  const showModal = computed(() => blockingNotices.value.length > 0)

  async function fetchBlockingNotices() {
    try {
      const { data: res } = await request.get<{ code: number; data: any[] }>('/merchant/tax/notices/pending-blocking')
      if (res.code === 200) {
        blockingNotices.value = res.data || []
      }
    } catch { /* ignore */ }
  }

  function handleWebSocketEvent(event: any) {
    if (['TAX_NOTICE_CREATED', 'TAX_NOTICE_UPDATED'].includes(event.type)) {
      fetchBlockingNotices()
    }
    if (['TAX_NOTICE_PAID', 'TAX_NOTICE_CANCELLED'].includes(event.type)) {
      fetchBlockingNotices()
    }
  }

  return { blockingNotices, showModal, fetchBlockingNotices, handleWebSocketEvent }
})
