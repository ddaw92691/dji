/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emits = defineEmits();
const menuStore = useMenuStore();
const forgotPasswordForm = ref({
    email: '',
});
const handleAction = () => {
    ElMessage.success(t('login.comingSoon'));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-content-inner" },
});
/** @type {__VLS_StyleScopedClasses['form-content-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
(__VLS_ctx.$t('login.forgotPasswordTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.$t('login.forgotPasswordSubtitle'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.forgotPasswordForm),
    labelPosition: "top",
    ...{ class: "forgot-password-form" },
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.forgotPasswordForm),
    labelPosition: "top",
    ...{ class: "forgot-password-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['forgot-password-form']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.forgotPasswordForm.email),
    placeholder: (__VLS_ctx.$t('login.emailPlaceholder')),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.forgotPasswordForm.email),
    placeholder: (__VLS_ctx.$t('login.emailPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
// @ts-ignore
[$t, $t, $t, forgotPasswordForm, forgotPasswordForm,];
var __VLS_9;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleAction),
};
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
const { default: __VLS_24 } = __VLS_20.slots;
(__VLS_ctx.$t('login.sendResetLink'));
// @ts-ignore
[$t, handleAction,];
var __VLS_20;
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "back-link" },
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    ...{ 'onClick': {} },
    underline: (false),
}));
const __VLS_27 = __VLS_26({
    ...{ 'onClick': {} },
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
const __VLS_31 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.emits('goToMode', 'login');
        // @ts-ignore
        [emits,];
    },
};
const { default: __VLS_32 } = __VLS_28.slots;
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
const { default: __VLS_38 } = __VLS_36.slots;
const __VLS_39 = (__VLS_ctx.menuStore.iconComponents['Element:ArrowLeft']);
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
// @ts-ignore
[menuStore,];
var __VLS_36;
(__VLS_ctx.$t('login.backToLogin'));
// @ts-ignore
[$t,];
var __VLS_28;
var __VLS_29;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
