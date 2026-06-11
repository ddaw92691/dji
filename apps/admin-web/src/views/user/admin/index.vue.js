/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { adminUserApi } from '@/api/adminUser';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'AdminUserListView' });
const menuStore = useMenuStore();
const basePageRef = useTemplateRef({});
const formRef = useTemplateRef('formRef');
const passwordFormRef = useTemplateRef('passwordFormRef');
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const passwordVisible = ref(false);
const passwordSubmitLoading = ref(false);
const editForm = reactive({
    id: '',
    email: '',
    password: '',
    nickname: '',
    role: 'ADMIN',
    country: '',
    language: '',
});
const passwordForm = reactive({
    adminId: '',
    newPassword: '',
    confirmPassword: '',
});
const formRules = {
    email: [{ required: true, message: '邮箱 is required', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};
const passwordRules = {
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (_rule, value, callback) => {
                if (value !== passwordForm.newPassword)
                    callback(new Error('两次密码不一致'));
                else
                    callback();
            },
            trigger: 'blur',
        },
    ],
};
const ADMIN_STATUS_OPTIONS = [
    { label: '启用', value: 1, color: 'success' },
    { label: '禁用', value: 0, color: 'danger' },
];
const searchFormConfig = ref([
    {
        label: '关键词',
        prop: 'keyword',
        type: 'elInput',
        attrs: { placeholder: '搜索邮箱/昵称', clearable: true },
    },
    {
        label: '角色',
        prop: 'role',
        type: 'elSelect',
        attrs: {
            placeholder: '请选择角色',
            options: [
                { label: 'ADMIN', value: 'ADMIN' },
                { label: 'SUPER_ADMIN', value: 'SUPER_ADMIN' },
            ],
            clearable: true,
        },
    },
    {
        label: '状态',
        prop: 'status',
        type: 'elSelect',
        attrs: { placeholder: '请选择状态', options: ADMIN_STATUS_OPTIONS, clearable: true },
    },
]);
const columns = ref([
    { type: 'index', label: '#', width: 55, fixed: 'left' },
    { prop: 'id', label: 'ID', minWidth: 80 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'phone', label: '手机号', minWidth: 130 },
    { prop: 'nickname', label: '昵称', minWidth: 120 },
    { prop: 'role', label: '角色', width: 120 },
    { prop: 'country', label: '国家', width: 90 },
    { prop: 'language', label: '语言', width: 90 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'lastLoginAt', label: '最后登录', minWidth: 160 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 260, fixed: 'right' },
]);
const fetchData = async (queryForm, page, pageSize) => {
    loading.value = true;
    try {
        const { data: res } = await adminUserApi.getAdminUsers({ ...queryForm, page, pageSize });
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        loading.value = false;
    }
};
const resetForm = () => {
    editForm.id = '';
    editForm.email = '';
    editForm.password = '';
    editForm.nickname = '';
    editForm.role = 'ADMIN';
    editForm.country = '';
    editForm.language = '';
    formRef.value?.resetFields();
};
const openCreate = () => {
    resetForm();
    dialogVisible.value = true;
};
const openEdit = async (row) => {
    try {
        const { data: res } = await adminUserApi.getAdminUsers({ id: row.id, page: 1, pageSize: 1 });
        const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row;
        Object.assign(editForm, {
            id: d.id || row.id,
            email: d.email || row.email || '',
            nickname: d.nickname || row.nickname || '',
            role: d.role || row.role || 'ADMIN',
            country: d.country || row.country || '',
            language: d.language || row.language || '',
        });
        dialogVisible.value = true;
    }
    catch {
        Object.assign(editForm, {
            id: row.id,
            email: row.email || '',
            nickname: row.nickname || '',
            role: row.role || 'ADMIN',
            country: row.country || '',
            language: row.language || '',
        });
        dialogVisible.value = true;
    }
};
const handleSubmit = async () => {
    await formRef.value?.validate();
    submitLoading.value = true;
    try {
        const payload = {
            email: editForm.email,
            nickname: editForm.nickname,
            role: editForm.role,
            country: editForm.country,
            language: editForm.language,
        };
        let res;
        if (editForm.id) {
            res = await adminUserApi.updateAdminUser(editForm.id, payload);
        }
        else {
            res = await adminUserApi.createAdminUser({ ...payload, password: editForm.password });
        }
        if (res.data.code === 200) {
            ElMessage.success(editForm.id ? 'Admin updated' : 'Admin created');
            dialogVisible.value = false;
            editForm.id
                ? basePageRef.value?.refreshCurrentPage()
                : basePageRef.value?.refreshToFirstPage();
        }
        else {
            ElMessage.error(res.data.message || '操作失败');
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
    const newStatus = row.status === 1 ? 0 : 1;
    try {
        const { data: res } = await adminUserApi.updateAdminUserStatus(row.id, newStatus);
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
        const { data: res } = await adminUserApi.deleteAdminUser(id);
        if (res.code === 200) {
            ElMessage.success('管理员已删除');
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
const openResetPassword = (row) => {
    passwordForm.adminId = row.id;
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    passwordFormRef.value?.resetFields();
    passwordVisible.value = true;
};
const handleResetPassword = async () => {
    await passwordFormRef.value?.validate();
    passwordSubmitLoading.value = true;
    try {
        const resp = await adminUserApi.resetAdminUserPassword(passwordForm.adminId, passwordForm.newPassword);
        if (resp.data.code === 200) {
            ElMessage.success('密码重置成功');
            passwordVisible.value = false;
        }
        else {
            ElMessage.error(resp.data.message || '重置失败');
        }
    }
    catch {
        ElMessage.error('重置失败');
    }
    finally {
        passwordSubmitLoading.value = false;
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
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onRefresh': {} },
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
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:admin:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, total, loading, fetchData, menuStore, openCreate, vPermission,];
    var __VLS_14;
    var __VLS_15;
    // @ts-ignore
    [];
}
{
    const { role: __VLS_19 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_19);
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        type: (row.role === 'SUPER_ADMIN' ? 'danger' : 'warning'),
        text: (row.role),
    }));
    const __VLS_22 = __VLS_21({
        type: (row.role === 'SUPER_ADMIN' ? 'danger' : 'warning'),
        text: (row.role),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [];
}
{
    const { status: __VLS_25 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_25);
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ADMIN_STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.ADMIN_STATUS_OPTIONS, row.status)),
    }));
    const __VLS_28 = __VLS_27({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.ADMIN_STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.ADMIN_STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    // @ts-ignore
    [getColorByValue, ADMIN_STATUS_OPTIONS, ADMIN_STATUS_OPTIONS, getLabelByValue,];
}
{
    const { operation: __VLS_31 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_31);
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_34 = __VLS_33({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    let __VLS_37;
    const __VLS_38 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:admin:edit']) }, null, null);
    const { default: __VLS_39 } = __VLS_35.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_35;
    var __VLS_36;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openResetPassword(row);
            // @ts-ignore
            [openResetPassword,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:admin:edit']) }, null, null);
    const { default: __VLS_47 } = __VLS_43.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_43;
    var __VLS_44;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onConfirm': {} },
        title: (row.status === 1 ? '确定要禁用该管理员吗？' : '确定要启用该管理员吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onConfirm': {} },
        title: (row.status === 1 ? '确定要禁用该管理员吗？' : '确定要启用该管理员吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleToggleStatus,];
        },
    };
    const { default: __VLS_55 } = __VLS_51.slots;
    {
        const { reference: __VLS_56 } = __VLS_51.slots;
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            link: true,
            type: (row.status === 1 ? 'danger' : 'success'),
        }));
        const __VLS_59 = __VLS_58({
            link: true,
            type: (row.status === 1 ? 'danger' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:admin:edit']) }, null, null);
        const { default: __VLS_62 } = __VLS_60.slots;
        (row.status === 1 ? '禁用' : '启用');
        // @ts-ignore
        [vPermission,];
        var __VLS_60;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_51;
    var __VLS_52;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onConfirm': {} },
        title: "确定要删除该管理员吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onConfirm': {} },
        title: "确定要删除该管理员吗？",
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleDelete(row.id);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleDelete,];
        },
    };
    const { default: __VLS_70 } = __VLS_66.slots;
    {
        const { reference: __VLS_71 } = __VLS_66.slots;
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            type: "danger",
            link: true,
        }));
        const __VLS_74 = __VLS_73({
            type: "danger",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:admin:delete']) }, null, null);
        const { default: __VLS_77 } = __VLS_75.slots;
        // @ts-ignore
        [vPermission,];
        var __VLS_75;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_66;
    var __VLS_67;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑管理员' : '新增管理员'),
    width: "550",
}));
const __VLS_80 = __VLS_79({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑管理员' : '新增管理员'),
    width: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
let __VLS_83;
const __VLS_84 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
        // @ts-ignore
        [dialogVisible, dialogVisible, editForm,];
    },
};
const { default: __VLS_85 } = __VLS_81.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "120px",
}));
const __VLS_88 = __VLS_87({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "120px",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
var __VLS_91;
const { default: __VLS_93 } = __VLS_89.slots;
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    label: "邮箱",
    prop: "email",
}));
const __VLS_96 = __VLS_95({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
const { default: __VLS_99 } = __VLS_97.slots;
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    modelValue: (__VLS_ctx.editForm.email),
}));
const __VLS_102 = __VLS_101({
    modelValue: (__VLS_ctx.editForm.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
// @ts-ignore
[editForm, editForm, formRules,];
var __VLS_97;
if (!__VLS_ctx.editForm.id) {
    let __VLS_105;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        label: "密码",
        prop: "password",
    }));
    const __VLS_107 = __VLS_106({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    const { default: __VLS_110 } = __VLS_108.slots;
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_113 = __VLS_112({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_108;
}
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    label: "昵称",
}));
const __VLS_118 = __VLS_117({
    label: "昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    modelValue: (__VLS_ctx.editForm.nickname),
}));
const __VLS_124 = __VLS_123({
    modelValue: (__VLS_ctx.editForm.nickname),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
// @ts-ignore
[editForm,];
var __VLS_119;
let __VLS_127;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
    label: "角色",
    prop: "role",
}));
const __VLS_129 = __VLS_128({
    label: "角色",
    prop: "role",
}, ...__VLS_functionalComponentArgsRest(__VLS_128));
const { default: __VLS_132 } = __VLS_130.slots;
let __VLS_133;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
    modelValue: (__VLS_ctx.editForm.role),
    ...{ style: {} },
}));
const __VLS_135 = __VLS_134({
    modelValue: (__VLS_ctx.editForm.role),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
const { default: __VLS_138 } = __VLS_136.slots;
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    label: "ADMIN",
    value: "ADMIN",
}));
const __VLS_141 = __VLS_140({
    label: "ADMIN",
    value: "ADMIN",
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    label: "SUPER_ADMIN",
    value: "SUPER_ADMIN",
}));
const __VLS_146 = __VLS_145({
    label: "SUPER_ADMIN",
    value: "SUPER_ADMIN",
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
// @ts-ignore
[editForm,];
var __VLS_136;
// @ts-ignore
[];
var __VLS_130;
let __VLS_149;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
    label: "国家",
}));
const __VLS_151 = __VLS_150({
    label: "国家",
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
const { default: __VLS_154 } = __VLS_152.slots;
let __VLS_155;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    modelValue: (__VLS_ctx.editForm.country),
}));
const __VLS_157 = __VLS_156({
    modelValue: (__VLS_ctx.editForm.country),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
// @ts-ignore
[editForm,];
var __VLS_152;
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    label: "语言",
}));
const __VLS_162 = __VLS_161({
    label: "语言",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const { default: __VLS_165 } = __VLS_163.slots;
let __VLS_166;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_167 = __VLS_asFunctionalComponent1(__VLS_166, new __VLS_166({
    modelValue: (__VLS_ctx.editForm.language),
}));
const __VLS_168 = __VLS_167({
    modelValue: (__VLS_ctx.editForm.language),
}, ...__VLS_functionalComponentArgsRest(__VLS_167));
// @ts-ignore
[editForm,];
var __VLS_163;
// @ts-ignore
[];
var __VLS_89;
{
    const { footer: __VLS_171 } = __VLS_81.slots;
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        ...{ 'onClick': {} },
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_177;
    const __VLS_178 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_179 } = __VLS_175.slots;
    // @ts-ignore
    [];
    var __VLS_175;
    var __VLS_176;
    let __VLS_180;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_182 = __VLS_181({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_181));
    let __VLS_185;
    const __VLS_186 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSubmit),
    };
    const { default: __VLS_187 } = __VLS_183.slots;
    // @ts-ignore
    [submitLoading, handleSubmit,];
    var __VLS_183;
    var __VLS_184;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_81;
var __VLS_82;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.passwordVisible),
    title: "重置密码",
    width: "450",
}));
const __VLS_190 = __VLS_189({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.passwordVisible),
    title: "重置密码",
    width: "450",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
let __VLS_193;
const __VLS_194 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.passwordVisible = false;
        // @ts-ignore
        [passwordVisible, passwordVisible,];
    },
};
const { default: __VLS_195 } = __VLS_191.slots;
let __VLS_196;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "130px",
}));
const __VLS_198 = __VLS_197({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
var __VLS_201;
const { default: __VLS_203 } = __VLS_199.slots;
let __VLS_204;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_206 = __VLS_205({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_205));
const { default: __VLS_209 } = __VLS_207.slots;
let __VLS_210;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_212 = __VLS_211({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_211));
// @ts-ignore
[passwordForm, passwordForm, passwordRules,];
var __VLS_207;
let __VLS_215;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
    label: "确认密码",
    prop: "confirmPassword",
}));
const __VLS_217 = __VLS_216({
    label: "确认密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_216));
const { default: __VLS_220 } = __VLS_218.slots;
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
}));
const __VLS_223 = __VLS_222({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
// @ts-ignore
[passwordForm,];
var __VLS_218;
// @ts-ignore
[];
var __VLS_199;
{
    const { footer: __VLS_226 } = __VLS_191.slots;
    let __VLS_227;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
        ...{ 'onClick': {} },
    }));
    const __VLS_229 = __VLS_228({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_228));
    let __VLS_232;
    const __VLS_233 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.passwordVisible = false;
            // @ts-ignore
            [passwordVisible,];
        },
    };
    const { default: __VLS_234 } = __VLS_230.slots;
    // @ts-ignore
    [];
    var __VLS_230;
    var __VLS_231;
    let __VLS_235;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.passwordSubmitLoading),
    }));
    const __VLS_237 = __VLS_236({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.passwordSubmitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
    let __VLS_240;
    const __VLS_241 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleResetPassword),
    };
    const { default: __VLS_242 } = __VLS_238.slots;
    // @ts-ignore
    [passwordSubmitLoading, handleResetPassword,];
    var __VLS_238;
    var __VLS_239;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_191;
var __VLS_192;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_92 = __VLS_91, __VLS_202 = __VLS_201;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
