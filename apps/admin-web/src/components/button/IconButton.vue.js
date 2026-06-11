/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const menuStore = useMenuStore();
const props = withDefaults(defineProps(), {
    placement: 'top',
    effect: 'dark',
    showAfter: 200,
    size: '2rem',
    iconSize: '1.25rem',
    disabled: false,
    type: 'default',
    loading: false,
    loadingIcon: 'HOutline:ArrowPathIcon',
});
const emits = defineEmits();
const handleClick = (event) => {
    if (props.disabled || props.loading)
        return;
    emits('click', event);
};
// 计算图标组件：如果是字符串则从 menuStore.iconComponents 获取，否则直接使用
const iconComponent = computed(() => {
    if (typeof props.icon === 'string') {
        return menuStore.iconComponents[props.icon];
    }
    return props.icon;
});
// 计算加载图标组件
const loadingIconComponent = computed(() => {
    if (typeof props.loadingIcon === 'string') {
        return menuStore.iconComponents[props.loadingIcon];
    }
    return props.loadingIcon;
});
const __VLS_defaults = {
    placement: 'top',
    effect: 'dark',
    showAfter: 200,
    size: '2rem',
    iconSize: '1.25rem',
    disabled: false,
    type: 'default',
    loading: false,
    loadingIcon: 'HOutline:ArrowPathIcon',
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
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    content: (__VLS_ctx.tooltip),
    placement: (__VLS_ctx.placement),
    effect: (__VLS_ctx.effect),
    showAfter: (__VLS_ctx.showAfter),
    disabled: (!__VLS_ctx.tooltip || __VLS_ctx.disabled),
}));
const __VLS_2 = __VLS_1({
    content: (__VLS_ctx.tooltip),
    placement: (__VLS_ctx.placement),
    effect: (__VLS_ctx.effect),
    showAfter: (__VLS_ctx.showAfter),
    disabled: (!__VLS_ctx.tooltip || __VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ class: "action-btn" },
    ...{ class: ({
            'is-disabled': __VLS_ctx.disabled || __VLS_ctx.loading,
            'is-loading': __VLS_ctx.loading,
            [`action-btn--${__VLS_ctx.type}`]: __VLS_ctx.type !== 'default',
        }) },
    ...{ style: ({ width: __VLS_ctx.size, height: __VLS_ctx.size }) },
});
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['is-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
if (__VLS_ctx.loading) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ style: ({ fontSize: __VLS_ctx.iconSize }) },
        ...{ class: "loading-icon" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ style: ({ fontSize: __VLS_ctx.iconSize }) },
        ...{ class: "loading-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['loading-icon']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    const __VLS_13 = (__VLS_ctx.loadingIconComponent);
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
    const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [tooltip, tooltip, placement, effect, showAfter, disabled, disabled, handleClick, loading, loading, loading, type, type, size, size, iconSize, loadingIconComponent,];
    var __VLS_10;
}
else {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ style: ({ fontSize: __VLS_ctx.iconSize }) },
    }));
    const __VLS_20 = __VLS_19({
        ...{ style: ({ fontSize: __VLS_ctx.iconSize }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    const __VLS_24 = (__VLS_ctx.iconComponent);
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    // @ts-ignore
    [iconSize, iconComponent,];
    var __VLS_21;
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
