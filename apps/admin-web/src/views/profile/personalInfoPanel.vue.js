/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { Dialog } from '@/utils/dialog';
const menuStore = useMenuStore();
const userStore = useUserStore();
const selectAvatarDialogRef = useTemplateRef({});
const updatePasswordRef = useTemplateRef({});
// 个人资料Form
const userInfoForm = ref({
    avatar: '',
    username: '',
    name: '',
    phone: '',
    email: '',
    bio: '',
    tags: '',
});
// 获取头像
const getAvatar = (avatar) => {
    userInfoForm.value.avatar = avatar;
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 保存修改
const saveUser = () => {
    Dialog.confirm({
        title: '确认保存个人资料',
        content: '小改动，大影响～确认保存当前修改吗？保存后将立即生效。',
        cancelText: '我再看看',
        confirmText: '确认保存',
        onConfirm: async () => {
            await delay(1000);
            userStore.updateUserProfile(userInfoForm.value);
        },
    });
};
// 注销用户
const deleteUser = () => {
    Dialog.confirm({
        title: '要清空数据了哦！',
        content: '一旦注销账户，所有数据都会消失，无法恢复，确认继续？',
        cancelText: '先不急',
        confirmText: '让我勇敢一次',
        onConfirm: async () => {
            await delay(1000);
            userStore.deleteUserAccount();
        },
    });
};
// 监听用户信息 赋值
watch(() => userStore.userInfo, (userInfo) => {
    userInfoForm.value.avatar = userInfo?.avatar || '';
    userInfoForm.value.username = userInfo?.username || '';
    userInfoForm.value.name = userInfo?.name || '';
    userInfoForm.value.phone = userInfo?.phone || '';
    userInfoForm.value.email = userInfo?.email || '';
    userInfoForm.value.bio = userInfo?.bio || '';
    userInfoForm.value.tags = userInfo?.tags || '';
}, {
    immediate: true,
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "个人资料中心",
    titleIcon: "HOutline:UserIcon",
}));
const __VLS_2 = __VLS_1({
    title: "个人资料中心",
    titleIcon: "HOutline:UserIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { 'header-right': __VLS_7 } = __VLS_3.slots;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.saveUser),
    };
    const { default: __VLS_15 } = __VLS_11.slots;
    // @ts-ignore
    [saveUser,];
    var __VLS_11;
    var __VLS_12;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    size: (110),
    src: (__VLS_ctx.userInfoForm.avatar),
    ...{ class: "shrink-0" },
}));
const __VLS_18 = __VLS_17({
    size: (110),
    src: (__VLS_ctx.userInfoForm.avatar),
    ...{ class: "shrink-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex flex-col items-start gap-2" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-sm text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    size: "small",
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        selectAvatarDialogRef.value?.showDialog();
        // @ts-ignore
        [userInfoForm,];
    },
};
const { default: __VLS_28 } = __VLS_24.slots;
// @ts-ignore
[];
var __VLS_24;
var __VLS_25;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    model: (__VLS_ctx.userInfoForm),
    labelPosition: "top",
    ...{ class: "custom-form" },
}));
const __VLS_36 = __VLS_35({
    model: (__VLS_ctx.userInfoForm),
    labelPosition: "top",
    ...{ class: "custom-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
/** @type {__VLS_StyleScopedClasses['custom-form']} */ ;
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    gutter: (20),
}));
const __VLS_42 = __VLS_41({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    span: (12),
}));
const __VLS_48 = __VLS_47({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
const { default: __VLS_51 } = __VLS_49.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    label: "用户名",
}));
const __VLS_54 = __VLS_53({
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const { default: __VLS_57 } = __VLS_55.slots;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.userInfoForm.username),
    disabled: true,
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.userInfoForm.username),
    disabled: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
// @ts-ignore
[userInfoForm, userInfoForm,];
var __VLS_55;
// @ts-ignore
[];
var __VLS_49;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    span: (12),
}));
const __VLS_65 = __VLS_64({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    label: "姓名",
}));
const __VLS_71 = __VLS_70({
    label: "姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
const { default: __VLS_74 } = __VLS_72.slots;
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    modelValue: (__VLS_ctx.userInfoForm.name),
    placeholder: "请输入姓名",
}));
const __VLS_77 = __VLS_76({
    modelValue: (__VLS_ctx.userInfoForm.name),
    placeholder: "请输入姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
// @ts-ignore
[userInfoForm,];
var __VLS_72;
// @ts-ignore
[];
var __VLS_66;
// @ts-ignore
[];
var __VLS_43;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    gutter: (20),
}));
const __VLS_82 = __VLS_81({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
let __VLS_86;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
    span: (12),
}));
const __VLS_88 = __VLS_87({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
const { default: __VLS_91 } = __VLS_89.slots;
let __VLS_92;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
    label: "手机号",
}));
const __VLS_94 = __VLS_93({
    label: "手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
const { default: __VLS_97 } = __VLS_95.slots;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    modelValue: (__VLS_ctx.userInfoForm.phone),
    placeholder: "请输入手机号",
}));
const __VLS_100 = __VLS_99({
    modelValue: (__VLS_ctx.userInfoForm.phone),
    placeholder: "请输入手机号",
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
// @ts-ignore
[userInfoForm,];
var __VLS_95;
// @ts-ignore
[];
var __VLS_89;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    span: (12),
}));
const __VLS_105 = __VLS_104({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
    label: "邮箱",
}));
const __VLS_111 = __VLS_110({
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
const { default: __VLS_114 } = __VLS_112.slots;
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    modelValue: (__VLS_ctx.userInfoForm.email),
    placeholder: "请输入邮箱",
}));
const __VLS_117 = __VLS_116({
    modelValue: (__VLS_ctx.userInfoForm.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
// @ts-ignore
[userInfoForm,];
var __VLS_112;
// @ts-ignore
[];
var __VLS_106;
// @ts-ignore
[];
var __VLS_83;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    label: "个人简介/座右铭",
}));
const __VLS_122 = __VLS_121({
    label: "个人简介/座右铭",
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const { default: __VLS_125 } = __VLS_123.slots;
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    modelValue: (__VLS_ctx.userInfoForm.bio),
    type: "textarea",
    rows: (4),
    placeholder: "写点什么来展示你自己...",
}));
const __VLS_128 = __VLS_127({
    modelValue: (__VLS_ctx.userInfoForm.bio),
    type: "textarea",
    rows: (4),
    placeholder: "写点什么来展示你自己...",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
// @ts-ignore
[userInfoForm,];
var __VLS_123;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    label: "个人标签（用几个关键词介绍一下自己）",
}));
const __VLS_133 = __VLS_132({
    label: "个人标签（用几个关键词介绍一下自己）",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
const { default: __VLS_136 } = __VLS_134.slots;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    modelValue: (__VLS_ctx.userInfoForm.tags),
    type: "textarea",
    rows: (4),
    placeholder: "多个标签请用英文逗号分隔, 例如：写代码的, 爱咖啡, 偶尔健身, 长期学习中",
}));
const __VLS_139 = __VLS_138({
    modelValue: (__VLS_ctx.userInfoForm.tags),
    type: "textarea",
    rows: (4),
    placeholder: "多个标签请用英文逗号分隔, 例如：写代码的, 爱咖啡, 偶尔健身, 长期学习中",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
// @ts-ignore
[userInfoForm,];
var __VLS_134;
// @ts-ignore
[];
var __VLS_37;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({}));
const __VLS_144 = __VLS_143({}, ...__VLS_functionalComponentArgsRest(__VLS_143));
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    name: "lift",
    ...{ class: "w-full" },
}));
const __VLS_149 = __VLS_148({
    name: "lift",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_152 } = __VLS_150.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-5 border border-solid border-(--el-border-color-light) rounded-xl transition-all duration-300 hover:border-(--el-border-color) hover:bg-(--el-bg-color-page) cursor-pointer" },
});
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-border-color-light)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-(--el-border-color)']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-(--el-bg-color-page)']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-(--el-color-info-light-7) text-(--el-color-primary) transition-colors duration-300" },
});
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-12']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-info-light-7)']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    size: "20",
}));
const __VLS_155 = __VLS_154({
    size: "20",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
const { default: __VLS_158 } = __VLS_156.slots;
const __VLS_159 = (__VLS_ctx.menuStore.iconComponents['HOutline:KeyIcon']);
// @ts-ignore
const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({}));
const __VLS_161 = __VLS_160({}, ...__VLS_functionalComponentArgsRest(__VLS_160));
// @ts-ignore
[menuStore,];
var __VLS_156;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-1 text-sm font-bold text-(--el-text-color-primary)" },
});
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-primary)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xs text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
}));
const __VLS_166 = __VLS_165({
    ...{ 'onClick': {} },
    type: "primary",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        updatePasswordRef.value?.showDialog();
        // @ts-ignore
        [];
    },
};
const { default: __VLS_171 } = __VLS_167.slots;
// @ts-ignore
[];
var __VLS_167;
var __VLS_168;
// @ts-ignore
[];
var __VLS_150;
let __VLS_172;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({}));
const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    name: "lift",
    ...{ class: "w-full" },
}));
const __VLS_179 = __VLS_178({
    name: "lift",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_182 } = __VLS_180.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-4 bg-(--el-color-danger-light-9) border border-dashed border-(--el-color-danger-light-5) rounded-xl cursor-pointer transition-all duration-300 hover:bg-(--el-color-danger-light-7) hover:border-(--el-color-danger)" },
});
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-(--el-color-danger-light-9)']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-(--el-color-danger-light-5)']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-300']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-(--el-color-danger-light-7)']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-(--el-color-danger)']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-2 text-(--el-color-danger) font-bold" },
});
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-color-danger)']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-1 text-sm font-bold" },
});
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-sm text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
let __VLS_183;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
}));
const __VLS_185 = __VLS_184({
    ...{ 'onClick': {} },
    type: "danger",
    plain: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_184));
let __VLS_188;
const __VLS_189 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.deleteUser),
};
const { default: __VLS_190 } = __VLS_186.slots;
// @ts-ignore
[deleteUser,];
var __VLS_186;
var __VLS_187;
// @ts-ignore
[];
var __VLS_180;
let __VLS_191;
/** @ts-ignore @type { | typeof __VLS_components.SelectAvatarDialog} */
SelectAvatarDialog;
// @ts-ignore
const __VLS_192 = __VLS_asFunctionalComponent1(__VLS_191, new __VLS_191({
    ...{ 'onGetAvatar': {} },
    ref: "selectAvatarDialogRef",
}));
const __VLS_193 = __VLS_192({
    ...{ 'onGetAvatar': {} },
    ref: "selectAvatarDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_192));
let __VLS_196;
const __VLS_197 = {
    ...{ getAvatar: {} },
    onGetAvatar: (__VLS_ctx.getAvatar),
};
var __VLS_198;
var __VLS_194;
var __VLS_195;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.UpdatePassword} */
UpdatePassword;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    ref: "updatePasswordRef",
}));
const __VLS_202 = __VLS_201({
    ref: "updatePasswordRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
var __VLS_205;
var __VLS_203;
// @ts-ignore
[getAvatar,];
var __VLS_3;
// @ts-ignore
var __VLS_199 = __VLS_198, __VLS_206 = __VLS_205;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
