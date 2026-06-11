/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const menuStore = useMenuStore();
const __VLS_props = defineProps();
const emits = defineEmits();
const command = (value) => {
    emits('update:modelValue', value);
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['size-menu-item']} */ ;
/** @type {__VLS_StyleScopedClasses['el-dropdown-menu__item']} */ ;
/** @type {__VLS_StyleScopedClasses['size-menu-item']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onCommand': {} },
    trigger: "click",
    showArrow: (false),
    popperClass: "table-size-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onCommand': {} },
    trigger: "click",
    showArrow: (false),
    popperClass: "table-size-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ command: {} },
    onCommand: (__VLS_ctx.command),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    icon: "HOutline:QueueListIcon",
    tooltip: "表格尺寸",
    size: "1.75rem",
    iconSize: "20px",
}));
const __VLS_11 = __VLS_10({
    icon: "HOutline:QueueListIcon",
    tooltip: "表格尺寸",
    size: "1.75rem",
    iconSize: "20px",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
{
    const { dropdown: __VLS_14 } = __VLS_3.slots;
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
    const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
    const { default: __VLS_20 } = __VLS_18.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        command: "large",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'large' }) },
    }));
    const __VLS_23 = __VLS_22({
        command: "large",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'large' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    const { default: __VLS_26 } = __VLS_24.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "size-menu-item" },
    });
    /** @type {__VLS_StyleScopedClasses['size-menu-item']} */ ;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        size: "16",
    }));
    const __VLS_29 = __VLS_28({
        size: "16",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    const { default: __VLS_32 } = __VLS_30.slots;
    const __VLS_33 = (__VLS_ctx.menuStore.iconComponents['HOutline:Bars4Icon']);
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
    const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
    // @ts-ignore
    [command, modelValue, menuStore,];
    var __VLS_30;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
    var __VLS_24;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        command: "default",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'default' }) },
    }));
    const __VLS_40 = __VLS_39({
        command: "default",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'default' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    const { default: __VLS_43 } = __VLS_41.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "size-menu-item" },
    });
    /** @type {__VLS_StyleScopedClasses['size-menu-item']} */ ;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        size: "16",
    }));
    const __VLS_46 = __VLS_45({
        size: "16",
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    const { default: __VLS_49 } = __VLS_47.slots;
    const __VLS_50 = (__VLS_ctx.menuStore.iconComponents['HOutline:Bars3Icon']);
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
    const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    // @ts-ignore
    [modelValue, menuStore,];
    var __VLS_47;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
    var __VLS_41;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        command: "small",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'small' }) },
    }));
    const __VLS_57 = __VLS_56({
        command: "small",
        ...{ class: ({ 'is-active': __VLS_ctx.modelValue === 'small' }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    /** @type {__VLS_StyleScopedClasses['is-active']} */ ;
    const { default: __VLS_60 } = __VLS_58.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "size-menu-item" },
    });
    /** @type {__VLS_StyleScopedClasses['size-menu-item']} */ ;
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        size: "16",
    }));
    const __VLS_63 = __VLS_62({
        size: "16",
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    const { default: __VLS_66 } = __VLS_64.slots;
    const __VLS_67 = (__VLS_ctx.menuStore.iconComponents['HOutline:Bars2Icon']);
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({}));
    const __VLS_69 = __VLS_68({}, ...__VLS_functionalComponentArgsRest(__VLS_68));
    // @ts-ignore
    [modelValue, menuStore,];
    var __VLS_64;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
    var __VLS_58;
    // @ts-ignore
    [];
    var __VLS_18;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
