/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const menuStore = useMenuStore();
// 动态
const activities = ref([
    {
        id: 1,
        name: '林东东',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
        action: '在',
        target: '项目组 007',
        comment: '这个界面的阴影处理得非常棒，很有质感！',
        time: '刚刚',
        online: true,
        tag: 'UI 评价',
        tagType: 'success',
    },
    {
        id: 2,
        name: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        action: '发表了关于',
        target: 'UI 优化的建议',
        comment: '建议在移动端把侧边栏改为底部导航栏，用户体验会更好。',
        time: '10 分钟前',
        online: false,
        tag: '产品建议',
        tagType: 'primary',
    },
    {
        id: 3,
        name: '李四',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
        action: '提交了代码到',
        target: 'main 分支',
        time: '1 小时前',
        online: true,
        tag: '代码提交',
        tagType: 'warning',
    },
    {
        id: 5,
        name: '赵六',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neo',
        action: '在',
        target: '性能优化讨论中',
        comment: '首屏加载速度明显提升了，特别是在弱网环境下体验改善很明显。',
        time: '5 小时前',
        online: false,
        tag: '性能优化',
        tagType: 'success',
    },
    {
        id: 6,
        name: '周七',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        action: '评论了',
        target: '代码规范文档',
        comment: '统一了组件命名和目录结构后，新同事上手速度快了不少，建议继续完善。',
        time: '昨天',
        online: true,
        tag: '技术规范',
        tagType: 'primary',
    },
    {
        id: 7,
        name: '孙八',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        action: '在',
        target: '需求评审会议中',
        comment: '这个功能如果能加上默认值配置，会减少很多重复操作。',
        time: '2 天前',
        online: false,
        tag: '需求评审',
        tagType: 'info',
    },
    {
        id: 4,
        name: '王五',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
        action: '创建了新任务',
        target: '周报系统对接',
        time: '3 小时前',
        online: true,
        tag: '任务管理',
        tagType: 'info',
    },
]);
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
    title: "团队动态与最新评价",
    titleIcon: "HOutline:SparklesIcon",
}));
const __VLS_2 = __VLS_1({
    title: "团队动态与最新评价",
    titleIcon: "HOutline:SparklesIcon",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    height: (540),
}));
const __VLS_9 = __VLS_8({
    height: (540),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.activities))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.id),
        ...{ class: "flex gap-5 py-6 border-b border-(--el-border-color-extra-light) last:border-none" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-(--el-border-color-extra-light)']} */ ;
    /** @type {__VLS_StyleScopedClasses['last:border-none']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative shrink h-10 w-10" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        size: (40),
        src: (item.avatar),
    }));
    const __VLS_15 = __VLS_14({
        size: (40),
        src: (item.avatar),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "absolute w-2.5 h-2.5 bottom-0 right-0 border-2 rounded-full border-(--el-bg-color)" },
        ...{ style: ({
                backgroundColor: item.online ? 'var(--el-color-success)' : 'var(--el-color-info)',
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-(--el-bg-color)']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-1 flex flex-col gap-3" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-sm font-bold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    (item.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-xs text-(--el-text-color-placeholder)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-placeholder)']} */ ;
    (item.time);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-2" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
    (item.action);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-(--el-color-primary) font-semibold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-(--el-color-primary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    (item.target);
    if (item.comment) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-2 py-3 px-4 rounded-xl text-sm border-l-4 italic text-(--el-text-color-secondary) border-(--el-border-color) bg-(--el-bg-color-page)" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['italic']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-(--el-border-color)']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
        (item.comment);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.BaseTag} */
    BaseTag;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        type: (item.tagType),
        text: (item.tag),
    }));
    const __VLS_20 = __VLS_19({
        type: (item.tagType),
        text: (item.tag),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "group flex gap-2 items-center text-xs cursor-pointer text-(--el-text-color-placeholder) hover:text-(--el-color-primary)" },
    });
    /** @type {__VLS_StyleScopedClasses['group']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-placeholder)']} */ ;
    /** @type {__VLS_StyleScopedClasses['hover:text-(--el-color-primary)']} */ ;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        size: "14",
    }));
    const __VLS_25 = __VLS_24({
        size: "14",
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const { default: __VLS_28 } = __VLS_26.slots;
    const __VLS_29 = (__VLS_ctx.menuStore.iconComponents['Element:ChatDotRound']);
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ class: "text-(--el-text-color-placeholder) group-hover:text-(--el-color-primary)" },
    }));
    const __VLS_31 = __VLS_30({
        ...{ class: "text-(--el-text-color-placeholder) group-hover:text-(--el-color-primary)" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-placeholder)']} */ ;
    /** @type {__VLS_StyleScopedClasses['group-hover:text-(--el-color-primary)']} */ ;
    // @ts-ignore
    [activities, menuStore,];
    var __VLS_26;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "" },
    });
    /** @type {__VLS_StyleScopedClasses['']} */ ;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
