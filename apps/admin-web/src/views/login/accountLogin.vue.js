/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
import { login } from '@/api/login';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { STORAGE_KEYS, storage } from '@/utils/storage';
const emits = defineEmits();
const { t } = useI18n();
const router = useRouter();
const menuStore = useMenuStore();
const loginFormRef = useTemplateRef('loginFormRef');
const loading = ref(false);
// 记住我的 localStorage key
const REMEMBER_LOGIN_KEY = 'remember_login_info';
const loginForm = ref({
    username: '',
    password: '',
    remember: false,
});
// 默认角色
const rolePreset = ref('');
// 角色选项
const roleOptions = [
    {
        label: 'Super Admin',
        value: 'super_admin',
        preset: { username: '', password: '' },
    },
    { label: 'Admin', value: 'admin', preset: { username: '', password: '' } },
    { label: 'Guest', value: 'guest', preset: { username: '', password: '' } },
];
/**
 * 检查是否为内置用户
 * @param username 用户名
 * @returns 如果是内置用户返回对应的角色，否则返回 null
 */
const getBuiltInRole = (username) => {
    const role = roleOptions.find((item) => item.preset.username === username);
    return role ? role.value : null;
};
/**
 * 切换角色预设
 * 自动填充对应角色的用户名和密码
 */
const applyPreset = (value) => {
    if (!roleOptions.some((item) => item.value === value))
        return;
    loginForm.value.username = '';
    loginForm.value.password = '';
};
/**
 * 从 localStorage 读取记住的登录信息
 * 包括角色选择和用户名
 */
const loadRememberedLoginInfo = () => {
    localStorage.removeItem(REMEMBER_LOGIN_KEY);
    loginForm.value.username = '';
    loginForm.value.password = '';
    loginForm.value.remember = false;
    return;
    /*
    const rememberedInfo = localStorage.getItem(REMEMBER_LOGIN_KEY)
    if (!rememberedInfo) return
  
    try {
      const { role, username } = JSON.parse(rememberedInfo)
      
      // 如果记住的是内置用户，恢复角色选择和完整信息
      if (role && getBuiltInRole(username) === role) {
        rolePreset.value = role
        applyPreset(role)
      } else {
        // 如果是自定义账号，只恢复用户名
        loginForm.value.username = username
      }
      
      loginForm.value.remember = true
    } catch (error) {
      console.error('解析记住的登录信息失败:', error)
      localStorage.removeItem(REMEMBER_LOGIN_KEY)
    }
    */
};
/**
 * 保存或清除记住的登录信息
 * @param value 是否记住
 */
const handleRememberChange = (value) => {
    const remember = Boolean(value);
    if (!remember) {
        localStorage.removeItem(REMEMBER_LOGIN_KEY);
    }
};
/**
 * 处理登录
 * 登录成功后保存记住的登录信息
 */
const handleLogin = async () => {
    await loginFormRef.value?.validate();
    loading.value = true;
    try {
        const { data: res } = await login({
            account: loginForm.value.username,
            password: loginForm.value.password,
            loginType: 'password',
        });
        if (res.code !== 200) {
            // 后端业务异常（账号/密码错误等）以 HTTP 200 + code!=200 返回，
            // 这里显式提示，避免登录失败时界面静默无反馈。
            ElMessage.error(res.message || t('login.loginFailed'));
            return;
        }
        const role = res.data.user?.role;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
            ElMessage.error('该账号没有访问后台的权限');
            loading.value = false;
            return;
        }
        if (res.data.user?.countryCode) {
            storage.set(STORAGE_KEYS.COUNTRY_CODE, res.data.user.countryCode);
        }
        if (res.data.user?.languageCode) {
            storage.set(STORAGE_KEYS.LANGUAGE_CODE, res.data.user.languageCode);
        }
        storage.set(STORAGE_KEYS.TOKEN, res.data.token);
        // 如果勾选了记住我，保存登录信息
        if (loginForm.value.remember) {
            const builtInRole = getBuiltInRole(loginForm.value.username);
            const loginInfo = {
                role: builtInRole || rolePreset.value, // 内置用户保存角色，自定义账号保存当前选择的角色
                username: loginForm.value.username,
            };
            localStorage.setItem(REMEMBER_LOGIN_KEY, JSON.stringify(loginInfo));
        }
        else {
            localStorage.removeItem(REMEMBER_LOGIN_KEY);
        }
        ElMessage.success(t('login.loginSuccess'));
        router.push('/');
    }
    finally {
        loading.value = false;
    }
};
const loginRules = reactive({
    username: [{ required: true, message: t('login.usernamePlaceholder'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.passwordPlaceholder'), trigger: 'blur' }],
});
onMounted(() => {
    loadRememberedLoginInfo();
    // 如果没有记住的信息，应用默认角色
});
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
(__VLS_ctx.$t('login.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "subtitle" },
});
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
(__VLS_ctx.$t('login.subtitle'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onKeyup': {} },
    ref: "loginFormRef",
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.loginRules),
    labelPosition: "top",
    ...{ class: "login-form" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onKeyup': {} },
    ref: "loginFormRef",
    model: (__VLS_ctx.loginForm),
    rules: (__VLS_ctx.loginRules),
    labelPosition: "top",
    ...{ class: "login-form" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ keyup: {} },
    onKeyup: (__VLS_ctx.handleLogin),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['login-form']} */ ;
const { default: __VLS_9 } = __VLS_3.slots;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({}));
const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.rolePreset),
    placeholder: (__VLS_ctx.$t('login.loginRolePlaceholder')),
    ...{ class: "preset-select" },
}));
const __VLS_18 = __VLS_17({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.rolePreset),
    placeholder: (__VLS_ctx.$t('login.loginRolePlaceholder')),
    ...{ class: "preset-select" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
const __VLS_22 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.applyPreset),
};
/** @type {__VLS_StyleScopedClasses['preset-select']} */ ;
const { default: __VLS_23 } = __VLS_19.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.roleOptions))) {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_26 = __VLS_25({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    // @ts-ignore
    [$t, $t, $t, loginForm, loginRules, handleLogin, rolePreset, applyPreset, roleOptions,];
}
// @ts-ignore
[];
var __VLS_19;
var __VLS_20;
// @ts-ignore
[];
var __VLS_13;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    prop: "username",
}));
const __VLS_31 = __VLS_30({
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    modelValue: (__VLS_ctx.loginForm.username),
    autocomplete: "off",
    placeholder: (__VLS_ctx.$t('login.usernamePlaceholder')),
}));
const __VLS_37 = __VLS_36({
    modelValue: (__VLS_ctx.loginForm.username),
    autocomplete: "off",
    placeholder: (__VLS_ctx.$t('login.usernamePlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
// @ts-ignore
[$t, loginForm,];
var __VLS_32;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    prop: "password",
}));
const __VLS_42 = __VLS_41({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.loginForm.password),
    type: "password",
    showPassword: true,
    autocomplete: "new-password",
    placeholder: (__VLS_ctx.$t('login.passwordPlaceholder')),
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.loginForm.password),
    type: "password",
    showPassword: true,
    autocomplete: "new-password",
    placeholder: (__VLS_ctx.$t('login.passwordPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
// @ts-ignore
[$t, loginForm,];
var __VLS_43;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "form-options" },
});
/** @type {__VLS_StyleScopedClasses['form-options']} */ ;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.loginForm.remember),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.loginForm.remember),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    ...{ change: {} },
    onChange: (__VLS_ctx.handleRememberChange),
};
const { default: __VLS_58 } = __VLS_54.slots;
(__VLS_ctx.$t('login.rememberMe'));
// @ts-ignore
[$t, loginForm, handleRememberChange,];
var __VLS_54;
var __VLS_55;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
elLink;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    ...{ 'onClick': {} },
    type: "primary",
    underline: (false),
}));
const __VLS_61 = __VLS_60({
    ...{ 'onClick': {} },
    type: "primary",
    underline: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
let __VLS_64;
const __VLS_65 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.emits('goToMode', 'forgot');
        // @ts-ignore
        [emits,];
    },
};
const { default: __VLS_66 } = __VLS_62.slots;
(__VLS_ctx.$t('login.forgotPassword'));
// @ts-ignore
[$t,];
var __VLS_62;
var __VLS_63;
let __VLS_67;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
    loading: (__VLS_ctx.loading),
}));
const __VLS_69 = __VLS_68({
    ...{ 'onClick': {} },
    type: "primary",
    ...{ class: "submit-btn" },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_72;
const __VLS_73 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.handleLogin),
};
/** @type {__VLS_StyleScopedClasses['submit-btn']} */ ;
const { default: __VLS_74 } = __VLS_70.slots;
(__VLS_ctx.$t('button.login'));
// @ts-ignore
[$t, handleLogin, loading,];
var __VLS_70;
var __VLS_71;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
if (__VLS_ctx.APP_CONFIG.showPhoneLogin || __VLS_ctx.APP_CONFIG.showQrLogin) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "divider" },
    });
    /** @type {__VLS_StyleScopedClasses['divider']} */ ;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider'] | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
    const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "divider-text" },
    });
    /** @type {__VLS_StyleScopedClasses['divider-text']} */ ;
    (__VLS_ctx.$t('login.orUseOtherMethods'));
    // @ts-ignore
    [$t, APP_CONFIG, APP_CONFIG,];
    var __VLS_78;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "social-login" },
});
/** @type {__VLS_StyleScopedClasses['social-login']} */ ;
if (__VLS_ctx.APP_CONFIG.showPhoneLogin) {
    let __VLS_81;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
        ...{ 'onClick': {} },
        ...{ class: "social-btn" },
    }));
    const __VLS_83 = __VLS_82({
        ...{ 'onClick': {} },
        ...{ class: "social-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    let __VLS_86;
    const __VLS_87 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.APP_CONFIG.showPhoneLogin))
                return;
            __VLS_ctx.emits('goToMode', 'mobile');
            // @ts-ignore
            [emits, APP_CONFIG,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['social-btn']} */ ;
    const { default: __VLS_88 } = __VLS_84.slots;
    {
        const { icon: __VLS_89 } = __VLS_84.slots;
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({}));
        const __VLS_92 = __VLS_91({}, ...__VLS_functionalComponentArgsRest(__VLS_91));
        const { default: __VLS_95 } = __VLS_93.slots;
        const __VLS_96 = (__VLS_ctx.menuStore.iconComponents['Element:Iphone']);
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({}));
        const __VLS_98 = __VLS_97({}, ...__VLS_functionalComponentArgsRest(__VLS_97));
        // @ts-ignore
        [menuStore,];
        var __VLS_93;
        // @ts-ignore
        [];
    }
    (__VLS_ctx.$t('button.phoneLogin'));
    // @ts-ignore
    [$t,];
    var __VLS_84;
    var __VLS_85;
}
if (__VLS_ctx.APP_CONFIG.showQrLogin) {
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        ...{ 'onClick': {} },
        ...{ class: "social-btn" },
    }));
    const __VLS_103 = __VLS_102({
        ...{ 'onClick': {} },
        ...{ class: "social-btn" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    let __VLS_106;
    const __VLS_107 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.APP_CONFIG.showQrLogin))
                return;
            __VLS_ctx.emits('goToMode', 'qr');
            // @ts-ignore
            [emits, APP_CONFIG,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['social-btn']} */ ;
    const { default: __VLS_108 } = __VLS_104.slots;
    {
        const { icon: __VLS_109 } = __VLS_104.slots;
        let __VLS_110;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
        const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
        const { default: __VLS_115 } = __VLS_113.slots;
        const __VLS_116 = (__VLS_ctx.menuStore.iconComponents['Element:FullScreen']);
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({}));
        const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
        // @ts-ignore
        [menuStore,];
        var __VLS_113;
        // @ts-ignore
        [];
    }
    (__VLS_ctx.$t('button.scanLogin'));
    // @ts-ignore
    [$t,];
    var __VLS_104;
    var __VLS_105;
}
if (__VLS_ctx.APP_CONFIG.showRegister) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "register-link" },
    });
    /** @type {__VLS_StyleScopedClasses['register-link']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('login.noAccount'));
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link'] | typeof __VLS_components.elLink | typeof __VLS_components.ElLink | typeof __VLS_components['el-link']} */
    elLink;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }));
    const __VLS_123 = __VLS_122({
        ...{ 'onClick': {} },
        type: "primary",
        underline: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    let __VLS_126;
    const __VLS_127 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.APP_CONFIG.showRegister))
                return;
            __VLS_ctx.emits('goToMode', 'register');
            // @ts-ignore
            [$t, emits, APP_CONFIG,];
        },
    };
    const { default: __VLS_128 } = __VLS_124.slots;
    (__VLS_ctx.$t('login.registerNow'));
    // @ts-ignore
    [$t,];
    var __VLS_124;
    var __VLS_125;
}
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
