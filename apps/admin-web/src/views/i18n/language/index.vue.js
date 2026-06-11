/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { i18nApi } from '@/api/i18n';
defineOptions({ name: 'I18nLanguageView' });
const loading = ref(false);
const submitLoading = ref(false);
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formRef = ref();
const searchForm = reactive({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    name: '',
    nativeName: '',
    code: '',
    status: 'ENABLE',
    sort: 0,
});
const rules = {
    name: [{ required: true, message: '请输入语言名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入语言代码', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await i18nApi.getLanguages({
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
    Object.assign(form, { name: '', nativeName: '', code: '', status: 'ENABLE', sort: 0 });
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    editingId.value = row.id;
    Object.assign(form, {
        name: row.name,
        nativeName: row.nativeName,
        code: row.code,
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
            const { data: res } = await i18nApi.updateLanguage(editingId.value, { ...form });
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
            const { data: res } = await i18nApi.createLanguage({ ...form });
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
        const { data: res } = await i18nApi.updateLanguageStatus(row.id, newStatus);
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
        const { data: res } = await i18nApi.deleteLanguage(row.id);
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
    placeholder: "语言名称 / 代码",
    clearable: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClear': {} },
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.searchForm.keyword),
    placeholder: "语言名称 / 代码",
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
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:language:add') }, null, null);
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
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_87 = __VLS_86({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_90 } = __VLS_88.slots;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    prop: "name",
    label: "语言名称",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_93 = __VLS_92({
    prop: "name",
    label: "语言名称",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    prop: "nativeName",
    label: "本地名称",
    minWidth: "140",
    showOverflowTooltip: true,
}));
const __VLS_98 = __VLS_97({
    prop: "nativeName",
    label: "本地名称",
    minWidth: "140",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_101;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
    prop: "code",
    label: "语言代码",
    width: "120",
}));
const __VLS_103 = __VLS_102({
    prop: "code",
    label: "语言代码",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_108 = __VLS_107({
    prop: "status",
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
{
    const { default: __VLS_112 } = __VLS_109.slots;
    const [{ row }] = __VLS_vSlot(__VLS_112);
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }));
    const __VLS_115 = __VLS_114({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    const { default: __VLS_118 } = __VLS_116.slots;
    (row.status === 'ENABLE' ? '已启用' : '已禁用');
    // @ts-ignore
    [tableData, vLoading, loading,];
    var __VLS_116;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_109;
let __VLS_119;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}));
const __VLS_121 = __VLS_120({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_126 = __VLS_125({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    label: "操作",
    width: "220",
    fixed: "right",
}));
const __VLS_131 = __VLS_130({
    label: "操作",
    width: "220",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
{
    const { default: __VLS_135 } = __VLS_132.slots;
    const [{ row }] = __VLS_vSlot(__VLS_135);
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_138 = __VLS_137({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    let __VLS_141;
    const __VLS_142 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
            // @ts-ignore
            [handleEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:language:edit') }, null, null);
    const { default: __VLS_143 } = __VLS_139.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_139;
    var __VLS_140;
    let __VLS_144;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }));
    const __VLS_146 = __VLS_145({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_149;
    const __VLS_150 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:language:edit') }, null, null);
    const { default: __VLS_151 } = __VLS_147.slots;
    (row.status === 'ENABLE' ? '禁用' : '启用');
    // @ts-ignore
    [vPermission,];
    var __VLS_147;
    var __VLS_148;
    let __VLS_152;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
        ...{ 'onConfirm': {} },
        title: "确定要删除该语言吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }));
    const __VLS_154 = __VLS_153({
        ...{ 'onConfirm': {} },
        title: "确定要删除该语言吗？",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
    }, ...__VLS_functionalComponentArgsRest(__VLS_153));
    let __VLS_157;
    const __VLS_158 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_159 } = __VLS_155.slots;
    {
        const { reference: __VLS_160 } = __VLS_155.slots;
        let __VLS_161;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
            link: true,
            type: "danger",
        }));
        const __VLS_163 = __VLS_162({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('i18n:language:delete') }, null, null);
        const { default: __VLS_166 } = __VLS_164.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_164;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_155;
    var __VLS_156;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_132;
{
    const { empty: __VLS_167 } = __VLS_88.slots;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        description: "暂无数据",
    }));
    const __VLS_170 = __VLS_169({
        description: "暂无数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_88;
let __VLS_173;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_175 = __VLS_174({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
let __VLS_178;
const __VLS_179 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_176;
var __VLS_177;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑语言' : '新增语言'),
    width: "550px",
}));
const __VLS_182 = __VLS_181({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑语言' : '新增语言'),
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
let __VLS_185;
const __VLS_186 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_187 } = __VLS_183.slots;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
}));
const __VLS_190 = __VLS_189({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
var __VLS_193;
const { default: __VLS_195 } = __VLS_191.slots;
let __VLS_196;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    label: "语言名称",
    prop: "name",
}));
const __VLS_198 = __VLS_197({
    label: "语言名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
const { default: __VLS_201 } = __VLS_199.slots;
let __VLS_202;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入语言名称，如 English",
}));
const __VLS_204 = __VLS_203({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入语言名称，如 English",
}, ...__VLS_functionalComponentArgsRest(__VLS_203));
// @ts-ignore
[searchForm, searchForm, total, fetchData, dialogVisible, isEdit, resetForm, form, form, rules,];
var __VLS_199;
let __VLS_207;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
    label: "本地名称",
    prop: "nativeName",
}));
const __VLS_209 = __VLS_208({
    label: "本地名称",
    prop: "nativeName",
}, ...__VLS_functionalComponentArgsRest(__VLS_208));
const { default: __VLS_212 } = __VLS_210.slots;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    modelValue: (__VLS_ctx.form.nativeName),
    placeholder: "请输入本地名称，如 简体中文",
}));
const __VLS_215 = __VLS_214({
    modelValue: (__VLS_ctx.form.nativeName),
    placeholder: "请输入本地名称，如 简体中文",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
// @ts-ignore
[form,];
var __VLS_210;
let __VLS_218;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
    label: "语言代码",
    prop: "code",
}));
const __VLS_220 = __VLS_219({
    label: "语言代码",
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_219));
const { default: __VLS_223 } = __VLS_221.slots;
let __VLS_224;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "如 en、zh-Hans、zh-Hant",
}));
const __VLS_226 = __VLS_225({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "如 en、zh-Hans、zh-Hant",
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
// @ts-ignore
[form,];
var __VLS_221;
let __VLS_229;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
    label: "状态",
    prop: "status",
}));
const __VLS_231 = __VLS_230({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
const { default: __VLS_234 } = __VLS_232.slots;
let __VLS_235;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_237 = __VLS_236({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
const { default: __VLS_240 } = __VLS_238.slots;
let __VLS_241;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_242 = __VLS_asFunctionalComponent1(__VLS_241, new __VLS_241({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_243 = __VLS_242({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_242));
let __VLS_246;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_248 = __VLS_247({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
// @ts-ignore
[form,];
var __VLS_238;
// @ts-ignore
[];
var __VLS_232;
let __VLS_251;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
    label: "排序",
    prop: "sort",
}));
const __VLS_253 = __VLS_252({
    label: "排序",
    prop: "sort",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
const { default: __VLS_256 } = __VLS_254.slots;
let __VLS_257;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_259 = __VLS_258({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
// @ts-ignore
[form,];
var __VLS_254;
// @ts-ignore
[];
var __VLS_191;
{
    const { footer: __VLS_262 } = __VLS_183.slots;
    let __VLS_263;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
        ...{ 'onClick': {} },
    }));
    const __VLS_265 = __VLS_264({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_264));
    let __VLS_268;
    const __VLS_269 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_270 } = __VLS_266.slots;
    // @ts-ignore
    [];
    var __VLS_266;
    var __VLS_267;
    let __VLS_271;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_273 = __VLS_272({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_272));
    let __VLS_276;
    const __VLS_277 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_278 } = __VLS_274.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_274;
    var __VLS_275;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_183;
var __VLS_184;
// @ts-ignore
var __VLS_194 = __VLS_193;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
