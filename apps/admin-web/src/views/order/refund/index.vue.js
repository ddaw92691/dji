/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { refundApi } from '@/api/refund';
import { REFUND_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'AdminRefundView' });
const loading = ref(false);
const actionLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detail = ref(null);
const rejectVisible = ref(false);
const rejectingId = ref(null);
const rejectForm = reactive({ rejectReason: '' });
const searchForm = reactive({
    orderNo: '',
    userId: '',
    merchantId: '',
    refundStatus: '',
    dateRange: null,
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const params = {
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        };
        if (searchForm.orderNo)
            params.orderNo = searchForm.orderNo;
        if (searchForm.userId)
            params.userId = searchForm.userId;
        if (searchForm.merchantId)
            params.merchantId = searchForm.merchantId;
        if (searchForm.refundStatus)
            params.refundStatus = searchForm.refundStatus;
        if (searchForm.dateRange) {
            params.startDate = searchForm.dateRange[0];
            params.endDate = searchForm.dateRange[1];
        }
        const { data: res } = await refundApi.getRefunds(params);
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
async function openDetail(orderId) {
    const { data: res } = await refundApi.getRefundDetail(orderId);
    if (res.code !== 200)
        return;
    detail.value = res.data || null;
    detailVisible.value = true;
}
async function handleApprove(row) {
    try {
        await ElMessageBox.confirm(`确认通过订单退款 "${row.orderNo}"?`, '确认', { type: 'warning' });
    }
    catch {
        return;
    }
    actionLoading.value = true;
    try {
        const { data: res } = await refundApi.approveRefund(row.orderId);
        if (res.code !== 200)
            return;
        ElMessage.success('退款已通过');
        fetchData();
    }
    finally {
        actionLoading.value = false;
    }
}
function openReject(row) {
    rejectingId.value = row.orderId;
    rejectForm.rejectReason = '';
    rejectVisible.value = true;
}
async function handleReject() {
    if (!rejectingId.value || !rejectForm.rejectReason.trim()) {
        ElMessage.warning('请输入拒绝原因');
        return;
    }
    actionLoading.value = true;
    try {
        const { data: res } = await refundApi.rejectRefund(rejectingId.value, rejectForm.rejectReason);
        if (res.code !== 200)
            return;
        ElMessage.success('退款已拒绝');
        rejectVisible.value = false;
        fetchData();
    }
    finally {
        actionLoading.value = false;
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
    ...{ class: "refund-page" },
});
/** @type {__VLS_StyleScopedClasses['refund-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.orderNo),
    placeholder: "订单号",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.orderNo),
    placeholder: "订单号",
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
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_28;
var __VLS_29;
// @ts-ignore
[searchForm, handleSearch, handleSearch,];
var __VLS_22;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_41;
var __VLS_42;
// @ts-ignore
[searchForm, handleSearch, handleSearch,];
var __VLS_35;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.refundStatus),
    placeholder: "退款状态",
    clearable: true,
}));
const __VLS_53 = __VLS_52({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.refundStatus),
    placeholder: "退款状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_58 } = __VLS_54.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.REFUND_STATUS_OPTIONS))) {
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_61 = __VLS_60({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    // @ts-ignore
    [searchForm, handleSearch, REFUND_STATUS_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_48;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const { default: __VLS_69 } = __VLS_67.slots;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_72 = __VLS_71({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
var __VLS_73;
var __VLS_74;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_67;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({}));
const __VLS_79 = __VLS_78({}, ...__VLS_functionalComponentArgsRest(__VLS_78));
const { default: __VLS_82 } = __VLS_80.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_85 = __VLS_84({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_90 } = __VLS_86.slots;
// @ts-ignore
[handleSearch,];
var __VLS_86;
var __VLS_87;
// @ts-ignore
[];
var __VLS_80;
// @ts-ignore
[];
var __VLS_3;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_93 = __VLS_92({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_96 } = __VLS_94.slots;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_99 = __VLS_98({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    prop: "orderNo",
    label: "订单号",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_104 = __VLS_103({
    prop: "orderNo",
    label: "订单号",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    prop: "userName",
    label: "客户",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_109 = __VLS_108({
    prop: "userName",
    label: "客户",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    prop: "merchantName",
    label: "商户",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_114 = __VLS_113({
    prop: "merchantName",
    label: "商户",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    prop: "payAmount",
    label: "支付金额",
    width: "110",
    align: "right",
}));
const __VLS_119 = __VLS_118({
    prop: "payAmount",
    label: "支付金额",
    width: "110",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    label: "退款状态",
    width: "120",
    align: "center",
}));
const __VLS_124 = __VLS_123({
    label: "退款状态",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
{
    const { default: __VLS_128 } = __VLS_125.slots;
    const [{ row }] = __VLS_vSlot(__VLS_128);
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, row.refundStatus)),
    }));
    const __VLS_131 = __VLS_130({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, row.refundStatus)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    const { default: __VLS_134 } = __VLS_132.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, row.refundStatus));
    // @ts-ignore
    [REFUND_STATUS_OPTIONS, REFUND_STATUS_OPTIONS, tableData, vLoading, loading, getColorByValue, getLabelByValue,];
    var __VLS_132;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_125;
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    prop: "refundReason",
    label: "原因",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_137 = __VLS_136({
    prop: "refundReason",
    label: "原因",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_142 = __VLS_141({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_147 = __VLS_146({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
const { default: __VLS_150 } = __VLS_148.slots;
{
    const { default: __VLS_151 } = __VLS_148.slots;
    const [{ row }] = __VLS_vSlot(__VLS_151);
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_157;
    const __VLS_158 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row.orderId);
            // @ts-ignore
            [openDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:detail') }, null, null);
    const { default: __VLS_159 } = __VLS_155.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_155;
    var __VLS_156;
    if (row.refundStatus === 'REQUESTED') {
        let __VLS_160;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_162 = __VLS_161({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        let __VLS_165;
        const __VLS_166 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.refundStatus === 'REQUESTED'))
                    return;
                __VLS_ctx.handleApprove(row);
                // @ts-ignore
                [handleApprove,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:cancel') }, null, null);
        const { default: __VLS_167 } = __VLS_163.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_163;
        var __VLS_164;
    }
    if (row.refundStatus === 'REQUESTED') {
        let __VLS_168;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_170 = __VLS_169({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        let __VLS_173;
        const __VLS_174 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.refundStatus === 'REQUESTED'))
                    return;
                __VLS_ctx.openReject(row);
                // @ts-ignore
                [openReject,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:cancel') }, null, null);
        const { default: __VLS_175 } = __VLS_171.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_171;
        var __VLS_172;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_148;
// @ts-ignore
[];
var __VLS_94;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_178 = __VLS_177({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
let __VLS_181;
const __VLS_182 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_179;
var __VLS_180;
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    modelValue: (__VLS_ctx.detailVisible),
    title: "退款详情",
    width: "900px",
}));
const __VLS_185 = __VLS_184({
    modelValue: (__VLS_ctx.detailVisible),
    title: "退款详情",
    width: "900px",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
const { default: __VLS_188 } = __VLS_186.slots;
if (__VLS_ctx.detail) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "refund-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['refund-detail']} */ ;
    let __VLS_189;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_191 = __VLS_190({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    const { default: __VLS_194 } = __VLS_192.slots;
    let __VLS_195;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        label: "订单号",
    }));
    const __VLS_197 = __VLS_196({
        label: "订单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    const { default: __VLS_200 } = __VLS_198.slots;
    (__VLS_ctx.detail.orderNo);
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detail, detail,];
    var __VLS_198;
    let __VLS_201;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
        label: "客户",
    }));
    const __VLS_203 = __VLS_202({
        label: "客户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    const { default: __VLS_206 } = __VLS_204.slots;
    (__VLS_ctx.detail.userName);
    // @ts-ignore
    [detail,];
    var __VLS_204;
    let __VLS_207;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
        label: "商户",
    }));
    const __VLS_209 = __VLS_208({
        label: "商户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    const { default: __VLS_212 } = __VLS_210.slots;
    (__VLS_ctx.detail.merchantName || '-');
    // @ts-ignore
    [detail,];
    var __VLS_210;
    let __VLS_213;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        label: "用户ID",
    }));
    const __VLS_215 = __VLS_214({
        label: "用户ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const { default: __VLS_218 } = __VLS_216.slots;
    (__VLS_ctx.detail.userId);
    // @ts-ignore
    [detail,];
    var __VLS_216;
    let __VLS_219;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
        label: "退款状态",
    }));
    const __VLS_221 = __VLS_220({
        label: "退款状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_220));
    const { default: __VLS_224 } = __VLS_222.slots;
    let __VLS_225;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, __VLS_ctx.detail.refundStatus)),
    }));
    const __VLS_227 = __VLS_226({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, __VLS_ctx.detail.refundStatus)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    const { default: __VLS_230 } = __VLS_228.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.REFUND_STATUS_OPTIONS, __VLS_ctx.detail.refundStatus));
    // @ts-ignore
    [REFUND_STATUS_OPTIONS, REFUND_STATUS_OPTIONS, getColorByValue, getLabelByValue, detail, detail,];
    var __VLS_228;
    // @ts-ignore
    [];
    var __VLS_222;
    let __VLS_231;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
        label: "退款金额",
    }));
    const __VLS_233 = __VLS_232({
        label: "退款金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    const { default: __VLS_236 } = __VLS_234.slots;
    (__VLS_ctx.detail.refundAmount);
    // @ts-ignore
    [detail,];
    var __VLS_234;
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        label: "支付金额",
    }));
    const __VLS_239 = __VLS_238({
        label: "支付金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    const { default: __VLS_242 } = __VLS_240.slots;
    (__VLS_ctx.detail.payAmount);
    // @ts-ignore
    [detail,];
    var __VLS_240;
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
        label: "退款原因",
    }));
    const __VLS_245 = __VLS_244({
        label: "退款原因",
    }, ...__VLS_functionalComponentArgsRest(__VLS_244));
    const { default: __VLS_248 } = __VLS_246.slots;
    (__VLS_ctx.detail.refundReason || '-');
    // @ts-ignore
    [detail,];
    var __VLS_246;
    let __VLS_249;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
        label: "拒绝原因",
    }));
    const __VLS_251 = __VLS_250({
        label: "拒绝原因",
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    const { default: __VLS_254 } = __VLS_252.slots;
    (__VLS_ctx.detail.rejectReason || '-');
    // @ts-ignore
    [detail,];
    var __VLS_252;
    let __VLS_255;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
        label: "创建时间",
    }));
    const __VLS_257 = __VLS_256({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_256));
    const { default: __VLS_260 } = __VLS_258.slots;
    (__VLS_ctx.detail.createdAt);
    // @ts-ignore
    [detail,];
    var __VLS_258;
    let __VLS_261;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
        label: "审核时间",
    }));
    const __VLS_263 = __VLS_262({
        label: "审核时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    const { default: __VLS_266 } = __VLS_264.slots;
    (__VLS_ctx.detail.reviewedAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_264;
    // @ts-ignore
    [];
    var __VLS_192;
    let __VLS_267;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({}));
    const __VLS_269 = __VLS_268({}, ...__VLS_functionalComponentArgsRest(__VLS_268));
    const { default: __VLS_272 } = __VLS_270.slots;
    // @ts-ignore
    [];
    var __VLS_270;
    let __VLS_273;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent1(__VLS_273, new __VLS_273({
        data: (__VLS_ctx.detail.items),
        border: true,
        size: "small",
    }));
    const __VLS_275 = __VLS_274({
        data: (__VLS_ctx.detail.items),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_274));
    const { default: __VLS_278 } = __VLS_276.slots;
    let __VLS_279;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
        label: "图片",
        width: "80",
    }));
    const __VLS_281 = __VLS_280({
        label: "图片",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_280));
    const { default: __VLS_284 } = __VLS_282.slots;
    {
        const { default: __VLS_285 } = __VLS_282.slots;
        const [{ row: item }] = __VLS_vSlot(__VLS_285);
        if (item.productImage) {
            let __VLS_286;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
                src: (item.productImage),
                ...{ style: {} },
                fit: "cover",
            }));
            const __VLS_288 = __VLS_287({
                src: (item.productImage),
                ...{ style: {} },
                fit: "cover",
            }, ...__VLS_functionalComponentArgsRest(__VLS_287));
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        }
        // @ts-ignore
        [detail,];
    }
    // @ts-ignore
    [];
    var __VLS_282;
    let __VLS_291;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
        prop: "productTitle",
        label: "商品",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_293 = __VLS_292({
        prop: "productTitle",
        label: "商品",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_296;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
        prop: "price",
        label: "价格",
        width: "100",
    }));
    const __VLS_298 = __VLS_297({
        prop: "price",
        label: "价格",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    let __VLS_301;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
        prop: "quantity",
        label: "数量",
        width: "60",
    }));
    const __VLS_303 = __VLS_302({
        prop: "quantity",
        label: "数量",
        width: "60",
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    let __VLS_306;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
        label: "小计",
        width: "100",
    }));
    const __VLS_308 = __VLS_307({
        label: "小计",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    const { default: __VLS_311 } = __VLS_309.slots;
    {
        const { default: __VLS_312 } = __VLS_309.slots;
        const [{ row: item }] = __VLS_vSlot(__VLS_312);
        ((item.price * item.quantity).toFixed(2));
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_309;
    // @ts-ignore
    [];
    var __VLS_276;
    let __VLS_313;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({}));
    const __VLS_315 = __VLS_314({}, ...__VLS_functionalComponentArgsRest(__VLS_314));
    const { default: __VLS_318 } = __VLS_316.slots;
    // @ts-ignore
    [];
    var __VLS_316;
    if (__VLS_ctx.detail.payment) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "info-box" },
        });
        /** @type {__VLS_StyleScopedClasses['info-box']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.payment.method || '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.payment.transactionNo || '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.payment.paidAt || '-');
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
}
{
    const { footer: __VLS_319 } = __VLS_186.slots;
    let __VLS_320;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_321 = __VLS_asFunctionalComponent1(__VLS_320, new __VLS_320({
        ...{ 'onClick': {} },
    }));
    const __VLS_322 = __VLS_321({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_321));
    let __VLS_325;
    const __VLS_326 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible, detail, detail, detail, detail,];
        },
    };
    const { default: __VLS_327 } = __VLS_323.slots;
    // @ts-ignore
    [];
    var __VLS_323;
    var __VLS_324;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_186;
let __VLS_328;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({
    modelValue: (__VLS_ctx.rejectVisible),
    title: "拒绝退款",
    width: "480px",
}));
const __VLS_330 = __VLS_329({
    modelValue: (__VLS_ctx.rejectVisible),
    title: "拒绝退款",
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_329));
const { default: __VLS_333 } = __VLS_331.slots;
let __VLS_334;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
    model: (__VLS_ctx.rejectForm),
    labelWidth: "110px",
}));
const __VLS_336 = __VLS_335({
    model: (__VLS_ctx.rejectForm),
    labelWidth: "110px",
}, ...__VLS_functionalComponentArgsRest(__VLS_335));
const { default: __VLS_339 } = __VLS_337.slots;
let __VLS_340;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
    label: "拒绝原因",
    required: true,
}));
const __VLS_342 = __VLS_341({
    label: "拒绝原因",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_341));
const { default: __VLS_345 } = __VLS_343.slots;
let __VLS_346;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_347 = __VLS_asFunctionalComponent1(__VLS_346, new __VLS_346({
    modelValue: (__VLS_ctx.rejectForm.rejectReason),
    type: "textarea",
    rows: (4),
    placeholder: "请输入拒绝原因",
}));
const __VLS_348 = __VLS_347({
    modelValue: (__VLS_ctx.rejectForm.rejectReason),
    type: "textarea",
    rows: (4),
    placeholder: "请输入拒绝原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_347));
// @ts-ignore
[rejectVisible, rejectForm, rejectForm,];
var __VLS_343;
// @ts-ignore
[];
var __VLS_337;
{
    const { footer: __VLS_351 } = __VLS_331.slots;
    let __VLS_352;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_353 = __VLS_asFunctionalComponent1(__VLS_352, new __VLS_352({
        ...{ 'onClick': {} },
    }));
    const __VLS_354 = __VLS_353({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_353));
    let __VLS_357;
    const __VLS_358 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.rejectVisible = false;
            // @ts-ignore
            [rejectVisible,];
        },
    };
    const { default: __VLS_359 } = __VLS_355.slots;
    // @ts-ignore
    [];
    var __VLS_355;
    var __VLS_356;
    let __VLS_360;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent1(__VLS_360, new __VLS_360({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.actionLoading),
    }));
    const __VLS_362 = __VLS_361({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.actionLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    let __VLS_365;
    const __VLS_366 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleReject),
    };
    const { default: __VLS_367 } = __VLS_363.slots;
    // @ts-ignore
    [actionLoading, handleReject,];
    var __VLS_363;
    var __VLS_364;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_331;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
