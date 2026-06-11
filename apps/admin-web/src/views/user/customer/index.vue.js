/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { customerApi } from '@/api/customer';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'CustomerListView' });
const basePageRef = useTemplateRef({});
const editFormRef = useTemplateRef({});
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const detailVisible = ref(false);
const detailItem = ref(null);
const editVisible = ref(false);
const submitLoading = ref(false);
const editForm = reactive({
    id: '',
    email: '',
    phone: '',
    nickname: '',
    country: '',
    language: '',
    isVirtual: false,
    virtualRemark: '',
});
const CUSTOMER_STATUS_OPTIONS = [
    { label: '启用', value: 1, color: 'success' },
    { label: '禁用', value: 0, color: 'danger' },
];
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
        attrs: {
            placeholder: '请选择状态',
            options: CUSTOMER_STATUS_OPTIONS,
            clearable: true,
        },
    },
    {
        label: '国家',
        prop: 'country',
        type: 'elInput',
        attrs: { placeholder: '国家代码', clearable: true },
    },
    {
        label: '虚拟',
        prop: 'isVirtual',
        type: 'elSelect',
        attrs: {
            placeholder: '筛选',
            options: [
                { label: '虚拟 Only', value: 'true' },
                { label: '仅真实', value: 'false' },
            ],
            clearable: true,
        },
    },
]);
const columns = ref([
    { type: 'index', label: '#', width: 55, fixed: 'left' },
    { prop: 'id', label: 'ID', minWidth: 80 },
    { prop: 'email', label: '邮箱', minWidth: 180 },
    { prop: 'phone', label: '手机号', minWidth: 130 },
    { prop: 'nickname', label: '昵称', minWidth: 120 },
    { prop: 'isVirtual', label: '虚拟', width: 80 },
    { prop: 'country', label: '国家', width: 100 },
    { prop: 'language', label: '语言', width: 100 },
    { prop: 'orderCount', label: '订单', width: 90 },
    { prop: 'totalSpent', label: '消费总额', width: 110 },
    { prop: 'status', label: '状态', width: 100 },
    { prop: 'createdAt', label: '创建时间', minWidth: 160 },
    { prop: 'operation', label: '操作', width: 200, fixed: 'right' },
]);
const fetchData = async (queryForm, page, pageSize) => {
    loading.value = true;
    try {
        const { data: res } = await customerApi.getCustomers({ ...queryForm, page, pageSize });
        if (res.code === 200) {
            tableData.value = res.data?.list || [];
            total.value = res.data?.total || 0;
        }
    }
    catch {
        /* handled by interceptor */
    }
    finally {
        loading.value = false;
    }
};
const openDetail = async (row) => {
    try {
        const { data: res } = await customerApi.getCustomerDetail(row.id);
        if (res.code === 200) {
            detailItem.value = res.data;
            detailVisible.value = true;
        }
    }
    catch {
        /* ignore */
    }
};
const openEdit = async (row) => {
    try {
        const { data: res } = await customerApi.getCustomerDetail(row.id);
        if (res.code === 200) {
            const d = res.data;
            Object.assign(editForm, {
                id: d.id,
                email: d.email || '',
                phone: d.phone || '',
                nickname: d.nickname || '',
                country: d.country || '',
                language: d.language || '',
                isVirtual: !!d.isVirtual,
                virtualRemark: d.virtualRemark || '',
            });
            editVisible.value = true;
        }
    }
    catch {
        /* ignore */
    }
};
const handleSave = async () => {
    submitLoading.value = true;
    try {
        const { data: res } = await customerApi.updateCustomer(editForm.id, {
            email: editForm.email,
            phone: editForm.phone,
            nickname: editForm.nickname,
            countryCode: editForm.country,
            languageCode: editForm.language,
            isVirtual: editForm.isVirtual,
            virtualRemark: editForm.virtualRemark,
        });
        if (res.code === 200) {
            ElMessage.success('客户已更新');
            editVisible.value = false;
            basePageRef.value?.refreshCurrentPage();
        }
        else {
            ElMessage.error(res.message || '更新失败');
        }
    }
    catch {
        ElMessage.error('更新失败');
    }
    finally {
        submitLoading.value = false;
    }
};
const handleToggleStatus = async (row) => {
    const newStatus = row.status === 1 ? 0 : 1;
    try {
        const { data: res } = await customerApi.updateCustomerStatus(row.id, newStatus);
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
    const { status: __VLS_10 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_10);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.CUSTOMER_STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.CUSTOMER_STATUS_OPTIONS, row.status)),
    }));
    const __VLS_13 = __VLS_12({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.CUSTOMER_STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.CUSTOMER_STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    if (row.isVirtual) {
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            type: "info",
            size: "small",
            effect: "plain",
        }));
        const __VLS_18 = __VLS_17({
            type: "info",
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_21 } = __VLS_19.slots;
        // @ts-ignore
        [searchFormConfig, tableData, columns, total, loading, fetchData, getColorByValue, CUSTOMER_STATUS_OPTIONS, CUSTOMER_STATUS_OPTIONS, getLabelByValue,];
        var __VLS_19;
    }
    // @ts-ignore
    [];
}
{
    const { operation: __VLS_22 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_22);
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openDetail(row);
            // @ts-ignore
            [openDetail,];
        },
    };
    const { default: __VLS_30 } = __VLS_26.slots;
    // @ts-ignore
    [];
    var __VLS_26;
    var __VLS_27;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "warning",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.openEdit(row);
            // @ts-ignore
            [openEdit,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:customer:edit']) }, null, null);
    const { default: __VLS_38 } = __VLS_34.slots;
    // @ts-ignore
    [vPermission,];
    var __VLS_34;
    var __VLS_35;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onConfirm': {} },
        title: (row.status === 1 ? '确定要禁用该客户吗？' : '确定要启用该客户吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onConfirm': {} },
        title: (row.status === 1 ? '确定要禁用该客户吗？' : '确定要启用该客户吗？'),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.handleToggleStatus(row);
            // @ts-ignore
            [POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, handleToggleStatus,];
        },
    };
    const { default: __VLS_46 } = __VLS_42.slots;
    {
        const { reference: __VLS_47 } = __VLS_42.slots;
        let __VLS_48;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
            link: true,
            type: (row.status === 1 ? 'danger' : 'success'),
        }));
        const __VLS_50 = __VLS_49({
            link: true,
            type: (row.status === 1 ? 'danger' : 'success'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_49));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['admin:user:customer:edit']) }, null, null);
        const { default: __VLS_53 } = __VLS_51.slots;
        (row.status === 1 ? '禁用' : '启用');
        // @ts-ignore
        [vPermission,];
        var __VLS_51;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_42;
    var __VLS_43;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.detailVisible),
    title: "客户详情",
    width: "650",
}));
const __VLS_56 = __VLS_55({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.detailVisible),
    title: "客户详情",
    width: "650",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_59;
const __VLS_60 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.detailVisible = false;
        // @ts-ignore
        [detailVisible, detailVisible,];
    },
};
const { default: __VLS_61 } = __VLS_57.slots;
if (__VLS_ctx.detailItem) {
    let __VLS_62;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions'] | typeof __VLS_components.elDescriptions | typeof __VLS_components.ElDescriptions | typeof __VLS_components['el-descriptions']} */
    elDescriptions;
    // @ts-ignore
    const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
        column: (2),
        border: true,
        size: "small",
    }));
    const __VLS_64 = __VLS_63({
        column: (2),
        border: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_63));
    const { default: __VLS_67 } = __VLS_65.slots;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        label: "ID",
    }));
    const __VLS_70 = __VLS_69({
        label: "ID",
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    const { default: __VLS_73 } = __VLS_71.slots;
    (__VLS_ctx.detailItem.id);
    // @ts-ignore
    [detailItem, detailItem,];
    var __VLS_71;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        label: "邮箱",
    }));
    const __VLS_76 = __VLS_75({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    const { default: __VLS_79 } = __VLS_77.slots;
    (__VLS_ctx.detailItem.email || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_77;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        label: "手机号",
    }));
    const __VLS_82 = __VLS_81({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    const { default: __VLS_85 } = __VLS_83.slots;
    (__VLS_ctx.detailItem.phone || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_83;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        label: "昵称",
    }));
    const __VLS_88 = __VLS_87({
        label: "昵称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    (__VLS_ctx.detailItem.nickname || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_89;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        label: "国家",
    }));
    const __VLS_94 = __VLS_93({
        label: "国家",
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    (__VLS_ctx.detailItem.country || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_95;
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        label: "语言",
    }));
    const __VLS_100 = __VLS_99({
        label: "语言",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    const { default: __VLS_103 } = __VLS_101.slots;
    (__VLS_ctx.detailItem.language || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_101;
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        label: "订单",
    }));
    const __VLS_106 = __VLS_105({
        label: "订单",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    (__VLS_ctx.detailItem.orderCount ?? '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_107;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        label: "消费总额",
    }));
    const __VLS_112 = __VLS_111({
        label: "消费总额",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    const { default: __VLS_115 } = __VLS_113.slots;
    (__VLS_ctx.detailItem.totalSpent ?? '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_113;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        label: "状态",
    }));
    const __VLS_118 = __VLS_117({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const { default: __VLS_121 } = __VLS_119.slots;
    (__VLS_ctx.detailItem.status);
    // @ts-ignore
    [detailItem,];
    var __VLS_119;
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item'] | typeof __VLS_components.elDescriptionsItem | typeof __VLS_components.ElDescriptionsItem | typeof __VLS_components['el-descriptions-item']} */
    elDescriptionsItem;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        label: "创建时间",
    }));
    const __VLS_124 = __VLS_123({
        label: "创建时间",
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    const { default: __VLS_127 } = __VLS_125.slots;
    (__VLS_ctx.detailItem.createdAt || '-');
    // @ts-ignore
    [detailItem,];
    var __VLS_125;
    // @ts-ignore
    [];
    var __VLS_65;
}
{
    const { footer: __VLS_128 } = __VLS_57.slots;
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        ...{ 'onClick': {} },
    }));
    const __VLS_131 = __VLS_130({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    let __VLS_134;
    const __VLS_135 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.detailVisible = false;
            // @ts-ignore
            [detailVisible,];
        },
    };
    const { default: __VLS_136 } = __VLS_132.slots;
    // @ts-ignore
    [];
    var __VLS_132;
    var __VLS_133;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_57;
var __VLS_58;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑客户",
    width: "550",
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.editVisible),
    title: "编辑客户",
    width: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_142;
const __VLS_143 = {
    ...{ close: {} },
    onClose: (...[$event]) => {
        __VLS_ctx.editVisible = false;
        // @ts-ignore
        [editVisible, editVisible,];
    },
};
const { default: __VLS_144 } = __VLS_140.slots;
if (__VLS_ctx.editForm.id) {
    let __VLS_145;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
        ref: "editFormRef",
        model: (__VLS_ctx.editForm),
        labelWidth: "100px",
    }));
    const __VLS_147 = __VLS_146({
        ref: "editFormRef",
        model: (__VLS_ctx.editForm),
        labelWidth: "100px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    var __VLS_150;
    const { default: __VLS_152 } = __VLS_148.slots;
    let __VLS_153;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
        label: "邮箱",
    }));
    const __VLS_155 = __VLS_154({
        label: "邮箱",
    }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    const { default: __VLS_158 } = __VLS_156.slots;
    let __VLS_159;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
        modelValue: (__VLS_ctx.editForm.email),
    }));
    const __VLS_161 = __VLS_160({
        modelValue: (__VLS_ctx.editForm.email),
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    // @ts-ignore
    [editForm, editForm, editForm,];
    var __VLS_156;
    let __VLS_164;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
        label: "手机号",
    }));
    const __VLS_166 = __VLS_165({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    const { default: __VLS_169 } = __VLS_167.slots;
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        modelValue: (__VLS_ctx.editForm.phone),
    }));
    const __VLS_172 = __VLS_171({
        modelValue: (__VLS_ctx.editForm.phone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    // @ts-ignore
    [editForm,];
    var __VLS_167;
    let __VLS_175;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
        label: "昵称",
    }));
    const __VLS_177 = __VLS_176({
        label: "昵称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_176));
    const { default: __VLS_180 } = __VLS_178.slots;
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        modelValue: (__VLS_ctx.editForm.nickname),
    }));
    const __VLS_183 = __VLS_182({
        modelValue: (__VLS_ctx.editForm.nickname),
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    // @ts-ignore
    [editForm,];
    var __VLS_178;
    let __VLS_186;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
        label: "国家",
    }));
    const __VLS_188 = __VLS_187({
        label: "国家",
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    const { default: __VLS_191 } = __VLS_189.slots;
    let __VLS_192;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
        modelValue: (__VLS_ctx.editForm.country),
    }));
    const __VLS_194 = __VLS_193({
        modelValue: (__VLS_ctx.editForm.country),
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    // @ts-ignore
    [editForm,];
    var __VLS_189;
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
        label: "语言",
    }));
    const __VLS_199 = __VLS_198({
        label: "语言",
    }, ...__VLS_functionalComponentArgsRest(__VLS_198));
    const { default: __VLS_202 } = __VLS_200.slots;
    let __VLS_203;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({
        modelValue: (__VLS_ctx.editForm.language),
    }));
    const __VLS_205 = __VLS_204({
        modelValue: (__VLS_ctx.editForm.language),
    }, ...__VLS_functionalComponentArgsRest(__VLS_204));
    // @ts-ignore
    [editForm,];
    var __VLS_200;
    let __VLS_208;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({}));
    const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
    let __VLS_213;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        label: "虚拟客户",
    }));
    const __VLS_215 = __VLS_214({
        label: "虚拟客户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const { default: __VLS_218 } = __VLS_216.slots;
    let __VLS_219;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
        modelValue: (__VLS_ctx.editForm.isVirtual),
    }));
    const __VLS_221 = __VLS_220({
        modelValue: (__VLS_ctx.editForm.isVirtual),
    }, ...__VLS_functionalComponentArgsRest(__VLS_220));
    // @ts-ignore
    [editForm,];
    var __VLS_216;
    if (__VLS_ctx.editForm.isVirtual) {
        let __VLS_224;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
            label: "虚拟备注",
        }));
        const __VLS_226 = __VLS_225({
            label: "虚拟备注",
        }, ...__VLS_functionalComponentArgsRest(__VLS_225));
        const { default: __VLS_229 } = __VLS_227.slots;
        let __VLS_230;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
            modelValue: (__VLS_ctx.editForm.virtualRemark),
            type: "textarea",
            rows: (2),
            placeholder: "虚拟客户备注",
        }));
        const __VLS_232 = __VLS_231({
            modelValue: (__VLS_ctx.editForm.virtualRemark),
            type: "textarea",
            rows: (2),
            placeholder: "虚拟客户备注",
        }, ...__VLS_functionalComponentArgsRest(__VLS_231));
        // @ts-ignore
        [editForm, editForm,];
        var __VLS_227;
    }
    // @ts-ignore
    [];
    var __VLS_148;
}
{
    const { footer: __VLS_235 } = __VLS_140.slots;
    let __VLS_236;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
        ...{ 'onClick': {} },
    }));
    const __VLS_238 = __VLS_237({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    let __VLS_241;
    const __VLS_242 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.editVisible = false;
            // @ts-ignore
            [editVisible,];
        },
    };
    const { default: __VLS_243 } = __VLS_239.slots;
    // @ts-ignore
    [];
    var __VLS_239;
    var __VLS_240;
    let __VLS_244;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_246 = __VLS_245({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    let __VLS_249;
    const __VLS_250 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleSave),
    };
    const { default: __VLS_251 } = __VLS_247.slots;
    // @ts-ignore
    [submitLoading, handleSave,];
    var __VLS_247;
    var __VLS_248;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_140;
var __VLS_141;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_151 = __VLS_150;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
