/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useI18n } from 'vue-i18n';
import { rolePage } from '@/api/role';
import { createUser, userInfo, updateUser } from '@/api/user';
import { STATUS_OPTIONS } from '@/constants/dict';
const { t } = useI18n();
defineOptions({ name: 'UserCreate' });
const emits = defineEmits(['refresh']);
const submitFormRef = useTemplateRef('submitFormRef');
// 对话框开关
const open = ref(false);
// 提交按钮加载状态
const submitLoading = ref(false);
// 角色列表
const roleList = ref([]);
// 表单数据
const submitForm = ref({
    id: undefined,
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    roleId: undefined,
    status: 'active',
});
// 取消
const close = () => {
    open.value = false;
    submitFormRef.value?.resetFields();
    roleList.value = [];
    submitForm.value.roleId = undefined;
};
// 确定
const confirm = async () => {
    await submitFormRef.value?.validate();
    const { data: res } = submitForm.value.id
        ? await updateUser(submitForm.value)
        : await createUser(submitForm.value);
    if (res.code !== 200)
        return;
    ElMessage.success(submitForm.value.id ? t('message.editSuccess') : t('message.addSuccess'));
    emits('refresh', submitForm.value.id ? 'update' : 'create');
    close();
};
// 获取角色列表
const getRoleList = async () => {
    const { data: res } = await rolePage({
        page: 1,
        pageSize: 1000, // 获取所有角色
        name: '',
        code: '',
        sortOrder: 'asc',
    });
    if (res.code !== 200)
        return;
    roleList.value = res.data?.list || [];
};
// 获取用户信息
const getUserInfo = async () => {
    const { data: res } = await userInfo(submitForm.value.id);
    if (res.code !== 200)
        return;
    const { id, username, name, phone, email, roleId, status, password } = res.data;
    submitForm.value = {
        id,
        username,
        password,
        name: name || '',
        phone: phone || '',
        email: email || '',
        roleId,
        status,
    };
};
// 表单验证规则
const formRules = {
    username: [
        { required: true, message: t('user.usernamePlaceholder'), trigger: 'blur' },
        {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: t('user.usernamePlaceholder'),
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: t('user.passwordPlaceholder'),
            trigger: 'blur',
            validator: (rule, value, callback) => {
                // 新增时必填，编辑时可选
                if (!submitForm.value.id && !value) {
                    callback(new Error(t('user.passwordPlaceholder')));
                }
                else {
                    callback();
                }
            },
        },
    ],
    status: [{ required: true, message: t('user.statusPlaceholder'), trigger: 'change' }],
};
// 显示对话框
const showDialog = async (id) => {
    submitForm.value.id = id;
    open.value = true;
    // 加载角色列表
    await getRoleList();
    if (id)
        await getUserInfo();
};
const __VLS_exposed = {
    showDialog,
};
defineExpose(__VLS_exposed);
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseDialog | typeof __VLS_components.BaseDialog} */
BaseDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('user.editUser') : __VLS_ctx.$t('user.addUser')),
    width: "600",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.open),
    title: (__VLS_ctx.submitForm.id ? __VLS_ctx.$t('user.editUser') : __VLS_ctx.$t('user.addUser')),
    width: "600",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ close: {} },
    onClose: (__VLS_ctx.close),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
    labelPosition: "right",
}));
const __VLS_11 = __VLS_10({
    ref: "submitFormRef",
    model: (__VLS_ctx.submitForm),
    rules: (__VLS_ctx.formRules),
    labelWidth: "100px",
    labelPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
var __VLS_14;
const { default: __VLS_16 } = __VLS_12.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('user.username')),
    prop: "username",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('user.username')),
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    modelValue: (__VLS_ctx.submitForm.username),
    placeholder: (__VLS_ctx.$t('user.usernamePlaceholder')),
    disabled: (!!__VLS_ctx.submitForm.id),
}));
const __VLS_25 = __VLS_24({
    modelValue: (__VLS_ctx.submitForm.username),
    placeholder: (__VLS_ctx.$t('user.usernamePlaceholder')),
    disabled: (!!__VLS_ctx.submitForm.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[open, submitForm, submitForm, submitForm, submitForm, $t, $t, $t, $t, close, formRules,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('user.password')),
    prop: "password",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('user.password')),
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.submitForm.password),
    type: "password",
    placeholder: (__VLS_ctx.$t('user.passwordPlaceholder')),
    showPassword: true,
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.submitForm.password),
    type: "password",
    placeholder: (__VLS_ctx.$t('user.passwordPlaceholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[submitForm, $t, $t,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    label: (__VLS_ctx.$t('user.name')),
    prop: "name",
}));
const __VLS_41 = __VLS_40({
    label: (__VLS_ctx.$t('user.name')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: (__VLS_ctx.$t('user.namePlaceholder')),
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.submitForm.name),
    placeholder: (__VLS_ctx.$t('user.namePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[submitForm, $t, $t,];
var __VLS_42;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    label: (__VLS_ctx.$t('user.phone')),
    prop: "phone",
}));
const __VLS_52 = __VLS_51({
    label: (__VLS_ctx.$t('user.phone')),
    prop: "phone",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    modelValue: (__VLS_ctx.submitForm.phone),
    placeholder: (__VLS_ctx.$t('user.phonePlaceholder')),
}));
const __VLS_58 = __VLS_57({
    modelValue: (__VLS_ctx.submitForm.phone),
    placeholder: (__VLS_ctx.$t('user.phonePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
// @ts-ignore
[submitForm, $t, $t,];
var __VLS_53;
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.$t('user.email')),
    prop: "email",
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.$t('user.email')),
    prop: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
const { default: __VLS_66 } = __VLS_64.slots;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    modelValue: (__VLS_ctx.submitForm.email),
    placeholder: (__VLS_ctx.$t('user.emailPlaceholder')),
}));
const __VLS_69 = __VLS_68({
    modelValue: (__VLS_ctx.submitForm.email),
    placeholder: (__VLS_ctx.$t('user.emailPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
// @ts-ignore
[submitForm, $t, $t,];
var __VLS_64;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
    label: (__VLS_ctx.$t('user.role')),
    prop: "roleId",
}));
const __VLS_74 = __VLS_73({
    label: (__VLS_ctx.$t('user.role')),
    prop: "roleId",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.submitForm.roleId),
    placeholder: (__VLS_ctx.$t('user.rolePlaceholder')),
    ...{ style: {} },
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.submitForm.roleId),
    placeholder: (__VLS_ctx.$t('user.rolePlaceholder')),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
const { default: __VLS_83 } = __VLS_81.slots;
for (const [role] of __VLS_vFor((__VLS_ctx.roleList))) {
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        key: (role.id),
        label: (role.name),
        value: (role.id),
    }));
    const __VLS_86 = __VLS_85({
        key: (role.id),
        label: (role.name),
        value: (role.id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    // @ts-ignore
    [submitForm, $t, $t, roleList,];
}
// @ts-ignore
[];
var __VLS_81;
// @ts-ignore
[];
var __VLS_75;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    label: (__VLS_ctx.$t('user.status')),
    prop: "status",
}));
const __VLS_91 = __VLS_90({
    label: (__VLS_ctx.$t('user.status')),
    prop: "status",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
const { default: __VLS_94 } = __VLS_92.slots;
let __VLS_95;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    modelValue: (__VLS_ctx.submitForm.status),
}));
const __VLS_97 = __VLS_96({
    modelValue: (__VLS_ctx.submitForm.status),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_100 } = __VLS_98.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.STATUS_OPTIONS))) {
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        key: (item.value),
        label: (item.value),
    }));
    const __VLS_103 = __VLS_102({
        key: (item.value),
        label: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    const { default: __VLS_106 } = __VLS_104.slots;
    (item.label);
    // @ts-ignore
    [submitForm, $t, STATUS_OPTIONS,];
    var __VLS_104;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_98;
// @ts-ignore
[];
var __VLS_92;
// @ts-ignore
[];
var __VLS_12;
{
    const { footer: __VLS_107 } = __VLS_3.slots;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    const __VLS_114 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_115 } = __VLS_111.slots;
    (__VLS_ctx.$t('button.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_111;
    var __VLS_112;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.submitLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.confirm),
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    (__VLS_ctx.$t('button.confirm'));
    // @ts-ignore
    [$t, submitLoading, confirm,];
    var __VLS_119;
    var __VLS_120;
    // @ts-ignore
    [];
}
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
    emits: {},
});
export default {};
