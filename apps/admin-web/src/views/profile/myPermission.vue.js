/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { menuPage } from '@/api/menu';
import { TABLE_CONFIG } from '@/config/elementConfig';
const menuStore = useMenuStore();
const userStore = useUserStore();
const loading = ref(false);
// 菜单列表
const menuList = ref([]);
// 总共的权限数量
const authorizedCount = computed(() => {
    const countAuth = (list) => {
        let count = 0;
        list.forEach((item) => {
            if (item.id)
                count++;
            if (item.children)
                count += countAuth(item.children);
        });
        return count;
    };
    return countAuth(menuList.value);
});
// 当前角色权限id列表
const currentRolePermission = computed(() => {
    return userStore.roleList.filter((role) => role.id === userStore.userInfo?.roleId)[0]?.menuIds;
});
// 获取当前权限标签
const getPermissionTag = (menuId) => {
    const enabled = currentRolePermission.value?.some((item) => item === menuId);
    return {
        type: enabled ? 'success' : 'danger',
        text: enabled ? '已启用' : '未授权',
    };
};
// 获取菜单列表
const getMenuList = async () => {
    loading.value = true;
    try {
        const { data: res } = await menuPage();
        if (res.code !== 200)
            return;
        menuList.value = res.data || [];
    }
    finally {
        loading.value = false;
    }
};
onMounted(() => {
    getMenuList();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col md:flex-row md:items-end justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:items-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-2" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-3" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-2xl font-semibold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        text: (__VLS_ctx.userStore.userRoleName),
    }));
    const __VLS_10 = __VLS_9({
        text: (__VLS_ctx.userStore.userRoleName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-(--el-text-color-secondary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-center gap-10 mt-6 md:mt-0 pr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:mt-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['pr-4']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elStatistic | typeof __VLS_components.ElStatistic | typeof __VLS_components['el-statistic']} */
    elStatistic;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        value: (__VLS_ctx.currentRolePermission?.length),
        title: "已开启权限",
        ...{ class: "text-center" },
    }));
    const __VLS_15 = __VLS_14({
        value: (__VLS_ctx.currentRolePermission?.length),
        title: "已开启权限",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        direction: "vertical",
    }));
    const __VLS_20 = __VLS_19({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elStatistic | typeof __VLS_components.ElStatistic | typeof __VLS_components['el-statistic']} */
    elStatistic;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        value: (__VLS_ctx.authorizedCount),
        title: "权限总数",
        ...{ class: "text-center" },
    }));
    const __VLS_25 = __VLS_24({
        value: (__VLS_ctx.authorizedCount),
        title: "权限总数",
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    // @ts-ignore
    [userStore, currentRolePermission, authorizedCount,];
}
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
elTable;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    data: (__VLS_ctx.menuList),
    border: (__VLS_ctx.TABLE_CONFIG.border),
    rowKey: "id",
    treeProps: ({ children: 'children', hasChildren: 'hasChildren' }),
    defaultExpandAll: true,
    showOverflowTooltip: true,
}));
const __VLS_30 = __VLS_29({
    data: (__VLS_ctx.menuList),
    border: (__VLS_ctx.TABLE_CONFIG.border),
    rowKey: "id",
    treeProps: ({ children: 'children', hasChildren: 'hasChildren' }),
    defaultExpandAll: true,
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    prop: "title",
    label: "菜单/功能名称",
    minWidth: "200",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}));
const __VLS_36 = __VLS_35({
    prop: "title",
    label: "菜单/功能名称",
    minWidth: "200",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    prop: "type",
    label: "类型",
    minWidth: "100",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}));
const __VLS_41 = __VLS_40({
    prop: "type",
    label: "类型",
    minWidth: "100",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
{
    const { default: __VLS_45 } = __VLS_42.slots;
    const [{ row }] = __VLS_vSlot(__VLS_45);
    if (row.type === 'directory') {
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            type: "info",
            text: "目录",
        }));
        const __VLS_48 = __VLS_47({
            type: "info",
            text: "目录",
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    }
    else if (row.type === 'menu') {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            type: "primary",
            text: "菜单",
        }));
        const __VLS_53 = __VLS_52({
            type: "primary",
            text: "菜单",
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    }
    else if (row.type === 'button') {
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
        BaseTag;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            type: "warning",
            text: "按钮",
        }));
        const __VLS_58 = __VLS_57({
            type: "warning",
            text: "按钮",
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    }
    // @ts-ignore
    [menuList, TABLE_CONFIG, TABLE_CONFIG, TABLE_CONFIG, vLoading, loading,];
}
// @ts-ignore
[];
var __VLS_42;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    prop: "path",
    label: "菜单路径",
    minWidth: "250",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}));
const __VLS_63 = __VLS_62({
    prop: "path",
    label: "菜单路径",
    minWidth: "250",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    prop: "icon",
    label: "图标",
    minWidth: "100",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}));
const __VLS_68 = __VLS_67({
    prop: "icon",
    label: "图标",
    minWidth: "100",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_71 } = __VLS_69.slots;
{
    const { default: __VLS_72 } = __VLS_69.slots;
    const [{ row }] = __VLS_vSlot(__VLS_72);
    if (row.icon) {
        let __VLS_73;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({}));
        const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
        const { default: __VLS_78 } = __VLS_76.slots;
        const __VLS_79 = (__VLS_ctx.menuStore.iconComponents[row.icon]);
        // @ts-ignore
        const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({}));
        const __VLS_81 = __VLS_80({}, ...__VLS_functionalComponentArgsRest(__VLS_80));
        // @ts-ignore
        [TABLE_CONFIG, TABLE_CONFIG, menuStore,];
        var __VLS_76;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_69;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    label: "权限状态",
    width: "150",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}));
const __VLS_86 = __VLS_85({
    label: "权限状态",
    width: "150",
    align: (__VLS_ctx.TABLE_CONFIG.align),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
{
    const { default: __VLS_90 } = __VLS_87.slots;
    const [{ row }] = __VLS_vSlot(__VLS_90, (_) => []);
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        type: (__VLS_ctx.getPermissionTag(row.id).type),
        text: (__VLS_ctx.getPermissionTag(row.id).text),
    }));
    const __VLS_93 = __VLS_92({
        type: (__VLS_ctx.getPermissionTag(row.id).type),
        text: (__VLS_ctx.getPermissionTag(row.id).text),
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    // @ts-ignore
    [TABLE_CONFIG, getPermissionTag, getPermissionTag,];
}
// @ts-ignore
[];
var __VLS_87;
// @ts-ignore
[];
var __VLS_31;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
