<template>
  <div class="i18n-page">
    <div class="mode-bar">
      <el-radio-group v-model="viewMode" @change="handleSwitchMode">
        <el-radio-button label="matrix">矩阵编辑（按 Key 多语言）</el-radio-button>
        <el-radio-button label="list">明细列表</el-radio-button>
      </el-radio-group>
      <span class="mode-hint" v-if="viewMode === 'matrix'">每行一个「模块 + Key」，各语言为一列，可一次配置并批量保存。建议先按「模块」筛选。</span>
    </div>

    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item>
        <el-input v-model="searchForm.keyword" placeholder="翻译 Key / 内容" clearable @clear="handleSearch" @keyup.enter="handleSearch" style="width: 180px" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.countryCode" placeholder="国家" clearable @change="handleSearch" style="width: 150px">
          <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="viewMode === 'list'">
        <el-select v-model="searchForm.languageCode" placeholder="语言" clearable @change="handleSearch" style="width: 140px">
          <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.namespaceCode" placeholder="模块" clearable @change="handleSearch" style="width: 130px">
          <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.status" placeholder="状态" clearable @change="handleSearch" style="width: 110px">
          <el-option label="已启用" value="ENABLE" />
          <el-option label="已禁用" value="DISABLE" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="'i18n:translation:add'" @click="onCreate">新增翻译</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" :disabled="currentDirty === 0" :loading="batchLoading" v-permission="'i18n:translation:edit'" @click="onBatchSave">
          批量保存{{ currentDirty ? `（${currentDirty}）` : '' }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          plain
          :disabled="selectedCount === 0"
          :loading="batchDeleteLoading"
          v-permission="'i18n:translation:delete'"
          @click="handleBatchDelete"
        >
          删除所选{{ selectedCount ? `（${selectedCount}）` : '' }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleOpenMissing">缺失翻译检测</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain :loading="autoTranslateLoading" v-permission="'i18n:translation:edit'" @click="handleOpenAutoTranslate">一键翻译/补全</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain v-permission="'i18n:translation:add'" @click="handleOpenImport">批量导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain v-permission="'i18n:translation:view'" @click="handleOpenExport">导出 JSON</el-button>
      </el-form-item>
    </el-form>

    <el-alert
      v-if="currentDirty > 0"
      type="warning"
      :closable="false"
      show-icon
      :title="`有 ${currentDirty} 处翻译内容已修改但未保存，点击「批量保存」提交`"
      style="margin-bottom: 12px"
    />

    <!-- ============ 矩阵编辑：一行一个 Key，多语言列 ============ -->
    <el-table
      v-if="viewMode === 'matrix'"
      :data="groupData"
      border
      stripe
      v-loading="loading"
      max-height="62vh"
      size="small"
      @selection-change="handleGroupSelectionChange"
    >
      <el-table-column type="selection" width="44" fixed />
      <el-table-column prop="namespaceCode" label="模块" width="120" fixed show-overflow-tooltip />
      <el-table-column label="翻译 Key" width="210" fixed show-overflow-tooltip>
        <template #default="{ row }">
          <div class="key-cell">{{ row.translationKey }}</div>
          <el-tag v-if="row.countryCode" size="small" type="info" effect="plain">{{ row.countryCode }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-for="l in languageOptions" :key="l.code" :label="`${l.nativeName || l.name} · ${l.code}`" min-width="200">
        <template #default="{ row }">
          <el-input
            v-model="matrixEdit[cellKey(row, l.code)]"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
            :placeholder="row.values && row.values[l.code] ? '' : '缺失'"
            :class="{
              'dirty-cell': matrixEdit[cellKey(row, l.code)] !== matrixOriginal[cellKey(row, l.code)],
              'missing-cell': !matrixEdit[cellKey(row, l.code)],
            }"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right" align="center">
        <template #default="{ row }">
          <el-popconfirm title="删除该 Key 的全部语言翻译？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleMatrixDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:translation:delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <!-- ============ 明细列表（保留原有单条编辑/状态/删除） ============ -->
    <el-table v-else :data="tableData" border stripe v-loading="loading" @selection-change="handleListSelectionChange">
      <el-table-column type="selection" width="44" />
      <el-table-column prop="countryCode" label="国家" width="90">
        <template #default="{ row }">{{ row.countryCode || '通用' }}</template>
      </el-table-column>
      <el-table-column prop="languageCode" label="语言" width="100" />
      <el-table-column prop="namespaceCode" label="模块" width="130" show-overflow-tooltip />
      <el-table-column prop="translationKey" label="翻译 Key" min-width="180" show-overflow-tooltip />
      <el-table-column label="翻译内容" min-width="260">
        <template #default="{ row }">
          <el-input
            v-model="editValues[row.id]"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
            :class="{ 'dirty-cell': isDirty(row) }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLE' ? 'success' : 'danger'">{{ row.status === 'ENABLE' ? '已启用' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" v-permission="'i18n:translation:edit'" @click="handleEdit(row)">编辑</el-button>
          <el-button link :type="row.status === 'ENABLE' ? 'warning' : 'success'" v-permission="'i18n:translation:edit'" @click="handleToggleStatus(row)">
            {{ row.status === 'ENABLE' ? '禁用' : '启用' }}
          </el-button>
          <el-popconfirm title="确定要删除该翻译吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger" v-permission="'i18n:translation:delete'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="searchForm.page"
      v-model:page-size="searchForm.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="fetchData"
    />

    <!-- 矩阵：新增 Key（一次配多语言） -->
    <el-dialog v-model="matrixCreateVisible" title="新增翻译 Key（一次配置多语言）" width="720px">
      <el-form :model="matrixForm" label-width="90px">
        <el-form-item label="模块" required>
          <el-select v-model="matrixForm.namespaceCode" placeholder="请选择模块" filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="翻译 Key" required>
          <el-input v-model="matrixForm.translationKey" placeholder="如 address.add" />
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="matrixForm.countryCode" placeholder="留空表示通用（所有国家）" clearable filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-divider content-position="left">各语言翻译（可只填部分，留空则不创建该语言）</el-divider>
        <el-form-item v-for="l in languageOptions" :key="l.code" :label="l.code">
          <el-input v-model="matrixValues[l.code]" :placeholder="`${l.nativeName || l.name}`">
            <template #prepend>{{ l.nativeName || l.name }}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="matrixCreateVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleMatrixCreate">保存</el-button>
      </template>
    </el-dialog>

    <!-- 明细：新增 / 编辑翻译 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑翻译' : '新增翻译'" width="650px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="国家" prop="countryCode">
          <el-select v-model="form.countryCode" placeholder="留空表示通用（所有国家）" clearable filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="languageCode">
          <el-select v-model="form.languageCode" placeholder="请选择语言" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="namespaceCode">
          <el-select v-model="form.namespaceCode" placeholder="请选择模块" filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="翻译 Key" prop="translationKey">
          <el-input v-model="form.translationKey" placeholder="如 button.save" />
        </el-form-item>
        <el-form-item label="翻译内容" prop="textValue">
          <el-input v-model="form.textValue" type="textarea" :rows="3" placeholder="请输入翻译内容" />
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="可选，用于备注该 Key 的用途" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="已启用" value="ENABLE" />
            <el-option label="已禁用" value="DISABLE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <!-- 批量导入 -->
    <el-dialog v-model="importDialogVisible" title="批量导入翻译" width="600px" @close="resetImportForm">
      <el-form ref="importFormRef" :model="importForm" :rules="importRules" label-width="110px">
        <el-form-item label="国家">
          <el-select v-model="importForm.countryCode" placeholder="留空表示通用" clearable filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="语言" prop="languageCode">
          <el-select v-model="importForm.languageCode" placeholder="请选择语言" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块" prop="namespaceCode">
          <el-select v-model="importForm.namespaceCode" placeholder="请选择模块" filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="覆盖已有">
          <el-switch v-model="importForm.overwrite" />
          <span class="hint">开启后会覆盖相同 Key 的已有翻译</span>
        </el-form-item>
        <el-form-item label="JSON 内容" prop="jsonText">
          <el-input v-model="importForm.jsonText" type="textarea" :rows="10" placeholder='{"button.save": "保存", "button.cancel": "取消"}' />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="importLoading" @click="handleImport">导入</el-button>
      </template>
    </el-dialog>

    <!-- 导出 -->
    <el-dialog v-model="exportDialogVisible" title="导出翻译" width="600px">
      <el-input v-model="exportJsonText" type="textarea" :rows="15" readonly />
      <template #footer>
        <el-button type="primary" @click="handleCopyExport">复制</el-button>
        <el-button @click="exportDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 缺失翻译检测 -->
    <el-dialog v-model="missingDialogVisible" title="缺失翻译检测" width="700px">
      <el-form :inline="true" :model="missingForm">
        <el-form-item label="基准语言">
          <el-select v-model="missingForm.baseLanguage" filterable style="width: 130px">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标语言">
          <el-select v-model="missingForm.targetLanguage" filterable style="width: 130px">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="missingForm.namespaceCode" placeholder="全部" clearable filterable style="width: 120px">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="missingLoading" @click="handleDetectMissing">检测</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        :title="`基准语言共 ${missingBaseCount} 个 Key，目标语言缺失 ${missingKeys.length} 个`"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 12px"
      />
      <el-table :data="missingKeys" border stripe max-height="360" v-loading="missingLoading">
        <el-table-column prop="fullKey" label="缺失的 Key" min-width="220" show-overflow-tooltip />
        <el-table-column label="基准内容" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">{{ row.baseValue }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleFillMissing(row)">补充</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="无缺失，太棒了" />
        </template>
      </el-table>
      <template #footer>
        <el-button @click="missingDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 一键翻译 / 补全目标语言 -->
    <el-dialog v-model="autoTranslateDialogVisible" title="一键翻译 / 补全目标语言" width="640px">
      <el-alert
        title="一键翻译优先调用 DeepSeek V4 Pro。请在后端环境变量配置 DEEPSEEK_API_KEY；未配置时仅补齐目标语言记录并保留原文待人工校对。"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 14px"
      />
      <el-form :model="autoTranslateForm" label-width="110px">
        <el-form-item label="基准语言" required>
          <el-select v-model="autoTranslateForm.sourceLanguageCode" filterable style="width: 100%">
            <el-option v-for="l in languageOptions" :key="l.code" :label="`${l.name} (${l.code})`" :value="l.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标语言" required>
          <el-select v-model="autoTranslateForm.targetLanguageCodes" multiple collapse-tags collapse-tags-tooltip filterable placeholder="请选择一个或多个目标语言" style="width: 100%">
            <el-option
              v-for="l in languageOptions.filter((item) => item.code !== autoTranslateForm.sourceLanguageCode)"
              :key="l.code"
              :label="`${l.name} (${l.code})`"
              :value="l.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="国家">
          <el-select v-model="autoTranslateForm.countryCode" placeholder="留空表示通用" clearable filterable style="width: 100%">
            <el-option v-for="c in countryOptions" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="autoTranslateForm.namespaceCode" placeholder="全部模块" clearable filterable style="width: 100%">
            <el-option v-for="n in namespaceOptions" :key="n.code" :label="n.code" :value="n.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="覆盖已有">
          <el-switch v-model="autoTranslateForm.overwrite" />
          <span class="hint">关闭时只补齐缺失或空内容；开启后会覆盖目标语言现有内容</span>
        </el-form-item>
        <el-form-item label="处理范围">
          <span class="hint">{{ selectedCount ? `仅处理已选择的 ${selectedCount} 个 Key` : '未选择时处理当前国家/模块筛选范围内的全部 Key' }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="autoTranslateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="autoTranslateLoading" @click="handleAutoTranslate">开始处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import {
  i18nApi,
  type I18nTranslation,
  type I18nTranslationGroup,
  type I18nBatchEntry,
  type I18nCountry,
  type I18nLanguage,
  type I18nNamespace,
  type PageData,
} from '@/api/i18n'

defineOptions({ name: 'I18nTranslationView' })

const { copy } = useClipboard()

const viewMode = ref<'matrix' | 'list'>('matrix')
const loading = ref(false)
const submitLoading = ref(false)
const importLoading = ref(false)
const batchLoading = ref(false)
const batchDeleteLoading = ref(false)
const tableData = ref<I18nTranslation[]>([])
const groupData = ref<I18nTranslationGroup[]>([])
const selectedTranslations = ref<I18nTranslation[]>([])
const selectedGroups = ref<I18nTranslationGroup[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const importFormRef = ref<FormInstance>()

const countryOptions = ref<I18nCountry[]>([])
const languageOptions = ref<I18nLanguage[]>([])
const namespaceOptions = ref<I18nNamespace[]>([])

// 明细列表行内编辑：id -> 当前编辑值
const editValues = reactive<Record<number, string>>({})
const originalValues = reactive<Record<number, string>>({})

// 矩阵编辑：cellKey -> 当前编辑值
const matrixEdit = reactive<Record<string, string>>({})
const matrixOriginal = reactive<Record<string, string>>({})

const searchForm = reactive({
  keyword: '',
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  status: '',
  page: 1,
  pageSize: 20,
})

const form = reactive({
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  translationKey: '',
  textValue: '',
  description: '',
  status: 'ENABLE',
})

const rules: FormRules = {
  languageCode: [{ required: true, message: '请选择语言', trigger: 'change' }],
  namespaceCode: [{ required: true, message: '请选择模块', trigger: 'change' }],
  translationKey: [
    { required: true, message: '请输入翻译 Key', trigger: 'blur' },
    { validator: (_r, v, cb) => (v && v.trim() ? cb() : cb(new Error('翻译 Key 不能为空'))), trigger: 'blur' },
  ],
  textValue: [{ required: true, message: '请输入翻译内容', trigger: 'blur' }],
}

const importDialogVisible = ref(false)
const importForm = reactive({
  countryCode: '',
  languageCode: '',
  namespaceCode: '',
  overwrite: false,
  jsonText: '',
})

const importRules: FormRules = {
  languageCode: [{ required: true, message: '请选择语言', trigger: 'change' }],
  namespaceCode: [{ required: true, message: '请选择模块', trigger: 'change' }],
  jsonText: [{ required: true, message: '请输入 JSON 内容', trigger: 'blur' }],
}

const autoTranslateDialogVisible = ref(false)
const autoTranslateLoading = ref(false)
const autoTranslateForm = reactive({
  sourceLanguageCode: 'en',
  targetLanguageCodes: [] as string[],
  countryCode: '',
  namespaceCode: '',
  overwrite: false,
})

const exportDialogVisible = ref(false)
const exportJsonText = ref('')

/* ============ 矩阵：dirty 跟踪 ============ */
function gk(g: I18nTranslationGroup) {
  return `${g.namespaceCode}|${g.translationKey}|${g.countryCode || ''}`
}
function cellKey(g: I18nTranslationGroup, lang: string) {
  return `${gk(g)}|${lang}`
}
const matrixDirtyCount = computed(() =>
  Object.keys(matrixEdit).filter((k) => matrixEdit[k] !== matrixOriginal[k]).length,
)

/* ============ 明细：dirty 跟踪 ============ */
function isDirty(row: I18nTranslation) {
  return editValues[row.id] !== originalValues[row.id]
}
const dirtyCount = computed(() => tableData.value.filter((r) => editValues[r.id] !== originalValues[r.id]).length)

const currentDirty = computed(() => (viewMode.value === 'matrix' ? matrixDirtyCount.value : dirtyCount.value))
const selectedCount = computed(() =>
  viewMode.value === 'matrix' ? selectedGroups.value.length : selectedTranslations.value.length,
)

function handleListSelectionChange(rows: I18nTranslation[]) {
  selectedTranslations.value = rows
}

function handleGroupSelectionChange(rows: I18nTranslationGroup[]) {
  selectedGroups.value = rows
}

async function loadCountries() {
  try {
    const { data: res } = await i18nApi.getCountries({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) countryOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function loadLanguages() {
  try {
    const { data: res } = await i18nApi.getLanguages({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) languageOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

async function loadNamespaces() {
  try {
    const { data: res } = await i18nApi.getNamespaces({ pageSize: 999, status: 'ENABLE' })
    if (res.code === 200) namespaceOptions.value = res.data.list || []
  } catch { /* ignore */ }
}

function fetchData() {
  return viewMode.value === 'matrix' ? fetchGrouped() : fetchList()
}

async function fetchList() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getTranslations({
      keyword: searchForm.keyword || undefined,
      countryCode: searchForm.countryCode || undefined,
      languageCode: searchForm.languageCode || undefined,
      namespaceCode: searchForm.namespaceCode || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nTranslation>
      tableData.value = pageData.list
      selectedTranslations.value = []
      total.value = pageData.total
      for (const k of Object.keys(editValues)) delete editValues[Number(k)]
      for (const k of Object.keys(originalValues)) delete originalValues[Number(k)]
      pageData.list.forEach((row) => {
        editValues[row.id] = row.textValue ?? ''
        originalValues[row.id] = row.textValue ?? ''
      })
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

async function fetchGrouped() {
  loading.value = true
  try {
    const { data: res } = await i18nApi.getGroupedTranslations({
      keyword: searchForm.keyword || undefined,
      countryCode: searchForm.countryCode || undefined,
      namespaceCode: searchForm.namespaceCode || undefined,
      status: searchForm.status || undefined,
      page: searchForm.page,
      pageSize: searchForm.pageSize,
    })
    if (res.code === 200) {
      const pageData = res.data as PageData<I18nTranslationGroup>
      groupData.value = pageData.list || []
      selectedGroups.value = []
      total.value = pageData.total
      for (const k of Object.keys(matrixEdit)) delete matrixEdit[k]
      for (const k of Object.keys(matrixOriginal)) delete matrixOriginal[k]
      groupData.value.forEach((g) => {
        languageOptions.value.forEach((l) => {
          const ck = cellKey(g, l.code)
          const v = g.values?.[l.code]?.textValue ?? ''
          matrixEdit[ck] = v
          matrixOriginal[ck] = v
        })
      })
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSwitchMode() {
  searchForm.page = 1
  fetchData()
}

function handleSearch() {
  searchForm.page = 1
  fetchData()
}

function handleReset() {
  Object.assign(searchForm, { keyword: '', countryCode: '', languageCode: '', namespaceCode: '', status: '' })
  handleSearch()
}

function onCreate() {
  if (viewMode.value === 'matrix') openMatrixCreate()
  else handleCreate()
}

function onBatchSave() {
  if (viewMode.value === 'matrix') handleMatrixSave()
  else handleBatchSave()
}

/* ============ 矩阵：批量保存 ============ */
async function handleMatrixSave() {
  const entries: I18nBatchEntry[] = []
  groupData.value.forEach((g) => {
    languageOptions.value.forEach((l) => {
      const ck = cellKey(g, l.code)
      if (matrixEdit[ck] !== matrixOriginal[ck]) {
        entries.push({
          namespaceCode: g.namespaceCode,
          translationKey: g.translationKey,
          countryCode: g.countryCode || null,
          languageCode: l.code,
          textValue: matrixEdit[ck] ?? '',
        })
      }
    })
  })
  if (entries.length === 0) return
  batchLoading.value = true
  try {
    const { data: res } = await i18nApi.batchSaveTranslations(entries)
    if (res.code === 200) {
      const r = res.data || ({} as any)
      ElMessage.success(`批量保存成功：新增 ${r.created ?? 0}，更新 ${r.updated ?? 0}${r.failed ? `，失败 ${r.failed}` : ''}`)
      fetchGrouped()
    } else {
      ElMessage.error(res.message || '批量保存失败')
    }
  } catch {
    ElMessage.error('批量保存失败')
  } finally {
    batchLoading.value = false
  }
}

/* ============ 矩阵：新增 Key（多语言一次提交） ============ */
const matrixCreateVisible = ref(false)
const matrixForm = reactive({ namespaceCode: '', translationKey: '', countryCode: '' })
const matrixValues = reactive<Record<string, string>>({})

function openMatrixCreate() {
  matrixForm.namespaceCode = searchForm.namespaceCode || ''
  matrixForm.translationKey = ''
  matrixForm.countryCode = searchForm.countryCode || ''
  for (const k of Object.keys(matrixValues)) delete matrixValues[k]
  languageOptions.value.forEach((l) => { matrixValues[l.code] = '' })
  matrixCreateVisible.value = true
}

async function handleMatrixCreate() {
  if (!matrixForm.namespaceCode) { ElMessage.warning('请选择模块'); return }
  if (!matrixForm.translationKey.trim()) { ElMessage.warning('翻译 Key 不能为空'); return }
  const entries: I18nBatchEntry[] = []
  languageOptions.value.forEach((l) => {
    const v = matrixValues[l.code]
    if (v && v.trim()) {
      entries.push({
        namespaceCode: matrixForm.namespaceCode,
        translationKey: matrixForm.translationKey.trim(),
        countryCode: matrixForm.countryCode || null,
        languageCode: l.code,
        textValue: v,
      })
    }
  })
  if (entries.length === 0) { ElMessage.warning('请至少填写一个语言的翻译'); return }
  submitLoading.value = true
  try {
    const { data: res } = await i18nApi.batchSaveTranslations(entries)
    if (res.code === 200) {
      ElMessage.success('新增成功')
      matrixCreateVisible.value = false
      fetchGrouped()
    } else {
      ElMessage.error(res.message || '新增失败')
    }
  } catch {
    ElMessage.error('新增失败')
  } finally {
    submitLoading.value = false
  }
}

/* ============ 矩阵：删除整个 Key（全部语言） ============ */
async function handleMatrixDelete(g: I18nTranslationGroup) {
  const ids = Object.values(g.values || {}).map((c) => c.id).filter(Boolean)
  if (ids.length === 0) return
  let fail = 0
  for (const id of ids) {
    try {
      const { data: res } = await i18nApi.deleteTranslation(id)
      if (res.code !== 200) fail++
    } catch {
      fail++
    }
  }
  if (fail === 0) ElMessage.success('删除成功')
  else ElMessage.warning(`部分删除失败（${fail} 条）`)
  fetchGrouped()
}

async function deleteTranslationIds(ids: number[]) {
  let fail = 0
  for (const id of ids) {
    try {
      const { data: res } = await i18nApi.deleteTranslation(id)
      if (res.code !== 200) fail++
    } catch {
      fail++
    }
  }
  return fail
}

async function handleBatchDelete() {
  const ids =
    viewMode.value === 'matrix'
      ? selectedGroups.value.flatMap((g) => Object.values(g.values || {}).map((c) => c.id).filter(Boolean))
      : selectedTranslations.value.map((row) => row.id)
  const uniqueIds = Array.from(new Set(ids.map((id) => Number(id)))).filter((id) => Number.isFinite(id))
  if (!uniqueIds.length) {
    ElMessage.warning('请先选择要删除的翻译')
    return
  }
  try {
    await ElMessageBox.confirm(`确定删除所选 ${uniqueIds.length} 条翻译吗？删除后不可恢复。`, '批量删除确认', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  batchDeleteLoading.value = true
  try {
    const fail = await deleteTranslationIds(uniqueIds)
    if (fail === 0) {
      ElMessage.success('批量删除成功')
    } else {
      ElMessage.warning(`批量删除完成，失败 ${fail} 条`)
    }
    fetchData()
  } finally {
    batchDeleteLoading.value = false
  }
}

/* ============ 明细列表：批量保存（逐条更新） ============ */
async function handleBatchSave() {
  const dirtyRows = tableData.value.filter((r) => editValues[r.id] !== originalValues[r.id])
  if (dirtyRows.length === 0) return
  batchLoading.value = true
  let ok = 0
  let fail = 0
  for (const row of dirtyRows) {
    try {
      const { data: res } = await i18nApi.updateTranslation(row.id, { textValue: editValues[row.id] })
      if (res.code === 200) {
        ok++
        originalValues[row.id] = editValues[row.id] ?? ''
      } else {
        fail++
      }
    } catch {
      fail++
    }
  }
  batchLoading.value = false
  if (fail === 0) ElMessage.success(`批量保存成功，共 ${ok} 条`)
  else ElMessage.warning(`保存完成：成功 ${ok} 条，失败 ${fail} 条`)
  fetchList()
}

function handleCreate() {
  isEdit.value = false
  editingId.value = null
  Object.assign(form, {
    countryCode: '', languageCode: '', namespaceCode: '',
    translationKey: '', textValue: '', description: '', status: 'ENABLE',
  })
  dialogVisible.value = true
}

function handleEdit(row: I18nTranslation) {
  isEdit.value = true
  editingId.value = row.id
  Object.assign(form, {
    countryCode: row.countryCode,
    languageCode: row.languageCode,
    namespaceCode: row.namespaceCode,
    translationKey: row.translationKey,
    textValue: row.textValue,
    description: row.description,
    status: row.status,
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const payload = { ...form, countryCode: form.countryCode ? form.countryCode : null }
  submitLoading.value = true
  try {
    if (isEdit.value && editingId.value) {
      const { data: res } = await i18nApi.updateTranslation(editingId.value, payload)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      const { data: res } = await i18nApi.createTranslation(payload)
      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchData()
      } else {
        ElMessage.error(res.message || '新增失败')
      }
    }
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(row: I18nTranslation) {
  const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'
  try {
    const { data: res } = await i18nApi.updateTranslationStatus(row.id, newStatus)
    if (res.code === 200) {
      ElMessage.success('状态已更新')
      fetchList()
    } else {
      ElMessage.error(res.message || '状态更新失败')
    }
  } catch {
    ElMessage.error('状态更新失败')
  }
}

async function handleDelete(row: I18nTranslation) {
  try {
    const { data: res } = await i18nApi.deleteTranslation(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

function handleOpenImport() {
  Object.assign(importForm, {
    countryCode: searchForm.countryCode || '',
    languageCode: searchForm.languageCode || '',
    namespaceCode: searchForm.namespaceCode || '',
    overwrite: false, jsonText: '',
  })
  importDialogVisible.value = true
}

async function handleImport() {
  if (!importFormRef.value) return
  const valid = await importFormRef.value.validate().catch(() => false)
  if (!valid) return

  let parsed: Record<string, string>
  try {
    parsed = JSON.parse(importForm.jsonText)
  } catch {
    ElMessage.error('JSON 格式有误，请检查')
    return
  }

  importLoading.value = true
  try {
    const { data: res } = await i18nApi.importTranslations({
      countryCode: importForm.countryCode,
      languageCode: importForm.languageCode,
      namespaceCode: importForm.namespaceCode,
      overwrite: importForm.overwrite,
      messages: parsed,
    })
    if (res.code === 200) {
      const r = res.data || {}
      ElMessage.success(`导入完成：新增 ${r.created ?? 0}，更新 ${r.updated ?? 0}，跳过 ${r.skipped ?? 0}`)
      importDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '导入失败')
    }
  } catch {
    ElMessage.error('导入失败')
  } finally {
    importLoading.value = false
  }
}

function resetImportForm() {
  importFormRef.value?.resetFields()
}

async function handleOpenExport() {
  if (!searchForm.languageCode) {
    ElMessage.warning('请先在上方筛选选择「语言」再导出（明细列表模式可选语言）')
    return
  }
  try {
    const { data: res } = await i18nApi.exportTranslations({
      countryCode: searchForm.countryCode || undefined,
      languageCode: searchForm.languageCode,
      namespaceCode: searchForm.namespaceCode || undefined,
    })
    if (res.code === 200) {
      exportJsonText.value = JSON.stringify(res.data?.messages ?? res.data, null, 2)
    } else {
      exportJsonText.value = ''
      ElMessage.error(res.message || '导出失败')
    }
  } catch {
    ElMessage.error('导出失败')
  }
  exportDialogVisible.value = true
}

async function handleCopyExport() {
  try {
    await copy(exportJsonText.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

/* ============ 一键翻译 / 补全 ============ */
function getSelectedFullKeys() {
  const set = new Set<string>()
  if (viewMode.value === 'matrix') {
    selectedGroups.value.forEach((g) => set.add(`${g.namespaceCode}.${g.translationKey}`))
  } else {
    selectedTranslations.value.forEach((row) => set.add(`${row.namespaceCode}.${row.translationKey}`))
  }
  return Array.from(set)
}

function handleOpenAutoTranslate() {
  const defaultSource = languageOptions.value.find((l) => l.code === 'en')?.code || languageOptions.value[0]?.code || ''
  autoTranslateForm.sourceLanguageCode = defaultSource
  autoTranslateForm.countryCode = searchForm.countryCode || ''
  autoTranslateForm.namespaceCode = searchForm.namespaceCode || ''
  autoTranslateForm.overwrite = false
  autoTranslateForm.targetLanguageCodes = searchForm.languageCode && searchForm.languageCode !== defaultSource
    ? [searchForm.languageCode]
    : []
  autoTranslateDialogVisible.value = true
}

async function handleAutoTranslate() {
  if (!autoTranslateForm.sourceLanguageCode) { ElMessage.warning('请选择基准语言'); return }
  if (!autoTranslateForm.targetLanguageCodes.length) { ElMessage.warning('请选择目标语言'); return }
  const same = autoTranslateForm.targetLanguageCodes.includes(autoTranslateForm.sourceLanguageCode)
  if (same) { ElMessage.warning('目标语言不能包含基准语言'); return }

  autoTranslateLoading.value = true
  try {
    const { data: res } = await i18nApi.autoTranslate({
      sourceLanguageCode: autoTranslateForm.sourceLanguageCode,
      targetLanguageCodes: autoTranslateForm.targetLanguageCodes,
      countryCode: autoTranslateForm.countryCode || undefined,
      namespaceCode: autoTranslateForm.namespaceCode || undefined,
      overwrite: autoTranslateForm.overwrite,
      keys: getSelectedFullKeys(),
    })
    if (res.code === 200) {
      const r = res.data || {}
      const fallbackText = r.copiedFallback ? `，待校对 ${r.copiedFallback}` : ''
      const failedText = r.failed ? `，失败 ${r.failed}` : ''
      const providerText = r.provider ? `，服务 ${r.provider}` : ''
      ElMessage.success(`处理完成：来源 ${r.sourceCount ?? 0}，新增 ${r.created ?? 0}，更新 ${r.updated ?? 0}，跳过 ${r.skipped ?? 0}${failedText}${fallbackText}${providerText}`)
      autoTranslateDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.message || '一键翻译失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || error?.message || '一键翻译失败')
  } finally {
    autoTranslateLoading.value = false
  }
}

/* ============ 缺失翻译检测 ============ */
const missingDialogVisible = ref(false)
const missingLoading = ref(false)
const missingBaseCount = ref(0)
const missingKeys = ref<{ fullKey: string; baseValue: string }[]>([])
const missingForm = reactive({
  baseLanguage: '',
  targetLanguage: '',
  namespaceCode: '',
})

function handleOpenMissing() {
  if (!missingForm.baseLanguage) {
    missingForm.baseLanguage = languageOptions.value.find((l) => l.code === 'en')?.code || languageOptions.value[0]?.code || ''
  }
  if (!missingForm.targetLanguage) {
    missingForm.targetLanguage = searchForm.languageCode || ''
  }
  missingForm.namespaceCode = searchForm.namespaceCode || ''
  missingKeys.value = []
  missingBaseCount.value = 0
  missingDialogVisible.value = true
}

async function exportMap(languageCode: string, namespaceCode?: string): Promise<Record<string, string>> {
  const { data: res } = await i18nApi.exportTranslations({
    languageCode,
    namespaceCode: namespaceCode || undefined,
  })
  if (res.code === 200) return (res.data?.messages as Record<string, string>) || {}
  return {}
}

async function handleDetectMissing() {
  if (!missingForm.baseLanguage || !missingForm.targetLanguage) {
    ElMessage.warning('请选择基准语言和目标语言')
    return
  }
  missingLoading.value = true
  try {
    const [baseMap, targetMap] = await Promise.all([
      exportMap(missingForm.baseLanguage, missingForm.namespaceCode),
      exportMap(missingForm.targetLanguage, missingForm.namespaceCode),
    ])
    missingBaseCount.value = Object.keys(baseMap).length
    missingKeys.value = Object.entries(baseMap)
      .filter(([k, v]) => !targetMap[k] && v)
      .map(([k, v]) => ({ fullKey: k, baseValue: v }))
  } catch {
    ElMessage.error('检测失败')
  } finally {
    missingLoading.value = false
  }
}

function handleFillMissing(row: { fullKey: string; baseValue: string }) {
  const dot = row.fullKey.indexOf('.')
  const ns = dot > 0 ? row.fullKey.slice(0, dot) : ''
  const key = dot > 0 ? row.fullKey.slice(dot + 1) : row.fullKey
  isEdit.value = false
  editingId.value = null
  Object.assign(form, {
    countryCode: '',
    languageCode: missingForm.targetLanguage,
    namespaceCode: ns,
    translationKey: key,
    textValue: '',
    description: '',
    status: 'ENABLE',
  })
  missingDialogVisible.value = false
  dialogVisible.value = true
}

onMounted(async () => {
  await Promise.all([loadCountries(), loadLanguages(), loadNamespaces()])
  fetchData()
})
</script>

<style scoped>
.i18n-page { padding: 20px; }
.mode-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.mode-hint { color: #909399; font-size: 12px; }
.search-bar { margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.hint { margin-left: 8px; color: #909399; font-size: 12px; }
.key-cell { font-family: var(--el-font-family, monospace); font-size: 12px; word-break: break-all; margin-bottom: 2px; }
:deep(.dirty-cell .el-textarea__inner) { background-color: #fdf6ec; }
:deep(.missing-cell .el-textarea__inner) { background-color: #fef0f0; }
</style>
