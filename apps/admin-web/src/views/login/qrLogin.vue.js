/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
const emits = defineEmits();
const menuStore = useMenuStore();
const qrExpired = ref(false);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-content-inner" },
});
/** @type {__VLS_StyleScopedClasses['form-content-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
(__VLS_ctx.$t('button.scanLogin'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.$t('login.scanTip'));
(__VLS_ctx.APP_CONFIG.name);
(__VLS_ctx.$t('login.scanAction'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "qr-container" },
});
/** @type {__VLS_StyleScopedClasses['qr-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "qr-placeholder" },
});
/** @type {__VLS_StyleScopedClasses['qr-placeholder']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    size: (120),
    color: "var(--el-text-color-placeholder)",
}));
const __VLS_2 = __VLS_1({
    size: (120),
    color: "var(--el-text-color-placeholder)",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
const __VLS_6 = (__VLS_ctx.menuStore.iconComponents['Element:FullScreen']);
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
// @ts-ignore
[$t, $t, $t, APP_CONFIG, menuStore,];
var __VLS_3;
if (__VLS_ctx.qrExpired) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "qr-mask" },
    });
    /** @type {__VLS_StyleScopedClasses['qr-mask']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.$t('login.expired'));
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.qrExpired))
                return;
            __VLS_ctx.qrExpired = false;
            // @ts-ignore
            [$t, qrExpired, qrExpired,];
        },
    };
    const { default: __VLS_18 } = __VLS_14.slots;
    (__VLS_ctx.$t('button.refresh'));
    // @ts-ignore
    [$t,];
    var __VLS_14;
    var __VLS_15;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "qr-tip" },
});
/** @type {__VLS_StyleScopedClasses['qr-tip']} */ ;
(__VLS_ctx.$t('login.scanLoginDescription'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "back-link" },
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    ...{ 'onClick': {} },
    underline: (false),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onClick': {} },
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_24;
const __VLS_25 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.emits('goToMode', 'login');
        // @ts-ignore
        [$t, emits,];
    },
};
const { default: __VLS_26 } = __VLS_22.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
const __VLS_33 = (__VLS_ctx.menuStore.iconComponents['Element:ArrowLeft']);
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
// @ts-ignore
[menuStore,];
var __VLS_30;
(__VLS_ctx.$t('login.backToLogin'));
// @ts-ignore
[$t,];
var __VLS_22;
var __VLS_23;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
