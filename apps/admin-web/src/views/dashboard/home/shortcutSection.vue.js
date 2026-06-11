/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const router = useRouter();
const menuStore = useMenuStore();
const shortcuts = ref([
    { label: '控制台', icon: 'HOutline:ChartBarIcon', color: '#ef4444', path: '/dashboard/overview' },
    { label: '客户管理', icon: 'HOutline:UserGroupIcon', color: '#f59e0b', path: '/user/customer' },
    {
        label: '商家管理',
        icon: 'HOutline:BuildingStorefrontIcon',
        color: '#10b981',
        path: '/user/merchant',
    },
    { label: '商品管理', icon: 'HOutline:ShoppingBagIcon', color: '#4f46e5', path: '/product/list' },
    { label: '订单', icon: 'HOutline:DocumentTextIcon', color: '#ec4899', path: '/order/list' },
    {
        label: '财务中心',
        icon: 'HOutline:CurrencyDollarIcon',
        color: '#8b5cf6',
        path: '/finance/overview',
    },
    {
        label: '客服管理',
        icon: 'HOutline:ChatBubbleLeftRightIcon',
        color: '#06b6d4',
        path: '/support/customer-merchant',
    },
    {
        label: '操作日志',
        icon: 'HOutline:ClipboardDocumentListIcon',
        color: '#f97316',
        path: '/system/audit-log',
    },
]);
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "便捷工具",
    titleIcon: "HOutline:WrenchScrewdriverIcon",
}));
const __VLS_2 = __VLS_1({
    title: "便捷工具",
    titleIcon: "HOutline:WrenchScrewdriverIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-4 gap-6" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-6']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.shortcuts))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.router.push(item.path);
                // @ts-ignore
                [shortcuts, router,];
            } },
        key: (item.label),
    });
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        name: "jelly",
        intensity: "normal",
    }));
    const __VLS_9 = __VLS_8({
        name: "jelly",
        intensity: "normal",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "group flex flex-col items-center gap-3 py-3 rounded-2xl transition-all duration-300 hover:bg-(--el-bg-color-page)" },
    });
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:bg-(--el-bg-color-page)']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-14 h-14 bg-(--el-bg-color-page) flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-(--el-bg-color)" },
    });
    /** @type {__VLS_StyleScopedClasses['w-14']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-14']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:bg-(--el-bg-color)']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        size: "26",
        ...{ style: ({ color: item.color }) },
    }));
    const __VLS_15 = __VLS_14({
        size: "26",
        ...{ style: ({ color: item.color }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    const __VLS_19 = (__VLS_ctx.menuStore.iconComponents[item.icon]);
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    // @ts-ignore
    [menuStore,];
    var __VLS_16;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-[13px] font-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-[13px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    (item.label);
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
