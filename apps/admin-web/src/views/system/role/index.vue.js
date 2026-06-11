/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { roleApi, rolePage } from '@/api/role';
import { menuPage } from '@/api/menu';
import { Dialog } from '@/utils/dialog';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'RoleListView' });
const menuStore = useMenuStore();
const basePageRef = useTemplateRef({});
const formRef = useTemplateRef('formRef');
const menuTreeRef = useTemplateRef('menuTreeRef');
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref([]);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const menuVisible = ref(false);
const menuSubmitLoading = ref(false);
const menuTreeData = ref([]);
const checkedMenuIds = ref([]);
const currentRoleId = ref('');
const editForm = reactive({
    id: '',
    code: '',
    name: '',
    description: '',
    sort: 0,
    status: 'ENABLE',
});
const formRules = {
    code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
};
const searchFormConfig = ref([
    { label: '编码', prop: 'code', type: 'elInput', attrs: { placeholder: '搜索角色编码', clearable: true } },
    { label: '名称', prop: 'name', type: 'elInput', attrs: { placeholder: '搜索角色名称', clearable: true } },
    { label: '状态', prop: 'status', type: 'elSelect', attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true } },
]);
const columns = ref([
    { type: 'selection', width: 55 },
    { type: 'index', label: '序号', width: 55, fixed: 'left' },
    { prop: 'code', label: '角色编码', minWidth: 160 },
    { prop: 'name', label: '角色名称', minWidth: 160 },
    { prop: 'sort', label: '排序', width: 80 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
]);
const onSelectionChange = (rows) => {
    selectedIds.value = rows.map((r) => r.id);
};
const fetchData = async (queryForm, page, pageSize, sortField, sortOrder) => {
    loading.value = true;
    try {
        const normalizedSortOrder = sortOrder === 'asc' || sortOrder === 'desc' || sortOrder === '' ? sortOrder : undefined;
        const { data: res } = await rolePage({ ...queryForm, page, pageSize, sortOrder: normalizedSortOrder });
        if (res.code === 200) {
            const payload = res.data;
            const fullList = Array.isArray(payload) ? payload : payload?.list || [];
            const code = String(queryForm.code || '').trim().toLowerCase();
            const name = String(queryForm.name || '').trim().toLowerCase();
            const status = String(queryForm.status || '').trim();
            const filtered = fullList.filter((role) => {
                if (code && !String(role.code || '').toLowerCase().includes(code))
                    return false;
                if (name && !String(role.name || '').toLowerCase().includes(name))
                    return false;
                if (status && role.status !== status)
                    return false;
                return true;
            });
            total.value = Array.isArray(payload) ? filtered.length : payload?.total || filtered.length;
            tableData.value = Array.isArray(payload) ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered;
        }
    }
    catch { /* ignore */ }
    finally {
        loading.value = false;
    }
};
const resetForm = () => {
    editForm.id = '';
    editForm.code = '';
    editForm.name = '';
    editForm.description = '';
    editForm.sort = 0;
    editForm.status = 'ENABLE';
    formRef.value?.resetFields();
};
const openCreate = () => { resetForm(); dialogVisible.value = true; };
const openEdit = async (row) => {
    try {
        const { data: res } = await roleApi.getRoleDetail(row.id);
        if (res.code === 200) {
            const d = res.data || row;
            editForm.id = d.id || row.id;
            editForm.code = d.code || row.code;
            editForm.name = d.name || row.name;
            editForm.description = d.description || row.description || '';
            editForm.sort = d.sort ?? row.sort ?? 0;
            editForm.status = d.status || row.status;
            dialogVisible.value = true;
        }
    }
    catch {
        Object.assign(editForm, { id: row.id, code: row.code, name: row.name, description: row.description || '', sort: row.sort ?? 0, status: row.status });
        dialogVisible.value = true;
    }
};
const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const payload = { code: editForm.code, name: editForm.name, description: editForm.description, sort: editForm.sort, status: editForm.status };
        const { data: res } = editForm.id ? await roleApi.updateRole(editForm.id, payload) : await roleApi.createRole(payload);
        if (res.code === 200) {
            ElMessage.success(editForm.id ? '角色已更新' : '角色已创建');
            dialogVisible.value = false;
            editForm.id ? basePageRef.value?.refreshCurrentPage() : basePageRef.value?.refreshToFirstPage();
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
const handleToggleStatus = async (row) => {
    const status = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    try {
        const { data: res } = await roleApi.updateRoleStatus(row.id, status);
        if (res.code === 200) {
            ElMessage.success('状态已更新');
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '状态更新失败');
        }
    }
    catch {
        ElMessage.error('状态更新失败');
    }
};
const handleDelete = async (id) => {
    try {
        const { data: res } = await roleApi.deleteRole(id);
        if (res.code === 200) {
            ElMessage.success('角色已删除');
            basePageRef.value?.refreshAfterDelete(1);
        }
        else {
            ElMessage.error(res.message || '删除失败');
        }
    }
    catch {
        ElMessage.error('删除失败');
    }
};
const batchDelete = () => {
    Dialog.confirm({
        title: '删除角色',
        content: `确定要删除选中的 ${selectedIds.value.length} 个角色吗？`,
        confirmText: '删除',
        cancelText: '取消',
        onConfirm: async () => {
            const responses = await Promise.all(selectedIds.value.map((id) => roleApi.deleteRole(id)));
            const failed = responses.find(({ data }) => data.code !== 200);
            if (!failed) {
                ElMessage.success('角色已删除');
                basePageRef.value?.refreshAfterDelete(selectedIds.value.length);
            }
            else {
                ElMessage.error(failed.data.message || '删除失败');
            }
        },
    });
};
const openAssignMenus = async (row) => {
    currentRoleId.value = row.id;
    try {
        const [{ data: menuRes }, { data: roleMenuRes }] = await Promise.all([
            menuPage(),
            roleApi.getRoleMenus(row.id),
        ]);
        menuTreeData.value = menuRes.code === 200 ? menuRes.data || [] : [];
        checkedMenuIds.value = roleMenuRes.code === 200 ? (roleMenuRes.data || []).map((id) => String(id)) : [];
    }
    catch {
        menuTreeData.value = [];
        checkedMenuIds.value = [];
    }
    menuVisible.value = true;
};
const handleAssignMenus = async () => {
    const checkedKeys = menuTreeRef.value?.getCheckedKeys(false) || [];
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || [];
    const menuIds = Array.from(new Set([...checkedKeys, ...halfCheckedKeys])).map((id) => Number(id));
    menuSubmitLoading.value = true;
    try {
        const { data: res } = await roleApi.assignMenus(currentRoleId.value, menuIds);
        if (res.code === 200) {
            ElMessage.success('菜单已分配');
            menuVisible.value = false;
        }
        else {
            ElMessage.error(res.message || '分配失败');
        }
    }
    catch {
        ElMessage.error('分配失败');
    }
    finally {
        menuSubmitLoading.value = false;
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
    ...{ 'onSelectionChange': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onRefresh': {} },
    ...{ 'onSelectionChange': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.tableData),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.fetchData),
    ...{ selectionChange: {} },
    onSelectionChange: (__VLS_ctx.onSelectionChange),
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
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, total, loading, fetchData, onSelectionChange, menuStore, openCreate, vPermission,];
    var __VLS_14;
    var __VLS_15;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.menuStore.iconComponents.Delete),
        disabled: (__VLS_ctx.selectedIds.length === 0),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.menuStore.iconComponents.Delete),
        disabled: (__VLS_ctx.selectedIds.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.batchDelete),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:delete']) }, null, null);
    const { default: __VLS_26 } = __VLS_22.slots;
    // @ts-ignore
    [menuStore, vPermission, selectedIds, batchDelete,];
    var __VLS_22;
    var __VLS_23;
    // @ts-ignore
    [];
}
{
    const { status: __VLS_27 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_27);
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }));
    const __VLS_30 = __VLS_29({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    // @ts-ignore
    [getColorByValue, STATUS_OPTIONS, STATUS_OPTIONS, getLabelByValue,];
}
{
    const { operation: __VLS_33 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_33);
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:edit']) }, null, null);
    const { default: __VLS_41 } = __VLS_37.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_37;
    var __VLS_38;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openAssignMenus(row);
            // @ts-ignore
            [openAssignMenus,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:edit']) }, null, null);
    const { default: __VLS_49 } = __VLS_45.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_45;
    var __VLS_46;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定禁用该角色吗？' : '确定启用该角色吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定禁用该角色吗？' : '确定启用该角色吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleToggleStatus,];
        },
    };
    const { default: __VLS_57 } = __VLS_53.slots;
    {
        const { reference: __VLS_58 } = __VLS_53.slots;
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            link: true,
            type: (row.status === 'ENABLE' ? 'danger' : 'success'),
        }));
        const __VLS_61 = __VLS_60({
            link: true,
            type: (row.status === 'ENABLE' ? 'danger' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:edit']) }, null, null);
        const { default: __VLS_64 } = __VLS_62.slots;
        (row.status === 'ENABLE' ? '禁用' : '启用');
        // @ts-ignore
        [vPermission,];
        var __VLS_62;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_53;
    var __VLS_54;
    let __VLS_65;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
        ...{ 'onConfirm': {} },
        title: "确定要删除该角色吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_67 = __VLS_66({
        ...{ 'onConfirm': {} },
        title: "确定要删除该角色吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    let __VLS_70;
    const __VLS_71 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row.id);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleDelete,];
        },
    };
    const { default: __VLS_72 } = __VLS_68.slots;
    {
        const { reference: __VLS_73 } = __VLS_68.slots;
        let __VLS_74;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
            type: "danger",
            link: true,
        }));
        const __VLS_76 = __VLS_75({
            type: "danger",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_75));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['sys:role:delete']) }, null, null);
        const { default: __VLS_79 } = __VLS_77.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_77;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_68;
    var __VLS_69;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑角色' : '新增角色'),
    width: "500",
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑角色' : '新增角色'),
    width: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_85;
const __VLS_86 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
        // @ts-ignore
        [dialogVisible, dialogVisible, editForm,];
    },
};
const { default: __VLS_87 } = __VLS_83.slots;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}));
const __VLS_90 = __VLS_89({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_93;
const { default: __VLS_95 } = __VLS_91.slots;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    label: "代码",
    prop: "code",
}));
const __VLS_98 = __VLS_97({
    label: "代码",
    prop: "code",
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
const { default: __VLS_101 } = __VLS_99.slots;
let __VLS_102;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
    modelValue: (__VLS_ctx.editForm.code),
    disabled: (!!__VLS_ctx.editForm.id),
}));
const __VLS_104 = __VLS_103({
    modelValue: (__VLS_ctx.editForm.code),
    disabled: (!!__VLS_ctx.editForm.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
// @ts-ignore
[editForm, editForm, editForm, formRules,];
var __VLS_99;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    label: "名称",
    prop: "name",
}));
const __VLS_109 = __VLS_108({
    label: "名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_112 } = __VLS_110.slots;
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    modelValue: (__VLS_ctx.editForm.name),
}));
const __VLS_115 = __VLS_114({
    modelValue: (__VLS_ctx.editForm.name),
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
// @ts-ignore
[editForm,];
var __VLS_110;
let __VLS_118;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    label: "排序",
}));
const __VLS_120 = __VLS_119({
    label: "排序",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
const { default: __VLS_123 } = __VLS_121.slots;
let __VLS_124;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
    modelValue: (__VLS_ctx.editForm.sort),
    min: (0),
    ...{ style: {} },
}));
const __VLS_126 = __VLS_125({
    modelValue: (__VLS_ctx.editForm.sort),
    min: (0),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_125));
// @ts-ignore
[editForm,];
var __VLS_121;
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    label: "状态",
}));
const __VLS_131 = __VLS_130({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
const { default: __VLS_134 } = __VLS_132.slots;
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    modelValue: (__VLS_ctx.editForm.status),
}));
const __VLS_137 = __VLS_136({
    modelValue: (__VLS_ctx.editForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
const { default: __VLS_140 } = __VLS_138.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.STATUS_OPTIONS))) {
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        key: (item.value),
        value: (item.value),
    }));
    const __VLS_143 = __VLS_142({
        key: (item.value),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    const { default: __VLS_146 } = __VLS_144.slots;
    (item.label);
    // @ts-ignore
    [STATUS_OPTIONS, editForm,];
    var __VLS_144;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_138;
// @ts-ignore
[];
var __VLS_132;
// @ts-ignore
[];
var __VLS_91;
{
    const { footer: __VLS_147 } = __VLS_83.slots;
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        ...{ 'onClick': {} },
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_153;
    const __VLS_154 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_155 } = __VLS_151.slots;
    // @ts-ignore
    [];
    var __VLS_151;
    var __VLS_152;
    let __VLS_156;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_158 = __VLS_157({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_157));
    let __VLS_161;
    const __VLS_162 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_163 } = __VLS_159.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_159;
    var __VLS_160;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_83;
var __VLS_84;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.menuVisible),
    title: "分配菜单权限",
    width: "680",
}));
const __VLS_166 = __VLS_165({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.menuVisible),
    title: "分配菜单权限",
    width: "680",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.menuVisible = false;
        // @ts-ignore
        [menuVisible, menuVisible,];
    },
};
const { default: __VLS_171 } = __VLS_167.slots;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
elAlert;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    title: "勾选代表该角色可访问对应功能；未勾选则该角色管理员不会拥有该菜单权限。",
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ style: {} },
}));
const __VLS_174 = __VLS_173({
    title: "勾选代表该角色可访问对应功能；未勾选则该角色管理员不会拥有该菜单权限。",
    type: "info",
    closable: (false),
    showIcon: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elTree | typeof __VLS_components.ElTree | typeof __VLS_components['el-tree']} */
elTree;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuTreeData),
    showCheckbox: true,
    nodeKey: "id",
    defaultCheckedKeys: (__VLS_ctx.checkedMenuIds),
    props: ({ children: 'children', label: 'title' }),
    checkStrictly: true,
    defaultExpandAll: true,
}));
const __VLS_179 = __VLS_178({
    ref: "menuTreeRef",
    data: (__VLS_ctx.menuTreeData),
    showCheckbox: true,
    nodeKey: "id",
    defaultCheckedKeys: (__VLS_ctx.checkedMenuIds),
    props: ({ children: 'children', label: 'title' }),
    checkStrictly: true,
    defaultExpandAll: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
var __VLS_182;
var __VLS_180;
{
    const { footer: __VLS_184 } = __VLS_167.slots;
    let __VLS_185;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
        ...{ 'onClick': {} },
    }));
    const __VLS_187 = __VLS_186({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    let __VLS_190;
    const __VLS_191 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.menuVisible = false;
            // @ts-ignore
            [menuVisible, menuTreeData, checkedMenuIds,];
        },
    };
    const { default: __VLS_192 } = __VLS_188.slots;
    // @ts-ignore
    [];
    var __VLS_188;
    var __VLS_189;
    let __VLS_193;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.menuSubmitLoading),
    }));
    const __VLS_195 = __VLS_194({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.menuSubmitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    let __VLS_198;
    const __VLS_199 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleAssignMenus),
    };
    const { default: __VLS_200 } = __VLS_196.slots;
    // @ts-ignore
    [menuSubmitLoading, handleAssignMenus,];
    var __VLS_196;
    var __VLS_197;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_167;
var __VLS_168;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_94 = __VLS_93, __VLS_183 = __VLS_182;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
