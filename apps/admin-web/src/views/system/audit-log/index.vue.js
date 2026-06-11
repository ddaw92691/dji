/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { auditLogApi } from '@/api/auditLog';
import { AUDIT_ACTION_OPTIONS, AUDIT_TARGET_TYPE_OPTIONS, getLabelByValue } from '@/constants/dict';
defineOptions({ name: 'AdminAuditLogView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const currentLog = ref(null);
const searchForm = reactive({
    userId: '',
    action: '',
    targetType: '',
    keyword: '',
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
        if (searchForm.userId)
            params.userId = searchForm.userId;
        if (searchForm.action)
            params.action = searchForm.action;
        if (searchForm.targetType)
            params.targetType = searchForm.targetType;
        if (searchForm.keyword)
            params.keyword = searchForm.keyword;
        if (searchForm.dateRange) {
            params.startDate = searchForm.dateRange[0];
            params.endDate = searchForm.dateRange[1];
        }
        const { data: res } = await auditLogApi.getLogs(params);
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
function openDetail(row) {
    currentLog.value = row;
    detailVisible.value = true;
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
    ...{ class: "audit-log-page" },
});
/** @type {__VLS_StyleScopedClasses['audit-log-page']} */ ;
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
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.userId),
    placeholder: "用户ID",
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
    modelValue: (__VLS_ctx.searchForm.action),
    placeholder: "操作",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.action),
    placeholder: "操作",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_32 } = __VLS_28.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.AUDIT_ACTION_OPTIONS))) {
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
    [searchForm, handleSearch, AUDIT_ACTION_OPTIONS,];
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
    modelValue: (__VLS_ctx.searchForm.targetType),
    placeholder: "目标类型",
    clearable: true,
}));
const __VLS_46 = __VLS_45({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.targetType),
    placeholder: "目标类型",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_51 } = __VLS_47.slots;
for (const [o] of __VLS_vFor((__VLS_ctx.AUDIT_TARGET_TYPE_OPTIONS))) {
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
    [searchForm, handleSearch, AUDIT_TARGET_TYPE_OPTIONS,];
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
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleSearch),
};
var __VLS_66;
var __VLS_67;
// @ts-ignore
[searchForm, handleSearch, handleSearch,];
var __VLS_60;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({}));
const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
const { default: __VLS_75 } = __VLS_73.slots;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}));
const __VLS_78 = __VLS_77({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_81;
const __VLS_82 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
var __VLS_79;
var __VLS_80;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_73;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({}));
const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_91 = __VLS_90({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
const __VLS_95 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_96 } = __VLS_92.slots;
// @ts-ignore
[handleSearch,];
var __VLS_92;
var __VLS_93;
// @ts-ignore
[];
var __VLS_86;
// @ts-ignore
[];
var __VLS_3;
let __VLS_97;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_99 = __VLS_98({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_102 } = __VLS_100.slots;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_105 = __VLS_104({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "id",
    label: "ID",
    width: "70",
}));
const __VLS_110 = __VLS_109({
    prop: "id",
    label: "ID",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    prop: "userEmail",
    label: "用户",
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_115 = __VLS_114({
    prop: "userEmail",
    label: "用户",
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: "操作",
    width: "100",
    align: "center",
}));
const __VLS_120 = __VLS_119({
    label: "操作",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
{
    const { default: __VLS_124 } = __VLS_121.slots;
    const [{ row }] = __VLS_vSlot(__VLS_124);
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({}));
    const __VLS_127 = __VLS_126({}, ...__VLS_functionalComponentArgsRest(__VLS_126));
    const { default: __VLS_130 } = __VLS_128.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.AUDIT_ACTION_OPTIONS, row.action));
    // @ts-ignore
    [AUDIT_ACTION_OPTIONS, tableData, vLoading, loading, getLabelByValue,];
    var __VLS_128;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_121;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    label: "目标类型",
    width: "120",
    align: "center",
}));
const __VLS_133 = __VLS_132({
    label: "目标类型",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
{
    const { default: __VLS_137 } = __VLS_134.slots;
    const [{ row }] = __VLS_vSlot(__VLS_137);
    let __VLS_138;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        type: "info",
    }));
    const __VLS_140 = __VLS_139({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    const { default: __VLS_143 } = __VLS_141.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.AUDIT_TARGET_TYPE_OPTIONS, row.targetType));
    // @ts-ignore
    [AUDIT_TARGET_TYPE_OPTIONS, getLabelByValue,];
    var __VLS_141;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_134;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    prop: "targetId",
    label: "目标ID",
    width: "100",
}));
const __VLS_146 = __VLS_145({
    prop: "targetId",
    label: "目标ID",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    prop: "detail",
    label: "详情",
    minWidth: "200",
    showOverflowTooltip: true,
}));
const __VLS_151 = __VLS_150({
    prop: "detail",
    label: "详情",
    minWidth: "200",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
const { default: __VLS_154 } = __VLS_152.slots;
{
    const { default: __VLS_155 } = __VLS_152.slots;
    const [{ row }] = __VLS_vSlot(__VLS_155);
    (row.detail ? row.detail.substring(0, 100) : '-');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_152;
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    prop: "ip",
    label: "IP",
    width: "140",
    showOverflowTooltip: true,
}));
const __VLS_158 = __VLS_157({
    prop: "ip",
    label: "IP",
    width: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_163 = __VLS_162({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
let __VLS_166;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    label: "操作",
    width: "80",
    fixed: "right",
}));
const __VLS_168 = __VLS_167({
    label: "操作",
    width: "80",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
const { default: __VLS_171 } = __VLS_169.slots;
{
    const { default: __VLS_172 } = __VLS_169.slots;
    const [{ row }] = __VLS_vSlot(__VLS_172);
    let __VLS_173;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_175 = __VLS_174({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    let __VLS_178;
    const __VLS_179 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('sys:audit:view') }, null, null);
    const { default: __VLS_180 } = __VLS_176.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_176;
    var __VLS_177;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_169;
// @ts-ignore
[];
var __VLS_100;
let __VLS_181;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_183 = __VLS_182({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
let __VLS_186;
const __VLS_187 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_184;
var __VLS_185;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.detailVisible),
    title: "审计日志详情",
    width: "700px",
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.detailVisible),
    title: "审计日志详情",
    width: "700px",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
const { default: __VLS_193 } = __VLS_191.slots;
if (__VLS_ctx.currentLog) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "log-detail" },
    });
    /** @type {__VLS_StyleScopedClasses['log-detail']} */ ;
    let __VLS_194;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_196 = __VLS_195({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    const { default: __VLS_199 } = __VLS_197.slots;
    let __VLS_200;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        label: "ID",
    }));
    const __VLS_202 = __VLS_201({
        label: "ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    const { default: __VLS_205 } = __VLS_203.slots;
    (__VLS_ctx.currentLog.id);
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, currentLog, currentLog,];
    var __VLS_203;
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
        label: "用户ID",
    }));
    const __VLS_208 = __VLS_207({
        label: "用户ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    const { default: __VLS_211 } = __VLS_209.slots;
    (__VLS_ctx.currentLog.userId);
    // @ts-ignore
    [currentLog,];
    var __VLS_209;
    let __VLS_212;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
        label: "用户邮箱",
    }));
    const __VLS_214 = __VLS_213({
        label: "用户邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    const { default: __VLS_217 } = __VLS_215.slots;
    (__VLS_ctx.currentLog.userEmail);
    // @ts-ignore
    [currentLog,];
    var __VLS_215;
    let __VLS_218;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
        label: "操作",
    }));
    const __VLS_220 = __VLS_219({
        label: "操作",
    }, ...__VLS_functionalComponentArgsRest(__VLS_219));
    const { default: __VLS_223 } = __VLS_221.slots;
    let __VLS_224;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({}));
    const __VLS_226 = __VLS_225({}, ...__VLS_functionalComponentArgsRest(__VLS_225));
    const { default: __VLS_229 } = __VLS_227.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.AUDIT_ACTION_OPTIONS, __VLS_ctx.currentLog.action));
    // @ts-ignore
    [AUDIT_ACTION_OPTIONS, getLabelByValue, currentLog,];
    var __VLS_227;
    // @ts-ignore
    [];
    var __VLS_221;
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        label: "目标类型",
    }));
    const __VLS_232 = __VLS_231({
        label: "目标类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    const { default: __VLS_235 } = __VLS_233.slots;
    let __VLS_236;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
        type: "info",
    }));
    const __VLS_238 = __VLS_237({
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    const { default: __VLS_241 } = __VLS_239.slots;
    (__VLS_ctx.getLabelByValue(__VLS_ctx.AUDIT_TARGET_TYPE_OPTIONS, __VLS_ctx.currentLog.targetType));
    // @ts-ignore
    [AUDIT_TARGET_TYPE_OPTIONS, getLabelByValue, currentLog,];
    var __VLS_239;
    // @ts-ignore
    [];
    var __VLS_233;
    let __VLS_242;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
        label: "目标ID",
    }));
    const __VLS_244 = __VLS_243({
        label: "目标ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_243));
    const { default: __VLS_247 } = __VLS_245.slots;
    (__VLS_ctx.currentLog.targetId);
    // @ts-ignore
    [currentLog,];
    var __VLS_245;
    let __VLS_248;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
        label: "IP",
    }));
    const __VLS_250 = __VLS_249({
        label: "IP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    const { default: __VLS_253 } = __VLS_251.slots;
    (__VLS_ctx.currentLog.ip);
    // @ts-ignore
    [currentLog,];
    var __VLS_251;
    let __VLS_254;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
        label: "创建时间",
    }));
    const __VLS_256 = __VLS_255({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_255));
    const { default: __VLS_259 } = __VLS_257.slots;
    (__VLS_ctx.currentLog.createdAt);
    // @ts-ignore
    [currentLog,];
    var __VLS_257;
    let __VLS_260;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
        label: "详情",
        span: (2),
    }));
    const __VLS_262 = __VLS_261({
        label: "详情",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    const { default: __VLS_265 } = __VLS_263.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({
        ...{ class: "detail-text" },
    });
    /** @type {__VLS_StyleScopedClasses['detail-text']} */ ;
    (__VLS_ctx.currentLog.detail || '-');
    // @ts-ignore
    [currentLog,];
    var __VLS_263;
    // @ts-ignore
    [];
    var __VLS_197;
}
{
    const { footer: __VLS_266 } = __VLS_191.slots;
    let __VLS_267;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_268 = __VLS_asFunctionalComponent1(__VLS_267, new __VLS_267({
        ...{ 'onClick': {} },
    }));
    const __VLS_269 = __VLS_268({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_268));
    let __VLS_272;
    const __VLS_273 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_274 } = __VLS_270.slots;
    // @ts-ignore
    [];
    var __VLS_270;
    var __VLS_271;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_191;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
