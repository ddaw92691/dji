/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emits = defineEmits();
const menuStore = useMenuStore();
const mobileLoginForm = ref({
    phone: '',
    code: '',
});
const sendCode = () => {
    ElMessage.success(t('login.comingSoon'));
};
const handleLogin = () => {
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
/** @type {__VLS_StyleScopedClasses['el-input__wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-content-inner" },
});
/** @type {__VLS_StyleScopedClasses['form-content-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
(__VLS_ctx.$t('button.phoneLogin'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.$t('login.mobileLoginSubtitle'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.mobileLoginForm),
    labelPosition: "top",
    ...{ class: "mobile-login-form" },
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.mobileLoginForm),
    labelPosition: "top",
    ...{ class: "mobile-login-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mobile-login-form']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    modelValue: (__VLS_ctx.mobileLoginForm.phone),
    placeholder: (__VLS_ctx.$t('login.phonePlaceholder')),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.mobileLoginForm.phone),
    placeholder: (__VLS_ctx.$t('login.phonePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
{
    const { prepend: __VLS_18 } = __VLS_15.slots;
    // @ts-ignore
    [$t, $t, $t, mobileLoginForm, mobileLoginForm,];
}
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
var __VLS_9;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "code-input" },
});
/** @type {__VLS_StyleScopedClasses['code-input']} */ ;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.mobileLoginForm.code),
    placeholder: (__VLS_ctx.$t('login.codePlaceholder')),
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.mobileLoginForm.code),
    placeholder: (__VLS_ctx.$t('login.codePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onClick': {} },
    ...{ class: "send-code-btn" },
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    ...{ class: "send-code-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.sendCode),
};
/** @type {__VLS_StyleScopedClasses['send-code-btn']} */ ;
const { default: __VLS_37 } = __VLS_33.slots;
(__VLS_ctx.$t('button.getCode'));
// @ts-ignore
[$t, $t, mobileLoginForm, sendCode,];
var __VLS_33;
var __VLS_34;
// @ts-ignore
[];
var __VLS_22;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleLogin),
};
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
const { default: __VLS_45 } = __VLS_41.slots;
(__VLS_ctx.$t('button.verifyAndLogin'));
// @ts-ignore
[$t, handleLogin,];
var __VLS_41;
var __VLS_42;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "back-link" },
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    ...{ 'onClick': {} },
    underline: (false),
}));
const __VLS_48 = __VLS_47({
    ...{ 'onClick': {} },
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
let __VLS_51;
const __VLS_52 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.emits('goToMode', 'login');
        // @ts-ignore
        [emits,];
    },
};
const { default: __VLS_53 } = __VLS_49.slots;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
const __VLS_60 = (__VLS_ctx.menuStore.iconComponents['Element:ArrowLeft']);
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
// @ts-ignore
[menuStore,];
var __VLS_57;
(__VLS_ctx.$t('login.backToLogin'));
// @ts-ignore
[$t,];
var __VLS_49;
var __VLS_50;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
