/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { customerMerchantApi } from '@/api/support';
defineOptions({ name: 'AdminCustomerMerchantSupportView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const detailVisible = ref(false);
const detailSession = ref(null);
const detailMessages = ref([]);
const detailMsgRef = ref();
const searchForm = reactive({
    keyword: '',
    merchantId: '',
    customerUserId: '',
    status: '',
    sessionType: '',
    dateRange: null,
    page: 1,
    pageSize: 20,
});
async function fetchData() {
    loading.value = true;
    try {
        const [startDate, endDate] = searchForm.dateRange || [];
        const { data: res } = await customerMerchantApi.getSessions({
            keyword: searchForm.keyword || undefined,
            merchantId: searchForm.merchantId || undefined,
            customerUserId: searchForm.customerUserId || undefined,
            status: searchForm.status || undefined,
            sessionType: searchForm.sessionType || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list || [];
            total.value = res.data.total || 0;
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        ElMessage.error('获取失败');
    }
    finally {
        loading.value = false;
    }
}
function handleSearch() {
    searchForm.page = 1;
    fetchData();
}
async function openDetail(row) {
    detailSession.value = row;
    detailVisible.value = true;
    await customerMerchantApi.markRead(row.id);
    try {
        const { data: res } = await customerMerchantApi.getMessages(row.id);
        if (res.code === 200) {
            detailMessages.value = res.data || [];
            await nextTick();
            if (detailMsgRef.value)
                detailMsgRef.value.scrollTop = detailMsgRef.value.scrollHeight;
        }
    }
    catch { /* ignore */ }
}
async function handleClose(row) {
    try {
        const { data: res } = await customerMerchantApi.closeSession(row.id);
        if (res.code === 200) {
            ElMessage.success('会话已关闭');
            fetchData();
        }
    }
    catch {
        ElMessage.error('关闭失败');
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
/** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "cm-support-page" },
});
/** @type {__VLS_StyleScopedClasses['cm-support-page']} */ ;
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
    ...{ style: {} },
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "关键词",
    clearable: true,
    ...{ style: {} },
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
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.merchantId),
    placeholder: "商户ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_28;
var __VLS_29;
// @ts-ignore
[searchForm, handleSearch,];
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
    modelValue: (__VLS_ctx.searchForm.customerUserId),
    placeholder: "客户ID",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClear': {} },
    modelValue: (__VLS_ctx.searchForm.customerUserId),
    placeholder: "客户ID",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ clear: {} },
    onClear: (__VLS_ctx.handleSearch),
};
var __VLS_41;
var __VLS_42;
// @ts-ignore
[searchForm, handleSearch,];
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
    ...{ style: {} },
}));
const __VLS_53 = __VLS_52({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.status),
    placeholder: "状态",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_58 } = __VLS_54.slots;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    label: "开启",
    value: "OPEN",
}));
const __VLS_61 = __VLS_60({
    label: "开启",
    value: "OPEN",
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    label: "已关闭",
    value: "CLOSED",
}));
const __VLS_66 = __VLS_65({
    label: "已关闭",
    value: "CLOSED",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_48;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_74 } = __VLS_72.slots;
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.sessionType),
    placeholder: "类型",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_77 = __VLS_76({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.sessionType),
    placeholder: "类型",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_80;
const __VLS_81 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
const { default: __VLS_82 } = __VLS_78.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    label: "正常",
    value: "NORMAL",
}));
const __VLS_85 = __VLS_84({
    label: "正常",
    value: "NORMAL",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    label: "质检",
    value: "INSPECTION",
}));
const __VLS_90 = __VLS_89({
    label: "质检",
    value: "INSPECTION",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_78;
var __VLS_79;
// @ts-ignore
[];
var __VLS_72;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({}));
const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}));
const __VLS_101 = __VLS_100({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.searchForm.dateRange),
    type: "daterange",
    rangeSeparator: "to",
    startPlaceholder: "开始",
    endPlaceholder: "结束",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleSearch),
};
var __VLS_102;
var __VLS_103;
// @ts-ignore
[searchForm, handleSearch,];
var __VLS_96;
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
    type: "primary",
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_119 } = __VLS_115.slots;
// @ts-ignore
[handleSearch,];
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
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_122 = __VLS_121({
    ...{ 'onRowClick': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_125;
const __VLS_126 = {
    ...{ rowClick: {} },
    onRowClick: (__VLS_ctx.openDetail),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_127 } = __VLS_123.slots;
let __VLS_128;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
    type: "index",
    label: "#",
    width: "50",
}));
const __VLS_130 = __VLS_129({
    type: "index",
    label: "#",
    width: "50",
}, ...__VLS_functionalComponentArgsRest(__VLS_129));
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    prop: "sessionNo",
    label: "会话编号",
    width: "150",
    showOverflowTooltip: true,
}));
const __VLS_135 = __VLS_134({
    prop: "sessionNo",
    label: "会话编号",
    width: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
let __VLS_138;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    prop: "customerName",
    label: "客户",
    width: "100",
    showOverflowTooltip: true,
}));
const __VLS_140 = __VLS_139({
    prop: "customerName",
    label: "客户",
    width: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
let __VLS_143;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
    prop: "merchantName",
    label: "商户",
    width: "100",
    showOverflowTooltip: true,
}));
const __VLS_145 = __VLS_144({
    prop: "merchantName",
    label: "商户",
    width: "100",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_144));
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    label: "类型",
    width: "90",
    align: "center",
}));
const __VLS_150 = __VLS_149({
    label: "类型",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
const { default: __VLS_153 } = __VLS_151.slots;
{
    const { default: __VLS_154 } = __VLS_151.slots;
    const [{ row }] = __VLS_vSlot(__VLS_154);
    let __VLS_155;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
        type: (row.sessionType === 'INSPECTION' ? 'warning' : 'info'),
        size: "small",
    }));
    const __VLS_157 = __VLS_156({
        type: (row.sessionType === 'INSPECTION' ? 'warning' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    const { default: __VLS_160 } = __VLS_158.slots;
    (row.sessionType);
    // @ts-ignore
    [tableData, openDetail, vLoading, loading,];
    var __VLS_158;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_151;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    label: "状态",
    width: "80",
    align: "center",
}));
const __VLS_163 = __VLS_162({
    label: "状态",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const { default: __VLS_166 } = __VLS_164.slots;
{
    const { default: __VLS_167 } = __VLS_164.slots;
    const [{ row }] = __VLS_vSlot(__VLS_167);
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        type: (row.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_170 = __VLS_169({
        type: (row.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    const { default: __VLS_173 } = __VLS_171.slots;
    (row.status);
    // @ts-ignore
    [];
    var __VLS_171;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_164;
let __VLS_174;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
    label: "优先级",
    width: "70",
    align: "center",
}));
const __VLS_176 = __VLS_175({
    label: "优先级",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_175));
const { default: __VLS_179 } = __VLS_177.slots;
{
    const { default: __VLS_180 } = __VLS_177.slots;
    const [{ row }] = __VLS_vSlot(__VLS_180);
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        type: (row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'),
        size: "small",
    }));
    const __VLS_183 = __VLS_182({
        type: (row.priority === 'HIGH' ? 'danger' : row.priority === 'MEDIUM' ? 'warning' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    const { default: __VLS_186 } = __VLS_184.slots;
    (row.priority);
    // @ts-ignore
    [];
    var __VLS_184;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_177;
let __VLS_187;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
    label: "回复",
    width: "90",
    align: "center",
}));
const __VLS_189 = __VLS_188({
    label: "回复",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_188));
const { default: __VLS_192 } = __VLS_190.slots;
{
    const { default: __VLS_193 } = __VLS_190.slots;
    const [{ row }] = __VLS_vSlot(__VLS_193);
    if (row.firstResponseSeconds) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.firstResponseSeconds);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_190;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    label: "最后消息",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_196 = __VLS_195({
    label: "最后消息",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
const { default: __VLS_199 } = __VLS_197.slots;
{
    const { default: __VLS_200 } = __VLS_197.slots;
    const [{ row }] = __VLS_vSlot(__VLS_200);
    (row.lastMessage || '-');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_197;
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    label: "未读",
    width: "80",
    align: "center",
}));
const __VLS_203 = __VLS_202({
    label: "未读",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
const { default: __VLS_206 } = __VLS_204.slots;
{
    const { default: __VLS_207 } = __VLS_204.slots;
    const [{ row }] = __VLS_vSlot(__VLS_207);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (row.customerUnread || 0);
    (row.merchantUnread || 0);
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_204;
let __VLS_208;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
    label: "质检",
    width: "80",
    align: "center",
}));
const __VLS_210 = __VLS_209({
    label: "质检",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
const { default: __VLS_213 } = __VLS_211.slots;
{
    const { default: __VLS_214 } = __VLS_211.slots;
    const [{ row }] = __VLS_vSlot(__VLS_214);
    if (row.inspectionId) {
        let __VLS_215;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
            type: "warning",
            size: "small",
        }));
        const __VLS_217 = __VLS_216({
            type: "warning",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_216));
        const { default: __VLS_220 } = __VLS_218.slots;
        (row.inspectionId);
        // @ts-ignore
        [];
        var __VLS_218;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_211;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    prop: "lastMessageAt",
    label: "最后时间",
    width: "160",
}));
const __VLS_223 = __VLS_222({
    prop: "lastMessageAt",
    label: "最后时间",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
let __VLS_226;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
    label: "操作",
    width: "120",
    fixed: "right",
}));
const __VLS_228 = __VLS_227({
    label: "操作",
    width: "120",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_227));
const { default: __VLS_231 } = __VLS_229.slots;
{
    const { default: __VLS_232 } = __VLS_229.slots;
    const [{ row }] = __VLS_vSlot(__VLS_232);
    let __VLS_233;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_235 = __VLS_234({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    let __VLS_238;
    const __VLS_239 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    const { default: __VLS_240 } = __VLS_236.slots;
    // @ts-ignore
    [];
    var __VLS_236;
    var __VLS_237;
    if (row.status === 'OPEN') {
        let __VLS_241;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_242 = __VLS_asFunctionalComponent1(__VLS_241, new __VLS_241({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_243 = __VLS_242({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_242));
        let __VLS_246;
        const __VLS_247 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(row.status === 'OPEN'))
                    return;
                __VLS_ctx.handleClose(row);
                // @ts-ignore
                [handleClose,];
            },
        };
        const { default: __VLS_248 } = __VLS_244.slots;
        // @ts-ignore
        [];
        var __VLS_244;
        var __VLS_245;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_229;
// @ts-ignore
[];
var __VLS_123;
var __VLS_124;
let __VLS_249;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_251 = __VLS_250({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_250));
let __VLS_254;
const __VLS_255 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_252;
var __VLS_253;
let __VLS_256;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
    modelValue: (__VLS_ctx.detailVisible),
    title: ('Session: ' + (__VLS_ctx.detailSession?.sessionNo || '')),
    width: "750px",
}));
const __VLS_258 = __VLS_257({
    modelValue: (__VLS_ctx.detailVisible),
    title: ('Session: ' + (__VLS_ctx.detailSession?.sessionNo || '')),
    width: "750px",
}, ...__VLS_functionalComponentArgsRest(__VLS_257));
const { default: __VLS_261 } = __VLS_259.slots;
if (__VLS_ctx.detailSession) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "detail-panel" },
    });
    /** @type {__VLS_StyleScopedClasses['detail-panel']} */ ;
    let __VLS_262;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
        column: (3),
        border: true,
        size: "small",
    }));
    const __VLS_264 = __VLS_263({
        column: (3),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_263));
    const { default: __VLS_267 } = __VLS_265.slots;
    let __VLS_268;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
        label: "客户",
    }));
    const __VLS_270 = __VLS_269({
        label: "客户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    const { default: __VLS_273 } = __VLS_271.slots;
    (__VLS_ctx.detailSession.customerName || `ID:${__VLS_ctx.detailSession.customerUserId}`);
    // @ts-ignore
    [searchForm, searchForm, total, fetchData, detailVisible, detailSession, detailSession, detailSession, detailSession,];
    var __VLS_271;
    let __VLS_274;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
        label: "商户",
    }));
    const __VLS_276 = __VLS_275({
        label: "商户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_275));
    const { default: __VLS_279 } = __VLS_277.slots;
    (__VLS_ctx.detailSession.merchantName || `ID:${__VLS_ctx.detailSession.merchantId}`);
    // @ts-ignore
    [detailSession, detailSession,];
    var __VLS_277;
    let __VLS_280;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent1(__VLS_280, new __VLS_280({
        label: "状态",
    }));
    const __VLS_282 = __VLS_281({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    const { default: __VLS_285 } = __VLS_283.slots;
    let __VLS_286;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
        type: (__VLS_ctx.detailSession.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_288 = __VLS_287({
        type: (__VLS_ctx.detailSession.status === 'OPEN' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    const { default: __VLS_291 } = __VLS_289.slots;
    (__VLS_ctx.detailSession.status);
    // @ts-ignore
    [detailSession, detailSession,];
    var __VLS_289;
    // @ts-ignore
    [];
    var __VLS_283;
    let __VLS_292;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
        label: "类型",
    }));
    const __VLS_294 = __VLS_293({
        label: "类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    const { default: __VLS_297 } = __VLS_295.slots;
    (__VLS_ctx.detailSession.sessionType);
    // @ts-ignore
    [detailSession,];
    var __VLS_295;
    let __VLS_298;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
        label: "优先级",
    }));
    const __VLS_300 = __VLS_299({
        label: "优先级",
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    const { default: __VLS_303 } = __VLS_301.slots;
    (__VLS_ctx.detailSession.priority);
    // @ts-ignore
    [detailSession,];
    var __VLS_301;
    if (__VLS_ctx.detailSession.operatorName) {
        let __VLS_304;
        /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
        elDescriptionsItem;
        // @ts-ignore
        const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
            label: "操作人",
        }));
        const __VLS_306 = __VLS_305({
            label: "操作人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_305));
        const { default: __VLS_309 } = __VLS_307.slots;
        (__VLS_ctx.detailSession.operatorName);
        // @ts-ignore
        [detailSession, detailSession,];
        var __VLS_307;
    }
    // @ts-ignore
    [];
    var __VLS_265;
    let __VLS_310;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_311 = __VLS_asFunctionalComponent1(__VLS_310, new __VLS_310({}));
    const __VLS_312 = __VLS_311({}, ...__VLS_functionalComponentArgsRest(__VLS_311));
    const { default: __VLS_315 } = __VLS_313.slots;
    // @ts-ignore
    [];
    var __VLS_313;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "msg-list" },
        ref: "detailMsgRef",
    });
    /** @type {__VLS_StyleScopedClasses['msg-list']} */ ;
    for (const [msg] of __VLS_vFor((__VLS_ctx.detailMessages))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (msg.id),
            ...{ class: "msg-item" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-side" },
            ...{ class: (msg.senderSide === 'CUSTOMER' ? 'side-customer' : msg.senderSide === 'MERCHANT' ? 'side-merchant' : 'side-admin') },
        });
        /** @type {__VLS_StyleScopedClasses['msg-side']} */ ;
        (msg.senderSide);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-name" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-name']} */ ;
        (msg.senderDisplayName);
        if (msg.messageType === 'IMAGE') {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "msg-img" },
            });
            /** @type {__VLS_StyleScopedClasses['msg-img']} */ ;
            let __VLS_316;
            /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
            elImage;
            // @ts-ignore
            const __VLS_317 = __VLS_asFunctionalComponent1(__VLS_316, new __VLS_316({
                src: (msg.content),
                ...{ style: {} },
                previewSrcList: ([msg.content]),
                fit: "cover",
            }));
            const __VLS_318 = __VLS_317({
                src: (msg.content),
                ...{ style: {} },
                previewSrcList: ([msg.content]),
                fit: "cover",
            }, ...__VLS_functionalComponentArgsRest(__VLS_317));
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "msg-content" },
            });
            /** @type {__VLS_StyleScopedClasses['msg-content']} */ ;
            (msg.content);
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "msg-time" },
        });
        /** @type {__VLS_StyleScopedClasses['msg-time']} */ ;
        (msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '');
        // @ts-ignore
        [detailMessages,];
    }
}
// @ts-ignore
[];
var __VLS_259;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
