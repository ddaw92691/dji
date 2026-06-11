/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
defineOptions({ name: 'RegisterComponent' });
const { t } = useI18n();
const emits = defineEmits();
const menuStore = useMenuStore();
const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});
const handleRegister = () => {
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
(__VLS_ctx.$t('login.createAccountTitle'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.$t('login.createAccountJoin'));
(__VLS_ctx.APP_CONFIG.name);
(__VLS_ctx.$t('login.createAccountSlogan'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.registerForm),
    labelPosition: "top",
    ...{ class: "register-form" },
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.registerForm),
    labelPosition: "top",
    ...{ class: "register-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['register-form']} */ ;
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
    modelValue: (__VLS_ctx.registerForm.username),
    placeholder: (__VLS_ctx.$t('login.registerUsernamePlaceholder')),
}));
const __VLS_14 = __VLS_13({
    modelValue: (__VLS_ctx.registerForm.username),
    placeholder: (__VLS_ctx.$t('login.registerUsernamePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
// @ts-ignore
[$t, $t, $t, $t, APP_CONFIG, registerForm, registerForm,];
var __VLS_9;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.registerForm.email),
    placeholder: (__VLS_ctx.$t('login.registerEmailPlaceholder')),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.registerForm.email),
    placeholder: (__VLS_ctx.$t('login.registerEmailPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, registerForm,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.registerForm.password),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('login.registerPasswordPlaceholder')),
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.registerForm.password),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('login.registerPasswordPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, registerForm,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.registerForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('login.confirmPasswordPlaceholder')),
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.registerForm.confirmPassword),
    type: "password",
    showPassword: true,
    placeholder: (__VLS_ctx.$t('login.confirmPasswordPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[$t, registerForm,];
var __VLS_42;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}));
const __VLS_52 = __VLS_51({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
const __VLS_56 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleRegister),
};
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
const { default: __VLS_57 } = __VLS_53.slots;
(__VLS_ctx.$t('button.registerNow'));
// @ts-ignore
[$t, handleRegister,];
var __VLS_53;
var __VLS_54;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "back-link" },
});
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "have-account" },
});
/** @type {__VLS_StyleScopedClasses['have-account']} */ ;
(__VLS_ctx.$t('login.noAccount'));
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    ...{ 'onClick': {} },
    underline: (false),
}));
const __VLS_60 = __VLS_59({
    ...{ 'onClick': {} },
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
const __VLS_64 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.emits('goToMode', 'login');
        // @ts-ignore
        [$t, emits,];
    },
};
const { default: __VLS_65 } = __VLS_61.slots;
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
const { default: __VLS_71 } = __VLS_69.slots;
const __VLS_72 = (__VLS_ctx.menuStore.iconComponents['Element:ArrowLeft']);
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
// @ts-ignore
[menuStore,];
var __VLS_69;
(__VLS_ctx.$t('login.backToLogin'));
// @ts-ignore
[$t,];
var __VLS_61;
var __VLS_62;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
