<template>
  <div class="catalog-listing-page">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.merchantKeyword" placeholder="商户名称" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.platformProductId" placeholder="平台商品ID" clearable @clear="handleSearch" @keyup.enter="handleSearch" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch">
          <el-option label="在售" value="ON_SALE" />
          <el-option label="已下架" value="OFF_SALE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column type="index" label="#" width="55" />
      <el-table-column prop="merchantName" label="商户" min-width="140" show-overflow-tooltip />
      <el-table-column prop="platformProductName" label="平台商品" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.platformProductName || row.platformProductModel || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="listingStatus" label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="row.listingStatus === 'ON_SALE' ? 'success' : 'warning'" size="small">
            {{ row.listingStatus === 'ON_SALE' ? 'On Sale' : 'Off Sale' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="merchantStock" label="库存" width="80" align="center" />
      <el-table-column prop="salePrice" label="售价" width="100" align="right" />
      <el-table-column prop="merchantPrice" label="货款成本" width="100" align="right" />
      <el-table-column prop="profitAmount" label="利润" width="90" align="right" />
      <el-table-column prop="listedAt" label="上架时间" width="160" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-popconfirm
            title="确定要强制下架该商品吗？"
            placement="top" width="200"
            @confirm="handleDelist(row)"
          >
            <template #reference>
              <el-button link type="danger" v-permission="'admin:catalog:disable'">强制下架</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { catalogApi, type CatalogListing } from '@/api/catalog'

defineOptions({ name: 'CatalogListingView' })

const loading = ref(false)
const tableData = ref<CatalogListing[]>([])
const total = ref(0)

const searchForm = reactive({
  merchantKeyword: '',
  platformProductId: '',
  status: '',
  page: 1,
  pageSize: 20,
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await catalogApi.getListings({
      merchantKeyword: searchForm.merchantKeyword || undefined,
      platformProductId: searchForm.platformProductId || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

async function handleDelist(row: CatalogListing) {
  try {
    const { data: res } = await catalogApi.disableListing(row.id)
    if (res.code === 200) {
      ElMessage.success('商品已下架')
      fetchData()
    } else {
      ElMessage.error(res.message || '下架失败')
    }
  } catch {
    ElMessage.error('下架失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.catalog-listing-page { padding: 20px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
</style>
