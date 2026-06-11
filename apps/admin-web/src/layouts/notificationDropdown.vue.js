/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const router = useRouter();
const userStore = useUserStore();
const menuStore = useMenuStore();
const notificationDropdownRef = ref();
// 未读消息列表
const unreadMessageList = computed(() => {
    return userStore.userMessages.filter((msg) => !msg.read);
});
// 跳转到个人中心
const goToProfile = () => {
    router.push('/profile');
    userStore.currentTab = 'messages';
    notificationDropdownRef.value?.handleClose();
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    ref: "notificationDropdownRef",
    popperClass: "notification-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    trigger: "click",
    showArrow: (false),
    placement: "bottom-end",
    ref: "notificationDropdownRef",
    popperClass: "notification-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge'] | typeof __VLS_components.elBadge | typeof __VLS_components.ElBadge | typeof __VLS_components['el-badge']} */
elBadge;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    value: (__VLS_ctx.userStore.unreadCount),
    hidden: (__VLS_ctx.userStore.unreadCount === 0),
    max: (99),
    offset: ([-5, 5]),
}));
const __VLS_10 = __VLS_9({
    value: (__VLS_ctx.userStore.unreadCount),
    hidden: (__VLS_ctx.userStore.unreadCount === 0),
    max: (99),
    offset: ([-5, 5]),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    name: "bell",
    intensity: "light",
    duration: (600),
}));
const __VLS_16 = __VLS_15({
    name: "bell",
    intensity: "light",
    duration: (600),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    icon: "HOutline:BellAlertIcon",
}));
const __VLS_22 = __VLS_21({
    icon: "HOutline:BellAlertIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[userStore, userStore,];
var __VLS_17;
// @ts-ignore
[];
var __VLS_11;
{
    const { dropdown: __VLS_25 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "notification-dropdown" },
    });
    /** @type {__VLS_StyleScopedClasses['notification-dropdown']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "notification-header" },
    });
    /** @type {__VLS_StyleScopedClasses['notification-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "title" },
    });
    /** @type {__VLS_StyleScopedClasses['title']} */ ;
    (__VLS_ctx.$t('layout.notification'));
    if (__VLS_ctx.userStore.unreadCount > 0) {
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            size: "small",
        }));
        const __VLS_28 = __VLS_27({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        let __VLS_31;
        const __VLS_32 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.userStore.unreadCount > 0))
                    return;
                __VLS_ctx.userStore.markAllAsRead();
                // @ts-ignore
                [userStore, userStore, $t,];
            },
        };
        const { default: __VLS_33 } = __VLS_29.slots;
        let __VLS_34;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
            ...{ class: "button-icon" },
        }));
        const __VLS_36 = __VLS_35({
            ...{ class: "button-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        /** @type {__VLS_StyleScopedClasses['button-icon']} */ ;
        const { default: __VLS_39 } = __VLS_37.slots;
        const __VLS_40 = (__VLS_ctx.menuStore.iconComponents['Check']);
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
        const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
        // @ts-ignore
        [menuStore,];
        var __VLS_37;
        (__VLS_ctx.$t('layout.allRead'));
        // @ts-ignore
        [$t,];
        var __VLS_29;
        var __VLS_30;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "notification-list" },
    });
    /** @type {__VLS_StyleScopedClasses['notification-list']} */ ;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        maxHeight: "400px",
    }));
    const __VLS_47 = __VLS_46({
        maxHeight: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    const { default: __VLS_50 } = __VLS_48.slots;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
    Transition;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        name: "zoom",
        ...{ style: ({ '--animation-duration': '0.5s' }) },
        mode: "out-in",
    }));
    const __VLS_53 = __VLS_52({
        name: "zoom",
        ...{ style: ({ '--animation-duration': '0.5s' }) },
        mode: "out-in",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    const { default: __VLS_56 } = __VLS_54.slots;
    if (__VLS_ctx.unreadMessageList.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "empty-message" },
        });
        /** @type {__VLS_StyleScopedClasses['empty-message']} */ ;
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
        elEmpty;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            description: "{{ $t('layout.noMessage') }}",
            imageSize: (80),
        }));
        const __VLS_59 = __VLS_58({
            description: "{{ $t('layout.noMessage') }}",
            imageSize: (80),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    }
    else {
        let __VLS_62;
        /** @ts-ignore @type { | typeof __VLS_components.TransitionGroup | typeof __VLS_components.TransitionGroup} */
        TransitionGroup;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            name: "group-slide-right",
            tag: "div",
        }));
        const __VLS_64 = __VLS_63({
            name: "group-slide-right",
            tag: "div",
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        const { default: __VLS_67 } = __VLS_65.slots;
        for (const [message] of __VLS_vFor((__VLS_ctx.unreadMessageList))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.unreadMessageList.length === 0))
                            return;
                        __VLS_ctx.userStore.markAsRead(message.id);
                        // @ts-ignore
                        [userStore, unreadMessageList, unreadMessageList,];
                    } },
                key: (message.id),
                ...{ class: "notification-item" },
            });
            /** @type {__VLS_StyleScopedClasses['notification-item']} */ ;
            let __VLS_68;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
                size: (32),
                src: (message.avatar),
            }));
            const __VLS_70 = __VLS_69({
                size: (32),
                src: (message.avatar),
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "message-content" },
            });
            /** @type {__VLS_StyleScopedClasses['message-content']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "message-title" },
            });
            /** @type {__VLS_StyleScopedClasses['message-title']} */ ;
            (message.title);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "message-text" },
            });
            /** @type {__VLS_StyleScopedClasses['message-text']} */ ;
            (message.content);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "message-time" },
            });
            /** @type {__VLS_StyleScopedClasses['message-time']} */ ;
            (message.time);
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_65;
    }
    // @ts-ignore
    [];
    var __VLS_54;
    // @ts-ignore
    [];
    var __VLS_48;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "notification-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['notification-footer']} */ ;
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_75 = __VLS_74({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    let __VLS_78;
    const __VLS_79 = {
        ...{ click: {} },
        onClick: (__VLS_ctx.goToProfile),
    };
    const { default: __VLS_80 } = __VLS_76.slots;
    (__VLS_ctx.$t('layout.viewAll'));
    // @ts-ignore
    [$t, goToProfile,];
    var __VLS_76;
    var __VLS_77;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
