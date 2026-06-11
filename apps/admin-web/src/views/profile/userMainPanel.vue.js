/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const userStore = useUserStore();
const menuStore = useMenuStore();
// 统计数据
const stats = ref([
    { label: '系统工单', value: 1284 },
    { label: '代码质量', value: 98 },
    { label: '负责项目', value: 15 },
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
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between flex-col xl:flex-row gap-8 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 flex-col md:flex-row md:gap-8" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['md:gap-8']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    name: "flip",
}));
const __VLS_9 = __VLS_8({
    name: "flip",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "relative shrink-0" },
});
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    size: (110),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}));
const __VLS_15 = __VLS_14({
    size: (110),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "absolute h-5 w-5 bottom-2 right-2 rounded-full border-3 border-(--el-bg-color) bg-(--el-color-success)" },
});
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-bg-color)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-success)']} */ ;
// @ts-ignore
[userStore,];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col gap-4 items-center md:items-start text-center md:text-left" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    text: (__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username),
    clickable: (false),
    ...{ class: "text-2xl font-extrabold" },
}));
const __VLS_20 = __VLS_19({
    text: (__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username),
    clickable: (false),
    ...{ class: "text-2xl font-extrabold" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-extrabold']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.data, __VLS_intrinsics.data)({});
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    icon: "HOutline:CheckBadgeIcon",
    type: "primary",
    tooltip: "实名认证用户",
}));
const __VLS_25 = __VLS_24({
    icon: "HOutline:CheckBadgeIcon",
    type: "primary",
    tooltip: "实名认证用户",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
TextEllipsis;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    text: (`“ ${__VLS_ctx.userStore.userInfo?.bio} ”`),
    ...{ class: "italic text-sm text-(--el-text-color-regular)" },
}));
const __VLS_30 = __VLS_29({
    text: (`“ ${__VLS_ctx.userStore.userInfo?.bio} ”`),
    ...{ class: "italic text-sm text-(--el-text-color-regular)" },
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-2 text-sm font-semibold px-3 py-2 text-(--el-text-color-primary) bg-(--el-bg-color-page) rounded-lg" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
const __VLS_39 = (__VLS_ctx.menuStore.iconComponents['HOutline:MapPinIcon']);
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    ...{ class: "text-indigo-500" },
}));
const __VLS_41 = __VLS_40({
    ...{ class: "text-indigo-500" },
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
/** @type {__VLS_StyleScopedClasses['text-indigo-500']} */ ;
// @ts-ignore
[userStore, userStore, userStore, menuStore,];
var __VLS_36;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-xs" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
(__VLS_ctx.userStore.address.country);
(__VLS_ctx.userStore.address.region);
(__VLS_ctx.userStore.address.city);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex gap-7" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-7']} */ ;
for (const [stat] of __VLS_vFor((__VLS_ctx.stats))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (stat.label),
        ...{ class: "flex items-center gap-5" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elStatistic | typeof __VLS_components.ElStatistic | typeof __VLS_components['el-statistic'] | typeof __VLS_components.elStatistic | typeof __VLS_components.ElStatistic | typeof __VLS_components['el-statistic']} */
    elStatistic;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        value: (stat.value),
        title: (stat.label),
        ...{ class: "text-center" },
    }));
    const __VLS_46 = __VLS_45({
        value: (stat.value),
        title: (stat.label),
        ...{ class: "text-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    const { default: __VLS_49 } = __VLS_47.slots;
    if (stat.label === '代码质量') {
        {
            const { suffix: __VLS_50 } = __VLS_47.slots;
            // @ts-ignore
            [userStore, userStore, userStore, stats,];
        }
    }
    // @ts-ignore
    [];
    var __VLS_47;
    if (stat !== __VLS_ctx.stats[__VLS_ctx.stats.length - 1]) {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
        elDivider;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            direction: "vertical",
        }));
        const __VLS_53 = __VLS_52({
            direction: "vertical",
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    }
    // @ts-ignore
    [stats, stats,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-9 flex justify-center xl:justify-start" },
});
/** @type {__VLS_StyleScopedClasses['mt-9']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['xl:justify-start']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-full" },
});
/** @type {__VLS_StyleScopedClasses['max-w-full']} */ ;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.BadgeTabsMenu} */
BadgeTabsMenu;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.userStore.currentTab),
    iconOnly: (__VLS_ctx.menuStore.isMobile ? true : false),
    tabsMenuData: (__VLS_ctx.userStore.menuTabs),
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.userStore.currentTab),
    iconOnly: (__VLS_ctx.menuStore.isMobile ? true : false),
    tabsMenuData: (__VLS_ctx.userStore.menuTabs),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[userStore, userStore, menuStore,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
