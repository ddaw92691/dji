/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { catalogApi } from '@/api/catalog';
import { categoryApi } from '@/api/category';
import { storage, STORAGE_KEYS } from '@/utils/storage';
defineOptions({ name: 'CatalogProductView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref('Create Product');
const submitLoading = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const formRef = ref();
const categoryOptions = ref([]);
const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/upload/image`;
const uploadHeaders = computed(() => ({
    Authorization: `Bearer ${storage.get(STORAGE_KEYS.TOKEN)}`,
}));
const searchForm = reactive({
    keyword: '',
    categoryId: null,
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    brand: 'DJI',
    name: '',
    model: '',
    categoryId: null,
    description: '',
    coverImage: '',
    merchantPrice: 0,
    salePrice: 0,
    originalPrice: 0,
    stockMode: 'PLATFORM_GLOBAL',
    globalStock: 0,
    sort: 0,
    translations: {},
    images: [],
});
function calcProfit() {
    // handled on server side; just for display
}
function resetForm() {
    form.brand = 'DJI';
    form.name = '';
    form.model = '';
    form.categoryId = null;
    form.description = '';
    form.coverImage = '';
    form.merchantPrice = 0;
    form.salePrice = 0;
    form.originalPrice = 0;
    form.stockMode = 'PLATFORM_GLOBAL';
    form.globalStock = 0;
    form.sort = 0;
    form.translations = {};
    form.images = [];
    isEdit.value = false;
    editId.value = null;
}
async function loadCategories() {
    try {
        const { data: res } = await categoryApi.getCategories({ page: 1, pageSize: 999 });
        if (res.code === 200)
            categoryOptions.value = res.data.list || [];
    }
    catch { /* ignore */ }
}
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await catalogApi.getProducts({
            keyword: searchForm.keyword || undefined,
            categoryId: searchForm.categoryId || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list;
            total.value = res.data.total;
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
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
function openCreate() {
    resetForm();
    dialogTitle.value = 'Create Product';
    dialogVisible.value = true;
}
function openEdit(row) {
    isEdit.value = true;
    editId.value = row.id;
    dialogTitle.value = 'Edit Product';
    form.brand = row.brand || 'DJI';
    form.name = row.name;
    form.model = row.model;
    form.categoryId = row.categoryId;
    form.description = row.description || '';
    form.coverImage = row.coverImage || '';
    form.merchantPrice = row.merchantPrice;
    form.salePrice = row.salePrice;
    form.originalPrice = row.originalPrice || 0;
    form.stockMode = row.stockMode;
    form.globalStock = row.globalStock;
    form.sort = row.sort || 0;
    form.translations = {};
    if (row.translations) {
        row.translations.forEach((t) => { form.translations[t.languageCode] = t.name; });
    }
    form.images = (row.images || []).map((img) => ({ imageUrl: img.imageUrl || img.url || '' })).filter((img) => img.imageUrl);
    dialogVisible.value = true;
}
async function handleSubmit() {
    submitLoading.value = true;
    try {
        const payload = {
            brand: form.brand || 'DJI',
            name: form.name,
            model: form.model,
            categoryId: form.categoryId,
            description: form.description,
            coverImage: form.coverImage,
            merchantPrice: form.merchantPrice,
            salePrice: form.salePrice,
            originalPrice: form.originalPrice,
            stockMode: form.stockMode,
            globalStock: form.globalStock,
            sort: form.sort,
            translations: Object.entries(form.translations).map(([lang, name]) => ({
                languageCode: lang,
                name,
            })),
            images: form.images.map((img) => typeof img === 'string' ? { url: img, sort: 0 } : { url: img.imageUrl, sort: 0 }),
        };
        if (isEdit.value && editId.value) {
            const { data: res } = await catalogApi.updateProduct(editId.value, payload);
            if (res.code === 200) {
                ElMessage.success('商品已更新，价格变更将通过 WebSocket 推送给商户');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '更新失败');
            }
        }
        else {
            const { data: res } = await catalogApi.createProduct(payload);
            if (res.code === 200) {
                ElMessage.success('商品已创建');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '创建失败');
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
        const { data: res } = await catalogApi.updateProductStatus(row.id, newStatus);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            fetchData();
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
        const { data: res } = await catalogApi.deleteProduct(row.id);
        if (res.code === 200) {
            ElMessage.success('已删除');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
}
function beforeUpload(file) {
    const isValid = file.type.startsWith('image/');
    if (!isValid)
        ElMessage.error('仅允许上传图片');
    return isValid;
}
function onCoverUpload(res) {
    if (res.code === 200 && res.data?.url) {
        form.coverImage = res.data.url;
    }
}
function onImageUpload(res) {
    if (res.code === 200 && res.data?.url) {
        form.images.push({ imageUrl: res.data.url });
    }
}
onMounted(async () => {
    await loadCategories();
    fetchData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['image-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "catalog-product-page" },
});
/** @type {__VLS_StyleScopedClasses['catalog-product-page']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.searchForm),
    ...{ class: "search-bar" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_15;
var __VLS_16;
// @ts-ignore
[searchForm, searchForm, handleSearch, handleSearch,];
var __VLS_9;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.categoryId),
    placeholder: "分类",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_32 } = __VLS_28.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.categoryOptions))) {
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }));
    const __VLS_35 = __VLS_34({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    // @ts-ignore
    [searchForm, handleSearch, categoryOptions,];
}
// @ts-ignore
[];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_22;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_51 } = __VLS_47.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_54 = __VLS_53({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_59 = __VLS_58({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_47;
var __VLS_48;
// @ts-ignore
[];
var __VLS_41;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_73;
const __VLS_74 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_75 } = __VLS_71.slots;
// @ts-ignore
[handleSearch,];
var __VLS_71;
var __VLS_72;
// @ts-ignore
[];
var __VLS_65;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_81 } = __VLS_79.slots;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_84 = __VLS_83({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
const __VLS_88 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:catalog:add') }, null, null);
const { default: __VLS_89 } = __VLS_85.slots;
// @ts-ignore
[openCreate, vPermission,];
var __VLS_85;
var __VLS_86;
// @ts-ignore
[];
var __VLS_79;
// @ts-ignore
[];
var __VLS_3;
let __VLS_90;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_92 = __VLS_91({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_95 } = __VLS_93.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    label: "封面",
    width: "80",
    align: "center",
}));
const __VLS_98 = __VLS_97({
    label: "封面",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
{
    const { default: __VLS_102 } = __VLS_99.slots;
    const [{ row }] = __VLS_vSlot(__VLS_102);
    if (row.coverImage) {
        let __VLS_103;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_105 = __VLS_104({
            src: (row.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_99;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "brand",
    label: "品牌",
    width: "80",
}));
const __VLS_110 = __VLS_109({
    prop: "brand",
    label: "品牌",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    prop: "name",
    label: "名称",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_115 = __VLS_114({
    prop: "name",
    label: "名称",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    prop: "model",
    label: "型号",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_120 = __VLS_119({
    prop: "model",
    label: "型号",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    prop: "categoryName",
    label: "分类",
    width: "110",
    showOverflowTooltip: true,
}));
const __VLS_125 = __VLS_124({
    prop: "categoryName",
    label: "分类",
    width: "110",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    prop: "merchantPrice",
    label: "货款成本",
    width: "100",
    align: "right",
}));
const __VLS_130 = __VLS_129({
    prop: "merchantPrice",
    label: "货款成本",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    prop: "salePrice",
    label: "售价",
    width: "100",
    align: "right",
}));
const __VLS_135 = __VLS_134({
    prop: "salePrice",
    label: "售价",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_138;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    prop: "profitAmount",
    label: "利润",
    width: "90",
    align: "right",
}));
const __VLS_140 = __VLS_139({
    prop: "profitAmount",
    label: "利润",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
let __VLS_143;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
    prop: "profitRate",
    label: "利润率",
    width: "100",
    align: "center",
}));
const __VLS_145 = __VLS_144({
    prop: "profitRate",
    label: "利润率",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
const { default: __VLS_148 } = __VLS_146.slots;
{
    const { default: __VLS_149 } = __VLS_146.slots;
    const [{ row }] = __VLS_vSlot(__VLS_149);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (row.profitRate ?? '-');
    (row.profitRate != null ? '%' : '');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_146;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    prop: "stockMode",
    label: "库存模式",
    width: "110",
    align: "center",
}));
const __VLS_152 = __VLS_151({
    prop: "stockMode",
    label: "库存模式",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
const { default: __VLS_155 } = __VLS_153.slots;
{
    const { default: __VLS_156 } = __VLS_153.slots;
    const [{ row }] = __VLS_vSlot(__VLS_156);
    let __VLS_157;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
        type: (row.stockMode === 'PLATFORM_GLOBAL' ? 'primary' : 'info'),
        size: "small",
    }));
    const __VLS_159 = __VLS_158({
        type: (row.stockMode === 'PLATFORM_GLOBAL' ? 'primary' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    const { default: __VLS_162 } = __VLS_160.slots;
    (row.stockMode);
    // @ts-ignore
    [];
    var __VLS_160;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_153;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    prop: "globalStock",
    label: "库存",
    width: "80",
    align: "center",
}));
const __VLS_165 = __VLS_164({
    prop: "globalStock",
    label: "库存",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
let __VLS_168;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_170 = __VLS_169({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
const { default: __VLS_173 } = __VLS_171.slots;
{
    const { default: __VLS_174 } = __VLS_171.slots;
    const [{ row }] = __VLS_vSlot(__VLS_174);
    let __VLS_175;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
        type: (row.status === 'ENABLE' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_177 = __VLS_176({
        type: (row.status === 'ENABLE' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    const { default: __VLS_180 } = __VLS_178.slots;
    (row.status === 'ENABLE' ? 'Enabled' : 'Disabled');
    // @ts-ignore
    [];
    var __VLS_178;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_171;
let __VLS_181;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_183 = __VLS_182({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
const { default: __VLS_186 } = __VLS_184.slots;
{
    const { default: __VLS_187 } = __VLS_184.slots;
    const [{ row }] = __VLS_vSlot(__VLS_187);
    let __VLS_188;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_190 = __VLS_189({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    let __VLS_193;
    const __VLS_194 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:catalog:edit') }, null, null);
    const { default: __VLS_195 } = __VLS_191.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_191;
    var __VLS_192;
    let __VLS_196;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
        ...{ 'onConfirm': {} },
        title: (`Toggle status to ${row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'}?`),
        placement: "top",
        width: "220",
    }));
    const __VLS_198 = __VLS_197({
        ...{ 'onConfirm': {} },
        title: (`Toggle status to ${row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE'}?`),
        placement: "top",
        width: "220",
    }, ...__VLS_functionalComponentArgsRest(__VLS_197));
    let __VLS_201;
    const __VLS_202 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    const { default: __VLS_203 } = __VLS_199.slots;
    {
        const { reference: __VLS_204 } = __VLS_199.slots;
        let __VLS_205;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
            link: true,
            type: (row.status === 'ENABLE' ? 'warning' : 'success'),
        }));
        const __VLS_207 = __VLS_206({
            link: true,
            type: (row.status === 'ENABLE' ? 'warning' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:catalog:edit') }, null, null);
        const { default: __VLS_210 } = __VLS_208.slots;
        (row.status === 'ENABLE' ? 'Disable' : 'Enable');
        // @ts-ignore
        [vPermission,];
        var __VLS_208;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_199;
    var __VLS_200;
    let __VLS_211;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
        ...{ 'onConfirm': {} },
        title: "确定要删除该商品吗？",
        placement: "top",
        width: "200",
    }));
    const __VLS_213 = __VLS_212({
        ...{ 'onConfirm': {} },
        title: "确定要删除该商品吗？",
        placement: "top",
        width: "200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    let __VLS_216;
    const __VLS_217 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_218 } = __VLS_214.slots;
    {
        const { reference: __VLS_219 } = __VLS_214.slots;
        let __VLS_220;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
            link: true,
            type: "danger",
        }));
        const __VLS_222 = __VLS_221({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:catalog:disable') }, null, null);
        const { default: __VLS_225 } = __VLS_223.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_223;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_214;
    var __VLS_215;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_184;
// @ts-ignore
[];
var __VLS_93;
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_228 = __VLS_227({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
let __VLS_231;
const __VLS_232 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_229;
var __VLS_230;
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogTitle),
    width: "750px",
}));
const __VLS_235 = __VLS_234({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogTitle),
    width: "750px",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
let __VLS_238;
const __VLS_239 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_240 } = __VLS_236.slots;
let __VLS_241;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent1(__VLS_241, new __VLS_241({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "130px",
}));
const __VLS_243 = __VLS_242({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
var __VLS_246;
const { default: __VLS_248 } = __VLS_244.slots;
let __VLS_249;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
    label: "品牌",
}));
const __VLS_251 = __VLS_250({
    label: "品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
const { default: __VLS_254 } = __VLS_252.slots;
let __VLS_255;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    modelValue: (__VLS_ctx.form.brand),
    placeholder: "Default: DJI",
}));
const __VLS_257 = __VLS_256({
    modelValue: (__VLS_ctx.form.brand),
    placeholder: "Default: DJI",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
// @ts-ignore
[searchForm, searchForm, total, fetchData, dialogVisible, dialogTitle, resetForm, form, form,];
var __VLS_252;
let __VLS_260;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
    label: "名称",
    required: true,
}));
const __VLS_262 = __VLS_261({
    label: "名称",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_261));
const { default: __VLS_265 } = __VLS_263.slots;
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "商品名称",
}));
const __VLS_268 = __VLS_267({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "商品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
// @ts-ignore
[form,];
var __VLS_263;
let __VLS_271;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
    label: "型号",
    required: true,
}));
const __VLS_273 = __VLS_272({
    label: "型号",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
const { default: __VLS_276 } = __VLS_274.slots;
let __VLS_277;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
    modelValue: (__VLS_ctx.form.model),
    placeholder: "商品型号",
}));
const __VLS_279 = __VLS_278({
    modelValue: (__VLS_ctx.form.model),
    placeholder: "商品型号",
}, ...__VLS_functionalComponentArgsRest(__VLS_278));
// @ts-ignore
[form,];
var __VLS_274;
let __VLS_282;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_283 = __VLS_asFunctionalComponent1(__VLS_282, new __VLS_282({
    label: "分类",
}));
const __VLS_284 = __VLS_283({
    label: "分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_283));
const { default: __VLS_287 } = __VLS_285.slots;
let __VLS_288;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
    modelValue: (__VLS_ctx.form.categoryId),
    placeholder: "请选择分类",
    filterable: true,
}));
const __VLS_290 = __VLS_289({
    modelValue: (__VLS_ctx.form.categoryId),
    placeholder: "请选择分类",
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_289));
const { default: __VLS_293 } = __VLS_291.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.categoryOptions))) {
    let __VLS_294;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }));
    const __VLS_296 = __VLS_295({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    // @ts-ignore
    [categoryOptions, form,];
}
// @ts-ignore
[];
var __VLS_291;
// @ts-ignore
[];
var __VLS_285;
let __VLS_299;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_300 = __VLS_asFunctionalComponent1(__VLS_299, new __VLS_299({
    label: "描述",
}));
const __VLS_301 = __VLS_300({
    label: "描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_300));
const { default: __VLS_304 } = __VLS_302.slots;
let __VLS_305;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent1(__VLS_305, new __VLS_305({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
    placeholder: "商品描述",
}));
const __VLS_307 = __VLS_306({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (3),
    placeholder: "商品描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_306));
// @ts-ignore
[form,];
var __VLS_302;
let __VLS_310;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
    label: "封面图",
}));
const __VLS_312 = __VLS_311({
    label: "封面图",
}, ...__VLS_functionalComponentArgsRest(__VLS_311));
const { default: __VLS_315 } = __VLS_313.slots;
let __VLS_316;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.onCoverUpload),
    beforeUpload: (__VLS_ctx.beforeUpload),
    showFileList: (false),
    accept: "image/*",
}));
const __VLS_318 = __VLS_317({
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.onCoverUpload),
    beforeUpload: (__VLS_ctx.beforeUpload),
    showFileList: (false),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const { default: __VLS_321 } = __VLS_319.slots;
let __VLS_322;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({}));
const __VLS_324 = __VLS_323({}, ...__VLS_functionalComponentArgsRest(__VLS_323));
const { default: __VLS_327 } = __VLS_325.slots;
// @ts-ignore
[uploadUrl, uploadHeaders, onCoverUpload, beforeUpload,];
var __VLS_325;
{
    const { tip: __VLS_328 } = __VLS_319.slots;
    if (__VLS_ctx.form.coverImage) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        let __VLS_329;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_330 = __VLS_asFunctionalComponent1(__VLS_329, new __VLS_329({
            src: (__VLS_ctx.form.coverImage),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_331 = __VLS_330({
            src: (__VLS_ctx.form.coverImage),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_330));
    }
    // @ts-ignore
    [form, form,];
}
// @ts-ignore
[];
var __VLS_319;
// @ts-ignore
[];
var __VLS_313;
let __VLS_334;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
    gutter: (16),
}));
const __VLS_336 = __VLS_335({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
const { default: __VLS_339 } = __VLS_337.slots;
let __VLS_340;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
    span: (8),
}));
const __VLS_342 = __VLS_341({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
const { default: __VLS_345 } = __VLS_343.slots;
let __VLS_346;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
    label: "货款成本",
}));
const __VLS_348 = __VLS_347({
    label: "货款成本",
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
const { default: __VLS_351 } = __VLS_349.slots;
let __VLS_352;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.merchantPrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_354 = __VLS_353({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.merchantPrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_353));
let __VLS_357;
const __VLS_358 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.calcProfit),
};
var __VLS_355;
var __VLS_356;
// @ts-ignore
[form, calcProfit,];
var __VLS_349;
// @ts-ignore
[];
var __VLS_343;
let __VLS_359;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
    span: (8),
}));
const __VLS_361 = __VLS_360({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
const { default: __VLS_364 } = __VLS_362.slots;
let __VLS_365;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_366 = __VLS_asFunctionalComponent1(__VLS_365, new __VLS_365({
    label: "售价",
}));
const __VLS_367 = __VLS_366({
    label: "售价",
}, ...__VLS_functionalComponentArgsRest(__VLS_366));
const { default: __VLS_370 } = __VLS_368.slots;
let __VLS_371;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_372 = __VLS_asFunctionalComponent1(__VLS_371, new __VLS_371({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.salePrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_373 = __VLS_372({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.salePrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_372));
let __VLS_376;
const __VLS_377 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.calcProfit),
};
var __VLS_374;
var __VLS_375;
// @ts-ignore
[form, calcProfit,];
var __VLS_368;
// @ts-ignore
[];
var __VLS_362;
let __VLS_378;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
    span: (8),
}));
const __VLS_380 = __VLS_379({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_379));
const { default: __VLS_383 } = __VLS_381.slots;
let __VLS_384;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
    label: "原价",
}));
const __VLS_386 = __VLS_385({
    label: "原价",
}, ...__VLS_functionalComponentArgsRest(__VLS_385));
const { default: __VLS_389 } = __VLS_387.slots;
let __VLS_390;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_391 = __VLS_asFunctionalComponent1(__VLS_390, new __VLS_390({
    modelValue: (__VLS_ctx.form.originalPrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_392 = __VLS_391({
    modelValue: (__VLS_ctx.form.originalPrice),
    min: (0),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_391));
// @ts-ignore
[form,];
var __VLS_387;
// @ts-ignore
[];
var __VLS_381;
// @ts-ignore
[];
var __VLS_337;
let __VLS_395;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({
    gutter: (16),
}));
const __VLS_397 = __VLS_396({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_396));
const { default: __VLS_400 } = __VLS_398.slots;
let __VLS_401;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_402 = __VLS_asFunctionalComponent1(__VLS_401, new __VLS_401({
    span: (8),
}));
const __VLS_403 = __VLS_402({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_402));
const { default: __VLS_406 } = __VLS_404.slots;
let __VLS_407;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_408 = __VLS_asFunctionalComponent1(__VLS_407, new __VLS_407({
    label: "库存模式",
}));
const __VLS_409 = __VLS_408({
    label: "库存模式",
}, ...__VLS_functionalComponentArgsRest(__VLS_408));
const { default: __VLS_412 } = __VLS_410.slots;
let __VLS_413;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_414 = __VLS_asFunctionalComponent1(__VLS_413, new __VLS_413({
    modelValue: (__VLS_ctx.form.stockMode),
}));
const __VLS_415 = __VLS_414({
    modelValue: (__VLS_ctx.form.stockMode),
}, ...__VLS_functionalComponentArgsRest(__VLS_414));
const { default: __VLS_418 } = __VLS_416.slots;
let __VLS_419;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_420 = __VLS_asFunctionalComponent1(__VLS_419, new __VLS_419({
    label: "全局",
    value: "PLATFORM_GLOBAL",
}));
const __VLS_421 = __VLS_420({
    label: "全局",
    value: "PLATFORM_GLOBAL",
}, ...__VLS_functionalComponentArgsRest(__VLS_420));
let __VLS_424;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_425 = __VLS_asFunctionalComponent1(__VLS_424, new __VLS_424({
    label: "每商户",
    value: "MERCHANT_STOCK",
}));
const __VLS_426 = __VLS_425({
    label: "每商户",
    value: "MERCHANT_STOCK",
}, ...__VLS_functionalComponentArgsRest(__VLS_425));
// @ts-ignore
[form,];
var __VLS_416;
// @ts-ignore
[];
var __VLS_410;
// @ts-ignore
[];
var __VLS_404;
let __VLS_429;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_430 = __VLS_asFunctionalComponent1(__VLS_429, new __VLS_429({
    span: (8),
}));
const __VLS_431 = __VLS_430({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_430));
const { default: __VLS_434 } = __VLS_432.slots;
let __VLS_435;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_436 = __VLS_asFunctionalComponent1(__VLS_435, new __VLS_435({
    label: "全局库存",
}));
const __VLS_437 = __VLS_436({
    label: "全局库存",
}, ...__VLS_functionalComponentArgsRest(__VLS_436));
const { default: __VLS_440 } = __VLS_438.slots;
let __VLS_441;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_442 = __VLS_asFunctionalComponent1(__VLS_441, new __VLS_441({
    modelValue: (__VLS_ctx.form.globalStock),
    min: (0),
    ...{ style: {} },
}));
const __VLS_443 = __VLS_442({
    modelValue: (__VLS_ctx.form.globalStock),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_442));
// @ts-ignore
[form,];
var __VLS_438;
// @ts-ignore
[];
var __VLS_432;
let __VLS_446;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_447 = __VLS_asFunctionalComponent1(__VLS_446, new __VLS_446({
    span: (8),
}));
const __VLS_448 = __VLS_447({
    span: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_447));
const { default: __VLS_451 } = __VLS_449.slots;
let __VLS_452;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({
    label: "排序",
}));
const __VLS_454 = __VLS_453({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_453));
const { default: __VLS_457 } = __VLS_455.slots;
let __VLS_458;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_459 = __VLS_asFunctionalComponent1(__VLS_458, new __VLS_458({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_460 = __VLS_459({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_459));
// @ts-ignore
[form,];
var __VLS_455;
// @ts-ignore
[];
var __VLS_449;
// @ts-ignore
[];
var __VLS_398;
let __VLS_463;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_464 = __VLS_asFunctionalComponent1(__VLS_463, new __VLS_463({}));
const __VLS_465 = __VLS_464({}, ...__VLS_functionalComponentArgsRest(__VLS_464));
const { default: __VLS_468 } = __VLS_466.slots;
// @ts-ignore
[];
var __VLS_466;
let __VLS_469;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_470 = __VLS_asFunctionalComponent1(__VLS_469, new __VLS_469({
    gutter: (12),
}));
const __VLS_471 = __VLS_470({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_470));
const { default: __VLS_474 } = __VLS_472.slots;
for (const [lang] of __VLS_vFor((['ja', 'ko', 'en']))) {
    let __VLS_475;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_476 = __VLS_asFunctionalComponent1(__VLS_475, new __VLS_475({
        span: (8),
        key: (lang),
    }));
    const __VLS_477 = __VLS_476({
        span: (8),
        key: (lang),
    }, ...__VLS_functionalComponentArgsRest(__VLS_476));
    const { default: __VLS_480 } = __VLS_478.slots;
    let __VLS_481;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_482 = __VLS_asFunctionalComponent1(__VLS_481, new __VLS_481({
        label: (lang.toUpperCase()),
    }));
    const __VLS_483 = __VLS_482({
        label: (lang.toUpperCase()),
    }, ...__VLS_functionalComponentArgsRest(__VLS_482));
    const { default: __VLS_486 } = __VLS_484.slots;
    let __VLS_487;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_488 = __VLS_asFunctionalComponent1(__VLS_487, new __VLS_487({
        modelValue: (__VLS_ctx.form.translations[lang]),
        placeholder: (`${lang} name`),
    }));
    const __VLS_489 = __VLS_488({
        modelValue: (__VLS_ctx.form.translations[lang]),
        placeholder: (`${lang} name`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_488));
    // @ts-ignore
    [form,];
    var __VLS_484;
    // @ts-ignore
    [];
    var __VLS_478;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_472;
let __VLS_492;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_493 = __VLS_asFunctionalComponent1(__VLS_492, new __VLS_492({}));
const __VLS_494 = __VLS_493({}, ...__VLS_functionalComponentArgsRest(__VLS_493));
const { default: __VLS_497 } = __VLS_495.slots;
// @ts-ignore
[];
var __VLS_495;
let __VLS_498;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_499 = __VLS_asFunctionalComponent1(__VLS_498, new __VLS_498({
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.onImageUpload),
    beforeUpload: (__VLS_ctx.beforeUpload),
    showFileList: (false),
    accept: "image/*",
    multiple: true,
}));
const __VLS_500 = __VLS_499({
    action: (__VLS_ctx.uploadUrl),
    headers: (__VLS_ctx.uploadHeaders),
    onSuccess: (__VLS_ctx.onImageUpload),
    beforeUpload: (__VLS_ctx.beforeUpload),
    showFileList: (false),
    accept: "image/*",
    multiple: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_499));
const { default: __VLS_503 } = __VLS_501.slots;
let __VLS_504;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({}));
const __VLS_506 = __VLS_505({}, ...__VLS_functionalComponentArgsRest(__VLS_505));
const { default: __VLS_509 } = __VLS_507.slots;
// @ts-ignore
[uploadUrl, uploadHeaders, beforeUpload, onImageUpload,];
var __VLS_507;
// @ts-ignore
[];
var __VLS_501;
if (__VLS_ctx.form.images.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "images-preview" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['images-preview']} */ ;
    for (const [img, idx] of __VLS_vFor((__VLS_ctx.form.images))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (idx),
            ...{ class: "image-item" },
        });
        /** @type {__VLS_StyleScopedClasses['image-item']} */ ;
        let __VLS_510;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_511 = __VLS_asFunctionalComponent1(__VLS_510, new __VLS_510({
            src: (typeof img === 'string' ? img : img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_512 = __VLS_511({
            src: (typeof img === 'string' ? img : img.imageUrl),
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_511));
        let __VLS_515;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_516 = __VLS_asFunctionalComponent1(__VLS_515, new __VLS_515({
            ...{ 'onClick': {} },
            circle: true,
            size: "small",
            type: "danger",
        }));
        const __VLS_517 = __VLS_516({
            ...{ 'onClick': {} },
            circle: true,
            size: "small",
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_516));
        let __VLS_520;
        const __VLS_521 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.images.length))
                    return;
                __VLS_ctx.form.images.splice(idx, 1);
                // @ts-ignore
                [form, form, form,];
            },
        };
        const { default: __VLS_522 } = __VLS_518.slots;
        // @ts-ignore
        [];
        var __VLS_518;
        var __VLS_519;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
var __VLS_244;
{
    const { footer: __VLS_523 } = __VLS_236.slots;
    let __VLS_524;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent1(__VLS_524, new __VLS_524({
        ...{ 'onClick': {} },
    }));
    const __VLS_526 = __VLS_525({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_525));
    let __VLS_529;
    const __VLS_530 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_531 } = __VLS_527.slots;
    // @ts-ignore
    [];
    var __VLS_527;
    var __VLS_528;
    let __VLS_532;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_533 = __VLS_asFunctionalComponent1(__VLS_532, new __VLS_532({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_534 = __VLS_533({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_533));
    let __VLS_537;
    const __VLS_538 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_539 } = __VLS_535.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_535;
    var __VLS_536;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_236;
var __VLS_237;
// @ts-ignore
var __VLS_247 = __VLS_246;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
