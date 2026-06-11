/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const menuStore = useMenuStore();
// 当前事件
const currentEventTab = ref('toBeOpened');
// 所有事件
const allEvents = ref({
    toBeOpened: [
        { id: 1, date: '1月20日', title: '2026 年货节启动', range: '01.20 - 02.10', color: '#ef4444' },
        { id: 2, date: '2月14日', title: '情人节专项大促', range: '02.10 - 02.15', color: '#f99c7d' },
        { id: 5, date: '3月01日', title: '春季新品发布会', range: '03.01 - 03.05', color: '#3b82f6' },
    ],
    inProgress: [
        { id: 3, date: '3月01日', title: '春季新品发布会', range: '03.01 - 03.05', color: '#3b82f6' },
    ],
    review: [
        {
            id: 4,
            date: '12月25日',
            title: '圣诞节促销活动总结',
            range: '12.20 - 12.26',
            color: '#10b981',
        },
    ],
});
const events = computed(() => {
    return allEvents.value[currentEventTab.value];
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
    title: "近期运营大事件",
}));
const __VLS_2 = __VLS_1({
    title: "近期运营大事件",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    height: (260),
}));
const __VLS_9 = __VLS_8({
    height: (260),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between gap-4" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'toBeOpened' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}));
const __VLS_15 = __VLS_14({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'toBeOpened' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.currentEventTab = 'toBeOpened';
        // @ts-ignore
        [currentEventTab, currentEventTab,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
const { default: __VLS_20 } = __VLS_16.slots;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'inProgress' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'inProgress' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.currentEventTab = 'inProgress';
        // @ts-ignore
        [currentEventTab, currentEventTab,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
const { default: __VLS_28 } = __VLS_24.slots;
// @ts-ignore
[];
var __VLS_24;
var __VLS_25;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'review' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}));
const __VLS_31 = __VLS_30({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.currentEventTab === 'review' ? 'primary' : ''),
    round: true,
    ...{ class: "flex-1 btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
let __VLS_34;
const __VLS_35 = {
    ...{ click: {} },
    onClick: (...[$event]) => {
        __VLS_ctx.currentEventTab = 'review';
        // @ts-ignore
        [currentEventTab, currentEventTab,];
    },
};
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
const { default: __VLS_36 } = __VLS_32.slots;
// @ts-ignore
[];
var __VLS_32;
var __VLS_33;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    name: "zoom-in-top",
    mode: "out-in",
}));
const __VLS_39 = __VLS_38({
    name: "zoom-in-top",
    mode: "out-in",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    key: (__VLS_ctx.currentEventTab),
});
for (const [item] of __VLS_vFor((__VLS_ctx.events))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (item.id),
        ...{ class: "flex gap-4 mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-15 text-sm text-(--el-text-color-regular)" },
    });
    /** @type {__VLS_StyleScopedClasses['w-15']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-regular)']} */ ;
    (item.date);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-1 flex flex-col gap-3 border-l-4 px-4 py-2 bg-(--el-bg-color-page) rounded-2xl" },
        ...{ style: ({ borderLeftColor: item.color }) },
    });
    /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-l-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-(--el-bg-color-page)']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm font-semibold" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    (item.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-xs text-(--el-text-color-secondary) flex items-center gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        size: "14",
    }));
    const __VLS_45 = __VLS_44({
        size: "14",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    const __VLS_49 = (__VLS_ctx.menuStore.iconComponents['HOutline:CalendarIcon']);
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    // @ts-ignore
    [currentEventTab, events, menuStore,];
    var __VLS_46;
    (item.range);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        size: (24),
        src: (`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`),
    }));
    const __VLS_56 = __VLS_55({
        size: (24),
        src: (`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`),
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "text-xs text-(--el-text-color-secondary)" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-(--el-text-color-secondary)']} */ ;
    (__VLS_ctx.currentEventTab === 'toBeOpened'
        ? '策划中...'
        : __VLS_ctx.currentEventTab === 'inProgress'
            ? '进行中...'
            : '已结束');
    // @ts-ignore
    [currentEventTab, currentEventTab,];
}
// @ts-ignore
[];
var __VLS_40;
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
