/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import LeftMode from '@/layouts/leftMode.vue';
import TopMode from '@/layouts/topMode.vue';
import ThemeConfig from '@/components/ThemeConfig.vue';
import MenuView from '@/layouts/menu.vue';
defineOptions({ name: 'LayoutView' });
const menuStore = useMenuStore();
const themeStore = useThemeStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-container" },
});
/** @type {__VLS_StyleScopedClasses['layout-container']} */ ;
if (__VLS_ctx.themeStore.themeConfig.layout === 'leftMode') {
    const __VLS_0 = LeftMode;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else {
    const __VLS_5 = TopMode;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
const __VLS_10 = ThemeConfig;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    modelValue: (__VLS_ctx.menuStore.isMobileMenuOpen),
    direction: ('ltr'),
    withHeader: (false),
    size: (220),
    ...{ class: "mobile-menu-drawer" },
}));
const __VLS_17 = __VLS_16({
    modelValue: (__VLS_ctx.menuStore.isMobileMenuOpen),
    direction: ('ltr'),
    withHeader: (false),
    size: (220),
    ...{ class: "mobile-menu-drawer" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
/** @type {__VLS_StyleScopedClasses['mobile-menu-drawer']} */ ;
const { default: __VLS_20 } = __VLS_18.slots;
const __VLS_21 = MenuView;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[themeStore, menuStore,];
var __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
