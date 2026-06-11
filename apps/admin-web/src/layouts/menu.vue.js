/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
import MenuItem from '@/layouts/menuItem.vue';
defineOptions({ name: 'MenuView' });
const menuStore = useMenuStore();
const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();
// 当前激活的菜单项
const activeMenu = computed(() => route.path);
// 菜单模式
const menuMode = computed(() => {
    if (menuStore.isMobile)
        return 'vertical';
    return themeStore.themeConfig.layout === 'topMode' ? 'horizontal' : 'vertical';
});
// 菜单颜色配置
const menuBackgroundColor = computed(() => {
    if (themeStore.themeConfig.themeMode === 'dark')
        return '#141414';
    if (themeStore.themeConfig.layout === 'topMode')
        return '#ffffff';
    return themeStore.themeConfig.sidebarMode === 'dark' ? '#141414' : '#ffffff';
});
const menuTextColor = computed(() => {
    if (themeStore.themeConfig.themeMode === 'dark')
        return '#e5e7eb';
    if (themeStore.themeConfig.layout === 'topMode')
        return '#303133';
    return themeStore.themeConfig.sidebarMode === 'dark' ? '#e5e7eb' : '#303133';
});
const menuActiveTextColor = computed(() => {
    return themeStore.themeConfig.primaryColor;
});
const logoTitleColor = computed(() => {
    if (themeStore.themeConfig.layout === 'topMode')
        return '';
    if (themeStore.themeConfig.sidebarMode === 'dark')
        return '#ffffff';
    return '';
});
const navigation = (key) => {
    router.push(key);
    // 移动端点击菜单项后自动关闭抽屉
    if (menuStore.isMobile && menuStore.isMobileMenuOpen) {
        menuStore.isMobileMenuOpen = false;
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['menu-container']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-menu-item']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu'] | typeof __VLS_components.elMenu | typeof __VLS_components.ElMenu | typeof __VLS_components['el-menu']} */
elMenu;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activeMenu),
    collapse: (__VLS_ctx.menuStore.isCollapse),
    backgroundColor: (__VLS_ctx.menuBackgroundColor),
    textColor: (__VLS_ctx.menuTextColor),
    activeTextColor: (__VLS_ctx.menuActiveTextColor),
    mode: (__VLS_ctx.menuMode),
    ...{ class: "menu-container" },
    ...{ class: ({ '--menu-border': __VLS_ctx.menuStore.isMobile }) },
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSelect': {} },
    defaultActive: (__VLS_ctx.activeMenu),
    collapse: (__VLS_ctx.menuStore.isCollapse),
    backgroundColor: (__VLS_ctx.menuBackgroundColor),
    textColor: (__VLS_ctx.menuTextColor),
    activeTextColor: (__VLS_ctx.menuActiveTextColor),
    mode: (__VLS_ctx.menuMode),
    ...{ class: "menu-container" },
    ...{ class: ({ '--menu-border': __VLS_ctx.menuStore.isMobile }) },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    ...{ select: {} },
    onSelect: (__VLS_ctx.navigation),
};
/** @type {__VLS_StyleScopedClasses['menu-container']} */ ;
/** @type {__VLS_StyleScopedClasses['--menu-border']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    name: "bounce",
}));
const __VLS_17 = __VLS_16({
    name: "bounce",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
if (__VLS_ctx.themeStore.themeConfig.showLogo) {
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item'] | typeof __VLS_components.elMenuItem | typeof __VLS_components.ElMenuItem | typeof __VLS_components['el-menu-item']} */
    elMenuItem;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ class: "logo" },
    }));
    const __VLS_23 = __VLS_22({
        ...{ class: "logo" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    /** @type {__VLS_StyleScopedClasses['logo']} */ ;
    const { default: __VLS_26 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.APP_CONFIG.logoSrc),
        alt: "logo",
        ...{ class: "logo-img" },
    });
    /** @type {__VLS_StyleScopedClasses['logo-img']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "logo-title" },
        ...{ style: ({ color: __VLS_ctx.logoTitleColor }) },
    });
    /** @type {__VLS_StyleScopedClasses['logo-title']} */ ;
    (__VLS_ctx.APP_CONFIG.name);
    // @ts-ignore
    [activeMenu, menuStore, menuStore, menuBackgroundColor, menuTextColor, menuActiveTextColor, menuMode, navigation, themeStore, APP_CONFIG, APP_CONFIG, logoTitleColor,];
    var __VLS_24;
}
// @ts-ignore
[];
var __VLS_18;
for (const [item] of __VLS_vFor((__VLS_ctx.menuStore.menuList))) {
    const __VLS_27 = MenuItem;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        key: (item.path),
        item: (item),
    }));
    const __VLS_29 = __VLS_28({
        key: (item.path),
        item: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [menuStore,];
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
