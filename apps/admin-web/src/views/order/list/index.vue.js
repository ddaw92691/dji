/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { orderApi } from '@/api/order';
import { ORDER_STATUS_OPTIONS, PAY_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'AdminOrderView' });
const loading = ref(false);
const statusLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detail = ref(null);
const statusVisible = ref(false);
const statusFormRef = ref();
const editingOrderId = ref(null);
const EDITABLE_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.filter((o) => o.value !== 'pendingPayment');
const isAdvanceOrder = (row) => !!row.orderSource && row.orderSource !== 'CUSTOMER';
const advanceText = (row) => {
    if (row.settleStatus === 'SETTLED')
        return '已结算';
    if (row.merchantPaidStatus === 'PAID')
        return '待结算';
    return '待垫付';
};
const handleSetEstimatedArrival = async (row) => {
    try {
        const defaultValue = row.expectedArrivalAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19);
        const { value } = await ElMessageBox.prompt('请输入预计到货时间，格式：YYYY-MM-DDTHH:mm:ss', '设置预计到货', { confirmButtonText: '保存', cancelButtonText: '取消', inputValue: defaultValue });
        const { data: res } = await orderApi.setEstimatedArrival(row.id, { expectedArrivalAt: value });
        if (res.code === 200) {
            ElMessage.success('预计到货时间已更新');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '设置失败');
        }
    }
    catch {
        /* canceled */
    }
};
const handleMarkArrived = async (row) => {
    try {
        await ElMessageBox.confirm(`确认订单 ${row.orderNo} 已到货？`, '标记到货', {
            confirmButtonText: '确认到货',
            cancelButtonText: '取消',
            type: 'warning',
        });
        const { data: res } = await orderApi.markArrived(row.id);
        if (res.code === 200) {
            ElMessage.success('已标记到货');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '标记失败');
        }
    }
    catch {
        /* canceled */
    }
};
const handleSettle = async (row) => {
    try {
        await ElMessageBox.confirm(`确认结算订单 ${row.orderNo}？货款 ${row.goodsCost ?? 0} + 利润 ${row.merchantProfit ?? 0} 将返还商家余额。`, '结算货款', { confirmButtonText: '确认结算', cancelButtonText: '取消', type: 'warning' });
        const { data: res } = await orderApi.settle(row.id);
        if (res.code === 200) {
            ElMessage.success('已结算');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '结算失败');
        }
    }
    catch {
        /* canceled */
    }
};
const statusStep = computed(() => {
    if (!detail.value)
        return 0;
    if (detail.value.completedAt)
        return 3;
    if (detail.value.shippedAt)
        return 2;
    if (detail.value.paidAt)
        return 1;
    return 0;
});
const searchForm = reactive({
    orderNo: '',
    userId: '',
    merchantId: '',
    status: '',
    payStatus: '',
    dateRange: null,
    page: 1,
    pageSize: 20,
});
const statusForm = reactive({
    status: '',
    remark: '',
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
        if (searchForm.status)
            params.status = searchForm.status;
        if (searchForm.payStatus)
            params.payStatus = searchForm.payStatus;
        if (searchForm.dateRange) {
            params.startDate = searchForm.dateRange[0];
            params.endDate = searchForm.dateRange[1];
        }
        const { data: res } = await orderApi.getOrders(params);
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
async function openDetail(id) {
    const { data: res } = await orderApi.getOrderDetail(id);
    if (res.code !== 200)
        return;
    detail.value = res.data || null;
    detailVisible.value = true;
}
function openStatusEdit(row) {
    editingOrderId.value = row.id;
    statusForm.status = '';
    statusForm.remark = '';
    statusVisible.value = true;
}
async function handleStatusUpdate() {
    if (!editingOrderId.value || !statusForm.status)
        return;
    statusLoading.value = true;
    try {
        const { data: res } = await orderApi.updateOrderStatus(editingOrderId.value, {
            status: statusForm.status,
            remark: statusForm.remark,
        });
        if (res.code !== 200)
            return;
        ElMessage.success('订单状态已更新');
        statusVisible.value = false;
        fetchData();
    }
    finally {
        statusLoading.value = false;
    }
}
function resetStatusForm() {
    statusFormRef.value?.resetFields();
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
    ...{ class: "order-page" },
});
/** @type {__VLS_StyleScopedClasses['order-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_53 = __VLS_52({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_58 } = __VLS_54.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.ORDER_STATUS_OPTIONS))) {
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
    [searchForm, handleSearch, ORDER_STATUS_OPTIONS,];
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
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.payStatus),
    placeholder: "支付状态",
    clearable: true,
}));
const __VLS_72 = __VLS_71({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.payStatus),
    placeholder: "支付状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
const __VLS_76 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_77 } = __VLS_73.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.PAY_STATUS_OPTIONS))) {
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_80 = __VLS_79({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    // @ts-ignore
    [searchForm, handleSearch, PAY_STATUS_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_73;
var __VLS_74;
// @ts-ignore
[];
var __VLS_67;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({}));
const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_91 = __VLS_90({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
const __VLS_95 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
var __VLS_92;
var __VLS_93;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_86;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({}));
const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_104 = __VLS_103({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
let __VLS_107;
const __VLS_108 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_109 } = __VLS_105.slots;
// @ts-ignore
[handleSearch,];
var __VLS_105;
var __VLS_106;
// @ts-ignore
[];
var __VLS_99;
// @ts-ignore
[];
var __VLS_3;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_112 = __VLS_111({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_115 } = __VLS_113.slots;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_118 = __VLS_117({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    prop: "orderNo",
    label: "订单号",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_123 = __VLS_122({
    prop: "orderNo",
    label: "订单号",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    prop: "userName",
    label: "客户",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_128 = __VLS_127({
    prop: "userName",
    label: "客户",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    prop: "merchantName",
    label: "商户",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_133 = __VLS_132({
    prop: "merchantName",
    label: "商户",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    label: "明细",
    minWidth: "200",
}));
const __VLS_138 = __VLS_137({
    label: "明细",
    minWidth: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
{
    const { default: __VLS_142 } = __VLS_139.slots;
    const [{ row }] = __VLS_vSlot(__VLS_142);
    if (row.items?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.items[0].productTitle);
        if (row.items.length > 1) {
            let __VLS_143;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
                size: "small",
                type: "info",
                ...{ style: {} },
            }));
            const __VLS_145 = __VLS_144({
                size: "small",
                type: "info",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_144));
            const { default: __VLS_148 } = __VLS_146.slots;
            (row.items.length - 1);
            // @ts-ignore
            [tableData, vLoading, loading,];
            var __VLS_146;
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_139;
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    prop: "payAmount",
    label: "金额",
    width: "100",
    align: "right",
}));
const __VLS_151 = __VLS_150({
    prop: "payAmount",
    label: "金额",
    width: "100",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    label: "状态",
    width: "110",
    align: "center",
}));
const __VLS_156 = __VLS_155({
    label: "状态",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
const { default: __VLS_159 } = __VLS_157.slots;
{
    const { default: __VLS_160 } = __VLS_157.slots;
    const [{ row }] = __VLS_vSlot(__VLS_160);
    let __VLS_161;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, row.status)),
    }));
    const __VLS_163 = __VLS_162({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    const { default: __VLS_166 } = __VLS_164.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, row.status));
    // @ts-ignore
    [ORDER_STATUS_OPTIONS, ORDER_STATUS_OPTIONS, getColorByValue, getLabelByValue,];
    var __VLS_164;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_157;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    label: "支付",
    width: "110",
    align: "center",
}));
const __VLS_169 = __VLS_168({
    label: "支付",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
const { default: __VLS_172 } = __VLS_170.slots;
{
    const { default: __VLS_173 } = __VLS_170.slots;
    const [{ row }] = __VLS_vSlot(__VLS_173);
    let __VLS_174;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.PAY_STATUS_OPTIONS, row.payStatus)),
    }));
    const __VLS_176 = __VLS_175({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.PAY_STATUS_OPTIONS, row.payStatus)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    const { default: __VLS_179 } = __VLS_177.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.PAY_STATUS_OPTIONS, row.payStatus));
    // @ts-ignore
    [PAY_STATUS_OPTIONS, PAY_STATUS_OPTIONS, getColorByValue, getLabelByValue,];
    var __VLS_177;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_170;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    label: "垫付/结算",
    width: "110",
    align: "center",
}));
const __VLS_182 = __VLS_181({
    label: "垫付/结算",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
const { default: __VLS_185 } = __VLS_183.slots;
{
    const { default: __VLS_186 } = __VLS_183.slots;
    const [{ row }] = __VLS_vSlot(__VLS_186);
    if (__VLS_ctx.isAdvanceOrder(row)) {
        let __VLS_187;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
            type: (row.settleStatus === 'SETTLED' ? 'success' : row.merchantPaidStatus === 'PAID' ? 'warning' : 'info'),
        }));
        const __VLS_189 = __VLS_188({
            type: (row.settleStatus === 'SETTLED' ? 'success' : row.merchantPaidStatus === 'PAID' ? 'warning' : 'info'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_188));
        const { default: __VLS_192 } = __VLS_190.slots;
        (__VLS_ctx.advanceText(row));
        // @ts-ignore
        [isAdvanceOrder, advanceText,];
        var __VLS_190;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_183;
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    prop: "expectedArrivalAt",
    label: "预计到货",
    width: "170",
}));
const __VLS_195 = __VLS_194({
    prop: "expectedArrivalAt",
    label: "预计到货",
    width: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    label: "到货状态",
    width: "110",
    align: "center",
}));
const __VLS_200 = __VLS_199({
    label: "到货状态",
    width: "110",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
{
    const { default: __VLS_204 } = __VLS_201.slots;
    const [{ row }] = __VLS_vSlot(__VLS_204);
    if (__VLS_ctx.isAdvanceOrder(row)) {
        let __VLS_205;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
            type: (row.arrivalStatus === 'ARRIVED' ? 'success' : 'info'),
        }));
        const __VLS_207 = __VLS_206({
            type: (row.arrivalStatus === 'ARRIVED' ? 'success' : 'info'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        const { default: __VLS_210 } = __VLS_208.slots;
        (row.arrivalStatus === 'ARRIVED' ? '已到货' : '等待到货');
        // @ts-ignore
        [isAdvanceOrder,];
        var __VLS_208;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_201;
let __VLS_211;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_213 = __VLS_212({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
let __VLS_216;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
    label: "操作",
    width: "330",
    fixed: "right",
}));
const __VLS_218 = __VLS_217({
    label: "操作",
    width: "330",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const { default: __VLS_221 } = __VLS_219.slots;
{
    const { default: __VLS_222 } = __VLS_219.slots;
    const [{ row }] = __VLS_vSlot(__VLS_222);
    let __VLS_223;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_225 = __VLS_224({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
    let __VLS_228;
    const __VLS_229 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row.id);
            // @ts-ignore
            [openDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:detail') }, null, null);
    const { default: __VLS_230 } = __VLS_226.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_226;
    var __VLS_227;
    let __VLS_231;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }));
    const __VLS_233 = __VLS_232({
        ...{ 'onClick': {} },
        link: true,
        type: "warning",
    }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    let __VLS_236;
    const __VLS_237 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openStatusEdit(row);
            // @ts-ignore
            [openStatusEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:ship') }, null, null);
    const { default: __VLS_238 } = __VLS_234.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_234;
    var __VLS_235;
    if (__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.settleStatus !== 'SETTLED') {
        let __VLS_239;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_241 = __VLS_240({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_240));
        let __VLS_244;
        const __VLS_245 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.settleStatus !== 'SETTLED'))
                    return;
                __VLS_ctx.handleSetEstimatedArrival(row);
                // @ts-ignore
                [isAdvanceOrder, handleSetEstimatedArrival,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:ship') }, null, null);
        const { default: __VLS_246 } = __VLS_242.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_242;
        var __VLS_243;
    }
    if (__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.arrivalStatus !== 'ARRIVED') {
        let __VLS_247;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
        }));
        const __VLS_249 = __VLS_248({
            ...{ 'onClick': {} },
            link: true,
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_248));
        let __VLS_252;
        const __VLS_253 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.arrivalStatus !== 'ARRIVED'))
                    return;
                __VLS_ctx.handleMarkArrived(row);
                // @ts-ignore
                [isAdvanceOrder, handleMarkArrived,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:ship') }, null, null);
        const { default: __VLS_254 } = __VLS_250.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_250;
        var __VLS_251;
    }
    if (__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.arrivalStatus === 'ARRIVED' && row.settleStatus !== 'SETTLED') {
        let __VLS_255;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_257 = __VLS_256({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_256));
        let __VLS_260;
        const __VLS_261 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isAdvanceOrder(row) && row.merchantPaidStatus === 'PAID' && row.arrivalStatus === 'ARRIVED' && row.settleStatus !== 'SETTLED'))
                    return;
                __VLS_ctx.handleSettle(row);
                // @ts-ignore
                [isAdvanceOrder, handleSettle,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('order:ship') }, null, null);
        const { default: __VLS_262 } = __VLS_258.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_258;
        var __VLS_259;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_219;
// @ts-ignore
[];
var __VLS_113;
let __VLS_263;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_265 = __VLS_264({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
let __VLS_268;
const __VLS_269 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_266;
var __VLS_267;
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    modelValue: (__VLS_ctx.detailVisible),
    title: "订单详情",
    width: "900px",
}));
const __VLS_272 = __VLS_271({
    modelValue: (__VLS_ctx.detailVisible),
    title: "订单详情",
    width: "900px",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
const { default: __VLS_275 } = __VLS_273.slots;
if (__VLS_ctx.detail) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "order-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['order-detail']} */ ;
    let __VLS_276;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_278 = __VLS_277({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    const { default: __VLS_281 } = __VLS_279.slots;
    let __VLS_282;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_283 = __VLS_asFunctionalComponent1(__VLS_282, new __VLS_282({
        label: "订单号",
    }));
    const __VLS_284 = __VLS_283({
        label: "订单号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_283));
    const { default: __VLS_287 } = __VLS_285.slots;
    (__VLS_ctx.detail.orderNo);
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detail, detail,];
    var __VLS_285;
    let __VLS_288;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent1(__VLS_288, new __VLS_288({
        label: "客户",
    }));
    const __VLS_290 = __VLS_289({
        label: "客户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    const { default: __VLS_293 } = __VLS_291.slots;
    (__VLS_ctx.detail.userName);
    // @ts-ignore
    [detail,];
    var __VLS_291;
    let __VLS_294;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_295 = __VLS_asFunctionalComponent1(__VLS_294, new __VLS_294({
        label: "商户",
    }));
    const __VLS_296 = __VLS_295({
        label: "商户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_295));
    const { default: __VLS_299 } = __VLS_297.slots;
    (__VLS_ctx.detail.merchantName || '-');
    // @ts-ignore
    [detail,];
    var __VLS_297;
    let __VLS_300;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
        label: "用户ID",
    }));
    const __VLS_302 = __VLS_301({
        label: "用户ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    const { default: __VLS_305 } = __VLS_303.slots;
    (__VLS_ctx.detail.userId);
    // @ts-ignore
    [detail,];
    var __VLS_303;
    let __VLS_306;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
        label: "状态",
    }));
    const __VLS_308 = __VLS_307({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    const { default: __VLS_311 } = __VLS_309.slots;
    let __VLS_312;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_313 = __VLS_asFunctionalComponent1(__VLS_312, new __VLS_312({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, __VLS_ctx.detail.status)),
    }));
    const __VLS_314 = __VLS_313({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, __VLS_ctx.detail.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_313));
    const { default: __VLS_317 } = __VLS_315.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.ORDER_STATUS_OPTIONS, __VLS_ctx.detail.status));
    // @ts-ignore
    [ORDER_STATUS_OPTIONS, ORDER_STATUS_OPTIONS, getColorByValue, getLabelByValue, detail, detail,];
    var __VLS_315;
    // @ts-ignore
    [];
    var __VLS_309;
    let __VLS_318;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
        label: "支付状态",
    }));
    const __VLS_320 = __VLS_319({
        label: "支付状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_319));
    const { default: __VLS_323 } = __VLS_321.slots;
    let __VLS_324;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_325 = __VLS_asFunctionalComponent1(__VLS_324, new __VLS_324({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.PAY_STATUS_OPTIONS, __VLS_ctx.detail.payStatus)),
    }));
    const __VLS_326 = __VLS_325({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.PAY_STATUS_OPTIONS, __VLS_ctx.detail.payStatus)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_325));
    const { default: __VLS_329 } = __VLS_327.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.PAY_STATUS_OPTIONS, __VLS_ctx.detail.payStatus));
    // @ts-ignore
    [PAY_STATUS_OPTIONS, PAY_STATUS_OPTIONS, getColorByValue, getLabelByValue, detail, detail,];
    var __VLS_327;
    // @ts-ignore
    [];
    var __VLS_321;
    let __VLS_330;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
        label: "总金额",
    }));
    const __VLS_332 = __VLS_331({
        label: "总金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_331));
    const { default: __VLS_335 } = __VLS_333.slots;
    (__VLS_ctx.detail.totalAmount);
    // @ts-ignore
    [detail,];
    var __VLS_333;
    let __VLS_336;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
        label: "支付金额",
    }));
    const __VLS_338 = __VLS_337({
        label: "支付金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    const { default: __VLS_341 } = __VLS_339.slots;
    (__VLS_ctx.detail.payAmount);
    // @ts-ignore
    [detail,];
    var __VLS_339;
    let __VLS_342;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_343 = __VLS_asFunctionalComponent1(__VLS_342, new __VLS_342({
        label: "支付时间",
    }));
    const __VLS_344 = __VLS_343({
        label: "支付时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_343));
    const { default: __VLS_347 } = __VLS_345.slots;
    (__VLS_ctx.detail.paidAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_345;
    let __VLS_348;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent1(__VLS_348, new __VLS_348({
        label: "发货时间",
    }));
    const __VLS_350 = __VLS_349({
        label: "发货时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    const { default: __VLS_353 } = __VLS_351.slots;
    (__VLS_ctx.detail.shippedAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_351;
    let __VLS_354;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
        label: "完成时间",
    }));
    const __VLS_356 = __VLS_355({
        label: "完成时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_355));
    const { default: __VLS_359 } = __VLS_357.slots;
    (__VLS_ctx.detail.completedAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_357;
    let __VLS_360;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_361 = __VLS_asFunctionalComponent1(__VLS_360, new __VLS_360({
        label: "创建时间",
    }));
    const __VLS_362 = __VLS_361({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_361));
    const { default: __VLS_365 } = __VLS_363.slots;
    (__VLS_ctx.detail.createdAt);
    // @ts-ignore
    [detail,];
    var __VLS_363;
    // @ts-ignore
    [];
    var __VLS_279;
    let __VLS_366;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({}));
    const __VLS_368 = __VLS_367({}, ...__VLS_functionalComponentArgsRest(__VLS_367));
    const { default: __VLS_371 } = __VLS_369.slots;
    // @ts-ignore
    [];
    var __VLS_369;
    let __VLS_372;
    /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
    elTable;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({
        data: (__VLS_ctx.detail.items),
        border: true,
        size: "small",
    }));
    const __VLS_374 = __VLS_373({
        data: (__VLS_ctx.detail.items),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    const { default: __VLS_377 } = __VLS_375.slots;
    let __VLS_378;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_379 = __VLS_asFunctionalComponent1(__VLS_378, new __VLS_378({
        label: "图片",
        width: "80",
    }));
    const __VLS_380 = __VLS_379({
        label: "图片",
        width: "80",
    }, ...__VLS_functionalComponentArgsRest(__VLS_379));
    const { default: __VLS_383 } = __VLS_381.slots;
    {
        const { default: __VLS_384 } = __VLS_381.slots;
        const [{ row: item }] = __VLS_vSlot(__VLS_384);
        if (item.productImage) {
            let __VLS_385;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_386 = __VLS_asFunctionalComponent1(__VLS_385, new __VLS_385({
                src: (item.productImage),
                ...{ style: {} },
                fit: "cover",
            }));
            const __VLS_387 = __VLS_386({
                src: (item.productImage),
                ...{ style: {} },
                fit: "cover",
            }, ...__VLS_functionalComponentArgsRest(__VLS_386));
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        }
        // @ts-ignore
        [detail,];
    }
    // @ts-ignore
    [];
    var __VLS_381;
    let __VLS_390;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_391 = __VLS_asFunctionalComponent1(__VLS_390, new __VLS_390({
        prop: "productTitle",
        label: "商品",
        minWidth: "180",
        showOverflowTooltip: true,
    }));
    const __VLS_392 = __VLS_391({
        prop: "productTitle",
        label: "商品",
        minWidth: "180",
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_391));
    let __VLS_395;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({
        prop: "price",
        label: "价格",
        width: "100",
    }));
    const __VLS_397 = __VLS_396({
        prop: "price",
        label: "价格",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_396));
    let __VLS_400;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
        prop: "quantity",
        label: "数量",
        width: "60",
    }));
    const __VLS_402 = __VLS_401({
        prop: "quantity",
        label: "数量",
        width: "60",
    }, ...__VLS_functionalComponentArgsRest(__VLS_401));
    let __VLS_405;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
        label: "小计",
        width: "100",
    }));
    const __VLS_407 = __VLS_406({
        label: "小计",
        width: "100",
    }, ...__VLS_functionalComponentArgsRest(__VLS_406));
    const { default: __VLS_410 } = __VLS_408.slots;
    {
        const { default: __VLS_411 } = __VLS_408.slots;
        const [{ row: item }] = __VLS_vSlot(__VLS_411);
        ((item.price * item.quantity).toFixed(2));
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_408;
    // @ts-ignore
    [];
    var __VLS_375;
    let __VLS_412;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent1(__VLS_412, new __VLS_412({}));
    const __VLS_414 = __VLS_413({}, ...__VLS_functionalComponentArgsRest(__VLS_413));
    const { default: __VLS_417 } = __VLS_415.slots;
    // @ts-ignore
    [];
    var __VLS_415;
    if (__VLS_ctx.detail.addressSnapshot) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "address-info" },
        });
        /** @type {__VLS_StyleScopedClasses['address-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.addressSnapshot.receiverName || '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.addressSnapshot.receiverPhone || '-');
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.detail.addressSnapshot.detailAddress || '-');
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    let __VLS_418;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_419 = __VLS_asFunctionalComponent1(__VLS_418, new __VLS_418({}));
    const __VLS_420 = __VLS_419({}, ...__VLS_functionalComponentArgsRest(__VLS_419));
    const { default: __VLS_423 } = __VLS_421.slots;
    // @ts-ignore
    [detail, detail, detail, detail,];
    var __VLS_421;
    if (__VLS_ctx.detail.payment) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "address-info" },
        });
        /** @type {__VLS_StyleScopedClasses['address-info']} */ ;
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
    let __VLS_424;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_425 = __VLS_asFunctionalComponent1(__VLS_424, new __VLS_424({}));
    const __VLS_426 = __VLS_425({}, ...__VLS_functionalComponentArgsRest(__VLS_425));
    const { default: __VLS_429 } = __VLS_427.slots;
    // @ts-ignore
    [detail, detail, detail, detail,];
    var __VLS_427;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "address-info" },
    });
    /** @type {__VLS_StyleScopedClasses['address-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detail.logisticsCompany || '-');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.detail.trackingNo || '-');
    let __VLS_430;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_431 = __VLS_asFunctionalComponent1(__VLS_430, new __VLS_430({}));
    const __VLS_432 = __VLS_431({}, ...__VLS_functionalComponentArgsRest(__VLS_431));
    const { default: __VLS_435 } = __VLS_433.slots;
    // @ts-ignore
    [detail, detail,];
    var __VLS_433;
    let __VLS_436;
    /** @ts-ignore @type { | typeof __VLS_components.elSteps | typeof __VLS_components.ElSteps | typeof __VLS_components['el-steps'] | typeof __VLS_components.elSteps | typeof __VLS_components.ElSteps | typeof __VLS_components['el-steps']} */
    elSteps;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent1(__VLS_436, new __VLS_436({
        active: (__VLS_ctx.statusStep),
        alignCenter: true,
        ...{ style: {} },
    }));
    const __VLS_438 = __VLS_437({
        active: (__VLS_ctx.statusStep),
        alignCenter: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
    const { default: __VLS_441 } = __VLS_439.slots;
    let __VLS_442;
    /** @ts-ignore @type { | typeof __VLS_components.elStep | typeof __VLS_components.ElStep | typeof __VLS_components['el-step']} */
    elStep;
    // @ts-ignore
    const __VLS_443 = __VLS_asFunctionalComponent1(__VLS_442, new __VLS_442({
        title: "已创建",
        description: (__VLS_ctx.detail.createdAt),
    }));
    const __VLS_444 = __VLS_443({
        title: "已创建",
        description: (__VLS_ctx.detail.createdAt),
    }, ...__VLS_functionalComponentArgsRest(__VLS_443));
    let __VLS_447;
    /** @ts-ignore @type { | typeof __VLS_components.elStep | typeof __VLS_components.ElStep | typeof __VLS_components['el-step']} */
    elStep;
    // @ts-ignore
    const __VLS_448 = __VLS_asFunctionalComponent1(__VLS_447, new __VLS_447({
        title: "已支付",
        description: (__VLS_ctx.detail.paidAt || '-'),
    }));
    const __VLS_449 = __VLS_448({
        title: "已支付",
        description: (__VLS_ctx.detail.paidAt || '-'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_448));
    let __VLS_452;
    /** @ts-ignore @type { | typeof __VLS_components.elStep | typeof __VLS_components.ElStep | typeof __VLS_components['el-step']} */
    elStep;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({
        title: "已发货",
        description: (__VLS_ctx.detail.shippedAt || '-'),
    }));
    const __VLS_454 = __VLS_453({
        title: "已发货",
        description: (__VLS_ctx.detail.shippedAt || '-'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    let __VLS_457;
    /** @ts-ignore @type { | typeof __VLS_components.elStep | typeof __VLS_components.ElStep | typeof __VLS_components['el-step']} */
    elStep;
    // @ts-ignore
    const __VLS_458 = __VLS_asFunctionalComponent1(__VLS_457, new __VLS_457({
        title: "已完成",
        description: (__VLS_ctx.detail.completedAt || '-'),
    }));
    const __VLS_459 = __VLS_458({
        title: "已完成",
        description: (__VLS_ctx.detail.completedAt || '-'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_458));
    // @ts-ignore
    [detail, detail, detail, detail, statusStep,];
    var __VLS_439;
}
{
    const { footer: __VLS_462 } = __VLS_273.slots;
    let __VLS_463;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_464 = __VLS_asFunctionalComponent1(__VLS_463, new __VLS_463({
        ...{ 'onClick': {} },
    }));
    const __VLS_465 = __VLS_464({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_464));
    let __VLS_468;
    const __VLS_469 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_470 } = __VLS_466.slots;
    // @ts-ignore
    [];
    var __VLS_466;
    var __VLS_467;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_273;
let __VLS_471;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_472 = __VLS_asFunctionalComponent1(__VLS_471, new __VLS_471({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.statusVisible),
    title: "更新订单状态",
    width: "480px",
}));
const __VLS_473 = __VLS_472({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.statusVisible),
    title: "更新订单状态",
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_472));
let __VLS_476;
const __VLS_477 = {
    ...{ closed: {} },
    onClosed: (__VLS_ctx.resetStatusForm),
};
const { default: __VLS_478 } = __VLS_474.slots;
let __VLS_479;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_480 = __VLS_asFunctionalComponent1(__VLS_479, new __VLS_479({
    ref: "statusFormRef",
    model: (__VLS_ctx.statusForm),
    labelWidth: "120px",
}));
const __VLS_481 = __VLS_480({
    ref: "statusFormRef",
    model: (__VLS_ctx.statusForm),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_480));
var __VLS_484;
const { default: __VLS_486 } = __VLS_482.slots;
let __VLS_487;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_488 = __VLS_asFunctionalComponent1(__VLS_487, new __VLS_487({
    label: "状态",
    prop: "status",
    required: true,
}));
const __VLS_489 = __VLS_488({
    label: "状态",
    prop: "status",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_488));
const { default: __VLS_492 } = __VLS_490.slots;
let __VLS_493;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
    modelValue: (__VLS_ctx.statusForm.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_495 = __VLS_494({
    modelValue: (__VLS_ctx.statusForm.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_494));
const { default: __VLS_498 } = __VLS_496.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.EDITABLE_STATUS_OPTIONS))) {
    let __VLS_499;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_500 = __VLS_asFunctionalComponent1(__VLS_499, new __VLS_499({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_501 = __VLS_500({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_500));
    // @ts-ignore
    [statusVisible, resetStatusForm, statusForm, statusForm, EDITABLE_STATUS_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_496;
// @ts-ignore
[];
var __VLS_490;
let __VLS_504;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_505 = __VLS_asFunctionalComponent1(__VLS_504, new __VLS_504({
    label: "备注",
    prop: "remark",
}));
const __VLS_506 = __VLS_505({
    label: "备注",
    prop: "remark",
}, ...__VLS_functionalComponentArgsRest(__VLS_505));
const { default: __VLS_509 } = __VLS_507.slots;
let __VLS_510;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_511 = __VLS_asFunctionalComponent1(__VLS_510, new __VLS_510({
    modelValue: (__VLS_ctx.statusForm.remark),
    type: "textarea",
    rows: (3),
    placeholder: "备注（选填）",
}));
const __VLS_512 = __VLS_511({
    modelValue: (__VLS_ctx.statusForm.remark),
    type: "textarea",
    rows: (3),
    placeholder: "备注（选填）",
}, ...__VLS_functionalComponentArgsRest(__VLS_511));
// @ts-ignore
[statusForm,];
var __VLS_507;
// @ts-ignore
[];
var __VLS_482;
{
    const { footer: __VLS_515 } = __VLS_474.slots;
    let __VLS_516;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_517 = __VLS_asFunctionalComponent1(__VLS_516, new __VLS_516({
        ...{ 'onClick': {} },
    }));
    const __VLS_518 = __VLS_517({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_517));
    let __VLS_521;
    const __VLS_522 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.statusVisible = false;
            // @ts-ignore
            [statusVisible,];
        },
    };
    const { default: __VLS_523 } = __VLS_519.slots;
    // @ts-ignore
    [];
    var __VLS_519;
    var __VLS_520;
    let __VLS_524;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent1(__VLS_524, new __VLS_524({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.statusLoading),
    }));
    const __VLS_526 = __VLS_525({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.statusLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_525));
    let __VLS_529;
    const __VLS_530 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleStatusUpdate),
    };
    const { default: __VLS_531 } = __VLS_527.slots;
    // @ts-ignore
    [statusLoading, handleStatusUpdate,];
    var __VLS_527;
    var __VLS_528;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_474;
var __VLS_475;
// @ts-ignore
var __VLS_485 = __VLS_484;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
