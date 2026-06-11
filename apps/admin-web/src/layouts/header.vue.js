/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
import MenuView from '@/layouts/menu.vue';
import UserDropdown from '@/layouts/userDropdown.vue';
import BreadcrumbView from '@/layouts/breadcrumb.vue';
import NotificationDropdown from '@/layouts/notificationDropdown.vue';
import I18nDropdown from '@/layouts/i18nDropdown.vue';
import { useFullscreen } from '@vueuse/core';
defineOptions({ name: 'HeaderView' });
const menuStore = useMenuStore();
const themeStore = useThemeStore();
// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
// 显示顶部菜单
const showTopMenu = computed(() => {
    return themeStore.themeConfig.layout === 'topMode' && !menuStore.isMobile;
});
// 处理菜单切换
const handleMenuToggle = () => {
    if (menuStore.isMobile) {
        menuStore.toggleMobileMenu();
    }
    else {
        menuStore.toggleCollapse();
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-container" },
});
/** @type {__VLS_StyleScopedClasses['header-container']} */ ;
if (__VLS_ctx.showTopMenu) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "menu-container" },
    });
    /** @type {__VLS_StyleScopedClasses['menu-container']} */ ;
    const __VLS_0 = MenuView;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "header-left" },
    });
    /** @type {__VLS_StyleScopedClasses['header-left']} */ ;
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        name: "rubber",
    }));
    const __VLS_7 = __VLS_6({
        name: "rubber",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_10 } = __VLS_8.slots;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.isMobile
            ? 'HOutline:Bars3CenterLeftIcon'
            : __VLS_ctx.menuStore.isCollapse
                ? 'HOutline:Bars3BottomRightIcon'
                : 'HOutline:Bars3BottomLeftIcon'),
        tooltip: (__VLS_ctx.menuStore.isMobile ? __VLS_ctx.$t('tooltip.expandMenu') : __VLS_ctx.$t('tooltip.collapseMenu')),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.isMobile
            ? 'HOutline:Bars3CenterLeftIcon'
            : __VLS_ctx.menuStore.isCollapse
                ? 'HOutline:Bars3BottomRightIcon'
                : 'HOutline:Bars3BottomLeftIcon'),
        tooltip: (__VLS_ctx.menuStore.isMobile ? __VLS_ctx.$t('tooltip.expandMenu') : __VLS_ctx.$t('tooltip.collapseMenu')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.handleMenuToggle),
    };
    var __VLS_14;
    var __VLS_15;
    // @ts-ignore
    [showTopMenu, menuStore, menuStore, menuStore, $t, $t, handleMenuToggle,];
    var __VLS_8;
    if (!__VLS_ctx.menuStore.isMobile) {
        const __VLS_18 = BreadcrumbView;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            showIcon: (false),
        }));
        const __VLS_20 = __VLS_19({
            showIcon: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-right" },
});
/** @type {__VLS_StyleScopedClasses['header-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "action-buttons" },
});
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
if (__VLS_ctx.APP_CONFIG.showThemeConfig) {
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        name: "rotate",
    }));
    const __VLS_25 = __VLS_24({
        name: "rotate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const { default: __VLS_28 } = __VLS_26.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        icon: "HOutline:Cog6ToothIcon",
        tooltip: (__VLS_ctx.$t('tooltip.themeConfig')),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        icon: "HOutline:Cog6ToothIcon",
        tooltip: (__VLS_ctx.$t('tooltip.themeConfig')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.APP_CONFIG.showThemeConfig))
                return;
            __VLS_ctx.themeStore.themeConfigDrawerOpen = true;
            // @ts-ignore
            [menuStore, $t, APP_CONFIG, themeStore,];
        },
    };
    var __VLS_32;
    var __VLS_33;
    // @ts-ignore
    [];
    var __VLS_26;
}
if (__VLS_ctx.APP_CONFIG.showFullscreen) {
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        name: "pulse",
    }));
    const __VLS_38 = __VLS_37({
        name: "pulse",
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    const { default: __VLS_41 } = __VLS_39.slots;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
        tooltip: (__VLS_ctx.isFullscreen ? __VLS_ctx.$t('tooltip.exitFullScreen') : __VLS_ctx.$t('tooltip.fullScreen')),
        icon: (__VLS_ctx.isFullscreen ? 'HOutline:ArrowsPointingInIcon' : 'HOutline:ArrowsPointingOutIcon'),
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
        tooltip: (__VLS_ctx.isFullscreen ? __VLS_ctx.$t('tooltip.exitFullScreen') : __VLS_ctx.$t('tooltip.fullScreen')),
        icon: (__VLS_ctx.isFullscreen ? 'HOutline:ArrowsPointingInIcon' : 'HOutline:ArrowsPointingOutIcon'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.toggleFullscreen),
    };
    var __VLS_45;
    var __VLS_46;
    // @ts-ignore
    [$t, $t, APP_CONFIG, isFullscreen, isFullscreen, toggleFullscreen,];
    var __VLS_39;
}
if (__VLS_ctx.APP_CONFIG.showI18n) {
    const __VLS_49 = I18nDropdown;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
}
if (__VLS_ctx.APP_CONFIG.showNotification) {
    const __VLS_54 = NotificationDropdown;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({}));
    const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
}
const __VLS_59 = UserDropdown;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
// @ts-ignore
[APP_CONFIG, APP_CONFIG,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
