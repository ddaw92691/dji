/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { menuApi, menuPage } from '@/api/menu';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'MenuTreeView' });
const menuStore = useMenuStore();
const basePageRef = useTemplateRef({});
const formRef = useTemplateRef('formRef');
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const parentOptions = ref([]);
const editForm = reactive({
    id: '',
    parentId: null,
    appType: 'ADMIN',
    type: 'MENU',
    title: '',
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 0,
    visible: true,
    status: 'ENABLE',
});
const formRules = {
    appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
    type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
};
const searchFormConfig = ref([
    { label: '标题', prop: 'title', type: 'elInput', attrs: { placeholder: '搜索标题', clearable: true } },
    { label: '路径', prop: 'path', type: 'elInput', attrs: { placeholder: '搜索路径', clearable: true } },
    {
        label: '应用类型', prop: 'appType', type: 'elSelect', attrs: {
            placeholder: '请选择',
            options: [{ label: '总后台', value: 'ADMIN' }, { label: '商家后台', value: 'MERCHANT' }],
            clearable: true,
        },
    },
    {
        label: '类型', prop: 'type', type: 'elSelect', attrs: {
            placeholder: '请选择',
            options: [{ label: '目录', value: 'DIRECTORY' }, { label: '菜单', value: 'MENU' }, { label: '按钮', value: 'BUTTON' }],
            clearable: true,
        },
    },
    { label: '状态', prop: 'status', type: 'elSelect', attrs: { placeholder: '请选择', options: STATUS_OPTIONS, clearable: true } },
]);
const columns = ref([
    { prop: 'title', label: '标题', minWidth: 200 },
    { prop: 'type', label: '类型', width: 100 },
    { prop: 'path', label: '路径', minWidth: 200 },
    { prop: 'icon', label: '图标', width: 80 },
    { prop: 'permission', label: '权限标识', minWidth: 150 },
    { prop: 'visible', label: '显示', width: 80 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'sort', label: '排序', width: 70 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 150, fixed: 'right' },
]);
const fetchData = async (queryForm) => {
    loading.value = true;
    try {
        const { data: res } = await menuPage(queryForm);
        if (res.code === 200) {
            tableData.value = res.data || [];
            parentOptions.value = res.data || [];
        }
    }
    catch { /* ignore */ }
    finally {
        loading.value = false;
    }
};
const resetForm = () => {
    editForm.id = '';
    editForm.parentId = null;
    editForm.appType = 'ADMIN';
    editForm.type = 'MENU';
    editForm.title = '';
    editForm.path = '';
    editForm.component = '';
    editForm.icon = '';
    editForm.permission = '';
    editForm.sort = 0;
    editForm.visible = true;
    editForm.status = 'ENABLE';
    formRef.value?.resetFields();
};
const onTypeChange = (val) => {
    if (val === 'BUTTON') {
        editForm.path = '';
        editForm.component = '';
        editForm.icon = '';
    }
};
const openCreate = () => { resetForm(); dialogVisible.value = true; };
const openEdit = (row) => {
    Object.assign(editForm, {
        id: row.id, parentId: row.parentId ?? null, appType: row.appType || 'ADMIN', type: row.type || 'MENU',
        title: row.title, path: row.path || '', component: row.component || '', icon: row.icon || '',
        permission: row.permission || '', sort: row.sort ?? 0, visible: row.visible !== false, status: row.status || 'ENABLE',
    });
    dialogVisible.value = true;
};
const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const payload = {
            parentId: editForm.parentId, appType: editForm.appType, type: editForm.type,
            title: editForm.title, path: editForm.path || undefined, component: editForm.component || undefined,
            icon: editForm.icon || undefined, permission: editForm.permission || undefined,
            sort: editForm.sort, visible: editForm.visible, status: editForm.status,
        };
        const { data: res } = editForm.id
            ? await menuApi.updateMenu(editForm.id, payload)
            : await menuApi.createMenu(payload);
        if (res.code === 200) {
            ElMessage.success(editForm.id ? '菜单已更新' : '菜单已创建');
            dialogVisible.value = false;
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '操作失败');
        }
    }
    catch {
        ElMessage.error('操作失败');
    }
    finally {
        submitLoading.value = false;
    }
};
const handleDelete = async (id) => {
    try {
        const { data: res } = await menuApi.deleteMenu(id);
        if (res.code === 200) {
            ElMessage.success('菜单已删除');
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BasePage | typeof __VLS_components.BasePage} */
BasePage;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onRefresh': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    showPagination: (false),
    showExport: (false),
    showPrint: (false),
    tableLoading: (__VLS_ctx.loading),
    tableAttrs: ({ rowKey: 'id', defaultExpandAll: true, treeProps: { children: 'children', hasChildren: 'hasChildren' } }),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onRefresh': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    showPagination: (false),
    showExport: (false),
    showPrint: (false),
    tableLoading: (__VLS_ctx.loading),
    tableAttrs: ({ rowKey: 'id', defaultExpandAll: true, treeProps: { children: 'children', hasChildren: 'hasChildren' } }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.fetchData),
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
{
    const { tableOperationLeft: __VLS_10 } = __VLS_3.slots;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Plus),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        type: "primary",
        icon: (__VLS_ctx.menuStore.iconComponents.Plus),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.openCreate),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:menu:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, loading, fetchData, menuStore, openCreate, vPermission,];
    var __VLS_14;
    var __VLS_15;
    // @ts-ignore
    [];
}
{
    const { type: __VLS_19 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_19);
    if (row.type === 'DIRECTORY') {
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            type: "info",
            text: "目录",
        }));
        const __VLS_22 = __VLS_21({
            type: "info",
            text: "目录",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    }
    else if (row.type === 'MENU') {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            type: "primary",
            text: "菜单",
        }));
        const __VLS_27 = __VLS_26({
            type: "primary",
            text: "菜单",
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    }
    else if (row.type === 'BUTTON') {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            type: "warning",
            text: "按钮",
        }));
        const __VLS_32 = __VLS_31({
            type: "warning",
            text: "按钮",
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.type);
    }
    // @ts-ignore
    [];
}
{
    const { icon: __VLS_35 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_35);
    if (row.icon && __VLS_ctx.menuStore.iconComponents[row.icon]) {
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
        const { default: __VLS_41 } = __VLS_39.slots;
        const __VLS_42 = (__VLS_ctx.menuStore.iconComponents[row.icon]);
        // @ts-ignore
        const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({}));
        const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
        // @ts-ignore
        [menuStore, menuStore,];
        var __VLS_39;
    }
    // @ts-ignore
    [];
}
{
    const { status: __VLS_47 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_47);
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }));
    const __VLS_50 = __VLS_49({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    // @ts-ignore
    [getColorByValue, STATUS_OPTIONS, STATUS_OPTIONS, getLabelByValue,];
}
{
    const { visible: __VLS_53 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_53);
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        type: (row.visible !== false ? 'success' : 'info'),
        text: (row.visible !== false ? '显示' : '隐藏'),
    }));
    const __VLS_56 = __VLS_55({
        type: (row.visible !== false ? 'success' : 'info'),
        text: (row.visible !== false ? '显示' : '隐藏'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    // @ts-ignore
    [];
}
{
    const { operation: __VLS_59 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_59);
    let __VLS_60;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_65;
    const __VLS_66 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:menu:edit']) }, null, null);
    const { default: __VLS_67 } = __VLS_63.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_63;
    var __VLS_64;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ 'onConfirm': {} },
        title: "确定要删除该菜单吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onConfirm': {} },
        title: "确定要删除该菜单吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    const __VLS_74 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row.id);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleDelete,];
        },
    };
    const { default: __VLS_75 } = __VLS_71.slots;
    {
        const { reference: __VLS_76 } = __VLS_71.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            type: "danger",
            link: true,
        }));
        const __VLS_79 = __VLS_78({
            type: "danger",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:menu:delete']) }, null, null);
        const { default: __VLS_82 } = __VLS_80.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_80;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_71;
    var __VLS_72;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑菜单' : '新增菜单'),
    width: "600",
}));
const __VLS_85 = __VLS_84({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑菜单' : '新增菜单'),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
        // @ts-ignore
        [dialogVisible, dialogVisible, editForm,];
    },
};
const { default: __VLS_90 } = __VLS_86.slots;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_93 = __VLS_92({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
var __VLS_96;
const { default: __VLS_98 } = __VLS_94.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    label: "上级",
}));
const __VLS_101 = __VLS_100({
    label: "上级",
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
const { default: __VLS_104 } = __VLS_102.slots;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elTreeSelect | typeof __VLS_components.ElTreeSelect | typeof __VLS_components['el-tree-select']} */
elTreeSelect;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    modelValue: (__VLS_ctx.editForm.parentId),
    data: (__VLS_ctx.parentOptions),
    props: ({ children: 'children', label: 'title', value: 'id' }),
    checkStrictly: true,
    clearable: true,
    placeholder: "选择上级（留空为顶级）",
    ...{ style: {} },
}));
const __VLS_107 = __VLS_106({
    modelValue: (__VLS_ctx.editForm.parentId),
    data: (__VLS_ctx.parentOptions),
    props: ({ children: 'children', label: 'title', value: 'id' }),
    checkStrictly: true,
    clearable: true,
    placeholder: "选择上级（留空为顶级）",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
// @ts-ignore
[editForm, editForm, formRules, parentOptions,];
var __VLS_102;
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    label: "应用类型",
    prop: "appType",
}));
const __VLS_112 = __VLS_111({
    label: "应用类型",
    prop: "appType",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
const { default: __VLS_115 } = __VLS_113.slots;
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    modelValue: (__VLS_ctx.editForm.appType),
    ...{ style: {} },
}));
const __VLS_118 = __VLS_117({
    modelValue: (__VLS_ctx.editForm.appType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    label: "ADMIN",
    value: "ADMIN",
}));
const __VLS_124 = __VLS_123({
    label: "ADMIN",
    value: "ADMIN",
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    label: "MERCHANT",
    value: "MERCHANT",
}));
const __VLS_129 = __VLS_128({
    label: "MERCHANT",
    value: "MERCHANT",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
// @ts-ignore
[editForm,];
var __VLS_119;
// @ts-ignore
[];
var __VLS_113;
let __VLS_132;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    label: "类型",
    prop: "type",
}));
const __VLS_134 = __VLS_133({
    label: "类型",
    prop: "type",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
const { default: __VLS_137 } = __VLS_135.slots;
let __VLS_138;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.editForm.type),
    ...{ style: {} },
}));
const __VLS_140 = __VLS_139({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.editForm.type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_139));
let __VLS_143;
const __VLS_144 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.onTypeChange),
};
const { default: __VLS_145 } = __VLS_141.slots;
let __VLS_146;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
    label: "目录",
    value: "DIRECTORY",
}));
const __VLS_148 = __VLS_147({
    label: "目录",
    value: "DIRECTORY",
}, ...__VLS_functionalComponentArgsRest(__VLS_147));
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    label: "菜单",
    value: "MENU",
}));
const __VLS_153 = __VLS_152({
    label: "菜单",
    value: "MENU",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
let __VLS_156;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
    label: "按钮",
    value: "BUTTON",
}));
const __VLS_158 = __VLS_157({
    label: "按钮",
    value: "BUTTON",
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
// @ts-ignore
[editForm, onTypeChange,];
var __VLS_141;
var __VLS_142;
// @ts-ignore
[];
var __VLS_135;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    label: "标题",
    prop: "title",
}));
const __VLS_163 = __VLS_162({
    label: "标题",
    prop: "title",
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const { default: __VLS_166 } = __VLS_164.slots;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    modelValue: (__VLS_ctx.editForm.title),
}));
const __VLS_169 = __VLS_168({
    modelValue: (__VLS_ctx.editForm.title),
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
// @ts-ignore
[editForm,];
var __VLS_164;
if (__VLS_ctx.editForm.type !== 'BUTTON') {
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        label: "路径",
    }));
    const __VLS_174 = __VLS_173({
        label: "路径",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    const { default: __VLS_177 } = __VLS_175.slots;
    let __VLS_178;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
        modelValue: (__VLS_ctx.editForm.path),
    }));
    const __VLS_180 = __VLS_179({
        modelValue: (__VLS_ctx.editForm.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_179));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_175;
}
if (__VLS_ctx.editForm.type === 'MENU') {
    let __VLS_183;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
        label: "组件",
    }));
    const __VLS_185 = __VLS_184({
        label: "组件",
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    const { default: __VLS_188 } = __VLS_186.slots;
    let __VLS_189;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_190 = __VLS_asFunctionalComponent1(__VLS_189, new __VLS_189({
        modelValue: (__VLS_ctx.editForm.component),
        placeholder: "e.g. user/customer/index",
    }));
    const __VLS_191 = __VLS_190({
        modelValue: (__VLS_ctx.editForm.component),
        placeholder: "e.g. user/customer/index",
    }, ...__VLS_functionalComponentArgsRest(__VLS_190));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_186;
}
if (__VLS_ctx.editForm.type !== 'BUTTON') {
    let __VLS_194;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
        label: "图标",
    }));
    const __VLS_196 = __VLS_195({
        label: "图标",
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    const { default: __VLS_199 } = __VLS_197.slots;
    let __VLS_200;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        modelValue: (__VLS_ctx.editForm.icon),
        placeholder: "图标名称",
    }));
    const __VLS_202 = __VLS_201({
        modelValue: (__VLS_ctx.editForm.icon),
        placeholder: "图标名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_197;
}
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    label: "权限",
}));
const __VLS_207 = __VLS_206({
    label: "权限",
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
let __VLS_211;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
    modelValue: (__VLS_ctx.editForm.permission),
    placeholder: "e.g. customer:view",
}));
const __VLS_213 = __VLS_212({
    modelValue: (__VLS_ctx.editForm.permission),
    placeholder: "e.g. customer:view",
}, ...__VLS_functionalComponentArgsRest(__VLS_212));
// @ts-ignore
[editForm,];
var __VLS_208;
let __VLS_216;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
    label: "排序",
}));
const __VLS_218 = __VLS_217({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_217));
const { default: __VLS_221 } = __VLS_219.slots;
let __VLS_222;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
    modelValue: (__VLS_ctx.editForm.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_224 = __VLS_223({
    modelValue: (__VLS_ctx.editForm.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
// @ts-ignore
[editForm,];
var __VLS_219;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    label: "显示",
}));
const __VLS_229 = __VLS_228({
    label: "显示",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
const { default: __VLS_232 } = __VLS_230.slots;
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    modelValue: (__VLS_ctx.editForm.visible),
}));
const __VLS_235 = __VLS_234({
    modelValue: (__VLS_ctx.editForm.visible),
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
const { default: __VLS_238 } = __VLS_236.slots;
let __VLS_239;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
    value: (true),
}));
const __VLS_241 = __VLS_240({
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
const { default: __VLS_244 } = __VLS_242.slots;
// @ts-ignore
[editForm,];
var __VLS_242;
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    value: (false),
}));
const __VLS_247 = __VLS_246({
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
const { default: __VLS_250 } = __VLS_248.slots;
// @ts-ignore
[];
var __VLS_248;
// @ts-ignore
[];
var __VLS_236;
// @ts-ignore
[];
var __VLS_230;
let __VLS_251;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_252 = __VLS_asFunctionalComponent1(__VLS_251, new __VLS_251({
    label: "状态",
}));
const __VLS_253 = __VLS_252({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_252));
const { default: __VLS_256 } = __VLS_254.slots;
let __VLS_257;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
    modelValue: (__VLS_ctx.editForm.status),
}));
const __VLS_259 = __VLS_258({
    modelValue: (__VLS_ctx.editForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
const { default: __VLS_262 } = __VLS_260.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.STATUS_OPTIONS))) {
    let __VLS_263;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
        key: (item.value),
        value: (item.value),
    }));
    const __VLS_265 = __VLS_264({
        key: (item.value),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_264));
    const { default: __VLS_268 } = __VLS_266.slots;
    (item.label);
    // @ts-ignore
    [STATUS_OPTIONS, editForm,];
    var __VLS_266;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_260;
// @ts-ignore
[];
var __VLS_254;
// @ts-ignore
[];
var __VLS_94;
{
    const { footer: __VLS_269 } = __VLS_86.slots;
    let __VLS_270;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
        ...{ 'onClick': {} },
    }));
    const __VLS_272 = __VLS_271({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_271));
    let __VLS_275;
    const __VLS_276 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_277 } = __VLS_273.slots;
    // @ts-ignore
    [];
    var __VLS_273;
    var __VLS_274;
    let __VLS_278;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_280 = __VLS_279({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    let __VLS_283;
    const __VLS_284 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_285 } = __VLS_281.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_281;
    var __VLS_282;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_86;
var __VLS_87;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_97 = __VLS_96;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
