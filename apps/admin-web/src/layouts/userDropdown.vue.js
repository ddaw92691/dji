/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { useI18n } from 'vue-i18n';
import IconGithub from '@/components/icons/IconGithub.vue';
import { Dialog } from '@/utils/dialog';
const { t } = useI18n();
const router = useRouter();
const menuStore = useMenuStore();
const userStore = useUserStore();
const updatePasswordRef = useTemplateRef({});
// 用户角色名称
const userRoleName = computed(() => {
    const roleCode = userStore.userInfo?.role;
    if (roleCode === 'SUPER_ADMIN')
        return '超级管理员';
    if (roleCode === 'ADMIN')
        return '管理员';
    return userStore.userRoleName;
});
// 用户菜单命令处理
const showLogoutConfirm = () => {
    Dialog.info({
        showCancelButton: true,
        content: t('layout.logoutContent'),
        confirmText: t('layout.logoutConfirmText'),
        cancelText: t('layout.logoutCancelText'),
        onConfirm: () => {
            userStore.logout();
        },
    });
};
const handleCommand = (command) => {
    switch (command) {
        case 'profile':
            userStore.currentTab = 'personalInfo';
            router.push('/profile');
            break;
        case 'docs':
            window.open('https://github.com/DFANNN/DFAN-Admin', '_blank');
            break;
        case 'github':
            window.open('https://github.com/DFANNN/DFAN-Admin', '_blank');
            break;
        case 'help':
            window.open('https://github.com/DFANNN/DFAN-Admin', '_blank');
            break;
        case 'password':
            updatePasswordRef.value?.showDialog();
            break;
        case 'logout':
            showLogoutConfirm();
            break;
    }
};
// 监听快捷键：Alt/Option + Q 触发退出登录弹窗
const handleKeydown = (event) => {
    const target = event.target;
    const isTyping = (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) ||
        target?.getAttribute('contenteditable') === 'true';
    if (isTyping)
        return;
    // Mac 上 Option+Q 常返回 Dead key，改用 code 判断物理键位
    if (event.altKey && event.code === 'KeyQ') {
        event.preventDefault();
        showLogoutConfirm();
    }
};
onMounted(() => {
    userStore.getUserInfo();
    userStore.getUserRoleName();
    window.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['header-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onCommand': {} },
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    popperClass: "user-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onCommand': {} },
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    popperClass: "user-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    ...{ command: {} },
    onCommand: (__VLS_ctx.handleCommand),
};
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-card" },
});
/** @type {__VLS_StyleScopedClasses['user-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "avatar-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    size: (36),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}));
const __VLS_10 = __VLS_9({
    size: (36),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "status-badge" },
});
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-info" },
});
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "username ellipsis-text" },
});
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis-text']} */ ;
(__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username);
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
BaseTag;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    text: (__VLS_ctx.userRoleName),
    size: "small",
}));
const __VLS_15 = __VLS_14({
    text: (__VLS_ctx.userRoleName),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
{
    const { dropdown: __VLS_18 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-menu-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['user-menu-wrapper']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-header" },
    });
    /** @type {__VLS_StyleScopedClasses['user-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar-wrapper']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        size: (48),
        src: (__VLS_ctx.userStore.userInfo?.avatar),
    }));
    const __VLS_21 = __VLS_20({
        size: (48),
        src: (__VLS_ctx.userStore.userInfo?.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "status-badge" },
    });
    /** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-info" },
    });
    /** @type {__VLS_StyleScopedClasses['user-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "name-row" },
    });
    /** @type {__VLS_StyleScopedClasses['name-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "user-name ellipsis-text" },
    });
    /** @type {__VLS_StyleScopedClasses['user-name']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis-text']} */ ;
    (__VLS_ctx.userStore.userInfo?.name || __VLS_ctx.userStore.userInfo?.username);
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        text: (__VLS_ctx.userRoleName),
        size: "small",
    }));
    const __VLS_26 = __VLS_25({
        text: (__VLS_ctx.userRoleName),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-email" },
    });
    /** @type {__VLS_StyleScopedClasses['user-email']} */ ;
    (__VLS_ctx.userStore.userInfo?.email || '');
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ class: "user-menu" },
    }));
    const __VLS_31 = __VLS_30({
        ...{ class: "user-menu" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    /** @type {__VLS_StyleScopedClasses['user-menu']} */ ;
    const { default: __VLS_34 } = __VLS_32.slots;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        command: "profile",
    }));
    const __VLS_37 = __VLS_36({
        command: "profile",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
    const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
    const { default: __VLS_46 } = __VLS_44.slots;
    const __VLS_47 = (__VLS_ctx.menuStore.iconComponents['HOutline:UserCircleIcon']);
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({}));
    const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
    // @ts-ignore
    [handleCommand, userStore, userStore, userStore, userStore, userStore, userStore, userStore, userRoleName, userRoleName, menuStore,];
    var __VLS_44;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('layout.profile'));
    // @ts-ignore
    [$t,];
    var __VLS_38;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        command: "docs",
    }));
    const __VLS_54 = __VLS_53({
        command: "docs",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_57 } = __VLS_55.slots;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({}));
    const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
    const { default: __VLS_63 } = __VLS_61.slots;
    const __VLS_64 = (__VLS_ctx.menuStore.iconComponents['HOutline:DocumentTextIcon']);
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    // @ts-ignore
    [menuStore,];
    var __VLS_61;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('layout.documentation'));
    // @ts-ignore
    [$t,];
    var __VLS_55;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        command: "github",
    }));
    const __VLS_71 = __VLS_70({
        command: "github",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const { default: __VLS_74 } = __VLS_72.slots;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({}));
    const __VLS_77 = __VLS_76({}, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    const __VLS_81 = IconGithub;
    // @ts-ignore
    const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({}));
    const __VLS_83 = __VLS_82({}, ...__VLS_functionalComponentArgsRest(__VLS_82));
    // @ts-ignore
    [];
    var __VLS_78;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
    var __VLS_72;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        command: "help",
    }));
    const __VLS_88 = __VLS_87({
        command: "help",
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    const { default: __VLS_91 } = __VLS_89.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    const { default: __VLS_97 } = __VLS_95.slots;
    const __VLS_98 = (__VLS_ctx.menuStore.iconComponents['HOutline:QuestionMarkCircleIcon']);
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({}));
    const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
    // @ts-ignore
    [menuStore,];
    var __VLS_95;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('layout.help'));
    // @ts-ignore
    [$t,];
    var __VLS_89;
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        divided: true,
        command: "password",
    }));
    const __VLS_105 = __VLS_104({
        divided: true,
        command: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    const { default: __VLS_108 } = __VLS_106.slots;
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({}));
    const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const { default: __VLS_114 } = __VLS_112.slots;
    const __VLS_115 = (__VLS_ctx.menuStore.iconComponents['HOutline:KeyIcon']);
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({}));
    const __VLS_117 = __VLS_116({}, ...__VLS_functionalComponentArgsRest(__VLS_116));
    // @ts-ignore
    [menuStore,];
    var __VLS_112;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('layout.changePassword'));
    // @ts-ignore
    [$t,];
    var __VLS_106;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        command: "logout",
    }));
    const __VLS_122 = __VLS_121({
        command: "logout",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const { default: __VLS_125 } = __VLS_123.slots;
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({}));
    const __VLS_128 = __VLS_127({}, ...__VLS_functionalComponentArgsRest(__VLS_127));
    const { default: __VLS_131 } = __VLS_129.slots;
    const __VLS_132 = (__VLS_ctx.menuStore.iconComponents['HOutline:ArrowRightOnRectangleIcon']);
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({}));
    const __VLS_134 = __VLS_133({}, ...__VLS_functionalComponentArgsRest(__VLS_133));
    // @ts-ignore
    [menuStore,];
    var __VLS_129;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('layout.logout'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "shortcut" },
    });
    /** @type {__VLS_StyleScopedClasses['shortcut']} */ ;
    // @ts-ignore
    [$t,];
    var __VLS_123;
    // @ts-ignore
    [];
    var __VLS_32;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.UpdatePassword} */
UpdatePassword;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ref: "updatePasswordRef",
}));
const __VLS_139 = __VLS_138({
    ref: "updatePasswordRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
var __VLS_142;
var __VLS_140;
// @ts-ignore
var __VLS_143 = __VLS_142;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
