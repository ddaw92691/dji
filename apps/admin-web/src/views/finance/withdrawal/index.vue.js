/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { financeApi } from '@/api/finance';
import { WITHDRAWAL_STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'FinanceWithdrawalView' });
const loading = ref(false);
const rejectLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detail = ref(null);
const rejectVisible = ref(false);
const rejectingId = ref(null);
const rejectForm = reactive({ rejectReason: '' });
const searchForm = reactive({
    keyword: '',
    role: '',
    type: '',
    status: '',
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
        if (searchForm.keyword)
            params.keyword = searchForm.keyword;
        if (searchForm.role)
            params.role = searchForm.role;
        if (searchForm.type)
            params.type = searchForm.type;
        if (searchForm.status)
            params.status = searchForm.status;
        if (searchForm.dateRange) {
            params.startDate = searchForm.dateRange[0];
            params.endDate = searchForm.dateRange[1];
        }
        const { data: res } = await financeApi.getWithdrawals(params);
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
    const { data: res } = await financeApi.getWithdrawalDetail(id);
    if (res.code !== 200)
        return;
    detail.value = res.data || null;
    detailVisible.value = true;
}
async function handleApprove(row) {
    try {
        await ElMessageBox.confirm(`确定要通过提现 #${row.id}（$${(row.amount ?? 0).toFixed(2)}）吗？`, '确认', { type: 'warning' });
    }
    catch {
        return;
    }
    const { data: res } = await financeApi.approveWithdrawal(row.id);
    if (res.code !== 200)
        return;
    ElMessage.success('提现已通过');
    fetchData();
}
function openRejectDialog(row) {
    rejectingId.value = row.id;
    rejectForm.rejectReason = '';
    rejectVisible.value = true;
}
async function handleReject() {
    if (!rejectingId.value || !rejectForm.rejectReason.trim())
        return;
    rejectLoading.value = true;
    try {
        const { data: res } = await financeApi.rejectWithdrawal(rejectingId.value, rejectForm.rejectReason);
        if (res.code !== 200)
            return;
        ElMessage.success('提现已拒绝');
        rejectVisible.value = false;
        fetchData();
    }
    finally {
        rejectLoading.value = false;
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
    ...{ class: "withdrawal-page" },
});
/** @type {__VLS_StyleScopedClasses['withdrawal-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.role),
    placeholder: "角色",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.role),
    placeholder: "角色",
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
    label: "商户",
    value: "MERCHANT",
}));
const __VLS_35 = __VLS_34({
    label: "商户",
    value: "MERCHANT",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: "代理",
    value: "AGENT",
}));
const __VLS_40 = __VLS_39({
    label: "代理",
    value: "AGENT",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_22;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.type),
    placeholder: "类型",
    clearable: true,
}));
const __VLS_51 = __VLS_50({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.type),
    placeholder: "类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_56 } = __VLS_52.slots;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    label: "银行转账",
    value: "BANK",
}));
const __VLS_59 = __VLS_58({
    label: "银行转账",
    value: "BANK",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: "手动",
    value: "MANUAL",
}));
const __VLS_64 = __VLS_63({
    label: "手动",
    value: "MANUAL",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_52;
var __VLS_53;
// @ts-ignore
[];
var __VLS_46;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({}));
const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
const { default: __VLS_72 } = __VLS_70.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}));
const __VLS_75 = __VLS_74({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
let __VLS_78;
const __VLS_79 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_80 } = __VLS_76.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS))) {
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }));
    const __VLS_83 = __VLS_82({
        key: (o.value),
        label: (o.label),
        value: (o.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    // @ts-ignore
    [searchForm, handleSearch, WITHDRAWAL_STATUS_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_76;
var __VLS_77;
// @ts-ignore
[];
var __VLS_70;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({}));
const __VLS_88 = __VLS_87({}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_94 = __VLS_93({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
let __VLS_97;
const __VLS_98 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
var __VLS_95;
var __VLS_96;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_89;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({}));
const __VLS_101 = __VLS_100({}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_107 = __VLS_106({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
let __VLS_110;
const __VLS_111 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_112 } = __VLS_108.slots;
// @ts-ignore
[handleSearch,];
var __VLS_108;
var __VLS_109;
// @ts-ignore
[];
var __VLS_102;
// @ts-ignore
[];
var __VLS_3;
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_115 = __VLS_114({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_118 } = __VLS_116.slots;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_121 = __VLS_120({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    prop: "userName",
    label: "用户",
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_126 = __VLS_125({
    prop: "userName",
    label: "用户",
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    label: "角色",
    width: "100",
    align: "center",
}));
const __VLS_131 = __VLS_130({
    label: "角色",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
{
    const { default: __VLS_135 } = __VLS_132.slots;
    const [{ row }] = __VLS_vSlot(__VLS_135);
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        type: (row.role === 'MERCHANT' ? 'primary' : 'success'),
        size: "small",
    }));
    const __VLS_138 = __VLS_137({
        type: (row.role === 'MERCHANT' ? 'primary' : 'success'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    const { default: __VLS_141 } = __VLS_139.slots;
    (row.role);
    // @ts-ignore
    [tableData, vLoading, loading,];
    var __VLS_139;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_132;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    prop: "type",
    label: "类型",
    width: "90",
    align: "center",
}));
const __VLS_144 = __VLS_143({
    prop: "type",
    label: "类型",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    prop: "amount",
    label: "金额",
    width: "120",
    align: "right",
}));
const __VLS_149 = __VLS_148({
    prop: "amount",
    label: "金额",
    width: "120",
    align: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
const { default: __VLS_152 } = __VLS_150.slots;
{
    const { default: __VLS_153 } = __VLS_150.slots;
    const [{ row }] = __VLS_vSlot(__VLS_153);
    ((row.amount ?? 0).toFixed(2));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_150;
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
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, row.status)),
    }));
    const __VLS_163 = __VLS_162({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_162));
    const { default: __VLS_166 } = __VLS_164.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, row.status));
    // @ts-ignore
    [WITHDRAWAL_STATUS_OPTIONS, WITHDRAWAL_STATUS_OPTIONS, getColorByValue, getLabelByValue,];
    var __VLS_164;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_157;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    prop: "bankName",
    label: "银行",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_169 = __VLS_168({
    prop: "bankName",
    label: "银行",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    prop: "bankAccount",
    label: "账户",
    width: "160",
    showOverflowTooltip: true,
}));
const __VLS_174 = __VLS_173({
    prop: "bankAccount",
    label: "账户",
    width: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_179 = __VLS_178({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
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
            __VLS_ctx.openDetail(row.id);
            // @ts-ignore
            [openDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('finance:withdrawal:view') }, null, null);
    const { default: __VLS_196 } = __VLS_192.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_192;
    var __VLS_193;
    if (row.status === 'PENDING') {
        let __VLS_197;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }));
        const __VLS_199 = __VLS_198({
            ...{ 'onClick': {} },
            link: true,
            type: "success",
        }, ...__VLS_functionalComponentArgsRest(__VLS_198));
        let __VLS_202;
        const __VLS_203 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.handleApprove(row);
                // @ts-ignore
                [handleApprove,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('finance:withdrawal:approve') }, null, null);
        const { default: __VLS_204 } = __VLS_200.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_200;
        var __VLS_201;
    }
    if (row.status === 'PENDING') {
        let __VLS_205;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_207 = __VLS_206({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        let __VLS_210;
        const __VLS_211 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'PENDING'))
                    return;
                __VLS_ctx.openRejectDialog(row);
                // @ts-ignore
                [openRejectDialog,];
            },
        };
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('finance:withdrawal:reject') }, null, null);
        const { default: __VLS_212 } = __VLS_208.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_208;
        var __VLS_209;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_185;
// @ts-ignore
[];
var __VLS_116;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_215 = __VLS_214({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
let __VLS_218;
const __VLS_219 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_216;
var __VLS_217;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.detailVisible),
    title: "提现详情",
    width: "600px",
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.detailVisible),
    title: "提现详情",
    width: "600px",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
if (__VLS_ctx.detail) {
    let __VLS_226;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_228 = __VLS_227({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_227));
    const { default: __VLS_231 } = __VLS_229.slots;
    let __VLS_232;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
        label: "ID",
    }));
    const __VLS_234 = __VLS_233({
        label: "ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    const { default: __VLS_237 } = __VLS_235.slots;
    (__VLS_ctx.detail.id);
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detail, detail,];
    var __VLS_235;
    let __VLS_238;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
        label: "用户",
    }));
    const __VLS_240 = __VLS_239({
        label: "用户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    const { default: __VLS_243 } = __VLS_241.slots;
    (__VLS_ctx.detail.userName);
    // @ts-ignore
    [detail,];
    var __VLS_241;
    let __VLS_244;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
        label: "角色",
    }));
    const __VLS_246 = __VLS_245({
        label: "角色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    const { default: __VLS_249 } = __VLS_247.slots;
    (__VLS_ctx.detail.role);
    // @ts-ignore
    [detail,];
    var __VLS_247;
    let __VLS_250;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
        label: "类型",
    }));
    const __VLS_252 = __VLS_251({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
    const { default: __VLS_255 } = __VLS_253.slots;
    (__VLS_ctx.detail.type);
    // @ts-ignore
    [detail,];
    var __VLS_253;
    let __VLS_256;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
        label: "金额",
    }));
    const __VLS_258 = __VLS_257({
        label: "金额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_257));
    const { default: __VLS_261 } = __VLS_259.slots;
    ((__VLS_ctx.detail.amount ?? 0).toFixed(2));
    // @ts-ignore
    [detail,];
    var __VLS_259;
    let __VLS_262;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
        label: "状态",
    }));
    const __VLS_264 = __VLS_263({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const { default: __VLS_267 } = __VLS_265.slots;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, __VLS_ctx.detail.status)),
    }));
    const __VLS_270 = __VLS_269({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, __VLS_ctx.detail.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    const { default: __VLS_273 } = __VLS_271.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.WITHDRAWAL_STATUS_OPTIONS, __VLS_ctx.detail.status));
    // @ts-ignore
    [WITHDRAWAL_STATUS_OPTIONS, WITHDRAWAL_STATUS_OPTIONS, getColorByValue, getLabelByValue, detail, detail,];
    var __VLS_271;
    // @ts-ignore
    [];
    var __VLS_265;
    let __VLS_274;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
        label: "银行名称",
    }));
    const __VLS_276 = __VLS_275({
        label: "银行名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_275));
    const { default: __VLS_279 } = __VLS_277.slots;
    (__VLS_ctx.detail.bankName || '-');
    // @ts-ignore
    [detail,];
    var __VLS_277;
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        label: "银行账号",
    }));
    const __VLS_282 = __VLS_281({
        label: "银行账号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const { default: __VLS_285 } = __VLS_283.slots;
    (__VLS_ctx.detail.bankAccount || '-');
    // @ts-ignore
    [detail,];
    var __VLS_283;
    let __VLS_286;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
        label: "账户名",
    }));
    const __VLS_288 = __VLS_287({
        label: "账户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    const { default: __VLS_291 } = __VLS_289.slots;
    (__VLS_ctx.detail.accountName || '-');
    // @ts-ignore
    [detail,];
    var __VLS_289;
    let __VLS_292;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
        label: "备注",
    }));
    const __VLS_294 = __VLS_293({
        label: "备注",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    const { default: __VLS_297 } = __VLS_295.slots;
    (__VLS_ctx.detail.remark || '-');
    // @ts-ignore
    [detail,];
    var __VLS_295;
    let __VLS_298;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
        label: "拒绝原因",
        span: (2),
    }));
    const __VLS_300 = __VLS_299({
        label: "拒绝原因",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    const { default: __VLS_303 } = __VLS_301.slots;
    (__VLS_ctx.detail.rejectReason || '-');
    // @ts-ignore
    [detail,];
    var __VLS_301;
    let __VLS_304;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
        label: "创建时间",
    }));
    const __VLS_306 = __VLS_305({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    const { default: __VLS_309 } = __VLS_307.slots;
    (__VLS_ctx.detail.createdAt);
    // @ts-ignore
    [detail,];
    var __VLS_307;
    let __VLS_310;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({
        label: "审核时间",
    }));
    const __VLS_312 = __VLS_311({
        label: "审核时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_311));
    const { default: __VLS_315 } = __VLS_313.slots;
    (__VLS_ctx.detail.reviewedAt || '-');
    // @ts-ignore
    [detail,];
    var __VLS_313;
    // @ts-ignore
    [];
    var __VLS_229;
}
{
    const { footer: __VLS_316 } = __VLS_223.slots;
    let __VLS_317;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
        ...{ 'onClick': {} },
    }));
    const __VLS_319 = __VLS_318({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_318));
    let __VLS_322;
    const __VLS_323 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_324 } = __VLS_320.slots;
    // @ts-ignore
    [];
    var __VLS_320;
    var __VLS_321;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_223;
let __VLS_325;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_326 = __VLS_asFunctionalComponent1(__VLS_325, new __VLS_325({
    modelValue: (__VLS_ctx.rejectVisible),
    title: "拒绝提现",
    width: "480px",
}));
const __VLS_327 = __VLS_326({
    modelValue: (__VLS_ctx.rejectVisible),
    title: "拒绝提现",
    width: "480px",
}, ...__VLS_functionalComponentArgsRest(__VLS_326));
const { default: __VLS_330 } = __VLS_328.slots;
let __VLS_331;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
    model: (__VLS_ctx.rejectForm),
}));
const __VLS_333 = __VLS_332({
    model: (__VLS_ctx.rejectForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_332));
const { default: __VLS_336 } = __VLS_334.slots;
let __VLS_337;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_338 = __VLS_asFunctionalComponent1(__VLS_337, new __VLS_337({
    label: "拒绝原因",
    required: true,
}));
const __VLS_339 = __VLS_338({
    label: "拒绝原因",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_338));
const { default: __VLS_342 } = __VLS_340.slots;
let __VLS_343;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
    modelValue: (__VLS_ctx.rejectForm.rejectReason),
    type: "textarea",
    rows: (4),
    placeholder: "请输入拒绝原因",
}));
const __VLS_345 = __VLS_344({
    modelValue: (__VLS_ctx.rejectForm.rejectReason),
    type: "textarea",
    rows: (4),
    placeholder: "请输入拒绝原因",
}, ...__VLS_functionalComponentArgsRest(__VLS_344));
// @ts-ignore
[rejectVisible, rejectForm, rejectForm,];
var __VLS_340;
// @ts-ignore
[];
var __VLS_334;
{
    const { footer: __VLS_348 } = __VLS_328.slots;
    let __VLS_349;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
        ...{ 'onClick': {} },
    }));
    const __VLS_351 = __VLS_350({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_350));
    let __VLS_354;
    const __VLS_355 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.rejectVisible = false;
            // @ts-ignore
            [rejectVisible,];
        },
    };
    const { default: __VLS_356 } = __VLS_352.slots;
    // @ts-ignore
    [];
    var __VLS_352;
    var __VLS_353;
    let __VLS_357;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_358 = __VLS_asFunctionalComponent1(__VLS_357, new __VLS_357({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.rejectLoading),
    }));
    const __VLS_359 = __VLS_358({
        ...{ 'onClick': {} },
        type: "danger",
        loading: (__VLS_ctx.rejectLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_358));
    let __VLS_362;
    const __VLS_363 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleReject),
    };
    const { default: __VLS_364 } = __VLS_360.slots;
    // @ts-ignore
    [rejectLoading, handleReject,];
    var __VLS_360;
    var __VLS_361;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_328;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
