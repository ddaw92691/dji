/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const userStore = useUserStore();
const passwordFormRef = useTemplateRef('passwordFormRef');
const open = ref(false);
// 密码表单
const passwordForm = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
// 修改密码
const updatePassword = async () => {
    await passwordFormRef.value?.validate();
    await userStore.delay(1000);
    await userStore.updatePassword(passwordForm.value);
    open.value = false;
};
// 新密码验证
/* eslint-disable @typescript-eslint/no-explicit-any */
const validateNewPassword = (rule, value, callback) => {
    if (value.trim() === '')
        return callback(new Error('请输入新密码'));
    if (value.length < 6)
        return callback(new Error('新密码长度至少6位'));
    callback();
};
// 确认密码验证
/* eslint-disable @typescript-eslint/no-explicit-any */
const validateConfirmPassword = (rule, value, callback) => {
    if (value.trim() === '')
        return callback(new Error('请输入确认密码'));
    if (value !== passwordForm.value.newPassword)
        return callback(new Error('确认密码与新密码不一致'));
    callback();
};
// rules
const passwordRules = ref({
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
    confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
});
const showDialog = () => {
    open.value = true;
};
const __VLS_exposed = {
    showDialog,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onConfirm': {} },
    modelValue: (__VLS_ctx.open),
    title: "修改密码",
    width: "500",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onConfirm': {} },
    modelValue: (__VLS_ctx.open),
    title: "修改密码",
    width: "500",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ confirm: {} },
    onConfirm: (__VLS_ctx.updatePassword),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "80px",
    ...{ class: "password-form" },
}));
const __VLS_11 = __VLS_10({
    ref: "passwordFormRef",
    model: (__VLS_ctx.passwordForm),
    rules: (__VLS_ctx.passwordRules),
    labelWidth: "80px",
    ...{ class: "password-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
var __VLS_14;
/** @type {__VLS_StyleScopedClasses['password-form']} */ ;
const { default: __VLS_16 } = __VLS_12.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: "旧密码",
    prop: "oldPassword",
}));
const __VLS_19 = __VLS_18({
    label: "旧密码",
    prop: "oldPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请输入旧密码",
    showPassword: true,
    clearable: true,
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.passwordForm.oldPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请输入旧密码",
    showPassword: true,
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[open, updatePassword, passwordForm, passwordForm, passwordRules,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: "新密码",
    prop: "newPassword",
}));
const __VLS_30 = __VLS_29({
    label: "新密码",
    prop: "newPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请输入新密码（至少6位）",
    showPassword: true,
    clearable: true,
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.passwordForm.newPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请输入新密码（至少6位）",
    showPassword: true,
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[passwordForm,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    label: "确认密码",
    prop: "confirmPassword",
}));
const __VLS_41 = __VLS_40({
    label: "确认密码",
    prop: "confirmPassword",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请再次输入新密码",
    showPassword: true,
    clearable: true,
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.passwordForm.confirmPassword),
    modelModifiers: { trim: true, },
    type: "password",
    placeholder: "请再次输入新密码",
    showPassword: true,
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[passwordForm,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_12;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
