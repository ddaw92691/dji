/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import HeaderView from '@/layouts/header.vue';
import MenuView from '@/layouts/menu.vue';
import TabsView from '@/layouts/tabsView.vue';
defineOptions({ name: 'LeftMode' });
const tabsStore = useTabsStore();
const themeStore = useThemeStore();
const menuStore = useMenuStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer | typeof __VLS_components['el-container'] | typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer | typeof __VLS_components['el-container']} */
elContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "left-mode-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "left-mode-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['left-mode-container']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (!__VLS_ctx.menuStore.isMobile) {
    const __VLS_7 = MenuView;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ class: "menu-view" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "menu-view" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['menu-view']} */ ;
}
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer | typeof __VLS_components['el-container'] | typeof __VLS_components.elContainer | typeof __VLS_components.ElContainer | typeof __VLS_components['el-container']} */
elContainer;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader | typeof __VLS_components['el-header'] | typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader | typeof __VLS_components['el-header']} */
elHeader;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "header" },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['header']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
const __VLS_24 = HeaderView;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[menuStore,];
var __VLS_21;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_31 = __VLS_30({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
if (__VLS_ctx.themeStore.themeConfig.showTabs) {
    const __VLS_35 = TabsView;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({}));
    const __VLS_37 = __VLS_36({}, ...__VLS_functionalComponentArgsRest(__VLS_36));
}
// @ts-ignore
[themeStore,];
var __VLS_32;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elMain | typeof __VLS_components.ElMain | typeof __VLS_components['el-main'] | typeof __VLS_components.elMain | typeof __VLS_components.ElMain | typeof __VLS_components['el-main']} */
elMain;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    ...{ class: "main" },
}));
const __VLS_48 = __VLS_47({
    ...{ class: "main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
/** @type {__VLS_StyleScopedClasses['main']} */ ;
const { default: __VLS_51 } = __VLS_49.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.RouterView | typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
{
    const { default: __VLS_57 } = __VLS_55.slots;
    const [{ Component, route }] = __VLS_vSlot(__VLS_57);
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        name: "fade-slide",
        mode: "out-in",
    }));
    const __VLS_60 = __VLS_59({
        name: "fade-slide",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.KeepAlive | typeof __VLS_components.KeepAlive} */
    KeepAlive;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        include: (__VLS_ctx.tabsStore.tabs.map((tab) => tab.name)),
    }));
    const __VLS_66 = __VLS_65({
        include: (__VLS_ctx.tabsStore.tabs.map((tab) => tab.name)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    const __VLS_70 = (Component);
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        key: (route.path),
    }));
    const __VLS_72 = __VLS_71({
        key: (route.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    // @ts-ignore
    [tabsStore,];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_61;
    // @ts-ignore
    [];
    __VLS_55.slots['' /* empty slot name completion */];
}
var __VLS_55;
// @ts-ignore
[];
var __VLS_49;
// @ts-ignore
[];
var __VLS_43;
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
