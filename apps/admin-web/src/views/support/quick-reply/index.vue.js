/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { quickReplyAdminApi } from '@/api/support';
defineOptions({ name: 'AdminQuickReplyView' });
const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const formVisible = ref(false);
const editingId = ref(null);
const submitting = ref(false);
const searchForm = reactive({
    page: 1,
    pageSize: 20,
});
const formData = reactive({
    title: '',
    content: '',
    languageCode: 'en',
    merchantId: '',
    status: 'ENABLE',
    sort: 0,
});
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await quickReplyAdminApi.getList({
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list || [];
            total.value = res.data.total || 0;
        }
        else {
            ElMessage.error(res.message || '获取失败');
        }
    }
    catch {
        ElMessage.error('获取失败');
    }
    finally {
        loading.value = false;
    }
}
function openCreate() {
    editingId.value = null;
    formData.title = '';
    formData.content = '';
    formData.languageCode = 'en';
    formData.merchantId = '';
    formData.status = 'ENABLE';
    formData.sort = 0;
    formVisible.value = true;
}
function openEdit(row) {
    editingId.value = row.id;
    formData.title = row.title;
    formData.content = row.content;
    formData.languageCode = row.languageCode;
    formData.merchantId = row.merchantId ? String(row.merchantId) : '';
    formData.status = row.status;
    formData.sort = row.sort;
    formVisible.value = true;
}
function resetForm() {
    editingId.value = null;
}
async function handleSubmit() {
    if (!formData.title.trim() || !formData.content.trim()) {
        ElMessage.warning('标题和内容为必填项');
        return;
    }
    submitting.value = true;
    try {
        const payload = {
            title: formData.title,
            content: formData.content,
            languageCode: formData.languageCode,
            status: formData.status,
            sort: formData.sort,
        };
        if (formData.merchantId)
            payload.merchantId = Number(formData.merchantId);
        let res;
        if (editingId.value) {
            res = await quickReplyAdminApi.update(editingId.value, payload);
        }
        else {
            res = await quickReplyAdminApi.create(payload);
        }
        if (res.data.code === 200) {
            ElMessage.success(editingId.value ? '更新成功' : '新增成功');
            formVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.data.message || '保存失败');
        }
    }
    catch {
        ElMessage.error('保存失败');
    }
    finally {
        submitting.value = false;
    }
}
async function handleDelete(row) {
    try {
        const { data: res } = await quickReplyAdminApi.delete(row.id);
        if (res.code === 200) {
            ElMessage.success('已删除');
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
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "quick-reply-admin-page" },
});
/** @type {__VLS_StyleScopedClasses['quick-reply-admin-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.openCreate),
};
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[openCreate,];
var __VLS_3;
var __VLS_4;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    type: "index",
    label: "#",
    width: "55",
}));
const __VLS_16 = __VLS_15({
    type: "index",
    label: "#",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    prop: "title",
    label: "标题",
    minWidth: "150",
    showOverflowTooltip: true,
}));
const __VLS_21 = __VLS_20({
    prop: "title",
    label: "标题",
    minWidth: "150",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    label: "内容",
    minWidth: "250",
    showOverflowTooltip: true,
}));
const __VLS_26 = __VLS_25({
    label: "内容",
    minWidth: "250",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
{
    const { default: __VLS_30 } = __VLS_27.slots;
    const [{ row }] = __VLS_vSlot(__VLS_30);
    (row.content?.length > 60 ? row.content.slice(0, 60) + '...' : row.content);
    // @ts-ignore
    [tableData, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_27;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    prop: "languageCode",
    label: "语言",
    width: "90",
    align: "center",
}));
const __VLS_33 = __VLS_32({
    prop: "languageCode",
    label: "语言",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    prop: "merchantId",
    label: "商户",
    width: "80",
    align: "center",
}));
const __VLS_38 = __VLS_37({
    prop: "merchantId",
    label: "商户",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
{
    const { default: __VLS_42 } = __VLS_39.slots;
    const [{ row }] = __VLS_vSlot(__VLS_42);
    (row.merchantId || 'Global');
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_39;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: "状态",
    width: "90",
    align: "center",
}));
const __VLS_45 = __VLS_44({
    label: "状态",
    width: "90",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
{
    const { default: __VLS_49 } = __VLS_46.slots;
    const [{ row }] = __VLS_vSlot(__VLS_49);
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        type: (row.status === 'ENABLE' ? 'success' : 'info'),
        size: "small",
    }));
    const __VLS_52 = __VLS_51({
        type: (row.status === 'ENABLE' ? 'success' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    (row.status);
    // @ts-ignore
    [];
    var __VLS_53;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_46;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    prop: "sort",
    label: "排序",
    width: "60",
    align: "center",
}));
const __VLS_58 = __VLS_57({
    prop: "sort",
    label: "排序",
    width: "60",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: "操作",
    width: "200",
    fixed: "right",
}));
const __VLS_63 = __VLS_62({
    label: "操作",
    width: "200",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
{
    const { default: __VLS_67 } = __VLS_64.slots;
    const [{ row }] = __VLS_vSlot(__VLS_67);
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    const __VLS_74 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    const { default: __VLS_75 } = __VLS_71.slots;
    // @ts-ignore
    [];
    var __VLS_71;
    var __VLS_72;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_81;
    const __VLS_82 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_83 } = __VLS_79.slots;
    {
        const { reference: __VLS_84 } = __VLS_79.slots;
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            link: true,
            type: "danger",
        }));
        const __VLS_87 = __VLS_86({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        const { default: __VLS_90 } = __VLS_88.slots;
        // @ts-ignore
        [];
        var __VLS_88;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_79;
    var __VLS_80;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_64;
// @ts-ignore
[];
var __VLS_11;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_93 = __VLS_92({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
let __VLS_96;
const __VLS_97 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_94;
var __VLS_95;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.editingId ? '编辑快捷回复' : '新增快捷回复'),
    width: "550px",
}));
const __VLS_100 = __VLS_99({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.formVisible),
    title: (__VLS_ctx.editingId ? '编辑快捷回复' : '新增快捷回复'),
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
const __VLS_104 = {
    ...{ closed: {} },
    onClosed: (__VLS_ctx.resetForm),
};
const { default: __VLS_105 } = __VLS_101.slots;
let __VLS_106;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
    model: (__VLS_ctx.formData),
    labelWidth: "120px",
}));
const __VLS_108 = __VLS_107({
    model: (__VLS_ctx.formData),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_107));
const { default: __VLS_111 } = __VLS_109.slots;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    label: "标题",
    required: true,
}));
const __VLS_114 = __VLS_113({
    label: "标题",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
const { default: __VLS_117 } = __VLS_115.slots;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    modelValue: (__VLS_ctx.formData.title),
    placeholder: "快捷回复标题",
}));
const __VLS_120 = __VLS_119({
    modelValue: (__VLS_ctx.formData.title),
    placeholder: "快捷回复标题",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
// @ts-ignore
[searchForm, searchForm, total, fetchData, formVisible, editingId, resetForm, formData, formData,];
var __VLS_115;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    label: "内容",
    required: true,
}));
const __VLS_125 = __VLS_124({
    label: "内容",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
const { default: __VLS_128 } = __VLS_126.slots;
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.formData.content),
    type: "textarea",
    rows: (5),
    placeholder: "回复内容…",
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.formData.content),
    type: "textarea",
    rows: (5),
    placeholder: "回复内容…",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
// @ts-ignore
[formData,];
var __VLS_126;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    label: "语言",
}));
const __VLS_136 = __VLS_135({
    label: "语言",
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
const { default: __VLS_139 } = __VLS_137.slots;
let __VLS_140;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
    modelValue: (__VLS_ctx.formData.languageCode),
    ...{ style: {} },
}));
const __VLS_142 = __VLS_141({
    modelValue: (__VLS_ctx.formData.languageCode),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_141));
const { default: __VLS_145 } = __VLS_143.slots;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    label: "英语",
    value: "en",
}));
const __VLS_148 = __VLS_147({
    label: "英语",
    value: "en",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    label: "日语",
    value: "ja",
}));
const __VLS_153 = __VLS_152({
    label: "日语",
    value: "ja",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    label: "韩语",
    value: "ko",
}));
const __VLS_158 = __VLS_157({
    label: "韩语",
    value: "ko",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
// @ts-ignore
[formData,];
var __VLS_143;
// @ts-ignore
[];
var __VLS_137;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    label: "商户ID",
}));
const __VLS_163 = __VLS_162({
    label: "商户ID",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const { default: __VLS_166 } = __VLS_164.slots;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    modelValue: (__VLS_ctx.formData.merchantId),
    placeholder: "留空表示全局",
}));
const __VLS_169 = __VLS_168({
    modelValue: (__VLS_ctx.formData.merchantId),
    placeholder: "留空表示全局",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
// @ts-ignore
[formData,];
var __VLS_164;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    label: "状态",
}));
const __VLS_174 = __VLS_173({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
const { default: __VLS_177 } = __VLS_175.slots;
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    modelValue: (__VLS_ctx.formData.status),
    ...{ style: {} },
}));
const __VLS_180 = __VLS_179({
    modelValue: (__VLS_ctx.formData.status),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
const { default: __VLS_183 } = __VLS_181.slots;
let __VLS_184;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent1(__VLS_184, new __VLS_184({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_186 = __VLS_185({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
let __VLS_189;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_191 = __VLS_190({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
// @ts-ignore
[formData,];
var __VLS_181;
// @ts-ignore
[];
var __VLS_175;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    label: "排序",
}));
const __VLS_196 = __VLS_195({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
const { default: __VLS_199 } = __VLS_197.slots;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    modelValue: (__VLS_ctx.formData.sort),
    min: (0),
    max: (9999),
}));
const __VLS_202 = __VLS_201({
    modelValue: (__VLS_ctx.formData.sort),
    min: (0),
    max: (9999),
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
// @ts-ignore
[formData,];
var __VLS_197;
// @ts-ignore
[];
var __VLS_109;
{
    const { footer: __VLS_205 } = __VLS_101.slots;
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
        ...{ 'onClick': {} },
    }));
    const __VLS_208 = __VLS_207({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    let __VLS_211;
    const __VLS_212 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.formVisible = false;
            // @ts-ignore
            [formVisible,];
        },
    };
    const { default: __VLS_213 } = __VLS_209.slots;
    // @ts-ignore
    [];
    var __VLS_209;
    var __VLS_210;
    let __VLS_214;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }));
    const __VLS_216 = __VLS_215({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_215));
    let __VLS_219;
    const __VLS_220 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_221 } = __VLS_217.slots;
    // @ts-ignore
    [submitting, handleSubmit,];
    var __VLS_217;
    var __VLS_218;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_101;
var __VLS_102;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
