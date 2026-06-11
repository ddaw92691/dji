/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { i18nApi } from '@/api/i18n';
import { REGION_OPTIONS, regionLabel } from '@/constants/i18nRegions';
defineOptions({ name: 'I18nCountryView' });
const loading = ref(false);
const submitLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const selectedRows = ref([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formRef = ref();
const TIMEZONE_OPTIONS = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Bogota',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Singapore',
    'Asia/Dubai',
    'Australia/Sydney',
];
const searchForm = reactive({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    name: '',
    code: '',
    region: '',
    flagIcon: '',
    phoneCode: '',
    defaultLanguageCode: '',
    currencyCode: '',
    currencySymbol: '',
    timezone: '',
    exchangeRate: 1,
    status: 'ENABLE',
    sort: 0,
});
const rules = {
    name: [{ required: true, message: '请输入国家名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入国家代码', trigger: 'blur' }],
    phoneCode: [{ required: true, message: '请输入电话区号', trigger: 'blur' }],
    currencyCode: [{ required: true, message: '请输入货币代码', trigger: 'blur' }],
    timezone: [{ required: true, message: '请输入时区', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};
function handleSelectionChange(rows) {
    selectedRows.value = rows;
}
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await i18nApi.getCountries({
            keyword: searchForm.keyword || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            const pageData = res.data;
            tableData.value = pageData.list;
            total.value = pageData.total;
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
function handleReset() {
    searchForm.keyword = '';
    searchForm.status = '';
    handleSearch();
}
function handleCreate() {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, {
        name: '',
        code: '',
        region: '',
        flagIcon: '',
        phoneCode: '',
        defaultLanguageCode: '',
        currencyCode: '',
        currencySymbol: '',
        timezone: '',
        exchangeRate: 1,
        status: 'ENABLE',
        sort: 0,
    });
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    editingId.value = row.id;
    Object.assign(form, {
        name: row.name,
        code: row.code,
        region: row.region,
        flagIcon: row.flagIcon,
        phoneCode: row.phoneCode,
        defaultLanguageCode: row.defaultLanguageCode,
        currencyCode: row.currencyCode,
        currencySymbol: row.currencySymbol,
        timezone: row.timezone,
        exchangeRate: row.exchangeRate,
        status: row.status,
        sort: row.sort,
    });
    dialogVisible.value = true;
}
async function handleSubmit() {
    if (!formRef.value)
        return;
    const valid = await formRef.value.validate().catch(() => false);
    if (!valid)
        return;
    submitLoading.value = true;
    try {
        if (isEdit.value && editingId.value) {
            const { data: res } = await i18nApi.updateCountry(editingId.value, { ...form });
            if (res.code === 200) {
                ElMessage.success('更新成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '更新失败');
            }
        }
        else {
            const { data: res } = await i18nApi.createCountry({ ...form });
            if (res.code === 200) {
                ElMessage.success('新增成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '新增失败');
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
        const { data: res } = await i18nApi.updateCountryStatus(row.id, newStatus);
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
        const { data: res } = await i18nApi.deleteCountry(row.id);
        if (res.code === 200) {
            ElMessage.success('删除成功');
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
    ...{ class: "i18n-page" },
});
/** @type {__VLS_StyleScopedClasses['i18n-page']} */ ;
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
    placeholder: "国家名称 / 代码",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "国家名称 / 代码",
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
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_35 = __VLS_34({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_40 = __VLS_39({
    label: "已禁用",
    value: "DISABLE",
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
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleSearch),
};
const { default: __VLS_56 } = __VLS_52.slots;
// @ts-ignore
[handleSearch,];
var __VLS_52;
var __VLS_53;
// @ts-ignore
[];
var __VLS_46;
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
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleReset),
};
const { default: __VLS_70 } = __VLS_66.slots;
// @ts-ignore
[handleReset,];
var __VLS_66;
var __VLS_67;
// @ts-ignore
[];
var __VLS_60;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({}));
const __VLS_73 = __VLS_72({}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
const __VLS_83 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:country:add') }, null, null);
const { default: __VLS_84 } = __VLS_80.slots;
// @ts-ignore
[handleCreate, vPermission,];
var __VLS_80;
var __VLS_81;
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_3;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_87 = __VLS_86({
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
const __VLS_91 = {
    ...{ selectionChange: {} },
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_92 } = __VLS_88.slots;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    prop: "flagIcon",
    label: "旗帜",
    width: "70",
    align: "center",
}));
const __VLS_95 = __VLS_94({
    prop: "flagIcon",
    label: "旗帜",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    prop: "name",
    label: "名称",
    minWidth: "130",
    showOverflowTooltip: true,
}));
const __VLS_100 = __VLS_99({
    prop: "name",
    label: "名称",
    minWidth: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    prop: "code",
    label: "代码",
    width: "90",
}));
const __VLS_105 = __VLS_104({
    prop: "code",
    label: "代码",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
let __VLS_108;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
    prop: "region",
    label: "区域",
    width: "130",
    showOverflowTooltip: true,
}));
const __VLS_110 = __VLS_109({
    prop: "region",
    label: "区域",
    width: "130",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_109));
const { default: __VLS_113 } = __VLS_111.slots;
{
    const { default: __VLS_114 } = __VLS_111.slots;
    const [{ row }] = __VLS_vSlot(__VLS_114);
    (__VLS_ctx.regionLabel(row.region));
    // @ts-ignore
    [tableData, handleSelectionChange, vLoading, loading, regionLabel,];
}
// @ts-ignore
[];
var __VLS_111;
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    prop: "phoneCode",
    label: "区号",
    width: "90",
}));
const __VLS_117 = __VLS_116({
    prop: "phoneCode",
    label: "区号",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    prop: "defaultLanguageCode",
    label: "默认语言",
    width: "120",
    showOverflowTooltip: true,
}));
const __VLS_122 = __VLS_121({
    prop: "defaultLanguageCode",
    label: "默认语言",
    width: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    prop: "currencyCode",
    label: "货币",
    width: "80",
}));
const __VLS_127 = __VLS_126({
    prop: "currencyCode",
    label: "货币",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
let __VLS_130;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
    prop: "currencySymbol",
    label: "符号",
    width: "70",
}));
const __VLS_132 = __VLS_131({
    prop: "currencySymbol",
    label: "符号",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_131));
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    prop: "timezone",
    label: "时区",
    width: "140",
    showOverflowTooltip: true,
}));
const __VLS_137 = __VLS_136({
    prop: "timezone",
    label: "时区",
    width: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_142 = __VLS_141({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const { default: __VLS_145 } = __VLS_143.slots;
{
    const { default: __VLS_146 } = __VLS_143.slots;
    const [{ row }] = __VLS_vSlot(__VLS_146);
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }));
    const __VLS_149 = __VLS_148({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    const { default: __VLS_152 } = __VLS_150.slots;
    (row.status === 'ENABLE' ? '已启用' : '已禁用');
    // @ts-ignore
    [];
    var __VLS_150;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_143;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}));
const __VLS_155 = __VLS_154({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_160 = __VLS_159({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
const { default: __VLS_163 } = __VLS_161.slots;
{
    const { default: __VLS_164 } = __VLS_161.slots;
    const [{ row }] = __VLS_vSlot(__VLS_164);
    let __VLS_165;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_167 = __VLS_166({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_166));
    let __VLS_170;
    const __VLS_171 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
            // @ts-ignore
            [handleEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:country:edit') }, null, null);
    const { default: __VLS_172 } = __VLS_168.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_168;
    var __VLS_169;
    let __VLS_173;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }));
    const __VLS_175 = __VLS_174({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_174));
    let __VLS_178;
    const __VLS_179 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:country:edit') }, null, null);
    const { default: __VLS_180 } = __VLS_176.slots;
    (row.status === 'ENABLE' ? '禁用' : '启用');
    // @ts-ignore
    [vPermission,];
    var __VLS_176;
    var __VLS_177;
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        ...{ 'onConfirm': {} },
        title: "确定要删除该国家吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }));
    const __VLS_183 = __VLS_182({
        ...{ 'onConfirm': {} },
        title: "确定要删除该国家吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    let __VLS_186;
    const __VLS_187 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_188 } = __VLS_184.slots;
    {
        const { reference: __VLS_189 } = __VLS_184.slots;
        let __VLS_190;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
            link: true,
            type: "danger",
        }));
        const __VLS_192 = __VLS_191({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:country:delete') }, null, null);
        const { default: __VLS_195 } = __VLS_193.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_193;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_184;
    var __VLS_185;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_161;
{
    const { empty: __VLS_196 } = __VLS_88.slots;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        description: "暂无数据",
    }));
    const __VLS_199 = __VLS_198({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_88;
var __VLS_89;
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_204 = __VLS_203({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
let __VLS_207;
const __VLS_208 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_205;
var __VLS_206;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑国家' : '新增国家'),
    width: "650px",
}));
const __VLS_211 = __VLS_210({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑国家' : '新增国家'),
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
let __VLS_214;
const __VLS_215 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_216 } = __VLS_212.slots;
let __VLS_217;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
}));
const __VLS_219 = __VLS_218({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
var __VLS_222;
const { default: __VLS_224 } = __VLS_220.slots;
let __VLS_225;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
    label: "名称",
    prop: "name",
}));
const __VLS_227 = __VLS_226({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
const { default: __VLS_230 } = __VLS_228.slots;
let __VLS_231;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入国家名称",
}));
const __VLS_233 = __VLS_232({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入国家名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
// @ts-ignore
[searchForm, searchForm, total, fetchData, dialogVisible, isEdit, resetForm, form, form, rules,];
var __VLS_228;
let __VLS_236;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
    label: "代码",
    prop: "code",
}));
const __VLS_238 = __VLS_237({
    label: "代码",
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
const { default: __VLS_241 } = __VLS_239.slots;
let __VLS_242;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "国家代码（如 US、CN）",
}));
const __VLS_244 = __VLS_243({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "国家代码（如 US、CN）",
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
// @ts-ignore
[form,];
var __VLS_239;
let __VLS_247;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_248 = __VLS_asFunctionalComponent1(__VLS_247, new __VLS_247({
    label: "区域",
    prop: "region",
}));
const __VLS_249 = __VLS_248({
    label: "区域",
    prop: "region",
}, ...__VLS_functionalComponentArgsRest(__VLS_248));
const { default: __VLS_252 } = __VLS_250.slots;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    modelValue: (__VLS_ctx.form.region),
    placeholder: "请选择区域",
    ...{ style: {} },
}));
const __VLS_255 = __VLS_254({
    modelValue: (__VLS_ctx.form.region),
    placeholder: "请选择区域",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
const { default: __VLS_258 } = __VLS_256.slots;
for (const [r] of __VLS_vFor((__VLS_ctx.REGION_OPTIONS))) {
    let __VLS_259;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
        key: (r.value),
        label: (r.label),
        value: (r.value),
    }));
    const __VLS_261 = __VLS_260({
        key: (r.value),
        label: (r.label),
        value: (r.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    // @ts-ignore
    [form, REGION_OPTIONS,];
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
    label: "旗帜图标",
    prop: "flagIcon",
}));
const __VLS_266 = __VLS_265({
    label: "旗帜图标",
    prop: "flagIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_265));
const { default: __VLS_269 } = __VLS_267.slots;
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    modelValue: (__VLS_ctx.form.flagIcon),
    placeholder: "旗帜 emoji 或图标，如 🇺🇸",
}));
const __VLS_272 = __VLS_271({
    modelValue: (__VLS_ctx.form.flagIcon),
    placeholder: "旗帜 emoji 或图标，如 🇺🇸",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
// @ts-ignore
[form,];
var __VLS_267;
let __VLS_275;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_276 = __VLS_asFunctionalComponent1(__VLS_275, new __VLS_275({
    label: "电话区号",
    prop: "phoneCode",
}));
const __VLS_277 = __VLS_276({
    label: "电话区号",
    prop: "phoneCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_276));
const { default: __VLS_280 } = __VLS_278.slots;
let __VLS_281;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
    modelValue: (__VLS_ctx.form.phoneCode),
    placeholder: "+1",
}));
const __VLS_283 = __VLS_282({
    modelValue: (__VLS_ctx.form.phoneCode),
    placeholder: "+1",
}, ...__VLS_functionalComponentArgsRest(__VLS_282));
// @ts-ignore
[form,];
var __VLS_278;
let __VLS_286;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
    label: "默认语言代码",
    prop: "defaultLanguageCode",
}));
const __VLS_288 = __VLS_287({
    label: "默认语言代码",
    prop: "defaultLanguageCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_287));
const { default: __VLS_291 } = __VLS_289.slots;
let __VLS_292;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
    modelValue: (__VLS_ctx.form.defaultLanguageCode),
    placeholder: "如 en、zh-Hans",
}));
const __VLS_294 = __VLS_293({
    modelValue: (__VLS_ctx.form.defaultLanguageCode),
    placeholder: "如 en、zh-Hans",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
// @ts-ignore
[form,];
var __VLS_289;
let __VLS_297;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
    label: "货币代码",
    prop: "currencyCode",
}));
const __VLS_299 = __VLS_298({
    label: "货币代码",
    prop: "currencyCode",
}, ...__VLS_functionalComponentArgsRest(__VLS_298));
const { default: __VLS_302 } = __VLS_300.slots;
let __VLS_303;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
    modelValue: (__VLS_ctx.form.currencyCode),
    placeholder: "USD",
}));
const __VLS_305 = __VLS_304({
    modelValue: (__VLS_ctx.form.currencyCode),
    placeholder: "USD",
}, ...__VLS_functionalComponentArgsRest(__VLS_304));
// @ts-ignore
[form,];
var __VLS_300;
let __VLS_308;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
    label: "货币符号",
    prop: "currencySymbol",
}));
const __VLS_310 = __VLS_309({
    label: "货币符号",
    prop: "currencySymbol",
}, ...__VLS_functionalComponentArgsRest(__VLS_309));
const { default: __VLS_313 } = __VLS_311.slots;
let __VLS_314;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_315 = __VLS_asFunctionalComponent1(__VLS_314, new __VLS_314({
    modelValue: (__VLS_ctx.form.currencySymbol),
    placeholder: "$",
}));
const __VLS_316 = __VLS_315({
    modelValue: (__VLS_ctx.form.currencySymbol),
    placeholder: "$",
}, ...__VLS_functionalComponentArgsRest(__VLS_315));
// @ts-ignore
[form,];
var __VLS_311;
let __VLS_319;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_320 = __VLS_asFunctionalComponent1(__VLS_319, new __VLS_319({
    label: "时区",
    prop: "timezone",
}));
const __VLS_321 = __VLS_320({
    label: "时区",
    prop: "timezone",
}, ...__VLS_functionalComponentArgsRest(__VLS_320));
const { default: __VLS_324 } = __VLS_322.slots;
let __VLS_325;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_326 = __VLS_asFunctionalComponent1(__VLS_325, new __VLS_325({
    modelValue: (__VLS_ctx.form.timezone),
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    placeholder: "请选择时区",
    ...{ style: {} },
}));
const __VLS_327 = __VLS_326({
    modelValue: (__VLS_ctx.form.timezone),
    filterable: true,
    allowCreate: true,
    defaultFirstOption: true,
    placeholder: "请选择时区",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_326));
const { default: __VLS_330 } = __VLS_328.slots;
for (const [timezone] of __VLS_vFor((__VLS_ctx.TIMEZONE_OPTIONS))) {
    let __VLS_331;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
        key: (timezone),
        label: (timezone),
        value: (timezone),
    }));
    const __VLS_333 = __VLS_332({
        key: (timezone),
        label: (timezone),
        value: (timezone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_332));
    // @ts-ignore
    [form, TIMEZONE_OPTIONS,];
}
// @ts-ignore
[];
var __VLS_328;
// @ts-ignore
[];
var __VLS_322;
let __VLS_336;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    label: "汇率",
    prop: "exchangeRate",
}));
const __VLS_338 = __VLS_337({
    label: "汇率",
    prop: "exchangeRate",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
const { default: __VLS_341 } = __VLS_339.slots;
let __VLS_342;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent1(__VLS_342, new __VLS_342({
    modelValue: (__VLS_ctx.form.exchangeRate),
    precision: (6),
    min: (0.000001),
    ...{ style: {} },
}));
const __VLS_344 = __VLS_343({
    modelValue: (__VLS_ctx.form.exchangeRate),
    precision: (6),
    min: (0.000001),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-tip" },
});
/** @type {__VLS_StyleScopedClasses['form-tip']} */ ;
// @ts-ignore
[form,];
var __VLS_339;
let __VLS_347;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
    label: "状态",
    prop: "status",
}));
const __VLS_349 = __VLS_348({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_348));
const { default: __VLS_352 } = __VLS_350.slots;
let __VLS_353;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_355 = __VLS_354({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_354));
const { default: __VLS_358 } = __VLS_356.slots;
let __VLS_359;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_360 = __VLS_asFunctionalComponent1(__VLS_359, new __VLS_359({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_361 = __VLS_360({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_360));
let __VLS_364;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_365 = __VLS_asFunctionalComponent1(__VLS_364, new __VLS_364({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_366 = __VLS_365({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_365));
// @ts-ignore
[form,];
var __VLS_356;
// @ts-ignore
[];
var __VLS_350;
let __VLS_369;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_370 = __VLS_asFunctionalComponent1(__VLS_369, new __VLS_369({
    label: "排序",
    prop: "sort",
}));
const __VLS_371 = __VLS_370({
    label: "排序",
    prop: "sort",
}, ...__VLS_functionalComponentArgsRest(__VLS_370));
const { default: __VLS_374 } = __VLS_372.slots;
let __VLS_375;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_376 = __VLS_asFunctionalComponent1(__VLS_375, new __VLS_375({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_377 = __VLS_376({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_376));
// @ts-ignore
[form,];
var __VLS_372;
// @ts-ignore
[];
var __VLS_220;
{
    const { footer: __VLS_380 } = __VLS_212.slots;
    let __VLS_381;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_382 = __VLS_asFunctionalComponent1(__VLS_381, new __VLS_381({
        ...{ 'onClick': {} },
    }));
    const __VLS_383 = __VLS_382({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_382));
    let __VLS_386;
    const __VLS_387 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_388 } = __VLS_384.slots;
    // @ts-ignore
    [];
    var __VLS_384;
    var __VLS_385;
    let __VLS_389;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_391 = __VLS_390({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_390));
    let __VLS_394;
    const __VLS_395 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_396 } = __VLS_392.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_392;
    var __VLS_393;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_212;
var __VLS_213;
// @ts-ignore
var __VLS_223 = __VLS_222;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
