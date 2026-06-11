/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage, ElMessageBox } from 'element-plus';
import { rechargeApi } from '@/api/recharge';
defineOptions({ name: 'RechargeView' });
const query = reactive({ status: '' });
const tableData = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const viewerUrl = ref('');
const statusText = (status) => {
    const map = { PENDING: '待审核', PAID: '已入账', REJECTED: '已拒绝' };
    return map[status] || status || '-';
};
const statusType = (status) => {
    const map = { PENDING: 'warning', PAID: 'success', REJECTED: 'danger' };
    return map[status] || 'info';
};
const previewProof = (url) => {
    viewerUrl.value = url;
};
const fetchData = async () => {
    loading.value = true;
    try {
        const { data: res } = await rechargeApi.getRecharges({
            ...query,
            page: page.value,
            pageSize: pageSize.value,
        });
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    finally {
        loading.value = false;
    }
};
const resetQuery = () => {
    query.status = '';
    page.value = 1;
    fetchData();
};
const handleApprove = async (row) => {
    try {
        await ElMessageBox.confirm(`确认通过充值单 ${row.rechargeNo}？金额 ${row.amount} 将入账到该商家余额。`, '通过充值', { confirmButtonText: '确认通过', cancelButtonText: '取消', type: 'warning' });
        const { data: res } = await rechargeApi.approveRecharge(row.id);
        if (res.code === 200) {
            ElMessage.success('充值已入账');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        /* canceled */
    }
};
const handleReject = async (row) => {
    try {
        const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝充值', {
            confirmButtonText: '确认拒绝',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPlaceholder: '拒绝原因',
        });
        const { data: res } = await rechargeApi.rejectRecharge(row.id, value);
        if (res.code === 200) {
            ElMessage.success('已拒绝');
            fetchData();
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        /* canceled */
    }
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
    ...{ class: "recharge-page" },
});
/** @type {__VLS_StyleScopedClasses['recharge-page']} */ ;
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
    label: "状态",
}));
const __VLS_8 = __VLS_7({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.query.status),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.query.status),
    placeholder: "全部",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    label: "待审核",
    value: "PENDING",
}));
const __VLS_20 = __VLS_19({
    label: "待审核",
    value: "PENDING",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: "已入账",
    value: "PAID",
}));
const __VLS_25 = __VLS_24({
    label: "已入账",
    value: "PAID",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: "已拒绝",
    value: "REJECTED",
}));
const __VLS_30 = __VLS_29({
    label: "已拒绝",
    value: "REJECTED",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
// @ts-ignore
[query, query,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_9;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_41 = __VLS_40({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_44;
const __VLS_45 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.fetchData),
};
const { default: __VLS_46 } = __VLS_42.slots;
// @ts-ignore
[fetchData,];
var __VLS_42;
var __VLS_43;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.resetQuery),
};
const { default: __VLS_54 } = __VLS_50.slots;
// @ts-ignore
[resetQuery,];
var __VLS_50;
var __VLS_51;
// @ts-ignore
[];
var __VLS_36;
// @ts-ignore
[];
var __VLS_3;
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    data: (__VLS_ctx.tableData),
    border: true,
}));
const __VLS_57 = __VLS_56({
    data: (__VLS_ctx.tableData),
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_60 } = __VLS_58.slots;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    prop: "rechargeNo",
    label: "充值单号",
    minWidth: "180",
}));
const __VLS_63 = __VLS_62({
    prop: "rechargeNo",
    label: "充值单号",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
}));
const __VLS_68 = __VLS_67({
    prop: "shopName",
    label: "店铺",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    prop: "amount",
    label: "金额",
    width: "120",
}));
const __VLS_73 = __VLS_72({
    prop: "amount",
    label: "金额",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    prop: "currency",
    label: "币种",
    width: "80",
}));
const __VLS_78 = __VLS_77({
    prop: "currency",
    label: "币种",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    prop: "method",
    label: "方式",
    width: "110",
}));
const __VLS_83 = __VLS_82({
    prop: "method",
    label: "方式",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    label: "凭证",
    width: "90",
}));
const __VLS_88 = __VLS_87({
    label: "凭证",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
{
    const { default: __VLS_92 } = __VLS_89.slots;
    const [{ row }] = __VLS_vSlot(__VLS_92);
    if (row.proofUrl) {
        let __VLS_93;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_95 = __VLS_94({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        let __VLS_98;
        const __VLS_99 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.proofUrl))
                    return;
                __VLS_ctx.previewProof(row.proofUrl);
                // @ts-ignore
                [tableData, vLoading, loading, previewProof,];
            },
        };
        const { default: __VLS_100 } = __VLS_96.slots;
        // @ts-ignore
        [];
        var __VLS_96;
        var __VLS_97;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_89;
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    prop: "status",
    label: "状态",
    width: "110",
}));
const __VLS_103 = __VLS_102({
    prop: "status",
    label: "状态",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
const { default: __VLS_106 } = __VLS_104.slots;
{
    const { default: __VLS_107 } = __VLS_104.slots;
    const [{ row }] = __VLS_vSlot(__VLS_107);
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        type: (__VLS_ctx.statusType(row.status)),
    }));
    const __VLS_110 = __VLS_109({
        type: (__VLS_ctx.statusType(row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    const { default: __VLS_113 } = __VLS_111.slots;
    (__VLS_ctx.statusText(row.status));
    // @ts-ignore
    [statusType, statusText,];
    var __VLS_111;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_104;
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    prop: "remark",
    label: "备注",
    minWidth: "140",
}));
const __VLS_116 = __VLS_115({
    prop: "remark",
    label: "备注",
    minWidth: "140",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    prop: "createdAt",
    label: "提交时间",
    minWidth: "170",
}));
const __VLS_121 = __VLS_120({
    prop: "createdAt",
    label: "提交时间",
    minWidth: "170",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    label: "操作",
    width: "180",
    fixed: "right",
}));
const __VLS_126 = __VLS_125({
    label: "操作",
    width: "180",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
const { default: __VLS_129 } = __VLS_127.slots;
{
    const { default: __VLS_130 } = __VLS_127.slots;
    const [{ row }] = __VLS_vSlot(__VLS_130);
    if (row.status === 'PENDING') {
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_133 = __VLS_132({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        let __VLS_136;
        const __VLS_137 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.handleApprove(row);
                // @ts-ignore
                [handleApprove,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('finance:recharge:approve') }, null, null);
        const { default: __VLS_138 } = __VLS_134.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_134;
        var __VLS_135;
        let __VLS_139;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_141 = __VLS_140({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        let __VLS_144;
        const __VLS_145 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.handleReject(row);
                // @ts-ignore
                [handleReject,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('finance:recharge:reject') }, null, null);
        const { default: __VLS_146 } = __VLS_142.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_142;
        var __VLS_143;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_127;
// @ts-ignore
[];
var __VLS_58;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "pagination-wrap" },
});
/** @type {__VLS_StyleScopedClasses['pagination-wrap']} */ ;
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}));
const __VLS_149 = __VLS_148({
    ...{ 'onSizeChange': {} },
    ...{ 'onCurrentChange': {} },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next, jumper",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
let __VLS_152;
const __VLS_153 = {
    ...{ sizeChange: {} },
    onSizeChange: (__VLS_ctx.fetchData),
    ...{ currentChange: {} },
    onCurrentChange: (__VLS_ctx.fetchData),
};
var __VLS_150;
var __VLS_151;
if (__VLS_ctx.viewerUrl) {
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elImageViewer | typeof __VLS_components.ElImageViewer | typeof __VLS_components['el-image-viewer']} */
    elImageViewer;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        ...{ 'onClose': {} },
        urlList: ([__VLS_ctx.viewerUrl]),
    }));
    const __VLS_156 = __VLS_155({
        ...{ 'onClose': {} },
        urlList: ([__VLS_ctx.viewerUrl]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_159;
    const __VLS_160 = {
        ...{ close: {} },
        onClose: (...[$event]) => {
            if (!(__VLS_ctx.viewerUrl))
                return;
            __VLS_ctx.viewerUrl = '';
            // @ts-ignore
            [fetchData, fetchData, page, pageSize, total, viewerUrl, viewerUrl, viewerUrl,];
        },
    };
    var __VLS_157;
    var __VLS_158;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
