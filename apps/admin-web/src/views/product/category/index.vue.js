/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { categoryApi } from '@/api/category';
import { i18nApi } from '@/api/i18n';
import { uploadApi } from '@/api/upload';
defineOptions({ name: 'CategoryView' });
const loading = ref(false);
const submitLoading = ref(false);
const transLoading = ref(false);
const uploading = ref(false);
const tableData = ref([]);
const total = ref(0);
const dialogVisible = ref(false);
const transDialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref(null);
const formRef = ref();
const transFormRef = ref();
const transEditingId = ref(null);
const parentOptions = ref([]);
const languageOptions = ref([]);
const searchForm = reactive({
    keyword: '',
    status: '',
    page: 1,
    pageSize: 20,
});
const form = reactive({
    name: '',
    parentId: null,
    icon: '',
    sort: 0,
    status: 'ENABLE',
});
const transForm = reactive({});
const rules = {
    name: [{ required: true, message: 'Please enter name', trigger: 'blur' }],
    status: [{ required: true, message: 'Please select status', trigger: 'change' }],
};
function getCategoryName(id) {
    const c = tableData.value.find((i) => i.id === id) || parentOptions.value.find((i) => i.id === id);
    return c ? c.name : '';
}
async function loadParentOptions() {
    try {
        const { data: res } = await categoryApi.getCategories({
            page: 1,
            pageSize: 999,
            status: 'ENABLE',
        });
        if (res.code === 200)
            parentOptions.value = res.data.list || [];
    }
    catch {
        /* ignore */
    }
}
async function loadLanguageOptions() {
    try {
        const { data: res } = await i18nApi.getLanguages({ status: 'ENABLE', page: 1, pageSize: 500 });
        if (res.code === 200) {
            languageOptions.value = res.data?.list || [];
            languageOptions.value.forEach((language) => {
                if (!(language.code in transForm))
                    transForm[language.code] = '';
            });
        }
    }
    catch {
        languageOptions.value = [];
    }
}
async function fetchData() {
    loading.value = true;
    try {
        const { data: res } = await categoryApi.getCategories({
            keyword: searchForm.keyword || undefined,
            status: searchForm.status || undefined,
            page: searchForm.page,
            pageSize: searchForm.pageSize,
        });
        if (res.code === 200) {
            tableData.value = res.data.list;
            total.value = res.data.total;
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
function handleCreate() {
    isEdit.value = false;
    editingId.value = null;
    Object.assign(form, { name: '', parentId: null, icon: '', sort: 0, status: 'ENABLE' });
    dialogVisible.value = true;
}
function handleEdit(row) {
    isEdit.value = true;
    editingId.value = row.id;
    Object.assign(form, {
        name: row.name,
        parentId: row.parentId,
        icon: row.icon,
        sort: row.sort,
        status: row.status,
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
        const payload = { ...form };
        if (isEdit.value && editingId.value) {
            const { data: res } = await categoryApi.updateCategory(editingId.value, payload);
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
            const { data: res } = await categoryApi.createCategory(payload);
            if (res.code === 200) {
                ElMessage.success('新增成功');
                dialogVisible.value = false;
                fetchData();
            }
            else {
                ElMessage.error(res.message || '创建失败');
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
        const { data: res } = await categoryApi.updateCategoryStatus(row.id, newStatus);
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
        const { data: res } = await categoryApi.deleteCategory(row.id);
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
function handleOpenTranslations(row) {
    transEditingId.value = row.id;
    languageOptions.value.forEach((language) => {
        const translation = row.translations?.find((t) => t.languageCode === language.code);
        transForm[language.code] = translation?.name || '';
    });
    transDialogVisible.value = true;
}
async function handleSaveTranslations() {
    if (!transEditingId.value)
        return;
    transLoading.value = true;
    try {
        const payload = languageOptions.value
            .map((language) => ({ languageCode: language.code, name: transForm[language.code] || '' }))
            .filter((item) => item.name.trim());
        const { data: res } = await categoryApi.saveTranslations(transEditingId.value, payload);
        if (res.code === 200) {
            ElMessage.success('翻译已保存');
            transDialogVisible.value = false;
            fetchData();
        }
        else {
            ElMessage.error(res.message || '保存失败');
        }
    }
    catch {
        ElMessage.error('保存失败');
    }
    finally {
        transLoading.value = false;
    }
}
function resetForm() {
    formRef.value?.resetFields();
}
function resetTransForm() {
    transFormRef.value?.resetFields();
}
async function handleIconUpload(options) {
    uploading.value = true;
    try {
        const { data: res } = await uploadApi.postImage(options.file, 'category');
        if (res.code === 200) {
            const url = res.data?.url || res.data;
            form.icon = url;
            ElMessage.success('上传成功');
        }
        else {
            ElMessage.error(res.message || '上传失败');
        }
    }
    catch {
        ElMessage.error('上传失败');
    }
    finally {
        uploading.value = false;
    }
}
onMounted(async () => {
    await Promise.all([loadParentOptions(), loadLanguageOptions()]);
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
    ...{ class: "product-page" },
});
/** @type {__VLS_StyleScopedClasses['product-page']} */ ;
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
    type: "primary",
}));
const __VLS_65 = __VLS_64({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
let __VLS_68;
const __VLS_69 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleCreate),
};
__VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:category:add') }, null, null);
const { default: __VLS_70 } = __VLS_66.slots;
// @ts-ignore
[handleCreate, vPermission,];
var __VLS_66;
var __VLS_67;
// @ts-ignore
[];
var __VLS_60;
// @ts-ignore
[];
var __VLS_3;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}));
const __VLS_73 = __VLS_72({
    data: (__VLS_ctx.tableData),
    border: true,
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    prop: "icon",
    label: "图标",
    width: "80",
    align: "center",
}));
const __VLS_79 = __VLS_78({
    prop: "icon",
    label: "图标",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    prop: "name",
    label: "名称",
    minWidth: "160",
    showOverflowTooltip: true,
}));
const __VLS_84 = __VLS_83({
    prop: "name",
    label: "名称",
    minWidth: "160",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    label: "上级",
    width: "120",
    align: "center",
}));
const __VLS_89 = __VLS_88({
    label: "上级",
    width: "120",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
const { default: __VLS_92 } = __VLS_90.slots;
{
    const { default: __VLS_93 } = __VLS_90.slots;
    const [{ row }] = __VLS_vSlot(__VLS_93);
    (row.parentId ? __VLS_ctx.getCategoryName(row.parentId) : '-');
    // @ts-ignore
    [tableData, vLoading, loading, getCategoryName,];
}
// @ts-ignore
[];
var __VLS_90;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}));
const __VLS_96 = __VLS_95({
    prop: "status",
    label: "状态",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
{
    const { default: __VLS_100 } = __VLS_97.slots;
    const [{ row }] = __VLS_vSlot(__VLS_100);
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }));
    const __VLS_103 = __VLS_102({
        type: (row.status === 'ENABLE' ? 'success' : 'danger'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    const { default: __VLS_106 } = __VLS_104.slots;
    (row.status === 'ENABLE' ? '已启用' : '已禁用');
    // @ts-ignore
    [];
    var __VLS_104;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_97;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}));
const __VLS_109 = __VLS_108({
    prop: "sort",
    label: "排序",
    width: "70",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_114 = __VLS_113({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    label: "操作",
    width: "280",
    fixed: "right",
}));
const __VLS_119 = __VLS_118({
    label: "操作",
    width: "280",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
const { default: __VLS_122 } = __VLS_120.slots;
{
    const { default: __VLS_123 } = __VLS_120.slots;
    const [{ row }] = __VLS_vSlot(__VLS_123);
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_126 = __VLS_125({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_129;
    const __VLS_130 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
            // @ts-ignore
            [handleEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:category:edit') }, null, null);
    const { default: __VLS_131 } = __VLS_127.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_127;
    var __VLS_128;
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }));
    const __VLS_134 = __VLS_133({
        ...{ 'onClick': {} },
        link: true,
        type: (row.status === 'ENABLE' ? 'warning' : 'success'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    let __VLS_137;
    const __VLS_138 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [handleToggleStatus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:category:edit') }, null, null);
    const { default: __VLS_139 } = __VLS_135.slots;
    (row.status === 'ENABLE' ? '禁用' : '启用');
    // @ts-ignore
    [vPermission,];
    var __VLS_135;
    var __VLS_136;
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }));
    const __VLS_142 = __VLS_141({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_145;
    const __VLS_146 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.handleOpenTranslations(row);
            // @ts-ignore
            [handleOpenTranslations,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:category:edit') }, null, null);
    const { default: __VLS_147 } = __VLS_143.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_143;
    var __VLS_144;
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onConfirm': {} },
        title: "确定要删除吗？",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_153;
    const __VLS_154 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [handleDelete,];
        },
    };
    const { default: __VLS_155 } = __VLS_151.slots;
    {
        const { reference: __VLS_156 } = __VLS_151.slots;
        let __VLS_157;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
            link: true,
            type: "danger",
        }));
        const __VLS_159 = __VLS_158({
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ('product:category:delete') }, null, null);
        const { default: __VLS_162 } = __VLS_160.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_160;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_151;
    var __VLS_152;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_120;
// @ts-ignore
[];
var __VLS_74;
let __VLS_163;
/** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
elPagination;
// @ts-ignore
const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}));
const __VLS_165 = __VLS_164({
    ...{ 'onChange': {} },
    currentPage: (__VLS_ctx.searchForm.page),
    pageSize: (__VLS_ctx.searchForm.pageSize),
    total: (__VLS_ctx.total),
    pageSizes: ([10, 20, 50, 100]),
    layout: "total, sizes, prev, pager, next",
}, ...__VLS_functionalComponentArgsRest(__VLS_164));
let __VLS_168;
const __VLS_169 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.fetchData),
};
var __VLS_166;
var __VLS_167;
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑分类' : '新增分类'),
    width: "650px",
}));
const __VLS_172 = __VLS_171({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.isEdit ? '编辑分类' : '新增分类'),
    width: "650px",
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
let __VLS_175;
const __VLS_176 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetForm),
};
const { default: __VLS_177 } = __VLS_173.slots;
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "130px",
}));
const __VLS_180 = __VLS_179({
    ref: "formRef",
    model: (__VLS_ctx.form),
    rules: (__VLS_ctx.rules),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
var __VLS_183;
const { default: __VLS_185 } = __VLS_181.slots;
let __VLS_186;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    label: "名称",
    prop: "name",
}));
const __VLS_188 = __VLS_187({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
const { default: __VLS_191 } = __VLS_189.slots;
let __VLS_192;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "分类名称",
}));
const __VLS_194 = __VLS_193({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "分类名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
// @ts-ignore
[searchForm, searchForm, total, fetchData, dialogVisible, isEdit, resetForm, form, form, rules,];
var __VLS_189;
let __VLS_197;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
    label: "上级",
    prop: "parentId",
}));
const __VLS_199 = __VLS_198({
    label: "上级",
    prop: "parentId",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
const { default: __VLS_202 } = __VLS_200.slots;
let __VLS_203;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
    modelValue: (__VLS_ctx.form.parentId),
    placeholder: "上级分类（选填）",
    filterable: true,
    clearable: true,
    ...{ style: {} },
}));
const __VLS_205 = __VLS_204({
    modelValue: (__VLS_ctx.form.parentId),
    placeholder: "上级分类（选填）",
    filterable: true,
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_204));
const { default: __VLS_208 } = __VLS_206.slots;
for (const [c] of __VLS_vFor((__VLS_ctx.parentOptions))) {
    let __VLS_209;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }));
    const __VLS_211 = __VLS_210({
        key: (c.id),
        label: (c.name),
        value: (c.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_210));
    // @ts-ignore
    [form, parentOptions,];
}
// @ts-ignore
[];
var __VLS_206;
// @ts-ignore
[];
var __VLS_200;
let __VLS_214;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    label: "图标",
    prop: "icon",
}));
const __VLS_216 = __VLS_215({
    label: "图标",
    prop: "icon",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
const { default: __VLS_219 } = __VLS_217.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "upload-wrap" },
});
/** @type {__VLS_StyleScopedClasses['upload-wrap']} */ ;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    modelValue: (__VLS_ctx.form.icon),
    placeholder: "图标 emoji 或图片地址",
    ...{ class: "input-with-upload" },
}));
const __VLS_222 = __VLS_221({
    modelValue: (__VLS_ctx.form.icon),
    placeholder: "图标 emoji 或图片地址",
    ...{ class: "input-with-upload" },
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
/** @type {__VLS_StyleScopedClasses['input-with-upload']} */ ;
let __VLS_225;
/** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
elUpload;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleIconUpload),
    accept: "image/*",
}));
const __VLS_227 = __VLS_226({
    showFileList: (false),
    httpRequest: (__VLS_ctx.handleIconUpload),
    accept: "image/*",
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
const { default: __VLS_230 } = __VLS_228.slots;
let __VLS_231;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
    type: "primary",
    loading: (__VLS_ctx.uploading),
}));
const __VLS_233 = __VLS_232({
    type: "primary",
    loading: (__VLS_ctx.uploading),
}, ...__VLS_functionalComponentArgsRest(__VLS_232));
const { default: __VLS_236 } = __VLS_234.slots;
// @ts-ignore
[form, handleIconUpload, uploading,];
var __VLS_234;
// @ts-ignore
[];
var __VLS_228;
if (__VLS_ctx.form.icon && __VLS_ctx.form.icon.startsWith('http')) {
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
    elImage;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        src: (__VLS_ctx.form.icon),
        ...{ style: {} },
        fit: "cover",
    }));
    const __VLS_239 = __VLS_238({
        src: (__VLS_ctx.form.icon),
        ...{ style: {} },
        fit: "cover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
}
// @ts-ignore
[form, form, form,];
var __VLS_217;
let __VLS_242;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
    label: "排序",
    prop: "sort",
}));
const __VLS_244 = __VLS_243({
    label: "排序",
    prop: "sort",
}, ...__VLS_functionalComponentArgsRest(__VLS_243));
const { default: __VLS_247 } = __VLS_245.slots;
let __VLS_248;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_250 = __VLS_249({
    modelValue: (__VLS_ctx.form.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
// @ts-ignore
[form,];
var __VLS_245;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    label: "状态",
    prop: "status",
}));
const __VLS_255 = __VLS_254({
    label: "状态",
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
const { default: __VLS_258 } = __VLS_256.slots;
let __VLS_259;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_260 = __VLS_asFunctionalComponent1(__VLS_259, new __VLS_259({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "状态",
    ...{ style: {} },
}));
const __VLS_261 = __VLS_260({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_260));
const { default: __VLS_264 } = __VLS_262.slots;
let __VLS_265;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
    label: "已启用",
    value: "ENABLE",
}));
const __VLS_267 = __VLS_266({
    label: "已启用",
    value: "ENABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
let __VLS_270;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
    label: "已禁用",
    value: "DISABLE",
}));
const __VLS_272 = __VLS_271({
    label: "已禁用",
    value: "DISABLE",
}, ...__VLS_functionalComponentArgsRest(__VLS_271));
// @ts-ignore
[form,];
var __VLS_262;
// @ts-ignore
[];
var __VLS_256;
// @ts-ignore
[];
var __VLS_181;
{
    const { footer: __VLS_275 } = __VLS_173.slots;
    let __VLS_276;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
        ...{ 'onClick': {} },
    }));
    const __VLS_278 = __VLS_277({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    let __VLS_281;
    const __VLS_282 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_283 } = __VLS_279.slots;
    // @ts-ignore
    [];
    var __VLS_279;
    var __VLS_280;
    let __VLS_284;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_286 = __VLS_285({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    let __VLS_289;
    const __VLS_290 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_291 } = __VLS_287.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_287;
    var __VLS_288;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_173;
var __VLS_174;
let __VLS_292;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.transDialogVisible),
    title: "分类翻译",
    width: "550px",
}));
const __VLS_294 = __VLS_293({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.transDialogVisible),
    title: "分类翻译",
    width: "550px",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
let __VLS_297;
const __VLS_298 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.resetTransForm),
};
const { default: __VLS_299 } = __VLS_295.slots;
let __VLS_300;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
    ref: "transFormRef",
    model: (__VLS_ctx.transForm),
    labelWidth: "150px",
}));
const __VLS_302 = __VLS_301({
    ref: "transFormRef",
    model: (__VLS_ctx.transForm),
    labelWidth: "150px",
}, ...__VLS_functionalComponentArgsRest(__VLS_301));
var __VLS_305;
const { default: __VLS_307 } = __VLS_303.slots;
for (const [language] of __VLS_vFor((__VLS_ctx.languageOptions))) {
    let __VLS_308;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent1(__VLS_308, new __VLS_308({
        key: (language.code),
        label: (`${language.name || language.nativeName}（${language.code}）`),
    }));
    const __VLS_310 = __VLS_309({
        key: (language.code),
        label: (`${language.name || language.nativeName}（${language.code}）`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    const { default: __VLS_313 } = __VLS_311.slots;
    let __VLS_314;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_315 = __VLS_asFunctionalComponent1(__VLS_314, new __VLS_314({
        modelValue: (__VLS_ctx.transForm[language.code]),
        placeholder: (`请输入${language.name || language.code}名称`),
    }));
    const __VLS_316 = __VLS_315({
        modelValue: (__VLS_ctx.transForm[language.code]),
        placeholder: (`请输入${language.name || language.code}名称`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_315));
    // @ts-ignore
    [transDialogVisible, resetTransForm, transForm, transForm, languageOptions,];
    var __VLS_311;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_303;
{
    const { footer: __VLS_319 } = __VLS_295.slots;
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
            __VLS_ctx.transDialogVisible = false;
            // @ts-ignore
            [transDialogVisible,];
        },
    };
    const { default: __VLS_327 } = __VLS_323.slots;
    // @ts-ignore
    [];
    var __VLS_323;
    var __VLS_324;
    let __VLS_328;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.transLoading),
    }));
    const __VLS_330 = __VLS_329({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.transLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    let __VLS_333;
    const __VLS_334 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSaveTranslations),
    };
    const { default: __VLS_335 } = __VLS_331.slots;
    // @ts-ignore
    [transLoading, handleSaveTranslations,];
    var __VLS_331;
    var __VLS_332;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_295;
var __VLS_296;
// @ts-ignore
var __VLS_184 = __VLS_183, __VLS_306 = __VLS_305;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
