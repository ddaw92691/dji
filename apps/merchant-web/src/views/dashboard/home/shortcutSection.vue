<!-- 快捷方式 -->
<template>
  <BaseCard title="便捷工具" title-icon="HOutline:WrenchScrewdriverIcon">
    <div class="grid grid-cols-4 gap-6">
      <div
        v-for="item in shortcuts"
        :key="item.label"
        @click="router.push(item.path)"
      >
        <HoverAnimateWrapper name="jelly" intensity="normal">
          <div
            class="group flex flex-col items-center gap-3 py-3 rounded-2xl transition-all duration-300 hover:bg-(--el-bg-color-page)"
          >
            <div
              class="w-14 h-14 bg-(--el-bg-color-page) flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-(--el-bg-color)"
            >
              <el-icon size="26" :style="{ color: item.color }">
                <component :is="menuStore.iconComponents[item.icon]" />
              </el-icon>
            </div>
            <div class="text-[13px] font-bold">
              {{ item.label }}
            </div>
          </div>
        </HoverAnimateWrapper>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
const router = useRouter()
const menuStore = useMenuStore()

const shortcuts = ref([
  { label: 'Dashboard', icon: 'HOutline:ChartBarIcon', color: '#ef4444', path: '/dashboard/overview' },
  { label: 'Products', icon: 'HOutline:ShoppingBagIcon', color: '#4f46e5', path: '/product/list' },
  { label: 'Orders', icon: 'HOutline:DocumentTextIcon', color: '#ec4899', path: '/order/list' },
  { label: 'Finance', icon: 'HOutline:CurrencyDollarIcon', color: '#8b5cf6', path: '/finance/overview' },
  { label: 'Catalog', icon: 'HOutline:ArchiveBoxIcon', color: '#10b981', path: '/catalog/library' },
  { label: 'Tax', icon: 'HOutline:ReceiptPercentIcon', color: '#f59e0b', path: '/tax/notices' },
  { label: 'Support', icon: 'HOutline:ChatBubbleLeftRightIcon', color: '#06b6d4', path: '/support/customer' },
  { label: 'Shop', icon: 'HOutline:BuildingStorefrontIcon', color: '#f97316', path: '/shop/profile' },
])
</script>

<style scoped lang="scss"></style>
