/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { APP_CONFIG } from '@/config/app.config';
import helloLottie from '@/assets/lotties/hello.json';
import LottieAnimation from '@/components/animation/LottieAnimation.vue';
import AccountLogin from '@/views/login/accountLogin.vue';
import ForgotPassword from '@/views/login/forgotPassword.vue';
import MobileLogin from '@/views/login/mobileLogin.vue';
import QrLogin from '@/views/login/qrLogin.vue';
import Register from '@/views/login/register.vue';
import ThemeConfig from '@/components/ThemeConfig.vue';
import I18nDropdown from '@/layouts/i18nDropdown.vue';
defineOptions({ name: 'LoginView' });
const themeStore = useThemeStore();
// 登录模式：login | forgot | mobile | qr | register
const loginMode = ref('login');
//  切换登录模式
const goToMode = (mode) => {
    loginMode.value = mode;
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['lottie-animation-wrap']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-container" },
});
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['card-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-decoration-orange" },
});
/** @type {__VLS_StyleScopedClasses['bg-decoration-orange']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-decoration-blue" },
});
/** @type {__VLS_StyleScopedClasses['bg-decoration-blue']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-card" },
});
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-card-top" },
});
/** @type {__VLS_StyleScopedClasses['login-card-top']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "brand" },
});
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.APP_CONFIG.logoSrc),
    alt: "logo",
    ...{ class: "logo" },
});
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "brand-name" },
});
/** @type {__VLS_StyleScopedClasses['brand-name']} */ ;
(__VLS_ctx.APP_CONFIG.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "top-actions" },
});
/** @type {__VLS_StyleScopedClasses['top-actions']} */ ;
if (__VLS_ctx.APP_CONFIG.showI18n) {
    const __VLS_0 = I18nDropdown;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
if (__VLS_ctx.APP_CONFIG.showThemeConfig) {
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        name: "rotate",
    }));
    const __VLS_7 = __VLS_6({
        name: "rotate",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    const { default: __VLS_10 } = __VLS_8.slots;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
    IconButton;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        icon: "HOutline:Cog6ToothIcon",
        tooltip: (__VLS_ctx.$t('tooltip.themeConfig')),
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        icon: "HOutline:Cog6ToothIcon",
        tooltip: (__VLS_ctx.$t('tooltip.themeConfig')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.APP_CONFIG.showThemeConfig))
                return;
            __VLS_ctx.themeStore.themeConfigDrawerOpen = true;
            // @ts-ignore
            [APP_CONFIG, APP_CONFIG, APP_CONFIG, APP_CONFIG, $t, themeStore,];
        },
    };
    var __VLS_14;
    var __VLS_15;
    // @ts-ignore
    [];
    var __VLS_8;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-card-bottom" },
});
/** @type {__VLS_StyleScopedClasses['login-card-bottom']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "lottie-animation-wrap" },
});
/** @type {__VLS_StyleScopedClasses['lottie-animation-wrap']} */ ;
const __VLS_18 = LottieAnimation;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    animationData: (__VLS_ctx.helloLottie),
    width: "100%",
    height: "100%",
}));
const __VLS_20 = __VLS_19({
    animationData: (__VLS_ctx.helloLottie),
    width: "100%",
    height: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-form-wrap" },
});
/** @type {__VLS_StyleScopedClasses['login-form-wrap']} */ ;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    name: "fade-slide",
    mode: "out-in",
}));
const __VLS_25 = __VLS_24({
    name: "fade-slide",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
if (__VLS_ctx.loginMode === 'login') {
    const __VLS_29 = AccountLogin;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ 'onGoToMode': {} },
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onGoToMode': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = {
        ...{ goToMode: {} },
        onGoToMode: (__VLS_ctx.goToMode),
    };
    var __VLS_32;
    var __VLS_33;
}
else if (__VLS_ctx.loginMode === 'forgot') {
    const __VLS_36 = ForgotPassword;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ...{ 'onGoToMode': {} },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onGoToMode': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    const __VLS_42 = {
        ...{ goToMode: {} },
        onGoToMode: (__VLS_ctx.goToMode),
    };
    var __VLS_39;
    var __VLS_40;
}
else if (__VLS_ctx.loginMode === 'mobile') {
    const __VLS_43 = MobileLogin;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onGoToMode': {} },
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onGoToMode': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        ...{ goToMode: {} },
        onGoToMode: (__VLS_ctx.goToMode),
    };
    var __VLS_46;
    var __VLS_47;
}
else if (__VLS_ctx.loginMode === 'qr') {
    const __VLS_50 = QrLogin;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onGoToMode': {} },
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onGoToMode': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        ...{ goToMode: {} },
        onGoToMode: (__VLS_ctx.goToMode),
    };
    var __VLS_53;
    var __VLS_54;
}
else if (__VLS_ctx.loginMode === 'register') {
    const __VLS_57 = Register;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onGoToMode': {} },
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onGoToMode': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        ...{ goToMode: {} },
        onGoToMode: (__VLS_ctx.goToMode),
    };
    var __VLS_60;
    var __VLS_61;
}
// @ts-ignore
[helloLottie, loginMode, loginMode, loginMode, loginMode, loginMode, goToMode, goToMode, goToMode, goToMode, goToMode,];
var __VLS_26;
const __VLS_64 = ThemeConfig;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "login-copyright" },
});
/** @type {__VLS_StyleScopedClasses['login-copyright']} */ ;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
