/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useI18n } from 'vue-i18n';
import { Dialog } from '@/utils/dialog';
import { delay } from '@/utils/utils';
import { rolePage } from '@/api/role';
import { userPage, deleteUser } from '@/api/user';
import UserCreate from '@/views/system/user/create.vue';
import { useButtonPermission } from '@/composables/useButtonPermission';
import { POPCONFIRM_CONFIG } from '@/config/elementConfig';
import { STATUS_OPTIONS, TYPE_OPTIONS, getLabelByValue, getColorByValue } from '@/constants/dict';
defineOptions({ name: 'UserView' });
const { t } = useI18n();
const menuStore = useMenuStore();
const userCreateRef = useTemplateRef('userCreateRef');
const basePageRef = useTemplateRef({});
// 搜索form配置
const searchFormConfig = ref([
    {
        label: t('user.username'),
        prop: 'username',
        type: 'elInput',
        attrs: { placeholder: t('placeholder.input') },
    },
    {
        label: t('user.name'),
        prop: 'name',
        type: 'elInput',
        attrs: { placeholder: t('placeholder.input') },
    },
    {
        label: t('user.status'),
        prop: 'status',
        type: 'elSelect',
        attrs: {
            placeholder: t('placeholder.select'),
            options: STATUS_OPTIONS,
        },
    },
]);
// 表格列配置
const columns = ref([
    { type: 'selection', width: 55 },
    { type: 'index', label: t('user.index'), width: 55, fixed: 'left' },
    { prop: 'username', label: t('user.username'), minWidth: 160 },
    { prop: 'name', label: t('user.name'), minWidth: 120 },
    { prop: 'phone', label: t('user.phone'), minWidth: 120 },
    { prop: 'email', label: t('user.email'), minWidth: 180 },
    { prop: 'roleId', label: t('user.role'), minWidth: 150 },
    { prop: 'isBuiltIn', label: t('user.type'), width: 100 },
    { prop: 'status', label: t('user.status') },
    { prop: 'createTime', label: t('user.createdAt'), minWidth: 180, sortable: 'custom' },
    { prop: 'updateTime', label: t('user.updatedAt'), minWidth: 180 },
    { prop: 'operation', label: t('user.actions'), width: 150, fixed: 'right' },
]);
// 角色列表（用于显示角色名称）
const roleList = ref([]);
// 删除用户的ids
const deleteUserIds = ref([]);
// 用户列表
const userList = ref([]);
// 数据总数
const total = ref(0);
// 表格loading
const loading = ref(false);
// 表格选中行的变化
const selectionChange = (rows) => {
    deleteUserIds.value = rows.map((r) => r.id);
};
// 获取角色名称
const getRoleName = (roleId) => {
    const role = roleList.value.find((r) => r.id === roleId);
    return role?.name || roleId;
};
// 获取角色列表
const getRoleList = async () => {
    const { data: res } = await rolePage({
        page: 1,
        pageSize: 1000, // 获取所有角色
        name: '',
        code: '',
        sortOrder: 'asc',
    });
    if (res.code !== 200)
        return;
    roleList.value = res.data?.list || [];
};
// 获取用户列表
const getUserList = async (queryForm, page, pageSize, sortField, sortOrder) => {
    loading.value = true;
    const params = {
        ...queryForm,
        page,
        pageSize,
        sortField,
        sortOrder,
    };
    try {
        await delay(1000);
        const { data: res } = await userPage(params);
        if (res.code !== 200)
            return;
        userList.value = res.data?.list || [];
        total.value = res.data?.total || 0;
    }
    finally {
        loading.value = false;
    }
};
// 批量删除用户dialog
const openDeleteDialog = () => {
    Dialog.confirm({
        title: t('user.deleteUserDialogTitle'),
        content: `${t('user.deleteUserDialogContent1')} ${deleteUserIds.value.length} ${t('user.deleteUserDialogContent2')}`,
        confirmText: t('user.deleteUserConfirmText'),
        cancelText: t('user.deleteUserCancelText'),
        onConfirm: async () => {
            await deleteUserHandle(deleteUserIds.value);
        },
    });
};
// 删除用户
const deleteUserHandle = async (ids) => {
    const { data: res } = await deleteUser(ids);
    if (res.code !== 200)
        return;
    ElMessage.success(t('message.deleteSuccess'));
    refreshHandle('delete', ids.length);
};
// 刷新数据的方法
const refreshHandle = (type, deleteCount) => {
    if (type === 'create') {
        // 新增成功：跳转到第一页
        basePageRef.value?.refreshToFirstPage();
    }
    else if (type === 'update') {
        // 编辑成功：停留在当前页
        basePageRef.value?.refreshCurrentPage();
    }
    else if (type === 'delete') {
        // 删除成功：智能刷新（传入删除的数量）
        basePageRef.value?.refreshAfterDelete(deleteCount || 1);
    }
};
onMounted(() => {
    getRoleList();
});
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
    tableData: (__VLS_ctx.userList),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onRefresh': {} },
    ...{ 'onSelectionChange': {} },
    ref: "basePageRef",
    formConfig: (__VLS_ctx.searchFormConfig),
    tableData: (__VLS_ctx.userList),
    columns: (__VLS_ctx.columns),
    total: (__VLS_ctx.total),
    tableLoading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.getUserList),
    ...{ selectionChange: {} },
    onSelectionChange: (__VLS_ctx.selectionChange),
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
        onClick: (...[$event]) => {
            __VLS_ctx.userCreateRef?.showDialog(undefined);
            // @ts-ignore
            [searchFormConfig, userList, columns, total, loading, getUserList, selectionChange, menuStore, userCreateRef,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['user:add']) }, null, null);
    const { default: __VLS_18 } = __VLS_14.slots;
    (__VLS_ctx.$t('button.addUser'));
    // @ts-ignore
    [vPermission, $t,];
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
        disabled: (!__VLS_ctx.useButtonPermission(['user:delete'], [() => !!__VLS_ctx.deleteUserIds.length]).value),
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
        type: "danger",
        icon: (__VLS_ctx.menuStore.iconComponents.Delete),
        disabled: (!__VLS_ctx.useButtonPermission(['user:delete'], [() => !!__VLS_ctx.deleteUserIds.length]).value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.openDeleteDialog),
    };
    const { default: __VLS_26 } = __VLS_22.slots;
    (__VLS_ctx.$t('button.batchDelete'));
    // @ts-ignore
    [menuStore, $t, useButtonPermission, deleteUserIds, openDeleteDialog,];
    var __VLS_22;
    var __VLS_23;
    // @ts-ignore
    [];
}
{
    const { roleId: __VLS_27 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_27);
    if (row.roleId) {
        let __VLS_28;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
            text: (__VLS_ctx.getRoleName(row.roleId)),
        }));
        const __VLS_30 = __VLS_29({
            text: (__VLS_ctx.getRoleName(row.roleId)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    // @ts-ignore
    [getRoleName,];
}
{
    const { isBuiltIn: __VLS_33 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_33);
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.TYPE_OPTIONS, row.isBuiltIn)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.TYPE_OPTIONS, row.isBuiltIn)),
    }));
    const __VLS_36 = __VLS_35({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.TYPE_OPTIONS, row.isBuiltIn)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.TYPE_OPTIONS, row.isBuiltIn)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    // @ts-ignore
    [getColorByValue, TYPE_OPTIONS, TYPE_OPTIONS, getLabelByValue,];
}
{
    const { status: __VLS_39 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_39);
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }));
    const __VLS_42 = __VLS_41({
        type: (__VLS_ctx.getColorByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
        text: (__VLS_ctx.getLabelByValue(__VLS_ctx.STATUS_OPTIONS, row.status)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [getColorByValue, getLabelByValue, STATUS_OPTIONS, STATUS_OPTIONS,];
}
{
    const { operation: __VLS_45 } = __VLS_3.slots;
    const [{ row }] = __VLS_vSlot(__VLS_45);
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.userCreateRef?.showDialog(row.id);
            // @ts-ignore
            [userCreateRef,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['user:edit']) }, null, null);
    const { default: __VLS_53 } = __VLS_49.slots;
    (__VLS_ctx.$t('button.edit'));
    // @ts-ignore
    [vPermission, $t,];
    var __VLS_49;
    var __VLS_50;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
    elPopconfirm;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        ...{ 'onConfirm': {} },
        title: (__VLS_ctx.$t('user.deleteUserPopconfirm')),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }));
    const __VLS_56 = __VLS_55({
        ...{ 'onConfirm': {} },
        title: (__VLS_ctx.$t('user.deleteUserPopconfirm')),
        placement: (__VLS_ctx.POPCONFIRM_CONFIG.placement),
        width: (__VLS_ctx.POPCONFIRM_CONFIG.width),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    let __VLS_59;
    const __VLS_60 = {
        ...{ confirm: {} },
        onConfirm: (...[$event]) => {
            __VLS_ctx.deleteUserHandle([row.id]);
            // @ts-ignore
            [$t, POPCONFIRM_CONFIG, POPCONFIRM_CONFIG, deleteUserHandle,];
        },
    };
    const { default: __VLS_61 } = __VLS_57.slots;
    {
        const { reference: __VLS_62 } = __VLS_57.slots;
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            type: "danger",
            link: true,
        }));
        const __VLS_65 = __VLS_64({
            type: "danger",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        __VLS_asFunctionalDirective(__VLS_directives.vPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (['user:delete']) }, null, null);
        const { default: __VLS_68 } = __VLS_66.slots;
        (__VLS_ctx.$t('button.delete'));
        // @ts-ignore
        [vPermission, $t,];
        var __VLS_66;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_57;
    var __VLS_58;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
const __VLS_69 = UserCreate;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    ...{ 'onRefresh': {} },
    ref: "userCreateRef",
}));
const __VLS_71 = __VLS_70({
    ...{ 'onRefresh': {} },
    ref: "userCreateRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
const __VLS_75 = {
    ...{ refresh: {} },
    onRefresh: (__VLS_ctx.refreshHandle),
};
var __VLS_76;
var __VLS_72;
var __VLS_73;
// @ts-ignore
var __VLS_8 = __VLS_7, __VLS_77 = __VLS_76;
// @ts-ignore
[refreshHandle,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
