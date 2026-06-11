/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { agentApi } from '@/api/agent';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { STATUS_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'AgentListView' });
const menuStore = useMenuStore();
const basePageRef = useTemplateRef({});
const formRef = useTemplateRef('formRef');
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const customersVisible = ref(false);
const customerList = ref([]);
const customerTotal = ref(0);
const customerLoading = ref(false);
const customerPage = ref(1);
const customerPageSize = ref(10);
const currentAgentId = ref('');
const commissionsVisible = ref(false);
const commissionList = ref([]);
const commissionTotal = ref(0);
const commissionLoading = ref(false);
const commissionPage = ref(1);
const commissionPageSize = ref(10);
const editForm = reactive({
    id: '',
    email: '',
    password: '',
    nickname: '',
    phone: '',
    commissionRate: null,
    inviteCode: '',
});
const formRules = {
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const searchFormConfig = ref([
    {
        label: '关键词',
        prop: 'keyword',
        type: 'elInput',
        attrs: { placeholder: '请输入关键词', clearable: true },
    },
    {
        label: '状态',
        prop: 'status',
        type: 'elSelect',
        attrs: { placeholder: '请选择状态', options: STATUS_OPTIONS, clearable: true },
    },
]);
const columns = ref([
    { type: 'index', label: '#', width: 55, fixed: 'left' },
    { prop: 'agentId', label: '代理ID', minWidth: 100 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'phone', label: '手机号', minWidth: 130 },
    { prop: 'nickname', label: '昵称', minWidth: 120 },
    { prop: 'inviteCode', label: '邀请码', minWidth: 120 },
    { prop: 'commissionRate', label: 'Rate(%)', width: 90 },
    { prop: 'customerCount', label: '客户', width: 100 },
    { prop: 'totalCommission', label: 'Commission', width: 120 },
    { prop: 'balance', label: '余额', width: 100 },
    { prop: 'frozenBalance', label: '冻结金额', width: 100 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 300, fixed: 'right' },
]);
const fetchData = async (queryForm, page, pageSize) => {
    loading.value = true;
    try {
        const { data: res } = await agentApi.getAgents({ ...queryForm, page, pageSize });
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
    editForm.phone = '';
    editForm.commissionRate = null;
    editForm.inviteCode = '';
    formRef.value?.resetFields();
};
const openCreate = () => {
    resetForm();
    dialogVisible.value = true;
};
const openEdit = async (row) => {
    try {
        const { data: res } = await agentApi.getAgents({
            agentId: row.agentId || row.id,
            page: 1,
            pageSize: 1,
        });
        const d = res.code === 200 && res.data?.list?.[0] ? res.data.list[0] : row;
        Object.assign(editForm, {
            id: d.id || row.id,
            email: d.email || row.email || '',
            nickname: d.nickname || row.nickname || '',
            phone: d.phone || row.phone || '',
            commissionRate: d.commissionRate ?? row.commissionRate ?? null,
            inviteCode: d.inviteCode || row.inviteCode || '',
        });
        dialogVisible.value = true;
    }
    catch {
        Object.assign(editForm, {
            id: row.id,
            email: row.email || '',
            nickname: row.nickname || '',
            phone: row.phone || '',
            commissionRate: row.commissionRate ?? null,
            inviteCode: row.inviteCode || '',
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
            phone: editForm.phone,
            commissionRate: editForm.commissionRate,
            inviteCode: editForm.inviteCode,
        };
        let res;
        if (editForm.id) {
            res = await agentApi.updateAgent(editForm.id, payload);
        }
        else {
            res = await agentApi.createAgent({ ...payload, password: editForm.password });
        }
        if (res.data.code === 200) {
            ElMessage.success(editForm.id ? '代理更新成功' : '代理创建成功');
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
    const newStatus = row.status === 'ENABLE' ? 'DISABLE' : 'ENABLE';
    try {
        const { data: res } = await agentApi.updateAgentStatus(row.id, newStatus);
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
const openCustomers = (row) => {
    currentAgentId.value = row.id;
    customerPage.value = 1;
    customersVisible.value = true;
    fetchCustomers();
};
const fetchCustomers = async () => {
    customerLoading.value = true;
    try {
        const { data: res } = await agentApi.getAgentCustomers(currentAgentId.value, {
            page: customerPage.value,
            pageSize: customerPageSize.value,
        });
        if (res.code === 200) {
            customerList.value = res.data?.list || [];
            customerTotal.value = res.data?.total || 0;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        customerLoading.value = false;
    }
};
const openCommissions = (row) => {
    currentAgentId.value = row.id;
    commissionPage.value = 1;
    commissionsVisible.value = true;
    fetchCommissions();
};
const fetchCommissions = async () => {
    commissionLoading.value = true;
    try {
        const { data: res } = await agentApi.getAgentCommissions(currentAgentId.value, {
            page: commissionPage.value,
            pageSize: commissionPageSize.value,
        });
        if (res.code === 200) {
            commissionList.value = res.data?.list || [];
            commissionTotal.value = res.data?.total || 0;
        }
    }
    catch {
        /* ignore */
    }
    finally {
        commissionLoading.value = false;
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
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:agent:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [searchFormConfig, tableData, columns, total, loading, fetchData, menuStore, openCreate, vPermission,];
    var __VLS_14;
    var __VLS_15;
    // @ts-ignore
    [];
}
{
    const { status: __VLS_19 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_19);
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }));
    const __VLS_22 = __VLS_21({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [getColorByValue, STATUS_OPTIONS, STATUS_OPTIONS, getLabelByValue,];
}
{
    const { operation: __VLS_25 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_25);
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:agent:edit']) }, null, null);
    const { default: __VLS_33 } = __VLS_29.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_29;
    var __VLS_30;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }));
    const __VLS_36 = __VLS_35({
        ...{ 'onClick': {} },
        type: "info",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    let __VLS_39;
    const __VLS_40 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openCustomers(row);
            // @ts-ignore
            [openCustomers,];
        },
    };
    const { default: __VLS_41 } = __VLS_37.slots;
    // @ts-ignore
    [];
    var __VLS_37;
    var __VLS_38;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openCommissions(row);
            // @ts-ignore
            [openCommissions,];
        },
    };
    const { default: __VLS_49 } = __VLS_45.slots;
    // @ts-ignore
    [];
    var __VLS_45;
    var __VLS_46;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定要禁用该代理吗？' : '确定要启用该代理吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onConfirm': {} },
        title: (row.status === 'ENABLE' ? '确定要禁用该代理吗？' : '确定要启用该代理吗？'),
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
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:agent:edit']) }, null, null);
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
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑代理' : '新增代理'),
    width: "600",
}));
const __VLS_67 = __VLS_66({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.editForm.id ? '编辑代理' : '新增代理'),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
let __VLS_70;
const __VLS_71 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.dialogVisible = false;
        // @ts-ignore
        [dialogVisible, dialogVisible, editForm,];
    },
};
const { default: __VLS_72 } = __VLS_68.slots;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "130px",
}));
const __VLS_75 = __VLS_74({
    ref: "formRef",
    model: (__VLS_ctx.editForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "130px",
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
var __VLS_78;
const { default: __VLS_80 } = __VLS_76.slots;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    label: "邮箱",
    prop: "email",
}));
const __VLS_83 = __VLS_82({
    label: "邮箱",
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
const { default: __VLS_86 } = __VLS_84.slots;
let __VLS_87;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
    modelValue: (__VLS_ctx.editForm.email),
}));
const __VLS_89 = __VLS_88({
    modelValue: (__VLS_ctx.editForm.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_88));
// @ts-ignore
[editForm, editForm, formRules,];
var __VLS_84;
if (!__VLS_ctx.editForm.id) {
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        label: "密码",
        prop: "password",
    }));
    const __VLS_94 = __VLS_93({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_100 = __VLS_99({
        modelValue: (__VLS_ctx.editForm.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    // @ts-ignore
    [editForm, editForm,];
    var __VLS_95;
}
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    label: "昵称",
}));
const __VLS_105 = __VLS_104({
    label: "昵称",
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    modelValue: (__VLS_ctx.editForm.nickname),
}));
const __VLS_111 = __VLS_110({
    modelValue: (__VLS_ctx.editForm.nickname),
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
// @ts-ignore
[editForm,];
var __VLS_106;
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    label: "手机号",
}));
const __VLS_116 = __VLS_115({
    label: "手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
const { default: __VLS_119 } = __VLS_117.slots;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.editForm.phone),
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.editForm.phone),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
// @ts-ignore
[editForm,];
var __VLS_117;
let __VLS_125;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
    label: "佣金比例(%)",
}));
const __VLS_127 = __VLS_126({
    label: "佣金比例(%)",
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
const { default: __VLS_130 } = __VLS_128.slots;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    modelValue: (__VLS_ctx.editForm.commissionRate),
    min: (0),
    max: (100),
    precision: (2),
    ...{ style: {} },
}));
const __VLS_133 = __VLS_132({
    modelValue: (__VLS_ctx.editForm.commissionRate),
    min: (0),
    max: (100),
    precision: (2),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
// @ts-ignore
[editForm,];
var __VLS_128;
let __VLS_136;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
    label: "邀请码",
}));
const __VLS_138 = __VLS_137({
    label: "邀请码",
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
const { default: __VLS_141 } = __VLS_139.slots;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    modelValue: (__VLS_ctx.editForm.inviteCode),
    disabled: (!!__VLS_ctx.editForm.id),
}));
const __VLS_144 = __VLS_143({
    modelValue: (__VLS_ctx.editForm.inviteCode),
    disabled: (!!__VLS_ctx.editForm.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
// @ts-ignore
[editForm, editForm,];
var __VLS_139;
// @ts-ignore
[];
var __VLS_76;
{
    const { footer: __VLS_147 } = __VLS_68.slots;
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
var __VLS_68;
var __VLS_69;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.customersVisible),
    title: "代理客户",
    width: "700",
}));
const __VLS_166 = __VLS_165({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.customersVisible),
    title: "代理客户",
    width: "700",
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.customersVisible = false;
        // @ts-ignore
        [customersVisible, customersVisible,];
    },
};
const { default: __VLS_171 } = __VLS_167.slots;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
    data: (__VLS_ctx.customerList),
    border: true,
    stripe: true,
    maxHeight: "400",
}));
const __VLS_174 = __VLS_173({
    data: (__VLS_ctx.customerList),
    border: true,
    stripe: true,
    maxHeight: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_173));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.customerLoading) }, null, null);
const { default: __VLS_177 } = __VLS_175.slots;
let __VLS_178;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_179 = __VLS_asFunctionalComponent1(__VLS_178, new __VLS_178({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
}));
const __VLS_180 = __VLS_179({
    prop: "email",
    label: "邮箱",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_179));
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    prop: "phone",
    label: "手机号",
    minWidth: "130",
}));
const __VLS_185 = __VLS_184({
    prop: "phone",
    label: "手机号",
    minWidth: "130",
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    prop: "nickname",
    label: "昵称",
    minWidth: "120",
}));
const __VLS_190 = __VLS_189({
    prop: "nickname",
    label: "昵称",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
let __VLS_193;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    prop: "createdAt",
    label: "注册时间",
    minWidth: "160",
}));
const __VLS_195 = __VLS_194({
    prop: "createdAt",
    label: "注册时间",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
// @ts-ignore
[customerList, vLoading, customerLoading,];
var __VLS_175;
if (__VLS_ctx.customerTotal > 0) {
    let __VLS_198;
    /** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
    elPagination;
    // @ts-ignore
    const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.customerPage),
        pageSize: (__VLS_ctx.customerPageSize),
        total: (__VLS_ctx.customerTotal),
        pageSizes: ([10, 20, 50]),
        layout: "total, sizes, prev, pager, next",
        ...{ style: {} },
    }));
    const __VLS_200 = __VLS_199({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.customerPage),
        pageSize: (__VLS_ctx.customerPageSize),
        total: (__VLS_ctx.customerTotal),
        pageSizes: ([10, 20, 50]),
        layout: "total, sizes, prev, pager, next",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_199));
    let __VLS_203;
    const __VLS_204 = {
        ...{ change: {} },
        onChange: (__VLS_ctx.fetchCustomers),
    };
    var __VLS_201;
    var __VLS_202;
}
{
    const { footer: __VLS_205 } = __VLS_167.slots;
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
            __VLS_ctx.customersVisible = false;
            // @ts-ignore
            [customersVisible, customerTotal, customerTotal, customerPage, customerPageSize, fetchCustomers,];
        },
    };
    const { default: __VLS_213 } = __VLS_209.slots;
    // @ts-ignore
    [];
    var __VLS_209;
    var __VLS_210;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_167;
var __VLS_168;
let __VLS_214;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.commissionsVisible),
    title: "代理佣金",
    width: "700",
}));
const __VLS_216 = __VLS_215({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.commissionsVisible),
    title: "代理佣金",
    width: "700",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
let __VLS_219;
const __VLS_220 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.commissionsVisible = false;
        // @ts-ignore
        [commissionsVisible, commissionsVisible,];
    },
};
const { default: __VLS_221 } = __VLS_217.slots;
let __VLS_222;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
    data: (__VLS_ctx.commissionList),
    border: true,
    stripe: true,
    maxHeight: "400",
}));
const __VLS_224 = __VLS_223({
    data: (__VLS_ctx.commissionList),
    border: true,
    stripe: true,
    maxHeight: "400",
}, ...__VLS_functionalComponentArgsRest(__VLS_223));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.commissionLoading) }, null, null);
const { default: __VLS_227 } = __VLS_225.slots;
let __VLS_228;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
    prop: "orderId",
    label: "订单ID",
    minWidth: "120",
}));
const __VLS_230 = __VLS_229({
    prop: "orderId",
    label: "订单ID",
    minWidth: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
let __VLS_233;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_234 = __VLS_asFunctionalComponent1(__VLS_233, new __VLS_233({
    prop: "amount",
    label: "金额",
    width: "120",
}));
const __VLS_235 = __VLS_234({
    prop: "amount",
    label: "金额",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_234));
let __VLS_238;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
    prop: "rate",
    label: "比例",
    width: "80",
}));
const __VLS_240 = __VLS_239({
    prop: "rate",
    label: "比例",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_239));
let __VLS_243;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
    prop: "status",
    label: "状态",
    width: "100",
}));
const __VLS_245 = __VLS_244({
    prop: "status",
    label: "状态",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
let __VLS_248;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "160",
}));
const __VLS_250 = __VLS_249({
    prop: "createdAt",
    label: "创建时间",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
// @ts-ignore
[vLoading, commissionList, commissionLoading,];
var __VLS_225;
if (__VLS_ctx.commissionTotal > 0) {
    let __VLS_253;
    /** @ts-ignore @type { | typeof __VLS_components.elPagination | typeof __VLS_components.ElPagination | typeof __VLS_components['el-pagination']} */
    elPagination;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.commissionPage),
        pageSize: (__VLS_ctx.commissionPageSize),
        total: (__VLS_ctx.commissionTotal),
        pageSizes: ([10, 20, 50]),
        layout: "total, sizes, prev, pager, next",
        ...{ style: {} },
    }));
    const __VLS_255 = __VLS_254({
        ...{ 'onChange': {} },
        currentPage: (__VLS_ctx.commissionPage),
        pageSize: (__VLS_ctx.commissionPageSize),
        total: (__VLS_ctx.commissionTotal),
        pageSizes: ([10, 20, 50]),
        layout: "total, sizes, prev, pager, next",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    let __VLS_258;
    const __VLS_259 = {
        ...{ change: {} },
        onChange: (__VLS_ctx.fetchCommissions),
    };
    var __VLS_256;
    var __VLS_257;
}
{
    const { footer: __VLS_260 } = __VLS_217.slots;
    let __VLS_261;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
        ...{ 'onClick': {} },
    }));
    const __VLS_263 = __VLS_262({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    let __VLS_266;
    const __VLS_267 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.commissionsVisible = false;
            // @ts-ignore
            [commissionsVisible, commissionTotal, commissionTotal, commissionPage, commissionPageSize, fetchCommissions,];
        },
    };
    const { default: __VLS_268 } = __VLS_264.slots;
    // @ts-ignore
    [];
    var __VLS_264;
    var __VLS_265;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_217;
var __VLS_218;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_79 = __VLS_78;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
