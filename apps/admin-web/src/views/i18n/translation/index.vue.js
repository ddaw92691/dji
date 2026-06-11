/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useClipboard } from '@vueuse/core';
import { i18nApi, } from '@/api/i18n';
defineOptions({ name: 'I18nTranslationView' });
const { copy } = useClipboard();
const viewMode = ref('matrix');
const loading = ref(false);
const submitLoading = ref(false);
const importLoading = ref(false);
const batchLoading = ref(false);
const batchDeleteLoading = ref(false);
const tableData = ref([]);
const groupData = ref([]);
const selectedTranslations = ref([]);
const selectedGroups = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formRef = ref();
const importFormRef = ref();
const countryOptions = ref([]);
const languageOptions = ref([]);
const namespaceOptions = ref([]);
// 明细列表行内编辑：id -> 当前编辑值
const editValues = reactive({});
const originalValues = reactive({});
// 矩阵编辑：cellKey -> 当前编辑值
const matrixEdit = reactive({});
const matrixOriginal = reactive({});
const searchForm = reactive({
    keyword: '',
    countryCode: '',
    languageCode: '',
    namespaceCode: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    countryCode: '',
    languageCode: '',
    namespaceCode: '',
    translationKey: '',
    textValue: '',
    description: '',
    status: 'ENABLE',
});
const rules = {
    languageCode: [{ required: true, message: '请选择语言', trigger: 'change' }],
    namespaceCode: [{ required: true, message: '请选择模块', trigger: 'change' }],
    translationKey: [
        { required: true, message: '请输入翻译 Key', trigger: 'blur' },
        { validator: (_r, v, cb) => (v && v.trim() ? cb() : cb(new Error('翻译 Key 不能为空'))), trigger: 'blur' },
    ],
    textValue: [{ required: true, message: '请输入翻译内容', trigger: 'blur' }],
};
const importDialogVisible = ref(false);
const importForm = reactive({
    countryCode: '',
    languageCode: '',
    namespaceCode: '',
    overwrite: false,
    jsonText: '',
});
const importRules = {
    languageCode: [{ required: true, message: '请选择语言', trigger: 'change' }],
    namespaceCode: [{ required: true, message: '请选择模块', trigger: 'change' }],
    jsonText: [{ required: true, message: '请输入 JSON 内容', trigger: 'blur' }],
};
const exportDialogVisible = ref(false);
const exportJsonText = ref('');
/* ============ 矩阵：dirty 跟踪 ============ */
function gk(g) {
    return `${g.namespaceCode}|${g.translationKey}|${g.countryCode || ''}`;
}
function cellKey(g, lang) {
    return `${gk(g)}|${lang}`;
}
const matrixDirtyCount = computed(() => Object.keys(matrixEdit).filter((k) => matrixEdit[k] !== matrixOriginal[k]).length);
/* ============ 明细：dirty 跟踪 ============ */
function isDirty(row) {
    return editValues[row.id] !== originalValues[row.id];
}
const dirtyCount = computed(() => tableData.value.filter((r) => editValues[r.id] !== originalValues[r.id]).length);
const currentDirty = computed(() => (viewMode.value === 'matrix' ? matrixDirtyCount.value : dirtyCount.value));
const selectedCount = computed(() => viewMode.value === 'matrix' ? selectedGroups.value.length : selectedTranslations.value.length);
function handleListSelectionChange(rows) {
    selectedTranslations.value = rows;
}
function handleGroupSelectionChange(rows) {
    selectedGroups.value = rows;
}
async function loadCountries() {
    try {
        const { data: res } = await i18nApi.getCountries({ pageSize: 999, status: 'ENABLE' });
        if (res.code === 200)
            countryOptions.value = res.data.list || [];
    }
    catch { /* ignore */ }
}
async function loadLanguages() {
    try {
        const { data: res } = await i18nApi.getLanguages({ pageSize: 999, status: 'ENABLE' });
        if (res.code === 200)
            languageOptions.value = res.data.list || [];
    }
    catch { /* ignore */ }
}
async function loadNamespaces() {
    try {
        const { data: res } = await i18nApi.getNamespaces({ pageSize: 999, status: 'ENABLE' });
        if (res.code === 200)
            namespaceOptions.value = res.data.list || [];
    }
    catch { /* ignore */ }
}
function fetchData() {
    return viewMode.value === 'matrix' ? fetchGrouped() : fetchList();
}
async function fetchList() {
    loading.value = true;
    try {
        const { data: res } = await i18nApi.getTranslations({
            keyword: searchForm.keyword || undefined,
            countryCode: searchForm.countryCode || undefined,
            languageCode: searchForm.languageCode || undefined,
            namespaceCode: searchForm.namespaceCode || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            const pageData = res.data;
            tableData.value = pageData.list;
            selectedTranslations.value = [];
            total.value = pageData.total;
            for (const k of Object.keys(editValues))
                delete editValues[Number(k)];
            for (const k of Object.keys(originalValues))
                delete originalValues[Number(k)];
            pageData.list.forEach((row) => {
                editValues[row.id] = row.textValue ?? '';
                originalValues[row.id] = row.textValue ?? '';
            });
        }
        else {
            ElMessage.error(res.message || '获取数据失败');
        }
    }
    catch {
        ElMessage.error('获取数据失败');
    }
    finally {
        loading.value = false;
    }
}
async function fetchGrouped() {
    loading.value = true;
    try {
        const { data: res } = await i18nApi.getGroupedTranslations({
            keyword: searchForm.keyword || undefined,
            countryCode: searchForm.countryCode || undefined,
            namespaceCode: searchForm.namespaceCode || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            const pageData = res.data;
            groupData.value = pageData.list || [];
            selectedGroups.value = [];
            total.value = pageData.total;
            for (const k of Object.keys(matrixEdit))
                delete matrixEdit[k];
            for (const k of Object.keys(matrixOriginal))
                delete matrixOriginal[k];
            groupData.value.forEach((g) => {
                languageOptions.value.forEach((l) => {
                    const ck = cellKey(g, l.code);
                    const v = g.values?.[l.code]?.textValue ?? '';
                    matrixEdit[ck] = v;
                    matrixOriginal[ck] = v;
                });
            });
        }
        else {
            ElMessage.error(res.message || '获取数据失败');
        }
    }
    catch {
        ElMessage.error('获取数据失败');
    }
    finally {
        loading.value = false;
    }
}
function handleSwitchMode() {
    searchForm.page = 1;
    fetchData();
}
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
function handleReset() {
    Object.assign(searchForm, { keyword: '', countryCode: '', languageCode: '', namespaceCode: '', status: '' });
    handleSearch();
}
function onCreate() {
    if (viewMode.value === 'matrix')
        openMatrixCreate();
    else
        handleCreate();
}
function onBatchSave() {
    if (viewMode.value === 'matrix')
        handleMatrixSave();
    else
        handleBatchSave();
}
/* ============ 矩阵：批量保存 ============ */
async function handleMatrixSave() {
    const entries = [];
    groupData.value.forEach((g) => {
        languageOptions.value.forEach((l) => {
            const ck = cellKey(g, l.code);
            if (matrixEdit[ck] !== matrixOriginal[ck]) {
                entries.push({
                    namespaceCode: g.namespaceCode,
                    translationKey: g.translationKey,
                    countryCode: g.countryCode || null,
                    languageCode: l.code,
                    textValue: matrixEdit[ck] ?? '',
                });
            }
        });
    });
    if (entries.length === 0)
        return;
    batchLoading.value = true;
    try {
        const { data: res } = await i18nApi.batchSaveTranslations(entries);
        if (res.code === 200) {
            const r = res.data || {};
            ElMessage.success(`批量保存成功：新增 ${r.created ?? 0}，更新 ${r.updated ?? 0}${r.failed ? `，失败 ${r.failed}` : ''}`);
            fetchGrouped();
        }
        else {
            ElMessage.error(res.message || '批量保存失败');
        }
    }
    catch {
        ElMessage.error('批量保存失败');
    }
    finally {
        batchLoading.value = false;
    }
}
/* ============ 矩阵：新增 Key（多语言一次提交） ============ */
const matrixCreateVisible = ref(false);
const matrixForm = reactive({ namespaceCode: '', translationKey: '', countryCode: '' });
const matrixValues = reactive({});
function openMatrixCreate() {
    matrixForm.namespaceCode = searchForm.namespaceCode || '';
    matrixForm.translationKey = '';
    matrixForm.countryCode = searchForm.countryCode || '';
    for (const k of Object.keys(matrixValues))
        delete matrixValues[k];
    languageOptions.value.forEach((l) => { matrixValues[l.code] = ''; });
    matrixCreateVisible.value = true;
}
async function handleMatrixCreate() {
    if (!matrixForm.namespaceCode) {
        ElMessage.warning('请选择模块');
        return;
    }
    if (!matrixForm.translationKey.trim()) {
        ElMessage.warning('翻译 Key 不能为空');
        return;
    }
    const entries = [];
    languageOptions.value.forEach((l) => {
        const v = matrixValues[l.code];
        if (v && v.trim()) {
            entries.push({
                namespaceCode: matrixForm.namespaceCode,
                translationKey: matrixForm.translationKey.trim(),
                countryCode: matrixForm.countryCode || null,
                languageCode: l.code,
                textValue: v,
            });
        }
    });
    if (entries.length === 0) {
        ElMessage.warning('请至少填写一个语言的翻译');
        return;
    }
    submitLoading.value = true;
    try {
        const { data: res } = await i18nApi.batchSaveTranslations(entries);
        if (res.code === 200) {
            ElMessage.success('新增成功');
            matrixCreateVisible.value = false;
            fetchGrouped();
        }
        else {
            ElMessage.error(res.message || '新增失败');
        }
    }
    catch {
        ElMessage.error('新增失败');
    }
    finally {
        submitLoading.value = false;
    }
}
/* ============ 矩阵：删除整个 Key（全部语言） ============ */
async function handleMatrixDelete(g) {
    const ids = Object.values(g.values || {}).map((c) => c.id).filter(Boolean);
    if (ids.length === 0)
        return;
    let fail = 0;
    for (const id of ids) {
        try {
            const { data: res } = await i18nApi.deleteTranslation(id);
            if (res.code !== 200)
                fail++;
        }
        catch {
            fail++;
        }
    }
    if (fail === 0)
        ElMessage.success('删除成功');
    else
        ElMessage.warning(`部分删除失败（${fail} 条）`);
    fetchGrouped();
}
async function deleteTranslationIds(ids) {
    let fail = 0;
    for (const id of ids) {
        try {
            const { data: res } = await i18nApi.deleteTranslation(id);
            if (res.code !== 200)
                fail++;
        }
        catch {
            fail++;
        }
    }
    return fail;
}
async function handleBatchDelete() {
    const ids = viewMode.value === 'matrix'
        ? selectedGroups.value.flatMap((g) => Object.values(g.values || {}).map((c) => c.id).filter(Boolean))
        : selectedTranslations.value.map((row) => row.id);
    const uniqueIds = Array.from(new Set(ids.map((id) => Number(id)))).filter((id) => Number.isFinite(id));
    if (!uniqueIds.length) {
        ElMessage.warning('请先选择要删除的翻译');
        return;
    }
    try {
        await ElMessageBox.confirm(`确定删除所选 ${uniqueIds.length} 条翻译吗？删除后不可恢复。`, '批量删除确认', {
            type: 'warning',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
        });
    }
    catch {
        return;
    }
    batchDeleteLoading.value = true;
    try {
        const fail = await deleteTranslationIds(uniqueIds);
        if (fail === 0) {
            ElMessage.success('批量删除成功');
        }
        else {
            ElMessage.warning(`批量删除完成，失败 ${fail} 条`);
        }
        fetchData();
    }
    finally {
        batchDeleteLoading.value = false;
    }
}
/* ============ 明细列表：批量保存（逐条更新） ============ */
async function handleBatchSave() {
    const dirtyRows = tableData.value.filter((r) => editValues[r.id] !== originalValues[r.id]);
    if (dirtyRows.length === 0)
        return;
    batchLoading.value = true;
    let ok = 0;
    let fail = 0;
    for (const row of dirtyRows) {
        try {
            const { data: res } = await i18nApi.updateTranslation(row.id, { textValue: editValues[row.id] });
            if (res.code === 200) {
                ok++;
                originalValues[row.id] = editValues[row.id] ?? '';
            }
            else {
                fail++;
            }
        }
        catch {
            fail++;
        }
    }
    batchLoading.value = false;
    if (fail === 0)
        ElMessage.success(`批量保存成功，共 ${ok} 条`);
    else
        ElMessage.warning(`保存完成：成功 ${ok} 条，失败 ${fail} 条`);
    fetchList();
}
function handleCreate() {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, {
        countryCode: '', languageCode: '', namespaceCode: '',
        translationKey: '', textValue: '', description: '', status: 'ENABLE',
    });
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    editingId.value = row.id;
    Object.assign(form, {
        countryCode: row.countryCode,
        languageCode: row.languageCode,
        namespaceCode: row.namespaceCode,
        translationKey: row.translationKey,
        textValue: row.textValue,
        description: row.description,
        status: row.status,
    });
    dialogVisible.value = true;
}
async function handleSubmit() {
    if (!formRef.value)
        return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid)
        return;
    const payload = { ...form, countryCode: form.countryCode ? form.countryCode : null };
    submitLoading.value = true;
    try {
        if (isEdit.value && editingId.value) {
            const { data: res } = await i18nApi.updateTranslation(editingId.value, payload);
            if (res.code === 200) {
                ElMessage.success('更新成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '更新失败');
            }
        }
        else {
            const { data: res } = await i18nApi.createTranslation(payload);
            if (res.code === 200) {
                ElMessage.success('新增成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '新增失败');
            }
        }
    }
    catch {
        ElMessage.error('操作失败');
    }
    finally {
        submitLoading.value = false;
    }
}
async function handleToggleStatus(row) {
    const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    try {
        const { data: res } = await i18nApi.updateTranslationStatus(row.id, newStatus);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            fetchList();
        }
        else {
            ElMessage.error(res.message || '状态更新失败');
        }
    }
    catch {
        ElMessage.error('状态更新失败');
    }
}
async function handleDelete(row) {
    try {
        const { data: res } = await i18nApi.deleteTranslation(row.id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
            fetchList();
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
}
function resetForm() {
    formRef.value?.resetFields();
}
function handleOpenImport() {
    Object.assign(importForm, {
        countryCode: searchForm.countryCode || '',
        languageCode: searchForm.languageCode || '',
        namespaceCode: searchForm.namespaceCode || '',
        overwrite: false, jsonText: '',
    });
    importDialogVisible.value = true;
}
async function handleImport() {
    if (!importFormRef.value)
        return;
    const valid = await importFormRef.value.validate().catch(() => false);
    if (!valid)
        return;
    let parsed;
    try {
        parsed = JSON.parse(importForm.jsonText);
    }
    catch {
        ElMessage.error('JSON 格式有误，请检查');
        return;
    }
    importLoading.value = true;
    try {
        const { data: res } = await i18nApi.importTranslations({
            countryCode: importForm.countryCode,
            languageCode: importForm.languageCode,
            namespaceCode: importForm.namespaceCode,
            overwrite: importForm.overwrite,
            messages: parsed,
        });
        if (res.code === 200) {
            const r = res.data || {};
            ElMessage.success(`导入完成：新增 ${r.created ?? 0}，更新 ${r.updated ?? 0}，跳过 ${r.skipped ?? 0}`);
            importDialogVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '导入失败');
        }
    }
    catch {
        ElMessage.error('导入失败');
    }
    finally {
        importLoading.value = false;
    }
}
function resetImportForm() {
    importFormRef.value?.resetFields();
}
async function handleOpenExport() {
    if (!searchForm.languageCode) {
        ElMessage.warning('请先在上方筛选选择「语言」再导出（明细列表模式可选语言）');
        return;
    }
    try {
        const { data: res } = await i18nApi.exportTranslations({
            countryCode: searchForm.countryCode || undefined,
            languageCode: searchForm.languageCode,
            namespaceCode: searchForm.namespaceCode || undefined,
        });
        if (res.code === 200) {
            exportJsonText.value = JSON.stringify(res.data?.messages ?? res.data, null, 2);
        }
        else {
            exportJsonText.value = '';
            ElMessage.error(res.message || '导出失败');
        }
    }
    catch {
        ElMessage.error('导出失败');
    }
    exportDialogVisible.value = true;
}
async function handleCopyExport() {
    try {
        await copy(exportJsonText.value);
        ElMessage.success('已复制到剪贴板');
    }
    catch {
        ElMessage.error('复制失败');
    }
}
/* ============ 缺失翻译检测 ============ */
const missingDialogVisible = ref(false);
const missingLoading = ref(false);
const missingBaseCount = ref(0);
const missingKeys = ref([]);
const missingForm = reactive({
    baseLanguage: '',
    targetLanguage: '',
    namespaceCode: '',
});
function handleOpenMissing() {
    if (!missingForm.baseLanguage) {
        missingForm.baseLanguage = languageOptions.value.find((l) => l.code === 'en')?.code || languageOptions.value[0]?.code || '';
    }
    if (!missingForm.targetLanguage) {
        missingForm.targetLanguage = searchForm.languageCode || '';
    }
    missingForm.namespaceCode = searchForm.namespaceCode || '';
    missingKeys.value = [];
    missingBaseCount.value = 0;
    missingDialogVisible.value = true;
}
async function exportMap(languageCode, namespaceCode) {
    const { data: res } = await i18nApi.exportTranslations({
        languageCode,
        namespaceCode: namespaceCode || undefined,
    });
    if (res.code === 200)
        return res.data?.messages || {};
    return {};
}
async function handleDetectMissing() {
    if (!missingForm.baseLanguage || !missingForm.targetLanguage) {
        ElMessage.warning('请选择基准语言和目标语言');
        return;
    }
    missingLoading.value = true;
    try {
        const [baseMap, targetMap] = await Promise.all([
            exportMap(missingForm.baseLanguage, missingForm.namespaceCode),
            exportMap(missingForm.targetLanguage, missingForm.namespaceCode),
        ]);
        missingBaseCount.value = Object.keys(baseMap).length;
        missingKeys.value = Object.entries(baseMap)
            .filter(([k, v]) => !targetMap[k] && v)
            .map(([k, v]) => ({ fullKey: k, baseValue: v }));
    }
    catch {
        ElMessage.error('检测失败');
    }
    finally {
        missingLoading.value = false;
    }
}
function handleFillMissing(row) {
    const dot = row.fullKey.indexOf('.');
    const ns = dot > 0 ? row.fullKey.slice(0, dot) : '';
    const key = dot > 0 ? row.fullKey.slice(dot + 1) : row.fullKey;
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, {
        countryCode: '',
        languageCode: missingForm.targetLanguage,
        namespaceCode: ns,
        translationKey: key,
        textValue: '',
        description: '',
        status: 'ENABLE',
    });
    missingDialogVisible.value = false;
    dialogVisible.value = true;
}
onMounted(async () => {
    await Promise.all([loadCountries(), loadLanguages(), loadNamespaces()]);
    fetchData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "i18n-page" },
});
/** @type {__VLS_StyleScopedClasses['i18n-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mode-bar" },
});
/** @type {__VLS_StyleScopedClasses['mode-bar']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.viewMode),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.viewMode),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSwitchMode),
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    label: "matrix",
}));
const __VLS_10 = __VLS_9({
    label: "matrix",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
// @ts-ignore
[viewMode, handleSwitchMode,];
var __VLS_11;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button'] | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
elRadioButton;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    label: "list",
}));
const __VLS_16 = __VLS_15({
    label: "list",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
// @ts-ignore
[];
var __VLS_17;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.viewMode === 'matrix') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mode-hint" },
    });
    /** @type {__VLS_StyleScopedClasses['mode-hint']} */ ;
}
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}));
const __VLS_22 = __VLS_21({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
const { default: __VLS_25 } = __VLS_23.slots;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({}));
const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "翻译 Key / 内容",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "翻译 Key / 内容",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_35;
var __VLS_36;
// @ts-ignore
[viewMode, searchForm, searchForm, handleSearch, handleSearch,];
var __VLS_29;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.countryCode),
    placeholder: "国家",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_47 = __VLS_46({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.countryCode),
    placeholder: "国家",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
const __VLS_51 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_52 } = __VLS_48.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }));
    const __VLS_55 = __VLS_54({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    // @ts-ignore
    [searchForm, handleSearch, countryOptions,];
}
// @ts-ignore
[];
var __VLS_48;
var __VLS_49;
// @ts-ignore
[];
var __VLS_42;
if (__VLS_ctx.viewMode === 'list') {
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({}));
    const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.languageCode),
        placeholder: "语言",
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.languageCode),
        placeholder: "语言",
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        ...{ change: {} },
        onChange: (__VLS_ctx.handleSearch),
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            key: (l.code),
            label: (`${l.name} (${l.code})`),
            value: (l.code),
        }));
        const __VLS_74 = __VLS_73({
            key: (l.code),
            label: (`${l.name} (${l.code})`),
            value: (l.code),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        // @ts-ignore
        [viewMode, searchForm, handleSearch, languageOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_67;
    var __VLS_68;
    // @ts-ignore
    [];
    var __VLS_61;
}
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({}));
const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.namespaceCode),
    placeholder: "模块",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_85 = __VLS_84({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.namespaceCode),
    placeholder: "模块",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_90 } = __VLS_86.slots;
for (const [n] of __VLS_vFor((__VLS_ctx.namespaceOptions))) {
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }));
    const __VLS_93 = __VLS_92({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [searchForm, handleSearch, namespaceOptions,];
}
// @ts-ignore
[];
var __VLS_86;
var __VLS_87;
// @ts-ignore
[];
var __VLS_80;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_104 = __VLS_103({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
let __VLS_107;
const __VLS_108 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_109 } = __VLS_105.slots;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_112 = __VLS_111({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_117 = __VLS_116({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_105;
var __VLS_106;
// @ts-ignore
[];
var __VLS_99;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({}));
const __VLS_122 = __VLS_121({}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const { default: __VLS_125 } = __VLS_123.slots;
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_128 = __VLS_127({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
const __VLS_132 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_133 } = __VLS_129.slots;
// @ts-ignore
[handleSearch,];
var __VLS_129;
var __VLS_130;
// @ts-ignore
[];
var __VLS_123;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({}));
const __VLS_136 = __VLS_135({}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    ...{ 'onClick': {} },
}));
const __VLS_142 = __VLS_141({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_145;
const __VLS_146 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleReset),
};
const { default: __VLS_147 } = __VLS_143.slots;
// @ts-ignore
[handleReset,];
var __VLS_143;
var __VLS_144;
// @ts-ignore
[];
var __VLS_137;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({}));
const __VLS_150 = __VLS_149({}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const { default: __VLS_153 } = __VLS_151.slots;
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_156 = __VLS_155({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
const __VLS_160 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.onCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:add') }, null, null);
const { default: __VLS_161 } = __VLS_157.slots;
// @ts-ignore
[onCreate, vPermission,];
var __VLS_157;
var __VLS_158;
// @ts-ignore
[];
var __VLS_151;
let __VLS_162;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({}));
const __VLS_164 = __VLS_163({}, ...__VLS_functionalComponentArgsRest(__VLS_163));
const { default: __VLS_167 } = __VLS_165.slots;
let __VLS_168;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (__VLS_ctx.currentDirty === 0),
    loading: (__VLS_ctx.batchLoading),
}));
const __VLS_170 = __VLS_169({
    ...{ 'onClick': {} },
    type: "success",
    disabled: (__VLS_ctx.currentDirty === 0),
    loading: (__VLS_ctx.batchLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
let __VLS_173;
const __VLS_174 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.onBatchSave),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:edit') }, null, null);
const { default: __VLS_175 } = __VLS_171.slots;
(__VLS_ctx.currentDirty ? `（${__VLS_ctx.currentDirty}）` : '');
// @ts-ignore
[vPermission, currentDirty, currentDirty, currentDirty, batchLoading, onBatchSave,];
var __VLS_171;
var __VLS_172;
// @ts-ignore
[];
var __VLS_165;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({}));
const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
const { default: __VLS_181 } = __VLS_179.slots;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
    disabled: (__VLS_ctx.selectedCount === 0),
    loading: (__VLS_ctx.batchDeleteLoading),
}));
const __VLS_184 = __VLS_183({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
    disabled: (__VLS_ctx.selectedCount === 0),
    loading: (__VLS_ctx.batchDeleteLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
let __VLS_187;
const __VLS_188 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleBatchDelete),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:delete') }, null, null);
const { default: __VLS_189 } = __VLS_185.slots;
(__VLS_ctx.selectedCount ? `（${__VLS_ctx.selectedCount}）` : '');
// @ts-ignore
[vPermission, selectedCount, selectedCount, selectedCount, batchDeleteLoading, handleBatchDelete,];
var __VLS_185;
var __VLS_186;
// @ts-ignore
[];
var __VLS_179;
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({}));
const __VLS_192 = __VLS_191({}, ...__VLS_functionalComponentArgsRest(__VLS_191));
const { default: __VLS_195 } = __VLS_193.slots;
let __VLS_196;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    ...{ 'onClick': {} },
}));
const __VLS_198 = __VLS_197({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_201;
const __VLS_202 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleOpenMissing),
};
const { default: __VLS_203 } = __VLS_199.slots;
// @ts-ignore
[handleOpenMissing,];
var __VLS_199;
var __VLS_200;
// @ts-ignore
[];
var __VLS_193;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({}));
const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
const { default: __VLS_209 } = __VLS_207.slots;
let __VLS_210;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
    ...{ 'onClick': {} },
    type: "success",
    plain: true,
}));
const __VLS_212 = __VLS_211({
    ...{ 'onClick': {} },
    type: "success",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
let __VLS_215;
const __VLS_216 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleOpenImport),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:add') }, null, null);
const { default: __VLS_217 } = __VLS_213.slots;
// @ts-ignore
[vPermission, handleOpenImport,];
var __VLS_213;
var __VLS_214;
// @ts-ignore
[];
var __VLS_207;
let __VLS_218;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({}));
const __VLS_220 = __VLS_219({}, ...__VLS_functionalComponentArgsRest(__VLS_219));
const { default: __VLS_223 } = __VLS_221.slots;
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    ...{ 'onClick': {} },
    type: "warning",
    plain: true,
}));
const __VLS_226 = __VLS_225({
    ...{ 'onClick': {} },
    type: "warning",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
let __VLS_229;
const __VLS_230 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleOpenExport),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:view') }, null, null);
const { default: __VLS_231 } = __VLS_227.slots;
// @ts-ignore
[vPermission, handleOpenExport,];
var __VLS_227;
var __VLS_228;
// @ts-ignore
[];
var __VLS_221;
// @ts-ignore
[];
var __VLS_23;
if (__VLS_ctx.currentDirty > 0) {
    let __VLS_232;
    /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
    elAlert;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (`有 ${__VLS_ctx.currentDirty} 处翻译内容已修改但未保存，点击「批量保存」提交`),
        ...{ style: {} },
    }));
    const __VLS_234 = __VLS_233({
        type: "warning",
        closable: (false),
        showIcon: true,
        title: (`有 ${__VLS_ctx.currentDirty} 处翻译内容已修改但未保存，点击「批量保存」提交`),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
}
if (__VLS_ctx.viewMode === 'matrix') {
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        ...{ 'onSelectionChange': {} },
        data: (__VLS_ctx.groupData),
        border: true,
        stripe: true,
        maxHeight: "62vh",
        size: "small",
    }));
    const __VLS_239 = __VLS_238({
        ...{ 'onSelectionChange': {} },
        data: (__VLS_ctx.groupData),
        border: true,
        stripe: true,
        maxHeight: "62vh",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    let __VLS_242;
    const __VLS_243 = {
        ...{ selectionChange: {} },
        onSelectionChange: (__VLS_ctx.handleGroupSelectionChange),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    const { default: __VLS_244 } = __VLS_240.slots;
    let __VLS_245;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
        type: "selection",
        width: "44",
        fixed: true,
    }));
    const __VLS_247 = __VLS_246({
        type: "selection",
        width: "44",
        fixed: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        prop: "namespaceCode",
        label: "模块",
        width: "120",
        fixed: true,
        showOverflowTooltip: true,
    }));
    const __VLS_252 = __VLS_251({
        prop: "namespaceCode",
        label: "模块",
        width: "120",
        fixed: true,
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    let __VLS_255;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
        label: "翻译 Key",
        width: "210",
        fixed: true,
        showOverflowTooltip: true,
    }));
    const __VLS_257 = __VLS_256({
        label: "翻译 Key",
        width: "210",
        fixed: true,
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_256));
    const { default: __VLS_260 } = __VLS_258.slots;
    {
        const { default: __VLS_261 } = __VLS_258.slots;
        const [{ row }] = __VLS_vSlot(__VLS_261);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "key-cell" },
        });
        /** @type {__VLS_StyleScopedClasses['key-cell']} */ ;
        (row.translationKey);
        if (row.countryCode) {
            let __VLS_262;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
                size: "small",
                type: "info",
                effect: "plain",
            }));
            const __VLS_264 = __VLS_263({
                size: "small",
                type: "info",
                effect: "plain",
            }, ...__VLS_functionalComponentArgsRest(__VLS_263));
            const { default: __VLS_267 } = __VLS_265.slots;
            (row.countryCode);
            // @ts-ignore
            [viewMode, currentDirty, currentDirty, groupData, handleGroupSelectionChange, vLoading, loading,];
            var __VLS_265;
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_258;
    for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
        let __VLS_268;
        /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
        elTableColumn;
        // @ts-ignore
        const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
            key: (l.code),
            label: (`${l.nativeName || l.name} · ${l.code}`),
            minWidth: "200",
        }));
        const __VLS_270 = __VLS_269({
            key: (l.code),
            label: (`${l.nativeName || l.name} · ${l.code}`),
            minWidth: "200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_269));
        const { default: __VLS_273 } = __VLS_271.slots;
        {
            const { default: __VLS_274 } = __VLS_271.slots;
            const [{ row }] = __VLS_vSlot(__VLS_274);
            let __VLS_275;
            /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
            elInput;
            // @ts-ignore
            const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
                modelValue: (__VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)]),
                type: "textarea",
                autosize: ({ minRows: 1, maxRows: 4 }),
                placeholder: (row.values && row.values[l.code] ? '' : '缺失'),
                ...{ class: ({
                        'dirty-cell': __VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)] !== __VLS_ctx.matrixOriginal[__VLS_ctx.cellKey(row, l.code)],
                        'missing-cell': !__VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)],
                    }) },
            }));
            const __VLS_277 = __VLS_276({
                modelValue: (__VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)]),
                type: "textarea",
                autosize: ({ minRows: 1, maxRows: 4 }),
                placeholder: (row.values && row.values[l.code] ? '' : '缺失'),
                ...{ class: ({
                        'dirty-cell': __VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)] !== __VLS_ctx.matrixOriginal[__VLS_ctx.cellKey(row, l.code)],
                        'missing-cell': !__VLS_ctx.matrixEdit[__VLS_ctx.cellKey(row, l.code)],
                    }) },
            }, ...__VLS_functionalComponentArgsRest(__VLS_276));
            /** @type {__VLS_StyleScopedClasses['dirty-cell']} */ ;
            /** @type {__VLS_StyleScopedClasses['missing-cell']} */ ;
            // @ts-ignore
            [languageOptions, matrixEdit, matrixEdit, matrixEdit, cellKey, cellKey, cellKey, cellKey, matrixOriginal,];
        }
        // @ts-ignore
        [];
        var __VLS_271;
        // @ts-ignore
        [];
    }
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        label: "操作",
        width: "80",
        fixed: "right",
        align: "center",
    }));
    const __VLS_282 = __VLS_281({
        label: "操作",
        width: "80",
        fixed: "right",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const { default: __VLS_285 } = __VLS_283.slots;
    {
        const { default: __VLS_286 } = __VLS_283.slots;
        const [{ row }] = __VLS_vSlot(__VLS_286);
        let __VLS_287;
        /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
        elPopconfirm;
        // @ts-ignore
        const __VLS_288 = __VLS_asFunctionalComponent1(__VLS_287, new __VLS_287({
            ...{ 'onConfirm': {} },
            title: "删除该 Key 的全部语言翻译？",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }));
        const __VLS_289 = __VLS_288({
            ...{ 'onConfirm': {} },
            title: "删除该 Key 的全部语言翻译？",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }, ...__VLS_functionalComponentArgsRest(__VLS_288));
        let __VLS_292;
        const __VLS_293 = {
            ...{ confirm: {} },
            onConfirm: (...[$event]) => {
                if (!(__VLS_ctx.viewMode === 'matrix'))
                    return;
                __VLS_ctx.handleMatrixDelete(row);
                // @ts-ignore
                [handleMatrixDelete,];
            },
        };
        const { default: __VLS_294 } = __VLS_290.slots;
        {
            const { reference: __VLS_295 } = __VLS_290.slots;
            let __VLS_296;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
                link: true,
                type: "danger",
            }));
            const __VLS_298 = __VLS_297({
                link: true,
                type: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_297));
            __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:delete') }, null, null);
            const { default: __VLS_301 } = __VLS_299.slots;
            // @ts-ignore
            [vPermission,];
            var __VLS_299;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_290;
        var __VLS_291;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_283;
    {
        const { empty: __VLS_302 } = __VLS_240.slots;
        let __VLS_303;
        /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
        elEmpty;
        // @ts-ignore
        const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
            description: "暂无数据",
        }));
        const __VLS_305 = __VLS_304({
            description: "暂无数据",
        }, ...__VLS_functionalComponentArgsRest(__VLS_304));
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_240;
    var __VLS_241;
}
else {
    let __VLS_308;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
        ...{ 'onSelectionChange': {} },
        data: (__VLS_ctx.tableData),
        border: true,
        stripe: true,
    }));
    const __VLS_310 = __VLS_309({
        ...{ 'onSelectionChange': {} },
        data: (__VLS_ctx.tableData),
        border: true,
        stripe: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    let __VLS_313;
    const __VLS_314 = {
        ...{ selectionChange: {} },
        onSelectionChange: (__VLS_ctx.handleListSelectionChange),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    const { default: __VLS_315 } = __VLS_311.slots;
    let __VLS_316;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
        type: "selection",
        width: "44",
    }));
    const __VLS_318 = __VLS_317({
        type: "selection",
        width: "44",
    }, ...__VLS_functionalComponentArgsRest(__VLS_317));
    let __VLS_321;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_322 = __VLS_asFunctionalComponent1(__VLS_321, new __VLS_321({
        prop: "countryCode",
        label: "国家",
        width: "90",
    }));
    const __VLS_323 = __VLS_322({
        prop: "countryCode",
        label: "国家",
        width: "90",
    }, ...__VLS_functionalComponentArgsRest(__VLS_322));
    const { default: __VLS_326 } = __VLS_324.slots;
    {
        const { default: __VLS_327 } = __VLS_324.slots;
        const [{ row }] = __VLS_vSlot(__VLS_327);
        (row.countryCode || '通用');
        // @ts-ignore
        [vLoading, loading, tableData, handleListSelectionChange,];
    }
    // @ts-ignore
    [];
    var __VLS_324;
    let __VLS_328;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({
        prop: "languageCode",
        label: "语言",
        width: "100",
    }));
    const __VLS_330 = __VLS_329({
        prop: "languageCode",
        label: "语言",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    let __VLS_333;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
        prop: "namespaceCode",
        label: "模块",
        width: "130",
        showOverflowTooltip: true,
    }));
    const __VLS_335 = __VLS_334({
        prop: "namespaceCode",
        label: "模块",
        width: "130",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_334));
    let __VLS_338;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
        prop: "translationKey",
        label: "翻译 Key",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_340 = __VLS_339({
        prop: "translationKey",
        label: "翻译 Key",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_339));
    let __VLS_343;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
        label: "翻译内容",
        minWidth: "260",
    }));
    const __VLS_345 = __VLS_344({
        label: "翻译内容",
        minWidth: "260",
    }, ...__VLS_functionalComponentArgsRest(__VLS_344));
    const { default: __VLS_348 } = __VLS_346.slots;
    {
        const { default: __VLS_349 } = __VLS_346.slots;
        const [{ row }] = __VLS_vSlot(__VLS_349);
        let __VLS_350;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
            modelValue: (__VLS_ctx.editValues[row.id]),
            type: "textarea",
            autosize: ({ minRows: 1, maxRows: 4 }),
            ...{ class: ({ 'dirty-cell': __VLS_ctx.isDirty(row) }) },
        }));
        const __VLS_352 = __VLS_351({
            modelValue: (__VLS_ctx.editValues[row.id]),
            type: "textarea",
            autosize: ({ minRows: 1, maxRows: 4 }),
            ...{ class: ({ 'dirty-cell': __VLS_ctx.isDirty(row) }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_351));
        /** @type {__VLS_StyleScopedClasses['dirty-cell']} */ ;
        // @ts-ignore
        [editValues, isDirty,];
    }
    // @ts-ignore
    [];
    var __VLS_346;
    let __VLS_355;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_356 = __VLS_asFunctionalComponent1(__VLS_355, new __VLS_355({
        prop: "status",
        label: "状态",
        width: "90",
        align: "center",
    }));
    const __VLS_357 = __VLS_356({
        prop: "status",
        label: "状态",
        width: "90",
        align: "center",
    }, ...__VLS_functionalComponentArgsRest(__VLS_356));
    const { default: __VLS_360 } = __VLS_358.slots;
    {
        const { default: __VLS_361 } = __VLS_358.slots;
        const [{ row }] = __VLS_vSlot(__VLS_361);
        let __VLS_362;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_363 = __VLS_asFunctionalComponent1(__VLS_362, new __VLS_362({
            type: (row.status === 'ENABLE' ? 'success' : 'danger'),
        }));
        const __VLS_364 = __VLS_363({
            type: (row.status === 'ENABLE' ? 'success' : 'danger'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_363));
        const { default: __VLS_367 } = __VLS_365.slots;
        (row.status === 'ENABLE' ? '已启用' : '已禁用');
        // @ts-ignore
        [];
        var __VLS_365;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_358;
    let __VLS_368;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent1(__VLS_368, new __VLS_368({
        prop: "updatedAt",
        label: "更新时间",
        width: "160",
    }));
    const __VLS_370 = __VLS_369({
        prop: "updatedAt",
        label: "更新时间",
        width: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    let __VLS_373;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_374 = __VLS_asFunctionalComponent1(__VLS_373, new __VLS_373({
        label: "操作",
        width: "200",
        fixed: "right",
    }));
    const __VLS_375 = __VLS_374({
        label: "操作",
        width: "200",
        fixed: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_374));
    const { default: __VLS_378 } = __VLS_376.slots;
    {
        const { default: __VLS_379 } = __VLS_376.slots;
        const [{ row }] = __VLS_vSlot(__VLS_379);
        let __VLS_380;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_381 = __VLS_asFunctionalComponent1(__VLS_380, new __VLS_380({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_382 = __VLS_381({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_381));
        let __VLS_385;
        const __VLS_386 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.viewMode === 'matrix'))
                    return;
                __VLS_ctx.handleEdit(row);
                // @ts-ignore
                [handleEdit,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:edit') }, null, null);
        const { default: __VLS_387 } = __VLS_383.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_383;
        var __VLS_384;
        let __VLS_388;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_389 = __VLS_asFunctionalComponent1(__VLS_388, new __VLS_388({
            ...{ 'onClick': {} },
            link: true,
            type: (row.status === 'ENABLE' ? 'warning' : 'success'),
        }));
        const __VLS_390 = __VLS_389({
            ...{ 'onClick': {} },
            link: true,
            type: (row.status === 'ENABLE' ? 'warning' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_389));
        let __VLS_393;
        const __VLS_394 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.viewMode === 'matrix'))
                    return;
                __VLS_ctx.handleToggleStatus(row);
                // @ts-ignore
                [handleToggleStatus,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:edit') }, null, null);
        const { default: __VLS_395 } = __VLS_391.slots;
        (row.status === 'ENABLE' ? '禁用' : '启用');
        // @ts-ignore
        [vPermission,];
        var __VLS_391;
        var __VLS_392;
        let __VLS_396;
        /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
        elPopconfirm;
        // @ts-ignore
        const __VLS_397 = __VLS_asFunctionalComponent1(__VLS_396, new __VLS_396({
            ...{ 'onConfirm': {} },
            title: "确定要删除该翻译吗？",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }));
        const __VLS_398 = __VLS_397({
            ...{ 'onConfirm': {} },
            title: "确定要删除该翻译吗？",
            confirmButtonText: "确认",
            cancelButtonText: "取消",
        }, ...__VLS_functionalComponentArgsRest(__VLS_397));
        let __VLS_401;
        const __VLS_402 = {
            ...{ confirm: {} },
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.viewMode === 'matrix'))
                    return;
                __VLS_ctx.handleDelete(row);
                // @ts-ignore
                [handleDelete,];
            },
        };
        const { default: __VLS_403 } = __VLS_399.slots;
        {
            const { reference: __VLS_404 } = __VLS_399.slots;
            let __VLS_405;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
                link: true,
                type: "danger",
            }));
            const __VLS_407 = __VLS_406({
                link: true,
                type: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_406));
            __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:translation:delete') }, null, null);
            const { default: __VLS_410 } = __VLS_408.slots;
            // @ts-ignore
            [vPermission,];
            var __VLS_408;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_399;
        var __VLS_400;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_376;
    {
        const { empty: __VLS_411 } = __VLS_311.slots;
        let __VLS_412;
        /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
        elEmpty;
        // @ts-ignore
        const __VLS_413 = __VLS_asFunctionalComponent1(__VLS_412, new __VLS_412({
            description: "暂无数据",
        }));
        const __VLS_414 = __VLS_413({
            description: "暂无数据",
        }, ...__VLS_functionalComponentArgsRest(__VLS_413));
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_311;
    var __VLS_312;
}
let __VLS_417;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_418 = __VLS_asFunctionalComponent1(__VLS_417, new __VLS_417({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_419 = __VLS_418({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_418));
let __VLS_422;
const __VLS_423 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_420;
var __VLS_421;
let __VLS_424;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent1(__VLS_424, new __VLS_424({
    modelValue: (__VLS_ctx.matrixCreateVisible),
    title: "新增翻译 Key（一次配置多语言）",
    width: "720px",
}));
const __VLS_426 = __VLS_425({
    modelValue: (__VLS_ctx.matrixCreateVisible),
    title: "新增翻译 Key（一次配置多语言）",
    width: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
const { default: __VLS_429 } = __VLS_427.slots;
let __VLS_430;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_431 = __VLS_asFunctionalComponent1(__VLS_430, new __VLS_430({
    model: (__VLS_ctx.matrixForm),
    labelWidth: "90px",
}));
const __VLS_432 = __VLS_431({
    model: (__VLS_ctx.matrixForm),
    labelWidth: "90px",
}, ...__VLS_functionalComponentArgsRest(__VLS_431));
const { default: __VLS_435 } = __VLS_433.slots;
let __VLS_436;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_437 = __VLS_asFunctionalComponent1(__VLS_436, new __VLS_436({
    label: "模块",
    required: true,
}));
const __VLS_438 = __VLS_437({
    label: "模块",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_437));
const { default: __VLS_441 } = __VLS_439.slots;
let __VLS_442;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_443 = __VLS_asFunctionalComponent1(__VLS_442, new __VLS_442({
    modelValue: (__VLS_ctx.matrixForm.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_444 = __VLS_443({
    modelValue: (__VLS_ctx.matrixForm.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_443));
const { default: __VLS_447 } = __VLS_445.slots;
for (const [n] of __VLS_vFor((__VLS_ctx.namespaceOptions))) {
    let __VLS_448;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent1(__VLS_448, new __VLS_448({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }));
    const __VLS_450 = __VLS_449({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    // @ts-ignore
    [searchForm, searchForm, namespaceOptions, total, fetchData, matrixCreateVisible, matrixForm, matrixForm,];
}
// @ts-ignore
[];
var __VLS_445;
// @ts-ignore
[];
var __VLS_439;
let __VLS_453;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_454 = __VLS_asFunctionalComponent1(__VLS_453, new __VLS_453({
    label: "翻译 Key",
    required: true,
}));
const __VLS_455 = __VLS_454({
    label: "翻译 Key",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_454));
const { default: __VLS_458 } = __VLS_456.slots;
let __VLS_459;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_460 = __VLS_asFunctionalComponent1(__VLS_459, new __VLS_459({
    modelValue: (__VLS_ctx.matrixForm.translationKey),
    placeholder: "如 address.add",
}));
const __VLS_461 = __VLS_460({
    modelValue: (__VLS_ctx.matrixForm.translationKey),
    placeholder: "如 address.add",
}, ...__VLS_functionalComponentArgsRest(__VLS_460));
// @ts-ignore
[matrixForm,];
var __VLS_456;
let __VLS_464;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_465 = __VLS_asFunctionalComponent1(__VLS_464, new __VLS_464({
    label: "国家",
}));
const __VLS_466 = __VLS_465({
    label: "国家",
}, ...__VLS_functionalComponentArgsRest(__VLS_465));
const { default: __VLS_469 } = __VLS_467.slots;
let __VLS_470;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_471 = __VLS_asFunctionalComponent1(__VLS_470, new __VLS_470({
    modelValue: (__VLS_ctx.matrixForm.countryCode),
    placeholder: "留空表示通用（所有国家）",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}));
const __VLS_472 = __VLS_471({
    modelValue: (__VLS_ctx.matrixForm.countryCode),
    placeholder: "留空表示通用（所有国家）",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_471));
const { default: __VLS_475 } = __VLS_473.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_476;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_477 = __VLS_asFunctionalComponent1(__VLS_476, new __VLS_476({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }));
    const __VLS_478 = __VLS_477({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_477));
    // @ts-ignore
    [countryOptions, matrixForm,];
}
// @ts-ignore
[];
var __VLS_473;
// @ts-ignore
[];
var __VLS_467;
let __VLS_481;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_482 = __VLS_asFunctionalComponent1(__VLS_481, new __VLS_481({
    contentPosition: "left",
}));
const __VLS_483 = __VLS_482({
    contentPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_482));
const { default: __VLS_486 } = __VLS_484.slots;
// @ts-ignore
[];
var __VLS_484;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_487;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_488 = __VLS_asFunctionalComponent1(__VLS_487, new __VLS_487({
        key: (l.code),
        label: (l.code),
    }));
    const __VLS_489 = __VLS_488({
        key: (l.code),
        label: (l.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_488));
    const { default: __VLS_492 } = __VLS_490.slots;
    let __VLS_493;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
        modelValue: (__VLS_ctx.matrixValues[l.code]),
        placeholder: (`${l.nativeName || l.name}`),
    }));
    const __VLS_495 = __VLS_494({
        modelValue: (__VLS_ctx.matrixValues[l.code]),
        placeholder: (`${l.nativeName || l.name}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_494));
    const { default: __VLS_498 } = __VLS_496.slots;
    {
        const { prepend: __VLS_499 } = __VLS_496.slots;
        (l.nativeName || l.name);
        // @ts-ignore
        [languageOptions, matrixValues,];
    }
    // @ts-ignore
    [];
    var __VLS_496;
    // @ts-ignore
    [];
    var __VLS_490;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_433;
{
    const { footer: __VLS_500 } = __VLS_427.slots;
    let __VLS_501;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_502 = __VLS_asFunctionalComponent1(__VLS_501, new __VLS_501({
        ...{ 'onClick': {} },
    }));
    const __VLS_503 = __VLS_502({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_502));
    let __VLS_506;
    const __VLS_507 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.matrixCreateVisible = false;
            // @ts-ignore
            [matrixCreateVisible,];
        },
    };
    const { default: __VLS_508 } = __VLS_504.slots;
    // @ts-ignore
    [];
    var __VLS_504;
    var __VLS_505;
    let __VLS_509;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_510 = __VLS_asFunctionalComponent1(__VLS_509, new __VLS_509({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_511 = __VLS_510({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_510));
    let __VLS_514;
    const __VLS_515 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleMatrixCreate),
    };
    const { default: __VLS_516 } = __VLS_512.slots;
    // @ts-ignore
    [submitLoading, handleMatrixCreate,];
    var __VLS_512;
    var __VLS_513;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_427;
let __VLS_517;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_518 = __VLS_asFunctionalComponent1(__VLS_517, new __VLS_517({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑翻译' : '新增翻译'),
    width: "650px",
}));
const __VLS_519 = __VLS_518({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑翻译' : '新增翻译'),
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_518));
let __VLS_522;
const __VLS_523 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_524 } = __VLS_520.slots;
let __VLS_525;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_526 = __VLS_asFunctionalComponent1(__VLS_525, new __VLS_525({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "110px",
}));
const __VLS_527 = __VLS_526({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_526));
var __VLS_530;
const { default: __VLS_532 } = __VLS_528.slots;
let __VLS_533;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_534 = __VLS_asFunctionalComponent1(__VLS_533, new __VLS_533({
    label: "国家",
    prop: "countryCode",
}));
const __VLS_535 = __VLS_534({
    label: "国家",
    prop: "countryCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_534));
const { default: __VLS_538 } = __VLS_536.slots;
let __VLS_539;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_540 = __VLS_asFunctionalComponent1(__VLS_539, new __VLS_539({
    modelValue: (__VLS_ctx.form.countryCode),
    placeholder: "留空表示通用（所有国家）",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}));
const __VLS_541 = __VLS_540({
    modelValue: (__VLS_ctx.form.countryCode),
    placeholder: "留空表示通用（所有国家）",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_540));
const { default: __VLS_544 } = __VLS_542.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_545;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_546 = __VLS_asFunctionalComponent1(__VLS_545, new __VLS_545({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }));
    const __VLS_547 = __VLS_546({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_546));
    // @ts-ignore
    [countryOptions, dialogVisible, isEdit, resetForm, form, form, rules,];
}
// @ts-ignore
[];
var __VLS_542;
// @ts-ignore
[];
var __VLS_536;
let __VLS_550;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_551 = __VLS_asFunctionalComponent1(__VLS_550, new __VLS_550({
    label: "语言",
    prop: "languageCode",
}));
const __VLS_552 = __VLS_551({
    label: "语言",
    prop: "languageCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_551));
const { default: __VLS_555 } = __VLS_553.slots;
let __VLS_556;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_557 = __VLS_asFunctionalComponent1(__VLS_556, new __VLS_556({
    modelValue: (__VLS_ctx.form.languageCode),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_558 = __VLS_557({
    modelValue: (__VLS_ctx.form.languageCode),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_557));
const { default: __VLS_561 } = __VLS_559.slots;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_562;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_563 = __VLS_asFunctionalComponent1(__VLS_562, new __VLS_562({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }));
    const __VLS_564 = __VLS_563({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_563));
    // @ts-ignore
    [languageOptions, form,];
}
// @ts-ignore
[];
var __VLS_559;
// @ts-ignore
[];
var __VLS_553;
let __VLS_567;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_568 = __VLS_asFunctionalComponent1(__VLS_567, new __VLS_567({
    label: "模块",
    prop: "namespaceCode",
}));
const __VLS_569 = __VLS_568({
    label: "模块",
    prop: "namespaceCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_568));
const { default: __VLS_572 } = __VLS_570.slots;
let __VLS_573;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_574 = __VLS_asFunctionalComponent1(__VLS_573, new __VLS_573({
    modelValue: (__VLS_ctx.form.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_575 = __VLS_574({
    modelValue: (__VLS_ctx.form.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_574));
const { default: __VLS_578 } = __VLS_576.slots;
for (const [n] of __VLS_vFor((__VLS_ctx.namespaceOptions))) {
    let __VLS_579;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_580 = __VLS_asFunctionalComponent1(__VLS_579, new __VLS_579({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }));
    const __VLS_581 = __VLS_580({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_580));
    // @ts-ignore
    [namespaceOptions, form,];
}
// @ts-ignore
[];
var __VLS_576;
// @ts-ignore
[];
var __VLS_570;
let __VLS_584;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_585 = __VLS_asFunctionalComponent1(__VLS_584, new __VLS_584({
    label: "翻译 Key",
    prop: "translationKey",
}));
const __VLS_586 = __VLS_585({
    label: "翻译 Key",
    prop: "translationKey",
}, ...__VLS_functionalComponentArgsRest(__VLS_585));
const { default: __VLS_589 } = __VLS_587.slots;
let __VLS_590;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_591 = __VLS_asFunctionalComponent1(__VLS_590, new __VLS_590({
    modelValue: (__VLS_ctx.form.translationKey),
    placeholder: "如 button.save",
}));
const __VLS_592 = __VLS_591({
    modelValue: (__VLS_ctx.form.translationKey),
    placeholder: "如 button.save",
}, ...__VLS_functionalComponentArgsRest(__VLS_591));
// @ts-ignore
[form,];
var __VLS_587;
let __VLS_595;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_596 = __VLS_asFunctionalComponent1(__VLS_595, new __VLS_595({
    label: "翻译内容",
    prop: "textValue",
}));
const __VLS_597 = __VLS_596({
    label: "翻译内容",
    prop: "textValue",
}, ...__VLS_functionalComponentArgsRest(__VLS_596));
const { default: __VLS_600 } = __VLS_598.slots;
let __VLS_601;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_602 = __VLS_asFunctionalComponent1(__VLS_601, new __VLS_601({
    modelValue: (__VLS_ctx.form.textValue),
    type: "textarea",
    rows: (3),
    placeholder: "请输入翻译内容",
}));
const __VLS_603 = __VLS_602({
    modelValue: (__VLS_ctx.form.textValue),
    type: "textarea",
    rows: (3),
    placeholder: "请输入翻译内容",
}, ...__VLS_functionalComponentArgsRest(__VLS_602));
// @ts-ignore
[form,];
var __VLS_598;
let __VLS_606;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_607 = __VLS_asFunctionalComponent1(__VLS_606, new __VLS_606({
    label: "说明",
    prop: "description",
}));
const __VLS_608 = __VLS_607({
    label: "说明",
    prop: "description",
}, ...__VLS_functionalComponentArgsRest(__VLS_607));
const { default: __VLS_611 } = __VLS_609.slots;
let __VLS_612;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_613 = __VLS_asFunctionalComponent1(__VLS_612, new __VLS_612({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
    placeholder: "可选，用于备注该 Key 的用途",
}));
const __VLS_614 = __VLS_613({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (2),
    placeholder: "可选，用于备注该 Key 的用途",
}, ...__VLS_functionalComponentArgsRest(__VLS_613));
// @ts-ignore
[form,];
var __VLS_609;
let __VLS_617;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_618 = __VLS_asFunctionalComponent1(__VLS_617, new __VLS_617({
    label: "状态",
    prop: "status",
}));
const __VLS_619 = __VLS_618({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_618));
const { default: __VLS_622 } = __VLS_620.slots;
let __VLS_623;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_624 = __VLS_asFunctionalComponent1(__VLS_623, new __VLS_623({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_625 = __VLS_624({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_624));
const { default: __VLS_628 } = __VLS_626.slots;
let __VLS_629;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_630 = __VLS_asFunctionalComponent1(__VLS_629, new __VLS_629({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_631 = __VLS_630({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_630));
let __VLS_634;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_635 = __VLS_asFunctionalComponent1(__VLS_634, new __VLS_634({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_636 = __VLS_635({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_635));
// @ts-ignore
[form,];
var __VLS_626;
// @ts-ignore
[];
var __VLS_620;
// @ts-ignore
[];
var __VLS_528;
{
    const { footer: __VLS_639 } = __VLS_520.slots;
    let __VLS_640;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_641 = __VLS_asFunctionalComponent1(__VLS_640, new __VLS_640({
        ...{ 'onClick': {} },
    }));
    const __VLS_642 = __VLS_641({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_641));
    let __VLS_645;
    const __VLS_646 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_647 } = __VLS_643.slots;
    // @ts-ignore
    [];
    var __VLS_643;
    var __VLS_644;
    let __VLS_648;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_649 = __VLS_asFunctionalComponent1(__VLS_648, new __VLS_648({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_650 = __VLS_649({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_649));
    let __VLS_653;
    const __VLS_654 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_655 } = __VLS_651.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_651;
    var __VLS_652;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_520;
var __VLS_521;
let __VLS_656;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_657 = __VLS_asFunctionalComponent1(__VLS_656, new __VLS_656({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.importDialogVisible),
    title: "批量导入翻译",
    width: "600px",
}));
const __VLS_658 = __VLS_657({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.importDialogVisible),
    title: "批量导入翻译",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_657));
let __VLS_661;
const __VLS_662 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetImportForm),
};
const { default: __VLS_663 } = __VLS_659.slots;
let __VLS_664;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_665 = __VLS_asFunctionalComponent1(__VLS_664, new __VLS_664({
    ref: "importFormRef",
    model: (__VLS_ctx.importForm),
    rules: (__VLS_ctx.importRules),
    labelWidth: "110px",
}));
const __VLS_666 = __VLS_665({
    ref: "importFormRef",
    model: (__VLS_ctx.importForm),
    rules: (__VLS_ctx.importRules),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_665));
var __VLS_669;
const { default: __VLS_671 } = __VLS_667.slots;
let __VLS_672;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_673 = __VLS_asFunctionalComponent1(__VLS_672, new __VLS_672({
    label: "国家",
}));
const __VLS_674 = __VLS_673({
    label: "国家",
}, ...__VLS_functionalComponentArgsRest(__VLS_673));
const { default: __VLS_677 } = __VLS_675.slots;
let __VLS_678;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_679 = __VLS_asFunctionalComponent1(__VLS_678, new __VLS_678({
    modelValue: (__VLS_ctx.importForm.countryCode),
    placeholder: "留空表示通用",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}));
const __VLS_680 = __VLS_679({
    modelValue: (__VLS_ctx.importForm.countryCode),
    placeholder: "留空表示通用",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_679));
const { default: __VLS_683 } = __VLS_681.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.countryOptions))) {
    let __VLS_684;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_685 = __VLS_asFunctionalComponent1(__VLS_684, new __VLS_684({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }));
    const __VLS_686 = __VLS_685({
        key: (c.code),
        label: (`${c.name} (${c.code})`),
        value: (c.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_685));
    // @ts-ignore
    [countryOptions, importDialogVisible, resetImportForm, importForm, importForm, importRules,];
}
// @ts-ignore
[];
var __VLS_681;
// @ts-ignore
[];
var __VLS_675;
let __VLS_689;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_690 = __VLS_asFunctionalComponent1(__VLS_689, new __VLS_689({
    label: "语言",
    prop: "languageCode",
}));
const __VLS_691 = __VLS_690({
    label: "语言",
    prop: "languageCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_690));
const { default: __VLS_694 } = __VLS_692.slots;
let __VLS_695;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_696 = __VLS_asFunctionalComponent1(__VLS_695, new __VLS_695({
    modelValue: (__VLS_ctx.importForm.languageCode),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_697 = __VLS_696({
    modelValue: (__VLS_ctx.importForm.languageCode),
    placeholder: "请选择语言",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_696));
const { default: __VLS_700 } = __VLS_698.slots;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_701;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_702 = __VLS_asFunctionalComponent1(__VLS_701, new __VLS_701({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }));
    const __VLS_703 = __VLS_702({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_702));
    // @ts-ignore
    [languageOptions, importForm,];
}
// @ts-ignore
[];
var __VLS_698;
// @ts-ignore
[];
var __VLS_692;
let __VLS_706;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_707 = __VLS_asFunctionalComponent1(__VLS_706, new __VLS_706({
    label: "模块",
    prop: "namespaceCode",
}));
const __VLS_708 = __VLS_707({
    label: "模块",
    prop: "namespaceCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_707));
const { default: __VLS_711 } = __VLS_709.slots;
let __VLS_712;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_713 = __VLS_asFunctionalComponent1(__VLS_712, new __VLS_712({
    modelValue: (__VLS_ctx.importForm.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}));
const __VLS_714 = __VLS_713({
    modelValue: (__VLS_ctx.importForm.namespaceCode),
    placeholder: "请选择模块",
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_713));
const { default: __VLS_717 } = __VLS_715.slots;
for (const [n] of __VLS_vFor((__VLS_ctx.namespaceOptions))) {
    let __VLS_718;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_719 = __VLS_asFunctionalComponent1(__VLS_718, new __VLS_718({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }));
    const __VLS_720 = __VLS_719({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_719));
    // @ts-ignore
    [namespaceOptions, importForm,];
}
// @ts-ignore
[];
var __VLS_715;
// @ts-ignore
[];
var __VLS_709;
let __VLS_723;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_724 = __VLS_asFunctionalComponent1(__VLS_723, new __VLS_723({
    label: "覆盖已有",
}));
const __VLS_725 = __VLS_724({
    label: "覆盖已有",
}, ...__VLS_functionalComponentArgsRest(__VLS_724));
const { default: __VLS_728 } = __VLS_726.slots;
let __VLS_729;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_730 = __VLS_asFunctionalComponent1(__VLS_729, new __VLS_729({
    modelValue: (__VLS_ctx.importForm.overwrite),
}));
const __VLS_731 = __VLS_730({
    modelValue: (__VLS_ctx.importForm.overwrite),
}, ...__VLS_functionalComponentArgsRest(__VLS_730));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hint" },
});
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
// @ts-ignore
[importForm,];
var __VLS_726;
let __VLS_734;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_735 = __VLS_asFunctionalComponent1(__VLS_734, new __VLS_734({
    label: "JSON 内容",
    prop: "jsonText",
}));
const __VLS_736 = __VLS_735({
    label: "JSON 内容",
    prop: "jsonText",
}, ...__VLS_functionalComponentArgsRest(__VLS_735));
const { default: __VLS_739 } = __VLS_737.slots;
let __VLS_740;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_741 = __VLS_asFunctionalComponent1(__VLS_740, new __VLS_740({
    modelValue: (__VLS_ctx.importForm.jsonText),
    type: "textarea",
    rows: (10),
    placeholder: '{"button.save": "保存", "button.cancel": "取消"}',
}));
const __VLS_742 = __VLS_741({
    modelValue: (__VLS_ctx.importForm.jsonText),
    type: "textarea",
    rows: (10),
    placeholder: '{"button.save": "保存", "button.cancel": "取消"}',
}, ...__VLS_functionalComponentArgsRest(__VLS_741));
// @ts-ignore
[importForm,];
var __VLS_737;
// @ts-ignore
[];
var __VLS_667;
{
    const { footer: __VLS_745 } = __VLS_659.slots;
    let __VLS_746;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_747 = __VLS_asFunctionalComponent1(__VLS_746, new __VLS_746({
        ...{ 'onClick': {} },
    }));
    const __VLS_748 = __VLS_747({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_747));
    let __VLS_751;
    const __VLS_752 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.importDialogVisible = false;
            // @ts-ignore
            [importDialogVisible,];
        },
    };
    const { default: __VLS_753 } = __VLS_749.slots;
    // @ts-ignore
    [];
    var __VLS_749;
    var __VLS_750;
    let __VLS_754;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_755 = __VLS_asFunctionalComponent1(__VLS_754, new __VLS_754({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.importLoading),
    }));
    const __VLS_756 = __VLS_755({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.importLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_755));
    let __VLS_759;
    const __VLS_760 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleImport),
    };
    const { default: __VLS_761 } = __VLS_757.slots;
    // @ts-ignore
    [importLoading, handleImport,];
    var __VLS_757;
    var __VLS_758;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_659;
var __VLS_660;
let __VLS_762;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_763 = __VLS_asFunctionalComponent1(__VLS_762, new __VLS_762({
    modelValue: (__VLS_ctx.exportDialogVisible),
    title: "导出翻译",
    width: "600px",
}));
const __VLS_764 = __VLS_763({
    modelValue: (__VLS_ctx.exportDialogVisible),
    title: "导出翻译",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_763));
const { default: __VLS_767 } = __VLS_765.slots;
let __VLS_768;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_769 = __VLS_asFunctionalComponent1(__VLS_768, new __VLS_768({
    modelValue: (__VLS_ctx.exportJsonText),
    type: "textarea",
    rows: (15),
    readonly: true,
}));
const __VLS_770 = __VLS_769({
    modelValue: (__VLS_ctx.exportJsonText),
    type: "textarea",
    rows: (15),
    readonly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_769));
{
    const { footer: __VLS_773 } = __VLS_765.slots;
    let __VLS_774;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_775 = __VLS_asFunctionalComponent1(__VLS_774, new __VLS_774({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_776 = __VLS_775({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_775));
    let __VLS_779;
    const __VLS_780 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleCopyExport),
    };
    const { default: __VLS_781 } = __VLS_777.slots;
    // @ts-ignore
    [exportDialogVisible, exportJsonText, handleCopyExport,];
    var __VLS_777;
    var __VLS_778;
    let __VLS_782;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_783 = __VLS_asFunctionalComponent1(__VLS_782, new __VLS_782({
        ...{ 'onClick': {} },
    }));
    const __VLS_784 = __VLS_783({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_783));
    let __VLS_787;
    const __VLS_788 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.exportDialogVisible = false;
            // @ts-ignore
            [exportDialogVisible,];
        },
    };
    const { default: __VLS_789 } = __VLS_785.slots;
    // @ts-ignore
    [];
    var __VLS_785;
    var __VLS_786;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_765;
let __VLS_790;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_791 = __VLS_asFunctionalComponent1(__VLS_790, new __VLS_790({
    modelValue: (__VLS_ctx.missingDialogVisible),
    title: "缺失翻译检测",
    width: "700px",
}));
const __VLS_792 = __VLS_791({
    modelValue: (__VLS_ctx.missingDialogVisible),
    title: "缺失翻译检测",
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_791));
const { default: __VLS_795 } = __VLS_793.slots;
let __VLS_796;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_797 = __VLS_asFunctionalComponent1(__VLS_796, new __VLS_796({
    inline: (true),
    model: (__VLS_ctx.missingForm),
}));
const __VLS_798 = __VLS_797({
    inline: (true),
    model: (__VLS_ctx.missingForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_797));
const { default: __VLS_801 } = __VLS_799.slots;
let __VLS_802;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_803 = __VLS_asFunctionalComponent1(__VLS_802, new __VLS_802({
    label: "基准语言",
}));
const __VLS_804 = __VLS_803({
    label: "基准语言",
}, ...__VLS_functionalComponentArgsRest(__VLS_803));
const { default: __VLS_807 } = __VLS_805.slots;
let __VLS_808;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_809 = __VLS_asFunctionalComponent1(__VLS_808, new __VLS_808({
    modelValue: (__VLS_ctx.missingForm.baseLanguage),
    filterable: true,
    ...{ style: {} },
}));
const __VLS_810 = __VLS_809({
    modelValue: (__VLS_ctx.missingForm.baseLanguage),
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_809));
const { default: __VLS_813 } = __VLS_811.slots;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_814;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_815 = __VLS_asFunctionalComponent1(__VLS_814, new __VLS_814({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }));
    const __VLS_816 = __VLS_815({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_815));
    // @ts-ignore
    [languageOptions, missingDialogVisible, missingForm, missingForm,];
}
// @ts-ignore
[];
var __VLS_811;
// @ts-ignore
[];
var __VLS_805;
let __VLS_819;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_820 = __VLS_asFunctionalComponent1(__VLS_819, new __VLS_819({
    label: "目标语言",
}));
const __VLS_821 = __VLS_820({
    label: "目标语言",
}, ...__VLS_functionalComponentArgsRest(__VLS_820));
const { default: __VLS_824 } = __VLS_822.slots;
let __VLS_825;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_826 = __VLS_asFunctionalComponent1(__VLS_825, new __VLS_825({
    modelValue: (__VLS_ctx.missingForm.targetLanguage),
    filterable: true,
    ...{ style: {} },
}));
const __VLS_827 = __VLS_826({
    modelValue: (__VLS_ctx.missingForm.targetLanguage),
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_826));
const { default: __VLS_830 } = __VLS_828.slots;
for (const [l] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_831;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_832 = __VLS_asFunctionalComponent1(__VLS_831, new __VLS_831({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }));
    const __VLS_833 = __VLS_832({
        key: (l.code),
        label: (`${l.name} (${l.code})`),
        value: (l.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_832));
    // @ts-ignore
    [languageOptions, missingForm,];
}
// @ts-ignore
[];
var __VLS_828;
// @ts-ignore
[];
var __VLS_822;
let __VLS_836;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_837 = __VLS_asFunctionalComponent1(__VLS_836, new __VLS_836({
    label: "模块",
}));
const __VLS_838 = __VLS_837({
    label: "模块",
}, ...__VLS_functionalComponentArgsRest(__VLS_837));
const { default: __VLS_841 } = __VLS_839.slots;
let __VLS_842;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_843 = __VLS_asFunctionalComponent1(__VLS_842, new __VLS_842({
    modelValue: (__VLS_ctx.missingForm.namespaceCode),
    placeholder: "全部",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}));
const __VLS_844 = __VLS_843({
    modelValue: (__VLS_ctx.missingForm.namespaceCode),
    placeholder: "全部",
    clearable: true,
    filterable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_843));
const { default: __VLS_847 } = __VLS_845.slots;
for (const [n] of __VLS_vFor((__VLS_ctx.namespaceOptions))) {
    let __VLS_848;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_849 = __VLS_asFunctionalComponent1(__VLS_848, new __VLS_848({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }));
    const __VLS_850 = __VLS_849({
        key: (n.code),
        label: (n.code),
        value: (n.code),
    }, ...__VLS_functionalComponentArgsRest(__VLS_849));
    // @ts-ignore
    [namespaceOptions, missingForm,];
}
// @ts-ignore
[];
var __VLS_845;
// @ts-ignore
[];
var __VLS_839;
let __VLS_853;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_854 = __VLS_asFunctionalComponent1(__VLS_853, new __VLS_853({}));
const __VLS_855 = __VLS_854({}, ...__VLS_functionalComponentArgsRest(__VLS_854));
const { default: __VLS_858 } = __VLS_856.slots;
let __VLS_859;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_860 = __VLS_asFunctionalComponent1(__VLS_859, new __VLS_859({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.missingLoading),
}));
const __VLS_861 = __VLS_860({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.missingLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_860));
let __VLS_864;
const __VLS_865 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleDetectMissing),
};
const { default: __VLS_866 } = __VLS_862.slots;
// @ts-ignore
[missingLoading, handleDetectMissing,];
var __VLS_862;
var __VLS_863;
// @ts-ignore
[];
var __VLS_856;
// @ts-ignore
[];
var __VLS_799;
let __VLS_867;
/** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
elAlert;
// @ts-ignore
const __VLS_868 = __VLS_asFunctionalComponent1(__VLS_867, new __VLS_867({
    title: (`基准语言共 ${__VLS_ctx.missingBaseCount} 个 Key，目标语言缺失 ${__VLS_ctx.missingKeys.length} 个`),
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ style: {} },
}));
const __VLS_869 = __VLS_868({
    title: (`基准语言共 ${__VLS_ctx.missingBaseCount} 个 Key，目标语言缺失 ${__VLS_ctx.missingKeys.length} 个`),
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_868));
let __VLS_872;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_873 = __VLS_asFunctionalComponent1(__VLS_872, new __VLS_872({
    data: (__VLS_ctx.missingKeys),
    border: true,
    stripe: true,
    maxHeight: "360",
}));
const __VLS_874 = __VLS_873({
    data: (__VLS_ctx.missingKeys),
    border: true,
    stripe: true,
    maxHeight: "360",
}, ...__VLS_functionalComponentArgsRest(__VLS_873));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.missingLoading) }, null, null);
const { default: __VLS_877 } = __VLS_875.slots;
let __VLS_878;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_879 = __VLS_asFunctionalComponent1(__VLS_878, new __VLS_878({
    prop: "fullKey",
    label: "缺失的 Key",
    minWidth: "220",
    showOverflowTooltip: true,
}));
const __VLS_880 = __VLS_879({
    prop: "fullKey",
    label: "缺失的 Key",
    minWidth: "220",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_879));
let __VLS_883;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_884 = __VLS_asFunctionalComponent1(__VLS_883, new __VLS_883({
    label: "基准内容",
    minWidth: "220",
    showOverflowTooltip: true,
}));
const __VLS_885 = __VLS_884({
    label: "基准内容",
    minWidth: "220",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_884));
const { default: __VLS_888 } = __VLS_886.slots;
{
    const { default: __VLS_889 } = __VLS_886.slots;
    const [{ row }] = __VLS_vSlot(__VLS_889);
    (row.baseValue);
    // @ts-ignore
    [vLoading, missingLoading, missingBaseCount, missingKeys, missingKeys,];
}
// @ts-ignore
[];
var __VLS_886;
let __VLS_890;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_891 = __VLS_asFunctionalComponent1(__VLS_890, new __VLS_890({
    label: "操作",
    width: "100",
    fixed: "right",
}));
const __VLS_892 = __VLS_891({
    label: "操作",
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_891));
const { default: __VLS_895 } = __VLS_893.slots;
{
    const { default: __VLS_896 } = __VLS_893.slots;
    const [{ row }] = __VLS_vSlot(__VLS_896);
    let __VLS_897;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_898 = __VLS_asFunctionalComponent1(__VLS_897, new __VLS_897({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_899 = __VLS_898({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_898));
    let __VLS_902;
    const __VLS_903 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleFillMissing(row);
            // @ts-ignore
            [handleFillMissing,];
        },
    };
    const { default: __VLS_904 } = __VLS_900.slots;
    // @ts-ignore
    [];
    var __VLS_900;
    var __VLS_901;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_893;
{
    const { empty: __VLS_905 } = __VLS_875.slots;
    let __VLS_906;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_907 = __VLS_asFunctionalComponent1(__VLS_906, new __VLS_906({
        description: "无缺失，太棒了",
    }));
    const __VLS_908 = __VLS_907({
        description: "无缺失，太棒了",
    }, ...__VLS_functionalComponentArgsRest(__VLS_907));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_875;
{
    const { footer: __VLS_911 } = __VLS_793.slots;
    let __VLS_912;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_913 = __VLS_asFunctionalComponent1(__VLS_912, new __VLS_912({
        ...{ 'onClick': {} },
    }));
    const __VLS_914 = __VLS_913({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_913));
    let __VLS_917;
    const __VLS_918 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.missingDialogVisible = false;
            // @ts-ignore
            [missingDialogVisible,];
        },
    };
    const { default: __VLS_919 } = __VLS_915.slots;
    // @ts-ignore
    [];
    var __VLS_915;
    var __VLS_916;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_793;
// @ts-ignore
var __VLS_531 = __VLS_530, __VLS_670 = __VLS_669;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
