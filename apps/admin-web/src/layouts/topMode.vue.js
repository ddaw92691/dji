/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import HeaderView from '@/layouts/header.vue';
import TabsView from '@/layouts/tabsView.vue';
defineOptions({ name: 'TopMode' });
const themeStore = useThemeStore();
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
    ...{ class: "top-mode-container" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "top-mode-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['top-mode-container']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader | typeof __VLS_components['el-header'] | typeof __VLS_components.elHeader | typeof __VLS_components.ElHeader | typeof __VLS_components['el-header']} */
elHeader;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "header" },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['header']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
const __VLS_13 = HeaderView;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_10;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_20 = __VLS_19({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
if (__VLS_ctx.themeStore.themeConfig.showTabs) {
    const __VLS_24 = TabsView;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
// @ts-ignore
[themeStore,];
var __VLS_21;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elMain | typeof __VLS_components.ElMain | typeof __VLS_components['el-main'] | typeof __VLS_components.elMain | typeof __VLS_components.ElMain | typeof __VLS_components['el-main']} */
elMain;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ...{ class: "main" },
}));
const __VLS_37 = __VLS_36({
    ...{ class: "main" },
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
/** @type {__VLS_StyleScopedClasses['main']} */ ;
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.RouterView | typeof __VLS_components.RouterView} */
RouterView;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
{
    const { default: __VLS_46 } = __VLS_44.slots;
    const [{ Component, route }] = __VLS_vSlot(__VLS_46);
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        name: "fade-slide",
        mode: "out-in",
    }));
    const __VLS_49 = __VLS_48({
        name: "fade-slide",
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    const { default: __VLS_52 } = __VLS_50.slots;
    const __VLS_53 = (Component);
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        key: (route.path),
    }));
    const __VLS_55 = __VLS_54({
        key: (route.path),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    // @ts-ignore
    [];
    var __VLS_50;
    // @ts-ignore
    [];
    __VLS_44.slots['' /* empty slot name completion */];
}
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
// @ts-ignore
[];
var __VLS_32;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
