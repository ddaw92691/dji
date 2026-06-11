/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { financeApi } from '@/api/finance';
defineOptions({ name: 'ReconciliationView' });
const TYPE_LABELS = {
    ADJUST_INCREASE: '后台增加',
    ADJUST_DECREASE: '后台扣减',
    RECHARGE: '充值入账',
    ORDER_PAY: '支付货款',
    SETTLE: '货款结算',
    WITHDRAW: '提现',
};
const INCREASE_TYPES = ['ADJUST_INCREASE', 'RECHARGE', 'SETTLE'];
const typeText = (t) => TYPE_LABELS[t] || t || '-';
const isIncrease = (t) => INCREASE_TYPES.includes(t);
const typeTag = (t) => (isIncrease(t) ? 'success' : 'warning');
const query = reactive({
    merchantId: '',
    type: '',
    dateRange: null,
});
const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const fetchData = async () => {
    loading.value = true;
    try {
        const params = { page: page.value, pageSize: pageSize.value };
        if (query.merchantId)
            params.merchantId = query.merchantId;
        if (query.type)
            params.type = query.type;
        if (query.dateRange) {
            params.startDate = query.dateRange[0];
            params.endDate = query.dateRange[1];
        }
        const { data: res } = await financeApi.getFundLogs(params);
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    finally {
        loading.value = false;
    }
};
const handleSearch = () => {
    page.value = 1;
    fetchData();
};
const resetQuery = () => {
    query.merchantId = '';
    query.type = '';
    query.dateRange = null;
    page.value = 1;
    fetchData();
};
onMounted(fetchData);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "reconciliation-page" },
});
/** @type {__VLS_StyleScopedClasses['reconciliation-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-toolbar" },
});
/** @type {__VLS_StyleScopedClasses['page-toolbar']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    inline: (true),
    model: (__VLS_ctx.query),
    ...{ class: "query-form" },
}));
const __VLS_2 = __VLS_1({
    inline: (true),
    model: (__VLS_ctx.query),
    ...{ class: "query-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['query-form']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    label: "商家ID",
}));
const __VLS_8 = __VLS_7({
    label: "商家ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.query.merchantId),
    placeholder: "商家ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.query.merchantId),
    placeholder: "商家ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
// @ts-ignore
[query, query,];
var __VLS_9;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: "类型",
}));
const __VLS_19 = __VLS_18({
    label: "类型",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.query.type),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.query.type),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
for (const [label, val] of __VLS_vFor((__VLS_ctx.TYPE_LABELS))) {
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        key: (val),
        label: (label),
        value: (val),
    }));
    const __VLS_31 = __VLS_30({
        key: (val),
        label: (label),
        value: (val),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    // @ts-ignore
    [query, TYPE_LABELS,];
}
// @ts-ignore
[];
var __VLS_26;
// @ts-ignore
[];
var __VLS_20;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    label: "日期",
}));
const __VLS_36 = __VLS_35({
    label: "日期",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    modelValue: (__VLS_ctx.query.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_42 = __VLS_41({
    modelValue: (__VLS_ctx.query.dateRange),
    type: "daterange",
    rangeSeparator: "至",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
// @ts-ignore
[query,];
var __VLS_37;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_58 } = __VLS_54.slots;
// @ts-ignore
[handleSearch,];
var __VLS_54;
var __VLS_55;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
const __VLS_65 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetQuery),
};
const { default: __VLS_66 } = __VLS_62.slots;
// @ts-ignore
[resetQuery,];
var __VLS_62;
var __VLS_63;
// @ts-ignore
[];
var __VLS_48;
// @ts-ignore
[];
var __VLS_3;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    data: (__VLS_ctx.tableData),
    border: true,
}));
const __VLS_69 = __VLS_68({
    data: (__VLS_ctx.tableData),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_72 } = __VLS_70.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    prop: "createdAt",
    label: "时间",
    minWidth: "170",
}));
const __VLS_75 = __VLS_74({
    prop: "createdAt",
    label: "时间",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    prop: "merchantId",
    label: "商家ID",
    width: "100",
}));
const __VLS_80 = __VLS_79({
    prop: "merchantId",
    label: "商家ID",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
}));
const __VLS_85 = __VLS_84({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    label: "类型",
    width: "120",
}));
const __VLS_90 = __VLS_89({
    label: "类型",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
const { default: __VLS_93 } = __VLS_91.slots;
{
    const { default: __VLS_94 } = __VLS_91.slots;
    const [{ row }] = __VLS_vSlot(__VLS_94);
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        type: (__VLS_ctx.typeTag(row.type)),
    }));
    const __VLS_97 = __VLS_96({
        type: (__VLS_ctx.typeTag(row.type)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    const { default: __VLS_100 } = __VLS_98.slots;
    (__VLS_ctx.typeText(row.type));
    // @ts-ignore
    [tableData, vLoading, loading, typeTag, typeText,];
    var __VLS_98;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_91;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    label: "金额",
    width: "130",
}));
const __VLS_103 = __VLS_102({
    label: "金额",
    width: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const { default: __VLS_106 } = __VLS_104.slots;
{
    const { default: __VLS_107 } = __VLS_104.slots;
    const [{ row }] = __VLS_vSlot(__VLS_107);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: ({ color: __VLS_ctx.isIncrease(row.type) ? 'var(--el-color-success)' : 'var(--el-color-danger)' }) },
    });
    (__VLS_ctx.isIncrease(row.type) ? '+' : '-');
    (row.amount);
    // @ts-ignore
    [isIncrease, isIncrease,];
}
// @ts-ignore
[];
var __VLS_104;
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "balanceBefore",
    label: "变动前",
    width: "110",
}));
const __VLS_110 = __VLS_109({
    prop: "balanceBefore",
    label: "变动前",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    prop: "balanceAfter",
    label: "变动后",
    width: "110",
}));
const __VLS_115 = __VLS_114({
    prop: "balanceAfter",
    label: "变动后",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: "关联",
    minWidth: "140",
}));
const __VLS_120 = __VLS_119({
    label: "关联",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
    if (row.refType) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.refType);
        if (row.refId) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (row.refId);
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
var __VLS_121;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    prop: "remark",
    label: "备注",
    minWidth: "160",
}));
const __VLS_127 = __VLS_126({
    prop: "remark",
    label: "备注",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
// @ts-ignore
[];
var __VLS_70;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pagination-wrap" },
});
/** @type {__VLS_StyleScopedClasses['pagination-wrap']} */ ;
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_132 = __VLS_131({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
let __VLS_135;
const __VLS_136 = {
    ...{ sizeChange: {} },
    onSizeChange: (__VLS_ctx.fetchData),
    ...{ currentChange: {} },
    onCurrentChange: (__VLS_ctx.fetchData),
};
var __VLS_133;
var __VLS_134;
// @ts-ignore
[page, pageSize, total, fetchData, fetchData,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
