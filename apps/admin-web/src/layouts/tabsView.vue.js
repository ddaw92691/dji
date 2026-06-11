/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/Administrator/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
defineOptions({ name: 'TabsView' });
const router = useRouter();
const menuStore = useMenuStore();
const tabsStore = useTabsStore();
const tabsPagesRef = useTemplateRef('tabsPagesRef');
// 存储每个标签页的 DOM 引用
const tabRefs = new Map();
// 设置标签页引用
const setTabRef = (el, path) => {
    if (el && el instanceof HTMLElement) {
        tabRefs.set(path, el);
    }
    else {
        tabRefs.delete(path);
    }
};
// 滚动到选中的标签页
const scrollToActiveTab = () => {
    nextTick(() => {
        const activeTab = tabRefs.get(tabsStore.activePath);
        const container = tabsPagesRef.value;
        if (!activeTab || !container)
            return;
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        // 检查标签页是否在可视区域内
        const isVisible = tabRect.left >= containerRect.left && tabRect.right <= containerRect.right;
        if (!isVisible) {
            // 如果标签页在左侧不可见
            if (tabRect.left < containerRect.left) {
                container.scrollTo({
                    left: container.scrollLeft + (tabRect.left - containerRect.left) - 10,
                    behavior: 'smooth',
                });
            }
            // 如果标签页在右侧不可见
            else if (tabRect.right > containerRect.right) {
                container.scrollTo({
                    left: container.scrollLeft + (tabRect.right - containerRect.right) + 10,
                    behavior: 'smooth',
                });
            }
        }
    });
};
// 监听 activePath 变化，自动滚动到选中的标签页
watch(() => tabsStore.activePath, () => {
    scrollToActiveTab();
}, { immediate: true });
// 监听 tabs 数组变化，确保在标签页添加或删除后也能正确滚动
watch(() => tabsStore.tabs.length, () => {
    scrollToActiveTab();
});
// 导航到指定路径
const navigation = (path) => {
    router.push(path);
    tabsStore.activePath = path;
    scrollToActiveTab();
};
// 关闭标签页
const handleClose = (item) => {
    tabsStore.removeTab(item.path);
    router.push(tabsStore.activePath);
    scrollToActiveTab();
};
// 滚动步进值（容器宽度的80%）
const SCROLL_STEP_RATIO = 0.8;
// 获取滚动容器信息
const getScrollInfo = () => {
    const container = tabsPagesRef.value;
    if (!container)
        return null;
    return {
        container,
        containerWidth: container.offsetWidth,
        contentWidth: container.scrollWidth,
        scrollLeft: container.scrollLeft,
        maxScrollLeft: container.scrollWidth - container.offsetWidth,
    };
};
// 向左滑动
const slideLeft = () => {
    const info = getScrollInfo();
    if (!info)
        return;
    // 检查是否需要滚动（内容超出容器）
    if (info.containerWidth >= info.contentWidth)
        return;
    // 计算滚动距离（容器宽度的80%）
    const scrollDistance = info.containerWidth * SCROLL_STEP_RATIO;
    // 计算目标滚动位置
    const targetScrollLeft = Math.max(0, info.scrollLeft - scrollDistance);
    // 如果已经在最左边，不执行滚动
    if (info.scrollLeft <= 0)
        return;
    info.container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
    });
};
// 向右滑动
const slideRight = () => {
    const info = getScrollInfo();
    if (!info)
        return;
    // 检查是否需要滚动（内容超出容器）
    if (info.containerWidth >= info.contentWidth)
        return;
    // 计算滚动距离（容器宽度的80%）
    const scrollDistance = info.containerWidth * SCROLL_STEP_RATIO;
    // 计算目标滚动位置
    const targetScrollLeft = Math.min(info.maxScrollLeft, info.scrollLeft + scrollDistance);
    // 如果已经在最右边，不执行滚动
    if (info.scrollLeft >= info.maxScrollLeft)
        return;
    info.container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
    });
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-dropdown-menu__item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-container" },
});
/** @type {__VLS_StyleScopedClasses['tabs-container']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "rubber",
}));
const __VLS_2 = __VLS_1({
    name: "rubber",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    icon: "HOutline:ChevronLeftIcon",
    size: "1.75rem",
    tooltip: (__VLS_ctx.$t('layout.swipeLeft')),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    icon: "HOutline:ChevronLeftIcon",
    size: "1.75rem",
    tooltip: (__VLS_ctx.$t('layout.swipeLeft')),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.slideLeft),
};
var __VLS_9;
var __VLS_10;
// @ts-ignore
[$t, slideLeft,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-pages" },
    ref: "tabsPagesRef",
});
/** @type {__VLS_StyleScopedClasses['tabs-pages']} */ ;
for (const [tab] of __VLS_vFor((__VLS_ctx.tabsStore.tabs))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.navigation(tab.path);
                // @ts-ignore
                [tabsStore, navigation,];
            } },
        ...{ class: "tabs-page-item" },
        ...{ class: ({ active: tab.path === __VLS_ctx.tabsStore.activePath }) },
        key: (tab.path),
        ref: ((el) => __VLS_ctx.setTabRef(el, tab.path)),
    });
    /** @type {__VLS_StyleScopedClasses['tabs-page-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
    HoverAnimateWrapper;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        name: "wobble",
        duration: (700),
    }));
    const __VLS_15 = __VLS_14({
        name: "wobble",
        duration: (700),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ class: "tabs-page-icon" },
        size: "18",
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: "tabs-page-icon" },
        size: "18",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    /** @type {__VLS_StyleScopedClasses['tabs-page-icon']} */ ;
    const { default: __VLS_24 } = __VLS_22.slots;
    const __VLS_25 = (__VLS_ctx.menuStore.iconComponents[tab.icon]);
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    // @ts-ignore
    [tabsStore, setTabRef, menuStore,];
    var __VLS_22;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (tab.title);
    if (tab.closable) {
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ 'onClick': {} },
            ...{ class: "close-icon" },
        }));
        const __VLS_32 = __VLS_31({
            ...{ 'onClick': {} },
            ...{ class: "close-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        let __VLS_35;
        const __VLS_36 = {
            ...{ click: {} },
            onClick: (...[$event]) => {
                if (!(tab.closable))
                    return;
                __VLS_ctx.handleClose(tab);
                // @ts-ignore
                [handleClose,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
        const { default: __VLS_37 } = __VLS_33.slots;
        const __VLS_38 = (__VLS_ctx.menuStore.iconComponents['HSolid:XMarkIcon']);
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
        const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
        // @ts-ignore
        [menuStore,];
        var __VLS_33;
        var __VLS_34;
    }
    // @ts-ignore
    [];
    var __VLS_16;
    // @ts-ignore
    [];
}
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    name: "rubber",
}));
const __VLS_45 = __VLS_44({
    name: "rubber",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    ...{ 'onClick': {} },
    icon: "HOutline:ChevronRightIcon",
    size: "1.75rem",
    tooltip: (__VLS_ctx.$t('layout.swipeRight')),
}));
const __VLS_51 = __VLS_50({
    ...{ 'onClick': {} },
    icon: "HOutline:ChevronRightIcon",
    size: "1.75rem",
    tooltip: (__VLS_ctx.$t('layout.swipeRight')),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
let __VLS_54;
const __VLS_55 = {
    ...{ click: {} },
    onClick: (__VLS_ctx.slideRight),
};
var __VLS_52;
var __VLS_53;
// @ts-ignore
[$t, slideRight,];
var __VLS_46;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-dropdown" },
});
/** @type {__VLS_StyleScopedClasses['tabs-dropdown']} */ ;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    trigger: "click",
    showArrow: (false),
    ...{ class: "tabs-dropdown-wrapper" },
    popperClass: "tabs-dropdown-popper",
}));
const __VLS_58 = __VLS_57({
    trigger: "click",
    showArrow: (false),
    ...{ class: "tabs-dropdown-wrapper" },
    popperClass: "tabs-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
/** @type {__VLS_StyleScopedClasses['tabs-dropdown-wrapper']} */ ;
const { default: __VLS_61 } = __VLS_59.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tabs-dropdown-icon" },
});
/** @type {__VLS_StyleScopedClasses['tabs-dropdown-icon']} */ ;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.HoverAnimateWrapper | typeof __VLS_components.HoverAnimateWrapper} */
HoverAnimateWrapper;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    name: "rubber",
}));
const __VLS_64 = __VLS_63({
    name: "rubber",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.IconButton} */
IconButton;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    icon: "HOutline:EllipsisHorizontalIcon",
    size: "1.75rem",
}));
const __VLS_70 = __VLS_69({
    icon: "HOutline:EllipsisHorizontalIcon",
    size: "1.75rem",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
// @ts-ignore
[];
var __VLS_65;
{
    const { dropdown: __VLS_73 } = __VLS_59.slots;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({}));
    const __VLS_76 = __VLS_75({}, ...__VLS_functionalComponentArgsRest(__VLS_75));
    const { default: __VLS_79 } = __VLS_77.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:MinusCircleIcon']),
    }));
    const __VLS_82 = __VLS_81({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:MinusCircleIcon']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    let __VLS_85;
    const __VLS_86 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.tabsStore.closeOtherTabs(__VLS_ctx.tabsStore.activePath);
            // @ts-ignore
            [tabsStore, tabsStore, menuStore,];
        },
    };
    const { default: __VLS_87 } = __VLS_83.slots;
    (__VLS_ctx.$t('layout.closeOtherTabs'));
    // @ts-ignore
    [$t,];
    var __VLS_83;
    var __VLS_84;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:TrashIcon']),
    }));
    const __VLS_90 = __VLS_89({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:TrashIcon']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    const __VLS_94 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            (__VLS_ctx.tabsStore.closeAllTabs(), __VLS_ctx.router.push(__VLS_ctx.tabsStore.activePath));
            // @ts-ignore
            [tabsStore, tabsStore, menuStore, router,];
        },
    };
    const { default: __VLS_95 } = __VLS_91.slots;
    (__VLS_ctx.$t('layout.closeAllTabs'));
    // @ts-ignore
    [$t,];
    var __VLS_91;
    var __VLS_92;
    let __VLS_96;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:ChevronDoubleRightIcon']),
    }));
    const __VLS_98 = __VLS_97({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:ChevronDoubleRightIcon']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_97));
    let __VLS_101;
    const __VLS_102 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.tabsStore.closeRightTabs(__VLS_ctx.tabsStore.activePath);
            // @ts-ignore
            [tabsStore, tabsStore, menuStore,];
        },
    };
    const { default: __VLS_103 } = __VLS_99.slots;
    (__VLS_ctx.$t('layout.closeRightTabs'));
    // @ts-ignore
    [$t,];
    var __VLS_99;
    var __VLS_100;
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
    elDropdownItem;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:ChevronDoubleLeftIcon']),
    }));
    const __VLS_106 = __VLS_105({
        ...{ 'onClick': {} },
        icon: (__VLS_ctx.menuStore.iconComponents['HOutline:ChevronDoubleLeftIcon']),
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    let __VLS_109;
    const __VLS_110 = {
        ...{ click: {} },
        onClick: (...[$event]) => {
            __VLS_ctx.tabsStore.closeLeftTabs(__VLS_ctx.tabsStore.activePath);
            // @ts-ignore
            [tabsStore, tabsStore, menuStore,];
        },
    };
    const { default: __VLS_111 } = __VLS_107.slots;
    (__VLS_ctx.$t('layout.closeLeftTabs'));
    // @ts-ignore
    [$t,];
    var __VLS_107;
    var __VLS_108;
    // @ts-ignore
    [];
    var __VLS_77;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_59;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
