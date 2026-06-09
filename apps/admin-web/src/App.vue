<template>
  <el-config-provider :locale="langStore.currentElementLang">
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLangStore } from '@/stores/lang'

const langStore = useLangStore()
onMounted(async () => {
  await langStore.loadMessages()
})
</script>

<style></style>
