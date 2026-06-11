/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const langStore = useLangStore();
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['language-code']} */ ;
/** @type {__VLS_StyleScopedClasses['language-name']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dropdown-menu__item']} */ ;
/** @type {__VLS_StyleScopedClasses['language-code']} */ ;
/** @type {__VLS_StyleScopedClasses['language-name']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    trigger: "click",
    showArrow: (false),
    popperClass: "i18n-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    trigger: "click",
    showArrow: (false),
    popperClass: "i18n-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    name: "rotate",
}));
const __VLS_9 = __VLS_8({
    name: "rotate",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    icon: "HOutline:GlobeAltIcon",
}));
const __VLS_15 = __VLS_14({
    icon: "HOutline:GlobeAltIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_10;
{
    const { dropdown: __VLS_18 } = __VLS_3.slots;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
    const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const { default: __VLS_24 } = __VLS_22.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.langStore.langOptions))) {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            ...{ 'onClick': {} },
            key: (item.code),
            ...{ class: ({ 'is-active': __VLS_ctx.langStore.currentLang === item.code }) },
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onClick': {} },
            key: (item.code),
            ...{ class: ({ 'is-active': __VLS_ctx.langStore.currentLang === item.code }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_30;
        const __VLS_31 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                __VLS_ctx.langStore.setLang(item.code);
                // @ts-ignore
                [langStore, langStore, langStore,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
        const { default: __VLS_32 } = __VLS_28.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "language-code" },
        });
        /** @type {__VLS_StyleScopedClasses['language-code']} */ ;
        (item.shortCode);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "language-name" },
        });
        /** @type {__VLS_StyleScopedClasses['language-name']} */ ;
        (item.label);
        // @ts-ignore
        [];
        var __VLS_28;
        var __VLS_29;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_22;
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
