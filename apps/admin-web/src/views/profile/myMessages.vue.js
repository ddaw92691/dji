/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { Dialog } from '@/utils/dialog';
import { delay } from '@/utils/utils';
import BadgeTabsMenu from '@/components/tabs/BadgeTabsMenu.vue';
import { ElMessage } from 'element-plus';
const userStore = useUserStore();
const menuStore = useMenuStore();
// 消息内容
const postContent = ref('');
// 当前菜单
const activeName = ref('all');
// 菜单
const tabsMenu = computed(() => [
    { key: 'all', label: '全部消息', badge: 0 },
    { key: 'unread', label: '未读消息', badge: userStore.unreadCount },
]);
// 消息列表
const messageList = computed(() => {
    if (activeName.value === 'unread') {
        return userStore.userMessages.filter((item) => !item.read);
    }
    return userStore.userMessages;
});
// 发送消息
const sendMessage = () => {
    userStore.sendMessage(postContent.value);
    ElMessage.success('发送成功');
    postContent.value = '';
};
// 清空全部消息
const clearAllMessages = () => {
    Dialog.confirm({
        title: '确认清空？',
        content: '这一操作会删除所有消息，手滑之后可就找不回来了哦～',
        onConfirm: async () => {
            await delay(1000);
            userStore.deleteAllMessages();
            ElMessage.success('消息清空完成');
        },
    });
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
elAvatar;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    size: (32),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}));
const __VLS_8 = __VLS_7({
    size: (32),
    src: (__VLS_ctx.userStore.userInfo?.avatar),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-sm font-medium text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
(__VLS_ctx.userStore.userInfo?.name);
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    modelValue: (__VLS_ctx.postContent),
    rows: (3),
    type: "textarea",
    placeholder: "输入消息内容...",
    ...{ class: "mt-4" },
}));
const __VLS_13 = __VLS_12({
    modelValue: (__VLS_ctx.postContent),
    rows: (3),
    type: "textarea",
    placeholder: "输入消息内容...",
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between mt-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-xs text-(--el-text-color-secondary)" },
});
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.postContent.trim()),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (!__VLS_ctx.postContent.trim()),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
const __VLS_22 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.sendMessage),
};
const { default: __VLS_23 } = __VLS_19.slots;
// @ts-ignore
[userStore, userStore, postContent, postContent, sendMessage,];
var __VLS_19;
var __VLS_20;
// @ts-ignore
[];
var __VLS_3;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.BaseCard | typeof __VLS_components.BaseCard} */
BaseCard;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ class: "mt-4" },
}));
const __VLS_26 = __VLS_25({
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_29 } = __VLS_27.slots;
{
    const { header: __VLS_30 } = __VLS_27.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-1" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    const __VLS_31 = BadgeTabsMenu;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        modelValue: (__VLS_ctx.activeName),
        tabsMenuData: (__VLS_ctx.tabsMenu),
        tabsItemHeight: (30),
    }));
    const __VLS_33 = __VLS_32({
        modelValue: (__VLS_ctx.activeName),
        tabsMenuData: (__VLS_ctx.tabsMenu),
        tabsItemHeight: (30),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    if (__VLS_ctx.menuStore.isMobile) {
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
        IconButton;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            ...{ 'onClick': {} },
            icon: "Element:Check",
            type: "primary",
            tooltip: "一键已读",
            size: "1.5rem",
            iconSize: "1rem",
            disabled: (!__VLS_ctx.userStore.unreadCount),
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onClick': {} },
            icon: "Element:Check",
            type: "primary",
            tooltip: "一键已读",
            size: "1.5rem",
            iconSize: "1rem",
            disabled: (!__VLS_ctx.userStore.unreadCount),
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_41;
        const __VLS_42 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.menuStore.isMobile))
                    return;
                __VLS_ctx.userStore.markAllAsRead();
                // @ts-ignore
                [userStore, userStore, activeName, tabsMenu, menuStore,];
            },
        };
        var __VLS_39;
        var __VLS_40;
    }
    else {
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            disabled: (!__VLS_ctx.userStore.unreadCount),
        }));
        const __VLS_45 = __VLS_44({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
            disabled: (!__VLS_ctx.userStore.unreadCount),
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        let __VLS_48;
        const __VLS_49 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.menuStore.isMobile))
                    return;
                __VLS_ctx.userStore.markAllAsRead();
                // @ts-ignore
                [userStore, userStore,];
            },
        };
        const { default: __VLS_50 } = __VLS_46.slots;
        // @ts-ignore
        [];
        var __VLS_46;
        var __VLS_47;
    }
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        direction: "vertical",
    }));
    const __VLS_53 = __VLS_52({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    if (__VLS_ctx.menuStore.isMobile) {
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
        IconButton;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            ...{ 'onClick': {} },
            icon: "Element:Delete",
            type: "danger",
            tooltip: "清空全部",
            size: "1.5rem",
            iconSize: "1rem",
            disabled: (!__VLS_ctx.userStore.userMessages.length),
        }));
        const __VLS_58 = __VLS_57({
            ...{ 'onClick': {} },
            icon: "Element:Delete",
            type: "danger",
            tooltip: "清空全部",
            size: "1.5rem",
            iconSize: "1rem",
            disabled: (!__VLS_ctx.userStore.userMessages.length),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        let __VLS_61;
        const __VLS_62 = {
            ...{ click: {} },
            onClick: (__VLS_ctx.clearAllMessages),
        };
        var __VLS_59;
        var __VLS_60;
    }
    else {
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            disabled: (!__VLS_ctx.userStore.userMessages.length),
        }));
        const __VLS_65 = __VLS_64({
            ...{ 'onClick': {} },
            type: "danger",
            link: true,
            disabled: (!__VLS_ctx.userStore.userMessages.length),
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        let __VLS_68;
        const __VLS_69 = {
            ...{ click: {} },
            onClick: (__VLS_ctx.clearAllMessages),
        };
        const { default: __VLS_70 } = __VLS_66.slots;
        // @ts-ignore
        [userStore, userStore, menuStore, clearAllMessages, clearAllMessages,];
        var __VLS_66;
        var __VLS_67;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    name: "zoom",
    mode: "out-in",
}));
const __VLS_73 = __VLS_72({
    name: "zoom",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
const { default: __VLS_76 } = __VLS_74.slots;
if (__VLS_ctx.messageList.length === 0) {
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        description: (__VLS_ctx.activeName === 'unread' ? '暂无未读消息' : '暂无消息'),
    }));
    const __VLS_79 = __VLS_78({
        description: (__VLS_ctx.activeName === 'unread' ? '暂无未读消息' : '暂无消息'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
}
else {
    let __VLS_82;
    /** @ts-ignore @type { | typeof __VLS_components.TransitionGroup | typeof __VLS_components.TransitionGroup} */
    TransitionGroup;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
        name: "group-slide-right",
        tag: "div",
    }));
    const __VLS_84 = __VLS_83({
        name: "group-slide-right",
        tag: "div",
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    const { default: __VLS_87 } = __VLS_85.slots;
    for (const [message] of __VLS_vFor((__VLS_ctx.messageList))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (message.id),
        });
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
        HoverAnimateWrapper;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            name: "lift",
            intensity: "light",
            ...{ class: "w-full" },
        }));
        const __VLS_90 = __VLS_89({
            name: "lift",
            intensity: "light",
            ...{ class: "w-full" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        const { default: __VLS_93 } = __VLS_91.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "group p-4 mb-3 flex items-center gap-4 border border-(--el-border-color-light) rounded-xl cursor-pointer hover:border-(--el-border-color) hover:bg-(--el-bg-color-page)" },
        });
        /** @type {__VLS_StyleScopedClasses['group']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-(--el-border-color-light)']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:border-(--el-border-color)']} */ ;
        /** @type {__VLS_StyleScopedClasses['hover:bg-(--el-bg-color-page)']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "relative" },
        });
        /** @type {__VLS_StyleScopedClasses['relative']} */ ;
        let __VLS_94;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
            size: (48),
            src: (message.avatar),
        }));
        const __VLS_96 = __VLS_95({
            size: (48),
            src: (message.avatar),
        }, ...__VLS_functionalComponentArgsRest(__VLS_95));
        if (!message.read) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "absolute h-3 w-3 bottom-1.5 right-0.5 rounded-full border-3 border-(--el-bg-color) bg-(--el-color-danger)" },
            });
            /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
            /** @type {__VLS_StyleScopedClasses['h-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['bottom-1.5']} */ ;
            /** @type {__VLS_StyleScopedClasses['right-0.5']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-(--el-bg-color)']} */ ;
            /** @type {__VLS_StyleScopedClasses['bg-(--el-color-danger)']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-1" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex justify-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        let __VLS_99;
        /** @ts-ignore @type { | typeof __VLS_components.TextEllipsis} */
        TextEllipsis;
        // @ts-ignore
        const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
            text: (message.title),
            clickable: (false),
            tooltipType: "none",
        }));
        const __VLS_101 = __VLS_100({
            text: (message.title),
            clickable: (false),
            tooltipType: "none",
        }, ...__VLS_functionalComponentArgsRest(__VLS_100));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center opacity-100 lg:opacity-0 group-hover:opacity-100" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['opacity-100']} */ ;
        /** @type {__VLS_StyleScopedClasses['lg:opacity-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['group-hover:opacity-100']} */ ;
        if (!message.read) {
            let __VLS_104;
            /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
            IconButton;
            // @ts-ignore
            const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
                ...{ 'onClick': {} },
                icon: "Element:Check",
                type: "primary",
                tooltip: "设为已读",
                size: "1.5rem",
                iconSize: "1rem",
            }));
            const __VLS_106 = __VLS_105({
                ...{ 'onClick': {} },
                icon: "Element:Check",
                type: "primary",
                tooltip: "设为已读",
                size: "1.5rem",
                iconSize: "1rem",
            }, ...__VLS_functionalComponentArgsRest(__VLS_105));
            let __VLS_109;
            const __VLS_110 = {
                ...{ click: {} },
                onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.messageList.length === 0))
                        return;
                    if (!(!message.read))
                        return;
                    __VLS_ctx.userStore.markAsRead(message.id);
                    // @ts-ignore
                    [userStore, activeName, messageList, messageList,];
                },
            };
            var __VLS_107;
            var __VLS_108;
        }
        if (!message.read) {
            let __VLS_111;
            /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
            elDivider;
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                direction: "vertical",
            }));
            const __VLS_113 = __VLS_112({
                direction: "vertical",
            }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        }
        let __VLS_116;
        /** @ts-ignore @type { | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm'] | typeof __VLS_components.elPopconfirm | typeof __VLS_components.ElPopconfirm | typeof __VLS_components['el-popconfirm']} */
        elPopconfirm;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
            ...{ 'onConfirm': {} },
            title: "确定删除这条消息吗？",
        }));
        const __VLS_118 = __VLS_117({
            ...{ 'onConfirm': {} },
            title: "确定删除这条消息吗？",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        let __VLS_121;
        const __VLS_122 = {
            ...{ confirm: {} },
            onConfirm: (...[$event]) => {
                if (!!(__VLS_ctx.messageList.length === 0))
                    return;
                (__VLS_ctx.userStore.deleteMessage(message.id), __VLS_ctx.ElMessage.success('删除成功'));
                // @ts-ignore
                [userStore, ElMessage,];
            },
        };
        const { default: __VLS_123 } = __VLS_119.slots;
        {
            const { reference: __VLS_124 } = __VLS_119.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            let __VLS_125;
            /** @ts-ignore @type { | typeof __VLS_components.IconButton} */
            IconButton;
            // @ts-ignore
            const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
                icon: "Element:Delete",
                type: "danger",
                size: "1.5rem",
                iconSize: "1rem",
                tooltip: "删除",
            }));
            const __VLS_127 = __VLS_126({
                icon: "Element:Delete",
                type: "danger",
                size: "1.5rem",
                iconSize: "1rem",
                tooltip: "删除",
            }, ...__VLS_functionalComponentArgsRest(__VLS_126));
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_119;
        var __VLS_120;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-2 text-sm text-(--el-text-color-regular) leading-relaxed wrap-break-word" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
        /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
        /** @type {__VLS_StyleScopedClasses['wrap-break-word']} */ ;
        (message.content);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-xs text-(--el-text-color-secondary) mt-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        (message.time);
        // @ts-ignore
        [];
        var __VLS_91;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_85;
}
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_27;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
