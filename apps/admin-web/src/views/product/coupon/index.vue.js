/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { couponApi } from '@/api/coupon';
import { COUPON_STATUS_OPTIONS, COUPON_TYPE_OPTIONS, getLabelByValue, getColorByValue, } from '@/constants/dict';
defineOptions({ name: 'AdminCouponView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const formVisible = ref(false);
const formRef = ref();
const editingId = ref(null);
const submitLoading = ref(false);
const recordsVisible = ref(false);
const recordsLoading = ref(false);
const viewingCouponId = ref(null);
const recordsData = ref([]);
const recordsTotal = ref(0);
const recordsPage = ref(1);
const recordsPageSize = ref(10);
const searchForm = reactive({
    keyword: '',
    type: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const defaultForm = () => ({
    name: '',
    code: '',
    type: 'FIXED_AMOUNT',
    amount: 0,
    discountRate: 0,
    minSpend: 0,
    totalQuantity: 100,
    perUserLimit: 1,
    startAt: '',
    endAt: '',
    status: 'ENABLE',
    translations: {
        ja: { name: '', description: '' },
        ko: { name: '', description: '' },
        en: { name: '', description: '' },
    },
});
const form = reactive(defaultForm());
const formRules = {
    name: [{ required: true, message: 'Required', trigger: 'blur' }],
    code: [{ required: true, message: 'Required', trigger: 'blur' }],
    type: [{ required: true, message: 'Required', trigger: 'change' }],
    totalQuantity: [{ required: true, message: 'Required', trigger: 'blur' }],
    perUserLimit: [{ required: true, message: 'Required', trigger: 'blur' }],
    startAt: [{ required: true, message: 'Required', trigger: 'change' }],
    endAt: [{ required: true, message: 'Required', trigger: 'change' }],
};
async function fetchData() {
    loading.value = true;
    try {
        const params = {
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        };
        if (searchForm.keyword)
            params.keyword = searchForm.keyword;
        if (searchForm.type)
            params.type = searchForm.type;
        if (searchForm.status)
            params.status = searchForm.status;
        const { data: res } = await couponApi.getCoupons(params);
        if (res.code !== 200)
            return;
        tableData.value = res.data?.list || [];
        total.value = res.data?.total || 0;
    }
    finally {
        loading.value = false;
    }
}
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
function handleReset() {
    searchForm.keyword = '';
    searchForm.type = '';
    searchForm.status = '';
    handleSearch();
}
function openCreate() {
    editingId.value = null;
    Object.assign(form, defaultForm());
    formVisible.value = true;
}
function openEdit(row) {
    editingId.value = row.id;
    const trans = {
        ja: { name: '', description: '' },
        ko: { name: '', description: '' },
        en: { name: '', description: '' },
    };
    if (row.translations) {
        for (const t of row.translations) {
            if (trans[t.languageCode]) {
                trans[t.languageCode] = { name: t.name, description: t.description };
            }
        }
    }
    Object.assign(form, {
        name: row.name,
        code: row.code,
        type: row.type,
        amount: row.amount,
        discountRate: row.discountRate,
        minSpend: row.minSpend,
        totalQuantity: row.totalQuantity,
        perUserLimit: row.perUserLimit,
        startAt: row.startAt,
        endAt: row.endAt,
        status: row.status,
        translations: trans,
    });
    formVisible.value = true;
}
async function handleSubmit() {
    if (!formRef.value)
        return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid)
        return;
    submitLoading.value = true;
    try {
        const data = { ...form };
        if (data.type === 'FIXED_AMOUNT')
            data.discountRate = 0;
        if (data.type === 'PERCENTAGE')
            data.amount = 0;
        const res = editingId.value
            ? await couponApi.updateCoupon(editingId.value, data)
            : await couponApi.createCoupon(data);
        if (res.data.code !== 200)
            return;
        ElMessage.success(editingId.value ? 'Coupon updated' : 'Coupon created');
        formVisible.value = false;
        fetchData();
    }
    finally {
        submitLoading.value = false;
    }
}
async function toggleStatus(row) {
    const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    const { data: res } = await couponApi.updateCouponStatus(row.id, newStatus);
    if (res.code !== 200)
        return;
    ElMessage.success('状态已更新');
    fetchData();
}
async function handleDelete(row) {
    try {
        await ElMessageBox.confirm(`确定要删除优惠券“${row.name}”吗？`, '确认', { type: 'warning' });
    }
    catch {
        return;
    }
    const { data: res } = await couponApi.deleteCoupon(row.id);
    if (res.code !== 200)
        return;
    ElMessage.success('已删除');
    fetchData();
}
function openRecords(row) {
    viewingCouponId.value = row.id;
    recordsPage.value = 1;
    recordsVisible.value = true;
    fetchRecords();
}
async function fetchRecords() {
    if (!viewingCouponId.value)
        return;
    recordsLoading.value = true;
    try {
        const { data: res } = await couponApi.getRecords(viewingCouponId.value, {
            page: recordsPage.value,
            pageSize: recordsPageSize.value,
        });
        if (res.code !== 200)
            return;
        recordsData.value = res.data?.list || [];
        recordsTotal.value = res.data?.total || 0;
    }
    finally {
        recordsLoading.value = false;
    }
}
function resetForm() {
    formRef.value?.resetFields();
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
    ...{ class: "coupon-page" },
});
/** @type {__VLS_StyleScopedClasses['coupon-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.type),
    placeholder: "类型",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.type),
    placeholder: "类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_32 } = __VLS_28.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.COUPON_TYPE_OPTIONS))) {
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_35 = __VLS_34({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    // @ts-ignore
    [searchForm, handleSearch, COUPON_TYPE_OPTIONS,];
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
for (const [o] of __VLS_vFor((__VLS_ctx.COUPON_STATUS_OPTIONS))) {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_54 = __VLS_53({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    // @ts-ignore
    [searchForm, handleSearch, COUPON_STATUS_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_47;
var __VLS_48;
// @ts-ignore
[];
var __VLS_41;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({}));
const __VLS_59 = __VLS_58({}, ...__VLS_functionalComponentArgsRest(__VLS_58));
const { default: __VLS_62 } = __VLS_60.slots;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_70 } = __VLS_66.slots;
// @ts-ignore
[handleSearch,];
var __VLS_66;
var __VLS_67;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    ...{ 'onClick': {} },
}));
const __VLS_73 = __VLS_72({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
let __VLS_76;
const __VLS_77 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleReset),
};
const { default: __VLS_78 } = __VLS_74.slots;
// @ts-ignore
[handleReset,];
var __VLS_74;
var __VLS_75;
// @ts-ignore
[];
var __VLS_60;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({}));
const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
const { default: __VLS_84 } = __VLS_82.slots;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ 'onClick': {} },
    type: "success",
}));
const __VLS_87 = __VLS_86({
    ...{ 'onClick': {} },
    type: "success",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
const __VLS_91 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('coupon:add') }, null, null);
const { default: __VLS_92 } = __VLS_88.slots;
// @ts-ignore
[openCreate, vPermission,];
var __VLS_88;
var __VLS_89;
// @ts-ignore
[];
var __VLS_82;
// @ts-ignore
[];
var __VLS_3;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_95 = __VLS_94({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_98 } = __VLS_96.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_101 = __VLS_100({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    prop: "name",
    label: "名称",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_106 = __VLS_105({
    prop: "name",
    label: "名称",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    prop: "code",
    label: "代码",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_111 = __VLS_110({
    prop: "code",
    label: "代码",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    label: "类型",
    width: "110",
    align: "center",
}));
const __VLS_116 = __VLS_115({
    label: "类型",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
const { default: __VLS_119 } = __VLS_117.slots;
{
    const { default: __VLS_120 } = __VLS_117.slots;
    const [{ row }] = __VLS_vSlot(__VLS_120);
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({}));
    const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
    const { default: __VLS_126 } = __VLS_124.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.COUPON_TYPE_OPTIONS, row.type));
    // @ts-ignore
    [COUPON_TYPE_OPTIONS, tableData, vLoading, loading, getLabelByValue,];
    var __VLS_124;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_117;
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    prop: "amount",
    label: "金额",
    width: "90",
    align: "right",
}));
const __VLS_129 = __VLS_128({
    prop: "amount",
    label: "金额",
    width: "90",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
let __VLS_132;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    prop: "discountRate",
    label: "比例",
    width: "70",
    align: "center",
}));
const __VLS_134 = __VLS_133({
    prop: "discountRate",
    label: "比例",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const { default: __VLS_137 } = __VLS_135.slots;
{
    const { default: __VLS_138 } = __VLS_135.slots;
    const [{ row }] = __VLS_vSlot(__VLS_138);
    (row.discountRate ? row.discountRate + '%' : '-');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_135;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    prop: "minSpend",
    label: "最低消费",
    width: "100",
    align: "right",
}));
const __VLS_141 = __VLS_140({
    prop: "minSpend",
    label: "最低消费",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    prop: "totalQuantity",
    label: "合计",
    width: "70",
    align: "center",
}));
const __VLS_146 = __VLS_145({
    prop: "totalQuantity",
    label: "合计",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    prop: "receivedQuantity",
    label: "已收",
    width: "70",
    align: "center",
}));
const __VLS_151 = __VLS_150({
    prop: "receivedQuantity",
    label: "已收",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    prop: "usedQuantity",
    label: "已使用",
    width: "70",
    align: "center",
}));
const __VLS_156 = __VLS_155({
    prop: "usedQuantity",
    label: "已使用",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
    prop: "startAt",
    label: "开始",
    width: "160",
}));
const __VLS_161 = __VLS_160({
    prop: "startAt",
    label: "开始",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_160));
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    prop: "endAt",
    label: "结束",
    width: "160",
}));
const __VLS_166 = __VLS_165({
    prop: "endAt",
    label: "结束",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_171 = __VLS_170({
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
const { default: __VLS_174 } = __VLS_172.slots;
{
    const { default: __VLS_175 } = __VLS_172.slots;
    const [{ row }] = __VLS_vSlot(__VLS_175);
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.COUPON_STATUS_OPTIONS, row.status)),
    }));
    const __VLS_178 = __VLS_177({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.COUPON_STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    const { default: __VLS_181 } = __VLS_179.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.COUPON_STATUS_OPTIONS, row.status));
    // @ts-ignore
    [COUPON_STATUS_OPTIONS, COUPON_STATUS_OPTIONS, getLabelByValue, getColorByValue,];
    var __VLS_179;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_172;
let __VLS_182;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
    label: "操作",
    width: "240",
    fixed: "right",
}));
const __VLS_184 = __VLS_183({
    label: "操作",
    width: "240",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_183));
const { default: __VLS_187 } = __VLS_185.slots;
{
    const { default: __VLS_188 } = __VLS_185.slots;
    const [{ row }] = __VLS_vSlot(__VLS_188);
    let __VLS_189;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_191 = __VLS_190({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    let __VLS_194;
    const __VLS_195 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('coupon:edit') }, null, null);
    const { default: __VLS_196 } = __VLS_192.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_192;
    var __VLS_193;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }));
    const __VLS_199 = __VLS_198({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    let __VLS_202;
    const __VLS_203 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.toggleStatus(row);
            // @ts-ignore
            [toggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('coupon:edit') }, null, null);
    const { default: __VLS_204 } = __VLS_200.slots;
    (row.status === 'ENABLE' ? '禁用' : '启用');
    // @ts-ignore
    [vPermission,];
    var __VLS_200;
    var __VLS_201;
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }));
    const __VLS_207 = __VLS_206({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    let __VLS_210;
    const __VLS_211 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openRecords(row);
            // @ts-ignore
            [openRecords,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('coupon:view') }, null, null);
    const { default: __VLS_212 } = __VLS_208.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_208;
    var __VLS_209;
    let __VLS_213;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }));
    const __VLS_215 = __VLS_214({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    let __VLS_218;
    const __VLS_219 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('coupon:delete') }, null, null);
    const { default: __VLS_220 } = __VLS_216.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_216;
    var __VLS_217;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_185;
// @ts-ignore
[];
var __VLS_96;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_223 = __VLS_222({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
let __VLS_226;
const __VLS_227 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_224;
var __VLS_225;
let __VLS_228;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.editingId ? '编辑优惠券' : '新建优惠券'),
    width: "700px",
}));
const __VLS_230 = __VLS_229({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.editingId ? '编辑优惠券' : '新建优惠券'),
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
let __VLS_233;
const __VLS_234 = {
    ...{ closed: {} },
    onClosed: (__VLS_ctx.resetForm),
};
const { default: __VLS_235 } = __VLS_231.slots;
let __VLS_236;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "130px",
    rules: (__VLS_ctx.formRules),
}));
const __VLS_238 = __VLS_237({
    ref: "formRef",
    model: (__VLS_ctx.form),
    labelWidth: "130px",
    rules: (__VLS_ctx.formRules),
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
var __VLS_241;
const { default: __VLS_243 } = __VLS_239.slots;
let __VLS_244;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
    label: "名称",
    prop: "name",
}));
const __VLS_246 = __VLS_245({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
const { default: __VLS_249 } = __VLS_247.slots;
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "优惠券名称",
}));
const __VLS_252 = __VLS_251({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "优惠券名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
// @ts-ignore
[searchForm, searchForm, total, fetchData, formVisible, editingId, resetForm, form, form, formRules,];
var __VLS_247;
let __VLS_255;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    label: "代码",
    prop: "code",
}));
const __VLS_257 = __VLS_256({
    label: "代码",
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
const { default: __VLS_260 } = __VLS_258.slots;
let __VLS_261;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "优惠券码",
    disabled: (!!__VLS_ctx.editingId),
}));
const __VLS_263 = __VLS_262({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "优惠券码",
    disabled: (!!__VLS_ctx.editingId),
}, ...__VLS_functionalComponentArgsRest(__VLS_262));
// @ts-ignore
[editingId, form,];
var __VLS_258;
let __VLS_266;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
    label: "类型",
    prop: "type",
}));
const __VLS_268 = __VLS_267({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_267));
const { default: __VLS_271 } = __VLS_269.slots;
let __VLS_272;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    modelValue: (__VLS_ctx.form.type),
    placeholder: "请选择类型",
    ...{ style: {} },
}));
const __VLS_274 = __VLS_273({
    modelValue: (__VLS_ctx.form.type),
    placeholder: "请选择类型",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
const { default: __VLS_277 } = __VLS_275.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.COUPON_TYPE_OPTIONS))) {
    let __VLS_278;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_280 = __VLS_279({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    // @ts-ignore
    [COUPON_TYPE_OPTIONS, form,];
}
// @ts-ignore
[];
var __VLS_275;
// @ts-ignore
[];
var __VLS_269;
if (__VLS_ctx.form.type === 'FIXED_AMOUNT') {
    let __VLS_283;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
        label: "金额",
        prop: "amount",
    }));
    const __VLS_285 = __VLS_284({
        label: "金额",
        prop: "amount",
    }, ...__VLS_functionalComponentArgsRest(__VLS_284));
    const { default: __VLS_288 } = __VLS_286.slots;
    let __VLS_289;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
        modelValue: (__VLS_ctx.form.amount),
        min: (0),
        precision: (2),
        ...{ style: {} },
    }));
    const __VLS_291 = __VLS_290({
        modelValue: (__VLS_ctx.form.amount),
        min: (0),
        precision: (2),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    // @ts-ignore
    [form, form,];
    var __VLS_286;
}
if (__VLS_ctx.form.type === 'PERCENTAGE') {
    let __VLS_294;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        label: "折扣率",
        prop: "discountRate",
    }));
    const __VLS_296 = __VLS_295({
        label: "折扣率",
        prop: "discountRate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    const { default: __VLS_299 } = __VLS_297.slots;
    let __VLS_300;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
        modelValue: (__VLS_ctx.form.discountRate),
        min: (0),
        max: (100),
        precision: (1),
        ...{ style: {} },
    }));
    const __VLS_302 = __VLS_301({
        modelValue: (__VLS_ctx.form.discountRate),
        min: (0),
        max: (100),
        precision: (1),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
    });
    // @ts-ignore
    [form, form,];
    var __VLS_297;
}
let __VLS_305;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_306 = __VLS_asFunctionalComponent1(__VLS_305, new __VLS_305({
    label: "最低消费",
    prop: "minSpend",
}));
const __VLS_307 = __VLS_306({
    label: "最低消费",
    prop: "minSpend",
}, ...__VLS_functionalComponentArgsRest(__VLS_306));
const { default: __VLS_310 } = __VLS_308.slots;
let __VLS_311;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
    modelValue: (__VLS_ctx.form.minSpend),
    min: (0),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_313 = __VLS_312({
    modelValue: (__VLS_ctx.form.minSpend),
    min: (0),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_312));
// @ts-ignore
[form,];
var __VLS_308;
let __VLS_316;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
    label: "总数量",
    prop: "totalQuantity",
}));
const __VLS_318 = __VLS_317({
    label: "总数量",
    prop: "totalQuantity",
}, ...__VLS_functionalComponentArgsRest(__VLS_317));
const { default: __VLS_321 } = __VLS_319.slots;
let __VLS_322;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({
    modelValue: (__VLS_ctx.form.totalQuantity),
    min: (1),
    ...{ style: {} },
}));
const __VLS_324 = __VLS_323({
    modelValue: (__VLS_ctx.form.totalQuantity),
    min: (1),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
// @ts-ignore
[form,];
var __VLS_319;
let __VLS_327;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
    label: "每用户限制",
    prop: "perUserLimit",
}));
const __VLS_329 = __VLS_328({
    label: "每用户限制",
    prop: "perUserLimit",
}, ...__VLS_functionalComponentArgsRest(__VLS_328));
const { default: __VLS_332 } = __VLS_330.slots;
let __VLS_333;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
    modelValue: (__VLS_ctx.form.perUserLimit),
    min: (1),
    ...{ style: {} },
}));
const __VLS_335 = __VLS_334({
    modelValue: (__VLS_ctx.form.perUserLimit),
    min: (1),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
// @ts-ignore
[form,];
var __VLS_330;
let __VLS_338;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
    label: "开始日期",
    prop: "startAt",
}));
const __VLS_340 = __VLS_339({
    label: "开始日期",
    prop: "startAt",
}, ...__VLS_functionalComponentArgsRest(__VLS_339));
const { default: __VLS_343 } = __VLS_341.slots;
let __VLS_344;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
    modelValue: (__VLS_ctx.form.startAt),
    type: "datetime",
    placeholder: "开始日期",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}));
const __VLS_346 = __VLS_345({
    modelValue: (__VLS_ctx.form.startAt),
    type: "datetime",
    placeholder: "开始日期",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_345));
// @ts-ignore
[form,];
var __VLS_341;
let __VLS_349;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
    label: "结束日期",
    prop: "endAt",
}));
const __VLS_351 = __VLS_350({
    label: "结束日期",
    prop: "endAt",
}, ...__VLS_functionalComponentArgsRest(__VLS_350));
const { default: __VLS_354 } = __VLS_352.slots;
let __VLS_355;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_356 = __VLS_asFunctionalComponent1(__VLS_355, new __VLS_355({
    modelValue: (__VLS_ctx.form.endAt),
    type: "datetime",
    placeholder: "结束日期",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}));
const __VLS_357 = __VLS_356({
    modelValue: (__VLS_ctx.form.endAt),
    type: "datetime",
    placeholder: "结束日期",
    format: "YYYY-MM-DD HH:mm:ss",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_356));
// @ts-ignore
[form,];
var __VLS_352;
let __VLS_360;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_361 = __VLS_asFunctionalComponent1(__VLS_360, new __VLS_360({
    label: "状态",
    prop: "status",
}));
const __VLS_362 = __VLS_361({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_361));
const { default: __VLS_365 } = __VLS_363.slots;
let __VLS_366;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({
    modelValue: (__VLS_ctx.form.status),
    ...{ style: {} },
}));
const __VLS_368 = __VLS_367({
    modelValue: (__VLS_ctx.form.status),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_367));
const { default: __VLS_371 } = __VLS_369.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.COUPON_STATUS_OPTIONS))) {
    let __VLS_372;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_374 = __VLS_373({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    // @ts-ignore
    [COUPON_STATUS_OPTIONS, form,];
}
// @ts-ignore
[];
var __VLS_369;
// @ts-ignore
[];
var __VLS_363;
let __VLS_377;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_378 = __VLS_asFunctionalComponent1(__VLS_377, new __VLS_377({}));
const __VLS_379 = __VLS_378({}, ...__VLS_functionalComponentArgsRest(__VLS_378));
const { default: __VLS_382 } = __VLS_380.slots;
// @ts-ignore
[];
var __VLS_380;
let __VLS_383;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({
    label: "日文名称",
}));
const __VLS_385 = __VLS_384({
    label: "日文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_384));
const { default: __VLS_388 } = __VLS_386.slots;
let __VLS_389;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
    modelValue: (__VLS_ctx.form.translations.ja.name),
    placeholder: "日文名称",
}));
const __VLS_391 = __VLS_390({
    modelValue: (__VLS_ctx.form.translations.ja.name),
    placeholder: "日文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_390));
// @ts-ignore
[form,];
var __VLS_386;
let __VLS_394;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_395 = __VLS_asFunctionalComponent1(__VLS_394, new __VLS_394({
    label: "日文描述",
}));
const __VLS_396 = __VLS_395({
    label: "日文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_395));
const { default: __VLS_399 } = __VLS_397.slots;
let __VLS_400;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
    modelValue: (__VLS_ctx.form.translations.ja.description),
    type: "textarea",
    rows: (2),
    placeholder: "日文描述",
}));
const __VLS_402 = __VLS_401({
    modelValue: (__VLS_ctx.form.translations.ja.description),
    type: "textarea",
    rows: (2),
    placeholder: "日文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_401));
// @ts-ignore
[form,];
var __VLS_397;
let __VLS_405;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
    label: "韩文名称",
}));
const __VLS_407 = __VLS_406({
    label: "韩文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_406));
const { default: __VLS_410 } = __VLS_408.slots;
let __VLS_411;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_412 = __VLS_asFunctionalComponent1(__VLS_411, new __VLS_411({
    modelValue: (__VLS_ctx.form.translations.ko.name),
    placeholder: "韩文名称",
}));
const __VLS_413 = __VLS_412({
    modelValue: (__VLS_ctx.form.translations.ko.name),
    placeholder: "韩文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_412));
// @ts-ignore
[form,];
var __VLS_408;
let __VLS_416;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_417 = __VLS_asFunctionalComponent1(__VLS_416, new __VLS_416({
    label: "韩文描述",
}));
const __VLS_418 = __VLS_417({
    label: "韩文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_417));
const { default: __VLS_421 } = __VLS_419.slots;
let __VLS_422;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_423 = __VLS_asFunctionalComponent1(__VLS_422, new __VLS_422({
    modelValue: (__VLS_ctx.form.translations.ko.description),
    type: "textarea",
    rows: (2),
    placeholder: "韩文描述",
}));
const __VLS_424 = __VLS_423({
    modelValue: (__VLS_ctx.form.translations.ko.description),
    type: "textarea",
    rows: (2),
    placeholder: "韩文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_423));
// @ts-ignore
[form,];
var __VLS_419;
let __VLS_427;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_428 = __VLS_asFunctionalComponent1(__VLS_427, new __VLS_427({
    label: "英文名称",
}));
const __VLS_429 = __VLS_428({
    label: "英文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_428));
const { default: __VLS_432 } = __VLS_430.slots;
let __VLS_433;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_434 = __VLS_asFunctionalComponent1(__VLS_433, new __VLS_433({
    modelValue: (__VLS_ctx.form.translations.en.name),
    placeholder: "英文名称",
}));
const __VLS_435 = __VLS_434({
    modelValue: (__VLS_ctx.form.translations.en.name),
    placeholder: "英文名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_434));
// @ts-ignore
[form,];
var __VLS_430;
let __VLS_438;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({
    label: "英文描述",
}));
const __VLS_440 = __VLS_439({
    label: "英文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_439));
const { default: __VLS_443 } = __VLS_441.slots;
let __VLS_444;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_445 = __VLS_asFunctionalComponent1(__VLS_444, new __VLS_444({
    modelValue: (__VLS_ctx.form.translations.en.description),
    type: "textarea",
    rows: (2),
    placeholder: "英文描述",
}));
const __VLS_446 = __VLS_445({
    modelValue: (__VLS_ctx.form.translations.en.description),
    type: "textarea",
    rows: (2),
    placeholder: "英文描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_445));
// @ts-ignore
[form,];
var __VLS_441;
// @ts-ignore
[];
var __VLS_239;
{
    const { footer: __VLS_449 } = __VLS_231.slots;
    let __VLS_450;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_451 = __VLS_asFunctionalComponent1(__VLS_450, new __VLS_450({
        ...{ 'onClick': {} },
    }));
    const __VLS_452 = __VLS_451({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_451));
    let __VLS_455;
    const __VLS_456 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.formVisible = false;
            // @ts-ignore
            [formVisible,];
        },
    };
    const { default: __VLS_457 } = __VLS_453.slots;
    // @ts-ignore
    [];
    var __VLS_453;
    var __VLS_454;
    let __VLS_458;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_459 = __VLS_asFunctionalComponent1(__VLS_458, new __VLS_458({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_460 = __VLS_459({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_459));
    let __VLS_463;
    const __VLS_464 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_465 } = __VLS_461.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_461;
    var __VLS_462;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_231;
var __VLS_232;
let __VLS_466;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_467 = __VLS_asFunctionalComponent1(__VLS_466, new __VLS_466({
    modelValue: (__VLS_ctx.recordsVisible),
    title: "优惠券记录",
    width: "900px",
}));
const __VLS_468 = __VLS_467({
    modelValue: (__VLS_ctx.recordsVisible),
    title: "优惠券记录",
    width: "900px",
}, ...__VLS_functionalComponentArgsRest(__VLS_467));
const { default: __VLS_471 } = __VLS_469.slots;
let __VLS_472;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_473 = __VLS_asFunctionalComponent1(__VLS_472, new __VLS_472({
    data: (__VLS_ctx.recordsData),
    border: true,
    stripe: true,
}));
const __VLS_474 = __VLS_473({
    data: (__VLS_ctx.recordsData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_473));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.recordsLoading) }, null, null);
const { default: __VLS_477 } = __VLS_475.slots;
let __VLS_478;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_479 = __VLS_asFunctionalComponent1(__VLS_478, new __VLS_478({
    type: "index",
    label: "#",
    width: "50",
}));
const __VLS_480 = __VLS_479({
    type: "index",
    label: "#",
    width: "50",
}, ...__VLS_functionalComponentArgsRest(__VLS_479));
let __VLS_483;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_484 = __VLS_asFunctionalComponent1(__VLS_483, new __VLS_483({
    prop: "userId",
    label: "用户ID",
    width: "80",
}));
const __VLS_485 = __VLS_484({
    prop: "userId",
    label: "用户ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_484));
let __VLS_488;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_489 = __VLS_asFunctionalComponent1(__VLS_488, new __VLS_488({
    prop: "userName",
    label: "用户",
    minWidth: "120",
}));
const __VLS_490 = __VLS_489({
    prop: "userName",
    label: "用户",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_489));
let __VLS_493;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_495 = __VLS_494({
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_494));
const { default: __VLS_498 } = __VLS_496.slots;
{
    const { default: __VLS_499 } = __VLS_496.slots;
    const [{ row }] = __VLS_vSlot(__VLS_499);
    let __VLS_500;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_501 = __VLS_asFunctionalComponent1(__VLS_500, new __VLS_500({
        type: (row.status === 'USED' ? 'success' : row.status === 'RECEIVED' ? 'primary' : 'info'),
    }));
    const __VLS_502 = __VLS_501({
        type: (row.status === 'USED' ? 'success' : row.status === 'RECEIVED' ? 'primary' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_501));
    const { default: __VLS_505 } = __VLS_503.slots;
    (row.status);
    // @ts-ignore
    [vLoading, recordsVisible, recordsData, recordsLoading,];
    var __VLS_503;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_496;
let __VLS_506;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_507 = __VLS_asFunctionalComponent1(__VLS_506, new __VLS_506({
    prop: "usedOrderNo",
    label: "订单号",
    width: "160",
    showOverflowTooltip: true,
}));
const __VLS_508 = __VLS_507({
    prop: "usedOrderNo",
    label: "订单号",
    width: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_507));
let __VLS_511;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_512 = __VLS_asFunctionalComponent1(__VLS_511, new __VLS_511({
    prop: "receivedAt",
    label: "已收",
    width: "160",
}));
const __VLS_513 = __VLS_512({
    prop: "receivedAt",
    label: "已收",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_512));
let __VLS_516;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_517 = __VLS_asFunctionalComponent1(__VLS_516, new __VLS_516({
    prop: "usedAt",
    label: "已使用",
    width: "160",
}));
const __VLS_518 = __VLS_517({
    prop: "usedAt",
    label: "已使用",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_517));
// @ts-ignore
[];
var __VLS_475;
let __VLS_521;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_522 = __VLS_asFunctionalComponent1(__VLS_521, new __VLS_521({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.recordsPage),
    pageSize: (__VLS_ctx.recordsPageSize),
    total: (__VLS_ctx.recordsTotal),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_523 = __VLS_522({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.recordsPage),
    pageSize: (__VLS_ctx.recordsPageSize),
    total: (__VLS_ctx.recordsTotal),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_522));
let __VLS_526;
const __VLS_527 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchRecords),
};
var __VLS_524;
var __VLS_525;
{
    const { footer: __VLS_528 } = __VLS_469.slots;
    let __VLS_529;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_530 = __VLS_asFunctionalComponent1(__VLS_529, new __VLS_529({
        ...{ 'onClick': {} },
    }));
    const __VLS_531 = __VLS_530({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_530));
    let __VLS_534;
    const __VLS_535 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.recordsVisible = false;
            // @ts-ignore
            [recordsVisible, recordsPage, recordsPageSize, recordsTotal, fetchRecords,];
        },
    };
    const { default: __VLS_536 } = __VLS_532.slots;
    // @ts-ignore
    [];
    var __VLS_532;
    var __VLS_533;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_469;
// @ts-ignore
var __VLS_242 = __VLS_241;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
