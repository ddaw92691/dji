/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = withDefaults(defineProps(), {
    shadow: 'never',
    titleIconSize: 20,
    borderRadius: '1rem',
    bordered: false,
});
const slots = useSlots();
const menuStore = useMenuStore();
const iconComponent = computed(() => {
    if (typeof props.titleIcon === 'string') {
        return menuStore.iconComponents[props.titleIcon];
    }
    return props.titleIcon;
});
const cardStyle = computed(() => ({
    '--base-card-border-radius': props.borderRadius,
    '--base-card-border-width': props.bordered ? '1px' : '0px',
}));
const __VLS_defaults = {
    shadow: 'never',
    titleIconSize: 20,
    borderRadius: '1rem',
    bordered: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "base-card" },
    shadow: (__VLS_ctx.shadow),
    ...{ style: (__VLS_ctx.cardStyle) },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "base-card" },
    shadow: (__VLS_ctx.shadow),
    ...{ style: (__VLS_ctx.cardStyle) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['base-card']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.slots.header || __VLS_ctx.title || __VLS_ctx.titleIcon || __VLS_ctx.slots['header-right']) {
    {
        const { header: __VLS_7 } = __VLS_3.slots;
        var __VLS_8 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-header-wrap" },
        });
        /** @type {__VLS_StyleScopedClasses['card-header-wrap']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "header-left" },
        });
        /** @type {__VLS_StyleScopedClasses['header-left']} */ ;
        if (__VLS_ctx.titleIcon) {
            let __VLS_10;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
                ...{ class: "header-icon" },
                size: (__VLS_ctx.titleIconSize),
            }));
            const __VLS_12 = __VLS_11({
                ...{ class: "header-icon" },
                size: (__VLS_ctx.titleIconSize),
            }, ...__VLS_functionalComponentArgsRest(__VLS_11));
            /** @type {__VLS_StyleScopedClasses['header-icon']} */ ;
            const { default: __VLS_15 } = __VLS_13.slots;
            const __VLS_16 = (__VLS_ctx.iconComponent);
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({}));
            const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
            // @ts-ignore
            [shadow, cardStyle, slots, slots, title, titleIcon, titleIcon, titleIconSize, iconComponent,];
            var __VLS_13;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "header-title" },
        });
        /** @type {__VLS_StyleScopedClasses['header-title']} */ ;
        (__VLS_ctx.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "header-right" },
        });
        /** @type {__VLS_StyleScopedClasses['header-right']} */ ;
        var __VLS_21 = {};
        // @ts-ignore
        [title,];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-body-wrap" },
});
/** @type {__VLS_StyleScopedClasses['card-body-wrap']} */ ;
var __VLS_23 = {};
if (__VLS_ctx.slots.footer) {
    {
        const { footer: __VLS_25 } = __VLS_3.slots;
        var __VLS_26 = {};
        // @ts-ignore
        [slots,];
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_9 = __VLS_8, __VLS_22 = __VLS_21, __VLS_24 = __VLS_23, __VLS_27 = __VLS_26;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
