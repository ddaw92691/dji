/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { taxApi } from '@/api/tax';
defineOptions({ name: 'TaxMerchantView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const statusColors = {
    PENDING: 'warning',
    OVERDUE: 'danger',
    PAID: 'success',
    SUBMITTED: 'primary',
    CANCELLED: 'info',
};
const taxTypeColors = {
    SALES_TAX: 'primary',
    INCOME_TAX: 'warning',
    PLATFORM_FEE: 'danger',
    OTHER: 'info',
};
const searchForm = reactive({
    merchantId: '',
    status: '',
    taxType: '',
    page: 1,
    pageSize: 20,
});
const createVisible = ref(false);
const createLoading = ref(false);
const merchantLoading = ref(false);
const merchantOptions = ref([]);
const createFormRef = ref();
const createForm = reactive({
    merchantId: null,
    title: '',
    content: '',
    taxType: 'OTHER',
    amount: 0,
    currency: 'JPY',
    dueAt: '',
    forcePopup: false,
    blockUntilPaid: false,
});
const detailVisible = ref(false);
const detailItem = ref(null);
const reviewRejectVisible = ref(false);
const reviewTarget = ref(null);
const rejectReason = ref('');
const reviewLoading = ref(false);
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await taxApi.getTaxNotices({
            merchantId: searchForm.merchantId || undefined,
            status: searchForm.status || undefined,
            taxType: searchForm.taxType || undefined,
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
    resetCreateForm();
    createVisible.value = true;
}
function resetCreateForm() {
    createForm.merchantId = null;
    createForm.title = '';
    createForm.content = '';
    createForm.taxType = 'OTHER';
    createForm.amount = 0;
    createForm.currency = 'JPY';
    createForm.dueAt = '';
    createForm.forcePopup = false;
    createForm.blockUntilPaid = false;
}
async function searchMerchants(query) {
    if (!query)
        return;
    merchantLoading.value = true;
    try {
        const { default: request } = await import('@/utils/request');
        const { data: res } = await request.get('/admin/merchants', { params: { keyword: query, pageSize: 20 } });
        if (res.code === 200)
            merchantOptions.value = res.data?.list || [];
    }
    catch {
        /* ignore */
    }
    finally {
        merchantLoading.value = false;
    }
}
async function handleCreate() {
    if (!createForm.merchantId || !createForm.title) {
        ElMessage.warning('商户和标题为必填项');
        return;
    }
    createLoading.value = true;
    try {
        const { data: res } = await taxApi.createTaxNotice({
            merchantId: createForm.merchantId,
            title: createForm.title,
            content: createForm.content,
            taxType: createForm.taxType,
            amount: createForm.amount,
            currency: createForm.currency,
            dueAt: createForm.dueAt || undefined,
            forcePopup: createForm.forcePopup,
            blockUntilPaid: createForm.blockUntilPaid,
        });
        if (res.code === 200) {
            ElMessage.success('税务通知已创建');
            createVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '创建失败');
        }
    }
    catch {
        ElMessage.error('创建失败');
    }
    finally {
        createLoading.value = false;
    }
}
function openDetail(row) {
    detailItem.value = row;
    detailVisible.value = true;
}
async function handleCancel(row) {
    try {
        const { data: res } = await taxApi.cancelTaxNotice(row.id);
        if (res.code === 200) {
            ElMessage.success('通知已取消');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '取消失败');
        }
    }
    catch {
        ElMessage.error('取消失败');
    }
}
function openRejectReview(row) {
    reviewRejectVisible.value = true;
    reviewTarget.value = row;
}
async function handleReview(row, approved) {
    reviewLoading.value = true;
    try {
        const { data: res } = await taxApi.reviewTaxNotice(row.id, {
            approved,
            rejectReason: approved ? undefined : rejectReason.value,
        });
        if (res.code === 200) {
            ElMessage.success(approved ? 'Proof approved' : 'Proof rejected');
            reviewRejectVisible.value = false;
            rejectReason.value = '';
            detailVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '审核失败');
        }
    }
    catch {
        ElMessage.error('审核失败');
    }
    finally {
        reviewLoading.value = false;
    }
}
onMounted(() => {
    fetchData();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tax-merchant-page" },
});
/** @type {__VLS_StyleScopedClasses['tax-merchant-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
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
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_32 } = __VLS_28.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: "待处理",
    value: "PENDING",
}));
const __VLS_35 = __VLS_34({
    label: "待处理",
    value: "PENDING",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: "已逾期",
    value: "OVERDUE",
}));
const __VLS_40 = __VLS_39({
    label: "已逾期",
    value: "OVERDUE",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: "已支付",
    value: "PAID",
}));
const __VLS_45 = __VLS_44({
    label: "已支付",
    value: "PAID",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    label: "已提交",
    value: "SUBMITTED",
}));
const __VLS_50 = __VLS_49({
    label: "已提交",
    value: "SUBMITTED",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    label: "已取消",
    value: "CANCELLED",
}));
const __VLS_55 = __VLS_54({
    label: "已取消",
    value: "CANCELLED",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_22;
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
    modelValue: (__VLS_ctx.searchForm.taxType),
    placeholder: "税种",
    clearable: true,
}));
const __VLS_66 = __VLS_65({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.taxType),
    placeholder: "税种",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
const __VLS_70 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_71 } = __VLS_67.slots;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    label: "销售税",
    value: "SALES_TAX",
}));
const __VLS_74 = __VLS_73({
    label: "销售税",
    value: "SALES_TAX",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    label: "所得税",
    value: "INCOME_TAX",
}));
const __VLS_79 = __VLS_78({
    label: "所得税",
    value: "INCOME_TAX",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    label: "平台费用",
    value: "PLATFORM_FEE",
}));
const __VLS_84 = __VLS_83({
    label: "平台费用",
    value: "PLATFORM_FEE",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    label: "其他",
    value: "OTHER",
}));
const __VLS_89 = __VLS_88({
    label: "其他",
    value: "OTHER",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_67;
var __VLS_68;
// @ts-ignore
[];
var __VLS_61;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_97 } = __VLS_95.slots;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_100 = __VLS_99({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
const __VLS_104 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_105 } = __VLS_101.slots;
// @ts-ignore
[handleSearch,];
var __VLS_101;
var __VLS_102;
// @ts-ignore
[];
var __VLS_95;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:tax:create') }, null, null);
const { default: __VLS_119 } = __VLS_115.slots;
// @ts-ignore
[openCreate, vPermission,];
var __VLS_115;
var __VLS_116;
// @ts-ignore
[];
var __VLS_109;
// @ts-ignore
[];
var __VLS_3;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_122 = __VLS_121({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_125 } = __VLS_123.slots;
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_128 = __VLS_127({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    prop: "merchantName",
    label: "商户",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_133 = __VLS_132({
    prop: "merchantName",
    label: "商户",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_138 = __VLS_137({
    prop: "title",
    label: "标题",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    prop: "taxType",
    label: "类型",
    width: "110",
    align: "center",
}));
const __VLS_143 = __VLS_142({
    prop: "taxType",
    label: "类型",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
const { default: __VLS_146 } = __VLS_144.slots;
{
    const { default: __VLS_147 } = __VLS_144.slots;
    const [{ row }] = __VLS_vSlot(__VLS_147);
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        type: (__VLS_ctx.taxTypeColors[row.taxType] || 'info'),
        size: "small",
    }));
    const __VLS_150 = __VLS_149({
        type: (__VLS_ctx.taxTypeColors[row.taxType] || 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    const { default: __VLS_153 } = __VLS_151.slots;
    (row.taxType);
    // @ts-ignore
    [tableData, vLoading, loading, taxTypeColors,];
    var __VLS_151;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_144;
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    prop: "amount",
    label: "金额",
    width: "100",
    align: "right",
}));
const __VLS_156 = __VLS_155({
    prop: "amount",
    label: "金额",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    prop: "currency",
    label: "货币",
    width: "80",
    align: "center",
}));
const __VLS_161 = __VLS_160({
    prop: "currency",
    label: "货币",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    prop: "status",
    label: "状态",
    width: "110",
    align: "center",
}));
const __VLS_166 = __VLS_165({
    prop: "status",
    label: "状态",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
const { default: __VLS_169 } = __VLS_167.slots;
{
    const { default: __VLS_170 } = __VLS_167.slots;
    const [{ row }] = __VLS_vSlot(__VLS_170);
    let __VLS_171;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_172 = __VLS_asFunctionalComponent1(__VLS_171, new __VLS_171({
        type: (__VLS_ctx.statusColors[row.status] || 'info'),
        size: "small",
    }));
    const __VLS_173 = __VLS_172({
        type: (__VLS_ctx.statusColors[row.status] || 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_172));
    const { default: __VLS_176 } = __VLS_174.slots;
    (row.status);
    // @ts-ignore
    [statusColors,];
    var __VLS_174;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_167;
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    label: "标记",
    width: "130",
    align: "center",
}));
const __VLS_179 = __VLS_178({
    label: "标记",
    width: "130",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
const { default: __VLS_182 } = __VLS_180.slots;
{
    const { default: __VLS_183 } = __VLS_180.slots;
    const [{ row }] = __VLS_vSlot(__VLS_183);
    if (row.forcePopup) {
        let __VLS_184;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
            type: "warning",
            size: "small",
            effect: "dark",
        }));
        const __VLS_186 = __VLS_185({
            type: "warning",
            size: "small",
            effect: "dark",
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        const { default: __VLS_189 } = __VLS_187.slots;
        // @ts-ignore
        [];
        var __VLS_187;
    }
    if (row.blockUntilPaid) {
        let __VLS_190;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
            type: "danger",
            size: "small",
            effect: "dark",
            ...{ style: {} },
        }));
        const __VLS_192 = __VLS_191({
            type: "danger",
            size: "small",
            effect: "dark",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        const { default: __VLS_195 } = __VLS_193.slots;
        // @ts-ignore
        [];
        var __VLS_193;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_180;
let __VLS_196;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    prop: "dueAt",
    label: "应缴",
    width: "160",
}));
const __VLS_198 = __VLS_197({
    prop: "dueAt",
    label: "应缴",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_203 = __VLS_202({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
const { default: __VLS_206 } = __VLS_204.slots;
{
    const { default: __VLS_207 } = __VLS_204.slots;
    const [{ row }] = __VLS_vSlot(__VLS_207);
    let __VLS_208;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_210 = __VLS_209({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_209));
    let __VLS_213;
    const __VLS_214 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:tax:view') }, null, null);
    const { default: __VLS_215 } = __VLS_211.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_211;
    var __VLS_212;
    if (row.status === 'PENDING' || row.status === 'OVERDUE') {
        let __VLS_216;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }));
        const __VLS_218 = __VLS_217({
            ...{ 'onClick': {} },
            link: true,
            type: "warning",
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        let __VLS_221;
        const __VLS_222 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING' || row.status === 'OVERDUE'))
                    return;
                __VLS_ctx.handleCancel(row);
                // @ts-ignore
                [handleCancel,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:tax:create') }, null, null);
        const { default: __VLS_223 } = __VLS_219.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_219;
        var __VLS_220;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_204;
// @ts-ignore
[];
var __VLS_123;
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_226 = __VLS_225({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
let __VLS_229;
const __VLS_230 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_227;
var __VLS_228;
let __VLS_231;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "新建税务通知",
    width: "600px",
}));
const __VLS_233 = __VLS_232({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.createVisible),
    title: "新建税务通知",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
let __VLS_236;
const __VLS_237 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetCreateForm),
};
const { default: __VLS_238 } = __VLS_234.slots;
let __VLS_239;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
    ref: "createFormRef",
    model: (__VLS_ctx.createForm),
    labelWidth: "130px",
}));
const __VLS_241 = __VLS_240({
    ref: "createFormRef",
    model: (__VLS_ctx.createForm),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
var __VLS_244;
const { default: __VLS_246 } = __VLS_242.slots;
let __VLS_247;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
    label: "商户",
    required: true,
}));
const __VLS_249 = __VLS_248({
    label: "商户",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
const { default: __VLS_252 } = __VLS_250.slots;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    modelValue: (__VLS_ctx.createForm.merchantId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchMerchants),
    loading: (__VLS_ctx.merchantLoading),
    placeholder: "搜索商户",
    ...{ style: {} },
}));
const __VLS_255 = __VLS_254({
    modelValue: (__VLS_ctx.createForm.merchantId),
    filterable: true,
    remote: true,
    remoteMethod: (__VLS_ctx.searchMerchants),
    loading: (__VLS_ctx.merchantLoading),
    placeholder: "搜索商户",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
const { default: __VLS_258 } = __VLS_256.slots;
for (const [m] of __VLS_vFor((__VLS_ctx.merchantOptions))) {
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }));
    const __VLS_261 = __VLS_260({
        key: (m.id),
        label: (m.name),
        value: (m.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, createVisible, resetCreateForm, createForm, createForm, searchMerchants, merchantLoading, merchantOptions,];
}
// @ts-ignore
[];
var __VLS_256;
// @ts-ignore
[];
var __VLS_250;
let __VLS_264;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
    label: "标题",
    required: true,
}));
const __VLS_266 = __VLS_265({
    label: "标题",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
const { default: __VLS_269 } = __VLS_267.slots;
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    modelValue: (__VLS_ctx.createForm.title),
    placeholder: "通知标题",
}));
const __VLS_272 = __VLS_271({
    modelValue: (__VLS_ctx.createForm.title),
    placeholder: "通知标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
// @ts-ignore
[createForm,];
var __VLS_267;
let __VLS_275;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
    label: "内容",
}));
const __VLS_277 = __VLS_276({
    label: "内容",
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
const { default: __VLS_280 } = __VLS_278.slots;
let __VLS_281;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
    modelValue: (__VLS_ctx.createForm.content),
    type: "textarea",
    rows: (4),
    placeholder: "通知内容",
}));
const __VLS_283 = __VLS_282({
    modelValue: (__VLS_ctx.createForm.content),
    type: "textarea",
    rows: (4),
    placeholder: "通知内容",
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
// @ts-ignore
[createForm,];
var __VLS_278;
let __VLS_286;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
    label: "税种",
}));
const __VLS_288 = __VLS_287({
    label: "税种",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
const { default: __VLS_291 } = __VLS_289.slots;
let __VLS_292;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
    modelValue: (__VLS_ctx.createForm.taxType),
    ...{ style: {} },
}));
const __VLS_294 = __VLS_293({
    modelValue: (__VLS_ctx.createForm.taxType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
const { default: __VLS_297 } = __VLS_295.slots;
let __VLS_298;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
    label: "销售税",
    value: "SALES_TAX",
}));
const __VLS_300 = __VLS_299({
    label: "销售税",
    value: "SALES_TAX",
}, ...__VLS_functionalComponentArgsRest(__VLS_299));
let __VLS_303;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
    label: "所得税",
    value: "INCOME_TAX",
}));
const __VLS_305 = __VLS_304({
    label: "所得税",
    value: "INCOME_TAX",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
let __VLS_308;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
    label: "平台费用",
    value: "PLATFORM_FEE",
}));
const __VLS_310 = __VLS_309({
    label: "平台费用",
    value: "PLATFORM_FEE",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
let __VLS_313;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({
    label: "其他",
    value: "OTHER",
}));
const __VLS_315 = __VLS_314({
    label: "其他",
    value: "OTHER",
}, ...__VLS_functionalComponentArgsRest(__VLS_314));
// @ts-ignore
[createForm,];
var __VLS_295;
// @ts-ignore
[];
var __VLS_289;
let __VLS_318;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
    gutter: (16),
}));
const __VLS_320 = __VLS_319({
    gutter: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
const { default: __VLS_323 } = __VLS_321.slots;
let __VLS_324;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_325 = __VLS_asFunctionalComponent1(__VLS_324, new __VLS_324({
    span: (12),
}));
const __VLS_326 = __VLS_325({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_325));
const { default: __VLS_329 } = __VLS_327.slots;
let __VLS_330;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
    label: "金额",
}));
const __VLS_332 = __VLS_331({
    label: "金额",
}, ...__VLS_functionalComponentArgsRest(__VLS_331));
const { default: __VLS_335 } = __VLS_333.slots;
let __VLS_336;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    modelValue: (__VLS_ctx.createForm.amount),
    min: (0),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_338 = __VLS_337({
    modelValue: (__VLS_ctx.createForm.amount),
    min: (0),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
// @ts-ignore
[createForm,];
var __VLS_333;
// @ts-ignore
[];
var __VLS_327;
let __VLS_341;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_342 = __VLS_asFunctionalComponent1(__VLS_341, new __VLS_341({
    span: (12),
}));
const __VLS_343 = __VLS_342({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_342));
const { default: __VLS_346 } = __VLS_344.slots;
let __VLS_347;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
    label: "货币",
}));
const __VLS_349 = __VLS_348({
    label: "货币",
}, ...__VLS_functionalComponentArgsRest(__VLS_348));
const { default: __VLS_352 } = __VLS_350.slots;
let __VLS_353;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
    modelValue: (__VLS_ctx.createForm.currency),
    placeholder: "JPY",
}));
const __VLS_355 = __VLS_354({
    modelValue: (__VLS_ctx.createForm.currency),
    placeholder: "JPY",
}, ...__VLS_functionalComponentArgsRest(__VLS_354));
// @ts-ignore
[createForm,];
var __VLS_350;
// @ts-ignore
[];
var __VLS_344;
// @ts-ignore
[];
var __VLS_321;
let __VLS_358;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({
    label: "截止日期",
}));
const __VLS_360 = __VLS_359({
    label: "截止日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_359));
const { default: __VLS_363 } = __VLS_361.slots;
let __VLS_364;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent1(__VLS_364, new __VLS_364({
    modelValue: (__VLS_ctx.createForm.dueAt),
    type: "date",
    placeholder: "请选择日期",
    ...{ style: {} },
}));
const __VLS_366 = __VLS_365({
    modelValue: (__VLS_ctx.createForm.dueAt),
    type: "date",
    placeholder: "请选择日期",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
// @ts-ignore
[createForm,];
var __VLS_361;
let __VLS_369;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent1(__VLS_369, new __VLS_369({
    label: "强制弹窗",
}));
const __VLS_371 = __VLS_370({
    label: "强制弹窗",
}, ...__VLS_functionalComponentArgsRest(__VLS_370));
const { default: __VLS_374 } = __VLS_372.slots;
let __VLS_375;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_376 = __VLS_asFunctionalComponent1(__VLS_375, new __VLS_375({
    modelValue: (__VLS_ctx.createForm.forcePopup),
}));
const __VLS_377 = __VLS_376({
    modelValue: (__VLS_ctx.createForm.forcePopup),
}, ...__VLS_functionalComponentArgsRest(__VLS_376));
// @ts-ignore
[createForm,];
var __VLS_372;
let __VLS_380;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_381 = __VLS_asFunctionalComponent1(__VLS_380, new __VLS_380({
    label: "未支付前锁定",
}));
const __VLS_382 = __VLS_381({
    label: "未支付前锁定",
}, ...__VLS_functionalComponentArgsRest(__VLS_381));
const { default: __VLS_385 } = __VLS_383.slots;
let __VLS_386;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_387 = __VLS_asFunctionalComponent1(__VLS_386, new __VLS_386({
    modelValue: (__VLS_ctx.createForm.blockUntilPaid),
}));
const __VLS_388 = __VLS_387({
    modelValue: (__VLS_ctx.createForm.blockUntilPaid),
}, ...__VLS_functionalComponentArgsRest(__VLS_387));
// @ts-ignore
[createForm,];
var __VLS_383;
// @ts-ignore
[];
var __VLS_242;
{
    const { footer: __VLS_391 } = __VLS_234.slots;
    let __VLS_392;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_393 = __VLS_asFunctionalComponent1(__VLS_392, new __VLS_392({
        ...{ 'onClick': {} },
    }));
    const __VLS_394 = __VLS_393({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_393));
    let __VLS_397;
    const __VLS_398 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.createVisible = false;
            // @ts-ignore
            [createVisible,];
        },
    };
    const { default: __VLS_399 } = __VLS_395.slots;
    // @ts-ignore
    [];
    var __VLS_395;
    var __VLS_396;
    let __VLS_400;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.createLoading),
    }));
    const __VLS_402 = __VLS_401({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.createLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
    let __VLS_405;
    const __VLS_406 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleCreate),
    };
    const { default: __VLS_407 } = __VLS_403.slots;
    // @ts-ignore
    [createLoading, handleCreate,];
    var __VLS_403;
    var __VLS_404;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_234;
var __VLS_235;
let __VLS_408;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_409 = __VLS_asFunctionalComponent1(__VLS_408, new __VLS_408({
    modelValue: (__VLS_ctx.detailVisible),
    title: "税务通知详情",
    width: "650px",
}));
const __VLS_410 = __VLS_409({
    modelValue: (__VLS_ctx.detailVisible),
    title: "税务通知详情",
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_409));
const { default: __VLS_413 } = __VLS_411.slots;
if (__VLS_ctx.detailItem) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_414;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent1(__VLS_414, new __VLS_414({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_416 = __VLS_415({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    const { default: __VLS_419 } = __VLS_417.slots;
    let __VLS_420;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_421 = __VLS_asFunctionalComponent1(__VLS_420, new __VLS_420({
        label: "ID",
    }));
    const __VLS_422 = __VLS_421({
        label: "ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_421));
    const { default: __VLS_425 } = __VLS_423.slots;
    (__VLS_ctx.detailItem.id);
    // @ts-ignore
    [detailVisible, detailItem, detailItem,];
    var __VLS_423;
    let __VLS_426;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_427 = __VLS_asFunctionalComponent1(__VLS_426, new __VLS_426({
        label: "商户",
    }));
    const __VLS_428 = __VLS_427({
        label: "商户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_427));
    const { default: __VLS_431 } = __VLS_429.slots;
    (__VLS_ctx.detailItem.merchantName);
    // @ts-ignore
    [detailItem,];
    var __VLS_429;
    let __VLS_432;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent1(__VLS_432, new __VLS_432({
        label: "标题",
    }));
    const __VLS_434 = __VLS_433({
        label: "标题",
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    const { default: __VLS_437 } = __VLS_435.slots;
    (__VLS_ctx.detailItem.title);
    // @ts-ignore
    [detailItem,];
    var __VLS_435;
    let __VLS_438;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({
        label: "税种",
    }));
    const __VLS_440 = __VLS_439({
        label: "税种",
    }, ...__VLS_functionalComponentArgsRest(__VLS_439));
    const { default: __VLS_443 } = __VLS_441.slots;
    (__VLS_ctx.detailItem.taxType);
    // @ts-ignore
    [detailItem,];
    var __VLS_441;
    let __VLS_444;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent1(__VLS_444, new __VLS_444({
        label: "金额",
    }));
    const __VLS_446 = __VLS_445({
        label: "金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    const { default: __VLS_449 } = __VLS_447.slots;
    (__VLS_ctx.detailItem.amount);
    (__VLS_ctx.detailItem.currency);
    // @ts-ignore
    [detailItem, detailItem,];
    var __VLS_447;
    let __VLS_450;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_451 = __VLS_asFunctionalComponent1(__VLS_450, new __VLS_450({
        label: "状态",
    }));
    const __VLS_452 = __VLS_451({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_451));
    const { default: __VLS_455 } = __VLS_453.slots;
    (__VLS_ctx.detailItem.status);
    // @ts-ignore
    [detailItem,];
    var __VLS_453;
    let __VLS_456;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent1(__VLS_456, new __VLS_456({
        label: "截止日期",
    }));
    const __VLS_458 = __VLS_457({
        label: "截止日期",
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    const { default: __VLS_461 } = __VLS_459.slots;
    (__VLS_ctx.detailItem.dueAt || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_459;
    let __VLS_462;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_463 = __VLS_asFunctionalComponent1(__VLS_462, new __VLS_462({
        label: "支付时间",
    }));
    const __VLS_464 = __VLS_463({
        label: "支付时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_463));
    const { default: __VLS_467 } = __VLS_465.slots;
    (__VLS_ctx.detailItem.paidAt || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_465;
    let __VLS_468;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_469 = __VLS_asFunctionalComponent1(__VLS_468, new __VLS_468({
        label: "强制弹窗",
    }));
    const __VLS_470 = __VLS_469({
        label: "强制弹窗",
    }, ...__VLS_functionalComponentArgsRest(__VLS_469));
    const { default: __VLS_473 } = __VLS_471.slots;
    (__VLS_ctx.detailItem.forcePopup ? 'Yes' : 'No');
    // @ts-ignore
    [detailItem,];
    var __VLS_471;
    let __VLS_474;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_475 = __VLS_asFunctionalComponent1(__VLS_474, new __VLS_474({
        label: "未支付前锁定",
    }));
    const __VLS_476 = __VLS_475({
        label: "未支付前锁定",
    }, ...__VLS_functionalComponentArgsRest(__VLS_475));
    const { default: __VLS_479 } = __VLS_477.slots;
    (__VLS_ctx.detailItem.blockUntilPaid ? 'Yes' : 'No');
    // @ts-ignore
    [detailItem,];
    var __VLS_477;
    let __VLS_480;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_481 = __VLS_asFunctionalComponent1(__VLS_480, new __VLS_480({
        label: "创建时间",
    }));
    const __VLS_482 = __VLS_481({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_481));
    const { default: __VLS_485 } = __VLS_483.slots;
    (__VLS_ctx.detailItem.createdAt);
    // @ts-ignore
    [detailItem,];
    var __VLS_483;
    let __VLS_486;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_487 = __VLS_asFunctionalComponent1(__VLS_486, new __VLS_486({
        label: "更新时间",
    }));
    const __VLS_488 = __VLS_487({
        label: "更新时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_487));
    const { default: __VLS_491 } = __VLS_489.slots;
    (__VLS_ctx.detailItem.updatedAt);
    // @ts-ignore
    [detailItem,];
    var __VLS_489;
    // @ts-ignore
    [];
    var __VLS_417;
    if (__VLS_ctx.detailItem.content) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ style: {} },
        });
        (__VLS_ctx.detailItem.content);
    }
    if (__VLS_ctx.detailItem.paymentProof) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        let __VLS_492;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_493 = __VLS_asFunctionalComponent1(__VLS_492, new __VLS_492({
            src: (__VLS_ctx.detailItem.paymentProof),
            ...{ style: {} },
            fit: "contain",
        }));
        const __VLS_494 = __VLS_493({
            src: (__VLS_ctx.detailItem.paymentProof),
            ...{ style: {} },
            fit: "contain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_493));
        if (__VLS_ctx.detailItem.proofRemark) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ style: {} },
            });
            (__VLS_ctx.detailItem.proofRemark);
        }
    }
    if (__VLS_ctx.detailItem.paymentMethod) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detailItem.paymentMethod);
    }
    if (__VLS_ctx.detailItem.rejectReason) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detailItem.rejectReason);
    }
    if (__VLS_ctx.detailItem.status === 'SUBMITTED') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        let __VLS_497;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_498 = __VLS_asFunctionalComponent1(__VLS_497, new __VLS_497({
            ...{ 'onClick': {} },
            type: "success",
        }));
        const __VLS_499 = __VLS_498({
            ...{ 'onClick': {} },
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_498));
        let __VLS_502;
        const __VLS_503 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.detailItem))
                    return;
                if (!(__VLS_ctx.detailItem.status === 'SUBMITTED'))
                    return;
                __VLS_ctx.handleReview(__VLS_ctx.detailItem, true);
                // @ts-ignore
                [detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, detailItem, handleReview,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:tax:review') }, null, null);
        const { default: __VLS_504 } = __VLS_500.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_500;
        var __VLS_501;
        let __VLS_505;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_506 = __VLS_asFunctionalComponent1(__VLS_505, new __VLS_505({
            ...{ 'onClick': {} },
            type: "danger",
        }));
        const __VLS_507 = __VLS_506({
            ...{ 'onClick': {} },
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_506));
        let __VLS_510;
        const __VLS_511 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.detailItem))
                    return;
                if (!(__VLS_ctx.detailItem.status === 'SUBMITTED'))
                    return;
                __VLS_ctx.openRejectReview(__VLS_ctx.detailItem);
                // @ts-ignore
                [detailItem, openRejectReview,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('admin:tax:review') }, null, null);
        const { default: __VLS_512 } = __VLS_508.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_508;
        var __VLS_509;
    }
}
{
    const { footer: __VLS_513 } = __VLS_411.slots;
    let __VLS_514;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent1(__VLS_514, new __VLS_514({
        ...{ 'onClick': {} },
    }));
    const __VLS_516 = __VLS_515({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    let __VLS_519;
    const __VLS_520 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_521 } = __VLS_517.slots;
    // @ts-ignore
    [];
    var __VLS_517;
    var __VLS_518;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_411;
let __VLS_522;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_523 = __VLS_asFunctionalComponent1(__VLS_522, new __VLS_522({
    modelValue: (__VLS_ctx.reviewRejectVisible),
    title: "拒绝原因",
    width: "450px",
}));
const __VLS_524 = __VLS_523({
    modelValue: (__VLS_ctx.reviewRejectVisible),
    title: "拒绝原因",
    width: "450px",
}, ...__VLS_functionalComponentArgsRest(__VLS_523));
const { default: __VLS_527 } = __VLS_525.slots;
let __VLS_528;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_529 = __VLS_asFunctionalComponent1(__VLS_528, new __VLS_528({}));
const __VLS_530 = __VLS_529({}, ...__VLS_functionalComponentArgsRest(__VLS_529));
const { default: __VLS_533 } = __VLS_531.slots;
let __VLS_534;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_535 = __VLS_asFunctionalComponent1(__VLS_534, new __VLS_534({
    label: "原因",
}));
const __VLS_536 = __VLS_535({
    label: "原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_535));
const { default: __VLS_539 } = __VLS_537.slots;
let __VLS_540;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_541 = __VLS_asFunctionalComponent1(__VLS_540, new __VLS_540({
    modelValue: (__VLS_ctx.rejectReason),
    type: "textarea",
    rows: (3),
    placeholder: "请说明凭证被拒绝的原因",
}));
const __VLS_542 = __VLS_541({
    modelValue: (__VLS_ctx.rejectReason),
    type: "textarea",
    rows: (3),
    placeholder: "请说明凭证被拒绝的原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_541));
// @ts-ignore
[reviewRejectVisible, rejectReason,];
var __VLS_537;
// @ts-ignore
[];
var __VLS_531;
{
    const { footer: __VLS_545 } = __VLS_525.slots;
    let __VLS_546;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_547 = __VLS_asFunctionalComponent1(__VLS_546, new __VLS_546({
        ...{ 'onClick': {} },
    }));
    const __VLS_548 = __VLS_547({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_547));
    let __VLS_551;
    const __VLS_552 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.reviewRejectVisible = false;
            // @ts-ignore
            [reviewRejectVisible,];
        },
    };
    const { default: __VLS_553 } = __VLS_549.slots;
    // @ts-ignore
    [];
    var __VLS_549;
    var __VLS_550;
    let __VLS_554;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_555 = __VLS_asFunctionalComponent1(__VLS_554, new __VLS_554({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.reviewLoading),
    }));
    const __VLS_556 = __VLS_555({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.reviewLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_555));
    let __VLS_559;
    const __VLS_560 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleReview(__VLS_ctx.reviewTarget, false);
            // @ts-ignore
            [handleReview, reviewLoading, reviewTarget,];
        },
    };
    const { default: __VLS_561 } = __VLS_557.slots;
    // @ts-ignore
    [];
    var __VLS_557;
    var __VLS_558;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_525;
// @ts-ignore
var __VLS_245 = __VLS_244;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
